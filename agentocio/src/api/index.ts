/**
 * API Wrapper for OptimusCode MCP System
 * 
 * This API layer exposes MCP tools and provides HTTP endpoints for
 * external applications to interact with the OptimusCode system.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getPluginManager } from '../tools/code-tools/plugin-manager.js';
import { setupRoutes } from './routes/index.js';
import { setupMiddleware } from './middleware/index.js';
import { initializeStorage } from './storage/index.js';
import { initializeJobQueue } from './queue/index.js';
import { config } from './config.js';
import { errorHandlerMiddleware } from './utils/api-error.js';

// Create Express application
const app = express();

// Basic Express middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Initialize storage for persistent data
const storage = initializeStorage();

// Create job queue variable to be set later
let jobQueue: any;

// Setup custom middleware (auth, validation, logging)
setupMiddleware(app, { storage });

// Function to setup routes after job queue is ready
async function initAndSetupRoutes() {
  // Initialize job queue for long-running processes
  jobQueue = await initializeJobQueue(storage);

  // Setup API routes
  setupRoutes(app, {
    pluginManager: getPluginManager(),
    storage,
    jobQueue
  });
}

// Use our standardized error handling middleware
app.use(errorHandlerMiddleware);

// Start the API server
export async function startApiServer() {
  // Initialize routes with async job queue
  await initAndSetupRoutes();
  
  const port = config.port || 3001;
  
  return new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`OptimusCode API Server listening on port ${port}`);
      resolve();
    });
    
    server.on('error', (error: Error) => {
      console.error('Failed to start API server:', error);
      reject(error);
    });
  });
}

// Export the Express app for testing or manual startup
export { app };