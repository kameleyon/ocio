exports.id=137,exports.ids=[137],exports.modules={6685:(e,t,r)=>{Promise.resolve().then(r.bind(r,4385)),Promise.resolve().then(r.bind(r,1918))},3095:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2583,23)),Promise.resolve().then(r.t.bind(r,6840,23)),Promise.resolve().then(r.t.bind(r,8771,23)),Promise.resolve().then(r.t.bind(r,3225,23)),Promise.resolve().then(r.t.bind(r,9295,23)),Promise.resolve().then(r.t.bind(r,3982,23))},8181:(e,t,r)=>{"use strict";r.d(t,{Z:()=>g});var o=r(5344),a=r(3729),n=r.n(a),s=r(783),i=r.n(s),c=r(1918),l=r(6212),d=r(8426),u=r(4826),p=r(4010),h=r(1917),m=r(8120),f=r(8200);function g(){let{signOut:e,profile:t}=(0,c.useAuth)(),[r,a]=n().useState(!1);return o.jsx("header",{className:"py-4 bg-richBlack/90 backdrop-blur-md border-b border-slateBlue/20 sticky top-0 z-50",children:(0,o.jsxs)(d.W,{children:[(0,o.jsxs)("div",{className:"flex items-center justify-between",children:[(0,o.jsxs)(i(),{href:"/build",className:"flex items-center space-x-2",children:[o.jsx(u.Z,{className:"h-6 w-6 text-robinEggBlue"}),o.jsx("span",{className:"font-comfortaa font-bold text-xl text-whiteSmoke",children:"OptimusCode.io"})]}),(0,o.jsxs)("nav",{className:"hidden md:flex items-center space-x-6",children:[(0,o.jsxs)(i(),{href:"/build",className:"text-lightGray hover:text-whiteSmoke transition flex items-center gap-1.5",children:[o.jsx(p.Z,{className:"h-4 w-4"}),o.jsx("span",{children:"Build"})]}),(0,o.jsxs)(i(),{href:"/projects",className:"text-lightGray hover:text-whiteSmoke transition flex items-center gap-1.5",children:[o.jsx(h.Z,{className:"h-4 w-4"}),o.jsx("span",{children:"Projects"})]}),o.jsx("div",{className:"h-6 border-l border-slateBlue/30 mx-2"}),(0,o.jsxs)(l.z,{variant:"outline",className:"border-slateBlue/50 text-lightGray hover:text-whiteSmoke hover:border-slateBlue",onClick:()=>e(),children:[o.jsx(m.Z,{className:"h-4 w-4 mr-1.5"}),"Sign Out"]})]}),o.jsx("button",{className:"md:hidden text-lightGray",onClick:()=>a(!r),children:o.jsx(f.Z,{className:"h-6 w-6"})})]}),r&&(0,o.jsxs)("nav",{className:"md:hidden mt-4 pt-4 border-t border-slateBlue/20 flex flex-col space-y-2",children:[(0,o.jsxs)(i(),{href:"/build",className:"text-lightGray hover:text-whiteSmoke p-2 rounded-md flex items-center",onClick:()=>a(!1),children:[o.jsx(p.Z,{className:"h-4 w-4 mr-2"}),o.jsx("span",{children:"Build"})]}),(0,o.jsxs)(i(),{href:"/projects",className:"text-lightGray hover:text-whiteSmoke p-2 rounded-md flex items-center",onClick:()=>a(!1),children:[o.jsx(h.Z,{className:"h-4 w-4 mr-2"}),o.jsx("span",{children:"Projects"})]}),(0,o.jsxs)(l.z,{variant:"outline",className:"mt-2 border-slateBlue/50 text-lightGray hover:text-whiteSmoke hover:border-slateBlue w-full justify-start",onClick:()=>{e(),a(!1)},children:[o.jsx(m.Z,{className:"h-4 w-4 mr-2"}),"Sign Out"]})]})]})})}},6212:(e,t,r)=>{"use strict";r.d(t,{z:()=>l});var o=r(5344),a=r(3729),n=r(2751),s=r(9247),i=r(1626);let c=(0,s.j)("inline-flex items-center justify-center rounded-xl text-sm font-comfortaa font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border-2 border-slateBlue text-whiteSmoke hover:bg-slateBlue hover:bg-opacity-20 hover:shadow-glow",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline",gradient:"bg-gradient-to-r from-slateBlue to-robinEggBlue text-whiteSmoke shadow-glow hover:shadow-lg hover:scale-105"},size:{default:"h-10 px-6 py-2",sm:"h-9 px-3",lg:"h-12 px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),l=a.forwardRef(({className:e,variant:t,size:r,asChild:a=!1,...s},l)=>{let d=a?n.g7:"button";return o.jsx(d,{className:(0,i.cn)(c({variant:t,size:r,className:e})),ref:l,...s})});l.displayName="Button"},1351:(e,t,r)=>{"use strict";r.d(t,{Ol:()=>i,Zb:()=>s,aY:()=>c,eW:()=>l});var o=r(5344),a=r(3729),n=r(1626);let s=a.forwardRef(({className:e,isGlass:t=!1,...r},a)=>o.jsx("div",{ref:a,className:(0,n.cn)("rounded-xl border",t?"bg-berkeleyBlue/30 backdrop-blur-md border-slateBlue/20 shadow-md":"bg-card text-card-foreground",e),...r}));s.displayName="Card";let i=a.forwardRef(({className:e,...t},r)=>o.jsx("div",{ref:r,className:(0,n.cn)("flex flex-col space-y-1.5 p-6",e),...t}));i.displayName="CardHeader",a.forwardRef(({className:e,...t},r)=>o.jsx("h3",{ref:r,className:(0,n.cn)("text-2xl font-bold leading-none tracking-tight font-comfortaa",e),...t})).displayName="CardTitle",a.forwardRef(({className:e,...t},r)=>o.jsx("p",{ref:r,className:(0,n.cn)("text-sm text-muted-foreground",e),...t})).displayName="CardDescription";let c=a.forwardRef(({className:e,...t},r)=>o.jsx("div",{ref:r,className:(0,n.cn)("p-6 pt-0",e),...t}));c.displayName="CardContent";let l=a.forwardRef(({className:e,...t},r)=>o.jsx("div",{ref:r,className:(0,n.cn)("flex items-center p-6 pt-0",e),...t}));l.displayName="CardFooter"},8426:(e,t,r)=>{"use strict";r.d(t,{W:()=>s});var o=r(5344),a=r(3729),n=r(1626);let s=a.forwardRef(({className:e,as:t="div",...r},a)=>o.jsx(t,{ref:a,className:(0,n.cn)("w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",e),...r}));s.displayName="Container"},2549:(e,t,r)=>{"use strict";r.d(t,{I:()=>s});var o=r(5344),a=r(3729),n=r(1626);let s=a.forwardRef(({className:e,containerClassName:t,type:r,...a},s)=>o.jsx("div",{className:t,children:o.jsx("input",{type:r,className:(0,n.cn)("flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slateBlue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",e),ref:s,...a})}));s.displayName="Input"},4385:(e,t,r)=>{"use strict";r.r(t),r.d(t,{ParticleBackground:()=>n});var o=r(5344),a=r(3729);function n(){let e=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t=e.current;if(!t)return;let r=t.getContext("2d");if(!r)return;let o=()=>{t.width=window.innerWidth,t.height=window.innerHeight};o(),window.addEventListener("resize",o);let a=["#7357C6","#3DD6D1"],n=[];for(let e=0;e<100;e++)s();function s(){let e=2*Math.random()+1;n.push({x:Math.random()*t.width,y:t.height+e,size:e,color:a[Math.floor(Math.random()*a.length)],speed:1*Math.random()+.2,opacity:0,life:0,maxLife:1e3*Math.random()+3e3})}let i=requestAnimationFrame(function e(){r.clearRect(0,0,t.width,t.height);for(let e=0;e<n.length;e++){let t=n[e];t.life+=16,t.life<500?t.opacity=Math.min(t.life/500,.7):t.life>t.maxLife-500&&(t.opacity=.7*Math.max((t.maxLife-t.life)/500,0)),t.y-=t.speed,r.beginPath(),r.arc(t.x,t.y,t.size,0,2*Math.PI),r.fillStyle=t.color,r.globalAlpha=t.opacity,r.fill(),r.globalAlpha=1,t.life>=t.maxLife&&(s(),n.splice(e,1),e--)}requestAnimationFrame(e)});return()=>{window.removeEventListener("resize",o),cancelAnimationFrame(i)}},[]),o.jsx("canvas",{ref:e,className:"fixed inset-0 w-full h-full -z-10 pointer-events-none"})}},1918:(e,t,r)=>{"use strict";r.r(t),r.d(t,{AuthProvider:()=>l,useAuth:()=>d});var o=r(5344),a=r(3729),n=r(6234),s=r(2254);async function i(e){try{let{data:t,error:r}=await n.O.from("profiles").select("*").eq("id",e).single();if(r)throw r;return t}catch(e){return console.error("Error in getProfile:",e),null}}let c=(0,a.createContext)(void 0);function l({children:e}){let[t,r]=(0,a.useState)(null),[l,d]=(0,a.useState)(null),[u,p]=(0,a.useState)(!0),h=(0,s.useRouter)();(0,a.useEffect)(()=>{(async()=>{try{let{data:{session:e}}=await n.O.auth.getSession();if(e?.user){r(e.user);let t=await i(e.user.id);d(t)}}catch(e){console.error("Error checking session:",e)}finally{p(!1)}})();let{data:e}=n.O.auth.onAuthStateChange(async(e,t)=>{t?.user?(r(t.user),d(await i(t.user.id))):(r(null),d(null)),p(!1)});return()=>{e.subscription.unsubscribe()}},[]);let m=async(e,t)=>{try{let{data:o,error:a}=await n.O.auth.signInWithPassword({email:e,password:t});if(a)throw a;if(o.user){r(o.user);let e=await i(o.user.id);d(e),h.push("/build")}return{error:null}}catch(e){return console.error("Error signing in:",e),{error:e}}},f=async(e,t)=>{try{let{data:r,error:o}=await n.O.auth.signUp({email:e,password:t});if(o)throw o;return r.user&&(await n.O.from("profiles").insert({id:r.user.id,email:r.user.email||""}),h.push("/login?message=verification-email-sent")),{error:null}}catch(e){return console.error("Error signing up:",e),{error:e}}},g=async()=>{try{await n.O.auth.signOut(),h.push("/")}catch(e){console.error("Error signing out:",e)}},w=async()=>{t&&d(await i(t.id))};return o.jsx(c.Provider,{value:{user:t,profile:l,loading:u,signIn:m,signUp:f,signOut:g,refreshProfile:w},children:e})}function d(){let e=(0,a.useContext)(c);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},8556:(e,t,r)=>{"use strict";r.d(t,{Y:()=>d});var o=r(6234),a=r(9554),n=r.n(a);async function s(e){try{let t=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:'You are an expert web developer who helps name projects based on their descriptions. Generate a simple, memorable name for this project based on the prompt. Return ONLY the name, nothing else. The name should be short (1-2 words), catchy, and lowercase with hyphen if multiple words. Do not add any prefixes or suffixes like "app" or "io". Example: "task-flow" or "recipemaster"'},{role:"user",content:`Generate a project name for this app: ${e}`}],max_tokens:50})});if(!r.ok)throw Error(`AI API Error: ${r.status}`);return(await r.json()).choices[0].message.content.trim().replace(/"/g,"").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")||"new-project-"+Date.now().toString().slice(-6)}catch(e){return console.error("Error generating project name:",e),"new-project-"+Date.now().toString().slice(-6)}}async function i(e){try{let t=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:`You are an expert full-stack developer. Given a prompt describing an app, generate project details including name, description, tech stack, and file structure. Return ONLY valid JSON in this format:
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
            
            Ensure the structure follows modern best practices for the selected tech stack. Don't add comments or explanations, just the JSON object.`},{role:"user",content:`Generate project details for this app: ${e}`}],max_tokens:2e3})});if(!r.ok)throw Error(`AI API Error: ${r.status}`);let o=(await r.json()).choices[0].message.content.trim().match(/\{[\s\S]*\}/);if(!o)throw Error("Invalid response format");return JSON.parse(o[0])}catch(r){console.error("Error generating project details:",r);let t="new-project-"+Date.now().toString().slice(-6);return{name:t,description:e,techStack:{frontend:"React, TypeScript, Tailwind CSS",backend:"Node.js, Express",database:"MongoDB",deployment:"Vercel"},files:[],structure:[`📁 ${t}/`,"├── \uD83D\uDCC1 public/","│   ├── \uD83D\uDCC4 favicon.ico","│   └── \uD83D\uDCC4 index.html","├── \uD83D\uDCC1 src/","│   ├── \uD83D\uDCC1 components/","│   │   └── \uD83D\uDCC4 App.jsx","│   └── \uD83D\uDCC4 index.js","├── \uD83D\uDCC4 package.json","└── \uD83D\uDCC4 README.md"]}}}async function c(e,t){try{let r=process.env.OPENROUTER_API_KEY||process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,o=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`,"HTTP-Referer":"https://optimuscode.io"},body:JSON.stringify({model:"anthropic/claude-3-opus",messages:[{role:"system",content:`You are an expert full-stack developer. Generate file contents for a web application based on the provided project structure. Return ONLY valid JSON as an array of objects with 'path' and 'content' properties for each file:
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
            
            Original prompt: ${e}`}],max_tokens:4e3})});if(!o.ok)throw Error(`AI API Error: ${o.status}`);let a=(await o.json()).choices[0].message.content.trim().match(/\[[\s\S]*\]/);if(!a)throw Error("Invalid response format");return JSON.parse(a[0])}catch(e){return console.error("Error generating file contents:",e),[{path:"README.md",content:`# ${t.name}

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
}`}]}}async function l(e,t){let r=new(n());return t.find(e=>"README.md"===e.path)||r.file(`${e}/README.md`,`# ${e}

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
API_KEY=your_api_key_here`),t.forEach(t=>{r.file(`${e}/${t.path}`,t.content)}),r.generateAsync({type:"blob"})}r(8938);class d{async createProject(e,t){try{let r=await s(t),{data:a,error:n}=await o.O.from("projects").insert([{user_id:e,name:r,description:t,prompt:t,status:"pending",tech_stack:{}}]).select().single();if(n)throw n;return this.generateFullProject(a.id,t),a}catch(e){return console.error("Error creating project:",e),null}}async generateFullProject(e,t){try{await o.O.from("projects").update({status:"generating"}).eq("id",e);let r=await i(t);await o.O.from("projects").update({name:r.name,description:r.description,tech_stack:r.techStack,structure:r.structure}).eq("id",e);let a=await c(t,r),n=await l(r.name,a),s=Date.now(),d=`project-zips/${e}/${s}-${r.name.toLowerCase().replace(/\s+/g,"-")}.zip`,{error:u}=await o.O.storage.from("project-files").upload(d,n,{contentType:"application/zip",upsert:!0});if(u)throw u;let{data:p}=o.O.storage.from("project-files").getPublicUrl(d);await o.O.from("projects").update({status:"completed",download_url:p.publicUrl,files:a.map(e=>e.path)}).eq("id",e)}catch(t){console.error("Error generating full project:",t),await o.O.from("projects").update({status:"failed"}).eq("id",e)}}async getUserProjects(){try{let{data:e}=await o.O.auth.getSession();if(!e.session)throw Error("Authentication required");let t=e.session.user.id,{data:r,error:a}=await o.O.from("projects").select("*").eq("user_id",t).order("created_at",{ascending:!1});if(a)throw a;return r||[]}catch(e){return console.error("Error fetching projects:",e),[]}}static async getProjectsByUserId(e){try{let{data:t,error:r}=await o.O.from("projects").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(r)throw r;return t||[]}catch(e){return console.error("Error fetching projects by user ID:",e),[]}}async getProjectById(e){try{let{data:t,error:r}=await o.O.from("projects").select("*").eq("id",e).single();if(r)throw r;return t}catch(e){return console.error("Error fetching project:",e),null}}async downloadProject(e){try{let t=await this.getProjectById(e);if(!t||!t.download_url)throw Error("Project or download URL not found");return window.open(t.download_url,"_blank"),!0}catch(e){return console.error("Error downloading project:",e),!1}}async deleteProject(e){try{let t=`project-zips/${e}`,{data:r}=await o.O.storage.from("project-files").list(t);if(r&&r.length>0){let e=r.map(e=>`${t}/${e.name}`);await o.O.storage.from("project-files").remove(e)}let{error:a}=await o.O.from("projects").delete().eq("id",e);if(a)throw a;return!0}catch(e){return console.error("Error deleting project:",e),!1}}async regenerateProject(e){try{let t=await this.getProjectById(e);if(!t)throw Error("Project not found");return await o.O.from("projects").update({status:"generating"}).eq("id",e),this.generateFullProject(e,t.prompt),!0}catch(e){return console.error("Error regenerating project:",e),!1}}async getProjectFiles(e){try{var t;let r=await this.getProjectById(e);if(!r)throw Error("Project not found");if("completed"!==r.status)return[];return t={name:r.name,description:r.description,techStack:r.tech_stack,files:r.files||[],structure:r.structure||[]},[{path:"index.html",content:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.name}</title>
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
}`}]}catch(e){return console.error("Error getting project files:",e),[]}}async incrementUserGenerationCount(e){try{let{error:t}=await o.O.rpc("increment_generation_count",{user_id:e});if(t)throw t;return!0}catch(e){return console.error("Error incrementing generation count:",e),!1}}}},6234:(e,t,r)=>{"use strict";r.d(t,{O:()=>o});let o=(0,r(3125).eI)("https://cfovctpyutyvyqzvypwx.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmb3ZjdHB5dXR5dnlxenZ5cHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTk0MDIsImV4cCI6MjA2MDQ5NTQwMn0.J-c-JGblGgP4zi5ceTORCq8MYbdfcbtP-Ml8a8s4oRM")},1626:(e,t,r)=>{"use strict";r.d(t,{cn:()=>n});var o=r(6815),a=r(9377);function n(...e){return(0,a.m6)((0,o.W)(e))}},2429:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>x,metadata:()=>w});var o=r(5036),a=r(5326),n=r.n(a),s=r(6242),i=r.n(s);r(7272);var c=r(6843);let l=(0,c.createProxy)(String.raw`C:\Users\Administrator\myAPP\ocioweb\components\ui\particle-background.tsx`),{__esModule:d,$$typeof:u}=l;l.default;let p=(0,c.createProxy)(String.raw`C:\Users\Administrator\myAPP\ocioweb\components\ui\particle-background.tsx#ParticleBackground`),h=(0,c.createProxy)(String.raw`C:\Users\Administrator\myAPP\ocioweb\contexts\auth-context.tsx`),{__esModule:m,$$typeof:f}=h;h.default;let g=(0,c.createProxy)(String.raw`C:\Users\Administrator\myAPP\ocioweb\contexts\auth-context.tsx#AuthProvider`);(0,c.createProxy)(String.raw`C:\Users\Administrator\myAPP\ocioweb\contexts\auth-context.tsx#useAuth`);let w={title:"OptimusCode.io | Turn Plain Text Into Production-Ready Apps",description:"AI-powered full-stack web app generator. No templates. No boilerplate. Just full-stack code, zipped and ready."};function x({children:e}){return o.jsx("html",{lang:"en",children:(0,o.jsxs)("body",{className:`${n().variable} ${i().variable}`,children:[o.jsx(p,{}),o.jsx(g,{children:e})]})})}},7272:()=>{}};