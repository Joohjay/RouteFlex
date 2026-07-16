import { z } from 'zod';
import { NotificationChannel, NotificationStatus } from '@prisma/client';

export const createNotificationSchema = z.object({
  channel: z.nativeEnum(NotificationChannel),
  recipient: z.string().min(1),
  subject: z.string().max(300).optional().or(z.literal('')),
  content: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
});

export const updateNotificationSchema = z.object({
  status: z.nativeEnum(NotificationStatus).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
