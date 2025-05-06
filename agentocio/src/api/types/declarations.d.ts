/**
 * Type declarations for dependencies without types
 * 
 * This file provides minimal type declarations for external dependencies
 * that don't have their own TypeScript definitions installed.
 */

// Express declarations
declare module 'express' {
  import { EventEmitter } from 'events';
  import { Server } from 'http';

  export interface Request {
    user?: {
      id: string;
      name?: string;
      email?: string;
      permissions?: string[];
    };
    apiKey?: string;
    body: any;
    params: any;
    query: any;
    headers: any;
    method: string;
    path: string;
    originalUrl: string;
    ip: string;
    connection: {
      remoteAddress?: string;
    };
    socket: {
      remoteAddress?: string;
    };
    get(name: string): string | undefined;
  }

  export interface Response {
    status(code: number): Response;
    json(body: any): Response;
    send(body: any): Response;
    setHeader(name: string, value: string): Response;
    statusCode: number;
    locals: {
      [key: string]: any;
      error?: string;
    };
  }

  export interface NextFunction {
    (err?: any): void;
  }

  export interface Router {
    use: any;
    get: any;
    post: any;
    put: any;
    delete: any;
    options: any;
    patch: any;
  }

  export interface Express {
    use: any;
    get: any;
    post: any;
    put: any;
    delete: any;
    listen: (port: number, callback?: () => void) => Server;
    Router: () => Router;
  }

  export function Router(): Router;
  
  const express: () => Express;
  export default express;
}

// CORS declarations
declare module 'cors' {
  import { RequestHandler } from 'express';
  
  interface CorsOptions {
    origin?: string | string[] | boolean | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }
  
  function cors(options?: CorsOptions): RequestHandler;
  export = cors;
}

// Body-parser declarations
declare module 'body-parser' {
  import { RequestHandler } from 'express';
  
  interface BodyParserOptions {
    inflate?: boolean;
    limit?: string | number;
    type?: string | string[] | ((req: any) => boolean);
    verify?: (req: any, res: any, buf: Buffer, encoding: string) => void;
  }
  
  interface JsonOptions extends BodyParserOptions {
    reviver?: (key: string, value: any) => any;
    strict?: boolean;
  }
  
  interface UrlEncodedOptions extends BodyParserOptions {
    extended?: boolean;
    parameterLimit?: number;
  }
  
  function json(options?: JsonOptions): RequestHandler;
  function urlencoded(options?: UrlEncodedOptions): RequestHandler;
  function raw(options?: BodyParserOptions): RequestHandler;
  function text(options?: BodyParserOptions): RequestHandler;
  
  export { json, urlencoded, raw, text };
}

// Swagger UI Express declarations
declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';
  
  const serve: RequestHandler;
  function setup(spec: any, options?: any, uiOptions?: any, uiDocs?: any): RequestHandler;
  
  export { serve, setup };
}

// Swagger JSDoc declarations
declare module 'swagger-jsdoc' {
  interface SwaggerOptions {
    definition: {
      openapi?: string;
      info?: any;
      servers?: any[];
      components?: any;
      security?: any[];
      tags?: any[];
      externalDocs?: any;
      [key: string]: any;
    };
    apis: string[];
  }
  
  function swaggerJsdoc(options: SwaggerOptions): any;
  export default swaggerJsdoc;
}

// Zod to JSON Schema declarations
declare module 'zod-to-json-schema' {
  import { ZodType } from 'zod';
  
  function zodToJsonSchema(schema: ZodType<any, any, any>, options?: any): any;
  export { zodToJsonSchema };
}