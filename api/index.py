import sys
import os

# Add the current directory to sys.path to allow imports from local files
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routers import search, analytics

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/debug-vars")
def debug_vars(request: Request):
    return {
        "headers": dict(request.headers),
        "url": str(request.url),
        "base_url": str(request.base_url),
        "path_params": request.path_params,
        "query_params": dict(request.query_params),
        "client_host": request.client.host if request.client else None
    }


# Mount api router
from app.schemas import RecommendationResponse
from app.services.media_service import fetch_destination_videos
from app.services.ai_service import get_recommendations

@app.get("/background-videos")
async def get_background_videos():
    """Fetch cinematic background videos for the landing page."""
    # We fetch a large pool and let the frontend randomise
    try:
        videos = await fetch_destination_videos("Travel wanderlust nature cinematic", per_page=40)
        if not videos:
            # Fallback
            return ["https://cdn.pixabay.com/video/2020/01/05/30902-383794165_large.mp4"]
        return videos
    except Exception as e:
        print(f"Error fetching background videos: {e}")
        return ["https://cdn.pixabay.com/video/2020/01/05/30902-383794165_large.mp4"]

@app.get("/recommendations", response_model=RecommendationResponse)
async def fetch_recommendations(lat: float, lng: float):
    """Get AI recommendations based on user location."""
    return await get_recommendations(lat, lng)

# Mount these endpoints with /api prefix as well for robust routing
app.include_router(search.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")

# Also mount without prefix for local testing or direct lambda invocation
app.include_router(search.router)

# Special handling for explicit routes to also work under /api prefix manually if needed
# But Vercel rewrite usually handles this. Let's explicitly add /api/background-videos just in case
@app.get("/api/background-videos")
async def get_background_videos_api():
    return await get_background_videos()

@app.get("/api/recommendations", response_model=RecommendationResponse)
async def fetch_recommendations_api(lat: float, lng: float):
    return await get_recommendations(lat, lng)

@app.get("/api/health")
def health_check():
    return {
        "status": "ok", 
        "openai_check": "OPENAI_API_KEY" in os.environ,
        "pexels_check": "PEXELS_API_KEY" in os.environ
    }

@app.get("/")
def read_root():
    return {"message": "Weekend Traveller API"}



from mangum import Mangum
handler = Mangum(app)
