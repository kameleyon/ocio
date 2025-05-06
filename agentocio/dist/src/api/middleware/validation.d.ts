/**
 * Validation Middleware
 *
 * This middleware validates request payloads against tool schemas
 * from the plugin manager to ensure the data is valid before processing.
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
/**
 * Middleware to validate request body against a tool's schema
 * @param toolName Name of the tool to validate against
 */
export declare const validateToolInput: (toolName: string) => (req: Request, res: Response, next: NextFunction) => void | Response;
/**
 * Generic validation middleware that can validate against any Zod schema
 * @param schema Zod schema to validate against
 * @param source Where to find the data to validate (default: 'body')
 */
export declare const validate: (schema: z.ZodType<any>, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => Response | undefined;
export declare const schemas: {
    toolExecution: z.ZodObject<{
        name: z.ZodString;
        args: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        name: string;
        args?: any;
    }, {
        name: string;
        args?: any;
    }>;
    pagination: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
    }, {
        limit?: number | undefined;
        page?: number | undefined;
    }>;
    id: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    jobId: z.ZodObject<{
        jobId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        jobId: string;
    }, {
        jobId: string;
    }>;
};
declare const _default: {
    validateToolInput: (toolName: string) => (req: Request, res: Response, next: NextFunction) => void | Response;
    validate: (schema: z.ZodType<any>, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => Response | undefined;
    schemas: {
        toolExecution: z.ZodObject<{
            name: z.ZodString;
            args: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            name: string;
            args?: any;
        }, {
            name: string;
            args?: any;
        }>;
        pagination: z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            limit: number;
            page: number;
        }, {
            limit?: number | undefined;
            page?: number | undefined;
        }>;
        id: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        jobId: z.ZodObject<{
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            jobId: string;
        }, {
            jobId: string;
        }>;
    };
};
export default _default;
