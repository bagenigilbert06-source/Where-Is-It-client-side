# Troubleshooting Guide

## Quick Diagnostics

The application includes a system diagnostics tool that appears in the bottom-right corner during development. Click the ✅ or ⚠️ icon to see:
- Firebase configuration status
- Backend connectivity
- MongoDB connection status
- Authentication state
- Recommended fixes

---

## Common Issues & Solutions

### 1. Firebase Configuration Issues

#### Error: "Firebase configuration is incomplete. Please check your .env.local file."

**Cause**: One or more Firebase environment variables are missing.

**Solution**:
```bash
# 1. Copy the example file
cp .env.example .env.local

# 2. Edit .env.local and add all VITE_FIREBASE_* variables
# 3. Get values from Firebase Console > Project Settings > Your apps

# 4. Restart the dev server
Ctrl+C
pnpm run dev
```

**Check**:
```javascript
// In browser console, run:
console.log(import.meta.env.VITE_FIREBASE_PROJECT_ID)
// Should show your project ID, not 'undefined'
```

---

### 2. Google Sign-In Issues

#### Error: "Popup was blocked by your browser"

**Cause**: Browser popup blocker is preventing the Google login popup.

**Solutions**:
- Allow popups for localhost:5173 in browser settings
- Try in incognito/private mode (often allows popups by default)
- Use email/password authentication as fallback

#### Error: "auth/popup-blocked" or "auth/cancelled-popup-request"

**Cause**: Another sign-in dialog is already open, or popup was closed.

**Solutions**:
```javascript
// This is normal behavior - just try again
// The error message is now user-friendly and explains what happened
// See /src/pages/Signin/Signin.jsx for error handling
```

#### Error: "Google Sign-In is not properly configured"

**Cause**: Google provider not enabled in Firebase Console.

**Solution**:
```
1. Go to Firebase Console > Authentication > Sign-in method
2. Find "Google" provider
3. Click it to enable
4. Add your domain to authorized domains:
   - For dev: localhost:5173
   - For prod: your-domain.com
5. Click Save
6. Wait a few minutes for changes to propagate
```

#### Pop-up appears but can't select account (stuck/blank)

**Cause**: CORS or domain authorization issues.

**Solution**:
```
1. Check that YOUR EXACT domain is in Firebase authorized domains
   - If running on localhost:5173, it must be exactly in the list
   - Wildcards don't always work

2. Verify Firebase config matches Console settings
   - Copy all values again from Firebase Console
   - Make sure no typos in VITE_* variables

3. Clear browser cache
   - DevTools > Application > Clear site data
   - Or use Ctrl+Shift+Delete

4. Try in different browser or incognito mode
```

---

### 3. MongoDB Connection Issues

#### Error: "MONGODB_URI environment variable is not set"

**Cause**: Environment variable not configured.

**Solution**:
```bash
# 1. Add to .env.local (backend)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lost_and_found?retryWrites=true&w=majority

# 2. Replace username and password with actual values
# 3. Restart backend server
Ctrl+C
pnpm run dev:backend
```

#### Error: "connect ECONNREFUSED" or "ENOTFOUND"

**Cause**: Cannot reach MongoDB server.

**Solutions**:
```
1. Verify cluster is running (MongoDB Atlas > Clusters > green status)

2. Check IP allowlist:
   - Go to MongoDB Atlas > Network Access
   - Add your IP: Likely 0.0.0.0/0 for development
   - Wait 1-2 minutes for changes

3. Verify connection string format:
   - Should be: mongodb+srv://username:password@cluster.mongodb.net/dbname
   - Copy fresh from Atlas > Connect > Drivers > Connection String

4. Test connection with MongoDB Compass:
   - Download MongoDB Compass
   - Paste connection string
   - Try to connect
   - If Compass works but app doesn't, it's a code issue
```

#### Error: "MongoAuthError: authentication failed"

**Cause**: Wrong username or password.

**Solution**:
```
1. Go to MongoDB Atlas > Database Access
2. Find your user
3. Click Edit > Change password
4. Update MONGODB_URI with new password
5. Special characters? Use URL encoding:
   @ → %40
   # → %23
   $ → %24
   etc.
6. Restart backend
```

#### Error: "No documents created" / "User not in MongoDB"

**Cause**: User signed in to Firebase but MongoDB sync failed.

**Solutions**:
```javascript
// 1. Check browser console for MongoDB sync error
// Look for: "[v0] MongoDB sync warning"

// 2. Check backend logs for /auth/register endpoint
// Should see: POST /auth/register

// 3. Common reasons:
// - API_URL is wrong (check VITE_API_URL)
// - Token not sent to backend (check Authorization header)
// - Backend auth middleware rejecting token (check Firebase Admin SDK config)

// 4. Manual fix: Trigger sync by signing out and in again
localStorage.removeItem('firebaseToken');
window.location.reload();
// Sign in again, this will attempt MongoDB sync
```

---

### 4. Backend Connection Issues

#### Error: "Cannot connect to backend" or "ECONNREFUSED"

**Cause**: Backend server not running.

**Solution**:
```bash
# Terminal 1 - Start Backend
pnpm install  # Install deps first if needed
pnpm run dev:backend

# Check output:
# [Backend] Connected to MongoDB
# [Backend] Firebase initialized
# [Backend] Server running on port 3001

# Terminal 2 - Start Frontend (separate terminal!)
pnpm run dev
```

**Verify Backend is Running**:
```bash
# Test from command line
curl http://localhost:3001/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

#### Error: "Port 3001 already in use"

**Solution**:
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3002 pnpm run dev:backend
# And update VITE_API_URL=http://localhost:3002/api
```

#### Error: "CORS error" when calling API

**Cause**: CORS not properly configured.

**Check**:
```javascript
// In browser console, network tab
// Look for Access-Control-Allow-Origin header

// If missing, backend hasn't enabled CORS for your origin
```

**Solution**:
```
1. Backend CORS should be configured to allow localhost:5173
   - Check backend/src/index.ts > CORS config

2. Verify FRONTEND_URL in .env.local:
   FRONTEND_URL=http://localhost:5173

3. Ensure credentials: true if needed:
   - CORS config should include: credentials: true
```

---

### 5. Authentication Token Issues

#### Error: "Invalid or expired token"

**Cause**: Token verification failed on backend.

**Solution**:
```javascript
// 1. Tokens last 1 hour - if > 1 hour old, sign in again
localStorage.removeItem('firebaseToken');
window.location.reload();

// 2. Check Firebase Admin SDK credentials:
// - FIREBASE_PRIVATE_KEY must have correct newlines
// - Can't be a string without \n escape sequences

// 3. Verify in .env.local:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
// Make sure \n is literal, not actual newline
```

#### Error: "No authorization token provided"

**Cause**: Frontend not sending token to backend.

**Solution**:
```javascript
// 1. Check localStorage has the token
localStorage.getItem('firebaseToken')
// Should be a long JWT string, not null

// 2. Check axios is sending Authorization header
// In browser DevTools > Network tab, select an API request
// Headers should show: Authorization: Bearer eyJh...

// 3. If missing, check AuthProvider.jsx:
// Token should be set in axios.defaults.headers.common['Authorization']

// 4. Trigger re-authentication:
localStorage.removeItem('firebaseToken');
window.location.reload();
// Sign in again
```

---

### 6. Email/Password Sign-In Issues

#### Error: "Firebase: Error (auth/user-not-found)"

**Cause**: User account doesn't exist in Firebase.

**Solution**:
```
1. Sign up first: Go to Register page
2. Or create user in Firebase Console:
   - Authentication > Users > Add user
   - Enter email and password
   - Click Create user
3. Then try signing in with those credentials
```

#### Error: "Firebase: Error (auth/wrong-password)"

**Cause**: Password is incorrect.

**Solution**:
```
1. Use correct password (case-sensitive)
2. Forgot password? 
   - Go to Firebase Console > Authentication > Users
   - Find user > Click > Reset password
   - Or implement password reset flow
```

---

### 7. General Debugging

#### Enable Verbose Logging

**Add to your code**:
```javascript
// In main.jsx or App.jsx
import { getAuth } from 'firebase/auth';

// Enable Firebase debug logging
localStorage.setItem('firebase:debug', '*');
```

**Watch Console**:
- Look for `[v0]` prefixed messages (app logs)
- Look for `[@firebase/...]` messages (Firebase logs)
- Look for `[Backend]` messages (backend logs)

#### Check Network Requests

**In Browser DevTools**:
```
1. Open DevTools (F12)
2. Go to Network tab
3. Sign in
4. Look for requests:
   - POST /auth/register (should be 200 or 201)
   - GET /api/auth/me (should be 200)
   - POST /api/items (if creating item)

5. Click request to see:
   - Status code (200 = good, 401 = auth failed, 500 = server error)
   - Request headers (should have Authorization)
   - Response body (error message if failed)
```

#### Check Storage

**In Browser DevTools**:
```
1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Look for:
   - firebaseToken (should be present and not empty after sign-in)
   - Any other auth-related keys

4. On logout, firebaseToken should be removed
```

#### View Server Logs

**In Terminal Running Backend**:
```
Look for:
- [Backend] prefix for app logs
- API request logs: POST /api/auth/register
- Error stack traces (if something fails)
- MongoDB connection status

If no logs appear:
- Backend might not be running
- Check you're in correct terminal
- Try: Ctrl+C then pnpm run dev:backend again
```

---

### 8. Still Not Working?

#### Generate Diagnostics Report

```javascript
// In browser console, run:
import { healthChecks, logHealthCheck } from '/src/utils/healthCheck';

const health = await healthChecks.runAll(user, loading);
logHealthCheck(health);
```

#### Check File Permissions

```bash
# Make sure you can read .env files
ls -la | grep env

# Backend server logs should show file paths
pnpm run dev:backend
```

#### Reset Everything

```bash
# 1. Clear node modules
rm -rf node_modules pnpm-lock.yaml

# 2. Reinstall
pnpm install

# 3. Clear browser storage
# DevTools > Application > Clear site data

# 4. Restart servers
# Terminal 1: pnpm run dev:backend
# Terminal 2: pnpm run dev

# 5. Try signing in again
```

#### Get Help

- Check SETUP_GUIDE.md for initial configuration
- Check VERIFICATION_CHECKLIST.md to verify each step
- Check browser console for `[v0]` debug messages
- Check backend terminal for errors
- Review Firebase documentation: https://firebase.google.com/docs
- Review MongoDB documentation: https://docs.mongodb.com

---

## Performance Issues

### Slow Sign-In

**Check**:
1. Is backend responding? (check health check)
2. Is MongoDB responding? (check backend logs)
3. Network latency? (check DevTools Network tab)

**Solution**:
```bash
# 1. Ensure backend is running on same machine
pnpm run dev:backend

# 2. Check MongoDB connection
# MongoDB Atlas > Metrics > observe performance

# 3. Use MongoDB Compass to test queries directly
```

### Slow Page Load

**Check**:
1. Are all environment variables set?
2. Is Firebase initializing?
3. Are requests being made?

**Solution**:
```
1. Check DevTools Performance tab
2. Look for slow network requests
3. Ensure CDN assets are loading (if using)
4. Check browser extensions aren't interfering
```

---

## Still Need Help?

1. **Check the console**: Browser console has detailed error messages
2. **Check the logs**: Backend terminal shows server-side errors
3. **Read the docs**: SETUP_GUIDE.md and VERIFICATION_CHECKLIST.md
4. **Test endpoints**: Use Postman or curl to test API directly
5. **Check Firebase Console**: Verify configuration matches your app
6. **Check MongoDB Atlas**: Verify cluster, user, and network access

Good luck! 🚀
