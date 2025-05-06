/**
 * Authentication Middleware
 *
 * This middleware handles API key and JWT token validation.
 */
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                permissions: string[];
            };
            apiKey?: string;
        }
    }
}
/**
 * Verifies API key from request headers
 */
export declare const apiKeyAuth: (req: Request, res: Response, next: NextFunction) => Response | undefined;
/**
 * Verifies JWT token from Authorization header
 */
export declare const jwtAuth: (req: Request, res: Response, next: NextFunction) => Response | undefined;
/**
 * Middleware that allows either API key or JWT token
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Response | undefined;
declare const _default: {
    apiKeyAuth: (req: Request, res: Response, next: NextFunction) => Response | undefined;
    jwtAuth: (req: Request, res: Response, next: NextFunction) => Response | undefined;
    authenticate: (req: Request, res: Response, next: NextFunction) => Response | undefined;
};
export default _default;
