/**
 * Tool Routes
 *
 * This file defines the API routes for interacting with MCP tools.
 */
import { Router } from 'express';
import { Storage } from '../storage/index.js';
import { JobQueue } from '../queue/index.js';
/**
 * Create tool routes
 */
export default function toolRoutes(pluginManager: any, storage: Storage, jobQueue: JobQueue): Router;
