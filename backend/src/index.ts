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
// If you don't have these modules, create stubs for them or install them as needed.
import requestLogger from './middleware/requestLogger.js'; // Ensure this file exists
app.use(requestLogger);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import authRoutes from './routes/authRoutes.js'; // Ensure this file exists
import itemRoutes from './routes/itemRoutes.js'; // Ensure this file exists
import searchRoutes from './routes/searchRoutes.js'; // Ensure this file exists
import matchRoutes from './routes/matchRoutes.js'; // Ensure this file exists
import notificationRoutes from './routes/notificationRoutes.js'; // Ensure this file exists

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/notifications', notificationRoutes);

import { errorHandler } from './middleware/errorHandler.js'; // Use named import
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

// Async startup function
async function start() {
  try {
    // Ensure these files exist or stub them out
    const { connectDB } = await import('./utils/db.js');
    await connectDB();
    console.log('[Backend] Connected to MongoDB');

    const { initializeFirebase } = await import('./utils/firebase.js');
    initializeFirebase();
    console.log('[Backend] Firebase initialized');

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
