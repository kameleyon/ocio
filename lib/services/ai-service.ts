import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

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
  structure: string[]
}

export interface FileContent {
  path: string
  content: string
}

export async function generateProjectName(prompt: string): Promise<string> {
  try {
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
            content: 'You are an expert web developer who helps name projects based on their descriptions. Generate a simple, memorable name for this project based on the prompt. Return ONLY the name, nothing else.'
          },
          {
            role: 'user',
            content: `Generate a project name for this app: ${prompt}`
          }
        ],
        max_tokens: 100
      })
    })

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim().replace(/"/g, '')
  } catch (error) {
    console.error('Error generating project name:', error)
    return 'new-project-' + Date.now().toString().slice(-6)
  }
}

export async function generateProjectDetails(prompt: string): Promise<ProjectDetails> {
  try {
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
              "description": "Brief description of the app",
              "techStack": {
                "frontend": "React, TypeScript, Tailwind CSS",
                "backend": "Node.js, Express",
                "database": "MongoDB",
                "deployment": "Vercel, MongoDB Atlas"
              },
              "files": ["app.js", "index.html", "styles.css"],
              "structure": [
                "📁 my-project/",
                "├── 📁 src/",
                "│   ├── 📁 components/",
                "│   │   └── 📄 Component.jsx",
                "│   └── 📄 App.jsx",
                "└── 📄 package.json"
              ]
            }`
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
    return {
      name: 'new-project-' + Date.now().toString().slice(-6),
      description: prompt,
      techStack: {
        frontend: 'React, TypeScript, Tailwind CSS',
        backend: 'Node.js, Express',
        database: 'MongoDB',
        deployment: 'Vercel'
      },
      files: [],
      structure: []
    }
  }
}

export async function generateFileContents(prompt: string, projectDetails: ProjectDetails): Promise<FileContent[]> {
  try {
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
            content: `You are an expert full-stack developer. Generate file contents for the given project structure. Return ONLY valid JSON as an array of objects with 'path' and 'content' properties for each file:
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
            
            Keep each file realistic but concise. Include necessary imports, core functionality, and comments.`
          },
          {
            role: 'user',
            content: `Generate file contents for this project:
            
            Project name: ${projectDetails.name}
            Project description: ${projectDetails.description}
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
    return []
  }
}

export async function generateZipFile(projectName: string, files: FileContent[]): Promise<Blob> {
  const zip = new JSZip()
  
  // Add a README.md file
  zip.file(`${projectName}/README.md`, `# ${projectName}\n\nThis project was generated with OptimusCode.io\n\n## Getting Started\n\n1. Install dependencies: \`npm install\`\n2. Start the development server: \`npm run dev\`\n\n## Features\n\n- Modern, responsive UI\n- API endpoints\n- Database integration\n\n## Learn More\n\nFor more information about the technologies used in this project, please refer to their documentation.`)
  
  // Add an .env.example file
  zip.file(`${projectName}/.env.example`, `# Database Connection\nDATABASE_URL=your_database_url_here\n\n# Authentication\nAUTH_SECRET=your_auth_secret_here\n\n# API Keys\nAPI_KEY=your_api_key_here`)

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
