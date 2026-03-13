# Firebase Service Account Setup Guide

## What You Need

When you download your Firebase service account key, you'll get a JSON file that looks like this:

```json
{
  "type": "service_account",
  "project_id": "campus-lost-found-xxxxx",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-abc@campus-lost-found-xxxxx.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-abc%40campus-lost-found-xxxxx.iam.gserviceaccount.com"
}
```

## Step-by-Step Setup

### Step 1: Get Your Firebase Service Account Key

1. Open [Firebase Console](https://console.firebase.google.com)
2. Click on your project (Campus Lost Found)
3. Click the gear icon (⚙️) in the top-left corner
4. Go to **Project Settings**
5. Click the **Service Accounts** tab
6. Click **Generate New Private Key**
7. A JSON file will download - keep it safe and don't share it!

### Step 2: Extract Values from JSON

Open the downloaded JSON file and copy these exact values:
- `type` → FIREBASE_TYPE
- `project_id` → FIREBASE_PROJECT_ID
- `private_key_id` → FIREBASE_PRIVATE_KEY_ID
- `private_key` → FIREBASE_PRIVATE_KEY (keep the entire multi-line value)
- `client_email` → FIREBASE_CLIENT_EMAIL
- `client_id` → FIREBASE_CLIENT_ID
- `auth_uri` → FIREBASE_AUTH_URI
- `token_uri` → FIREBASE_TOKEN_URI
- `auth_provider_x509_cert_url` → FIREBASE_AUTH_PROVIDER_X509_CERT_URL
- `client_x509_cert_url` → FIREBASE_CLIENT_X509_CERT_URL

### Step 3: Update Your .env.local

Replace the placeholder values in `/backend/.env.local` with your actual Firebase credentials:

```env
# Firebase Service Account
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=campus-lost-found-xxxxx
FIREBASE_PRIVATE_KEY_ID=abc123def456...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@campus-lost-found-xxxxx.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-abc%40campus-lost-found-xxxxx.iam.gserviceaccount.com
```

### Step 4: Restart Your Backend

After updating `.env.local`, restart your backend:

```bash
# Stop the current backend (Ctrl+C)
# Then restart it
pnpm run dev
```

You should now see:
```
[Backend] Connected to MongoDB
[Backend] Firebase initialized
```

## Verification

To verify Firebase is properly configured:

1. The backend should start without errors
2. You should be able to verify user tokens from your frontend
3. When a frontend user logs in with Firebase, the backend can verify their token

## Important Security Notes

- **Never commit** `.env.local` to Git - it contains sensitive credentials
- **Never share** your Firebase private key with anyone
- If you accidentally expose your key, regenerate it immediately in Firebase Console
- The `.gitignore` file should already exclude `.env.local`

## Environment Variables Summary

### MongoDB
- `MONGODB_URI` - Your MongoDB connection string

### Firebase (10 required variables)
- All variables starting with `FIREBASE_` must be filled in

### Optional
- `EMAIL_SERVICE` - For sending notifications
- `FRONTEND_URL` - For CORS configuration
- `LOG_LEVEL` - For logging verbosity

## Troubleshooting

### "Firebase initialized" but tokens fail to verify
- Check that your `FIREBASE_PRIVATE_KEY` is complete and has newlines (\n)
- Ensure all Firebase environment variables are filled in
- Restart the backend after updating `.env.local`

### "Cannot find module" errors
- Make sure you're in the `/backend` directory
- Run `pnpm install` to ensure all dependencies are installed

### Database connection errors
- Verify MongoDB is running: `mongosh` in terminal
- Check `MONGODB_URI` is correct
- For MongoDB Atlas: ensure your IP is whitelisted in Network Access

## What Happens When Firebase is Properly Configured

1. User logs in on frontend with Firebase
2. Firebase returns a JWT token to the frontend
3. Frontend sends token with API requests to backend
4. Backend uses Firebase credentials to verify the token
5. If valid, backend proceeds with the request
6. If invalid, backend rejects the request with 401 Unauthorized

This is your authentication flow - Firebase validates WHO you are, MongoDB stores WHAT you do.
