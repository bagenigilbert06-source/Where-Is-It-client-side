# Firebase + MongoDB Setup - Quick Start Guide

Your Lost & Found application uses Firebase for authentication and MongoDB for data storage. Follow this guide to get everything working.

## 📋 Quick Setup (5 Steps)

### Step 1: Copy Environment Template
```bash
cp .env.example .env.local
```

### Step 2: Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Project Settings** → **General**
4. Copy your web app config and paste into `.env.local`

### Step 3: Get MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Select your cluster → **Connect**
3. Copy connection string and paste into `.env.local` as `MONGODB_URI`

### Step 4: Set Up Backend
1. Get Firebase Service Account JSON (Project Settings → Service Accounts)
2. Add credentials to `.env.local`

### Step 5: Start Servers
```bash
# Terminal 1: Backend
pnpm install
pnpm run dev:backend

# Terminal 2: Frontend (new terminal)
pnpm run dev
```

Visit http://localhost:5173 and test authentication!

---

## 📚 Detailed Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete step-by-step setup instructions
- **[VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)** - Checklist to verify everything works
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions to common problems

---

## 🔧 Configuration Files

Your environment configuration is in `.env.local` (not included in git for security).

### Frontend Variables (VITE_*)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_API_URL=http://localhost:3001/api
```

### Backend Variables
```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
MONGODB_URI=mongodb+srv://username:password@cluster...
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Testing Your Setup

### 1. Run Configuration Validator
```bash
node scripts/validate-config.js
```
This checks all environment variables are set correctly.

### 2. System Diagnostics
Look for the ✅ or ⚠️ icon in bottom-right corner during development.
Click it to see:
- Firebase config status
- Backend connectivity
- Database connection
- Authentication state

### 3. Browser Console Logs
Look for `[v0]` prefixed messages showing:
```
[v0] AuthProvider mounted
[v0] Auth state changed: user@example.com
[v0] Token obtained for user
[v0] Google Sign-In successful
[v0] MongoDB sync successful
```

### 4. Test Email/Password Sign-In
1. Go to http://localhost:5173/signin
2. Create an account or sign in
3. Should redirect to home page

### 4. Test Google Sign-In
1. Click "Continue with Google"
2. Select your Google account
3. Should redirect to home page

### 5. Test MongoDB Data
1. Sign in successfully
2. Go to MongoDB Atlas → Collections
3. Check `users` collection contains your user

---

## 🚨 Common Issues

### "Firebase configuration is incomplete"
→ Check all `VITE_` variables are in `.env.local`

### "Google Sign-In popup blocked"
→ Allow popups for localhost:5173 in browser settings

### "Cannot connect to backend"
→ Make sure backend is running: `pnpm run dev:backend`

### "MongoDB connection error"
→ Check IP allowlist in MongoDB Atlas (Network Access)

### "Token verification failed"
→ Make sure `FIREBASE_PRIVATE_KEY` has correct newlines

**See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.**

---

## 🌍 Deployment

Before deploying to production:

1. ✅ Update `VITE_API_URL` to your production backend
2. ✅ Add your domain to Firebase authorized domains
3. ✅ Update `FRONTEND_URL` in backend config
4. ✅ Ensure MongoDB Atlas IP allowlist includes your servers
5. ✅ Set environment variables in your hosting platform

See [SETUP_GUIDE.md - Production Deployment](./SETUP_GUIDE.md#production-deployment) for details.

---

## 📖 What Happens When You Sign In

### Email/Password Flow
1. User enters email and password
2. Firebase validates credentials
3. User logged in locally
4. Backend verifies token
5. User data synced to MongoDB
6. App redirects to home page

### Google Sign-In Flow
1. User clicks "Continue with Google"
2. Google popup opens
3. User selects account
4. Firebase authenticates
5. Backend verifies token
6. User data synced to MongoDB
7. App redirects to home page

---

## 🔐 Security Notes

- `.env.local` is **NOT** committed to git (see `.gitignore`)
- Private keys are never exposed to frontend
- All API calls include authorization token
- MongoDB uses connection string authentication
- Tokens expire after 1 hour (sign in again)

---

## 📞 Getting Help

1. **Check the logs**: 
   - Browser console: Look for `[v0]` messages
   - Backend terminal: Look for `[Backend]` messages

2. **Run diagnostics**:
   - Click ⚠️ icon for system status
   - Or: `node scripts/validate-config.js`

3. **Read documentation**:
   - [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
   - [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) - Verify setup

4. **External resources**:
   - [Firebase Documentation](https://firebase.google.com/docs)
   - [MongoDB Documentation](https://docs.mongodb.com)
   - [Express.js Documentation](https://expressjs.com)

---

## 🎯 Next Steps

- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Firebase credentials to `.env.local`
- [ ] Add MongoDB connection string to `.env.local`
- [ ] Run `node scripts/validate-config.js`
- [ ] Start backend: `pnpm run dev:backend`
- [ ] Start frontend: `pnpm run dev`
- [ ] Test sign-in at http://localhost:5173/signin
- [ ] Verify user in MongoDB Atlas
- [ ] Read [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) to confirm everything works

---

Happy coding! 🚀

Last updated: 2026-03-22
