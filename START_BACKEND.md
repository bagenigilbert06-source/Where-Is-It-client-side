# Backend Ready to Run!

## Quickest Way to Start (Choose Your OS)

### 🐧 macOS/Linux:
```bash
cd backend
chmod +x start.sh
./start.sh
```

### 🪟 Windows:
```bash
cd backend
start.bat
```

### 🔧 Manual:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

## What Happens When You Run It

1. **Checks** Node.js and npm are installed
2. **Installs** all dependencies (Express, MongoDB, Firebase)
3. **Connects** to MongoDB database
4. **Initializes** Firebase authentication
5. **Starts** server on `http://localhost:3001`

---

## Verify Backend is Running

Visit: `http://localhost:3001/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-03-13T10:30:00.000Z"
}
```

---

## Before You Start - Setup Checklist

### ✓ MongoDB
- [ ] Local MongoDB installed OR
- [ ] MongoDB Atlas account created (free tier)
- [ ] Connection string ready

### ✓ Firebase
- [ ] Firebase project created
- [ ] Service account key downloaded
- [ ] Firebase credentials ready

### ✓ Environment
- [ ] .env file created with configuration
- [ ] All environment variables filled in

---

## After Backend Starts

### Test an Endpoint (in another terminal):
```bash
# Health check
curl http://localhost:3001/health

# Create an item (replace TOKEN with Firebase token)
curl -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Lost Keys","category":"accessories","description":"Silver keys","location":"Downtown"}'
```

### Start Frontend (in another terminal):
```bash
npm run dev
# Runs on http://localhost:5173
```

---

## Files Created

### Startup Scripts
- `start.sh` - macOS/Linux auto-start
- `start.bat` - Windows auto-start
- `.env.local` - Example environment file

### Documentation
- `GET_STARTED.md` - This quick start (5 min)
- `SETUP_AND_RUN.md` - Detailed setup (15 min)
- `../BACKEND_ARCHITECTURE.md` - Technical deep dive
- `../DEPLOYMENT_GUIDE.md` - Deploy to Vercel

### Backend Code
- `src/index.ts` - Main server
- `src/config/` - Database & Firebase setup
- `src/models/` - Data schemas
- `src/services/` - Business logic
- `src/routes/` - API endpoints
- `src/middleware/` - Auth, errors, logging

---

## API Endpoints Available

Once running, access these endpoints:

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/notifications
```

### Items
```
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
GET    /api/items/user/:userId
POST   /api/items/:id/claim-with-notification
```

### Search & Matching
```
GET    /api/search
GET    /api/matches
GET    /api/items/:id/matches
```

### Notifications
```
POST   /api/notifications/send-test
GET    /api/notifications/history
```

---

## Troubleshooting

### Backend won't start?
1. Check Node.js: `node --version`
2. Install deps: `npm install`
3. Check .env exists and is valid
4. Check MongoDB is running or Atlas is accessible

### Port 3001 in use?
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Can't connect to MongoDB?
- Local: Start MongoDB with `mongod`
- Atlas: Check connection string in .env

### Firebase errors?
- Verify .env has all Firebase fields
- No extra spaces or line breaks in keys
- Private key must be wrapped in quotes

---

## Need More Help?

- **Detailed Setup**: Read `SETUP_AND_RUN.md`
- **Architecture Overview**: Read `../BACKEND_ARCHITECTURE.md`
- **Frontend Integration**: Read `../BACKEND_INTEGRATION_GUIDE.md`
- **Deployment**: Read `../DEPLOYMENT_GUIDE.md`

---

## Success!

When you see this output, your backend is running:

```
[Backend] Initializing server...
[Backend] Connected to MongoDB
[Backend] Firebase initialized
[Backend] Server running on port 3001
[Backend] Environment: development
```

Now:
1. Start frontend: `npm run dev`
2. Test the app at `http://localhost:5173`
3. Backend automatically serves requests from port 3001
