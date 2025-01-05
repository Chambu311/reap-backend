import { Request, Response, NextFunction } from "express";
import { createErrorResponse } from "../utils/response.utils";
import { ApiError } from "../utils/error.utils";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(createErrorResponse(error.message));
  } else {
    console.error('Unexpected error from middleware:', error);
    res.status(500).json(createErrorResponse('Internal server error'));
  }
  next();
};
