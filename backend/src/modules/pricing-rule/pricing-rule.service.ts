import { CargoType, PricingRuleType, VehicleType } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';
import { NotFoundError } from '@/utils/errors.js';
import type { PricingRuleInput, PricingRuleUpdateInput } from './pricing-rule.schemas.js';

export async function listPricingRules(companyId: string) {
  return prisma.pricingRule.findMany({
    where: { companyId },
    orderBy: [{ type: 'asc' }, { priority: 'desc' }],
  });
}

export async function getPricingRuleById(companyId: string, id: string) {
  const rule = await prisma.pricingRule.findFirst({
    where: { id, companyId },
  });

  if (!rule) {
    throw new NotFoundError('Pricing rule');
  }

  return rule;
}

export async function createPricingRule(companyId: string, input: PricingRuleInput) {
  return prisma.pricingRule.create({
    data: {
      companyId,
      name: input.name,
      type: input.type,
      vehicleType: input.vehicleType ?? null,
      cargoType: input.cargoType ?? null,
      value: input.value,
      minWeight: input.minWeight ?? null,
      maxWeight: input.maxWeight ?? null,
      minDistance: input.minDistance ?? null,
      maxDistance: input.maxDistance ?? null,
      isActive: input.isActive,
      priority: input.priority,
      description: input.description || null,
    },
  });
}

export async function updatePricingRule(
  companyId: string,
  id: string,
  input: PricingRuleUpdateInput
) {
  const rule = await prisma.pricingRule.findFirst({
    where: { id, companyId },
  });

  if (!rule) {
    throw new NotFoundError('Pricing rule');
  }

  return prisma.pricingRule.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.type && { type: input.type }),
      ...(input.vehicleType !== undefined && { vehicleType: input.vehicleType ?? null }),
      ...(input.cargoType !== undefined && { cargoType: input.cargoType ?? null }),
      ...(input.value !== undefined && { value: input.value }),
      ...(input.minWeight !== undefined && { minWeight: input.minWeight ?? null }),
      ...(input.maxWeight !== undefined && { maxWeight: input.maxWeight ?? null }),
      ...(input.minDistance !== undefined && { minDistance: input.minDistance ?? null }),
      ...(input.maxDistance !== undefined && { maxDistance: input.maxDistance ?? null }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.description !== undefined && { description: input.description || null }),
    },
  });
}

export async function deletePricingRule(companyId: string, id: string) {
  const rule = await prisma.pricingRule.findFirst({
    where: { id, companyId },
  });

  if (!rule) {
    throw new NotFoundError('Pricing rule');
  }

  await prisma.pricingRule.delete({ where: { id } });
}

export interface QuoteEstimateInput {
  pickup: string;
  destination: string;
  cargoType: CargoType;
  weight: number;
  vehicleType: VehicleType;
  distanceKm?: number;
}

export interface QuoteBreakdown {
  basePrice: number;
  distancePrice: number;
  weightPrice: number;
  vehicleSurcharge: number;
  cargoSurcharge: number;
  extrasPrice: number;
  taxPrice: number;
  totalPrice: number;
  currency: string;
  distanceKm: number;
  isEstimate: boolean;
}

export async function estimateQuote(
  companyId: string,
  input: QuoteEstimateInput
): Promise<QuoteBreakdown> {
  const rules = await prisma.pricingRule.findMany({
    where: { companyId, isActive: true },
    orderBy: { priority: 'desc' },
  });

  const settings = await prisma.setting.findUnique({ where: { companyId } });
  const currency = settings?.defaultCurrency ?? 'USD';
  const taxRate = Number(settings?.taxRate ?? 0);

  // Estimate distance if not provided
  const distanceKm = input.distanceKm ?? estimateDistance(input.pickup, input.destination);

  let basePrice = 0;
  let perKmRate = 0;
  let perKgRate = 0;
  let minimumFee = 0;
  let vehicleSurcharge = 0;
  let cargoSurcharge = 0;
  let extrasPrice = 0;

  for (const rule of rules) {
    if (!matchesRule(rule, input, distanceKm)) continue;

    switch (rule.type) {
      case 'BASE_FEE':
        basePrice = Number(rule.value);
        break;
      case 'PER_KM':
        perKmRate = Number(rule.value);
        break;
      case 'PER_KG':
        perKgRate = Number(rule.value);
        break;
      case 'MINIMUM_FEE':
        minimumFee = Number(rule.value);
        break;
      case 'VEHICLE_SURCHARGE':
        vehicleSurcharge += Number(rule.value);
        break;
      case 'CARGO_SURCHARGE':
        cargoSurcharge += Number(rule.value);
        break;
      case 'EXTRA_STOP':
        extrasPrice += Number(rule.value);
        break;
    }
  }

  const distancePrice = distanceKm * perKmRate;
  const weightPrice = input.weight * perKgRate;

  let subtotal = basePrice + distancePrice + weightPrice + vehicleSurcharge + cargoSurcharge + extrasPrice;
  subtotal = Math.max(subtotal, minimumFee);

  const taxPrice = subtotal * (taxRate / 100);
  const totalPrice = subtotal + taxPrice;

  return {
    basePrice: Number(basePrice.toFixed(2)),
    distancePrice: Number(distancePrice.toFixed(2)),
    weightPrice: Number(weightPrice.toFixed(2)),
    vehicleSurcharge: Number(vehicleSurcharge.toFixed(2)),
    cargoSurcharge: Number(cargoSurcharge.toFixed(2)),
    extrasPrice: Number(extrasPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
    currency,
    distanceKm: Number(distanceKm.toFixed(1)),
    isEstimate: true,
  };
}

function estimateDistance(pickup: string, destination: string): number {
  // Placeholder: in production this should call Google Maps Distance Matrix API
  // Use a deterministic fallback based on string length difference for demo consistency
  const hash = (s: string) =>
    s.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const base = Math.abs(hash(pickup) - hash(destination)) % 450;
  return Math.max(10, base + 50);
}

function matchesRule(
  rule: Awaited<ReturnType<typeof listPricingRules>>[number],
  input: QuoteEstimateInput,
  distanceKm: number
): boolean {
  if (rule.vehicleType && rule.vehicleType !== input.vehicleType) return false;
  if (rule.cargoType && rule.cargoType !== input.cargoType) return false;
  if (rule.minWeight !== null && input.weight < rule.minWeight) return false;
  if (rule.maxWeight !== null && input.weight > rule.maxWeight) return false;
  if (rule.minDistance !== null && distanceKm < rule.minDistance) return false;
  if (rule.maxDistance !== null && distanceKm > rule.maxDistance) return false;
  return true;
}
