from app.config.database import get_database
from app.models.trip import TripDB, SearchHistoryDB
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

async def save_trip(trip_data: dict) -> str:
    """Save a trip to the database"""
    db = get_database()
    trip_data["created_at"] = datetime.utcnow()
    trip_data["updated_at"] = datetime.utcnow()
    result = await db.trips.insert_one(trip_data)
    return str(result.inserted_id)

async def get_trip(trip_id: str) -> Optional[dict]:
    """Get a trip by ID"""
    db = get_database()
    try:
        trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
        if trip:
            trip["_id"] = str(trip["_id"])
        return trip
    except Exception as e:
        print(f"Error fetching trip {trip_id}: {e}")
        return None

async def get_all_trips(limit: int = 50, skip: int = 0) -> List[dict]:
    """Get all trips with pagination"""
    db = get_database()
    trips = []
    cursor = db.trips.find().sort("created_at", -1).skip(skip).limit(limit)
    async for trip in cursor:
        trip["_id"] = str(trip["_id"])
        trips.append(trip)
    return trips

async def delete_trip(trip_id: str) -> bool:
    """Delete a trip by ID"""
    db = get_database()
    try:
        result = await db.trips.delete_one({"_id": ObjectId(trip_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error deleting trip {trip_id}: {e}")
        return False

async def update_trip(trip_id: str, update_data: dict) -> bool:
    """Update a trip by ID"""
    db = get_database()
    try:
        update_data["updated_at"] = datetime.utcnow()
        result = await db.trips.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error updating trip {trip_id}: {e}")
        return False

async def save_search_history(query: str, origin: Optional[str] = None, days: Optional[int] = None) -> str:
    """Save search history"""
    db = get_database()
    search_data = {
        "query": query,
        "origin": origin,
        "days": days,
        "timestamp": datetime.utcnow()
    }
    result = await db.search_history.insert_one(search_data)
    return str(result.inserted_id)

async def get_search_history(limit: int = 20) -> List[dict]:
    """Get recent search history"""
    db = get_database()
    history = []
    cursor = db.search_history.find().sort("timestamp", -1).limit(limit)
    async for item in cursor:
        item["_id"] = str(item["_id"])
        history.append(item)
    return history

async def get_trip_count() -> int:
    """Get total number of trips"""
    db = get_database()
    return await db.trips.count_documents({})
