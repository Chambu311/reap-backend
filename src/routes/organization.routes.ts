import { Router, Request, Response, NextFunction } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { organizationSchema } from '../utils/validation.utils';
import { validateRequest } from '../middleware/schema.middleware';
import { createResponse, createErrorResponse } from '../utils/response.utils';
import { CreateOrganizationDto } from '../types';
import { validateSession } from '../middleware/auth.middleware';
import { facilityController } from '../controllers/facility.controller';
import { errorHandler } from '../utils/error.utils';

const router = Router();
const controller = new OrganizationController();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizations = await controller.listOrganizations();
    if (organizations.success) {
      res.json(createResponse(organizations.data));
    } else {
      throw errorHandler.internal(organizations.error);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw errorHandler.badRequest('Invalid ID format');
    }

    const organization = await controller.getOrganization(id);
    if (organization.success) {
      res.json(createResponse(organization.data));
    } else {
      throw errorHandler.internal(organization.error);
    }
  } catch (error: any) {
    if (error.message === 'Organization not found') {
      throw errorHandler.notFound(error.message);
    } else {
      next(error);
    }
  }
});

router.post('/', 
  validateRequest(organizationSchema),
  async (req: Request<{}, {}, CreateOrganizationDto>, res: Response, next: NextFunction) => {
    try {
      const session = req.session;
      if (!session) {
        throw errorHandler.unauthorized('Unauthorized');
      }
      const organization = await controller.createOrganization(req.body);
      if (organization.success) {
        res.status(201).json(createResponse(organization.data));
      } else {
        throw errorHandler.internal(organization.error);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;