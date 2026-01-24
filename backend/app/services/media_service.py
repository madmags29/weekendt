import httpx
import os
import random
from typing import List, Optional, Dict

PIXABAY_API_KEY = os.environ.get("PIXABAY_API_KEY")
PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY")
UNSPLASH_ACCESS_KEY = os.environ.get("UNSPLASH_ACCESS_KEY")

PIXABAY_BASE_URL = "https://pixabay.com/api/"
PEXELS_BASE_URL = "https://api.pexels.com/v1/"
UNSPLASH_BASE_URL = "https://api.unsplash.com/"

# Robust Static Fallbacks for when APIs fail
STATIC_FALLBACK_IMAGES = [
    {"url": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", "credit": "Unsplash", "source": "Static"},
    {"url": "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96", "credit": "Unsplash", "source": "Static"},
    {"url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb", "credit": "Unsplash", "source": "Static"},
    {"url": "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg", "credit": "Pexels", "source": "Static"},
    {"url": "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg", "credit": "Pexels", "source": "Static"}
]

STATIC_FALLBACK_VIDEOS = [
    {"url": "https://videos.pexels.com/video-files/4125028/4125028-hd_1920_1080_25fps.mp4", "credit": "Rostislav Uzunov", "source": "Pexels"},
    {"url": "https://videos.pexels.com/video-files/855018/855018-hd_1920_1080_30fps.mp4", "credit": "Pexels", "source": "Pexels"},
    {"url": "https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4", "credit": "Pexels", "source": "Pexels"}
]

async def fetch_from_pexels(query: str, type: str = "photos", per_page: int = 3) -> List[Dict[str, str]]:
    """Fetch media from Pexels (best quality)."""
    if not PEXELS_API_KEY:
        return []
    
    try:
        async with httpx.AsyncClient() as client:
            endpoint = "search" if type == "photos" else "videos/search"
            response = await client.get(
                f"{PEXELS_BASE_URL}{endpoint}",
                headers={"Authorization": PEXELS_API_KEY},
                params={"query": query, "per_page": per_page, "orientation": "landscape"},
                timeout=5.0
            )
            data = response.json()
            
            results = []
            if type == "photos":
                for photo in data.get("photos", []):
                    results.append({
                        "url": photo["src"]["large2x"],
                        "credit": photo["photographer"],
                        "source": "Pexels"
                    })
            else:
                for vid in data.get("videos", []):
                     # Smart Selection: Prioritize HD (1080p/720p) over 4K for better streaming
                     video_files = vid.get("video_files", [])
                     
                     # 1. Try to find 1080p or 720p (Width between 1280 and 1920)
                     hd_files = [v for v in video_files if 1280 <= v["width"] <= 1920]
                     
                     selected_file = None
                     if hd_files:
                         # Sort by size to get the highest bitrate/quality within HD range
                         hd_files.sort(key=lambda x: x["width"] * x["height"], reverse=True)
                         selected_file = hd_files[0]
                     elif video_files:
                         # Fallback: If no HD found, unfortunately take the largest available (likely SD or UHD)
                         # We sort to avoid picking tiny previews
                         video_files.sort(key=lambda x: x["width"] * x["height"], reverse=True)
                         selected_file = video_files[0]
                         
                     if selected_file:
                         results.append({
                             "url": selected_file["link"],
                             "credit": vid["user"]["name"],
                             "source": "Pexels"
                         })
            return results
    except Exception as e:
        print(f"Error fetching from Pexels for {query}: {e}")
        return []

async def fetch_from_unsplash(query: str, per_page: int = 3) -> List[Dict[str, str]]:
    """Fetch high-quality photos from Unsplash."""
    if not UNSPLASH_ACCESS_KEY:
        return []

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{UNSPLASH_BASE_URL}search/photos",
                headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
                params={"query": query, "per_page": per_page, "orientation": "landscape"},
                timeout=5.0
            )
            data = response.json()
            results = []
            for result in data.get("results", []):
                results.append({
                    "url": result["urls"]["regular"],
                    "credit": result["user"]["name"],
                    "source": "Unsplash"
                })
            return results
    except Exception as e:
        print(f"Error fetching from Unsplash for {query}: {e}")
        return []

async def fetch_from_pixabay(query: str, type: str = "photo", per_page: int = 3) -> List[Dict[str, str]]:
    """Fetch from Pixabay (Fallback)."""
    if not PIXABAY_API_KEY:
        return []

    try:
        async with httpx.AsyncClient() as client:
            # Photos
            if type == "photo":
                response = await client.get(
                    PIXABAY_BASE_URL,
                    params={
                        "key": PIXABAY_API_KEY, "q": query, "image_type": "photo",
                        "orientation": "horizontal", "per_page": per_page, "safesearch": "true"
                    }, timeout=5.0
                )
                data = response.json()
                results = []
                for hit in data.get("hits", []):
                    results.append({
                        "url": hit["webformatURL"],
                        "credit": hit["user"],
                        "source": "Pixabay"
                    })
                return results
            
            # Videos
            else:
                 response = await client.get(
                    f"{PIXABAY_BASE_URL}videos/",
                    params={
                        "key": PIXABAY_API_KEY, "q": query, "per_page": per_page, "safesearch": "true"
                    }, timeout=5.0
                )
                 data = response.json()
                 results = []
                 for hit in data.get("hits", []):
                     if "videos" in hit:
                         video_url = None
                         if "medium" in hit["videos"]: video_url = hit["videos"]["medium"]["url"]
                         elif "large" in hit["videos"]: video_url = hit["videos"]["large"]["url"]
                         
                         if video_url:
                             results.append({
                                 "url": video_url,
                                 "credit": hit["user"],
                                 "source": "Pixabay"
                             })
                 return results

    except Exception as e:
        print(f"Error fetching from Pixabay for {query}: {e}")
        return []

async def fetch_destination_images(query: str, per_page: int = 3) -> List[Dict[str, str]]:
    """Aggegated Image Fetcher: Pexels -> Unsplash -> Pixabay"""
    # 1. Try Pexels (Best Quality)
    images = await fetch_from_pexels(query, type="photos", per_page=per_page)
    if images: return images
    
    # 2. Try Unsplash (Great Quality)
    images = await fetch_from_unsplash(query, per_page=per_page)
    if images: return images
    
    # 3. Fallback to Pixabay
    pixabay_results = await fetch_from_pixabay(query, type="photo", per_page=per_page)
    if pixabay_results: return pixabay_results

    # 4. Ultimate Fallback: Static Images
    return [random.choice(STATIC_FALLBACK_IMAGES)]

async def fetch_destination_videos(query: str, per_page: int = 3) -> List[Dict[str, str]]:
    """Aggregated Video Fetcher: Pexels -> Pixabay"""
    # 1. Try Pexels (Best Quality)
    videos = await fetch_from_pexels(query, type="videos", per_page=per_page)
    if videos: return videos
    
    # 2. Fallback to Pixabay
    pixabay_results = await fetch_from_pixabay(query, type="video", per_page=per_page)
    if pixabay_results: return pixabay_results

    # 3. Ultimate Fallback: Static Videos
    return [random.choice(STATIC_FALLBACK_VIDEOS)]
