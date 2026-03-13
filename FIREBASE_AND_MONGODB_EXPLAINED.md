# Firebase and MongoDB Initialization Explained

## Overview
Your backend uses two databases:
- **MongoDB** - Stores your data (items, users, notifications)
- **Firebase** - Handles authentication and admin operations

---

## 1. MongoDB Initialization

### How It Works

**File:** `backend/src/config/database.ts`

```typescript
export async function connectDB(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
```

### Step-by-Step Flow

1. **Read Connection String from Environment**
   - Reads `MONGODB_URI` from `.env.local`
   - Currently set to: `mongodb://localhost:27017/lost-found`
   - This connects to your local MongoDB server on port 27017

2. **Validate Connection String**
   - Throws error if `MONGODB_URI` is missing
   - Prevents server from starting with invalid configuration

3. **Connect Using Mongoose**
   - `mongoose.connect()` establishes connection to MongoDB
   - Mongoose is an ODM (Object Data Modeling) library for MongoDB
   - It handles queries, validation, and schema management

4. **Error Handling**
   - If connection fails, logs the error and re-throws it
   - Server startup is halted if DB connection fails
   - Prevents running without a database

### What Happens When Server Starts

```
[DB] connectDB called
await mongoose.connect(MONGODB_URI)  ← Connects to localhost:27017/lost-found
[Backend] Connected to MongoDB       ← Success message
```

### Database Structure

Your MongoDB has these collections (created automatically):
- **users** - User profiles and account info
- **items** - Lost/found items posted
- **notifications** - User notifications and alerts
- **matches** - Matched items between lost and found

---

## 2. Firebase Initialization

### How It Works

**File:** `backend/src/config/firebase.ts`

```typescript
export function initializeFirebase(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;  // Return existing if already initialized
  }

  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  return firebaseApp;
}
```

### Step-by-Step Flow

1. **Check if Already Initialized**
   - Uses singleton pattern (only initializes once)
   - If `firebaseApp` exists, returns it immediately
   - Prevents duplicate initialization

2. **Build Service Account Object**
   - Reads Firebase credentials from environment variables
   - Creates a JavaScript object with all authentication details
   - Includes:
     - `private_key` - Secret key for server-side authentication
     - `project_id` - Your Firebase project identifier
     - `client_email` - Service account email
     - Other OAuth endpoints

3. **Initialize Firebase Admin SDK**
   - `admin.initializeApp()` creates a Firebase app instance
   - Uses service account credentials for authentication
   - Enables backend to verify user tokens and perform admin operations

4. **Return the Instance**
   - Returns the initialized Firebase app for use throughout backend

### What Happens When Server Starts

```
[Firebase] initializeFirebase called
admin.initializeApp({credential: serviceAccount})  ← Initialize with credentials
[Backend] Firebase initialized                    ← Success message
```

### Firebase Capabilities Enabled

Once initialized, you can:
- **Verify user tokens** - Check if JWT tokens are valid
- **Get user info** - Retrieve user details from Firebase
- **Create/delete users** - Manage accounts
- **Access Firebase services** - Database, storage, etc.

---

## 3. How They Work Together

### Flow Diagram

```
Client (Frontend)
    ↓
Request to Backend API
    ↓
[index.ts] Receives request
    ↓
[auth middleware] Uses Firebase to verify JWT token
    ↓
[MongoDB] Queries/stores user data if authorized
    ↓
Response back to client
```

### Example: User Registration

1. **Frontend** sends registration request with email/password
2. **Backend auth route** receives request
3. **Firebase Admin SDK** creates user account in Firebase Auth
4. **MongoDB** stores user profile in `users` collection
5. **Backend** returns confirmation to frontend

### Example: Posting an Item

1. **Frontend** sends item data with authentication token
2. **Firebase middleware** verifies the token is valid
3. **MongoDB** stores item in `items` collection with userId
4. **Backend** returns saved item to frontend

---

## 4. Environment Variables Required

### For MongoDB
```
MONGODB_URI=mongodb://localhost:27017/lost-found
```

### For Firebase (from Firebase Console)
```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=admin@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

---

## 5. Data Flow Summary

| Component | Purpose | Data Stored |
|-----------|---------|-------------|
| **Firebase Auth** | User authentication | Email, password hash, user metadata |
| **Firebase Admin SDK** | Verify tokens, user info | Session validation |
| **MongoDB - users** | User profiles | Name, email, location, preferences |
| **MongoDB - items** | Lost/found items | Title, description, category, location |
| **MongoDB - notifications** | Alerts and messages | Type, recipient, status |
| **MongoDB - matches** | Item connections | Matched item pairs, similarity score |

---

## 6. Troubleshooting

### MongoDB Not Connecting
- Error: `querySrv ENOTFOUND`
- Solution: Ensure MongoDB is running locally
```bash
mongosh  # Test connection
```

### Firebase Not Initializing
- Error: `Error getting service account`
- Solution: Verify all Firebase env variables are correct
- Get credentials from Firebase Console → Project Settings → Service Accounts

### Database Operations Failing
- Error: Mongoose validation errors
- Solution: Check that MongoDB connection is established before making queries

---

## 7. In Production (Vercel)

When deploying to Vercel:

1. **MongoDB Atlas** - Use cloud-hosted MongoDB instead of local
   - Set `MONGODB_URI` to Atlas connection string
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/lost-found`

2. **Firebase Credentials** - Add all env variables in Vercel dashboard
   - Settings → Environment Variables
   - Paste each Firebase credential

3. **Both services** initialize automatically when backend starts

---

## Summary

- **MongoDB** = Your data storage (locally at `localhost:27017`)
- **Firebase** = User authentication and token verification
- **Both initialize** when you run `pnpm run dev`
- **Both required** for backend to function properly
- **Environment variables** control which MongoDB and Firebase project to use
