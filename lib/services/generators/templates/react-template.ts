import { ProjectTemplate } from './types';

export const reactTemplate: ProjectTemplate = {
  id: 'react-vite',
  name: 'React + Vite',
  description: 'Modern React app with Vite, TypeScript, and Tailwind CSS',
  techStack: {
    frontend: 'React, TypeScript, Tailwind CSS',
    backend: 'None (Static)',
    database: 'None',
  },
  structure: [
    "📁 {project-name}/",
    "├── 📁 public/",
    "│   ├── 📄 favicon.ico",
    "│   └── 📄 robots.txt",
    "├── 📁 src/",
    "│   ├── 📁 components/",
    "│   │   └── 📄 Button.tsx",
    "│   ├── 📁 pages/",
    "│   │   └── 📄 Home.tsx",
    "│   ├── 📄 App.tsx",
    "│   ├── 📄 main.tsx",
    "│   └── 📄 index.css",
    "├── 📄 index.html",
    "├── 📄 vite.config.ts",
    "├── 📄 tsconfig.json",
    "├── 📄 tailwind.config.js",
    "├── 📄 postcss.config.js",
    "├── 📄 package.json",
    "└── 📄 README.md",
  ],
  baseFiles: [
    {
      path: "tsconfig.json",
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
    },
    {
      path: "tsconfig.node.json",
      content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
    },
    {
      path: "vite.config.ts",
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`
    },
    {
      path: "postcss.config.js",
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
    },
    {
      path: "tailwind.config.js",
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`
    },
    {
      path: ".env.example",
      content: `# API Keys
VITE_API_URL=your_api_url_here
VITE_API_KEY=your_api_key_here`
    }
  ],
  promptInstructions: `Use React with TypeScript and Tailwind CSS. Create a responsive, accessible UI with error boundaries. All components should be functional components with hooks. Include proper routing with React Router. Organize code with clean separation of concerns.`
};
