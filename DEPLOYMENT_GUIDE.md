# Backend Deployment Guide

This guide covers deploying the Lost & Found backend to Vercel and connecting it with MongoDB Atlas.

## Prerequisites

- Vercel account (vercel.com)
- MongoDB Atlas account (mongodb.com)
- Firebase project with admin credentials
- Git repository (GitHub recommended)

## Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a new project named "Lost-Found"
3. Create a cluster:
   - Select "M0 Free Tier" for development
   - Choose your preferred region
   - Click "Create Deployment"

### 1.2 Setup Database Access

1. Go to "Security" → "Database Access"
2. Add database user:
   - Username: `lostfound`
   - Password: Generate secure password (copy for later)
   - Database User Privileges: "Read and write to any database"

### 1.3 Setup Network Access

1. Go to "Security" → "Network Access"
2. Add IP Address: Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0) for development
   - For production: Add only Vercel's IPs

### 1.4 Get Connection String

1. Go to "Deployment" → "Databases"
2. Click "Connect" on your cluster
3. Select "Drivers"
4. Copy the connection string and replace:
   - `<username>`: lostfound
   - `<password>`: Your password
   - Example: `mongodb+srv://lostfound:password@cluster.mongodb.net/lost-found?retryWrites=true&w=majority`

## Step 2: Prepare Firebase Service Account

### 2.1 Generate Service Account Key

1. Go to Firebase Console → Your Project
2. Settings → Service Accounts
3. Click "Generate New Private Key"
4. A JSON file downloads - keep this secure

### 2.2 Extract Firebase Credentials

From the JSON file, copy these values:
- `type`
- `project_id`
- `private_key_id`
- `private_key` (with escaped newlines)
- `client_email`
- `client_id`
- `auth_uri`
- `token_uri`
- `auth_provider_x509_cert_url`
- `client_x509_cert_url`

## Step 3: Configure Backend for Vercel

### 3.1 Prepare Backend Folder

The backend is in `/backend` folder with:
- `src/` - Source code
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config

### 3.2 Create vercel.json

Create `backend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3.3 Update package.json

Ensure `backend/package.json` includes:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## Step 4: Deploy to Vercel

### 4.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Choose root directory: `backend`

### 4.2 Configure Environment Variables

1. In Vercel dashboard, go to "Settings" → "Environment Variables"
2. Add the following variables:

```
NODE_ENV=production
PORT=3001

MONGODB_URI=mongodb+srv://lostfound:PASSWORD@cluster.mongodb.net/lost-found?retryWrites=true&w=majority

FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url

FRONTEND_URL=https://your-frontend-domain.vercel.app

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

LOG_LEVEL=info
```

**Note:** For `FIREBASE_PRIVATE_KEY`, the newlines must be escaped:
- Original: `-----BEGIN PRIVATE KEY-----\nMIIEvQ...`
- In Vercel: `-----BEGIN PRIVATE KEY-----\\nMIIEvQ...`

### 4.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. You'll get a URL like: `https://your-backend-xxxxx.vercel.app`

### 4.4 Verify Deployment

```bash
# Test health check
curl https://your-backend-xxxxx.vercel.app/health

# Should return:
# {"status":"ok","timestamp":"2024-01-15T10:30:00.000Z"}
```

## Step 5: Update Frontend Configuration

### 5.1 Update Frontend Environment

Update `frontend/.env`:

```
REACT_APP_API_URL=https://your-backend-xxxxx.vercel.app/api
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

### 5.2 Redeploy Frontend

1. Push frontend code to GitHub
2. Vercel automatically redeploys with new environment variables

## Step 6: Test Backend Endpoints

### 6.1 Test Authentication

```bash
# Get Firebase token from frontend
const token = await user.getIdToken();

# Test auth endpoint
curl -X POST https://your-backend-xxxxx.vercel.app/api/auth/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 6.2 Test Items Endpoint

```bash
# Get all items (no auth required)
curl https://your-backend-xxxxx.vercel.app/api/items

# Create item (requires auth)
curl -X POST https://your-backend-xxxxx.vercel.app/api/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "Lost",
    "title": "Black Wallet",
    "description": "Lost near campus",
    "category": "Accessories",
    "location": "Main Gate",
    "dateLost": "2024-01-15"
  }'
```

## Step 7: Configure Email Notifications (Optional)

### 7.1 Gmail Setup

1. Enable 2-factor authentication on Gmail
2. Generate App Password:
   - Go to myaccount.google.com/apppasswords
   - Select Mail and Windows Computer
   - Copy the 16-character password

### 7.2 Update Vercel Environment

1. Set `EMAIL_USER` to your Gmail
2. Set `EMAIL_PASSWORD` to the app password
3. Test with: `POST /api/notifications/send-test`

## Monitoring & Troubleshooting

### View Logs

1. Go to Vercel dashboard
2. Select your backend project
3. Go to "Deployments" → Latest deployment
4. Click "Runtime Logs" to see live logs

### Common Issues

**Issue:** MongoDB connection timeout
- Solution: Add Vercel IPs to MongoDB Atlas Network Access

**Issue:** Firebase authentication fails
- Solution: Verify `FIREBASE_PRIVATE_KEY` has correct escaped newlines

**Issue:** CORS errors
- Solution: Ensure `FRONTEND_URL` matches your frontend domain

**Issue:** Email notifications not sending
- Solution: Check Gmail app password is correct

### Monitor Performance

1. Go to Vercel dashboard
2. Check "Analytics" tab for:
   - Response times
   - Error rates
   - Request volume

## Scaling Considerations

### Database Scaling
- **Free Tier**: Good for development (512MB)
- **Shared Tier**: Small production (2GB+)
- **Dedicated Tier**: Production (10GB+)

### Backup Strategy
1. Enable MongoDB Atlas automatic backups
2. Test restore procedures regularly
3. Keep Firebase admin key secure

### Caching & CDN
- Consider adding Redis for frequently accessed data
- Use MongoDB indexes for query optimization
- Set appropriate cache headers

## Security Checklist

- ✅ Firebase private key stored securely in Vercel
- ✅ MongoDB network access restricted (production)
- ✅ HTTPS enforced on all endpoints
- ✅ CORS configured for frontend domain only
- ✅ Rate limiting enabled (future enhancement)
- ✅ Input validation on all endpoints
- ✅ Error messages don't expose sensitive info

## Next Steps

1. Monitor logs for 24 hours after deployment
2. Set up error tracking (Sentry recommended)
3. Configure automated backups
4. Plan scaling strategy as user base grows
5. Implement caching layer (Redis)
6. Add comprehensive API documentation

## Support Resources

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
- Express.js: https://expressjs.com
- TypeScript: https://www.typescriptlang.org
