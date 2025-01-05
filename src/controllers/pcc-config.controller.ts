import { PccConfiguration } from "@prisma/client";
import { prisma } from "../app";
import { CreatePccConfigDto, ApiResponse } from "../types";

export class PccConfigController {
  async createConfig(organizationId: number, data: CreatePccConfigDto): Promise<ApiResponse<PccConfiguration>> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    const existingConfig = await prisma.pccConfiguration.findUnique({
      where: { organizationId },
    });

    if (existingConfig) {
      throw new Error("PCC Configuration already exists for this organization");
    }

    try {
      const config = await prisma.pccConfiguration.create({
        data: {
          ...data,
          organizationId,
        },
      });
      return { success: true, data: config };
    } catch (error) {
      return { success: false, error };
    }
  }
  async updateConfig(organizationId: number, data: CreatePccConfigDto): Promise<ApiResponse<PccConfiguration>> {
    try {
      const config = await prisma.pccConfiguration.update({
        where: { organizationId },
        data,
      });
      return { success: true, data: config };
    } catch (error) {
      return { success: false, error };
    }
  }

  public async getConfig(organizationId: number): Promise<ApiResponse<PccConfiguration>> {
    try {
      const config = await prisma.pccConfiguration.findUnique({
        where: { organizationId },
      });
      if (!config) {
        throw new Error("PCC Configuration not found");
      }
      return { success: true, data: config };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export const pccConfigController = new PccConfigController();