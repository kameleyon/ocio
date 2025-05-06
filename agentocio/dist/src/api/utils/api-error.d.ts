/**
 * API Error Utility
 *
 * This file provides a standardized way to handle API errors.
 */
/**
 * API error codes
 */
export declare enum ApiErrorCode {
    INTERNAL_ERROR = "INTERNAL_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    NOT_FOUND = "NOT_FOUND",
    BAD_REQUEST = "BAD_REQUEST",
    AUTH_REQUIRED = "AUTH_REQUIRED",
    AUTH_INVALID_TOKEN = "AUTH_INVALID_TOKEN",
    AUTH_INVALID_API_KEY = "AUTH_INVALID_API_KEY",
    AUTH_ACCESS_DENIED = "AUTH_ACCESS_DENIED",
    TOOL_NOT_FOUND = "TOOL_NOT_FOUND",
    TOOL_ACCESS_DENIED = "TOOL_ACCESS_DENIED",
    TOOL_EXECUTION_ERROR = "TOOL_EXECUTION_ERROR",
    JOB_NOT_FOUND = "JOB_NOT_FOUND",
    JOB_CANCELLED = "JOB_CANCELLED",
    JOB_FAILED = "JOB_FAILED",
    JOB_TIMEOUT = "JOB_TIMEOUT",
    JOB_NOT_COMPLETED = "JOB_NOT_COMPLETED",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
}
/**
 * API Error class for standardized error handling
 */
export declare class ApiError extends Error {
    readonly status: number;
    readonly code: ApiErrorCode;
    readonly details?: any;
    constructor(message: string, code: ApiErrorCode, status?: number, details?: any);
    /**
     * Convert to a JSON response object
     */
    toJSON(): {
        error: {
            details?: any;
            message: string;
            code: ApiErrorCode;
        };
    };
}
/**
 * Factory methods for common API errors
 */
export declare const ApiErrors: {
    internal: (message?: string, details?: any) => ApiError;
    validation: (message?: string, details?: any) => ApiError;
    notFound: (message?: string, details?: any) => ApiError;
    badRequest: (message?: string, details?: any) => ApiError;
    authRequired: (message?: string) => ApiError;
    invalidToken: (message?: string) => ApiError;
    invalidApiKey: (message?: string) => ApiError;
    accessDenied: (message?: string) => ApiError;
    toolNotFound: (toolName: string) => ApiError;
    toolAccessDenied: (toolName: string) => ApiError;
    toolExecutionError: (toolName: string, details?: any) => ApiError;
    jobNotFound: (jobId: string) => ApiError;
    jobNotCompleted: (jobId: string, status: string) => ApiError;
    rateLimitExceeded: (message?: string) => ApiError;
};
/**
 * Error handling middleware for Express
 */
export declare function errorHandlerMiddleware(error: any, req: any, res: any, next: any): any;
declare const _default: {
    ApiError: typeof ApiError;
    ApiErrorCode: typeof ApiErrorCode;
    ApiErrors: {
        internal: (message?: string, details?: any) => ApiError;
        validation: (message?: string, details?: any) => ApiError;
        notFound: (message?: string, details?: any) => ApiError;
        badRequest: (message?: string, details?: any) => ApiError;
        authRequired: (message?: string) => ApiError;
        invalidToken: (message?: string) => ApiError;
        invalidApiKey: (message?: string) => ApiError;
        accessDenied: (message?: string) => ApiError;
        toolNotFound: (toolName: string) => ApiError;
        toolAccessDenied: (toolName: string) => ApiError;
        toolExecutionError: (toolName: string, details?: any) => ApiError;
        jobNotFound: (jobId: string) => ApiError;
        jobNotCompleted: (jobId: string, status: string) => ApiError;
        rateLimitExceeded: (message?: string) => ApiError;
    };
    errorHandlerMiddleware: typeof errorHandlerMiddleware;
};
export default _default;
