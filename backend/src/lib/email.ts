import nodemailer from 'nodemailer';
import { config } from '@/config/index.js';
import { logger } from '@/lib/logger.js';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_PORT === 465,
  auth: config.SMTP_USER && config.SMTP_PASSWORD
    ? { user: config.SMTP_USER, pass: config.SMTP_PASSWORD }
    : undefined,
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASSWORD) {
    logger.warn('Email not sent: SMTP not configured', { to: options.to, subject: options.subject });
    return;
  }

  await transporter.sendMail({
    from: options.from ?? config.EMAIL_FROM ?? `JJ Transport <${config.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  logger.info('Email sent', { to: options.to, subject: options.subject });
}
