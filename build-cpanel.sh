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

echo "📦 Zipping Frontend (ready for public_html)..."
cd out
zip -r ../frontend_bundle.zip .
cd ..

# 3. Package Backend
echo "🐍 Packaging Backend..."
# Creating a zip of necessary backend files
# Assuming 'app' contains the python code and 'requirements.txt' is in root
zip -r backend_bundle.zip app requirements.txt passenger_wsgi.py backend/venv

echo "✅ Build Complete!"
echo "--------------------------------------------------------"
echo "📂 Output:"
echo "   - frontend_bundle.zip  -> Upload contents to 'public_html'"
echo "   - backend_bundle.zip   -> Upload to your app directory"
echo "--------------------------------------------------------"
