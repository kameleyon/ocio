/**
 * Safe Rate Limiter Utility
 *
 * An alternative implementation of rate limiting that avoids using Map iterators.
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Safe rate limiter middleware
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
