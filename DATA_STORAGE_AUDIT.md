# Complete Data Storage Audit - Lost & Found Application

## Executive Summary

Your current application has a **MIXED STORAGE MODEL** - data is split between multiple locations:

1. **Firebase (Authentication only)**
2. **Old Backend Server** (Vercel - stores most data)
3. **Local Storage** (Browser - caches tokens)
4. **Client-side Memory** (React state)
5. **data.json** (Mock data - not used in production)

The NEW backend we built is **NOT YET CONNECTED** - it exists but frontend still calls the old backend.

---

## Current Data Storage Breakdown

### 1. AUTHENTICATION - Where It Lives
**Primary Storage: Firebase** ✓

- User email/password: Firebase Auth
- User UID: Firebase Auth
- Display name, photo: Firebase Auth profile
- JWT Token: Stored in `localStorage` (key: `authToken`)
- Session persistence: Firebase `onAuthStateChanged` listener

**Files involved:**
- Frontend: `/src/firebase/firebase.init.js` (Firebase config)
- Frontend: `/src/context/Authcontext/AuthProvider.jsx` (Auth state management)
- Backend (Old): Vercel server validates tokens
- Backend (New): `/backend/src/middleware/auth.ts` (Firebase Admin SDK validation)

**Current Flow:**
```
User Login → Firebase Auth → JWT Token → localStorage → API Calls
                                     ↓
                        Old Backend validates JWT
```

**Issue:** Old backend still validates tokens. New backend ready but not connected.

---

### 2. USER DATA - Where It Lives
**Primary Storage: Old Backend (MongoDB)** ❌

**Current Backend User Data Stored:**
```
https://b10a11-server-side-noorjahan220.vercel.app/
```

Fields stored:
- User email
- User name
- User role (admin/student)
- User profile image

**New Backend Ready:**
- `/backend/src/models/User.ts` - MongoDB schema with:
  - Firebase UID
  - Email
  - Display Name
  - Profile Image
  - Location
  - Notification Preferences
  - Stats (items posted, recovered, claimed)

**Current Issue:** 
- Old backend doesn't have all user fields
- New backend models are more complete but NOT connected

---

### 3. ITEMS (Lost/Found Posts) - Where It Lives
**Primary Storage: Old Backend (MongoDB)** ❌

**Currently Stored At:**
```
https://b10a11-server-side-noorjahan220.vercel.app/
Endpoints: /item, /allItems, /itemDelete, /updateItem
```

**Current Data Fields:**
- itemType (Lost/Found)
- title
- description
- category
- location
- dateLost
- image
- name, email (user info - duplicated)
- _id (MongoDB ID)

**Mock Data Location:**
- `/src/data.json` - Contains 12 sample items (NOT used in production)

**New Backend Ready:**
- `/backend/src/models/Item.ts` - Enhanced schema with:
  - All current fields PLUS:
  - Coordinates (lat/lng) for location-based search
  - userId (Firebase UID instead of name/email)
  - status (active/recovered/claimed)
  - claimedBy tracking
  - Timestamps

**API Endpoints Being Used (Old Backend):**
```
GET  /allItems              → Fetch all items
GET  /item?email=X          → Fetch user's items
POST /addItem               → Create new item
PUT  /updateItem/:id        → Update item
DELETE /itemDelete/:id      → Delete item
GET  /itemDetails/:id       → Get single item
```

**Current Issue:**
- Old backend works but lacks features
- New backend has matching, advanced search, notifications

---

### 4. NOTIFICATIONS - Where It Lives
**Primary Storage: Old Backend (MongoDB)** ❌

**Currently:**
- Simple email notifications via backend

**New Backend Ready:**
- `/backend/src/models/Notification.ts`
- `/backend/src/services/NotificationService.ts`
- Features:
  - Item match notifications
  - Item recovery notifications
  - User notification preferences
  - Notification history

---

### 5. MATCHING SYSTEM - Where It Lives
**Primary Storage: NOT IMPLEMENTED** ❌

**New Backend Ready:**
- `/backend/src/services/MatchingService.ts`
- Algorithm:
  - Category-based matching
  - Location-based matching (using coordinates)
  - Time-based matching (date lost vs date found)
  - Weighted scoring system

---

### 6. LOCAL CLIENT STORAGE - What's Cached

**Browser localStorage:**
```javascript
authToken → JWT token for API calls
```

**React State (Memory):**
- User object (AuthContext)
- Posts/Items (useState in components)
- Loading states
- UI state (filters, modals, etc.)

**Problem:**
- Data refreshes from server on each page reload
- No offline capability
- All items fetched fresh each time

---

## Data Flow Diagram

### Current (Working but Limited)
```
┌─────────────────┐
│   User/Browser  │
└────────┬────────┘
         │ localStorage: authToken
         │ React State: posts, user
         ▼
┌──────────────────────────────────────┐
│        React Frontend (Vite)         │
│  - Login page (Firebase)             │
│  - Items page (fetch from old server)│
│  - My Items (fetch from old server)  │
└────────┬─────────────────────────────┘
         │ API Calls
         ▼
┌──────────────────────────────────────┐
│   Old Backend (Vercel)               │
│   https://b10a11-server...           │
│   - Validates JWT                    │
│   - Stores items in MongoDB          │
│   - Basic CRUD operations            │
└────────┬─────────────────────────────┘
         │ MongoDB queries
         ▼
┌──────────────────────────────────────┐
│        MongoDB Atlas                 │
│  - Users collection                  │
│  - Items collection                  │
│  - Basic data only                   │
└──────────────────────────────────────┘
```

### New Backend (Ready but NOT Connected)
```
┌─────────────────┐
│   User/Browser  │
└────────┬────────┘
         │ localStorage: authToken
         │ React State
         ▼
┌──────────────────────────────────────┐
│   React Frontend (Vite)              │
│   Uses: apiService.js (NEW)          │
│   Calls to NEW backend               │
└────────┬─────────────────────────────┘
         │ API Calls (ready to switch)
         ▼
┌──────────────────────────────────────┐
│   NEW Backend (Node.js/Express)      │
│   Location: /backend directory       │
│   - Firebase Admin SDK auth          │
│   - Advanced matching algorithm      │
│   - Notification system              │
│   - Search with filters              │
│   - Better error handling            │
└────────┬─────────────────────────────┘
         │ MongoDB queries
         ▼
┌──────────────────────────────────────┐
│        MongoDB Atlas                 │
│  - Users (Firebase UID)              │
│  - Items (enhanced schema)           │
│  - Notifications                     │
│  - Better indexing                   │
└──────────────────────────────────────┘
```

---

## Complete Data Inventory

### What's in Backend (Old Server - Currently Used)
✓ User authentication tokens
✓ User profiles (basic)
✓ Lost/Found items
✓ Item history
✓ Basic notifications

### What's in Firebase
✓ User accounts (email/password)
✓ User profiles (display name, photo)
✓ Session management

### What's in New Backend (Ready to Deploy)
✓ All of above PLUS:
✓ Enhanced user profiles with preferences
✓ Item matching data
✓ Notification history and preferences
✓ User statistics
✓ Location coordinates
✓ Item status tracking (claimed/recovered)

### What's ONLY in Client/Browser
✓ JWT token (localStorage)
✓ Current page state (React state)
✓ UI state (modals, filters, pagination)
✓ Temporary form data

### What's NOT Stored Anywhere (Missing)
✗ Item view count
✗ User reputation/rating
✗ Item search history
✗ User preferences (theme, language)
✗ Message/chat system between users
✗ Image backup (only URLs stored)

---

## Critical Findings

### 1. Frontend Still Calling OLD Backend
```javascript
// In MyItemsPage.jsx
axiosSecure.get(`/item?email=${user.email}`)  
// Calls: https://b10a11-server-side-noorjahan220.vercel.app/item

// Should call new backend when ready:
// http://localhost:3000/api/items/user/:userId
// or deployed: https://your-backend.vercel.app/api/items/user/:userId
```

### 2. New Backend Endpoints Available but Not Used
```
GET    /api/items              → All items
GET    /api/items/:id          → Single item
POST   /api/items              → Create item
PUT    /api/items/:id          → Update item
DELETE /api/items/:id          → Delete item
GET    /api/items/user/:userId → User's items
GET    /api/search             → Advanced search
GET    /api/matches/:itemId    → Find matches
POST   /api/notifications      → Send notifications
GET    /api/notifications/history → Get user notifications
```

### 3. localStorage Usage (Minor Risk)
```javascript
// Current usage:
localStorage.setItem('authToken', token)  // JWT token
localStorage.removeItem('authToken')      // On logout

// GOOD: Only storing JWT, not sensitive data
// GOOD: Token cleared on logout
```

### 4. No Client-Side Data Persistence
- All item data cleared on page refresh
- No offline support
- State lost on navigation (if not managed properly)

---

## Migration Checklist

### To Switch to New Backend:

- [ ] **Step 1:** Update API base URL in `/src/services/apiService.js`
- [ ] **Step 2:** Update all API endpoints to match new backend routes
- [ ] **Step 3:** Test authentication flow with Firebase Admin SDK
- [ ] **Step 4:** Test item CRUD operations
- [ ] **Step 5:** Test matching algorithm
- [ ] **Step 6:** Test notifications
- [ ] **Step 7:** Deploy new backend to Vercel
- [ ] **Step 8:** Update frontend to call new backend
- [ ] **Step 9:** Migrate data from old MongoDB to new schema
- [ ] **Step 10:** Decommission old backend

---

## Summary Table

| Component | Where Stored | Type | Status |
|-----------|--------------|------|--------|
| User Auth | Firebase | Cloud | ✓ Working |
| User Profile | Old Backend DB | MongoDB | ✓ Working |
| Items | Old Backend DB | MongoDB | ✓ Working |
| Notifications | Old Backend DB | MongoDB | ⚠️ Basic |
| Matching | Not Implemented | - | ❌ Ready in new backend |
| JWT Token | Browser localStorage | Local | ✓ Working |
| UI State | React State | Memory | ✓ Working |
| Item Images | External URLs | CDN | ✓ Working |
| Search Filters | New Backend Ready | MongoDB | ❌ Ready |
| Location Coords | Not Stored | - | ✓ Ready in new backend |

---

## Next Steps Recommendations

### Immediate (Critical)
1. **Deploy new backend** to production
2. **Migrate MongoDB data** from old to new schema
3. **Update frontend** API calls to use new backend

### Short Term (Important)
1. Implement matching notifications
2. Add location-based search
3. Enable user statistics tracking

### Long Term (Enhancement)
1. Add user rating/reputation system
2. Implement messaging between users
3. Add saved searches
4. Implement offline support
5. Add image caching

---

**Last Updated:** 2026-03-13  
**Status:** NEW Backend built, old backend still in use, ready for migration
