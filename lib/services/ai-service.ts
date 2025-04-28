import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface ProjectDetails {
  name: string
  description: string
  techStack: {
    frontend: string
    backend: string
    database: string
    deployment: string
  }
  files: string[]
  structure: any
}

export interface FileContent {
  path: string
  content: string
}

export async function generateProjectName(prompt: string): Promise<string> {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://optimuscode.io',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus',
        messages: [
          {
            role: 'system',
            content: 'You are an expert web developer who helps name projects based on their descriptions. Generate a simple, memorable name for this project based on the prompt. Return ONLY the name, nothing else. The name should be short (1-2 words), catchy, and lowercase with hyphen if multiple words. Do not add any prefixes or suffixes like "app" or "io". Example: "task-flow" or "recipemaster"'
          },
          {
            role: 'user',
            content: `Generate a project name for this app: ${prompt}`
          }
        ],
        max_tokens: 50
      })
    })

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`)
    }

    const data = await response.json()
    
    // Clean up the response - remove quotes, lowercase, add hyphens
    const rawName = data.choices[0].message.content.trim().replace(/"/g, '')
    const cleanName = rawName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return cleanName || 'new-project-' + Date.now().toString().slice(-6)
  } catch (error) {
    console.error('Error generating project name:', error)
    return 'new-project-' + Date.now().toString().slice(-6)
  }
}

export async function generateProjectDetails(prompt: string): Promise<ProjectDetails> {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://optimuscode.io',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus',
        messages: [
          {
            role: 'system',
            content: `You are an expert full-stack developer. Given a prompt describing an app, generate project details including name, description, tech stack, and file structure. Return ONLY valid JSON in this format:
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
            
            Ensure the structure follows modern best practices for the selected tech stack. Don't add comments or explanations, just the JSON object.`
          },
          {
            role: 'user',
            content: `Generate project details for this app: ${prompt}`
          }
        ],
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content.trim()
    
    // Extract the JSON object from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }
    
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error generating project details:', error)
    const defaultName = 'new-project-' + Date.now().toString().slice(-6)
    return {
      name: defaultName,
      description: prompt,
      techStack: {
        frontend: 'React, TypeScript, Tailwind CSS',
        backend: 'Node.js, Express',
        database: 'MongoDB',
        deployment: 'Vercel'
      },
      files: [],
      structure: [
        `📁 ${defaultName}/`,
        "├── 📁 public/",
        "│   ├── 📄 favicon.ico",
        "│   └── 📄 index.html",
        "├── 📁 src/",
        "│   ├── 📁 components/",
        "│   │   └── 📄 App.jsx",
        "│   └── 📄 index.js",
        "├── 📄 package.json",
        "└── 📄 README.md"
      ]
    }
  }
}

export async function generateFileContents(prompt: string, projectDetails: ProjectDetails): Promise<FileContent[]> {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://optimuscode.io',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus',
        messages: [
          {
            role: 'system',
            content: `You are an expert full-stack developer. Generate file contents for a web application based on the provided project structure. Return ONLY valid JSON as an array of objects with 'path' and 'content' properties for each file:
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
            
            Return ONLY the JSON array containing file objects.`
          },
          {
            role: 'user',
            content: `Generate file contents for this project:
            
            Project name: ${projectDetails.name}
            Project description: ${projectDetails.description}
            Tech stack:
            - Frontend: ${projectDetails.techStack.frontend}
            - Backend: ${projectDetails.techStack.backend}
            - Database: ${projectDetails.techStack.database}
            
            Project structure:
            ${projectDetails.structure.join('\n')}
            
            Original prompt: ${prompt}`
          }
        ],
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content.trim()
    
    // Extract the JSON array from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }
    
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error generating file contents:', error)
    return [
      {
        path: 'README.md',
        content: `# ${projectDetails.name}\n\nThis project was generated with OptimusCode.io\n\n## Description\n\n${projectDetails.description}\n\n## Getting Started\n\n\`\`\`bash\n# Install dependencies\nnpm install\n\n# Run the development server\nnpm run dev\n\`\`\``
      },
      {
        path: 'package.json',
        content: `{\n  "name": "${projectDetails.name}",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "start": "vite preview"\n  }\n}`
      }
    ]
  }
}

export async function generateZipFile(projectName: string, files: FileContent[]): Promise<Blob> {
  const zip = new JSZip()
  
  // Add a README.md file if it doesn't exist
  if (!files.find(file => file.path === 'README.md')) {
    zip.file(`${projectName}/README.md`, `# ${projectName}\n\nThis project was generated with OptimusCode.io\n\n## Getting Started\n\n1. Install dependencies: \`npm install\`\n2. Start the development server: \`npm run dev\`\n\n## Features\n\n- Modern, responsive UI\n- API endpoints\n- Database integration`)
  }
  
  // Add an .env.example file if it doesn't exist
  if (!files.find(file => file.path === '.env.example')) {
    zip.file(`${projectName}/.env.example`, `# Database Connection\nDATABASE_URL=your_database_url_here\n\n# Authentication\nAUTH_SECRET=your_auth_secret_here\n\n# API Keys\nAPI_KEY=your_api_key_here`)
  }

  // Add all the generated files
  files.forEach((file) => {
    zip.file(`${projectName}/${file.path}`, file.content)
  })
  
  // Generate zip
  return zip.generateAsync({ type: 'blob' })
}

export function saveZipFile(blob: Blob, filename: string): void {
  saveAs(blob, `${filename}.zip`)
}

// Helper function to parse file structure
export function parseFileStructure(structure: string[]): { path: string, isDirectory: boolean }[] {
  const files: { path: string, isDirectory: boolean }[] = []
  
  structure.forEach((line) => {
    // Remove leading characters (├──, │   etc.)
    const cleanLine = line.replace(/^[│├└─\s]+/, '')
    
    // Check if it's a directory or file
    const isDirectory = cleanLine.includes('📁')
    
    // Extract path
    const path = cleanLine.replace(/^📁\s+|^📄\s+/, '').replace(/\/$/, '')
    
    files.push({ path, isDirectory })
  })
  
  return files
}

// Generate default file structure
export function generateDefaultStructure(projectName: string): string[] {
  return [
    `📁 ${projectName}/`,
    "├── 📁 public/",
    "│   ├── 📄 favicon.ico",
    "│   └── 📄 index.html",
    "├── 📁 src/",
    "│   ├── 📁 components/",
    "│   │   └── 📄 App.jsx",
    "│   └── 📄 index.js",
    "├── 📄 package.json",
    "└── 📄 README.md"
  ]
}

// Generate minimal file contents for preview
export function generatePreviewFiles(projectDetails: ProjectDetails): FileContent[] {
  return [
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectDetails.name}</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.js"></script>
</body>
</html>`
    },
    {
      path: 'src/index.js',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    },
    {
      path: 'package.json',
      content: `{
  "name": "${projectDetails.name}",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "vite preview"
  }
}`
    }
  ]
}
