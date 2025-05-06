/**
 * Tool Executor Utility
 *
 * This file provides utilities for executing MCP tools through the API.
 */
import { z } from 'zod';
import { Storage } from '../storage/index.js';
import { JobQueue, JobPriority } from '../queue/index.js';
/**
 * Tool execution options
 */
export interface ToolExecutionOptions {
    name: string;
    args: Record<string, any>;
    userId?: string;
    apiKey?: string;
    metadata?: Record<string, any>;
}
/**
 * Job creation options
 */
export interface JobCreationOptions {
    name: string;
    args: Record<string, any>;
    priority?: JobPriority;
    userId?: string;
    apiKey?: string;
    metadata?: Record<string, any>;
}
/**
 * Tool Executor class
 */
export declare class ToolExecutor {
    private pluginManager;
    private storage;
    private jobQueue;
    constructor(pluginManager: any, storage: Storage, jobQueue: JobQueue);
    /**
     * Get a tool by name
     */
    getTool(name: string): any;
    /**
     * Get all available tools
     */
    getAllTools(): any;
    /**
     * Check if a tool exists
     */
    hasTool(name: string): boolean;
    /**
     * Get a tool's input schema
     */
    getToolSchema(name: string): z.ZodType<any> | null;
    /**
     * Execute a tool directly (synchronously)
     */
    executeTool(options: ToolExecutionOptions): Promise<any>;
    /**
     * Create a job for asynchronous tool execution
     */
    createJob(options: JobCreationOptions): Promise<any>;
    /**
     * Generate an application
     */
    generateApp(options: {
        name: string;
        description: string;
        type: 'web' | 'mobile' | 'api';
        features: string[];
        prompt: string;
        userId?: string;
        apiKey?: string;
    }): Promise<any>;
}
/**
 * Create a tool executor instance
 */
export declare function createToolExecutor(pluginManager: any, storage: Storage, jobQueue: JobQueue): ToolExecutor;
declare const _default: {
    createToolExecutor: typeof createToolExecutor;
};
export default _default;
