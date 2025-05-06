"use strict";exports.id=94,exports.ids=[94],exports.modules={42094:(e,t,s)=>{s.d(t,{iq:()=>d,eU:()=>h,bh:()=>l,lv:()=>p,d6:()=>D}),s(81618);var n=s(42303);async function o(e,t,s,o={includeBaseFiles:!0,validateSecurity:!0}){let i;(i=t?.frontend?.toLowerCase().includes("next")?(0,n.l3)("next-js"):t?.backend?.toLowerCase().includes("express")||t?.database?.toLowerCase().includes("mongo")?(0,n.l3)("mern-stack"):(0,n.l3)("react-vite"))||(i=(0,n.NJ)());let a=new Map;o.customFiles&&o.customFiles.forEach(e=>{a.set(e.path,e)}),s.forEach(e=>{a.set(e.path,e)}),o.includeBaseFiles&&i&&i.baseFiles.forEach(e=>{a.has(e.path)||a.set(e.path,e)});let c=e.toLowerCase().replace(/\s+/g,"-"),u=[];return(a.forEach(e=>{let t=e.content.replace(/\{project-name\}/g,c);u.push({path:e.path,content:t})}),o.validateSecurity)?await r(u):u}async function r(e){return e.map(e=>{let t=e.content;return t=(t=t.replace(/eval\s*\(/g,"// eval was removed for security (")).replace(/new\s+Function\s*\(/g,"// Function constructor was removed for security ("),[/(['"])(?:api|auth|secret|key|token|password|credential)_?(?:key|token|secret|password|id)?\1\s*[:=]\s*(['"])[a-zA-Z0-9_\-]{20,}\2/gi].forEach(e=>{t=t.replace(e,e=>e.replace(/(['"])[a-zA-Z0-9_\-]{20,}\1/g,"$1USE_ENV_VARIABLE_INSTEAD$1"))}),e.path.includes("package.json")&&!t.includes("dotenv")&&(t=t.replace(/"dependencies"\s*:\s*{/g,'"dependencies": {\n    "dotenv": "^16.0.3",')),{path:e.path,content:t}})}var i=s(21883),a=s.n(i),c=s(19592);async function u(e,t,s=!0){try{let n=s?await (0,c.x)(t):t,o=new(a()),r=e.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");return n.forEach(e=>{let t=e.path.replace(/\\/g,"/");o.file(`${r}/${t}`,e.content)}),await o.generateAsync({type:"blob"})}catch(e){throw console.error("Error generating project zip:",e),Error(`Failed to generate zip file: ${e instanceof Error?e.message:"Unknown error"}`)}}async function p(e){try{let t=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,{systemPrompt:s,userPrompt:n}={systemPrompt:'You are an expert web developer who helps name projects based on their descriptions. Generate a simple, memorable name for this project based on the prompt. Return ONLY the name, nothing else. The name should be short (1-2 words), catchy, and lowercase with hyphen if multiple words. Do not add any prefixes or suffixes like "app" or "io". Example: "task-flow" or "recipemaster"',userPrompt:`Generate a project name for this app: ${e}`},o=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:s},{role:"user",content:n}],max_tokens:50})});if(!o.ok)throw Error(`AI API Error: ${o.status}`);return(await o.json()).choices[0].message.content.trim().replace(/"/g,"").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")||"new-project-"+Date.now().toString().slice(-6)}catch(e){return console.error("Error generating project name:",e),"new-project-"+Date.now().toString().slice(-6)}}async function l(e){try{let t=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,{systemPrompt:s,userPrompt:n}={systemPrompt:`You are an expert full-stack developer. Given a prompt describing an app, generate project details including name, description, tech stack, and file structure. Return ONLY valid JSON in this format:
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
  
  Ensure the structure follows modern best practices for the selected tech stack. Don't add comments or explanations, just the JSON object.`,userPrompt:`Generate project details for this app: ${e}`},o=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:s},{role:"user",content:n}],max_tokens:2e3})});if(!o.ok)throw Error(`AI API Error: ${o.status}`);let r=(await o.json()).choices[0].message.content.trim().match(/\{[\s\S]*\}/);if(!r)throw Error("Invalid response format");return JSON.parse(r[0])}catch(s){console.error("Error generating project details:",s);let t="new-project-"+Date.now().toString().slice(-6);return{name:t,description:e,techStack:{frontend:"React, TypeScript, Tailwind CSS",backend:"Node.js, Express",database:"MongoDB",deployment:"Vercel"},files:[],structure:[`📁 ${t}/`,"├── \uD83D\uDCC1 public/","│   ├── \uD83D\uDCC4 favicon.ico","│   └── \uD83D\uDCC4 index.html","├── \uD83D\uDCC1 src/","│   ├── \uD83D\uDCC1 components/","│   │   └── \uD83D\uDCC4 App.jsx","│   └── \uD83D\uDCC4 index.js","├── \uD83D\uDCC4 package.json","└── \uD83D\uDCC4 README.md"]}}}async function d(e,t){try{let s,r;let i=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;s=t.techStack.frontend.toLowerCase().includes("next")?(0,n.l3)("next-js"):t.techStack.backend.toLowerCase().includes("express")||t.techStack.database.toLowerCase().includes("mongo")?(0,n.l3)("mern-stack"):(0,n.l3)("react-vite");let{systemPrompt:a,userPrompt:c}=(r=`You are an expert full-stack developer. Generate file contents for a web application based on the provided project structure. Return ONLY valid JSON as an array of objects with 'path' and 'content' properties for each file:
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
  
  Return ONLY the JSON array containing file objects.`,s&&s.promptInstructions&&(r+=`

Additional template-specific instructions:
${s.promptInstructions}`),{systemPrompt:r,userPrompt:`Generate file contents for this project:
  
  Project name: ${t.name}
  Project description: ${t.description}
  Tech stack:
  - Frontend: ${t.techStack.frontend}
  - Backend: ${t.techStack.backend}
  - Database: ${t.techStack.database}
  
  Project structure:
  ${Array.isArray(t.structure)?t.structure.join("\n"):JSON.stringify(t.structure)}
  
  Original prompt: ${e}`}),u=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:a},{role:"user",content:c}],max_tokens:4e3})});if(!u.ok)throw Error(`AI API Error: ${u.status}`);let p=(await u.json()).choices[0].message.content.trim().match(/\[[\s\S]*\]/);if(!p)throw Error("Invalid response format");let l=JSON.parse(p[0]);return await o(t.name,t.techStack,l,{includeBaseFiles:!0,validateSecurity:!0})}catch(e){return console.error("Error generating file contents:",e),[{path:"README.md",content:`# ${t.name}

This project was generated with OptimusCode.io

## Description

${t.description}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\``},{path:"package.json",content:`{
  "name": "${t.name}",
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
}`}]}}async function D(e,t){return await u(e,t,!0)}function h(e){let t;return(t=e.techStack.frontend.toLowerCase().includes("next")?(0,n.l3)("next-js"):e.techStack.backend.toLowerCase().includes("express")||e.techStack.database.toLowerCase().includes("mongo")?(0,n.l3)("mern-stack"):(0,n.l3)("react-vite"))||(t=(0,n.NJ)()),[{path:"README.md",content:`# ${e.name}

## Description
${e.description}

## Tech Stack
- Frontend: ${e.techStack.frontend}
- Backend: ${e.techStack.backend}
- Database: ${e.techStack.database}

## Generated by OptimusCode.io
This project was automatically generated using AI through OptimusCode.io.`},...t.baseFiles.slice(0,2)]}},19592:(e,t,s)=>{async function n(e,t){try{if(t.endsWith(".md")||t.endsWith(".txt")||t.endsWith(".svg")||t.endsWith(".ico")||t.endsWith(".gitignore"))return{valid:!0,issues:[],summary:"Non-code file, validation skipped"};let s=t.split(".").pop()?.toLowerCase(),n=function(e,t){let s=[];return/(['"])(?:api|auth|secret|key|token|password)_?(?:key|token|password)?\1\s*[:=]\s*(['"])[a-zA-Z0-9_\-]{20,}\2/i.test(e)&&!/\/\/.*(?:api|auth|key|token|password)/i.test(e)&&s.push({severity:"high",description:"Hardcoded credentials or API keys detected",suggestion:"Use environment variables instead of hardcoding sensitive data"}),(/eval\s*\(/.test(e)||/new\s+Function\s*\(/.test(e))&&s.push({severity:"high",description:"Use of eval() or new Function() detected",suggestion:"Avoid using eval() or the Function constructor for security reasons"}),("js"===t||"ts"===t||"jsx"===t||"tsx"===t)&&/(?:execute|query|run)\s*\(\s*(?:[`'"]|(?:\$\{)|\+)/.test(e)&&!e.includes("parameterized")&&!e.includes("prepared")&&s.push({severity:"high",description:"Potential SQL injection vulnerability",suggestion:"Use parameterized queries or prepared statements"}),("js"===t||"ts"===t||"jsx"===t||"tsx"===t)&&/(?:innerHTML|outerHTML|document\.write)\s*=/.test(e)&&s.push({severity:"medium",description:"Potential XSS vulnerability",suggestion:"Use safer alternatives like textContent or implement proper sanitization"}),/console\.log\(/.test(e)&&s.push({severity:"low",description:"console.log statements found",suggestion:"Remove console.log statements before production"}),(/\/\/\s*TODO/.test(e)||/\/\*\s*TODO/.test(e))&&s.push({severity:"low",description:"TODO comments found",suggestion:"Address or remove TODO comments before production"}),s}(e,s),o=n.some(e=>"high"===e.severity);return{valid:!o,issues:n,summary:o?"Security or critical issues detected":n.length>0?"Minor issues detected, but code is usable":"Code passed validation"}}catch(e){return console.error("Error validating code:",e),{valid:!1,issues:[{severity:"high",description:`Validation error: ${e instanceof Error?e.message:"Unknown error"}`}],summary:"Validation failed due to an error"}}}async function o(e){let t=[];for(let s of e){let e=await n(s.content,s.path),o=s.content;!e.valid&&(s.path.endsWith(".js")||s.path.endsWith(".ts")||s.path.endsWith(".jsx")||s.path.endsWith(".tsx")?o=`/**
 * WARNING: This file contains validation issues:
 * ${e.summary}
 * 
 * ${e.issues.map(e=>`- ${e.severity.toUpperCase()}: ${e.description}`).join("\n * ")}
 * 
 * Please review and fix these issues before using in production.
 */

${o}`:s.path.endsWith(".html")?o=`<!--
  WARNING: This file contains validation issues:
  ${e.summary}
  
  ${e.issues.map(e=>`- ${e.severity.toUpperCase()}: ${e.description}`).join("\n  ")}
  
  Please review and fix these issues before using in production.
-->

${o}`:s.path.endsWith(".css")&&(o=`/**
 * WARNING: This file contains validation issues:
 * ${e.summary}
 * 
 * ${e.issues.map(e=>`- ${e.severity.toUpperCase()}: ${e.description}`).join("\n * ")}
 * 
 * Please review and fix these issues before using in production.
 */

${o}`)),t.push({path:s.path,content:o})}return t}s.d(t,{j:()=>n,x:()=>o})},42303:(e,t,s)=>{s.d(t,{NJ:()=>r,l3:()=>o,zd:()=>n});let n={templates:[{id:"react-vite",name:"React + Vite",description:"Modern React app with Vite, TypeScript, and Tailwind CSS",techStack:{frontend:"React, TypeScript, Tailwind CSS",backend:"None (Static)",database:"None"},structure:["\uD83D\uDCC1 {project-name}/","├── \uD83D\uDCC1 public/","│   ├── \uD83D\uDCC4 favicon.ico","│   └── \uD83D\uDCC4 robots.txt","├── \uD83D\uDCC1 src/","│   ├── \uD83D\uDCC1 components/","│   │   └── \uD83D\uDCC4 Button.tsx","│   ├── \uD83D\uDCC1 pages/","│   │   └── \uD83D\uDCC4 Home.tsx","│   ├── \uD83D\uDCC4 App.tsx","│   ├── \uD83D\uDCC4 main.tsx","│   └── \uD83D\uDCC4 index.css","├── \uD83D\uDCC4 index.html","├── \uD83D\uDCC4 vite.config.ts","├── \uD83D\uDCC4 tsconfig.json","├── \uD83D\uDCC4 tailwind.config.js","├── \uD83D\uDCC4 postcss.config.js","├── \uD83D\uDCC4 package.json","└── \uD83D\uDCC4 README.md"],baseFiles:[{path:"tsconfig.json",content:`{
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
}`},{path:"tsconfig.node.json",content:`{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`},{path:"vite.config.ts",content:`import { defineConfig } from 'vite'
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
})`},{path:"postcss.config.js",content:`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`},{path:"tailwind.config.js",content:`/** @type {import('tailwindcss').Config} */
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
}`},{path:".env.example",content:`# API Keys
VITE_API_URL=your_api_url_here
VITE_API_KEY=your_api_key_here`}],promptInstructions:"Use React with TypeScript and Tailwind CSS. Create a responsive, accessible UI with error boundaries. All components should be functional components with hooks. Include proper routing with React Router. Organize code with clean separation of concerns."},{id:"next-js",name:"Next.js",description:"Full-stack React framework with server-side rendering",techStack:{frontend:"Next.js, React, TypeScript, Tailwind CSS",backend:"Next.js API Routes",database:"Prisma with SQLite (configurable)"},structure:["\uD83D\uDCC1 {project-name}/","├── \uD83D\uDCC1 app/","│   ├── \uD83D\uDCC4 favicon.ico","│   ├── \uD83D\uDCC4 globals.css","│   ├── \uD83D\uDCC4 layout.tsx","│   ├── \uD83D\uDCC4 page.tsx","│   └── \uD83D\uDCC1 api/","│       └── \uD83D\uDCC1 hello/","│           └── \uD83D\uDCC4 route.ts","├── \uD83D\uDCC1 components/","│   └── \uD83D\uDCC1 ui/","│       └── \uD83D\uDCC4 button.tsx","├── \uD83D\uDCC1 lib/","│   └── \uD83D\uDCC4 utils.ts","├── \uD83D\uDCC1 public/","│   └── \uD83D\uDCC4 vercel.svg","├── \uD83D\uDCC4 next.config.js","├── \uD83D\uDCC4 package.json","├── \uD83D\uDCC4 postcss.config.js","├── \uD83D\uDCC4 tailwind.config.js","├── \uD83D\uDCC4 tsconfig.json","└── \uD83D\uDCC4 README.md"],baseFiles:[{path:"next.config.js",content:`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig`},{path:"tsconfig.json",content:`{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`},{path:"postcss.config.js",content:`module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`},{path:"tailwind.config.js",content:`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}`},{path:".env.example",content:`# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# API Keys
NEXT_PUBLIC_API_URL=your_api_url_here`}],promptInstructions:"Create a Next.js 13+ app with App Router. Use React Server Components where appropriate and Client Components when needed. Implement NextAuth.js for authentication if required. Use Prisma for database access with proper migrations setup. Ensure all API routes use proper error handling and validation."},{id:"mern-stack",name:"MERN Stack",description:"Full-stack JavaScript with MongoDB, Express, React, and Node.js",techStack:{frontend:"React, TypeScript, Tailwind CSS",backend:"Node.js, Express",database:"MongoDB"},structure:["\uD83D\uDCC1 {project-name}/","├── \uD83D\uDCC1 client/","│   ├── \uD83D\uDCC1 public/","│   │   ├── \uD83D\uDCC4 favicon.ico","│   │   └── \uD83D\uDCC4 index.html","│   ├── \uD83D\uDCC1 src/","│   │   ├── \uD83D\uDCC1 components/","│   │   │   └── \uD83D\uDCC4 Button.tsx","│   │   ├── \uD83D\uDCC1 pages/","│   │   │   └── \uD83D\uDCC4 Home.tsx","│   │   ├── \uD83D\uDCC1 api/","│   │   │   └── \uD83D\uDCC4 index.ts","│   │   ├── \uD83D\uDCC4 App.tsx","│   │   ├── \uD83D\uDCC4 main.tsx","│   │   └── \uD83D\uDCC4 index.css","│   ├── \uD83D\uDCC4 vite.config.ts","│   ├── \uD83D\uDCC4 tsconfig.json","│   ├── \uD83D\uDCC4 tailwind.config.js","│   ├── \uD83D\uDCC4 postcss.config.js","│   └── \uD83D\uDCC4 package.json","├── \uD83D\uDCC1 server/","│   ├── \uD83D\uDCC1 src/","│   │   ├── \uD83D\uDCC1 controllers/","│   │   │   └── \uD83D\uDCC4 index.ts","│   │   ├── \uD83D\uDCC1 models/","│   │   │   └── \uD83D\uDCC4 index.ts","│   │   ├── \uD83D\uDCC1 routes/","│   │   │   └── \uD83D\uDCC4 index.ts","│   │   ├── \uD83D\uDCC1 middleware/","│   │   │   └── \uD83D\uDCC4 auth.ts","│   │   ├── \uD83D\uDCC1 config/","│   │   │   └── \uD83D\uDCC4 db.ts","│   │   └── \uD83D\uDCC4 index.ts","│   ├── \uD83D\uDCC4 package.json","│   └── \uD83D\uDCC4 tsconfig.json","├── \uD83D\uDCC4 package.json","├── \uD83D\uDCC4 docker-compose.yml","├── \uD83D\uDCC4 .env.example","└── \uD83D\uDCC4 README.md"],baseFiles:[{path:"server/tsconfig.json",content:`{
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
}`},{path:"client/tsconfig.json",content:`{
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
}`},{path:"client/tailwind.config.js",content:`/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`},{path:"docker-compose.yml",content:`version: '3'

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
`},{path:".env.example",content:`# MongoDB Connection
MONGODB_URI=mongodb://mongodb:27017/myapp
NODE_ENV=development

# Server
SERVER_PORT=4000
JWT_SECRET=your_jwt_secret_here

# Client
VITE_API_URL=http://localhost:4000/api`}],promptInstructions:"Create a full-stack MERN application with proper separation between client and server. The client should use React with TypeScript and Tailwind CSS. The server should use Express with TypeScript and MongoDB with Mongoose. Implement proper authentication using JWT. Include API validation with zod or similar. Set up proper error handling and logging on both client and server."}],default:"react-vite"};function o(e){return n.templates.find(t=>t.id===e)}function r(){return o(n.default)||n.templates[0]}}};