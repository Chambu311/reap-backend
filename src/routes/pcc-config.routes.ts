import { Router, Request, Response, NextFunction } from "express";
import { PccConfigController } from "../controllers/pcc-config.controller";
import { pccConfigSchema } from "../utils/validation.utils";
import { createResponse, createErrorResponse } from "../utils/response.utils";
import { CreatePccConfigDto } from "../types";
import { validateRequest } from "../middleware/schema.middleware";
import { validateSession } from "../middleware/auth.middleware";
import { facilityController } from "../controllers/facility.controller";
import { errorHandler } from "../utils/error.utils";
const router = Router();
const controller = new PccConfigController();

router.use(validateSession);

router.post(
  "/:organizationId",
  validateRequest(pccConfigSchema),
  async (
    req: Request<{ organizationId: string }, {}, CreatePccConfigDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const session = req.session;
      if (!session) {
        throw errorHandler.unauthorized("Unauthorized");
      }
      const organizationId = parseInt(req.params.organizationId);
      const checkIfUserBelongsToOrganization =
        await facilityController.doesUserBelongToAnyFacility(
          session.userId,
          organizationId
        );
      if (!checkIfUserBelongsToOrganization.data) {
        throw errorHandler.forbidden(
          "User does not belong to this organization"
        );
      }
      const config = await controller.createConfig(organizationId, req.body);
      res.status(201).json(createResponse(config));
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  "/:organizationId",
  async (
    req: Request<{ organizationId: string }, {}, CreatePccConfigDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      if (isNaN(organizationId)) {
        throw errorHandler.badRequest("Invalid organization ID");
      }
      const config = await controller.getConfig(organizationId);
      res.json(createResponse(config));
    } catch (error: any) {
        next(error);
    }
  }
);

router.put(
  "/:organizationId",
  validateRequest(pccConfigSchema),
  async (
    req: Request<{ organizationId: string }, {}, CreatePccConfigDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const session = req.session;
      if (!session) {
        throw errorHandler.unauthorized("Unauthorized");
      }
      const checkIfUserBelongsToOrganization =
        await facilityController.doesUserBelongToAnyFacility(
          session.userId,
          organizationId
        );
      if (!checkIfUserBelongsToOrganization.data) {
        throw errorHandler.forbidden(
          "User does not belong to this organization"
        );
      }
      if (isNaN(organizationId)) {
        throw errorHandler.badRequest("Invalid organization ID");
      }
      const config = await controller.updateConfig(organizationId, req.body);
      res.json(createResponse(config));
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
