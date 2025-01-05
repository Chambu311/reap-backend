import { Request, Response, NextFunction } from "express";
import { userController } from "../controllers/user.controller";

export const validateSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      if (!sessionId) {
        res.status(401).json({ message: 'No session ID provided' });
        return;
      }

      const response = await userController.getSignedInUser(sessionId);
      if (response.error || !response.data?.session) {
        res.status(401).json({ message: 'Invalid session' });
        return;
      }

      req.session = {
        id: response.data.session.id,
        userId: response.data.session.userId,
      };
      next();
    } catch (error) {
      console.error('Error validating session:', error);
      res.status(401).json({ message: "Authentication failed" });
    }
};
