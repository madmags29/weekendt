from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import search

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router)

@app.get("/")
def read_root():
    return {"message": "Weekend Traveller API"}

# Vercel serverless handler
handler = app
