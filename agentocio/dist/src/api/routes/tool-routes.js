/**
 * Tool Routes
 *
 * This file defines the API routes for interacting with MCP tools.
 */
import { Router } from 'express';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { auth, validation } from '../middleware/index.js';
import { config } from '../config.js';
import { createToolExecutor } from '../utils/tool-executor.js';
/**
 * Create tool routes
 */
export default function toolRoutes(pluginManager, storage, jobQueue) {
    const router = Router();
    // Create a tool executor instance
    const toolExecutor = createToolExecutor(pluginManager, storage, jobQueue);
    // Apply authentication middleware to all tool routes
    router.use(auth.authenticate);
    /**
     * List all available tools
     * GET /api/tools
     */
    router.get('/', async (req, res) => {
        try {
            // Get all tools from plugin manager
            const allTools = Array.from(pluginManager.getAllTools().entries());
            // Filter out internal tools if user is not an admin
            const isAdmin = req.user?.permissions?.includes('admin');
            const tools = allTools.filter(([name]) => {
                const isInternal = config.tools.internalTools.includes(name);
                return isAdmin || !isInternal;
            });
            // Format the response
            const formattedTools = tools.map(([name, tool]) => ({
                name,
                description: tool.description || `${name} tool`,
                inputSchema: tool.inputSchema ? zodToJsonSchema(tool.inputSchema) : {},
                hasSchema: !!tool.inputSchema
            }));
            res.json({
                tools: formattedTools,
                count: formattedTools.length
            });
        }
        catch (error) {
            console.error('Error listing tools:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to list tools',
                    details: error.message
                }
            });
        }
    });
    /**
     * Get tool schema
     * GET /api/tools/:name/schema
     */
    router.get('/:name/schema', (req, res) => {
        const { name } = req.params;
        try {
            // Get the tool
            const tool = pluginManager.getTool(name);
            if (!tool) {
                return res.status(404).json({
                    error: {
                        message: `Tool '${name}' not found`,
                        code: 'TOOL_NOT_FOUND'
                    }
                });
            }
            // Check if it's an internal tool
            const isInternal = config.tools.internalTools.includes(name);
            const isAdmin = req.user?.permissions?.includes('admin');
            if (isInternal && !isAdmin) {
                return res.status(403).json({
                    error: {
                        message: `Tool '${name}' is not accessible`,
                        code: 'TOOL_ACCESS_DENIED'
                    }
                });
            }
            // Get the schema
            const inputSchema = tool.inputSchema ? zodToJsonSchema(tool.inputSchema) : null;
            res.json({
                name,
                description: tool.description || `${name} tool`,
                schema: inputSchema || {},
                hasSchema: !!inputSchema
            });
        }
        catch (error) {
            console.error(`Error getting schema for tool '${req.params.name}':`, error);
            res.status(500).json({
                error: {
                    message: 'Failed to get tool schema',
                    details: error.message
                }
            });
        }
    });
    /**
     * Execute a tool directly
     * POST /api/tools/:name/execute
     */
    router.post('/:name/execute', async (req, res) => {
        const { name } = req.params;
        const args = req.body;
        try {
            // Check if tool exists
            if (!toolExecutor.hasTool(name)) {
                return res.status(404).json({
                    error: {
                        message: `Tool '${name}' not found`,
                        code: 'TOOL_NOT_FOUND'
                    }
                });
            }
            // Check if it's an internal tool
            const isInternal = config.tools.internalTools.includes(name);
            const isAdmin = req.user?.permissions?.includes('admin');
            if (isInternal && !isAdmin) {
                return res.status(403).json({
                    error: {
                        message: `Tool '${name}' is not accessible`,
                        code: 'TOOL_ACCESS_DENIED'
                    }
                });
            }
            // Execute the tool using our utility
            const result = await toolExecutor.executeTool({
                name,
                args,
                userId: req.user?.id,
                apiKey: req.apiKey,
                metadata: { source: 'api' }
            });
            res.json(result);
        }
        catch (error) {
            console.error(`Error executing tool '${name}':`, error);
            res.status(500).json({
                error: {
                    message: 'Failed to execute tool',
                    details: error.message
                }
            });
        }
    });
    /**
     * Create a job for asynchronous tool execution
     * POST /api/tools/:name/job
     */
    router.post('/:name/job', async (req, res) => {
        const { name } = req.params;
        const { args, priority } = req.body;
        try {
            // Check if tool exists
            if (!toolExecutor.hasTool(name)) {
                return res.status(404).json({
                    error: {
                        message: `Tool '${name}' not found`,
                        code: 'TOOL_NOT_FOUND'
                    }
                });
            }
            // Check if it's an internal tool
            const isInternal = config.tools.internalTools.includes(name);
            const isAdmin = req.user?.permissions?.includes('admin');
            if (isInternal && !isAdmin) {
                return res.status(403).json({
                    error: {
                        message: `Tool '${name}' is not accessible`,
                        code: 'TOOL_ACCESS_DENIED'
                    }
                });
            }
            // Create a job using our utility
            const job = await toolExecutor.createJob({
                name,
                args,
                priority,
                userId: req.user?.id,
                apiKey: req.apiKey,
                metadata: { source: 'api' }
            });
            res.status(202).json({
                jobId: job.id,
                status: job.status,
                message: 'Job created successfully'
            });
        }
        catch (error) {
            console.error(`Error creating job for tool '${name}':`, error);
            res.status(500).json({
                error: {
                    message: 'Failed to create job',
                    details: error.message
                }
            });
        }
    });
    /**
     * Generate app (combined tool execution)
     * POST /api/tools/generate-app
     */
    router.post('/generate-app', validation.validate(z.object({
        name: z.string(),
        description: z.string(),
        type: z.enum(['web', 'mobile', 'api']),
        features: z.array(z.string()),
        prompt: z.string()
    })), async (req, res) => {
        try {
            // Generate app using our utility
            const job = await toolExecutor.generateApp({
                ...req.body,
                userId: req.user?.id,
                apiKey: req.apiKey
            });
            res.status(202).json({
                jobId: job.id,
                status: job.status,
                message: 'App generation job created successfully'
            });
        }
        catch (error) {
            console.error('Error creating app generation job:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to create app generation job',
                    details: error.message
                }
            });
        }
    });
    return router;
}
//# sourceMappingURL=tool-routes.js.map