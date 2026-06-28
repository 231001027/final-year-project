import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import teamsRoutes from './routes/teams.routes.js';
import allocationsRoutes from './routes/allocations.routes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { connectRedis, disconnectRedis } from './db/redis.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();

// Required for Render
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3001;

// Allowed Frontend URLs
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://final-year-project-nine-coral.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.warn(`Blocked CORS request from ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

// --------------------------------------
// Health Check
// --------------------------------------

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'ProjectPortal API is running',
  });
});

// --------------------------------------
// API Routes
// --------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/allocations', allocationsRoutes);

// --------------------------------------
// Error Handler
// --------------------------------------

app.use(errorHandler);

// --------------------------------------
// Redis (Optional)
// --------------------------------------

(async () => {
  try {
    await connectRedis();
    logger.info('Redis connected successfully');
  } catch (err) {
    logger.warn('Redis not available. Continuing without cache.');
  }
})();

// --------------------------------------
// Start Server
// --------------------------------------

const server = app.listen(PORT, () => {
  logger.info(`ProjectPortal API running on port ${PORT}`);
});

// --------------------------------------
// Graceful Shutdown
// --------------------------------------

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Closing server...`);

  server.close(async () => {
    try {
      await disconnectRedis();
      logger.info('Redis disconnected');
    } catch (err) {
      logger.warn('Redis already disconnected');
    }

    logger.info('Server stopped successfully');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));