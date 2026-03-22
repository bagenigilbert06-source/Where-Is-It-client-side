# Fix MongoDB Connection Error

## The Problem

Your backend is failing with:
```
MongoDB connection error: Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net
```

**Root Cause**: Your `.env.local` file is missing or incomplete - it doesn't have a valid `MONGODB_URI` environment variable.

---

## The Solution (Pick One)

### Solution 1: MongoDB Atlas (Recommended for Cloud/Shared Hosting)

#### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up Free"
3. Verify email and create account
4. Log in

#### Step 2: Create a Free Cluster
1. Click "Create" → "New Project" (optional)
2. Click "Build a Database"
3. Select **"M0 FREE"** tier (completely free)
4. Select your nearest region
5. Click "Create Deployment"
6. Wait 5-10 minutes...

#### Step 3: Create Database User
1. Go to **"Database Access"** in left menu
2. Click **"Add New Database User"**
3. Enter:
   - **Username**: `campuslostfound`
   - **Password**: Create a strong one (save it!)
   - **Database User Privileges**: Select **"Built-in Role"** → **"Atlas admin"**
4. Click **"Add User"**

#### Step 4: Allow Network Access
1. Go to **"Network Access"** in left menu
2. Click **"Add IP Address"**
3. For development: Enter `0.0.0.0/0` (allows all IPs)
4. Click **"Confirm"**

#### Step 5: Get Your Connection String
1. Go to **"Deployments"** 
2. Click **"Connect"** on your cluster
3. Select **"Drivers"** tab
4. Copy the connection string
5. Should look like:
   ```
   mongodb+srv://campuslostfound:YOUR_PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

#### Step 6: Update .env.local
```bash
# .env.local

# Replace YOUR_PASSWORD with the password you created
MONGODB_URI=mongodb+srv://campuslostfound:YOUR_PASSWORD@cluster0.mongodb.net/campus-lost-found?retryWrites=true&w=majority

# Keep other vars as they are
FIREBASE_API_KEY=...
# etc
```

---

### Solution 2: Local MongoDB (For Local Development Only)

#### Installation

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Run installer
- MongoDB starts automatically

#### Update .env.local
```bash
MONGODB_URI=mongodb://localhost:27017/campus-lost-found
```

---

## Verify It Works

### Step 1: Check .env.local Has MONGODB_URI
```bash
grep MONGODB_URI .env.local
```

Should output:
```
MONGODB_URI=mongodb+srv://campuslostfound:PASSWORD@cluster0.mongodb.net/campus-lost-found?retryWrites=true&w=majority
```

### Step 2: Start Backend
```bash
cd backend
pnpm run dev
```

### Step 3: Look for Success Message
You should see:
```
[Backend] Initializing server...
[Database] Connecting to MongoDB...
[Database] MongoDB connected successfully
[Database] Database: campus-lost-found
[Backend] Connected to MongoDB
[Backend] Firebase initialized
[Backend] Server running on port 3001
```

### Step 4: Test Health Endpoint
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-..."}
```

---

## Common Issues & Fixes

### "ENOTFOUND _mongodb._tcp.cluster0.mongodb.net"
**Problem**: DNS can't resolve MongoDB
**Fix**: 
- Check MONGODB_URI in .env.local
- Verify internet connection
- Ensure correct cluster name (cluster0)

### "Authentication failed"
**Problem**: Username or password is wrong
**Fix**:
- Double-check username: `campuslostfound`
- Make sure password matches what you set in MongoDB Atlas
- If password has special chars: Use MongoDB Atlas connection string builder

### "getaddrinfo ENOTFOUND cluster0.mongodb.net"
**Problem**: Network issue or IP not whitelisted
**Fix**:
- Check Network Access in MongoDB Atlas
- Add `0.0.0.0/0` temporarily for testing
- Check your internet connection

### "MongoError: Could not find a server"
**Problem**: Cluster not deployed yet
**Fix**:
- Wait 5-10 minutes after creating cluster
- Refresh MongoDB Atlas page
- Try again

### "connect ECONNREFUSED 127.0.0.1:27017"
**Problem**: Local MongoDB not running
**Fix**:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Check it's running
mongo --eval "db.version()"
```

---

## Troubleshooting Checklist

- [ ] `.env.local` file exists in project root
- [ ] `MONGODB_URI` is set in `.env.local`
- [ ] Connection string starts with `mongodb+srv://` (Atlas) or `mongodb://` (local)
- [ ] Username and password are correct
- [ ] Password doesn't have unencoded special characters
- [ ] MongoDB Atlas IP whitelist includes your IP (or 0.0.0.0/0)
- [ ] MongoDB cluster is fully deployed (not still creating)
- [ ] Internet connection is working
- [ ] Firewall isn't blocking MongoDB port (27017)

---

## Still Stuck?

1. **Read Full Guide**: `MONGODB_SETUP.md` has even more details
2. **Check Logs**: Run diagnostics with `bash scripts/diagnose.sh`
3. **Try Local First**: Use local MongoDB to rule out Atlas issues
4. **MongoDB Support**: https://www.mongodb.com/support

---

## What's Happening Behind the Scenes

When you run `pnpm run dev`:

1. App loads `.env.local`
2. Reads `MONGODB_URI` variable
3. Tries to connect to MongoDB
4. If successful → "MongoDB connected successfully"
5. If fails → Shows error with suggestions

The error you're seeing means step 2 or 3 is failing because `MONGODB_URI` is missing or invalid.

---

## Next Steps After Fixing

1. Start backend: `cd backend && pnpm run dev`
2. In another terminal, start frontend: `pnpm run dev`
3. Open http://localhost:5173
4. Test user registration
5. Check MongoDB Atlas to verify data is being saved

You're almost there! Just need to add that MongoDB URI and you'll be good to go.
