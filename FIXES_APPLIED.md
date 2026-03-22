# Fixes Applied - Firebase & MongoDB Integration

## Overview
Fixed critical issues preventing proper authentication and database synchronization between Firebase and MongoDB.

## Issues Fixed

### 1. Missing `/api/auth/register` Endpoint
**Problem**: Frontend was attempting to POST to `/api/auth/register` but the route didn't exist, resulting in 404 errors.

**Solution**: Added complete `/register` endpoint in `backend/src/routes/auth.ts` that:
- Authenticates requests using Firebase token
- Validates email and optional profile fields
- Creates or syncs user in MongoDB
- Returns appropriate HTTP status (201 for new users, 200 for existing)
- Handles profile image (photoURL) from Google OAuth

**Files Modified**: `backend/src/routes/auth.ts`

### 2. UserService Missing PhotoURL Parameter
**Problem**: The `getOrCreateUser()` method didn't accept or handle the `photoURL` parameter from Google OAuth.

**Solution**: Enhanced `UserService.getOrCreateUser()` to:
- Accept optional `photoURL` parameter
- Store photoURL as `profileImage` in MongoDB
- Update profile image for existing users if not already set
- Add `isNew` flag to track whether user was newly created

**Files Modified**: `backend/src/services/UserService.ts`

### 3. Duplicate Email Index Warning
**Problem**: Mongoose warning about duplicate schema index on email field due to both `unique: true` and `schema.index()`.

**Solution**: Removed redundant `UserSchema.index({ email: 1 })` call since `unique: true` on the email field already creates the index.

**Files Modified**: `backend/src/models/User.ts`

## Verification

### Test the Registration Flow
1. Start backend: `pnpm run dev:backend`
2. Start frontend: `pnpm run dev`
3. Sign up with email/password - should create user in MongoDB
4. Sign in with Google - should sync user profile to MongoDB

### Check Logs for Success
Backend should show:
```
[POST] /api/auth/register - 201 (time)
[POST] /api/auth/register - 200 (time)
```

Frontend console should show:
```
[v0] Syncing Google user to MongoDB
[v0] MongoDB sync successful
```

## API Routes Summary

### POST /api/auth/register
**Authentication**: Required (Firebase token)
**Purpose**: Register/sync user with MongoDB

Request:
```json
{
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://example.com/photo.jpg"
}
```

Response (201 - New User):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "firebase-uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "profileImage": "https://example.com/photo.jpg",
    "location": null,
    "createdAt": "2024-03-22T10:00:00Z"
  }
}
```

Response (200 - Existing User):
```json
{
  "success": true,
  "message": "User synced successfully",
  "user": { ... }
}
```

### POST /api/auth/verify
**Authentication**: Required (Firebase token)
**Purpose**: Verify token and get/create user

### GET /api/auth/me
**Authentication**: Required (Firebase token)
**Purpose**: Get current user profile

### PUT /api/auth/profile
**Authentication**: Required (Firebase token)
**Purpose**: Update user profile

### PUT /api/auth/notifications
**Authentication**: Required (Firebase token)
**Purpose**: Update notification preferences

## Testing Checklist

- [ ] Backend starts without errors
- [ ] MongoDB connects successfully
- [ ] Firebase initializes successfully
- [ ] No "Duplicate schema index" warnings
- [ ] Email/password registration creates user in MongoDB
- [ ] Google OAuth sign-in syncs user to MongoDB
- [ ] User profile includes photoURL from Google
- [ ] Subsequent logins with same email don't duplicate user
- [ ] All auth endpoints return appropriate status codes

## Files Modified Summary

| File | Changes |
|------|---------|
| `backend/src/routes/auth.ts` | Added `/register` endpoint with validation and user sync |
| `backend/src/services/UserService.ts` | Added photoURL support and isNew flag |
| `backend/src/models/User.ts` | Removed duplicate email index definition |

## Next Steps

1. Test full authentication flow
2. Verify MongoDB user data is created/updated correctly
3. Test profile image synchronization from Google OAuth
4. Check notification preferences are saved
5. Test all other API endpoints with authenticated requests
