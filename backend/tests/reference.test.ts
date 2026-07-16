import { describe, expect, it } from 'vitest';
import { generateReferenceNumber } from '../src/utils/reference';

describe('generateReferenceNumber', () => {
  it('generates a reference number with correct format', () => {
    const ref = generateReferenceNumber();
    expect(ref).toMatch(/^JJT-\d{6}-[A-Z0-9]{4}$/);
  });

  it('generates unique reference numbers', () => {
    const refs = new Set(Array.from({ length: 100 }, () => generateReferenceNumber()));
    expect(refs.size).toBe(100);
  });
});
