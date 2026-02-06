from fastapi import APIRouter, HTTPException, Query
from app.services.trip_service import (
    save_trip, get_trip, get_all_trips, delete_trip, 
    save_search_history, get_search_history, get_trip_count
)
from app.schemas import TripPlan
from typing import Optional
from pydantic import BaseModel

router = APIRouter()

class SaveTripRequest(BaseModel):
    trip_plan: TripPlan
    origin: str
    days: int

class SaveTripResponse(BaseModel):
    trip_id: str
    message: str

@router.post("/trips", response_model=SaveTripResponse)
async def create_trip(request: SaveTripRequest):
    """Save a generated trip to the database"""
    try:
        trip_data = {
            "destination": request.trip_plan.destination,
            "origin": request.origin,
            "days": request.days,
            "trip_plan": request.trip_plan.dict()
        }
        trip_id = await save_trip(trip_data)
        
        # Also save to search history
        await save_search_history(
            query=request.trip_plan.destination,
            origin=request.origin,
            days=request.days
        )
        
        return SaveTripResponse(
            trip_id=trip_id,
            message="Trip saved successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving trip: {str(e)}")

@router.get("/trips")
async def list_trips(
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Get all saved trips with pagination"""
    try:
        trips = await get_all_trips(limit=limit, skip=skip)
        total = await get_trip_count()
        return {
            "trips": trips,
            "total": total,
            "limit": limit,
            "skip": skip
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trips: {str(e)}")

@router.get("/trips/{trip_id}")
async def get_trip_by_id(trip_id: str):
    """Get a specific trip by ID"""
    trip = await get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.delete("/trips/{trip_id}")
async def remove_trip(trip_id: str):
    """Delete a trip by ID"""
    deleted = await delete_trip(trip_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"message": "Trip deleted successfully"}

@router.get("/search-history")
async def get_recent_searches(limit: int = Query(20, ge=1, le=100)):
    """Get recent search history"""
    try:
        history = await get_search_history(limit=limit)
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching search history: {str(e)}")
