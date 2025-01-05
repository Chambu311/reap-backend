import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { createResponse } from '../utils/response.utils';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json(createResponse(error.errors, false));
    }
  };
};