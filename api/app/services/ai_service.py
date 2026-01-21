import os
import json
from openai import AsyncOpenAI
from app.schemas import SearchRequest, TripPlan, RouteInfo, DayPlan, Sightseeing


def get_ai_client():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("WARNING: OPENAI_API_KEY not set")
        return None
    return AsyncOpenAI(api_key=api_key)


from app.services.media_service import fetch_destination_images, fetch_destination_videos

async def generate_trip_plan(request: SearchRequest) -> TripPlan:
    # Construct the prompt
    prompt = f"""
    You are an expert travel planner. The user has sent the following request:
    "{request.query}"

    Analyze the user's intent. They might mention a specific destination, a mood (e.g., "romantic", "adventure"), or a region.
    - Origin: {request.origin} (Default if not specified in query)
    - Days: {request.days} (Default if not specified)
    
    If the user's query implies a specific destination (e.g., "Trip to Goa"), use it.
    If the query is vague (e.g., "Beach trip"), select the BEST destination matching the vibe near the origin.
    
    Create a detailed weekend trip plan.
    Budget: {request.budget or 'Moderate'}
    Travel Mode: {request.travel_mode or 'flight'}
    
    Provide a realistic itinerary with specific activities, timings, best time to visit, estimated budget, and route info.
    
    CRITICAL REQUIREMENTS:
    1. For each 'Sightseeing' activity, provide a `description` that is AT LEAST 400 characters long (approx 5-6 sentences), offering rich historical, cultural, and practical context.
    2. For each activity, include a `nearby_attractions` list with 2-3 other interesting places within walking distance.
    3. Provide a `hotels` list with 3-4 recommended hotels at the DESTINATION, each with name, description, price_range (Budget/Mid-Range/Luxury), and GPS coordinates.
    4. Provide `destination_info` with details about the DESTINATION city including:
       - A 400+ character description of the destination city
       - `top_attractions`: 3-4 must-visit places in the destination (independent of itinerary) with descriptions and coordinates
       - `hotels`: (You can duplicate the destination hotels here or provide additional ones)
    5. You MUST provide valid GPS coordinates (lat/lng) for:
       - The main destination
       - The ORIGIN city (as 'origin_coordinates')
       - EVERY sightseeing activity
       - EVERY hotel
       - EVERY attraction in destination_info
    
    Ensure the response is strictly in the simplified JSON format required.
    """

    print(f"DEBUG: Generating plan for {request.destination}...")
    try:
        client = get_ai_client()
        if not client:
             raise Exception("OpenAI API Key not configured")

        completion = await client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "You are a travel assistant. Generate a structured trip plan."},
                {"role": "user", "content": prompt},
            ],
            response_format=TripPlan,
        )
        print("DEBUG: OpenAI response received and parsed.")
    except Exception as e:
        print(f"ERROR: OpenAI API failed: {e}")
        raise e

    trip_plan = completion.choices[0].message.parsed
    
    # Enrichment with Media
    try:
        # Fetch Hero Media
        images = await fetch_destination_images(trip_plan.destination)
        videos = await fetch_destination_videos(trip_plan.destination)
        
        if images:
            # images[0] is now a dict {url, credit, source}
            trip_plan.hero_image = images[0]["url"]
            trip_plan.media_credit = f"Photo by {images[0]['credit']} on {images[0]['source']}"
        else:
            # Fallback Hero
            trip_plan.hero_image = "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"
            
        if videos:
            trip_plan.hero_video = videos[0]["url"]
            # Video credit logic could be added here if schema supported it,
            # but currently we only added media_credit for the image mostly.
            
        # Fetch Activity Images
        for day in trip_plan.itinerary:
            for activity in day.activities:
                # Search for "Destination + Activity" to get relevant photos
                try:
                    # heuristic to clean activity names for better search
                    clean_activity = activity.activity.replace("Visit", "").replace("Explore", "").replace("Tour", "").replace("See", "").replace("Walk around", "").strip()
                    query = f"{trip_plan.destination} {clean_activity}"
                    
                    activity_images = await fetch_destination_images(query, per_page=3)
                    if activity_images:
                        activity.image_url = activity_images[0]["url"]
                        activity.media_credit = f"Photo by {activity_images[0]['credit']}"
                    else:
                        # Fallback: Try searching just the destination if specific activity fails? 
                        # Or maybe just the activity name without destination?
                        # Let's try just the activity name as a fallback if it's long enough
                        if len(clean_activity) > 5:
                             activity_images = await fetch_destination_images(clean_activity, per_page=3)
                             if activity_images:
                                 activity.image_url = activity_images[0]["url"]
                                 activity.media_credit = f"Photo by {activity_images[0]['credit']}"

                except Exception as e:
                    print(f"WARNING: Failed to fetch image for activity {activity.activity}: {e}")
                    # Fallback Image
                    activity.image_url = "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=400"
                    continue
                
                # Check if image was incorrectly skipped
                if not activity.image_url:
                     activity.image_url = "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=400"

        # Fetch Destination Info Image (was origin)
        if trip_plan.destination_info:
            try:
                dest_query = f"{trip_plan.destination} india travel landmarks"
                dest_images = await fetch_destination_images(dest_query, per_page=1)
                if dest_images:
                    trip_plan.destination_info.image_url = dest_images[0]["url"]
                    trip_plan.destination_info.media_credit = f"Photo by {dest_images[0]['credit']}"
            except Exception as e:
                print(f"WARNING: Failed to fetch image for destination info: {e}")

    except Exception as e:
        print(f"ERROR: Media enrichment failed completely: {e}")
        # We process without media rather than failing the request
        pass

    return trip_plan

from app.schemas import RecommendationResponse, Recommendation

async def get_recommendations(lat: float, lng: float) -> RecommendationResponse:
    prompt = f"""
    The user is located at GPS coordinates: {lat}, {lng}.
    Suggest 5 exciting weekend getaway destinations near this location (within 300km drive or short flight).
    
    For each destination, provide:
    - Name
    - A very short, punchy description (max 4 words, e.g., "Misty Hills & Tea", "Beaches & Nightlife").
    
    Return a STRICT JSON object with a list of destinations.
    """
    
    try:
        client = get_ai_client()
        if not client:
             return RecommendationResponse(destinations=[])

        completion = await client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "You are a local travel expert."},
                {"role": "user", "content": prompt},
            ],
            response_format=RecommendationResponse,
        )
        recommendations = completion.choices[0].message.parsed
        
        # Enrich with images
        for dest in recommendations.destinations:
            try:
                images = await fetch_destination_images(f"{dest.name} india travel", per_page=1)
                if images:
                    dest.image_url = images[0]["url"]
                    dest.media_credit = f"Photo by {images[0]['credit']}"
            except Exception as e:
                print(f"Failed to fetch image for rec {dest.name}: {e}")
                
        return recommendations
        
    except Exception as e:
        print(f"Error getting recommendations: {e}")
        # Fallback
        return RecommendationResponse(destinations=[])
