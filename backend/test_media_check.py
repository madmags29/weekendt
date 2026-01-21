import asyncio
import os
from dotenv import load_dotenv

# Load env vars
load_dotenv()

from app.services.media_service import fetch_destination_images, fetch_destination_videos

async def main():
    print("--- Testing Media Service ---")
    
    # Test 1: Images
    query = "Goa beach"
    print(f"\n1. Fetching images for '{query}'...")
    try:
        images = await fetch_destination_images(query)
        if images:
            print(f"✅ Success! Found {len(images)} images.")
            print(f"Sample: {images[0]}")
        else:
            print("❌ Failed. No images found.")
            print(f"API Keys Present? Pexels: {bool(os.environ.get('PEXELS_API_KEY'))}, Unsplash: {bool(os.environ.get('UNSPLASH_ACCESS_KEY'))}, Pixabay: {bool(os.environ.get('PIXABAY_API_KEY'))}")
    except Exception as e:
        print(f"❌ Error fetching images: {e}")

    # Test 2: Videos
    v_query = "India monuments mountains nature green cinematic"
    print(f"\n2. Fetching videos for '{v_query}'...")
    try:
        videos = await fetch_destination_videos(v_query)
        if videos:
             print(f"✅ Success! Found {len(videos)} videos.")
             print(f"Sample: {videos[0]}")
        else:
             print("❌ Failed. No videos found.")
    except Exception as e:
         print(f"❌ Error fetching videos: {e}")

if __name__ == "__main__":
    asyncio.run(main())
