from pydantic import BaseModel
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str
    origin: Optional[str] = "Delhi"
    destination: Optional[str] = None
    budget: Optional[str] = None
    days: Optional[int] = 2
    travel_mode: Optional[str] = "flight" # flight, drive, train

class Coordinates(BaseModel):
    lat: float
    lng: float

class Sightseeing(BaseModel):
    time: str
    activity: str
    description: str
    coordinates: Optional[Coordinates] = None
    image_url: Optional[str] = None
    media_credit: Optional[str] = None
    nearby_attractions: Optional[List[str]] = None

class DayPlan(BaseModel):
    day: int
    activities: List[Sightseeing]

class RouteInfo(BaseModel):
    distance: str
    duration: str
    map_url: Optional[str] = None

class Hotel(BaseModel):
    name: str
    description: str
    price_range: str
    coordinates: Optional[Coordinates] = None

class Attraction(BaseModel):
    name: str
    description: str
    coordinates: Optional[Coordinates] = None

class OriginInfo(BaseModel):
    city_name: str
    description: str
    top_attractions: Optional[List[Attraction]] = None
    hotels: Optional[List[Hotel]] = None
    image_url: Optional[str] = None
    media_credit: Optional[str] = None

class TripPlan(BaseModel):
    destination: str
    best_time_to_visit: str
    estimated_budget: str
    route_info: RouteInfo
    itinerary: List[DayPlan]
    hotels: Optional[List[Hotel]] = None
    destination_info: Optional[OriginInfo] = None # Detailed info about the destination
    origin_info: Optional[OriginInfo] = None
    hero_image: Optional[str] = None
    hero_video: Optional[str] = None
    media_credit: Optional[str] = None # For Hero Image
    coordinates: Optional[Coordinates] = None
    origin_coordinates: Optional[Coordinates] = None

class Recommendation(BaseModel):
    name: str
    description: str
    image_url: Optional[str] = None
    media_credit: Optional[str] = None

class RecommendationResponse(BaseModel):
    destinations: List[Recommendation]
