# Weekend Traveller - Vercel Deployment

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/madmags29/weekendt)

## Environment Variables Required

Add these in Vercel Dashboard → Settings → Environment Variables:

```
OPENAI_API_KEY=your_openai_api_key
PIXABAY_API_KEY=your_pixabay_api_key
PEXELS_API_KEY=your_pexels_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

## Deployment Steps

1. **Fork/Clone this repository**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all 4 API keys listed above

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy both frontend and backend

## Architecture

- **Frontend**: Next.js 14 (deployed to Vercel Edge)
- **Backend**: FastAPI (deployed as Vercel Serverless Functions)
- **API Route**: `/api/*` routes to Python backend
- **Frontend**: All other routes serve Next.js app

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Features

- 🤖 AI-powered trip planning with OpenAI
- 🗺️ Interactive maps with Leaflet
- 📸 Rich media from Pexels, Unsplash, Pixabay
- 🏨 Hotel recommendations with price ranges
- 📝 400+ character activity descriptions
- 🌆 Origin city information
- 🎨 Beautiful glassmorphic UI

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **APIs**: OpenAI, Pexels, Unsplash, Pixabay
- **Maps**: Leaflet, OpenStreetMap
- **Deployment**: Vercel

## License

MIT
