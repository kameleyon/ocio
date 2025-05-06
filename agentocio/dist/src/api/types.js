/**
 * API Type Definitions
 *
 * This file contains type definitions for the API layer.
 */
import { z } from 'zod';
/**
 * API Response Status
 */
export var ApiResponseStatus;
(function (ApiResponseStatus) {
    ApiResponseStatus["SUCCESS"] = "success";
    ApiResponseStatus["ERROR"] = "error";
})(ApiResponseStatus || (ApiResponseStatus = {}));
/**
 * App Generation Request Schema
 */
export const AppGenerationSchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(['web', 'mobile', 'api']),
    features: z.array(z.string()),
    prompt: z.string()
});
/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // Tool endpoints
    listTools: {
        path: '/api/tools',
        method: 'GET',
        description: 'List all available tools'
    },
    getToolSchema: {
        path: '/api/tools/:name/schema',
        method: 'GET',
        description: 'Get tool schema'
    },
    executeTool: {
        path: '/api/tools/:name/execute',
        method: 'POST',
        description: 'Execute a tool directly'
    },
    createToolJob: {
        path: '/api/tools/:name/job',
        method: 'POST',
        description: 'Create a job for asynchronous tool execution'
    },
    generateApp: {
        path: '/api/tools/generate-app',
        method: 'POST',
        description: 'Generate an app'
    },
    // Job endpoints
    listJobs: {
        path: '/api/jobs',
        method: 'GET',
        description: 'List all jobs'
    },
    getJob: {
        path: '/api/jobs/:id',
        method: 'GET',
        description: 'Get job details'
    },
    getJobStatus: {
        path: '/api/jobs/:id/status',
        method: 'GET',
        description: 'Get job status'
    },
    getJobResult: {
        path: '/api/jobs/:id/result',
        method: 'GET',
        description: 'Get job result'
    },
    cancelJob: {
        path: '/api/jobs/:id/cancel',
        method: 'POST',
        description: 'Cancel a job'
    },
    clearJobs: {
        path: '/api/jobs',
        method: 'DELETE',
        description: 'Clear all jobs (admin only)'
    },
    // Metadata endpoints
    listMetadata: {
        path: '/api/metadata',
        method: 'GET',
        description: 'List metadata items'
    },
    getMetadata: {
        path: '/api/metadata/:id',
        method: 'GET',
        description: 'Get metadata item'
    },
    createMetadata: {
        path: '/api/metadata',
        method: 'POST',
        description: 'Create metadata item'
    },
    updateMetadata: {
        path: '/api/metadata/:id',
        method: 'PUT',
        description: 'Update metadata item'
    },
    deleteMetadata: {
        path: '/api/metadata/:id',
        method: 'DELETE',
        description: 'Delete metadata item'
    },
    // Documentation endpoints
    getApiDocs: {
        path: '/docs',
        method: 'GET',
        description: 'Get API documentation'
    },
    getApiSpec: {
        path: '/docs/spec.json',
        method: 'GET',
        description: 'Get OpenAPI specification'
    }
};
export default {
    ApiResponseStatus,
    API_ENDPOINTS
};
//# sourceMappingURL=types.js.map