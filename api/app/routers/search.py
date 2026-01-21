from fastapi import APIRouter, HTTPException
from app.schemas import SearchRequest, TripPlan
from app.services.ai_service import generate_trip_plan

router = APIRouter()

@router.post("/search", response_model=TripPlan)
async def search_trips(request: SearchRequest):
    try:
        trip_plan = await generate_trip_plan(request)
        return trip_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
