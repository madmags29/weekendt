from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables
api_dir = Path(__file__).resolve().parent
env_path = api_dir / '.env'
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from app.routers import search
from app.services.ai_service import get_recommendations
from app.services.media_service import fetch_destination_videos
from app.schemas import RecommendationResponse

app = FastAPI(title="Weekend Traveller AI Search Engine")

# CORS configuration - allow all origins for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for serverless deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Weekend Traveller AI Search Engine API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "mode": "serverless_fastapi"}

# Include search router
app.include_router(search.router, prefix="/api")

@app.get("/api/background-videos")
async def get_background_videos():
    """Fetch cinematic background videos for the landing page."""
    try:
        videos = await fetch_destination_videos("Travel wanderlust nature cinematic", per_page=40)
        if not videos:
            return [{
                "url": "https://videos.pexels.com/video-files/855018/855018-hd_1920_1080_30fps.mp4",
                "credit": "Pexels",
                "source": "Pexels"
            }]
        return videos
    except Exception as e:
        print(f"Error fetching background videos: {e}")
        return [{
            "url": "https://videos.pexels.com/video-files/855018/855018-hd_1920_1080_30fps.mp4",
            "credit": "Pexels",
            "source": "Pexels"
        }]

@app.get("/api/recommendations", response_model=RecommendationResponse)
async def fetch_recommendations(lat: float, lng: float):
    """Get AI recommendations based on user location."""
    return await get_recommendations(lat, lng)

# Mangum handler for AWS Lambda/Vercel serverless
handler = Mangum(app)

