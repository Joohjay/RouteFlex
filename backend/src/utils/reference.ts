import { prisma } from '@/lib/prisma.js';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omit confusing chars

function generateRandomSegment(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return result;
}

export function generateReferenceNumber(): string {
  const prefix = 'JJT';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  const random = generateRandomSegment(4);
  return `${prefix}-${date}-${random}`;
}

export async function generateUniqueReferenceNumber(): Promise<string> {
  let reference: string;
  let exists = true;
  let attempts = 0;

  do {
    reference = generateReferenceNumber();
    const existing = await prisma.transportRequest.findUnique({
      where: { referenceNumber: reference },
      select: { id: true },
    });
    exists = !!existing;
    attempts++;
  } while (exists && attempts < 10);

  if (exists) {
    throw new Error('Unable to generate unique reference number');
  }

  return reference;
}
