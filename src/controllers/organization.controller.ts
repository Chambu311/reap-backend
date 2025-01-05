import { Organization } from "@prisma/client";
import { prisma } from "../app";
import {
  ApiResponse,
  CreateOrganizationDto,
  OrganizationWithPccConfig,
} from "../types";
import { facilityController } from "./facility.controller";
import { pccConfigController } from "./pcc-config.controller";
import { userController } from "./user.controller";

export class OrganizationController {
  async listOrganizations(): Promise<ApiResponse<Organization[]>> {
    const organizations = await prisma.organization.findMany();
    return { success: true, data: organizations };
  }

  async getOrganization(
    id: number
  ): Promise<ApiResponse<OrganizationWithPccConfig>> {
    try {
      const organization = await prisma.organization.findUnique({
        where: { id },
        include: { pccConfig: true },
      });
      if (!organization) {
        throw new Error("Organization not found");
      }
      const pccConfig = await pccConfigController.getConfig(
        organization.id
      );
      const facilities =
        await facilityController.listFacilitiesByOrganizationId(
          organization.id
        );
      return {
        success: true,
        data: {
          ...organization,
          pccConfig: pccConfig.data,
          facilities: facilities.data,
        },
      } as ApiResponse<OrganizationWithPccConfig>;
    } catch (error) {
      return { success: false, error };
    }
  }

  async createOrganization(
    data: CreateOrganizationDto
  ): Promise<ApiResponse<Organization>> {
    try {
      const organization = await prisma.organization.create({ data });
      return { success: true, data: organization };
    } catch (error) {
      return { success: false, error };
    }
  }

  public async checkIfUserBelongsToOrganization(
    userId: number,
    organizationId: number
  ): Promise<ApiResponse<boolean>> {
    const isUserInAnyFacility = await facilityController.doesUserBelongToAnyFacility(userId, organizationId);
    return { success: true, data: isUserInAnyFacility.data };
  }
}

export const organizationController = new OrganizationController();