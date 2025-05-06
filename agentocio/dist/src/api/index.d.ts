/**
 * API Wrapper for OptimusCode MCP System
 *
 * This API layer exposes MCP tools and provides HTTP endpoints for
 * external applications to interact with the OptimusCode system.
 */
declare const app: import("express").Express;
export declare function startApiServer(): Promise<void>;
export { app };
