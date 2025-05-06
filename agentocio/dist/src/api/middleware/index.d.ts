/**
 * Middleware Index
 *
 * This file exports all middleware components and provides a setup function
 * to configure them on an Express application instance.
 */
import { Express } from 'express';
import auth from './auth.js';
import validation from './validation.js';
import logging from './logging.js';
export { auth, validation, logging };
interface SetupOptions {
    storage: any;
}
/**
 * Configure middleware for the Express application
 */
export declare function setupMiddleware(app: Express, options: SetupOptions): void;
declare const _default: {
    setupMiddleware: typeof setupMiddleware;
    auth: {
        apiKeyAuth: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response | undefined;
        jwtAuth: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response | undefined;
        authenticate: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response | undefined;
    };
    validation: {
        validateToolInput: (toolName: string) => (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void | import("express").Response;
        validate: (schema: import("zod").ZodType<any>, source?: "body" | "query" | "params") => (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response | undefined;
        schemas: {
            toolExecution: import("zod").ZodObject<{
                name: import("zod").ZodString;
                args: import("zod").ZodAny;
            }, "strip", import("zod").ZodTypeAny, {
                name: string;
                args?: any;
            }, {
                name: string;
                args?: any;
            }>;
            pagination: import("zod").ZodObject<{
                page: import("zod").ZodDefault<import("zod").ZodNumber>;
                limit: import("zod").ZodDefault<import("zod").ZodNumber>;
            }, "strip", import("zod").ZodTypeAny, {
                limit: number;
                page: number;
            }, {
                limit?: number | undefined;
                page?: number | undefined;
            }>;
            id: import("zod").ZodObject<{
                id: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            jobId: import("zod").ZodObject<{
                jobId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                jobId: string;
            }, {
                jobId: string;
            }>;
        };
    };
    logging: {
        requestLogger: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
        detailedLogger: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
        errorLogger: (err: any, req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
        toolCallLogger: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    };
};
export default _default;
