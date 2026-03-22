# START HERE - Campus Lost & Found Setup

## You're Here Because...

Your backend is failing with this error:
```
MongoDB connection error: Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net
```

**Don't worry - this is a 5-minute fix!**

---

## Quick Fix (5 minutes)

### Step 1: Add MongoDB (Choose One)

**Option A - Cloud MongoDB (Recommended)**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster (M0 free)
4. Create user: campuslostfound / any-password
5. Whitelist IP: 0.0.0.0/0
6. Copy connection string
```

**Option B - Local MongoDB**
```
Mac: brew install mongodb-community && brew services start mongodb-community
Linux: sudo apt-get install mongodb && sudo systemctl start mongodb
```

### Step 2: Update .env.local

Create a file called `.env.local` in the project root with:

```env
# MongoDB - REQUIRED
MONGODB_URI=mongodb+srv://campuslostfound:YOUR_PASSWORD@cluster0.mongodb.net/campus-lost-found?retryWrites=true&w=majority

# Firebase - Copy from your Firebase Console
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Firebase Backend Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@iam.gserviceaccount.com

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Start Backend

```bash
cd backend
pnpm run dev
```

### Success! You should see:
```
[Backend] Connected to MongoDB
[Backend] Firebase initialized
[Backend] Server running on port 3001
```

---

## Documentation Guide

**Choose what you need:**

| Problem | Read This |
|---------|-----------|
| MongoDB won't connect | `FIX_MONGODB_ERROR.md` |
| Full MongoDB setup | `MONGODB_SETUP.md` |
| General quick start | `QUICK_START.md` |
| All about architecture | `PROJECT_STATUS.md` |
| Troubleshooting issues | `TROUBLESHOOTING.md` |
| Running diagnostics | `bash scripts/diagnose.sh` |

---

## Your Tech Stack

```
Frontend:
├── React 18
├── Vite (build tool)
├── React Router
├── TailwindCSS
└── Firebase Auth

Backend:
├── Node.js + TypeScript
├── Express.js
├── MongoDB
├── Firebase Admin SDK
├── Mongoose ORM
└── bcrypt (passwords)

Features:
├── User authentication (email/Google)
├── Lost & Found item posting
├── Intelligent matching
├── Real-time notifications
├── Search & filtering
└── User profiles
```

---

## Project Structure

```
project/
├── src/                          # Frontend (React)
│   ├── pages/                    # Pages (Signin, Home, etc)
│   ├── components/               # Reusable components
│   ├── context/                  # React Context (Auth)
│   └── services/                 # API calls
│
├── backend/                      # Backend (Node.js)
│   ├── src/
│   │   ├── routes/               # API endpoints
│   │   ├── services/             # Business logic
│   │   ├── models/               # Database schemas
│   │   ├── middleware/           # Auth, logging, etc
│   │   └── config/               # Firebase, MongoDB
│   └── package.json
│
├── public/                       # Static assets
├── .env.local                    # Your secrets (create this!)
├── package.json                  # Frontend dependencies
└── [documentation files]         # Guides like this one
```

---

## Common Tasks

### Run the app
```bash
# Terminal 1: Start backend
cd backend
pnpm run dev

# Terminal 2: Start frontend
pnpm run dev

# Open http://localhost:5173
```

### Check if backend is running
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok"}
```

### Test API endpoint
```bash
curl http://localhost:3001/api/items
```

### Check MongoDB connection
```bash
cd backend
pnpm run dev
# Look for: "[Database] MongoDB connected successfully"
```

---

## Environment Variables Explained

| Variable | What It Is | Where To Get |
|----------|-----------|--------------|
| `MONGODB_URI` | Database connection | MongoDB Atlas or local MongoDB |
| `FIREBASE_API_KEY` | Frontend Firebase key | Firebase Console → Project Settings |
| `FIREBASE_PROJECT_ID` | Project identifier | Firebase Console → Project Settings |
| `FIREBASE_PRIVATE_KEY` | Admin SDK key | Firebase → Service Accounts → Generate new key |
| `PORT` | Backend server port | Default: 3001 |
| `NODE_ENV` | Environment type | `development` or `production` |
| `FRONTEND_URL` | Frontend address | `http://localhost:5173` (dev) |

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process using port 3001
lsof -ti:3001 | xargs kill -9
```

### MongoDB connection fails
- See `FIX_MONGODB_ERROR.md`
- Run `bash scripts/diagnose.sh`

### Firebase auth not working
- Verify `FIREBASE_API_KEY` is correct
- Check Firebase Console → Authentication → Settings
- Ensure Google sign-in is enabled

### Port 5173 already in use
```bash
lsof -i :5173 | xargs kill -9
```

### Dependencies not found
```bash
# Frontend
pnpm install

# Backend
cd backend && pnpm install
```

---

## Next Steps

1. **Now**: Add MongoDB URI to `.env.local`
2. **Next**: Start backend `cd backend && pnpm run dev`
3. **Then**: Start frontend `pnpm run dev`
4. **Finally**: Go to `http://localhost:5173` and test signup

---

## Getting Help

| What You Need | Where To Look |
|---------------|---------------|
| MongoDB help | `MONGODB_SETUP.md` or `FIX_MONGODB_ERROR.md` |
| API endpoints | `backend/README.md` or `PROJECT_STATUS.md` |
| Architecture | `PROJECT_STATUS.md` or backend code |
| Deployment | `DEPLOYMENT_GUIDE.md` (when ready) |
| General issues | `TROUBLESHOOTING.md` |

---

## You've Got This!

Your setup is almost complete. Just need to add that MongoDB URI and you're ready to develop. If anything breaks, check the documentation links above - there's a guide for almost every issue.

**Questions?** Check `TROUBLESHOOTING.md` first, then the relevant documentation file.

Happy coding! 🚀
