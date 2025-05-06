/**
 * Metadata Routes
 *
 * This file defines the API routes for managing metadata like prompts,
 * app configurations, and other persistent data.
 */
import { Router } from 'express';
import { Storage } from '../storage/index.js';
/**
 * Create metadata routes
 */
export default function metadataRoutes(storage: Storage): Router;
