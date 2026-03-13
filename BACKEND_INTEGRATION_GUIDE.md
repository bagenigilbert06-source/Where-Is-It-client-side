# Backend Integration Guide

## Overview

The new backend provides a RESTful API for the Lost & Found platform. This guide explains how to integrate the frontend with the backend.

## Base URL

```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

Update `.env` file with:
```
REACT_APP_API_URL=http://localhost:3001/api
```

For production:
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Authentication

All protected endpoints require a Firebase ID token:

```javascript
// In your Firebase authentication setup
const token = await user.getIdToken();

// Send with requests
axios.headers.Authorization = `Bearer ${token}`;
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/verify` - Verify Firebase token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/notifications` - Update notification preferences

### Items
- `GET /api/items` - List all items
- `GET /api/items/:id` - Get item details
- `POST /api/items` - Create new item (auth required)
- `PUT /api/items/:id` - Update item (auth required)
- `DELETE /api/items/:id` - Delete item (auth required)
- `POST /api/items/:id/claim` - Claim item (auth required)
- `POST /api/items/:id/claim-with-notification` - Claim with notification (auth required)
- `GET /api/items/user/:userId` - Get user's items
- `GET /api/items/:id/matches` - Get matches for item

### Search
- `GET /api/search` - Advanced search
- `GET /api/search/nearby` - Find nearby items
- `GET /api/search/trending` - Get trending items
- `GET /api/search/categories` - Get available categories
- `GET /api/search/locations` - Get popular locations

### Matching
- `GET /api/matches/item/:itemId` - Get matches for item
- `GET /api/matches/user` - Get matches for all user items

### Notifications
- `GET /api/notifications/preferences` - Get notification settings
- `PUT /api/notifications/preferences` - Update settings
- `POST /api/notifications/send-test` - Send test email
- `GET /api/notifications/history` - Get notification history

## Using the API Service

### Import the service
```javascript
import {
  authService,
  itemsService,
  searchService,
  matchingService,
  notificationService,
} from './services/apiService.js';
```

### Authentication Examples

```javascript
// Verify user token
const user = await authService.verifyToken(firebaseToken);

// Get current user
const currentUser = await authService.getCurrentUser();

// Update profile
await authService.updateProfile({
  displayName: 'John Doe',
  location: 'Campus Area',
  profileImage: 'https://example.com/image.jpg',
});

// Update notifications
await authService.updateNotifications({
  emailOnMatch: true,
  emailOnRecovery: true,
  emailOnVerification: false,
  emailWeeklyDigest: true,
});
```

### Items Examples

```javascript
// Get all items
const { data, pagination } = await itemsService.getAllItems(
  { category: 'Electronics', itemType: 'Lost' },
  1,
  10
);

// Get item details
const item = await itemsService.getItemById('item-id');

// Create item
const newItem = await itemsService.createItem({
  itemType: 'Lost',
  title: 'Black Wallet',
  description: 'Lost near library',
  category: 'Accessories',
  location: 'Campus Library',
  dateLost: new Date(),
  images: ['image-url-1', 'image-url-2'],
  coordinates: { lat: 1.3521, lng: 103.8198 },
});

// Update item
await itemsService.updateItem('item-id', {
  description: 'Updated description',
  status: 'recovered',
});

// Delete item
await itemsService.deleteItem('item-id');

// Claim item
const claimedItem = await itemsService.claimItem('item-id');

// Claim with notification (owner gets email)
const claimedWithNotif = await itemsService.claimItemWithNotification('item-id');
```

### Search Examples

```javascript
// Advanced search
const results = await searchService.search(
  {
    searchTerm: 'wallet',
    itemType: 'Lost',
    category: 'Accessories',
    location: 'Campus',
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
  },
  1,
  10
);

// Search nearby
const nearbyItems = await searchService.searchNearby(
  1.3521, // latitude
  103.8198, // longitude
  5 // radius in km
);

// Get categories
const categories = await searchService.getCategories();
// ['Electronics', 'Accessories', 'Documents', ...]

// Get locations
const locations = await searchService.getLocations();
// ['Campus Library', 'Main Gate', 'Cafeteria', ...]
```

### Matching Examples

```javascript
// Get matches for specific item
const matches = await matchingService.getMatches('item-id');
// Returns: [
//   {
//     lostItem: {...},
//     foundItem: {...},
//     score: 0.85,
//     reasons: ['Both items are Electronics', 'Found in similar location']
//   },
//   ...
// ]

// Get matches for all user items
const allMatches = await matchingService.getUserMatches();
```

### Notification Examples

```javascript
// Get notification preferences
const prefs = await notificationService.getPreferences();

// Update preferences
await notificationService.updatePreferences({
  emailOnMatch: true,
  emailOnRecovery: false,
  emailOnVerification: true,
  emailWeeklyDigest: false,
});

// Send test email
await notificationService.sendTestNotification();

// Get notification history
const history = await notificationService.getNotificationHistory(20);
```

## Error Handling

All API errors follow this format:

```javascript
{
  success: false,
  status: 400,
  code: 'BAD_REQUEST',
  message: 'Error message here',
  stack: '...' // Only in development
}
```

### Handle errors with try-catch

```javascript
try {
  const item = await itemsService.createItem(itemData);
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.response?.status === 400) {
    // Bad request - show validation errors
    console.log(error.response.data.message);
  } else {
    // Server error
    console.error('Error:', error);
  }
}
```

## Environment Variables

Create `.env` file in the frontend root:

```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## Migration from Old Backend

### Old endpoints → New endpoints

| Old | New |
|-----|-----|
| `GET /notifications/preferences/:email` | `GET /api/notifications/preferences` |
| `PUT /notifications/preferences/:email` | `PUT /api/notifications/preferences` |
| `POST /notifications/item-match` | `POST /api/items/:id/claim-with-notification` |

### Update notificationService.js

Replace the old `src/services/notificationService.js` with calls to the new `apiService.js`:

```javascript
// Old
const prefs = await getNotificationPreferences(userEmail);

// New
const prefs = await notificationService.getPreferences();
```

## Deployment Considerations

### Backend Deployment (Vercel Functions)
1. Deploy to Vercel from the `backend/` folder
2. Set environment variables in Vercel dashboard
3. Get the deployed URL (e.g., `https://your-backend.vercel.app`)

### Frontend Configuration
Update `REACT_APP_API_URL` in Vercel project settings to point to deployed backend.

### CORS Setup
Backend is configured to accept requests from `FRONTEND_URL` environment variable. Update in backend `.env`:
```
FRONTEND_URL=https://your-frontend-domain.com
```

## Testing API Endpoints

Use Postman or curl to test endpoints:

```bash
# Get all items
curl http://localhost:3001/api/items

# Get item details
curl http://localhost:3001/api/items/item-id

# Create item (requires auth token)
curl -X POST http://localhost:3001/api/items \
  -H "Authorization: Bearer your-firebase-token" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "Lost",
    "title": "Black Wallet",
    "description": "Lost near library",
    "category": "Accessories",
    "location": "Campus",
    "dateLost": "2024-01-15"
  }'
```

## Support

For issues or questions about the backend API:
1. Check the backend README.md for more details
2. Review the TypeScript types in backend/src/
3. Check error responses for detailed messages
4. Review backend logs for debugging
