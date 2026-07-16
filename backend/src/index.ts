import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from '@/config/index.js';
import { prisma } from '@/lib/prisma.js';
import { errorHandler } from '@/middleware/error.js';
import { strictLimiter } from '@/middleware/rate-limit.js';
import { router } from '@/routes/index.js';
import { logger } from '@/lib/logger.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(strictLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1', router);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: 'Route not found',
    error: { code: 'ROUTE_NOT_FOUND', message: 'The requested resource was not found.' },
  });
});

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  logger.info(`JJ Transport API running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('HTTP server closed and database disconnected.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));
