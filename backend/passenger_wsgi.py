import os
import sys

# Add the project directory to the sys.path
sys.path.insert(0, os.path.dirname(__file__))

# Fallback for local development where code is in 'backend/'
if os.path.exists(os.path.join(os.path.dirname(__file__), "backend")):
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

# Import the FastAPI application
# 'app.main' corresponds to app/main.py. 
# 'application' is the default callable that Passenger looks for.
from app.main import app as application
