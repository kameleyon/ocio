import { ProjectTemplate } from './types';

export const nextTemplate: ProjectTemplate = {
  id: 'next-js',
  name: 'Next.js',
  description: 'Full-stack React framework with server-side rendering',
  techStack: {
    frontend: 'Next.js, React, TypeScript, Tailwind CSS',
    backend: 'Next.js API Routes',
    database: 'Prisma with SQLite (configurable)',
  },
  structure: [
    "📁 {project-name}/",
    "├── 📁 app/",
    "│   ├── 📄 favicon.ico",
    "│   ├── 📄 globals.css",
    "│   ├── 📄 layout.tsx",
    "│   ├── 📄 page.tsx",
    "│   └── 📁 api/",
    "│       └── 📁 hello/",
    "│           └── 📄 route.ts",
    "├── 📁 components/",
    "│   └── 📁 ui/",
    "│       └── 📄 button.tsx",
    "├── 📁 lib/",
    "│   └── 📄 utils.ts",
    "├── 📁 public/",
    "│   └── 📄 vercel.svg",
    "├── 📄 next.config.js",
    "├── 📄 package.json",
    "├── 📄 postcss.config.js",
    "├── 📄 tailwind.config.js",
    "├── 📄 tsconfig.json",
    "└── 📄 README.md",
  ],
  baseFiles: [
    {
      path: "next.config.js",
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig`
    },
    {
      path: "tsconfig.json",
      content: `{
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
}`
    },
    {
      path: "postcss.config.js",
      content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
    },
    {
      path: "tailwind.config.js",
      content: `/** @type {import('tailwindcss').Config} */
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
}`
    },
    {
      path: ".env.example",
      content: `# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# API Keys
NEXT_PUBLIC_API_URL=your_api_url_here`
    }
  ],
  promptInstructions: `Create a Next.js 13+ app with App Router. Use React Server Components where appropriate and Client Components when needed. Implement NextAuth.js for authentication if required. Use Prisma for database access with proper migrations setup. Ensure all API routes use proper error handling and validation.`
};
