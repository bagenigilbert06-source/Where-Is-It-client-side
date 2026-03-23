# Environment Setup Guide

## Issue Fixed

The backend was looking for `.env.local` in the `backend/` directory, not the root. Now both locations have been configured.

## File Structure

```
campus-lost-found/
├── .env.local                    (root - optional, for frontend)
├── backend/
│   ├── .env.local               (backend - REQUIRED)
│   ├── src/
│   │   └── index.ts             (loads .env.local on startup)
│   └── package.json
├── src/                          (frontend)
└── package.json
```

## Backend .env.local (Already Configured)

Located at: `backend/.env.local`

**MongoDB Atlas Connection:**
```
MONGODB_URI=mongodb+srv://infocontactgillbertdev_db_user:2QdY0pPD7pPWteT5@cluster0.z51ck6.mongodb.net/campus-lost-found?retryWrites=true&w=majority
```

**What you need to update:**

1. **Firebase Configuration** - Replace with your Firebase credentials:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   ```

   To get these:
   - Go to Firebase Console → Project Settings
   - Service Accounts tab
   - Generate new private key
   - Copy the JSON values

2. **JWT Secret** - Change in production:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

3. **Email Configuration** (optional):
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password  # Use Gmail App Password, not main password
   ```

## How dotenv Works

When you run `pnpm run dev` from the backend folder, the app:

1. Checks if `NODE_ENV` is set
   - If `production`: loads `.env`
   - If not set or `development`: loads `.env.local`

2. Uses `path.resolve()` to find the file in the **current working directory**

3. Parses the file and sets `process.env.*` variables

## Starting the Backend

```bash
cd backend
pnpm run dev
```

You should see:
```
[Database] Connecting to MongoDB...
[Database] MongoDB connected successfully
[Database] Database: campus-lost-found
[Backend] Server running on port 3001
```

## Troubleshooting

### "MONGODB_URI is not set"
- Ensure `backend/.env.local` exists
- Verify you're running from the `backend` directory
- Check that the line `MONGODB_URI=...` is present

### "Firebase initialization failed"
- Update FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
- Get values from Firebase Console

### "Cannot connect to MongoDB"
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas (197.248.191.69 should be added)
- Test connection: `mongosh "mongodb+srv://user:password@cluster0..."`

## Environment Variables Summary

| Variable | Required | Example |
|----------|----------|---------|
| MONGODB_URI | Yes | `mongodb+srv://user:pass@cluster...` |
| FIREBASE_PROJECT_ID | Yes | `campus-lost-found` |
| FIREBASE_PRIVATE_KEY | Yes | `-----BEGIN PRIVATE KEY-----...` |
| FIREBASE_CLIENT_EMAIL | Yes | `firebase-adminsdk@...iam.gserviceaccount.com` |
| PORT | No | `3001` (default) |
| NODE_ENV | No | `development` or `production` |
| FRONTEND_URL | No | `http://localhost:5173` (default) |
| JWT_SECRET | No | Any string (should change in production) |
| SMTP_* | No | For email notifications |
