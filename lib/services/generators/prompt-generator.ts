import { ProjectTemplate } from './templates/types';
import { StructuredPrompt } from './types';

export function generateProjectStructurePrompt(userPrompt: string): StructuredPrompt {
  const systemPrompt = `You are an expert full-stack developer. Given a prompt describing an app, generate project details including name, description, tech stack, and file structure. Return ONLY valid JSON in this format:
  {
    "name": "project-name",
    "description": "Brief description of the app based on the prompt",
    "techStack": {
      "frontend": "React, TypeScript, Tailwind CSS",
      "backend": "Node.js, Express",
      "database": "MongoDB",
      "deployment": "Vercel, MongoDB Atlas"
    },
    "files": ["app.js", "index.html", "styles.css"],
    "structure": [
      "📁 my-project/",
      "├── 📁 public/",
      "│   ├── 📄 favicon.ico",
      "│   └── 📄 robots.txt",
      "├── 📁 src/",
      "│   ├── 📁 components/",
      "│   │   └── 📄 Component.jsx",
      "│   ├── 📁 pages/",
      "│   │   └── 📄 Home.jsx",
      "│   └── 📄 App.jsx",
      "├── 📄 package.json",
      "└── 📄 README.md"
    ]
  }
  
  Ensure the structure follows modern best practices for the selected tech stack. Don't add comments or explanations, just the JSON object.`;

  const userPromptText = `Generate project details for this app: ${userPrompt}`;

  return { systemPrompt, userPrompt: userPromptText };
}

export function generateFileContentsPrompt(userPrompt: string, projectDetails: any, template?: ProjectTemplate): StructuredPrompt {
  // Base system prompt
  let systemPrompt = `You are an expert full-stack developer. Generate file contents for a web application based on the provided project structure. Return ONLY valid JSON as an array of objects with 'path' and 'content' properties for each file:
  [
    {
      "path": "src/App.jsx",
      "content": "// Full content of the file here..."
    },
    {
      "path": "src/index.js",
      "content": "// Full content of the file here..."
    }
  ]
  
  Follow these guidelines:
  1. Generate content for key files only (max 10 files)
  2. Include package.json with actual dependencies
  3. Provide a detailed README.md
  4. For code files, include imports, component structure, and basic functionality
  5. Keep code clean, modern, and following best practices
  6. Don't include any explanations outside the JSON structure
  7. Don't include file content in comments within the JSON
  8. Keep each file under 300 lines of code
  9. Use modern syntax (ES6+, hooks for React, etc.)
  10. Include basic error handling and responsive design
  11. Use ONLY valid, tested code with proper imports and dependencies
  12. Ensure all code follows security best practices
  
  Return ONLY the JSON array containing file objects.`;

  // Add template-specific instructions if a template is provided
  if (template && template.promptInstructions) {
    systemPrompt += `\n\nAdditional template-specific instructions:\n${template.promptInstructions}`;
  }

  const userPromptText = `Generate file contents for this project:
  
  Project name: ${projectDetails.name}
  Project description: ${projectDetails.description}
  Tech stack:
  - Frontend: ${projectDetails.techStack.frontend}
  - Backend: ${projectDetails.techStack.backend}
  - Database: ${projectDetails.techStack.database}
  
  Project structure:
  ${Array.isArray(projectDetails.structure) ? projectDetails.structure.join('\n') : JSON.stringify(projectDetails.structure)}
  
  Original prompt: ${userPrompt}`;

  return { systemPrompt, userPrompt: userPromptText };
}

export function generateProjectNamePrompt(userPrompt: string): StructuredPrompt {
  const systemPrompt = `You are an expert web developer who helps name projects based on their descriptions. Generate a simple, memorable name for this project based on the prompt. Return ONLY the name, nothing else. The name should be short (1-2 words), catchy, and lowercase with hyphen if multiple words. Do not add any prefixes or suffixes like "app" or "io". Example: "task-flow" or "recipemaster"`;

  const userPromptText = `Generate a project name for this app: ${userPrompt}`;

  return { systemPrompt, userPrompt: userPromptText };
}

export function generateCodeValidationPrompt(fileContent: string, filePath: string): StructuredPrompt {
  const systemPrompt = `You are a code security and validation expert. Analyze the provided code for security issues, bugs, and best practices. Focus on:
  1. Security vulnerabilities (XSS, CSRF, SQL injection, etc.)
  2. Dependency issues
  3. Logic errors
  4. Performance problems
  5. Best practice violations
  
  Return ONLY valid JSON in this format:
  {
    "valid": true/false,
    "issues": [
      {
        "severity": "high/medium/low",
        "description": "Description of the issue",
        "line": "line number or range (optional)",
        "suggestion": "Suggestion for fixing the issue"
      }
    ],
    "summary": "Brief summary of validation results"
  }`;

  const userPromptText = `Validate the following ${filePath} code:
  \`\`\`
  ${fileContent}
  \`\`\``;

  return { systemPrompt, userPrompt: userPromptText };
}
