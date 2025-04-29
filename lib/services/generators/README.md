# OptimusCode.io Code Generation System

This directory contains the components that power the code generation functionality of OptimusCode.io.

## Structure

- **prompt-generator.ts**: Generates structured prompts for the AI model
- **code-validator.ts**: Validates generated code for security issues and best practices
- **file-generator.ts**: Handles file generation and structure creation
- **zip-generator.ts**: Creates downloadable zip archives of generated projects
- **templates/**: Contains tech stack templates for different project types

## Workflow

1. User submits a project prompt via the Build interface
2. The system generates a project name and structure based on the prompt
3. The AI generates file contents based on the project structure
4. Code validation checks for security issues and best practices
5. Files are assembled into a zip archive with proper directory structure
6. The result is stored in Supabase and made available for download

## Tech Stack Templates

The system supports multiple tech stack templates, including:

- **React + Vite**: Modern React apps with TypeScript and Tailwind CSS
- **Next.js**: Full-stack React framework with SSR and API routes
- **MERN Stack**: MongoDB, Express, React, and Node.js full-stack applications

## Security Features

- Validation to prevent hardcoded credentials
- Detection of potential XSS and SQL injection risks
- Removal of potentially harmful code patterns
- Warnings for detected security issues

## API Endpoints

- **/api/templates**: List available templates or get a specific template
- **/api/validation**: Validate code snippets for security issues
- **/api/structure**: Generate directory structure based on tech stack
- **/api/projects/:id/download**: Generate and download project zip
- **/api/projects/:id/regenerate**: Regenerate a project with new code
