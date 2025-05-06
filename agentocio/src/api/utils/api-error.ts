/**
 * API Error Utility
 * 
 * This file provides a standardized way to handle API errors.
 */

/**
 * API error codes
 */
export enum ApiErrorCode {
  // General errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  
  // Authentication errors
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  AUTH_INVALID_API_KEY = 'AUTH_INVALID_API_KEY',
  AUTH_ACCESS_DENIED = 'AUTH_ACCESS_DENIED',
  
  // Tool errors
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  TOOL_ACCESS_DENIED = 'TOOL_ACCESS_DENIED',
  TOOL_EXECUTION_ERROR = 'TOOL_EXECUTION_ERROR',
  
  // Job errors
  JOB_NOT_FOUND = 'JOB_NOT_FOUND',
  JOB_CANCELLED = 'JOB_CANCELLED',
  JOB_FAILED = 'JOB_FAILED',
  JOB_TIMEOUT = 'JOB_TIMEOUT',
  JOB_NOT_COMPLETED = 'JOB_NOT_COMPLETED',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

/**
 * API Error class for standardized error handling
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode;
  public readonly details?: any;

  constructor(message: string, code: ApiErrorCode, status: number = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  /**
   * Convert to a JSON response object
   */
  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        ...(this.details ? { details: this.details } : {})
      }
    };
  }
}

/**
 * Factory methods for common API errors
 */
export const ApiErrors = {
  // General errors
  internal: (message = 'Internal server error', details?: any) => 
    new ApiError(message, ApiErrorCode.INTERNAL_ERROR, 500, details),
  
  validation: (message = 'Validation error', details?: any) => 
    new ApiError(message, ApiErrorCode.VALIDATION_ERROR, 400, details),
  
  notFound: (message = 'Resource not found', details?: any) => 
    new ApiError(message, ApiErrorCode.NOT_FOUND, 404, details),
  
  badRequest: (message = 'Bad request', details?: any) => 
    new ApiError(message, ApiErrorCode.BAD_REQUEST, 400, details),
  
  // Authentication errors
  authRequired: (message = 'Authentication required') => 
    new ApiError(message, ApiErrorCode.AUTH_REQUIRED, 401),
  
  invalidToken: (message = 'Invalid or expired token') => 
    new ApiError(message, ApiErrorCode.AUTH_INVALID_TOKEN, 401),
  
  invalidApiKey: (message = 'Invalid API key') => 
    new ApiError(message, ApiErrorCode.AUTH_INVALID_API_KEY, 401),
  
  accessDenied: (message = 'Access denied') => 
    new ApiError(message, ApiErrorCode.AUTH_ACCESS_DENIED, 403),
  
  // Tool errors
  toolNotFound: (toolName: string) => 
    new ApiError(`Tool '${toolName}' not found`, ApiErrorCode.TOOL_NOT_FOUND, 404),
  
  toolAccessDenied: (toolName: string) => 
    new ApiError(`Tool '${toolName}' is not accessible`, ApiErrorCode.TOOL_ACCESS_DENIED, 403),
  
  toolExecutionError: (toolName: string, details?: any) => 
    new ApiError(`Error executing tool '${toolName}'`, ApiErrorCode.TOOL_EXECUTION_ERROR, 500, details),
  
  // Job errors
  jobNotFound: (jobId: string) => 
    new ApiError(`Job with ID '${jobId}' not found`, ApiErrorCode.JOB_NOT_FOUND, 404),
  
  jobNotCompleted: (jobId: string, status: string) => 
    new ApiError(`Job '${jobId}' is not completed (status: ${status})`, ApiErrorCode.JOB_NOT_COMPLETED, 400),
  
  // Rate limiting
  rateLimitExceeded: (message = 'Rate limit exceeded') => 
    new ApiError(message, ApiErrorCode.RATE_LIMIT_EXCEEDED, 429)
};

/**
 * Error handling middleware for Express
 */
export function errorHandlerMiddleware(error: any, req: any, res: any, next: any) {
  console.error('API Error:', error);
  
  // If it's an ApiError instance, use its properties
  if (error instanceof ApiError) {
    return res.status(error.status).json(error.toJSON());
  }
  
  // Handle validation errors from zod or other validators
  if (error.name === 'ZodError') {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        code: ApiErrorCode.VALIDATION_ERROR,
        details: error.format()
      }
    });
  }
  
  // For other errors, return a generic 500 internal server error
  return res.status(500).json({
    error: {
      message: error.message || 'Internal Server Error',
      code: ApiErrorCode.INTERNAL_ERROR
    }
  });
}

export default {
  ApiError,
  ApiErrorCode,
  ApiErrors,
  errorHandlerMiddleware
};