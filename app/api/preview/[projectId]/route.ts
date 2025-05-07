import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { ProjectService } from '@/lib/services/project-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId
    
    // Get session to verify user is authenticated
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session, return 401
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    // Get project data
    const projectService = new ProjectService(supabase)
    const project = await projectService.getProjectById(projectId)
    
    // If project not found or does not belong to user, return 404
    if (!project || project.user_id !== session.user.id) {
      return new NextResponse('Project not found', { status: 404 })
    }
    
    // If project is not complete, return a loading page
    if (project.status !== 'completed') {
      return new NextResponse(`
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
      `, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }
    
    // Get the HTML preview content
    // In a real implementation, this would be retrieved from storage
    // For now, we'll return a basic sample HTML page
    const previewHtml = generatePreviewHtml(project)
    
    return new NextResponse(previewHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error generating preview:', error)
    return new NextResponse('Error generating preview', { status: 500 })
  }
}

// Helper function to generate preview HTML
function generatePreviewHtml(project: any) {
  // This is a simplified mock version
  // In a real implementation, this would be based on the project's actual generated files
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${project.name || 'App Preview'}</title>
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
  `
}
