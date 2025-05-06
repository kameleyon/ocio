# OptimusCode API Guide

This document provides an overview of the OptimusCode API, which allows you to interact with MCP tools over HTTP.

## Getting Started

The API server starts automatically with the `--with-api` flag when running the MCP server:

```bash
npm run start:all -- --with-api
```

By default, the API server runs on port 3001. You can change this in the config.ts file or by setting the `API_PORT` environment variable.

## Authentication

All API endpoints require authentication. You can use either:

1. **API Key Authentication**: Include your API key in the `X-API-Key` header.
2. **JWT Token Authentication**: Include a bearer token in the `Authorization` header (format: `Bearer <token>`).

API keys are defined in the config.ts file or via the `API_KEYS` environment variable.

## Available Endpoints

### 1. Tool Operations

#### List All Tools
```
GET /api/tools
```
Returns a list of all available tools with their schemas.

#### Get Tool Schema
```
GET /api/tools/:name/schema
```
Returns the input schema for a specific tool.

#### Execute Tool Directly
```
POST /api/tools/:name/execute
```
Executes a tool synchronously and returns the result.

#### Create Tool Job
```
POST /api/tools/:name/job
```
Creates an asynchronous job to execute a tool.

#### Generate App
```
POST /api/tools/generate-app
```
Creates a job to generate a new application.

#### Execute Any Tool (Unified Endpoint)
```
POST /execute-tool
```
Executes any tool by name without needing to construct a tool-specific URL.

Example payload:
```json
{
  "name": "component-builder",
  "args": {
    "type": "react",
    "name": "Button",
    "props": ["variant", "size", "disabled"],
    "styling": "tailwind"
  },
  "async": false
}
```

### 2. Job Operations

#### List Jobs
```
GET /api/jobs
```
Returns a list of all jobs, with optional filtering by status.

#### Get Job Details
```
GET /api/jobs/:id
```
Returns detailed information about a specific job.

#### Get Job Status
```
GET /api/jobs/:id/status
```
Returns the status of a job.

#### Get Job Result
```
GET /api/jobs/:id/result
```
Returns the result of a completed job.

#### Cancel Job
```
POST /api/jobs/:id/cancel
```
Cancels a pending or active job.

### 3. Metadata Operations

#### List Metadata
```
GET /api/metadata
```
Returns a list of all metadata items.

#### Get Metadata Item
```
GET /api/metadata/:id
```
Returns a specific metadata item.

#### Create Metadata
```
POST /api/metadata
```
Creates a new metadata item.

#### Update Metadata
```
PUT /api/metadata/:id
```
Updates an existing metadata item.

#### Delete Metadata
```
DELETE /api/metadata/:id
```
Deletes a metadata item.

## Documentation

### Swagger UI
```
GET /docs
```
Access the interactive API documentation using Swagger UI.

### OpenAPI Specification
```
GET /docs/spec.json
```
Get the OpenAPI specification in JSON format.

## Postman Collection

A [Postman Collection](./optimuscode-api.postman_collection.json) is available in the docs folder. Import this collection into Postman to quickly get started with the API.

## Rate Limiting

The API implements rate limiting to prevent abuse. The default settings can be configured in the config.ts file or via environment variables:

- `RATE_LIMIT_WINDOW`: The time window in milliseconds (default: 15 minutes)
- `RATE_LIMIT_MAX`: Maximum number of requests per window (default: 100)

When you exceed the rate limit, you'll receive a 429 Too Many Requests response.

## Error Handling

All API responses follow a standard format for errors:

```json
{
  "error": {
    "message": "Description of what went wrong",
    "code": "ERROR_CODE",
    "details": "Additional error details (optional)"
  }
}
```

Common error codes include:
- `TOOL_NOT_FOUND`: The requested tool doesn't exist
- `TOOL_ACCESS_DENIED`: Access to the tool is restricted
- `JOB_NOT_FOUND`: The requested job doesn't exist
- `JOB_NOT_COMPLETED`: Job result requested but job is not completed
- `AUTH_REQUIRED`: No authentication credentials provided
- `AUTH_INVALID_API_KEY`: The provided API key is invalid
- `RATE_LIMIT_EXCEEDED`: Too many requests, try again later

## Examples

### Execute a Tool

```bash
curl -X POST "http://localhost:3001/api/tools/component-builder/execute" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "react",
    "name": "Button",
    "props": ["variant", "size", "disabled"],
    "styling": "tailwind"
  }'
```

### Create an Asynchronous Job

```bash
curl -X POST "http://localhost:3001/api/tools/code-fixer/job" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "args": {
      "code": "function example() { console.log(\"hello world\") }",
      "language": "javascript",
      "fixes": ["style", "security"]
    },
    "priority": "normal"
  }'
```

### Check Job Status

```bash
curl -X GET "http://localhost:3001/api/jobs/job-123/status" \
  -H "X-API-Key: your-api-key"
```

### Get Job Result

```bash
curl -X GET "http://localhost:3001/api/jobs/job-123/result" \
  -H "X-API-Key: your-api-key"