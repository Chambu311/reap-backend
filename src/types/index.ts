import { Facility, Organization } from "@prisma/client";

export interface CreateOrganizationDto {
  name: string;
}

export interface PccConfig {
  id: number;
  pccOrgId: string;
  pccOrgUuid: string;
  organizationId: number;
}

export interface CreatePccConfigDto {
  pccOrgId: string;
  pccOrgUuid: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

export interface OrganizationWithPccConfig extends Organization {
  pccConfig: PccConfig;
  facilities: Facility[];
}

export type CreateFacilityDto = {
  name: string;
  organizationId: number;
};

export type UpdateFacilityDto = {
  id: number;
  name: string;
};

declare global {
  namespace Express {
    interface Request {
      session?: {
        id: string;
        userId: number;
      };
    }
  }
}