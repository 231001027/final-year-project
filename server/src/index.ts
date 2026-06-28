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
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'https://final-year-project-nine-coral.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.use(express.json());

// Rate limiting middleware (temporarily disabled)
// if (process.env.NODE_ENV === 'production') {
//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // Limit each IP
//     message: 'Too many requests from this IP, please try again later.',
//     standardHeaders: true,
//     legacyHeaders: false,
//     skip: (req) => req.path.startsWith('/api/auth'), // Skip auth routes
//   });
//   app.use('/api/', limiter);
// }

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/allocations', allocationsRoutes);

app.use(errorHandler);

// Connect to Redis on startup
connectRedis().catch(console.error);

const server = app.listen(PORT, async () => {
  logger.info(`ProjectPortal API running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await disconnectRedis();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await disconnectRedis();
    process.exit(0);
  });
});
