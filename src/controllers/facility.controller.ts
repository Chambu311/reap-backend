import { Facility, PrismaClient } from "@prisma/client";
import { ApiResponse, CreateFacilityDto, UpdateFacilityDto } from "../types";

export class FacilityController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createFacility(
    params: CreateFacilityDto
  ): Promise<ApiResponse<Facility>> {
    try {
      const facility = await this.prisma.facility.create({
        data: {
          name: params.name,
          organizationId: params.organizationId,
        },
      });

      return { success: true, data: facility };
    } catch (error) {
      return { success: false, error };
    }
  }

  public async getFacility(id: number): Promise<ApiResponse<Facility>> {
    try {
      const facility = await this.prisma.facility.findUnique({
        where: { id },
        include: {
          organization: true,
          users: true,
        },
      });

      if (!facility) {
        return { success: false, error: "Facility not found" };
      }

      return { success: true, data: facility };
    } catch (error) {
      return { success: false, error };
    }
  }

  public async updateFacility(
    params: UpdateFacilityDto
  ): Promise<ApiResponse<Facility>> {
    try {
      const facility = await this.prisma.facility.update({
        where: { id: params.id },
        data: { name: params.name },
      });

      return { success: true, data: facility };
    } catch (error) {
      return { success: false, error };
    }
  }

  public async deleteFacility(
    id: number
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      await this.prisma.facility.delete({
        where: { id },
      });
      return {
        success: true,
        data: { message: "Facility deleted successfully" },
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  public async listFacilitiesByOrganizationId(
    organizationId: number
  ): Promise<ApiResponse<Facility[]>> {
    try {
      const facilities = await this.prisma.facility.findMany({
        where: { organizationId },
      });
      return { success: true, data: facilities };
    } catch (error) {
      return { success: false, error };
    }
  }

  public async doesUserBelongToAnyFacility(
    userId: number,
    organizationId: number
  ): Promise<ApiResponse<boolean>> {
    const facilities = await this.prisma.facility.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        organization: {
          id: organizationId,
        },
      },
    });
    return { success: true, data: facilities.length > 0 };
  }

  public async listFacilities(): Promise<ApiResponse<Facility[]>> {
    try {
      const facilities = await this.prisma.facility.findMany({
        include: {
          organization: true,
          users: true,
        },
      });

      return { success: true, data: facilities };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export const facilityController = new FacilityController();
