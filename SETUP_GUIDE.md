# Firebase + MongoDB Setup Guide

This guide will help you set up Firebase Authentication and MongoDB for your Lost & Found application.

## Prerequisites

- Node.js 18+ and npm/pnpm installed
- Firebase project created at https://console.firebase.google.com
- MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- Git (optional, for version control)

---

## Part 1: Firebase Setup

### Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Project Settings** (gear icon) → **General**
4. Scroll down to "Your apps" section
5. Copy all the values from your web app configuration:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### Step 2: Enable Google Sign-In

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your domain to authorized domains (localhost:5173 for development, your deployment domain for production)
4. Click **Save**

### Step 3: Create a Service Account (for backend)

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. A JSON file will download - keep it safe!
4. You'll need these values from the JSON:
   - type, project_id, private_key_id, private_key, client_email, client_id, auth_uri, token_uri, auth_provider_x509_cert_url, client_x509_cert_url

---

## Part 2: MongoDB Setup

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Create a new cluster (select free tier for development)
4. Wait for cluster to be ready (usually 5-10 minutes)

### Step 2: Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Save the username and password safely
5. Grant **readWriteAnyDatabase** role

### Step 3: Get Connection String

1. Go to **Clusters** → Click **Connect**
2. Choose **Drivers** → **Node.js**
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<database-name>` with your actual values
5. Format should be: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### Step 4: Allow Network Access

1. Go to **Network Access**
2. Add your IP address or use `0.0.0.0/0` to allow all (development only)
3. Click **Add Entry** and **Confirm**

---

## Part 3: Environment Configuration

### Step 1: Copy Environment Template

```bash
cp .env.example .env.local
```

### Step 2: Fill in Frontend Variables

Edit `.env.local` and add your Firebase client configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3001/api
```

### Step 3: Fill in Backend Variables

Add your Firebase Admin SDK configuration to `.env.local`:

```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_cert_url
```

### Step 4: Add MongoDB Configuration

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lost_and_found?retryWrites=true&w=majority
```

### Step 5: Add Server Configuration

```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## Part 4: Running the Application

### Terminal 1: Backend Server

```bash
# Install dependencies (if not already done)
pnpm install

# Start backend on port 3001
pnpm run dev:backend
```

Check the logs:
- ✅ "MongoDB connected successfully" - Database is working
- ✅ "Firebase initialized" - Firebase admin SDK is ready
- ✅ "Server running on port 3001" - Backend is running

### Terminal 2: Frontend Application

```bash
# In a new terminal
pnpm run dev
```

The frontend will start on http://localhost:5173

---

## Part 5: Testing the Setup

### Test Email/Password Sign-In

1. Go to http://localhost:5173
2. Click "Sign In"
3. Go to [Firebase Console](https://console.firebase.google.com) → **Authentication** → **Users**
4. Create a test user manually, or register a new one in the app
5. Use credentials to sign in

### Test Google Sign-In

1. On the Sign In page, click "Continue with Google"
2. A popup should appear asking to select your Google account
3. After successful authentication, you should be redirected to the home page
4. Check console logs for "[v0]" messages showing the authentication flow

### Test MongoDB Connection

1. Sign in successfully (email/password or Google)
2. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. Click **Collections** on your cluster
4. You should see a `users` collection with your user data

---

## Troubleshooting

### Google Sign-In Popup Blocked

**Problem**: "Popup was blocked by your browser"

**Solution**:
1. Allow popups for localhost:5173
2. Try signing in from a different browser tab
3. Check browser popup blocker settings

### Firebase Configuration is Incomplete

**Problem**: Console shows "Firebase configuration is incomplete"

**Solution**:
1. Verify all VITE_ variables are set in `.env.local`
2. Make sure `import.meta.env` is being used (not `process.env`)
3. Restart the dev server: `pnpm run dev`

### MongoDB Connection Error

**Problem**: "MONGODB_URI environment variable is not set" or connection timeout

**Solution**:
1. Verify MONGODB_URI is in `.env.local`
2. Check MongoDB Atlas Network Access includes your IP
3. Verify username and password are correct
4. Test connection string directly in MongoDB Compass

### Token Verification Failed

**Problem**: Backend returns "Invalid or expired token"

**Solution**:
1. Ensure FIREBASE_PRIVATE_KEY is correctly formatted with newlines
2. Verify Firebase Admin SDK credentials are from Service Account
3. Check that frontend is sending Authorization header correctly
4. Tokens expire after 1 hour - sign in again if token is stale

### 401 Unauthorized on API Calls

**Problem**: "Unauthorized" errors on protected routes

**Solution**:
1. Check browser console for "[v0] Token obtained" message
2. Verify Authorization header is being sent: `Bearer <token>`
3. Ensure user is authenticated before making requests
4. Check backend auth middleware is applied to routes

---

## API Endpoints Reference

### Authentication Routes

- `POST /api/auth/verify` - Verify and get user info
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/notifications` - Update notification preferences

### Items Routes

- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Search Routes

- `GET /api/search?q=keyword` - Search items by keyword
- `GET /api/search/category/:category` - Search by category

---

## Production Deployment

### Before Deploying

1. Update `VITE_API_URL` to your production backend URL
2. Update `FRONTEND_URL` in backend .env to your production frontend domain
3. Add production domain to Firebase authorized domains
4. Ensure MongoDB Atlas IP allowlist includes deployment servers

### Environment Variables

Set these in your hosting platform (Vercel, Netlify, AWS, etc.):

**Frontend (.env.local or platform vars)**:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_API_URL=https://your-backend.example.com/api
```

**Backend (.env.local or platform vars)**:
```
FIREBASE_TYPE
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
FIREBASE_CLIENT_ID
FIREBASE_AUTH_URI
FIREBASE_TOKEN_URI
FIREBASE_AUTH_PROVIDER_X509_CERT_URL
FIREBASE_CLIENT_X509_CERT_URL
MONGODB_URI
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.example.com
```

---

## Support & Next Steps

- For Firebase issues: [Firebase Documentation](https://firebase.google.com/docs)
- For MongoDB issues: [MongoDB Documentation](https://docs.mongodb.com)
- For application issues: Check `/src/pages/Signin/Signin.jsx` and auth logs in console

Your application is now ready for development! 🚀
