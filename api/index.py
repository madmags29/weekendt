import sys
import os

# Add the current directory to sys.path to allow imports from local files
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import search

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount api router
app.include_router(search.router, prefix="/api")

# Also mount without prefix for local testing or direct lambda invocation
app.include_router(search.router)

@app.get("/")
def read_root():
    return {"message": "Weekend Traveller API"}

# Vercel serverless handler
handler = app
