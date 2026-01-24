# Quick Reference: CPanel Deployment

## File Locations

- **Frontend**: `/home/devde143/repositories/weekendtravellers.com/public_html/`
- **Backend**: `/home/devde143/repositories/weekendtravellers.com/backend/`
- **WSGI Entry**: `/home/devde143/repositories/weekendtravellers.com/passenger_wsgi.py`

## Quick Deploy Commands

### Build Locally
```bash
cd /Users/zyppelectric/weekend-t
./build-cpanel.sh
```

### Setup Backend (First Time Only)
```bash
ssh devde143@weekendtravellers.com
cd /home/devde143/repositories/weekendtravellers.com/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Restart Application
```bash
ssh devde143@weekendtravellers.com
touch /home/devde143/repositories/weekendtravellers.com/tmp/restart.txt
```

## URLs

- **Frontend**: https://weekendtravellers.com
- **API**: https://weekendtravellers.com/api
- **Health Check**: https://weekendtravellers.com/api/

## Environment Variables

Located in: `/home/devde143/repositories/weekendtravellers.com/backend/.env`

Required:
- `OPENAI_API_KEY`
- `PIXABAY_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `PEXELS_API_KEY`
- `NEXT_PUBLIC_API_URL=https://weekendtravellers.com/api`

## Troubleshooting

### Check Logs
- cPanel Error Logs
- `/home/devde143/logs/`

### Common Fixes
1. Restart: `touch tmp/restart.txt`
2. Reinstall deps: `pip install -r requirements.txt`
3. Check permissions: Files 644, Dirs 755
