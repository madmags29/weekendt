from dotenv import load_dotenv
import os
from pathlib import Path

# Get the backend directory path
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / '.env'

# Load environment variables from .env file
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import search

app = FastAPI(title="Weekend Traveller AI Search Engine")

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://weekendtravellers.com",
    "http://weekendtravellers.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Weekend Traveller AI Search Engine API"}

app.include_router(search.router)

from app.services.media_service import fetch_destination_videos

@app.get("/background-videos")
async def get_background_videos():
    """Fetch cinematic background videos for the landing page."""
    # We fetch a large pool and let the frontend randomise
    try:
        videos = await fetch_destination_videos("India monuments mountains nature green cinematic", per_page=40)
        if not videos:
            # Fallback
            return ["https://cdn.pixabay.com/video/2020/01/05/30902-383794165_large.mp4"]
        return videos
    except Exception as e:
        print(f"Error fetching background videos: {e}")
        return ["https://cdn.pixabay.com/video/2020/01/05/30902-383794165_large.mp4"]

from app.services.ai_service import get_recommendations
from app.schemas import RecommendationResponse

@app.get("/recommendations", response_model=RecommendationResponse)
async def fetch_recommendations(lat: float, lng: float):
    """Get AI recommendations based on user location."""
    return await get_recommendations(lat, lng)
