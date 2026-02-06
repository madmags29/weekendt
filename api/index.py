import sys
import os

# Add the current directory to sys.path to allow imports from local files
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

# Initialize Error State
IMPORT_ERROR = None
search = None
RecommendationResponse = None
fetch_destination_videos = None
get_recommendations = None

# Try Import all modules
try:
    from app.routers import search
    from app.schemas import RecommendationResponse
    from app.services.media_service import fetch_destination_videos
    from app.services.ai_service import get_recommendations
except Exception as e:
    IMPORT_ERROR = str(e)
    # create dummy objects or modules so app init doesn't crash immediately?
    # but we can't really run. we just want health check to pass.

# Initialize FastAPI app
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

@app.get("/background-videos")
async def get_background_videos():
    """Fetch cinematic background videos for the landing page."""
    if IMPORT_ERROR:
        return ["https://cdn.pixabay.com/video/2020/01/05/30902-383794165_large.mp4"]
        
    # We fetch a large pool and let the frontend randomise
    try:
        videos = await fetch_destination_videos("Travel wanderlust nature cinematic", per_page=40)
        if not videos:
            return ["https://cdn.pixabay.com/video/2020/01/05/30902-383794165_large.mp4"]
        return videos
    except Exception as e:
        print(f"Error fetching background videos: {e}")
        return ["https://cdn.pixabay.com/video/2020/01/05/30902-383794165_large.mp4"]

@app.get("/recommendations")
async def fetch_recommendations(lat: float, lng: float):
    """Get AI recommendations based on user location."""
    if IMPORT_ERROR:
        return {"destinations": []}
    return await get_recommendations(lat, lng)

# Mount endpoints only if search router is available
if search:
    app.include_router(search.router, prefix="/api")
    app.include_router(search.router) # local mount

# Special handling for explicit routes to also work under /api prefix manually if needed
@app.get("/api/background-videos")
async def get_background_videos_api():
    return await get_background_videos()

@app.get("/api/recommendations")
async def fetch_recommendations_api(lat: float, lng: float):
    return await fetch_recommendations(lat, lng)

@app.get("/api/health")
def health_check():
    return {
        "status": "ok" if not IMPORT_ERROR else "error",
        "import_error": IMPORT_ERROR,
        "openai_check": "OPENAI_API_KEY" in os.environ,
        "pexels_check": "PEXELS_API_KEY" in os.environ,
        "pixabay_check": "PIXABAY_API_KEY" in os.environ
    }

@app.get("/")
def read_root():
    if IMPORT_ERROR:
        return {"message": "Weekend Traveller API - ERROR", "details": IMPORT_ERROR}
    return {"message": "Weekend Traveller API"}

# Mangum Handler
handler = Mangum(app)
