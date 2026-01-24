# OpenAI Key Troubleshooting for cPanel

## Issue
OpenAI API key not loading in production environment on cPanel.

## Solution Applied

Updated `backend/app/main.py` to explicitly specify the `.env` file path:

```python
from pathlib import Path

# Get the backend directory path
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / '.env'

# Load environment variables from .env file
load_dotenv(dotenv_path=env_path)
```

## Verification Steps on Server

### 1. Check if .env file exists
```bash
ssh devde143@weekendtravellers.com
cd /home/devde143/repositories/weekendtravellers.com/backend
ls -la .env
```

### 2. Verify .env file permissions
```bash
chmod 600 .env
```

### 3. Check if environment variable is loaded
Create a test endpoint to verify (temporary):

```python
@app.get("/test-env")
def test_env():
    import os
    key = os.environ.get("OPENAI_API_KEY")
    return {
        "key_exists": key is not None,
        "key_length": len(key) if key else 0,
        "key_prefix": key[:10] if key else "None"
    }
```

Visit: `https://weekendtravellers.com/api/test-env`

### 4. Check Passenger logs
```bash
tail -f /home/devde143/logs/error_log
```

### 5. Restart application
```bash
cd /home/devde143/repositories/weekendtravellers.com
touch tmp/restart.txt
```

## Common Issues & Fixes

### Issue 1: .env file not uploaded
**Solution**: Verify `backend/.env` is in the `backend_bundle.zip` and was extracted

### Issue 2: Wrong file permissions
**Solution**: 
```bash
chmod 600 /home/devde143/repositories/weekendtravellers.com/backend/.env
```

### Issue 3: Python-dotenv not installed
**Solution**:
```bash
cd /home/devde143/repositories/weekendtravellers.com/backend
source venv/bin/activate
pip install python-dotenv
```

### Issue 4: Passenger not restarting
**Solution**:
```bash
touch /home/devde143/repositories/weekendtravellers.com/tmp/restart.txt
# Or restart via cPanel Python App interface
```

## Alternative: Set Environment Variables in cPanel

If the .env file approach doesn't work, you can set environment variables directly in cPanel:

1. Go to cPanel → "Setup Python App"
2. Click on your application
3. Scroll to "Environment variables"
4. Add:
   - Name: `OPENAI_API_KEY`
   - Value: `your-actual-openai-api-key-here`

5. Repeat for other API keys:
   - `PIXABAY_API_KEY`
   - `UNSPLASH_ACCESS_KEY`
   - `PEXELS_API_KEY`

6. Restart the application

## Testing

After deploying the fix, test the search functionality:
1. Go to https://weekendtravellers.com
2. Enter a search query (e.g., "Weekend trip to Goa")
3. Check if AI generates results
4. If it fails, check browser console and network tab for error messages
