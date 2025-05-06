"use strict";(()=>{var e={};e.id=212,e.ids=[212],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},25528:e=>{e.exports=require("next/dist\\client\\components\\action-async-storage.external.js")},91877:e=>{e.exports=require("next/dist\\client\\components\\request-async-storage.external.js")},25319:e=>{e.exports=require("next/dist\\client\\components\\static-generation-async-storage.external.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},59796:e=>{e.exports=require("zlib")},69445:(e,t,s)=>{s.r(t),s.d(t,{headerHooks:()=>m,originalPathname:()=>g,patchFetch:()=>h,requestAsyncStorage:()=>l,routeModule:()=>D,serverHooks:()=>C,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>x});var n={};s.r(n),s.d(n,{POST:()=>p});var o=s(95419),r=s(69108),u=s(99678),i=s(78070),a=s(81664),c=s(42303);async function p(e){try{let t;let s=(0,a.K)(),{data:n}=await s.auth.getSession();if(!n.session)return i.Z.json({error:"Authentication required"},{status:401});let o=await e.json();if(!o.projectName||!o.techStack)return i.Z.json({error:"Missing required fields: projectName and techStack"},{status:400});let{techStack:r}=o;(t="string"==typeof r.frontend&&r.frontend.toLowerCase().includes("next")?(0,c.l3)("next-js"):"string"==typeof r.backend&&r.backend.toLowerCase().includes("express")||"string"==typeof r.database&&r.database.toLowerCase().includes("mongo")?(0,c.l3)("mern-stack"):(0,c.l3)("react-vite"))||(t=(0,c.NJ)());let u=o.projectName.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""),p=t.structure.map(e=>e.replace("{project-name}",u));return i.Z.json({structure:p,template:{id:t.id,name:t.name}})}catch(e){return console.error("Error generating structure:",e),i.Z.json({error:"Internal server error"},{status:500})}}let D=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/structure/route",pathname:"/api/structure",filename:"route",bundlePath:"app/api/structure/route"},resolvedPagePath:"c:\\Users\\Administrator\\ocio\\app\\api\\structure\\route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:C,headerHooks:m,staticGenerationBailout:x}=D,g="/api/structure/route";function h(){return(0,u.patchFetch)({serverHooks:C,staticGenerationAsyncStorage:d})}},42303:(e,t,s)=>{s.d(t,{NJ:()=>r,l3:()=>o,zd:()=>n});let n={templates:[{id:"react-vite",name:"React + Vite",description:"Modern React app with Vite, TypeScript, and Tailwind CSS",techStack:{frontend:"React, TypeScript, Tailwind CSS",backend:"None (Static)",database:"None"},structure:["\uD83D\uDCC1 {project-name}/","├── \uD83D\uDCC1 public/","│   ├── \uD83D\uDCC4 favicon.ico","│   └── \uD83D\uDCC4 robots.txt","├── \uD83D\uDCC1 src/","│   ├── \uD83D\uDCC1 components/","│   │   └── \uD83D\uDCC4 Button.tsx","│   ├── \uD83D\uDCC1 pages/","│   │   └── \uD83D\uDCC4 Home.tsx","│   ├── \uD83D\uDCC4 App.tsx","│   ├── \uD83D\uDCC4 main.tsx","│   └── \uD83D\uDCC4 index.css","├── \uD83D\uDCC4 index.html","├── \uD83D\uDCC4 vite.config.ts","├── \uD83D\uDCC4 tsconfig.json","├── \uD83D\uDCC4 tailwind.config.js","├── \uD83D\uDCC4 postcss.config.js","├── \uD83D\uDCC4 package.json","└── \uD83D\uDCC4 README.md"],baseFiles:[{path:"tsconfig.json",content:`{
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
VITE_API_URL=http://localhost:4000/api`}],promptInstructions:"Create a full-stack MERN application with proper separation between client and server. The client should use React with TypeScript and Tailwind CSS. The server should use Express with TypeScript and MongoDB with Mongoose. Implement proper authentication using JWT. Include API validation with zod or similar. Set up proper error handling and logging on both client and server."}],default:"react-vite"};function o(e){return n.templates.find(t=>t.id===e)}function r(){return o(n.default)||n.templates[0]}},81664:(e,t,s)=>{s.d(t,{K:()=>u,e:()=>r});var n=s(46874),o=s(32455);function r(e){return(0,n.lx)(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{cookies:{get:t=>e.get(t)?.value,set(t,s,n){e.set({name:t,value:s,...n})},remove(t,s){e.set({name:t,value:"",...s})}}})}function u(){return r((0,o.cookies)())}}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),n=t.X(0,[638,246,455,874],()=>s(69445));module.exports=n})();