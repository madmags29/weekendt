from fastapi import FastAPI
from mangum import Mangum

app = FastAPI(title="Weekend Traveller API - Minimal Test")

@app.get("/")
def read_root():
    return {"message": "Hello from serverless function"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "mode": "minimal_test"}

# Mangum handler for Vercel serverless
handler = Mangum(app)
