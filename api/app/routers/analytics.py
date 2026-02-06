from fastapi import APIRouter, Request, BackgroundTasks
from app.services.analytics_service import log_page_view_to_db, get_dashboard_stats_service, log_event_to_db
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json

router = APIRouter(prefix="/analytics", tags=["analytics"])

class PageView(BaseModel):
    url: str
    referrer: Optional[str] = None
    
class EventTrack(BaseModel):
    event_name: str
    event_data: Optional[Dict[str, Any]] = None
    url: str

@router.post("/track")
async def track_page_view(payload: PageView, request: Request, background_tasks: BackgroundTasks):
    data = {
        "url": payload.url,
        "referrer": payload.referrer,
        "user_agent": request.headers.get("user-agent"),
        "ip_address": request.client.host,
        "country": "Unknown" # In production, use GeoIP or Cloudflare headers like 'cf-ipcountry'
    }
    # Log in background to not block response
    background_tasks.add_task(log_page_view_to_db, data)
    return {"status": "ok"}

@router.post("/event")
async def track_event(payload: EventTrack, request: Request, background_tasks: BackgroundTasks):
    # Log in background
    event_data_str = json.dumps(payload.event_data) if payload.event_data else None
    user_agent = request.headers.get("user-agent") or "Unknown"
    
    background_tasks.add_task(
        log_event_to_db, 
        event_name=payload.event_name, 
        event_data=event_data_str, 
        url=payload.url, 
        user_agent=user_agent
    )
    return {"status": "ok"}

@router.get("/dashboard")
async def get_dashboard_stats():
    return await get_dashboard_stats_service()
