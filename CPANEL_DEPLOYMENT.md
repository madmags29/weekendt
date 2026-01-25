# Weekend Travellers - CPanel Shared Hosting Deployment Guide

Complete guide for deploying the Weekend Travellers application to cPanel shared hosting at `/home/devde143/repositories/weekendtravellers.com`.

## 📋 Prerequisites

- cPanel account with SSH access
- Python 3.9+ support (verify with hosting provider)
- Node.js installed locally for building the frontend
- Domain: `weekendtravellers.com` pointed to your cPanel hosting

## 🏗️ Architecture Overview

The application consists of two parts:

1. **Frontend**: Next.js static export (HTML/CSS/JS files)
2. **Backend**: FastAPI Python application running via Passenger WSGI

### Directory Structure on Server

```
/home/devde143/repositories/weekendtravellers.com/
├── public_html/              # Frontend static files
│   ├── _next/
│   ├── index.html
│   ├── .htaccess            # URL rewriting for SPA
│   └── ...
├── backend/                  # Backend Python application
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── services/
│   │   └── schemas.py
│   ├── .env                 # Environment variables
│   ├── requirements.txt
│   └── venv/                # Python virtual environment
├── passenger_wsgi.py        # Passenger entry point
└── tmp/                     # Passenger restart trigger
```

## 🚀 Deployment Steps

### Step 1: Build the Application Locally

```bash
# Navigate to project directory
cd /Users/zyppelectric/weekend-t

# Run the build script
chmod +x build-cpanel.sh
./build-cpanel.sh
```

This creates two files:
- `frontend_bundle.zip` - Frontend static files
- `backend_bundle.zip` - Backend application files

### Step 2: Upload Frontend to cPanel

1. Log into cPanel File Manager
2. Navigate to `public_html/`
3. **Delete all existing files** in `public_html/` (or backup first)
4. Upload `frontend_bundle.zip`
5. Extract the zip file
6. Verify `.htaccess` file is present in `public_html/`

### Step 3: Upload Backend to Server

1. In cPanel File Manager, navigate to `/home/devde143/repositories/weekendtravellers.com/`
2. Upload `backend_bundle.zip`
3. Extract the zip file
4. Verify the following structure exists:
   ```
   /home/devde143/repositories/weekendtravellers.com/
   ├── backend/
   ├── passenger_wsgi.py
   ```

### Step 4: Set Up Python Environment (via SSH)

```bash
# SSH into your server
ssh devde143@weekendtravellers.com

# Navigate to project directory
cd /home/devde143/repositories/weekendtravellers.com

# Create Python virtual environment
cd backend
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Verify installation
python -c "import fastapi; print('FastAPI installed successfully')"
```

### Step 5: Configure Environment Variables

Edit `backend/.env` file and ensure all API keys are set:

```bash
OPENAI_API_KEY=your-actual-openai-key
PIXABAY_API_KEY=your-actual-pixabay-key
UNSPLASH_ACCESS_KEY=your-actual-unsplash-key
PEXELS_API_KEY=your-actual-pexels-key
NEXT_PUBLIC_API_URL=https://weekendtravellers.com/api
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### Step 6: Configure Passenger in cPanel

1. In cPanel, go to **"Setup Python App"** or **"Application Manager"**
2. Click **"Create Application"**
3. Configure as follows:
   - **Python Version**: 3.9 or higher
   - **Application Root**: `/home/devde143/repositories/weekendtravellers.com`
   - **Application URL**: `/api` (or configure subdomain)
   - **Application Startup File**: `passenger_wsgi.py`
   - **Application Entry Point**: `application`
4. Click **"Create"**

### Step 7: Configure URL Mapping

You need to map URLs so that:
- `https://weekendtravellers.com/*` → serves frontend from `public_html/`
- `https://weekendtravellers.com/api/*` → routes to Python backend

**Option A: Using .htaccess in public_html**

Add to the top of `public_html/.htaccess`:

```apache
# Proxy API requests to Python backend
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:PORT/api/$1 [P,L]
```

Replace `PORT` with the port assigned by Passenger (check in cPanel Python App settings).

**Option B: Using Subdomain**

Create a subdomain `api.weekendtravellers.com` and point it to the Python application. Then update:
- `backend/.env`: `NEXT_PUBLIC_API_URL=https://api.weekendtravellers.com`
- `backend/app/main.py`: Add `https://api.weekendtravellers.com` to CORS origins

### Step 8: Restart the Application

```bash
# Via SSH
cd /home/devde143/repositories/weekendtravellers.com
mkdir -p tmp
touch tmp/restart.txt
```

Or use the **"Restart"** button in cPanel's Python App interface.

## ✅ Verification

### 1. Check Frontend

Visit: `https://weekendtravellers.com`

You should see the landing page with:
- Background video
- Search interface
- "Plan Your Weekend" heading

### 2. Check Backend API

Visit: `https://weekendtravellers.com/api` (or your configured API URL)

You should see:
```json
{"message": "Welcome to Weekend Traveller AI Search Engine API"}
```

### 3. Test Full Functionality

1. Enter a search query (e.g., "Weekend trip from Delhi")
2. Verify the AI generates trip recommendations
3. Check that images load correctly
4. Verify map displays properly
5. Check browser console for errors

## 🔧 Troubleshooting

### Frontend Issues

**Problem**: Page shows 404 or blank screen
- **Solution**: Verify `.htaccess` exists in `public_html/` and mod_rewrite is enabled

**Problem**: CSS/JS not loading
- **Solution**: Check file permissions (should be 644 for files, 755 for directories)

### Backend Issues

**Problem**: API returns 500 Internal Server Error
- **Solution**: Check error logs in cPanel or `/home/devde143/logs/`
- Verify all environment variables are set in `backend/.env`
- Ensure virtual environment is activated and dependencies installed

**Problem**: "Module not found" errors
- **Solution**: 
  ```bash
  cd /home/devde143/repositories/weekendtravellers.com/backend
  source venv/bin/activate
  pip install -r requirements.txt
  touch ../tmp/restart.txt
  ```

**Problem**: CORS errors in browser console
- **Solution**: Verify `weekendtravellers.com` is in the CORS origins list in `backend/app/main.py`

### Passenger Issues

**Problem**: Application won't start
- **Solution**: Check Passenger error logs in cPanel
- Verify `passenger_wsgi.py` has correct import path
- Ensure Python version matches requirements

## 🔄 Updating the Application

### Frontend Updates

```bash
# Local machine
cd /Users/zyppelectric/weekend-t
npm run build
cd out
zip -r frontend_update.zip .

# Upload to cPanel and extract in public_html/
```

### Backend Updates

```bash
# Local machine
cd /Users/zyppelectric/weekend-t
zip -r backend_update.zip backend/app

# Upload to server and extract
# Then restart via SSH:
ssh devde143@weekendtravellers.com
cd /home/devde143/repositories/weekendtravellers.com
touch tmp/restart.txt
```

## 📊 Performance Optimization

### Enable Caching

The `.htaccess` file already includes:
- GZIP compression for text files
- Browser caching for static assets (1 year for images, 1 month for CSS/JS)

### Monitor Resources

- Check CPU/Memory usage in cPanel
- Monitor API response times
- Set up uptime monitoring (e.g., UptimeRobot)

## 🔐 Security Checklist

- ✅ All API keys stored in `backend/.env` (not in code)
- ✅ `.env` file has restricted permissions (600)
- ✅ CORS configured to allow only your domain
- ✅ HTTPS enabled for entire site
- ✅ Regular backups configured in cPanel

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Review Passenger logs
3. Verify all environment variables
4. Contact hosting provider for server-specific issues

##  alternatif: CGI Deployment (Fallback)

If Passenger doesn't work, you can use the CGI script `api.cgi` in your public folder.

1.  **Frontend Bundle**: Upload `frontend_bundle.zip` to `public_html/` and extract.
2.  **Permissions**: Ensure `api.cgi` has 755 permissions.
    ```bash
    chmod 755 public_html/api.cgi
    ```
3.  **Config**: Update `.htaccess` in `public_html` to route API requests to this script.

    ```apache
    RewriteEngine On
    RewriteRule ^api/(.*)$ api.cgi/$1 [L,QSA]
    ```

4.  **Backend**: Upload `backend_bundle.zip` to `/home/devde143/repositories/weekendtravellers.com` (one level up from public_html) so the script can import it.


---

**Deployment Path**: `/home/devde143/repositories/weekendtravellers.com`  
**Domain**: `https://weekendtravellers.com`  
**Last Updated**: 2026-01-24
