#!/usr/bin/env python3
import os
import sys

# 1. Add the backend directory to sys.path
# We are in public_html/api.cgi, so backend is at ../backend from the server's perspective
# But locally we are in public/api.cgi, and backend is ../backend. logic holds.
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(os.path.dirname(current_dir), 'backend')
sys.path.insert(0, backend_dir)

# 2. Activate virtual environment
# We assume venv is at ../backend/venv
venv_path = os.path.join(backend_dir, "venv", "bin", "activate_this.py")
if os.path.exists(venv_path):
    with open(venv_path) as f:
        exec(f.read(), dict(__file__=venv_path))

# 3. Import the app and adapter
try:
    from app.main import app
    from a2wsgi import ASGIMiddleware
    from wsgiref.handlers import CGIHandler

    # 4. Wrap the ASGI app with WSGI middleware
    wsgi_app = ASGIMiddleware(app)

    # 5. Serve it via CGI
    if __name__ == "__main__":
        CGIHandler().run(wsgi_app)

except Exception as e:
    # Print errors to browser for easier debugging (remove in production if sensitive)
    print("Content-Type: text/plain\n")
    print("Error loading application:")
    print(str(e))
    import traceback
    traceback.print_exc()
