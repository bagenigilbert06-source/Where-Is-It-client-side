import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local for development, .env for production
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: path.resolve(envFile) });

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize and start server
async function start() {
  try {
    console.log('[Backend] Initializing server...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('[Backend] Connected to MongoDB');
    
    // Initialize Firebase
    initializeFirebase();
    console.log('[Backend] Firebase initialized');
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`[Backend] Server running on port ${PORT}`);
      console.log(`[Backend] Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('[Backend] Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
