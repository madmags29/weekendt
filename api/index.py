import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from app.routers import search, trips
from app.services.ai_service import get_recommendations
from app.services.media_service import fetch_destination_videos
from app.schemas import RecommendationResponse
from app.config.database import connect_to_mongo, close_mongo_connection

app = FastAPI(title="Weekend Traveller AI Search Engine")

# MongoDB connection - Initialize on first request (serverless compatible)
_db_initialized = False

async def ensure_db_connection():
    global _db_initialized
    if not _db_initialized:
        await connect_to_mongo()
        _db_initialized = True

# CORS configuration - allow all origins for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for serverless deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    await ensure_db_connection()
    return {"message": "Welcome to Weekend Traveller AI Search Engine API"}

@app.get("/api/health")
async def health_check():
    await ensure_db_connection()
    return {"status": "ok", "mode": "serverless_fastapi", "database": "mongodb"}

# Include search router
app.include_router(search.router, prefix="/api")

# Include trips router for MongoDB operations
app.include_router(trips.router, prefix="/api")

@app.get("/api/background-videos")
async def get_background_videos():
    """Fetch cinematic background videos for the landing page."""
    await ensure_db_connection()
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
    await ensure_db_connection()
    return await get_recommendations(lat, lng)

# Mangum handler for AWS Lambda/Vercel serverless
handler = Mangum(app)
