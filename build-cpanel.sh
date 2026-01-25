#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting cPanel Build Process..."

# 1. Clean previous build
echo "🧹 Cleaning up..."
rm -rf out
rm -f frontend_bundle.zip
rm -f backend_bundle.zip

# 2. Build Next.js Frontend (Static Export)
echo "🏗️  Building Frontend..."
npm run build

# Copy .htaccess to output directory
echo "📄 Copying .htaccess..."
cp public/.htaccess out/.htaccess
cp public/api.cgi out/api.cgi
chmod +x out/api.cgi

echo "📦 Zipping Frontend (ready for public_html)..."
cd out
zip -r ../frontend_bundle.zip .
cd ..

# 3. Package Backend
echo "🐍 Packaging Backend..."
# Package backend files (excluding venv - will be created on server)
zip -r backend_bundle.zip backend/app backend/requirements.txt backend/.env passenger_wsgi.py

echo "✅ Build Complete!"
echo "--------------------------------------------------------"
echo "📂 Output:"
echo "   - frontend_bundle.zip  -> Upload & extract to 'public_html'"
echo "   - backend_bundle.zip   -> Upload & extract to app root"
echo ""
echo "📝 Next Steps:"
echo "   1. Upload frontend_bundle.zip to public_html and extract"
echo "   2. Upload backend_bundle.zip to /home2/aceda53n/weekendtravellers.com and extract"
echo "   3. SSH into server and run: cd /home2/aceda53n/weekendtravellers.com/backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
echo "   4. Configure Passenger in cPanel to use passenger_wsgi.py"
echo "   5. Restart the application"
echo "--------------------------------------------------------"
