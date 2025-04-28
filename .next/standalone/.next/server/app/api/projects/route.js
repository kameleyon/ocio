"use strict";(()=>{var e={};e.id=871,e.ids=[871],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5528:e=>{e.exports=require("next/dist\\client\\components\\action-async-storage.external.js")},1877:e=>{e.exports=require("next/dist\\client\\components\\request-async-storage.external.js")},5319:e=>{e.exports=require("next/dist\\client\\components\\static-generation-async-storage.external.js")},4300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},2361:e=>{e.exports=require("events")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},1808:e=>{e.exports=require("net")},5477:e=>{e.exports=require("punycode")},2781:e=>{e.exports=require("stream")},4404:e=>{e.exports=require("tls")},7310:e=>{e.exports=require("url")},3837:e=>{e.exports=require("util")},9796:e=>{e.exports=require("zlib")},1291:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>E,originalPathname:()=>P,patchFetch:()=>b,requestAsyncStorage:()=>j,routeModule:()=>g,serverHooks:()=>y,staticGenerationAsyncStorage:()=>w,staticGenerationBailout:()=>v});var o={};r.r(o),r.d(o,{GET:()=>m,POST:()=>f});var n=r(5419),a=r(9108),s=r(9678),i=r(8070),c=r(1664),p=r(2455);let l=(0,r(6323).eI)("https://cfovctpyutyvyqzvypwx.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmb3ZjdHB5dXR5dnlxenZ5cHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTk0MDIsImV4cCI6MjA2MDQ5NTQwMn0.J-c-JGblGgP4zi5ceTORCq8MYbdfcbtP-Ml8a8s4oRM");var d=r(1581);class u{async createProject(e,t){try{let r=await (0,d.lv)(t),{data:o,error:n}=await l.from("projects").insert([{user_id:e,name:r,description:t,prompt:t,status:"pending",tech_stack:{}}]).select().single();if(n)throw n;return this.generateFullProject(o.id,t),o}catch(e){return console.error("Error creating project:",e),null}}async generateFullProject(e,t){try{await l.from("projects").update({status:"generating"}).eq("id",e);let r=await (0,d.bh)(t);await l.from("projects").update({name:r.name,description:r.description,tech_stack:r.techStack,structure:r.structure}).eq("id",e);let o=await (0,d.iq)(t,r),n=await (0,d.d6)(r.name,o),a=Date.now(),s=`project-zips/${e}/${a}-${r.name.toLowerCase().replace(/\s+/g,"-")}.zip`,{error:i}=await l.storage.from("project-files").upload(s,n,{contentType:"application/zip",upsert:!0});if(i)throw i;let{data:c}=l.storage.from("project-files").getPublicUrl(s);await l.from("projects").update({status:"completed",download_url:c.publicUrl,files:o.map(e=>e.path)}).eq("id",e)}catch(t){console.error("Error generating full project:",t),await l.from("projects").update({status:"failed"}).eq("id",e)}}async getUserProjects(){try{let{data:e}=await l.auth.getSession();if(!e.session)throw Error("Authentication required");let t=e.session.user.id,{data:r,error:o}=await l.from("projects").select("*").eq("user_id",t).order("created_at",{ascending:!1});if(o)throw o;return r||[]}catch(e){return console.error("Error fetching projects:",e),[]}}static async getProjectsByUserId(e){try{let{data:t,error:r}=await l.from("projects").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(r)throw r;return t||[]}catch(e){return console.error("Error fetching projects by user ID:",e),[]}}async getProjectById(e){try{let{data:t,error:r}=await l.from("projects").select("*").eq("id",e).single();if(r)throw r;return t}catch(e){return console.error("Error fetching project:",e),null}}async downloadProject(e){try{let t=await this.getProjectById(e);if(!t||!t.download_url)throw Error("Project or download URL not found");return window.open(t.download_url,"_blank"),!0}catch(e){return console.error("Error downloading project:",e),!1}}async deleteProject(e){try{let t=`project-zips/${e}`,{data:r}=await l.storage.from("project-files").list(t);if(r&&r.length>0){let e=r.map(e=>`${t}/${e.name}`);await l.storage.from("project-files").remove(e)}let{error:o}=await l.from("projects").delete().eq("id",e);if(o)throw o;return!0}catch(e){return console.error("Error deleting project:",e),!1}}async regenerateProject(e){try{let t=await this.getProjectById(e);if(!t)throw Error("Project not found");return await l.from("projects").update({status:"generating"}).eq("id",e),this.generateFullProject(e,t.prompt),!0}catch(e){return console.error("Error regenerating project:",e),!1}}async getProjectFiles(e){try{let t=await this.getProjectById(e);if(!t)throw Error("Project not found");if("completed"!==t.status)return[];return(0,d.eU)({name:t.name,description:t.description,techStack:t.tech_stack,files:t.files||[],structure:t.structure||[]})}catch(e){return console.error("Error getting project files:",e),[]}}async incrementUserGenerationCount(e){try{let{error:t}=await l.rpc("increment_generation_count",{user_id:e});if(t)throw t;return!0}catch(e){return console.error("Error incrementing generation count:",e),!1}}}async function h(e){return u.getProjectsByUserId(e)}async function m(e){(0,p.cookies)();let t=(0,c.e)();try{let{data:{session:e}}=await t.auth.getSession();if(!e)return i.Z.json({error:"Unauthorized"},{status:401});let r=await h(e.user.id);return i.Z.json(r)}catch(e){return console.error("Error fetching projects:",e),i.Z.json({error:"Internal server error"},{status:500})}}async function f(e){(0,p.cookies)();let t=(0,c.e)();try{let{data:{session:r}}=await t.auth.getSession();if(!r)return i.Z.json({error:"Unauthorized"},{status:401});let{prompt:o}=await e.json();if(!o)return i.Z.json({error:"Prompt is required"},{status:400});let{data:n,error:a}=await t.from("profiles").select("subscription_tier, generation_count").eq("id",r.user.id).single();if(a)throw a;if((!n.subscription_tier||"free"===n.subscription_tier)&&n.generation_count>=5)return i.Z.json({error:"Generation limit reached for free tier",limitReached:!0},{status:403});let s=await (0,d.lv)(o),{data:c,error:p}=await t.from("projects").insert([{user_id:r.user.id,name:s,description:o,prompt:o,status:"pending",tech_stack:{}}]).select().single();if(p)throw p;await t.rpc("increment_generation_count",{user_id:r.user.id});let l=c.id;return await t.from("projects").update({status:"generating"}).eq("id",l),setTimeout(async()=>{try{let e=await (0,d.bh)(o);await t.from("projects").update({name:e.name,description:e.description,tech_stack:e.techStack,structure:e.structure,status:"completed",download_url:`/api/projects/${l}/download`}).eq("id",l)}catch(e){console.error("Error in background generation:",e),await t.from("projects").update({status:"failed"}).eq("id",l)}},1e3),i.Z.json(c)}catch(e){return console.error("Error creating project:",e),i.Z.json({error:"Internal server error"},{status:500})}}let g=new n.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/projects/route",pathname:"/api/projects",filename:"route",bundlePath:"app/api/projects/route"},resolvedPagePath:"C:\\Users\\Administrator\\myAPP\\ocioweb\\app\\api\\projects\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:j,staticGenerationAsyncStorage:w,serverHooks:y,headerHooks:E,staticGenerationBailout:v}=g,P="/api/projects/route";function b(){return(0,s.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:w})}},1581:(e,t,r)=>{r.d(t,{bh:()=>s,d6:()=>c,eU:()=>p,iq:()=>i,lv:()=>a});var o=r(1883),n=r.n(o);async function a(e){try{let t=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:'You are an expert web developer who helps name projects based on their descriptions. Generate a simple, memorable name for this project based on the prompt. Return ONLY the name, nothing else. The name should be short (1-2 words), catchy, and lowercase with hyphen if multiple words. Do not add any prefixes or suffixes like "app" or "io". Example: "task-flow" or "recipemaster"'},{role:"user",content:`Generate a project name for this app: ${e}`}],max_tokens:50})});if(!r.ok)throw Error(`AI API Error: ${r.status}`);return(await r.json()).choices[0].message.content.trim().replace(/"/g,"").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")||"new-project-"+Date.now().toString().slice(-6)}catch(e){return console.error("Error generating project name:",e),"new-project-"+Date.now().toString().slice(-6)}}async function s(e){try{let t=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:`You are an expert full-stack developer. Given a prompt describing an app, generate project details including name, description, tech stack, and file structure. Return ONLY valid JSON in this format:
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
            
            Ensure the structure follows modern best practices for the selected tech stack. Don't add comments or explanations, just the JSON object.`},{role:"user",content:`Generate project details for this app: ${e}`}],max_tokens:2e3})});if(!r.ok)throw Error(`AI API Error: ${r.status}`);let o=(await r.json()).choices[0].message.content.trim().match(/\{[\s\S]*\}/);if(!o)throw Error("Invalid response format");return JSON.parse(o[0])}catch(r){console.error("Error generating project details:",r);let t="new-project-"+Date.now().toString().slice(-6);return{name:t,description:e,techStack:{frontend:"React, TypeScript, Tailwind CSS",backend:"Node.js, Express",database:"MongoDB",deployment:"Vercel"},files:[],structure:[`📁 ${t}/`,"├── \uD83D\uDCC1 public/","│   ├── \uD83D\uDCC4 favicon.ico","│   └── \uD83D\uDCC4 index.html","├── \uD83D\uDCC1 src/","│   ├── \uD83D\uDCC1 components/","│   │   └── \uD83D\uDCC4 App.jsx","│   └── \uD83D\uDCC4 index.js","├── \uD83D\uDCC4 package.json","└── \uD83D\uDCC4 README.md"]}}}async function i(e,t){try{let r=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,o=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:`You are an expert full-stack developer. Generate file contents for a web application based on the provided project structure. Return ONLY valid JSON as an array of objects with 'path' and 'content' properties for each file:
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
            
            Return ONLY the JSON array containing file objects.`},{role:"user",content:`Generate file contents for this project:
            
            Project name: ${t.name}
            Project description: ${t.description}
            Tech stack:
            - Frontend: ${t.techStack.frontend}
            - Backend: ${t.techStack.backend}
            - Database: ${t.techStack.database}
            
            Project structure:
            ${t.structure.join("\n")}
            
            Original prompt: ${e}`}],max_tokens:4e3})});if(!o.ok)throw Error(`AI API Error: ${o.status}`);let n=(await o.json()).choices[0].message.content.trim().match(/\[[\s\S]*\]/);if(!n)throw Error("Invalid response format");return JSON.parse(n[0])}catch(e){return console.error("Error generating file contents:",e),[{path:"README.md",content:`# ${t.name}

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
}`}]}}async function c(e,t){let r=new(n());return t.find(e=>"README.md"===e.path)||r.file(`${e}/README.md`,`# ${e}

This project was generated with OptimusCode.io

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the development server: \`npm run dev\`

## Features

- Modern, responsive UI
- API endpoints
- Database integration`),t.find(e=>".env.example"===e.path)||r.file(`${e}/.env.example`,`# Database Connection
DATABASE_URL=your_database_url_here

# Authentication
AUTH_SECRET=your_auth_secret_here

# API Keys
API_KEY=your_api_key_here`),t.forEach(t=>{r.file(`${e}/${t.path}`,t.content)}),r.generateAsync({type:"blob"})}function p(e){return[{path:"index.html",content:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e.name}</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.js"></script>
</body>
</html>`},{path:"src/index.js",content:`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`},{path:"package.json",content:`{
  "name": "${e.name}",
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
}`}]}r(1618)},1664:(e,t,r)=>{r.d(t,{e:()=>a});var o=r(6874),n=r(2455);function a(){let e=(0,n.cookies)();return(0,o.lx)(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{cookies:{get:t=>e.get(t)?.value,set(t,r,o){e.set({name:t,value:r,...o})},remove(t,r){e.set({name:t,value:"",...r})}}})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[225,542,847],()=>r(1291));module.exports=o})();