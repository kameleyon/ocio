/**
 * Logging Middleware
 *
 * This middleware handles request/response logging for the API wrapper.
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Standard HTTP request logger middleware using Morgan
 */
export declare const requestLogger: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
/**
 * Detailed request/response logger for debugging
 */
export declare const detailedLogger: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Error logging middleware
 */
export declare const errorLogger: (err: any, req: Request, res: Response, next: NextFunction) => void;
/**
 * Tool call logging - records all tool executions to the database/filesystem
 */
export declare const toolCallLogger: (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    requestLogger: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
    detailedLogger: (req: Request, res: Response, next: NextFunction) => void;
    errorLogger: (err: any, req: Request, res: Response, next: NextFunction) => void;
    toolCallLogger: (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
