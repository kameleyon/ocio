/**
 * API Routes
 *
 * This file organizes and registers all API routes for the OptimusCode API wrapper.
 */
import { Express } from 'express';
import { Storage } from '../storage/index.js';
import { JobQueue } from '../queue/job-queue.js';
export interface RouteSetupOptions {
    pluginManager: any;
    storage: Storage;
    jobQueue: JobQueue;
}
/**
 * Setup all API routes
 */
export declare function setupRoutes(app: Express, options: RouteSetupOptions): void;
export default setupRoutes;
