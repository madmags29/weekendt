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
                     files = sorted(vid["video_files"], key=lambda x: x["width"] * x["height"], reverse=True)
                     if files:
                         results.append({
                             "url": files[0]["link"],
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
    return await fetch_from_pixabay(query, type="photo", per_page=per_page)

async def fetch_destination_videos(query: str, per_page: int = 3) -> List[Dict[str, str]]:
    """Aggregated Video Fetcher: Pexels -> Pixabay"""
    # 1. Try Pexels (Best Quality)
    videos = await fetch_from_pexels(query, type="videos", per_page=per_page)
    if videos: return videos
    
    # 2. Fallback to Pixabay
    return await fetch_from_pixabay(query, type="video", per_page=per_page)
