/**
 * Execute Tool Route
 *
 * This file provides a simple entry point for executing any tool
 * without explicitly specifying the tool in the URL path.
 */
import { Router } from 'express';
import { auth } from '../middleware/index.js';
import { config } from '../config.js';
import { createToolExecutor } from '../utils/tool-executor.js';
/**
 * Create execute route
 */
export default function executeRoute(pluginManager, storage, jobQueue) {
    const router = Router();
    // Create a tool executor instance
    const toolExecutor = createToolExecutor(pluginManager, storage, jobQueue);
    // Apply authentication middleware
    router.use(auth.authenticate);
    /**
     * Execute any tool
     * POST /execute-tool
     */
    router.post('/', async (req, res) => {
        const { name, args, async } = req.body;
        if (!name) {
            return res.status(400).json({
                error: {
                    message: 'Tool name is required',
                    code: 'INVALID_REQUEST'
                }
            });
        }
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
            // Execute asynchronously if requested
            if (async) {
                // Create a job
                const job = await toolExecutor.createJob({
                    name,
                    args: args || {},
                    userId: req.user?.id,
                    apiKey: req.apiKey,
                    metadata: { source: 'api-direct' }
                });
                return res.status(202).json({
                    jobId: job.id,
                    status: job.status,
                    message: 'Job created successfully'
                });
            }
            // Execute synchronously
            const result = await toolExecutor.executeTool({
                name,
                args: args || {},
                userId: req.user?.id,
                apiKey: req.apiKey,
                metadata: { source: 'api-direct' }
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
    return router;
}
//# sourceMappingURL=execute-route.js.map