# Firebase + MongoDB Verification Checklist

Use this checklist to verify that everything is set up correctly before deploying.

## Environment Configuration

### Firebase Client Setup
- [ ] `VITE_FIREBASE_API_KEY` is set in `.env.local`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` is set
- [ ] `VITE_FIREBASE_PROJECT_ID` is set
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` is set
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` is set
- [ ] `VITE_FIREBASE_APP_ID` is set
- [ ] `VITE_API_URL` is set to `http://localhost:3001/api` (development)

### Firebase Admin Setup
- [ ] `FIREBASE_TYPE` is set to `service_account`
- [ ] `FIREBASE_PROJECT_ID` is set
- [ ] `FIREBASE_PRIVATE_KEY_ID` is set
- [ ] `FIREBASE_PRIVATE_KEY` is set with proper newlines
- [ ] `FIREBASE_CLIENT_EMAIL` is set
- [ ] `FIREBASE_CLIENT_ID` is set
- [ ] `FIREBASE_AUTH_URI` is set to `https://accounts.google.com/o/oauth2/auth`
- [ ] `FIREBASE_TOKEN_URI` is set to `https://oauth2.googleapis.com/token`

### MongoDB Setup
- [ ] `MONGODB_URI` is set with correct credentials
- [ ] Username and password in MongoDB URI match MongoDB Atlas user
- [ ] Database name is correct in MongoDB URI
- [ ] `?retryWrites=true&w=majority` parameters are present

### Server Configuration
- [ ] `PORT` is set to `3001`
- [ ] `NODE_ENV` is set to `development` (or appropriate for your environment)
- [ ] `FRONTEND_URL` is set to `http://localhost:5173` (development)

---

## Firebase Console Configuration

### Authentication
- [ ] Google Sign-In is enabled
- [ ] localhost:5173 is added to authorized domains
- [ ] Production domain is added (if applicable)
- [ ] At least one test user exists (created manually or via registration)

### Service Account
- [ ] Service account JSON has been generated
- [ ] Private key is safely stored and not committed to git
- [ ] Service account has Editor role (or necessary permissions)

---

## MongoDB Atlas Configuration

### Cluster Setup
- [ ] Cluster is created and running
- [ ] Cluster is in the correct region
- [ ] Free tier is sufficient for development (or upgrading to paid)

### Database User
- [ ] Username and password are set
- [ ] User has `readWriteAnyDatabase` role
- [ ] Password is safely stored (not committed to git)

### Network Access
- [ ] IP address 0.0.0.0/0 is allowed (development) or specific IP added
- [ ] Connection can be tested from local machine

### Connection String
- [ ] Format is `mongodb+srv://username:password@cluster.mongodb.net/database`
- [ ] Credentials are properly URL-encoded (use Atlas UI to copy)
- [ ] Database name is included

---

## Application Startup

### Backend Server
In terminal 1, run:
```bash
pnpm install
pnpm run dev:backend
```

Check for these messages:
- [ ] `[Backend] Connected to MongoDB` ✅
- [ ] `[Backend] Firebase initialized` ✅
- [ ] `[Backend] Server running on port 3001` ✅

No errors should appear.

### Frontend Application
In terminal 2, run:
```bash
pnpm run dev
```

Check for these messages:
- [ ] Frontend starts on http://localhost:5173 ✅
- [ ] No VITE_ environment variable errors ✅
- [ ] No Firebase initialization errors ✅

---

## Functionality Testing

### Email/Password Authentication
- [ ] Go to http://localhost:5173/signin
- [ ] Try signing in with test credentials
- [ ] Browser console shows: `[v0] Firebase sign-in successful`
- [ ] User is redirected to home page
- [ ] User profile appears in navbar (if implemented)

### Google Sign-In
- [ ] Go to http://localhost:5173/signin
- [ ] Click "Continue with Google"
- [ ] Google login popup appears (not blocked)
- [ ] Can select Google account
- [ ] After login, redirected to home page
- [ ] Browser console shows: `[v0] Google Sign-In successful`

### MongoDB Data Persistence
After signing in:
- [ ] Go to MongoDB Atlas console
- [ ] Click Collections on your cluster
- [ ] Find the `users` collection
- [ ] Check that your user document is present with correct email
- [ ] User document contains: `_id`, `email`, `uid`, `displayName`, `profileImage`

### Authentication Token
After signing in:
- [ ] Open browser DevTools → Storage → Local Storage
- [ ] Check that `firebaseToken` key exists
- [ ] Token value is not empty

### API Communication
- [ ] API health check works: `GET http://localhost:3001/health`
- [ ] Returns `{"status":"ok","timestamp":"..."}`
- [ ] Protected API calls work with Authorization header
- [ ] Browser console shows "[v0]" debug logs during authentication

---

## Troubleshooting Quick Reference

### Problem: "Firebase configuration is incomplete"
**Solution**:
1. Check all VITE_ variables are in `.env.local`
2. Restart dev server: `Ctrl+C` then `pnpm run dev`
3. Clear browser cache and reload

### Problem: "Cannot connect to backend"
**Solution**:
1. Ensure backend is running: `pnpm run dev:backend`
2. Check port 3001 is not in use: `lsof -i :3001`
3. Verify `VITE_API_URL` is correct

### Problem: "Google Sign-In popup blocked"
**Solution**:
1. Check browser popup blocker settings
2. Try in incognito mode
3. Ensure localhost:5173 is in authorized domains
4. Check browser console for specific error code

### Problem: "MongoDB connection error"
**Solution**:
1. Verify MongoDB Atlas cluster is running (green status)
2. Check IP allowlist includes your IP (or 0.0.0.0/0 for development)
3. Test connection string format is correct
4. Verify username and password don't have special characters that need escaping

### Problem: "Invalid or expired token"
**Solution**:
1. Sign in again - tokens expire after 1 hour
2. Check backend logs for token verification errors
3. Verify Firebase Admin SDK credentials are correct
4. Check that `FIREBASE_PRIVATE_KEY` has correct newlines

### Problem: "User not found in MongoDB"
**Solution**:
1. User registration endpoint should be called on first sign-in
2. Check backend logs for POST /api/auth/register
3. Verify user is being created in correct database/collection
4. Check MongoDB Atlas collections directly

---

## Browser Console Verification

Open DevTools Console (F12) and look for these development logs:

```
[v0] AuthProvider mounted - setting up auth state listener
[v0] Auth state changed: user@example.com (or No user)
[v0] Token obtained for user: user@example.com
[v0] User role determined: student (or admin)
```

And for Google Sign-In:
```
[v0] Google Sign-In initiated
[v0] Google Sign-In successful for user: user@gmail.com
[v0] Firebase token obtained for Google user
[v0] Syncing Google user to MongoDB
[v0] MongoDB sync successful
```

---

## Performance Verification

### Frontend Load Time
- [ ] Page loads in < 3 seconds
- [ ] Sign-in button is interactive
- [ ] No "blank page" states after authentication

### Backend Response Time
- [ ] Health check responds in < 100ms
- [ ] Sign-in API call completes in < 2 seconds
- [ ] User data fetch completes in < 1 second

### Database Performance
- [ ] MongoDB queries complete in < 500ms
- [ ] No timeout errors in logs
- [ ] Connection pool is stable (no connection warnings)

---

## Security Verification

- [ ] Private keys are NOT in git repository
- [ ] `.env.local` is in `.gitignore`
- [ ] Firebase rules are configured (if using Firestore)
- [ ] MongoDB IP allowlist is restrictive (not 0.0.0.0/0 in production)
- [ ] Sensitive data is not logged to console in production
- [ ] CORS is configured to allow only your domain

---

## Ready for Deployment?

Once all items above are checked:

1. ✅ Move `.env.local` variables to production environment
2. ✅ Update `VITE_API_URL` to production backend URL
3. ✅ Add production domain to Firebase authorized domains
4. ✅ Ensure MongoDB Atlas IP allowlist includes deployment servers
5. ✅ Test full flow in production environment

Your application is ready to go live! 🚀
