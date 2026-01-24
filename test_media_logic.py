import asyncio
import os
import sys
from dotenv import load_dotenv

# Ensure we can import from backend
sys.path.append(os.path.abspath("backend"))

# Load env vars
load_dotenv("backend/.env")

from app.services.media_service import fetch_destination_videos

async def main():
    print("Fetching videos...")
    videos = await fetch_destination_videos("India monuments mountains nature green cinematic", per_page=5)
    
    print(f"\nFound {len(videos)} videos:")
    for v in videos:
        print(f"- {v['url']}")
        if "uhd" in v['url'] or "4k" in v['url']:
            print("  ⚠️  WARNING: UHD video detected!")
        else:
            print("  ✅  HD/SD video")

if __name__ == "__main__":
    asyncio.run(main())
