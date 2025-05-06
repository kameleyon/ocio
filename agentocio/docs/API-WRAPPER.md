# OptimusCode API Wrapper

This document provides details on the HTTP API wrapper for OptimusCode MCP tools.

## Overview

The API wrapper provides HTTP endpoints for accessing OptimusCode MCP tools, enabling integration with external applications and services. It implements a RESTful API with standardized endpoints for tool discovery, execution, and management.

## Setting Up the API Wrapper

1. **Install API-specific dependencies**

```bash
node install-dependencies.js
```

2. **Start the MCP server with the API wrapper**

```bash
npm run start:all -- --with-api
```

By default, the API server runs on port 3001.

## Key Endpoints

### Tool Operations

- **GET /api/tools** - List all available tools
- **GET /api/tools/:name/schema** - Get input schema for a specific tool
- **POST /api/tools/:name/execute** - Execute a tool synchronously
- **POST /api/tools/:name/job** - Create an asynchronous job for tool execution
- **POST /api/tools/generate-app** - Generate a new application

### Unified Tool Execution

- **POST /execute-tool** - Execute any tool by name (example payload below)

```json
{
  "name": "component-builder",
  "args": {
    "type": "react",
    "name": "Button",
    "props": ["variant", "size", "disabled"]
  },
  "async": false
}
```

### Job Management

- **GET /api/jobs** - List all jobs
- **GET /api/jobs/:id** - Get job details
- **GET /api/jobs/:id/status** - Get job status
- **GET /api/jobs/:id/result** - Get job result
- **POST /api/jobs/:id/cancel** - Cancel a job

### Metadata Management

- **GET /api/metadata** - List metadata items
- **GET /api/metadata/:id** - Get specific metadata
- **POST /api/metadata** - Create new metadata
- **PUT /api/metadata/:id** - Update metadata
- **DELETE /api/metadata/:id** - Delete metadata

## Authentication

All API endpoints require authentication using either:

1. **API Key** - Include your API key in the `X-API-Key` header
2. **JWT Token** - Include a bearer token in the `Authorization` header

API keys are defined in `config.ts` or via the `API_KEYS` environment variable.

## Documentation Resources

- **Interactive API Documentation**: Access Swagger UI at http://localhost:3001/docs
- **OpenAPI Specification**: Available at http://localhost:3001/docs/spec.json
- **Postman Collection**: Available in `docs/optimuscode-api.postman_collection.json`
- **Detailed API Guide**: Available in `docs/API-GUIDE.md`

## Command Line Options

- `--with-api`: Start both MCP server and API (default port 3001)
- `--api-only`: Start only the API server
- `--open-docs`: Open Swagger documentation after starting

Example: `npm run start:all -- --with-api --open-docs`

## Troubleshooting

If you encounter dependency issues, run the dependency installation script:

```bash
node install-dependencies.js
```

This will install all required packages for the API wrapper.

## Integration Examples

### Executing a Tool

```javascript
// JavaScript Fetch Example
const response = await fetch('http://localhost:3001/api/tools/component-builder/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    type: 'react',
    name: 'Button',
    props: ['variant', 'size', 'disabled']
  })
});

const result = await response.json();
console.log(result);
```

### Monitoring a Job

```javascript
// JavaScript Fetch Example - Create Job
const jobResponse = await fetch('http://localhost:3001/api/tools/code-fixer/job', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    args: {
      code: 'function example() { console.log("hello") }',
      language: 'javascript',
      fixes: ['style', 'security']
    }
  })
});

const { jobId } = await jobResponse.json();

// Check status
const statusResponse = await fetch(`http://localhost:3001/api/jobs/${jobId}/status`, {
  headers: { 'X-API-Key': 'your-api-key' }
});

const status = await statusResponse.json();
console.log(status);
```

See the [API Guide](./API-GUIDE.md) for complete documentation.