/**
 * API Swagger Documentation Annotations
 * 
 * This file contains JSDoc annotations for Swagger/OpenAPI documentation.
 * These annotations are parsed by swagger-jsdoc to generate the OpenAPI spec.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tool:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the tool
 *         description:
 *           type: string
 *           description: Description of what the tool does
 *         inputSchema:
 *           type: object
 *           description: JSON Schema for the tool's input
 *         hasSchema:
 *           type: boolean
 *           description: Whether the tool has an input schema
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique job identifier
 *         name:
 *           type: string
 *           description: Human-readable job name
 *         type:
 *           type: string
 *           description: The type of job (often the tool name)
 *         status:
 *           type: string
 *           enum: [pending, active, completed, failed, cancelled]
 *           description: Current status of the job
 *         progress:
 *           type: number
 *           description: Progress percentage (0-100)
 *         payload:
 *           type: object
 *           description: Job input data
 *         result:
 *           type: object
 *           description: Job execution result (when completed)
 *         error:
 *           type: object
 *           description: Error details (when failed)
 *         metadata:
 *           type: object
 *           description: Additional job metadata
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the job was created
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: When the job started executing
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: When the job completed or failed
 *     MetadataItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique metadata identifier
 *         name:
 *           type: string
 *           description: Metadata name
 *         type:
 *           type: string
 *           description: Metadata type/category
 *         data:
 *           type: object
 *           description: The metadata content
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional tags for categorization
 *         userId:
 *           type: string
 *           description: Owner of the metadata
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Human-readable error message
 *             code:
 *               type: string
 *               description: Error code for programmatic handling
 *             details:
 *               type: string
 *               description: Additional error details
 */

/**
 * @swagger
 * tags:
 *   - name: Tools
 *     description: Operations for working with MCP tools
 *   - name: Jobs
 *     description: Operations for managing asynchronous jobs
 *   - name: Metadata
 *     description: Operations for storing and retrieving metadata
 */

/**
 * @swagger
 * /api/tools:
 *   get:
 *     summary: List all available tools
 *     tags: [Tools]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of available tools
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tools:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tool'
 *                 count:
 *                   type: integer
 *                   description: Total number of tools
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/tools/{name}/schema:
 *   get:
 *     summary: Get input schema for a specific tool
 *     tags: [Tools]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool name
 *     responses:
 *       200:
 *         description: Tool schema information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 schema:
 *                   type: object
 *                 hasSchema:
 *                   type: boolean
 *       404:
 *         description: Tool not found
 *       403:
 *         description: Access denied for internal tool
 */

/**
 * @swagger
 * /api/tools/{name}/execute:
 *   post:
 *     summary: Execute a tool directly
 *     tags: [Tools]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool name
 *     requestBody:
 *       description: Tool arguments
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tool execution result
 *       400:
 *         description: Invalid input arguments
 *       404:
 *         description: Tool not found
 *       403:
 *         description: Access denied for internal tool
 *       500:
 *         description: Execution error
 */

/**
 * @swagger
 * /api/tools/{name}/job:
 *   post:
 *     summary: Create an asynchronous job to execute a tool
 *     tags: [Tools, Jobs]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool name
 *     requestBody:
 *       description: Job configuration
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               args:
 *                 type: object
 *                 description: Tool arguments
 *               priority:
 *                 type: string
 *                 enum: [high, normal, low]
 *                 description: Job priority
 *     responses:
 *       202:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobId:
 *                   type: string
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/tools/generate-app:
 *   post:
 *     summary: Generate a new application
 *     tags: [Tools]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       description: App generation parameters
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - type
 *               - features
 *               - prompt
 *             properties:
 *               name:
 *                 type: string
 *                 description: Application name
 *               description:
 *                 type: string
 *                 description: Application description
 *               type:
 *                 type: string
 *                 enum: [web, mobile, api]
 *                 description: Application type
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of features to include
 *               prompt:
 *                 type: string
 *                 description: Detailed prompt for generation
 *     responses:
 *       202:
 *         description: App generation job created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobId:
 *                   type: string
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: List all jobs
 *     tags: [Jobs]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, completed, failed, cancelled]
 *         description: Filter jobs by status
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 count:
 *                   type: integer
 *   delete:
 *     summary: Clear all jobs (admin only)
 *     tags: [Jobs]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All jobs cleared
 *       403:
 *         description: Permission denied (admin only)
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /api/jobs/{id}/status:
 *   get:
 *     summary: Get job status
 *     tags: [Jobs]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job status details
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /api/jobs/{id}/result:
 *   get:
 *     summary: Get job result
 *     tags: [Jobs]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job result
 *       400:
 *         description: Job not completed
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /api/jobs/{id}/cancel:
 *   post:
 *     summary: Cancel a job
 *     tags: [Jobs]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job cancelled successfully
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /api/metadata:
 *   get:
 *     summary: List metadata items
 *     tags: [Metadata]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: collection
 *         schema:
 *           type: string
 *         description: Metadata collection name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of metadata items
 *   post:
 *     summary: Create new metadata
 *     tags: [Metadata]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       description: Metadata to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetadataItem'
 *     responses:
 *       201:
 *         description: Metadata created successfully
 */

/**
 * @swagger
 * /api/metadata/{id}:
 *   get:
 *     summary: Get metadata by ID
 *     tags: [Metadata]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Metadata ID
 *     responses:
 *       200:
 *         description: Metadata details
 *       404:
 *         description: Metadata not found
 *   put:
 *     summary: Update metadata
 *     tags: [Metadata]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Metadata ID
 *     requestBody:
 *       description: Updated metadata
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetadataItem'
 *     responses:
 *       200:
 *         description: Metadata updated successfully
 *       404:
 *         description: Metadata not found
 *   delete:
 *     summary: Delete metadata
 *     tags: [Metadata]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Metadata ID
 *     responses:
 *       200:
 *         description: Metadata deleted successfully
 *       404:
 *         description: Metadata not found
 */

export {}; // This export is needed to make TypeScript treat this as a module