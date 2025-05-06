/**
 * API Routes
 *
 * This file organizes and registers all API routes for the OptimusCode API wrapper.
 */
import toolRoutes from './tool-routes.js';
import jobRoutes from './job-routes.js';
import metadataRoutes from './metadata-routes.js';
import docsRoutes from './docs-routes.js';
import executeRoute from './execute-route.js';
/**
 * Setup all API routes
 */
export function setupRoutes(app, options) {
    const { pluginManager, storage, jobQueue } = options;
    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            name: 'OptimusCode API',
            version: '1.0.0',
            description: 'API wrapper for OptimusCode MCP tools',
            documentation: '/docs'
        });
    });
    // Register direct tool execution route
    app.use('/execute-tool', executeRoute(pluginManager, storage, jobQueue));
    // Register tool routes
    app.use('/api/tools', toolRoutes(pluginManager, storage, jobQueue));
    // Register job routes
    app.use('/api/jobs', jobRoutes(jobQueue, storage));
    // Register metadata routes
    app.use('/api/metadata', metadataRoutes(storage));
    // Register documentation routes
    app.use('/docs', docsRoutes());
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    });
}
export default setupRoutes;
//# sourceMappingURL=index.js.map