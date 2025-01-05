import { NextFunction, Router, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { createResponse } from "../utils/response.utils";
import { errorHandler } from "../utils/error.utils";
import { validateSession } from "../middleware/auth.middleware";

const router = Router();
const userController = new UserController();


router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userController.signIn(req.body.email);
    if (response.success) {
      res.json(createResponse(response.data));
    } else {
      throw errorHandler.internal(response.error);
    }
  } catch (error) {
    next(error);
  }
}); 

router.post('/signout', validateSession, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = req.session;
    if (!session) {
      throw errorHandler.unauthorized("Unauthorized");
    }
    const response = await userController.signOut(session.id);
    if (response.success) {
      res.json(createResponse(response.data));
    } else {
      throw errorHandler.internal(response.error);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/validate-session', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userController.getSignedInUser(req.query.token as string);
    if (response.success) {
      res.json(createResponse(response.data));
    } else {
      throw errorHandler.internal(response.error);
    }
  } catch (error) {
    next(error);
  }
});

export default router;