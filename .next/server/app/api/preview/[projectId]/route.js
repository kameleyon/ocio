"use strict";(()=>{var e={};e.id=381,e.ids=[381],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},25528:e=>{e.exports=require("next/dist\\client\\components\\action-async-storage.external.js")},91877:e=>{e.exports=require("next/dist\\client\\components\\request-async-storage.external.js")},25319:e=>{e.exports=require("next/dist\\client\\components\\static-generation-async-storage.external.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},94800:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>f,originalPathname:()=>y,patchFetch:()=>w,requestAsyncStorage:()=>g,routeModule:()=>u,serverHooks:()=>h,staticGenerationAsyncStorage:()=>m,staticGenerationBailout:()=>v});var a={};r.r(a),r.d(a,{GET:()=>p});var o=r(95419),n=r(69108),i=r(99678),s=r(78070),d=r(32455),c=r(81664),l=r(20967);async function p(e,{params:t}){try{let e=t.projectId,r=(0,d.cookies)(),a=(0,c.e)(r),{data:{session:o}}=await a.auth.getSession();if(!o)return new s.Z("Unauthorized",{status:401});let n=new l.Y,i=await n.getProjectById(e);if(!i||i.user_id!==o.user.id)return new s.Z("Project not found",{status:404});if("completed"!==i.status)return new s.Z(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>App Preview - Loading</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background-color: #f8f9fa;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .loader {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              max-width: 500px;
              padding: 2rem;
            }
            .spinner {
              border: 4px solid rgba(0, 0, 0, 0.1);
              border-radius: 50%;
              border-top: 4px solid #7357C6;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin-bottom: 1rem;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="loader">
            <div class="spinner"></div>
            <h2>Generating Your App Preview</h2>
            <p>Your application is still being generated. The preview will be available once generation is complete.</p>
          </div>
        </body>
        </html>
      `,{headers:{"Content-Type":"text/html"}});let p=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${i.name||"App Preview"}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f8f9fa;
          color: #343a40;
        }
        
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
        
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: #7357C6;
          color: white;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        
        .navbar h1 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        .nav-links {
          display: flex;
          gap: 1rem;
        }
        
        .nav-links a {
          color: white;
          text-decoration: none;
        }
        
        .board {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .column {
          background-color: #e9ecef;
          border-radius: 8px;
          padding: 1rem;
        }
        
        .column h2 {
          font-size: 1.2rem;
          margin-top: 0;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #7357C6;
        }
        
        .card {
          background-color: white;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .card h3 {
          margin-top: 0;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .card p {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
        }
        
        .card .tags {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }
        
        .card .tag {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          background-color: #e9ecef;
        }
        
        .card .tag.priority-high {
          background-color: #ff8787;
          color: #fff;
        }
        
        .card .tag.priority-medium {
          background-color: #ffd43b;
          color: #212529;
        }
        
        .card .tag.priority-low {
          background-color: #a5d8ff;
          color: #212529;
        }
        
        .add-task {
          display: flex;
          margin-bottom: 2rem;
        }
        
        .add-task input {
          flex-grow: 1;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-right: none;
          border-radius: 8px 0 0 8px;
          font-size: 1rem;
        }
        
        .add-task button {
          padding: 0.75rem 1.5rem;
          background-color: #7357C6;
          color: white;
          border: none;
          border-radius: 0 8px 8px 0;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .add-task button:hover {
          background-color: #5f48a5;
        }
        
        @media (max-width: 768px) {
          .board {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="app-container">
        <nav class="navbar">
          <h1>Task Management App</h1>
          <div class="nav-links">
            <a href="#">Dashboard</a>
            <a href="#">Projects</a>
            <a href="#">Settings</a>
            <a href="#">Logout</a>
          </div>
        </nav>
        
        <div class="add-task">
          <input type="text" placeholder="Add a new task...">
          <button>Add Task</button>
        </div>
        
        <div class="board">
          <div class="column">
            <h2>To Do</h2>
            <div class="card">
              <h3>Research user needs</h3>
              <p>Conduct surveys and interviews with target users</p>
              <div class="tags">
                <span class="tag priority-high">High Priority</span>
                <span class="tag">Research</span>
              </div>
            </div>
            <div class="card">
              <h3>Design user flow</h3>
              <p>Create user journey and flow diagrams</p>
              <div class="tags">
                <span class="tag priority-medium">Medium Priority</span>
                <span class="tag">Design</span>
              </div>
            </div>
            <div class="card">
              <h3>Set up testing environment</h3>
              <p>Configure testing framework and write initial tests</p>
              <div class="tags">
                <span class="tag priority-low">Low Priority</span>
                <span class="tag">Development</span>
              </div>
            </div>
          </div>
          
          <div class="column">
            <h2>In Progress</h2>
            <div class="card">
              <h3>Create wireframes</h3>
              <p>Design low-fidelity wireframes for key screens</p>
              <div class="tags">
                <span class="tag priority-high">High Priority</span>
                <span class="tag">Design</span>
              </div>
            </div>
            <div class="card">
              <h3>Set up CI/CD pipeline</h3>
              <p>Configure automated testing and deployment process</p>
              <div class="tags">
                <span class="tag priority-medium">Medium Priority</span>
                <span class="tag">DevOps</span>
              </div>
            </div>
          </div>
          
          <div class="column">
            <h2>Review</h2>
            <div class="card">
              <h3>API documentation</h3>
              <p>Create comprehensive documentation for REST API endpoints</p>
              <div class="tags">
                <span class="tag priority-medium">Medium Priority</span>
                <span class="tag">Documentation</span>
              </div>
            </div>
          </div>
          
          <div class="column">
            <h2>Done</h2>
            <div class="card">
              <h3>Project setup</h3>
              <p>Initialize repository and configure project structure</p>
              <div class="tags">
                <span class="tag priority-high">High Priority</span>
                <span class="tag">Development</span>
              </div>
            </div>
            <div class="card">
              <h3>Requirements gathering</h3>
              <p>Document functional and non-functional requirements</p>
              <div class="tags">
                <span class="tag priority-high">High Priority</span>
                <span class="tag">Planning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        // Simple drag and drop functionality
        document.addEventListener('DOMContentLoaded', function() {
          const cards = document.querySelectorAll('.card');
          const columns = document.querySelectorAll('.column');
          
          let draggedCard = null;
          
          // Make cards draggable
          cards.forEach(card => {
            card.setAttribute('draggable', 'true');
            
            card.addEventListener('dragstart', function() {
              draggedCard = this;
              setTimeout(() => {
                this.style.opacity = '0.5';
              }, 0);
            });
            
            card.addEventListener('dragend', function() {
              this.style.opacity = '1';
              draggedCard = null;
            });
          });
          
          // Set up columns as drop targets
          columns.forEach(column => {
            column.addEventListener('dragover', function(e) {
              e.preventDefault();
              this.style.backgroundColor = '#dce3e6';
            });
            
            column.addEventListener('dragleave', function() {
              this.style.backgroundColor = '#e9ecef';
            });
            
            column.addEventListener('drop', function(e) {
              e.preventDefault();
              this.style.backgroundColor = '#e9ecef';
              
              if (draggedCard) {
                // Insert after the heading
                const heading = this.querySelector('h2');
                this.insertBefore(draggedCard, heading.nextSibling);
              }
            });
          });
          
          // Add task functionality
          const addTaskForm = document.querySelector('.add-task');
          const taskInput = addTaskForm.querySelector('input');
          const addButton = addTaskForm.querySelector('button');
          
          addButton.addEventListener('click', function() {
            const taskText = taskInput.value.trim();
            
            if (taskText) {
              // Create new task card
              const newCard = document.createElement('div');
              newCard.className = 'card';
              newCard.setAttribute('draggable', 'true');
              
              newCard.innerHTML = \`
                <h3>\${taskText}</h3>
                <p>Added just now</p>
                <div class="tags">
                  <span class="tag priority-medium">Medium Priority</span>
                  <span class="tag">New</span>
                </div>
              \`;
              
              // Add drag functionality to new card
              newCard.addEventListener('dragstart', function() {
                draggedCard = this;
                setTimeout(() => {
                  this.style.opacity = '0.5';
                }, 0);
              });
              
              newCard.addEventListener('dragend', function() {
                this.style.opacity = '1';
                draggedCard = null;
              });
              
              // Add to the To Do column
              const todoColumn = document.querySelector('.column:first-child');
              const todoHeading = todoColumn.querySelector('h2');
              todoColumn.insertBefore(newCard, todoHeading.nextSibling);
              
              // Clear input
              taskInput.value = '';
            }
          });
          
          // Allow adding task with Enter key
          taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              addButton.click();
            }
          });
        });
      </script>
    </body>
    </html>
  `;return new s.Z(p,{headers:{"Content-Type":"text/html"}})}catch(e){return console.error("Error generating preview:",e),new s.Z("Error generating preview",{status:500})}}let u=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/preview/[projectId]/route",pathname:"/api/preview/[projectId]",filename:"route",bundlePath:"app/api/preview/[projectId]/route"},resolvedPagePath:"c:\\Users\\Administrator\\ocio\\app\\api\\preview\\[projectId]\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:g,staticGenerationAsyncStorage:m,serverHooks:h,headerHooks:f,staticGenerationBailout:v}=u,y="/api/preview/[projectId]/route";function w(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:m})}},20967:(e,t,r)=>{r.d(t,{Y:()=>n,r:()=>i});let a=(0,r(46874).AY)("https://cfovctpyutyvyqzvypwx.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmb3ZjdHB5dXR5dnlxenZ5cHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTk0MDIsImV4cCI6MjA2MDQ5NTQwMn0.J-c-JGblGgP4zi5ceTORCq8MYbdfcbtP-Ml8a8s4oRM");var o=r(42094);class n{async createProject(e,t){try{let r=await (0,o.lv)(t),{data:n,error:i}=await a.from("projects").insert([{user_id:e,name:r,description:t,prompt:t,status:"pending",tech_stack:{}}]).select().single();if(i)throw i;return this.generateFullProject(n.id,t),n}catch(e){return console.error("Error creating project:",e),null}}async generateFullProject(e,t){try{await a.from("projects").update({status:"generating"}).eq("id",e);let r=await (0,o.bh)(t);await a.from("projects").update({name:r.name,description:r.description,tech_stack:r.techStack,structure:r.structure}).eq("id",e);let n=await (0,o.iq)(t,r),i=await (0,o.d6)(r.name,n);console.log(`Generated ${n.length} files for project ${r.name}`);let s=Date.now(),d=r.name.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""),c=`project-zips/${e}/${s}-${d}.zip`,{error:l}=await a.storage.from("project-files").upload(c,i,{contentType:"application/zip",upsert:!0});if(l)throw l;let{data:p}=a.storage.from("project-files").getPublicUrl(c);await a.from("projects").update({status:"completed",download_url:p.publicUrl,files:n.map(e=>e.path)}).eq("id",e)}catch(t){console.error("Error generating full project:",t),await a.from("projects").update({status:"failed"}).eq("id",e)}}async getUserProjects(){try{let{data:e}=await a.auth.getSession();if(!e.session)throw Error("Authentication required");let t=e.session.user.id,{data:r,error:o}=await a.from("projects").select("*").eq("user_id",t).order("created_at",{ascending:!1});if(o)throw o;return r||[]}catch(e){return console.error("Error fetching projects:",e),[]}}static async getProjectsByUserId(e){try{let{data:t,error:r}=await a.from("projects").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(r)throw r;return t||[]}catch(e){return console.error("Error fetching projects by user ID:",e),[]}}async getProjectById(e){try{let{data:t,error:r}=await a.from("projects").select("*").eq("id",e).single();if(r)throw r;return t}catch(e){return console.error("Error fetching project:",e),null}}async downloadProject(e){try{let t=await this.getProjectById(e);if(!t||!t.download_url)throw Error("Project or download URL not found");return window.open(t.download_url,"_blank"),!0}catch(e){return console.error("Error downloading project:",e),!1}}async deleteProject(e){try{let t=`project-zips/${e}`,{data:r}=await a.storage.from("project-files").list(t);if(r&&r.length>0){let e=r.map(e=>`${t}/${e.name}`);await a.storage.from("project-files").remove(e)}let{error:o}=await a.from("projects").delete().eq("id",e);if(o)throw o;return!0}catch(e){return console.error("Error deleting project:",e),!1}}async regenerateProject(e){try{let t=await this.getProjectById(e);if(!t)throw Error("Project not found");return await a.from("projects").update({status:"generating"}).eq("id",e),this.generateFullProject(e,t.prompt),!0}catch(e){return console.error("Error regenerating project:",e),!1}}async getProjectFiles(e){try{let t=await this.getProjectById(e);if(!t)throw Error("Project not found");if("completed"!==t.status)return[];return(0,o.eU)({name:t.name,description:t.description,techStack:t.tech_stack,files:t.files||[],structure:t.structure||[]})}catch(e){return console.error("Error getting project files:",e),[]}}async incrementUserGenerationCount(e){try{let{error:t}=await a.rpc("increment_generation_count",{user_id:e});if(t)throw t;return!0}catch(e){return console.error("Error incrementing generation count:",e),!1}}}async function i(e){return n.getProjectsByUserId(e)}},81664:(e,t,r)=>{r.d(t,{K:()=>i,e:()=>n});var a=r(46874),o=r(32455);function n(e){return(0,a.lx)(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{cookies:{get:t=>e.get(t)?.value,set(t,r,a){e.set({name:t,value:r,...a})},remove(t,r){e.set({name:t,value:"",...r})}}})}function i(){return n((0,o.cookies)())}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[638,246,455,874,847,94],()=>r(94800));module.exports=a})();