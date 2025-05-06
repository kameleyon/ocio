/**
 * Tool Executor Utility
 *
 * This file provides utilities for executing MCP tools through the API.
 */
import { JobPriority } from '../queue/index.js';
/**
 * Tool Executor class
 */
export class ToolExecutor {
    pluginManager;
    storage;
    jobQueue;
    constructor(pluginManager, storage, jobQueue) {
        this.pluginManager = pluginManager;
        this.storage = storage;
        this.jobQueue = jobQueue;
    }
    /**
     * Get a tool by name
     */
    getTool(name) {
        return this.pluginManager.getTool(name);
    }
    /**
     * Get all available tools
     */
    getAllTools() {
        return this.pluginManager.getAllTools();
    }
    /**
     * Check if a tool exists
     */
    hasTool(name) {
        return this.pluginManager.hasTool(name);
    }
    /**
     * Get a tool's input schema
     */
    getToolSchema(name) {
        const tool = this.getTool(name);
        return tool ? tool.inputSchema : null;
    }
    /**
     * Execute a tool directly (synchronously)
     */
    async executeTool(options) {
        const { name, args, userId, apiKey } = options;
        const tool = this.getTool(name);
        if (!tool) {
            throw new Error(`Tool '${name}' not found`);
        }
        // Validate input if schema exists
        if (tool.inputSchema) {
            const validationResult = tool.inputSchema.safeParse(args);
            if (!validationResult.success) {
                throw new Error(`Invalid arguments: ${JSON.stringify(validationResult.error.format())}`);
            }
            // Use the validated data
            options.args = validationResult.data;
        }
        // Execute the tool
        const result = await tool.onCommand({
            name: `${name}:execute`,
            args: options.args
        });
        // Log the execution
        await this.storage.create('toolExecutions', {
            toolName: name,
            args: options.args,
            result,
            userId: userId || 'api-key',
            apiKey,
            timestamp: new Date().toISOString(),
            metadata: options.metadata || {}
        });
        return result;
    }
    /**
     * Create a job for asynchronous tool execution
     */
    async createJob(options) {
        const { name, args, priority, userId, apiKey } = options;
        const tool = this.getTool(name);
        if (!tool) {
            throw new Error(`Tool '${name}' not found`);
        }
        // Validate input if schema exists
        if (tool.inputSchema) {
            const validationResult = tool.inputSchema.safeParse(args);
            if (!validationResult.success) {
                throw new Error(`Invalid arguments: ${JSON.stringify(validationResult.error.format())}`);
            }
            // Use the validated data
            options.args = validationResult.data;
        }
        // Create a job
        const job = await this.jobQueue.createJob({
            name: `${name} execution`,
            type: name,
            priority: priority || JobPriority.NORMAL,
            payload: options.args,
            metadata: {
                userId: userId || 'api-key',
                apiKey,
                ...options.metadata
            }
        });
        return job;
    }
    /**
     * Generate an application
     */
    async generateApp(options) {
        const { name, description, type, features, prompt, userId, apiKey } = options;
        // Create an app ID from the name
        const appId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        // Create a job for app generation
        const job = await this.jobQueue.createJob({
            name: `Generate ${name} app`,
            type: 'generate-app',
            priority: JobPriority.NORMAL,
            payload: {
                name,
                description,
                type,
                features,
                prompt,
                appId
            },
            metadata: {
                userId: userId || 'api-key',
                apiKey
            }
        });
        return job;
    }
}
/**
 * Create a tool executor instance
 */
export function createToolExecutor(pluginManager, storage, jobQueue) {
    return new ToolExecutor(pluginManager, storage, jobQueue);
}
export default {
    createToolExecutor
};
//# sourceMappingURL=tool-executor.js.map