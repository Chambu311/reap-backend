// src/utils/response.utils.ts

import { ApiResponse } from "../types";


  /**
   * Creates a standardized API response object
   * @param data The data to be included in the response
   * @param success Whether the operation was successful (defaults to true)
   */
  export const createResponse = <T>(data: T, success = true): ApiResponse<T> => ({
    success,
    data,
  });
  
  /**
   * Creates an error response
   * @param message Error message or error object
   */
  export const createErrorResponse = (message: string | Error): ApiResponse<string> => ({
    success: false,
    data: message instanceof Error ? message.message : message,
  });
  