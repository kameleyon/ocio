/**
 * Execute Tool Route
 *
 * This file provides a simple entry point for executing any tool
 * without explicitly specifying the tool in the URL path.
 */
import { Router } from 'express';
import { Storage } from '../storage/index.js';
import { JobQueue } from '../queue/job-queue.js';
/**
 * Create execute route
 */
export default function executeRoute(pluginManager: any, storage: Storage, jobQueue: JobQueue): Router;
