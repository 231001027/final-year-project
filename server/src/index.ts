import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import teamsRoutes from './routes/teams.routes.js';
import allocationsRoutes from './routes/allocations.routes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { connectRedis, disconnectRedis } from './db/redis.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();

// Required when deploying behind Render/Reverse Proxy
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3001;

// Allowed Frontend URLs
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'https://final-year-project-nine-coral.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman/mobile apps/no origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.warn(`Blocked CORS request from ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

// -----------------------------
// Rate Limiter
// -----------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false,

  // Skip login routes
  skip: (req) => req.path.startsWith('/api/auth'),

  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

app.use('/api', limiter);

// -----------------------------
// Health Check
// -----------------------------
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'ProjectPortal API is running',
  });
});

// -----------------------------
// Routes
// -----------------------------
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/allocations', allocationsRoutes);

// -----------------------------
// Error Handler
// -----------------------------
app.use(errorHandler);

// -----------------------------
// Redis (Optional)
// -----------------------------
(async () => {
  try {
    await connectRedis();
    logger.info('Redis connected successfully');
  } catch (err) {
    logger.warn('Redis unavailable. Continuing without cache.');
  }
})();

// -----------------------------
// Start Server
// -----------------------------
const server = app.listen(PORT, () => {
  logger.info(`ProjectPortal API running on port ${PORT}`);
});

// -----------------------------
// Graceful Shutdown
// -----------------------------
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down server...`);

  server.close(async () => {
    try {
      await disconnectRedis();
      logger.info('Redis disconnected');
    } catch (err) {
      logger.warn('Redis already disconnected');
    }

    logger.info('Server shut down successfully');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));