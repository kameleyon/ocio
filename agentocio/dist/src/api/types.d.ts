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
export declare enum ApiResponseStatus {
    SUCCESS = "success",
    ERROR = "error"
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
export declare const AppGenerationSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["web", "mobile", "api"]>;
    features: z.ZodArray<z.ZodString, "many">;
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "api" | "web" | "mobile";
    description: string;
    prompt: string;
    features: string[];
}, {
    name: string;
    type: "api" | "web" | "mobile";
    description: string;
    prompt: string;
    features: string[];
}>;
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
export declare const API_ENDPOINTS: Record<string, ApiEndpoint>;
declare const _default: {
    ApiResponseStatus: typeof ApiResponseStatus;
    API_ENDPOINTS: Record<string, ApiEndpoint>;
};
export default _default;
