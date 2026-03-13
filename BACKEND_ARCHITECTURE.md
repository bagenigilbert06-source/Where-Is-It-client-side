# Backend Architecture Summary

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── firebase.ts          # Firebase initialization
│   ├── middleware/
│   │   ├── auth.ts              # Firebase token verification
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── logger.ts            # Request logging
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── Item.ts              # Item/Lost-Found schema
│   │   └── Notification.ts      # Notification schema
│   ├── services/
│   │   ├── UserService.ts       # User business logic
│   │   ├── ItemService.ts       # Item CRUD operations
│   │   ├── MatchingService.ts   # Matching algorithm
│   │   ├── SearchService.ts     # Advanced search logic
│   │   └── NotificationService.ts # Email notifications
│   ├── routes/
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── items.ts             # Item management endpoints
│   │   ├── search.ts            # Search endpoints
│   │   ├── matches.ts           # Matching endpoints
│   │   └── notifications.ts     # Notification endpoints
│   ├── scripts/
│   │   └── initializeDB.ts      # Database initialization
│   └── index.ts                 # Express app setup
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
└── README.md                    # Backend documentation
```

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 20+ |
| Framework | Express.js | 4.18+ |
| Language | TypeScript | 5.2+ |
| Database | MongoDB | 6.0+ |
| Auth | Firebase Admin SDK | 12.0+ |
| Email | Nodemailer | 6.9+ |
| Security | Helmet | 7.1+ |
| Validation | express-validator | 7.0+ |
| Hosting | Vercel Functions | - |

## API Architecture

### Request Flow

```
Client Request
    ↓
CORS & Security Middleware (Helmet)
    ↓
Request Logger Middleware
    ↓
Route Handler
    ↓
Authentication Middleware (if protected)
    ↓
Input Validation Middleware
    ↓
Business Logic Layer (Services)
    ↓
Database Operations (Models)
    ↓
Response/Error Handler
    ↓
Error Handler Middleware (if error)
    ↓
Client Response
```

## Data Models

### User Collection
```
{
  _id: String (Firebase UID),
  email: String,
  displayName: String,
  profileImage: String,
  location: String,
  createdAt: Date,
  updatedAt: Date,
  notificationPreferences: {
    emailOnMatch: Boolean,
    emailOnRecovery: Boolean,
    emailOnVerification: Boolean,
    emailWeeklyDigest: Boolean
  },
  stats: {
    itemsPosted: Number,
    itemsRecovered: Number,
    itemsClaimed: Number
  }
}
```

### Item Collection
```
{
  _id: ObjectId,
  itemType: "Lost" | "Found",
  title: String,
  description: String,
  category: String,
  location: String,
  coordinates: { lat, lng },
  dateLost: Date,
  uploadedAt: Date,
  images: [String],
  userId: String (Firebase UID),
  status: "active" | "recovered" | "claimed",
  claimedBy: String,
  claimedAt: Date,
  metadata: Object
}
```

### Notification Collection
```
{
  _id: ObjectId,
  userId: String (Firebase UID),
  type: "match" | "recovery" | "verification" | "digest",
  itemId: String,
  relatedUserId: String,
  title: String,
  message: String,
  status: "pending" | "sent" | "failed",
  sentAt: Date,
  createdAt: Date
}
```

## Service Layer Overview

### UserService
- **getOrCreateUser()** - Create user on first login
- **getUserById()** - Retrieve user profile
- **updateUserProfile()** - Update profile information
- **updateNotificationPreferences()** - Manage email settings
- **incrementUserStats()** - Update user statistics

### ItemService
- **createItem()** - Post new lost/found item
- **getItemById()** - Get item details
- **getItems()** - List items with filters
- **updateItem()** - Modify item information
- **deleteItem()** - Remove item
- **claimItem()** - Mark item as recovered
- **searchNearby()** - Find items by location

### MatchingService
- **findMatches()** - Find potential matches using algorithm
- **calculateMatchScore()** - Score similarity (0-1)
- **getMatchReasons()** - Explain why items match

Matching Algorithm:
- Category match (50% weight)
- Location similarity (30% weight)
- Date proximity (20% weight)

### SearchService
- **advancedSearch()** - Full-text + filter search
- **searchByCategory()** - Filter by category
- **searchByLocation()** - Location-based search
- **getTrendingItems()** - Popular items
- **getCategories()** - Available categories
- **getLocations()** - Popular locations

### NotificationService
- **notifyItemMatch()** - Send match email
- **notifyItemRecovery()** - Send recovery email
- **notifyVerificationStatus()** - Send status update
- **getUserNotifications()** - Get notification history

## Authentication & Authorization

### Flow
1. User logs in with Firebase (frontend)
2. Firebase generates ID token
3. Token sent with requests as: `Authorization: Bearer {token}`
4. Backend verifies token with Firebase Admin SDK
5. User UID extracted and available in req.user

### Protected Routes
- POST /api/items - Create item
- PUT /api/items/:id - Update item
- DELETE /api/items/:id - Delete item
- POST /api/items/:id/claim - Claim item
- GET/PUT /api/auth/profile - User profile
- GET/PUT /api/notifications - Notification settings

### Public Routes
- GET /api/items - List items
- GET /api/items/:id - Get item details
- GET /api/search - Search items
- POST /api/auth/verify - Verify token

## Database Indexes

Optimized for query performance:

```
Users:
- email (unique)

Items:
- userId + status (compound)
- category + location (compound)
- itemType + status (compound)
- createdAt (descending)

Notifications:
- userId + status (compound)
- createdAt (descending)
```

## Error Handling

Standard error response format:
```json
{
  "success": false,
  "status": 400,
  "code": "BAD_REQUEST",
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

Common Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security Features

1. **Authentication**: Firebase token verification
2. **Authorization**: User ownership checks
3. **Input Validation**: express-validator on all routes
4. **Headers Security**: Helmet middleware
5. **CORS**: Restricted to frontend domain
6. **Environment Variables**: Secrets not in code
7. **SQL Injection Prevention**: Mongoose parameterized queries
8. **Rate Limiting**: Ready to implement

## Performance Optimizations

1. **Database Indexing**: All frequent queries indexed
2. **Lean Queries**: MongoDB `.lean()` for read-only operations
3. **Pagination**: Default 10 items per page
4. **Connection Pooling**: Mongoose manages pool
5. **Request Logging**: Track API usage

Future optimizations:
- Redis caching layer
- MongoDB aggregation pipelines
- Elasticsearch for full-text search
- Image CDN for uploaded files

## Deployment Architecture

```
Client Browser
    ↓ (HTTPS)
Vercel Edge Network
    ↓
Vercel Functions (Node.js Runtime)
    ↓
MongoDB Atlas Cluster
    ↓
Database (Replicated)
```

## Monitoring & Logging

### Request Logging
```
[METHOD] /path - STATUS_CODE (DURATION_MS)
Example: [POST] /api/items - 201 (145ms)
```

### Error Logging
```
[Error] CODE - STATUS: MESSAGE
Stack trace in development mode
```

### Available Logs
- Vercel Runtime Logs
- Application console.log statements
- MongoDB query logs
- Firebase authentication logs

## Scalability Roadmap

### Phase 1 (Current)
- Single MongoDB cluster
- Vercel serverless functions
- Basic caching with HTTP headers

### Phase 2
- Redis caching layer
- MongoDB sharding for large datasets
- Image CDN integration
- Database read replicas

### Phase 3
- Elasticsearch for advanced search
- Event-driven architecture (message queues)
- GraphQL API option
- Real-time notifications (WebSockets)

### Phase 4
- Multi-region deployment
- Advanced analytics
- Machine learning for better matching
- Microservices architecture

## Testing Strategy

### Unit Tests (Recommended)
- Service layer logic
- Matching algorithm
- Search filters

### Integration Tests (Recommended)
- API endpoints
- Database operations
- Authentication flow

### Load Testing
- Test with 100+ concurrent users
- Monitor response times
- Identify bottlenecks

## Backup & Disaster Recovery

### Automated Backups
- MongoDB Atlas daily snapshots
- 30-day retention
- Test restore procedures

### Data Protection
- Firebase admin key encrypted
- Environment variables in Vercel
- Database credentials not in code

## Future Enhancements

1. **Advanced Matching**: ML-based matching algorithm
2. **Real-time Updates**: WebSocket support
3. **Analytics**: User behavior tracking
4. **API Documentation**: Swagger/OpenAPI
5. **GraphQL**: GraphQL query support
6. **Webhooks**: Event-based integrations
7. **Rate Limiting**: Per-user API quotas
8. **Caching**: Redis layer
9. **Search**: Elasticsearch integration
10. **Moderation**: Admin verification system

## Development Workflow

1. Create feature branch
2. Implement in TypeScript
3. Test locally with `npm run dev`
4. Build with `npm run build`
5. Push to GitHub
6. Vercel auto-deploys on merge

## Documentation

- Backend README.md - Setup & API reference
- BACKEND_INTEGRATION_GUIDE.md - Frontend integration
- DEPLOYMENT_GUIDE.md - Production deployment
- Code comments - Inline documentation
