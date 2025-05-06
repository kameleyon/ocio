/**
 * Job Routes
 *
 * This file defines the API routes for interacting with the job queue system.
 */
import { Router } from 'express';
import { JobQueue } from '../queue/index.js';
import { Storage } from '../storage/index.js';
/**
 * Create job routes
 */
export default function jobRoutes(jobQueue: JobQueue, storage: Storage): Router;
