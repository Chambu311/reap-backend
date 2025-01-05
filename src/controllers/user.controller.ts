import { Session, User } from "@prisma/client";
import { prisma } from "../app";
import { ApiResponse } from "../types";
import { createErrorResponse } from "../utils/response.utils";

export class UserController {
  public async signIn(email: string): Promise<ApiResponse<{ token: string }>> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const sessions = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    return {
      success: true,
      data: {
        token: sessions.id,
      },
    };
  }

  public async signOut(token: string): Promise<ApiResponse<{ message: string }>> {
    await prisma.session.delete({
      where: {
        id: token,
      },
    });
    return { success: true, data: { message: "Signed out successfully" } };
  }

  public async getById(id: number): Promise<ApiResponse<User>> {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return { success: true, data: user };
  }

  public async getSignedInUser(token: string): Promise<ApiResponse<{ user: User, session: Session }>> {
    const session = await prisma.session.findUnique({
      where: {
        id: token,
      },
    });
    if (!session) {
      throw new Error("Session not found");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return { success: true, data: { user, session } };
  }

}

export const userController = new UserController();