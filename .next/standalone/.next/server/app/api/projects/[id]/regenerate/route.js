"use strict";(()=>{var e={};e.id=683,e.ids=[683],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5528:e=>{e.exports=require("next/dist\\client\\components\\action-async-storage.external.js")},1877:e=>{e.exports=require("next/dist\\client\\components\\request-async-storage.external.js")},5319:e=>{e.exports=require("next/dist\\client\\components\\static-generation-async-storage.external.js")},4300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},2361:e=>{e.exports=require("events")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},1808:e=>{e.exports=require("net")},5477:e=>{e.exports=require("punycode")},2781:e=>{e.exports=require("stream")},4404:e=>{e.exports=require("tls")},7310:e=>{e.exports=require("url")},3837:e=>{e.exports=require("util")},9796:e=>{e.exports=require("zlib")},2014:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>g,originalPathname:()=>v,patchFetch:()=>w,requestAsyncStorage:()=>m,routeModule:()=>l,serverHooks:()=>f,staticGenerationAsyncStorage:()=>h,staticGenerationBailout:()=>j});var o={};r.r(o),r.d(o,{POST:()=>u});var n=r(5419),a=r(9108),s=r(9678),i=r(8070),c=r(1664),p=r(2455),d=r(1581);async function u(e,{params:t}){(0,p.cookies)();let r=(0,c.e)();try{let{data:{session:e}}=await r.auth.getSession();if(!e)return i.Z.json({error:"Unauthorized"},{status:401});let o=t.id,{data:n,error:a}=await r.from("projects").select("*").eq("id",o).eq("user_id",e.user.id).single();if(a){if("PGRST116"===a.code)return i.Z.json({error:"Project not found"},{status:404});throw a}let{data:s,error:c}=await r.from("profiles").select("subscription_tier, generation_count").eq("id",e.user.id).single();if(c)throw c;if((!s.subscription_tier||"free"===s.subscription_tier)&&s.generation_count>=5)return i.Z.json({error:"Generation limit reached for free tier",limitReached:!0},{status:403});return await r.from("projects").update({status:"generating"}).eq("id",o),await r.rpc("increment_generation_count",{user_id:e.user.id}),setTimeout(async()=>{try{let e=await (0,d.bh)(n.prompt),t=await (0,d.iq)(n.prompt,e),a=await (0,d.d6)(e.name,t),s=await a.arrayBuffer(),i=Buffer.from(s),c=Date.now(),p=`project-zips/${o}/${c}-${e.name.toLowerCase().replace(/\s+/g,"-")}.zip`,{error:u}=await r.storage.from("project-files").upload(p,i,{contentType:"application/zip",upsert:!0});if(u)throw u;let{data:l}=r.storage.from("project-files").getPublicUrl(p);await r.from("projects").update({status:"completed",name:e.name,description:e.description,tech_stack:e.techStack,structure:e.structure,download_url:l.publicUrl}).eq("id",o)}catch(e){console.error("Error in background generation:",e),await r.from("projects").update({status:"failed"}).eq("id",o)}},1e3),i.Z.json({success:!0,status:"generating"})}catch(e){return console.error("Error regenerating project:",e),i.Z.json({error:"Internal server error"},{status:500})}}let l=new n.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/projects/[id]/regenerate/route",pathname:"/api/projects/[id]/regenerate",filename:"route",bundlePath:"app/api/projects/[id]/regenerate/route"},resolvedPagePath:"C:\\Users\\Administrator\\myAPP\\ocioweb\\app\\api\\projects\\[id]\\regenerate\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:f,headerHooks:g,staticGenerationBailout:j}=l,v="/api/projects/[id]/regenerate/route";function w(){return(0,s.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:h})}},1581:(e,t,r)=>{r.d(t,{bh:()=>s,d6:()=>c,eU:()=>p,iq:()=>i,lv:()=>a});var o=r(1883),n=r.n(o);async function a(e){try{let t=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:'You are an expert web developer who helps name projects based on their descriptions. Generate a simple, memorable name for this project based on the prompt. Return ONLY the name, nothing else. The name should be short (1-2 words), catchy, and lowercase with hyphen if multiple words. Do not add any prefixes or suffixes like "app" or "io". Example: "task-flow" or "recipemaster"'},{role:"user",content:`Generate a project name for this app: ${e}`}],max_tokens:50})});if(!r.ok)throw Error(`AI API Error: ${r.status}`);return(await r.json()).choices[0].message.content.trim().replace(/"/g,"").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")||"new-project-"+Date.now().toString().slice(-6)}catch(e){return console.error("Error generating project name:",e),"new-project-"+Date.now().toString().slice(-6)}}async function s(e){try{let t=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:`You are an expert full-stack developer. Given a prompt describing an app, generate project details including name, description, tech stack, and file structure. Return ONLY valid JSON in this format:
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
}`}]}r(1618)},1664:(e,t,r)=>{r.d(t,{e:()=>a});var o=r(6874),n=r(2455);function a(){let e=(0,n.cookies)();return(0,o.lx)(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{cookies:{get:t=>e.get(t)?.value,set(t,r,o){e.set({name:t,value:r,...o})},remove(t,r){e.set({name:t,value:"",...r})}}})}}};var t=require("../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[225,542,847],()=>r(2014));module.exports=o})();