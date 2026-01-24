# Weekend Travellers

AI-powered weekend trip planner for travelers in India.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Start backend (in another terminal)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Visit `http://localhost:3000`

## 📦 Deployment

### CPanel Shared Hosting

See **[CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)** for complete deployment guide.

**Quick Deploy:**
```bash
./build-cpanel.sh
```

This creates:
- `frontend_bundle.zip` → Upload to `public_html/`
- `backend_bundle.zip` → Upload to app root

See **[CPANEL_QUICK_REF.md](./CPANEL_QUICK_REF.md)** for quick reference.

### Vercel (Alternative)

```bash
npx vercel deploy --prod
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: FastAPI, Python 3.9+
- **AI**: OpenAI GPT
- **Maps**: Leaflet, React Leaflet
- **Media**: Pixabay, Unsplash, Pexels APIs

## 📝 Environment Variables

### Frontend (`.env.local` or `.env.production`)
```bash
NEXT_PUBLIC_API_URL=https://weekendtravellers.com/api
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### Backend (`backend/.env`)
```bash
OPENAI_API_KEY=your-key
PIXABAY_API_KEY=your-key
UNSPLASH_ACCESS_KEY=your-key
PEXELS_API_KEY=your-key
```

## 📂 Project Structure

```
weekend-t/
├── app/                    # Next.js pages
├── components/             # React components
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── main.py       # FastAPI app
│   │   ├── routers/      # API routes
│   │   └── services/     # Business logic
│   └── requirements.txt
├── public/               # Static assets
├── passenger_wsgi.py     # CPanel WSGI entry
└── build-cpanel.sh       # CPanel build script
```

## 🔧 Build Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `./build-cpanel.sh` - Build and package for cPanel

## 📖 Documentation

- [CPanel Deployment Guide](./CPANEL_DEPLOYMENT.md)
- [CPanel Quick Reference](./CPANEL_QUICK_REF.md)

## 🌐 Production URLs

- **Website**: https://weekendtravellers.com
- **API**: https://weekendtravellers.com/api

## 📄 License

Private project - All rights reserved
