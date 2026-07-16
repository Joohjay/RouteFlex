import winston from 'winston';
import { config } from '@/config/index.js';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const devFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${String(ts)} [${level}]: ${String(message)}${stack ? `\n${String(stack)}` : ''}`;
});

export const logger = winston.createLogger({
  level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  defaultMeta: { service: 'jj-transport-api' },
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        config.NODE_ENV === 'development' ? devFormat : json()
      ),
    }),
  ],
});

export const requestLogger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: combine(timestamp(), json()),
    }),
  ],
});
