import { ProjectTemplate } from './types';

export const mernTemplate: ProjectTemplate = {
  id: 'mern-stack',
  name: 'MERN Stack',
  description: 'Full-stack JavaScript with MongoDB, Express, React, and Node.js',
  techStack: {
    frontend: 'React, TypeScript, Tailwind CSS',
    backend: 'Node.js, Express',
    database: 'MongoDB',
  },
  structure: [
    "📁 {project-name}/",
    "├── 📁 client/",
    "│   ├── 📁 public/",
    "│   │   ├── 📄 favicon.ico",
    "│   │   └── 📄 index.html",
    "│   ├── 📁 src/",
    "│   │   ├── 📁 components/",
    "│   │   │   └── 📄 Button.tsx",
    "│   │   ├── 📁 pages/",
    "│   │   │   └── 📄 Home.tsx",
    "│   │   ├── 📁 api/",
    "│   │   │   └── 📄 index.ts",
    "│   │   ├── 📄 App.tsx",
    "│   │   ├── 📄 main.tsx",
    "│   │   └── 📄 index.css",
    "│   ├── 📄 vite.config.ts",
    "│   ├── 📄 tsconfig.json",
    "│   ├── 📄 tailwind.config.js",
    "│   ├── 📄 postcss.config.js",
    "│   └── 📄 package.json",
    "├── 📁 server/",
    "│   ├── 📁 src/",
    "│   │   ├── 📁 controllers/",
    "│   │   │   └── 📄 index.ts",
    "│   │   ├── 📁 models/",
    "│   │   │   └── 📄 index.ts",
    "│   │   ├── 📁 routes/",
    "│   │   │   └── 📄 index.ts",
    "│   │   ├── 📁 middleware/",
    "│   │   │   └── 📄 auth.ts",
    "│   │   ├── 📁 config/",
    "│   │   │   └── 📄 db.ts",
    "│   │   └── 📄 index.ts",
    "│   ├── 📄 package.json",
    "│   └── 📄 tsconfig.json",
    "├── 📄 package.json",
    "├── 📄 docker-compose.yml",
    "├── 📄 .env.example",
    "└── 📄 README.md",
  ],
  baseFiles: [
    {
      path: "server/tsconfig.json",
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "outDir": "./dist",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}`
    },
    {
      path: "client/tsconfig.json",
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
      path: "client/tailwind.config.js",
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
    },
    {
      path: "docker-compose.yml",
      content: `version: '3'

services:
  client:
    build:
      context: ./client
    ports:
      - "3000:3000"
    depends_on:
      - server
    env_file:
      - .env
    volumes:
      - ./client:/app
      - /app/node_modules

  server:
    build:
      context: ./server
    ports:
      - "4000:4000"
    depends_on:
      - mongodb
    env_file:
      - .env
    volumes:
      - ./server:/app
      - /app/node_modules

  mongodb:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
`
    },
    {
      path: ".env.example",
      content: `# MongoDB Connection
MONGODB_URI=mongodb://mongodb:27017/myapp
NODE_ENV=development

# Server
SERVER_PORT=4000
JWT_SECRET=your_jwt_secret_here

# Client
VITE_API_URL=http://localhost:4000/api`
    }
  ],
  promptInstructions: `Create a full-stack MERN application with proper separation between client and server. The client should use React with TypeScript and Tailwind CSS. The server should use Express with TypeScript and MongoDB with Mongoose. Implement proper authentication using JWT. Include API validation with zod or similar. Set up proper error handling and logging on both client and server.`
};
