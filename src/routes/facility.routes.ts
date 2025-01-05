import { Router, Request, Response } from "express";
import { validateRequest } from "../middleware/schema.middleware";
import {
  createFacilitySchema,
  updateFacilitySchema,
  idParamSchema,
} from "../utils/validation.utils";
import { createResponse } from "../utils/response.utils";
import { FacilityController } from "../controllers/facility.controller";
import { errorHandler } from "../utils/error.utils";

const router = Router();

const facilityController = new FacilityController();


router.post(
  "/",
  validateRequest(createFacilitySchema),
  async (req: Request, res: Response) => {
    const result = await facilityController.createFacility({
      name: req.body.name,
      organizationId: req.body.organizationId,
    });

    if (!result.success) {
      throw errorHandler.badRequest(result.error);
    }
    res.status(201).json(createResponse(result.data));
  }
);

router.get("/", async (_req: Request, res: Response) => {
  const result = await facilityController.listFacilities();

  if (!result.success) {
    throw errorHandler.badRequest(result.error);
  }
  res.json(createResponse(result.data));
});

router.get(
  "/:id",
  validateRequest(idParamSchema),
  async (req: Request, res: Response) => {
    const result = await facilityController.getFacility(
      parseInt(req.params.id)
    );

    if (!result.success) {
      throw errorHandler.badRequest(result.error);
    }
    res.json(createResponse(result.data));
  }
);

router.put(
  "/:id",
  validateRequest(updateFacilitySchema),
  async (req: Request, res: Response) => {
    const result = await facilityController.updateFacility({
      id: parseInt(req.params.id),
      name: req.body.name,
    });

    if (!result.success) {
      throw errorHandler.badRequest(result.error);
    }
    res.json(createResponse(result.data));
  }
);

router.delete(
  "/:id",
  validateRequest(idParamSchema),
  async (req: Request, res: Response) => {
    const result = await facilityController.deleteFacility(
      parseInt(req.params.id)
    );

    if (!result.success) {
      throw errorHandler.badRequest(result.error);
    }
    res.json(createResponse(result.data));
  }
);

export default router;
