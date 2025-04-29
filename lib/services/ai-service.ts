import { saveAs } from 'file-saver';
import { 
  generateProjectStructurePrompt, 
  generateFileContentsPrompt,
  generateProjectNamePrompt,
  generateProjectFiles,
  generateProjectZip,
  generateZipWithReadme,
  validateAllFiles,
  getTemplateById,
  getDefaultTemplate
} from './generators';

export interface ProjectDetails {
  name: string;
  description: string;
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  };
  files: string[];
  structure: any;
}

export interface FileContent {
  path: string;
  content: string;
}

export async function generateProjectName(prompt: string): Promise<string> {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

    // Generate the project name prompt
    const { systemPrompt, userPrompt } = generateProjectNamePrompt(prompt);

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 50
      })
    });

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Clean up the response - remove quotes, lowercase, add hyphens
    const rawName = data.choices[0].message.content.trim().replace(/"/g, '');
    const cleanName = rawName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return cleanName || 'new-project-' + Date.now().toString().slice(-6);
  } catch (error) {
    console.error('Error generating project name:', error);
    return 'new-project-' + Date.now().toString().slice(-6);
  }
}

export async function generateProjectDetails(prompt: string): Promise<ProjectDetails> {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

    // Generate the project structure prompt
    const { systemPrompt, userPrompt } = generateProjectStructurePrompt(prompt);

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Extract the JSON object from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating project details:', error);
    const defaultName = 'new-project-' + Date.now().toString().slice(-6);
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
    };
  }
}

export async function generateFileContents(prompt: string, projectDetails: ProjectDetails): Promise<FileContent[]> {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

    // Get the appropriate template based on tech stack
    let template;
    if (projectDetails.techStack.frontend.toLowerCase().includes('next')) {
      template = getTemplateById('next-js');
    } else if (
      projectDetails.techStack.backend.toLowerCase().includes('express') || 
      projectDetails.techStack.database.toLowerCase().includes('mongo')
    ) {
      template = getTemplateById('mern-stack');
    } else {
      template = getTemplateById('react-vite');
    }

    // Generate the file contents prompt
    const { systemPrompt, userPrompt } = generateFileContentsPrompt(prompt, projectDetails, template);

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Extract the JSON array from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const generatedFiles = JSON.parse(jsonMatch[0]);
    
    // Process the files with our file generator to include template files and validate
    return await generateProjectFiles(
      projectDetails.name, 
      projectDetails.techStack, 
      generatedFiles, 
      { includeBaseFiles: true, validateSecurity: true }
    );
  } catch (error) {
    console.error('Error generating file contents:', error);
    return [
      {
        path: 'README.md',
        content: `# ${projectDetails.name}\n\nThis project was generated with OptimusCode.io\n\n## Description\n\n${projectDetails.description}\n\n## Getting Started\n\n\`\`\`bash\n# Install dependencies\nnpm install\n\n# Run the development server\nnpm run dev\n\`\`\``
      },
      {
        path: 'package.json',
        content: `{\n  "name": "${projectDetails.name}",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "start": "vite preview"\n  }\n}`
      }
    ];
  }
}

export async function generateZipFile(projectName: string, files: FileContent[]): Promise<Blob> {
  // Use our enhanced zip generator
  return await generateProjectZip(projectName, files, true);
}

export function saveZipFile(blob: Blob, filename: string): void {
  saveAs(blob, `${filename}.zip`);
}

// Helper function to parse file structure
export function parseFileStructure(structure: string[]): { path: string, isDirectory: boolean }[] {
  const files: { path: string, isDirectory: boolean }[] = [];
  
  structure.forEach((line) => {
    // Remove leading characters (├──, │   etc.)
    const cleanLine = line.replace(/^[│├└─\s]+/, '');
    
    // Check if it's a directory or file
    const isDirectory = cleanLine.includes('📁');
    
    // Extract path
    const path = cleanLine.replace(/^📁\s+|^📄\s+/, '').replace(/\/$/, '');
    
    files.push({ path, isDirectory });
  });
  
  return files;
}

// Generate default file structure
export function generateDefaultStructure(projectName: string): string[] {
  const template = getDefaultTemplate();
  
  return template.structure.map(line => 
    line.replace('{project-name}', projectName)
  );
}

// Generate minimal file contents for preview
export function generatePreviewFiles(projectDetails: ProjectDetails): FileContent[] {
  // Get the appropriate template
  let template;
  if (projectDetails.techStack.frontend.toLowerCase().includes('next')) {
    template = getTemplateById('next-js');
  } else if (
    projectDetails.techStack.backend.toLowerCase().includes('express') || 
    projectDetails.techStack.database.toLowerCase().includes('mongo')
  ) {
    template = getTemplateById('mern-stack');
  } else {
    template = getTemplateById('react-vite');
  }
  
  if (!template) {
    template = getDefaultTemplate();
  }
  
  // Create preview files based on the template
  return [
    {
      path: 'README.md',
      content: `# ${projectDetails.name}

## Description
${projectDetails.description}

## Tech Stack
- Frontend: ${projectDetails.techStack.frontend}
- Backend: ${projectDetails.techStack.backend}
- Database: ${projectDetails.techStack.database}

## Generated by OptimusCode.io
This project was automatically generated using AI through OptimusCode.io.`
    },
    ...template.baseFiles.slice(0, 2) // Include just a couple of template files for preview
  ];
}
