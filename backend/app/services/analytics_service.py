import datetime
from app.db import get_db_connection
import re

async def log_page_view_to_db(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Simple User Agent parsing
    ua = data.get("user_agent", "")
    os = "Unknown"
    device = "Desktop"
    
    if "Mobile" in ua or "Android" in ua or "iPhone" in ua:
        device = "Mobile"
    
    if "Windows" in ua: os = "Windows"
    elif "Mac" in ua: os = "MacOS"
    elif "Linux" in ua: os = "Linux"
    elif "Android" in ua: os = "Android"
    elif "iOS" in ua or "iPhone" in ua: os = "iOS"
        
    cursor.execute("""
        INSERT INTO page_views (url, referrer, user_agent, ip_address, country, device_type, os)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("url"),
        data.get("referrer"),
        ua,
        data.get("ip_address"),
        data.get("country", "Unknown"),
        device,
        os
    ))
    conn.commit()
    conn.close()

async def log_search_to_db(query: str, origin: str, destination: str, user_agent: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO searches (query, origin, destination, user_agent)
        VALUES (?, ?, ?, ?)
    """, (query, origin, destination, user_agent))
    conn.commit()
    conn.commit()
    conn.close()

async def log_event_to_db(event_name: str, event_data: str, url: str, user_agent: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO events (event_name, event_data, url, user_agent)
        VALUES (?, ?, ?, ?)
    """, (event_name, event_data, url, user_agent))
    conn.commit()
    conn.close()

async def get_dashboard_stats_service():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Total Searches
    total_searches = cursor.execute("SELECT COUNT(*) FROM searches").fetchone()[0]
    
    # 2. Active Users (Last 30 mins) - Approximation based on unique IPs or sessions
    cursor.execute("SELECT COUNT(DISTINCT ip_address) FROM page_views WHERE timestamp >= datetime('now', '-30 minutes')")
    active_users = cursor.fetchone()[0]
    
    # 3. Top Keywords (Destinations from searches)
    cursor.execute("SELECT destination, COUNT(*) as count FROM searches WHERE destination IS NOT NULL GROUP BY destination ORDER BY count DESC LIMIT 5")
    top_destinations = [{"name": row[0], "count": row[1]} for row in cursor.fetchall()]

    # 4. Device Breakdown
    cursor.execute("SELECT device_type, COUNT(*) as count FROM page_views GROUP BY device_type")
    device_stats = [{"name": row[0], "value": row[1]} for row in cursor.fetchall()]
    
    # 5. OS Breakdown
    cursor.execute("SELECT os, COUNT(*) as count FROM page_views GROUP BY os")
    os_stats = [{"name": row[0], "value": row[1]} for row in cursor.fetchall()]

    # 6. Hourly Traffic (Last 24h)
    cursor.execute("""
        SELECT strftime('%H', timestamp) as hour, COUNT(*) as count 
        FROM page_views 
        WHERE timestamp >= datetime('now', '-1 day') 
        GROUP BY hour
        ORDER BY hour
    """)
    traffic_data = [{"hour": row[0], "visits": row[1]} for row in cursor.fetchall()]
    
    traffic_data = [{"hour": row[0], "visits": row[1]} for row in cursor.fetchall()]

    # 7. Top Events
    try:
        cursor.execute("SELECT event_name, COUNT(*) as count FROM events GROUP BY event_name ORDER BY count DESC LIMIT 5")
        top_events = [{"name": row[0], "count": row[1]} for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error fetching top events: {e}")
        top_events = []
    
    conn.close()
    
    return {
        "total_searches": total_searches,
        "active_users": active_users,
        "top_keywords": top_destinations,
        "device_stats": device_stats,
        "os_stats": os_stats,
        "traffic_data": traffic_data,
        "top_events": top_events
    }
