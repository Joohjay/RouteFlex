import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as companyService from './company.service.js';
import type { CompanyInput, CompanyUpdateInput } from './company.schemas.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const companies = await companyService.listCompanies();
  res.json(successResponse(companies));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const company = await companyService.getCompanyById(id);
  res.json(successResponse(company));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as CompanyInput;
  const company = await companyService.createCompany(input);
  res.status(201).json(successResponse(company, 'Company created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as CompanyUpdateInput;
  const company = await companyService.updateCompany(id, input);
  res.json(successResponse(company, 'Company updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await companyService.deleteCompany(id);
  res.json(successResponse(null, 'Company deleted successfully'));
});
