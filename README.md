# Weekend Traveller - AI-Powered Trip Planning

An intelligent weekend trip planning application powered by AI, featuring comprehensive destination details, interactive maps, and beautiful UI.

## Features

- 🤖 **AI-Powered Planning**: Generate detailed trip plans using OpenAI
- 📍 **Interactive Maps**: Explore destinations with rich popups showing images, descriptions, and nearby attractions
- 🏨 **Hotel Recommendations**: Get 3-4 hotel options with price ranges (Budget/Mid-Range/Luxury)
- 🌆 **Origin City Info**: Detailed information about your starting city with top attractions
- 📸 **Rich Media**: High-quality images from Pexels, Unsplash, and Pixabay
- 📝 **Detailed Descriptions**: 400+ character descriptions for every activity
- 🗺️ **Nearby Attractions**: Discover 2-3 interesting places near each activity
- 🎨 **Beautiful UI**: Glassmorphic dark theme with smooth animations

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Leaflet (Maps)
- Lucide Icons

### Backend
- FastAPI
- Python 3.9+
- OpenAI API
- Pexels API
- Unsplash API
- Pixabay API

## Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- API Keys for:
  - OpenAI
  - Pexels
  - Unsplash
  - Pixabay

### Installation

1. Clone the repository:
```bash
git clone https://github.com/madmags29/weekendt.git
cd weekendt
```

2. Setup Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Create `.env` file in backend directory:
```env
OPENAI_API_KEY=your_openai_key
PIXABAY_API_KEY=your_pixabay_key
PEXELS_API_KEY=your_pexels_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
```

4. Setup Frontend:
```bash
cd ../frontend
npm install
```

### Running Locally

1. Start Backend:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

2. Start Frontend:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `PIXABAY_API_KEY`
   - `PEXELS_API_KEY`
   - `UNSPLASH_ACCESS_KEY`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for trip generation | Yes |
| `PIXABAY_API_KEY` | Pixabay API key for images/videos | Yes |
| `PEXELS_API_KEY` | Pexels API key for high-quality media | Yes |
| `UNSPLASH_ACCESS_KEY` | Unsplash API key for photos | Yes |

## Features in Detail

### Trip Planning
- Natural language query processing
- Customizable budget and travel mode
- Multi-day itineraries with detailed activities
- GPS coordinates for all locations

### Media Integration
- Automatic image fetching for destinations and activities
- Video backgrounds for landing page
- Photo credits displayed for all media
- Fallback mechanisms across multiple providers

### Interactive Maps
- Hover-activated popups (stay open until closed)
- Activity markers with images and descriptions
- Origin city marker with attractions
- Route visualization between origin and destination

### User Experience
- Expandable descriptions with "Read more" buttons
- Collapsible itinerary sections
- Location-based recommendations
- Responsive design for all devices

## License

MIT

## Credits

Powered by Weekend Travellers
