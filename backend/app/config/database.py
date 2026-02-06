from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
db = Database()

async def connect_to_mongo():
    """Connect to MongoDB database"""
    mongodb_url = os.getenv("MONGODB_URL")
    if not mongodb_url:
        raise ValueError("MONGODB_URL environment variable is not set")
    
    db.client = AsyncIOMotorClient(mongodb_url)
    print(f"✅ Connected to MongoDB")
    
async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("❌ Closed MongoDB connection")
    
def get_database():
    """Get database instance"""
    db_name = os.getenv("MONGODB_DB_NAME", "weekend_traveller")
    if not db.client:
        raise RuntimeError("Database not connected. Call connect_to_mongo() first.")
    return db.client[db_name]
