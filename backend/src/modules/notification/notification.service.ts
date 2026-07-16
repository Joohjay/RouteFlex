import { NotificationStatus, type Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';
import { sendEmail } from '@/lib/email.js';
import { NotFoundError } from '@/utils/errors.js';
import { logger } from '@/lib/logger.js';
import type { CreateNotificationInput, UpdateNotificationInput } from './notification.schemas.js';

export async function listNotifications(companyId: string) {
  return prisma.notification.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getNotificationById(companyId: string, id: string) {
  const notification = await prisma.notification.findFirst({
    where: { id, companyId },
  });

  if (!notification) {
    throw new NotFoundError('Notification');
  }

  return notification;
}

export async function createNotification(
  companyId: string,
  input: CreateNotificationInput,
  userId?: string
) {
  const notification = await prisma.notification.create({
    data: {
      companyId,
      userId: userId ?? null,
      channel: input.channel,
      recipient: input.recipient,
      subject: input.subject || null,
      content: input.content,
      status: NotificationStatus.PENDING,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });

  // Fire-and-forget send for email
  if (input.channel === 'EMAIL') {
    sendEmailNotification(notification.id).catch((err) =>
      logger.error('Failed to send email notification', { error: err, notificationId: notification.id })
    );
  }

  return notification;
}

export async function updateNotification(
  companyId: string,
  id: string,
  input: UpdateNotificationInput
) {
  const notification = await prisma.notification.findFirst({
    where: { id, companyId },
  });

  if (!notification) {
    throw new NotFoundError('Notification');
  }

  return prisma.notification.update({
    where: { id },
    data: {
      ...(input.status && { status: input.status }),
    },
  });
}

async function sendEmailNotification(notificationId: string): Promise<void> {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.status !== NotificationStatus.PENDING) return;

  try {
    await sendEmail({
      to: notification.recipient,
      subject: notification.subject ?? 'Notification from JJ Transport',
      html: `<p>${notification.content.replace(/\n/g, '<br>')}</p>`,
    });

    await prisma.notification.update({
      where: { id: notificationId },
      data: { status: NotificationStatus.SENT, sentAt: new Date() },
    });
  } catch (error) {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
