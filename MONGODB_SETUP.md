# MongoDB Atlas Setup Guide

## Problem
Your application is getting this error:
```
MongoDB connection error: Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net
```

This means the MongoDB connection string is invalid or incomplete.

## Solution: Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create a free account
3. Verify your email and log in

### Step 2: Create a Cluster
1. Click "Create" to start a new project
2. Select "Create a Deployment" → "MongoDB Atlas"
3. Choose **Free Tier** (M0 Cluster)
4. Select your region (choose closest to your location)
5. Click "Create Deployment"
6. Wait 5-10 minutes for cluster to deploy

### Step 3: Create a Database User
1. In Atlas Dashboard, go to **Database Access**
2. Click **"Add New Database User"**
3. Enter username: `campuslostfound`
4. Enter password: Create a strong password (save it!)
5. Assign role: **"Built-in Role"** → Select **"Atlas admin"**
6. Click **"Add User"**

### Step 4: Whitelist Your IP
1. Go to **Network Access** in the left sidebar
2. Click **"Add IP Address"**
3. Select **"Add Current IP Address"** (or)
4. To allow all IPs: Enter `0.0.0.0/0` (less secure but works for development)
5. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **Deployments** → Click your cluster
2. Click **"Connect"**
3. Select **"Drivers"**
4. Choose **"Node.js"** driver
5. Copy the connection string
6. It should look like:
   ```
   mongodb+srv://campuslostfound:YOUR_PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env.local
Replace the connection string in `.env.local`:
```env
MONGODB_URI=mongodb+srv://campuslostfound:YOUR_PASSWORD@cluster0.mongodb.net/campus-lost-found?retryWrites=true&w=majority
```

**Important:** Replace `YOUR_PASSWORD` with your actual database user password

### Step 7: Test Connection
```bash
# In the backend directory
pnpm run dev
```

You should see:
```
[Backend] Connected to MongoDB
[Backend] Server running on port 3001
```

## Troubleshooting

### Still getting ENOTFOUND error?
1. **Check password** - Make sure password doesn't have special characters or URL-encode them
2. **Check IP whitelist** - Add `0.0.0.0/0` to Network Access (temporary for testing)
3. **Check internet** - Verify you have internet connectivity
4. **Check cluster name** - Should be `cluster0` in the URI

### Password has special characters?
If your password contains `@`, `#`, `%`, etc., you need to URL-encode it:
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`

Or use MongoDB Atlas connection string builder which auto-encodes.

### Still not working?
1. Try connecting with MongoDB Compass:
   - Download: https://www.mongodb.com/products/tools/compass
   - Paste your connection string
   - If it connects, the string is valid
   - If it fails, check IP whitelist

2. Check MongoDB logs:
   - Atlas Dashboard → Your Cluster → "Logs" tab
   - Look for connection errors

### Using Local MongoDB Instead
If you want to skip Atlas and use local MongoDB:

1. Install MongoDB Community: https://docs.mongodb.com/manual/installation/
2. Start MongoDB:
   ```bash
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   mongod
   ```
3. Update `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/campus-lost-found
   ```

## Next Steps
Once connected:
1. Verify all collections are created automatically
2. Test user registration via frontend
3. Check if data is being saved to MongoDB

Need help? Check the TROUBLESHOOTING.md file for more common issues.
