import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const pccConfigSchema = z.object({
  pccOrgId: z.string().min(1, 'PCC Org ID is required'),
  pccOrgUuid: z.string().min(1, 'PCC Org UUID is required'),
});

export const createFacilitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Facility name is required'),
    organizationId: z.number().int().positive('Organization ID must be a positive integer'),
  }),
});

export const updateFacilitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Facility name is required'),
  }),
  params: z.object({
    id: z.string().refine((val) => !isNaN(parseInt(val)), {
      message: 'Facility ID must be a valid number',
    }),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => !isNaN(parseInt(val)), {
      message: 'Facility ID must be a valid number',
    }),
  }),
});