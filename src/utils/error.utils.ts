export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    console.log(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = {
  notFound: (message: string = 'Resource not found') => {
    return new ApiError(404, message, 'NOT_FOUND');
  },
  badRequest: (message: string = 'Bad request') => {
    return new ApiError(400, message, 'BAD_REQUEST');
  },
  unauthorized: (message: string = 'Unauthorized') => {
    return new ApiError(401, message, 'UNAUTHORIZED');
  },
  forbidden: (message: string = 'Forbidden') => {
    return new ApiError(403, message, 'FORBIDDEN');
  },
  internal: (message: string = 'Internal server error') => {
    return new ApiError(500, message, 'INTERNAL_ERROR');
  }
}; 