import os
import sys

# Add the project directory to the sys.path
sys.path.insert(0, os.path.dirname(__file__))

# Import the FastAPI application from backend directory
# 'backend.app.main' corresponds to backend/app/main.py
# 'application' is the default callable that Passenger looks for.
from backend.app.main import app as application
