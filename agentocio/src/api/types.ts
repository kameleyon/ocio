/**
 * API Type Definitions
 * 
 * This file contains type definitions for the API layer.
 */

import { z } from 'zod';
import { JobStatus, JobPriority } from './queue/index.js';

/**
 * API Response Status
 */
export enum ApiResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Base API Response
 */
export interface ApiResponse<T = any> {
  status: ApiResponseStatus;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

/**
 * Tool Definition
 */
export interface Tool {
  name: string;
  description: string;
  inputSchema?: z.ZodType<any>;
  hasSchema: boolean;
}

/**
 * Job Definition
 */
export interface Job {
  id: string;
  name: string;
  type: string;
  status: JobStatus;
  priority: JobPriority;
  progress: number;
  payload: any;
  result?: any;
  error?: any;
  metadata: {
    userId: string;
    apiKey?: string;
    [key: string]: any;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Metadata Item
 */
export interface MetadataItem {
  id: string;
  name: string;
  type: string;
  data: Record<string, any>;
  tags?: string[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Tool Execution Request
 */
export interface ToolExecuteRequest {
  [key: string]: any;
}

/**
 * Tool Job Creation Request
 */
export interface ToolJobRequest {
  args: any;
  priority?: JobPriority;
}

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
 * App Generation Request
 */
export type AppGenerationRequest = z.infer<typeof AppGenerationSchema>;

/**
 * Job Status Response
 */
export interface JobStatusResponse {
  id: string;
  name: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: any;
}

/**
 * Job Result Response
 */
export interface JobResultResponse {
  id: string;
  result: any;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Health Check Response
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version?: string;
  environment?: string;
}

/**
 * API Endpoint Definition
 */
export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
}

/**
 * API Endpoints
 */
export const API_ENDPOINTS: Record<string, ApiEndpoint> = {
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