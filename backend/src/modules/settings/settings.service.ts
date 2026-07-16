import { prisma } from '@/lib/prisma.js';
import { NotFoundError } from '@/utils/errors.js';
import type { SettingsInput } from './settings.schemas.js';

export async function getSettings(companyId: string) {
  const settings = await prisma.setting.findUnique({
    where: { companyId },
  });

  if (!settings) {
    throw new NotFoundError('Settings');
  }

  return settings;
}

export async function upsertSettings(companyId: string, input: SettingsInput) {
  const data = Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      if (value === '') return [key, null];
      return [key, value];
    })
  );

  return prisma.setting.upsert({
    where: { companyId },
    update: data,
    create: {
      companyId,
      ...data,
    },
  });
}
