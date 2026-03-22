# Quick Start Guide

## URGENT: Fix MongoDB Connection Error

You're seeing this error:
```
MongoDB connection error: Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net
```

**This happens because `.env.local` is missing the `MONGODB_URI`.**

### Immediate Fix (2 minutes)

Choose ONE option:

#### Option A: MongoDB Atlas (Cloud) - Recommended
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create cluster (M0 free tier)
3. Create database user (username: `campuslostfound`, any password)
4. Whitelist IP: Add `0.0.0.0/0` in Network Access
5. Get connection string from "Connect" button
6. Edit `.env.local` and add:
   ```env
   MONGODB_URI=mongodb+srv://campuslostfound:YOUR_PASSWORD@cluster0.mongodb.net/campus-lost-found?retryWrites=true&w=majority
   ```
   **Replace `YOUR_PASSWORD` with your actual password**

#### Option B: Local MongoDB
1. Install: `brew install mongodb-community` (macOS) or see MongoDB docs
2. Start: `brew services start mongodb-community`
3. Edit `.env.local` and add:
   ```env
   MONGODB_URI=mongodb://localhost:27017/campus-lost-found
   ```

### Restart Backend
```bash
cd backend
pnpm run dev
```

You should now see:
```
[Database] Connecting to MongoDB...
[Database] MongoDB connected successfully
[Backend] Server running on port 3001
```

---

## Full Development Setup

### 1. Install Dependencies
```bash
cd backend
pnpm install
```

### 2. Configure Environment
- Copy `.env.local.example` to `.env.local`
- Fill in MongoDB URI (see above)
- Fill in Firebase credentials

### 3. Start Server
```bash
pnpm run dev
```

Server runs at: `http://localhost:3001`

### Test Backend

```bash
# Check health
curl http://localhost:3001/health

# Get all items
curl http://localhost:3001/api/items

# Create item (with Firebase token)
curl -X POST http://localhost:3001/api/items \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "Lost",
    "title": "Test Item",
    "description": "Test description",
    "category": "Electronics",
    "location": "Campus",
    "dateLost": "2024-01-15"
  }'
```

## Production Deployment (30 minutes)

### Step 1: Prepare Services
1. Create MongoDB Atlas cluster (5 min)
2. Get Firebase service account key (5 min)

### Step 2: Deploy Backend
1. Connect GitHub to Vercel (2 min)
2. Set environment variables (5 min)
3. Deploy (5 min)
4. Test endpoints (3 min)

### Step 3: Connect Frontend
1. Update REACT_APP_API_URL (1 min)
2. Redeploy frontend (4 min)

## Common Tasks

### Add New API Endpoint

1. Create route in `backend/src/routes/`
2. Create service in `backend/src/services/`
3. Add to main `index.ts`
4. Test with curl

### Modify Database Schema

1. Update model in `backend/src/models/`
2. Create migration script
3. Update services as needed
4. Test queries

### Deploy Changes

1. Push to GitHub
2. Vercel auto-deploys
3. Check deployment logs
4. Test in production

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | `lsof -ti:3001 \| xargs kill -9` |
| Module not found | `rm -rf node_modules && npm install` |
| MongoDB timeout | Check network access in Atlas |
| Firebase auth fails | Verify FIREBASE_PRIVATE_KEY format |
| CORS errors | Check FRONTEND_URL in .env |

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm test           # Run tests (when configured)
npm run lint       # Check code style
```

## Important Files

| File | Purpose |
|------|---------|
| backend/src/index.ts | Main application |
| backend/src/routes/ | API endpoints |
| backend/src/services/ | Business logic |
| backend/src/models/ | Database schemas |
| src/services/apiService.js | Frontend client |

## Key Endpoints

```
GET  /api/items              List items
POST /api/items              Create item (auth)
GET  /api/items/:id          Get item details
PUT  /api/items/:id          Update item (auth)
DELETE /api/items/:id        Delete item (auth)
POST /api/items/:id/claim    Claim item (auth)

GET  /api/search             Search items
GET  /api/search/nearby      Search by location

GET  /api/matches/item/:id   Get matches

GET  /api/auth/me            Get current user (auth)
PUT  /api/auth/profile       Update profile (auth)
PUT  /api/auth/notifications Update preferences (auth)

GET  /api/notifications/preferences    Get settings (auth)
PUT  /api/notifications/preferences    Update settings (auth)
GET  /api/notifications/history        Get history (auth)
```

## Environment Variables Quick Reference

```
# Server
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Firebase (from service account JSON)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=...@iam.gserviceaccount.com

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
```

## What's New in This Backend

1. **TypeScript** - Type safety throughout
2. **Modular Architecture** - Separate concerns clearly
3. **Service Layer** - Reusable business logic
4. **Better Error Handling** - Consistent error responses
5. **Matching Algorithm** - Intelligent item matching
6. **Email Notifications** - Automated emails
7. **Advanced Search** - Filter by multiple criteria
8. **Database Indexes** - Optimized queries
9. **Firebase Auth** - Secure token verification
10. **Vercel Ready** - Deploy to serverless

## Next Steps

1. Read `BACKEND_INTEGRATION_GUIDE.md`
2. Follow `DEPLOYMENT_GUIDE.md`
3. Review `BACKEND_ARCHITECTURE.md`
4. Check `backend/README.md` for details

## Support Files

- **IMPLEMENTATION_COMPLETE.md** - Full overview
- **BACKEND_ARCHITECTURE.md** - Technical details
- **BACKEND_INTEGRATION_GUIDE.md** - Frontend integration
- **DEPLOYMENT_GUIDE.md** - Production deployment
- **backend/README.md** - API reference

---

Ready to deploy? Start with the DEPLOYMENT_GUIDE.md!
