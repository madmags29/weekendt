from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "mode": "minimal_fastapi"}

@app.get("/")
def read_root():
    return {"message": "Weekend Traveller API - Minimal FastAPI"}

handler = Mangum(app)
