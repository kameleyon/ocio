/**
 * Rate Limiter Utility
 *
 * This file provides rate limiting functionality for the API.
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Rate limiter middleware
 */
export declare const rateLimiter: (options?: {
    windowMs?: number;
    max?: number;
    message?: string;
}) => (req: Request, res: Response, next: NextFunction) => void | Response;
declare const _default: {
    rateLimiter: (options?: {
        windowMs?: number;
        max?: number;
        message?: string;
    }) => (req: Request, res: Response, next: NextFunction) => void | Response;
};
export default _default;
