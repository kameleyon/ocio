'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Download, 
  RefreshCw, 
  Clock, 
  Loader2, 
  Zap
} from 'lucide-react'
import AppPreview from './app-preview'
import GenerationProgress, { 
  defaultGenerationSteps, 
  GenerationStep 
} from './generation-progress'
import StatusUpdate, { StatusLog } from './status-update'
import { cn } from '@/lib/utils'

interface BuildInterfaceProps {
  projectId?: string
}

export default function BuildInterface({ projectId }: BuildInterfaceProps) {
  // User input and generation state
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>(defaultGenerationSteps)
  const [currentStep, setCurrentStep] = useState('')
  const [startTime, setStartTime] = useState<Date | undefined>(undefined)
  const [estimatedEndTime, setEstimatedEndTime] = useState<Date | undefined>(undefined)
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([])
  const promptInputRef = useRef<HTMLTextAreaElement>(null)
  
  // Simulated files for the preview (will be replaced with actual generated files)
  const [files, setFiles] = useState<any[]>([])
  
  // Adjust text area height based on content
  useEffect(() => {
    const textarea = promptInputRef.current
    if (!textarea) return
    
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [prompt])
  
  // Handle textarea input change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Command+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  // Submit prompt and start generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim() || isGenerating) return
    
    // Start generation
    setIsGenerating(true)
    setGenerationComplete(false)
    setOverallProgress(0)
    setCurrentStep('analysis')
    setGenerationSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        status: step.id === 'analysis' ? 'in-progress' : 'pending',
        progress: step.id === 'analysis' ? 0 : undefined,
        details: []
      }))
    )
    
    // Set start time and estimate end time (about 5 minutes from now)
    const start = new Date()
    setStartTime(start)
    setEstimatedEndTime(new Date(start.getTime() + 5 * 60 * 1000))
    
    // Add initial log
    addStatusLog('command', `Generating app from prompt: "${prompt}"`)
    
    // Simulate API call to backend
    simulateGeneration()
  }
  
  // Helper to add a log entry
  const addStatusLog = (level: 'info' | 'success' | 'warning' | 'error' | 'command', message: string, details?: string) => {
    setStatusLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        level,
        message,
        timestamp: new Date(),
        details
      }
    ])
  }
  
  // Simulate generation process (will be replaced with actual API calls)
  const simulateGeneration = () => {
    // Define the steps and their duration in ms (for simulation)
    const simulationSteps = [
      { id: 'analysis', duration: 5000 },
      { id: 'planning', duration: 8000 },
      { id: 'frontend', duration: 12000 },
      { id: 'backend', duration: 10000 },
      { id: 'database', duration: 6000 },
      { id: 'packaging', duration: 4000 },
      { id: 'testing', duration: 5000 }
    ]
    
    let totalDuration = simulationSteps.reduce((acc, step) => acc + step.duration, 0)
    let elapsedTime = 0
    
    // Details for each step (to add during simulation)
    const stepDetails = {
      'analysis': [
        'Detected type: Task Management Application',
        'Features identified: User Authentication, Kanban Board, Drag & Drop',
        'Complexity: Medium',
        'Estimated components: 15-20'
      ],
      'planning': [
        'Designed application architecture',
        'Mapped component hierarchy',
        'Established database schema',
        'Defined API endpoints',
        'Created build configuration'
      ],
      'frontend': [
        'Generated React components',
        'Implemented auth pages',
        'Created Kanban board UI',
        'Added drag & drop functionality',
        'Styled with Tailwind CSS',
        'Set up state management'
      ],
      'backend': [
        'Created Express server',
        'Implemented authentication routes',
        'Added task management endpoints',
        'Set up middleware',
        'Implemented input validation'
      ],
      'database': [
        'Generated database models',
        'Added migrations',
        'Created seed data',
        'Set up foreign key relationships'
      ],
      'packaging': [
        'Bundling assets',
        'Generating documentation',
        'Creating deployment scripts',
        'Preparing download package'
      ],
      'testing': [
        'Running smoke tests',
        'Validating functionality',
        'Checking for errors',
        'Finalized build'
      ]
    }
    
    // Process details
    const processDetails = (step: string, isStart: boolean = true) => {
      if (isStart) {
        addStatusLog('info', `Starting ${step} phase`)
      }
      
      // Add some of the details as the step progresses
      if (stepDetails[step as keyof typeof stepDetails]) {
        const details = stepDetails[step as keyof typeof stepDetails]
        
        if (details && details.length > 0) {
          const detailsToAdd = Math.min(details.length, 2)
          
          // Update generation steps with details
          setGenerationSteps(prev => 
            prev.map(s => 
              s.id === step 
                ? {
                    ...s,
                    details: [
                      ...(s.details || []),
                      ...details.slice(0, detailsToAdd)
                    ]
                  }
                : s
            )
          )
          
          // Add logs for details
          details.slice(0, detailsToAdd).forEach(detail => {
            addStatusLog('info', detail)
          })
          
          // Remove used details
          stepDetails[step as keyof typeof stepDetails] = details.slice(detailsToAdd)
        }
      }
    }
    
    // Function to process each step
    const processStep = (index: number) => {
      if (index >= simulationSteps.length) {
        // All steps complete
        setIsGenerating(false)
        setGenerationComplete(true)
        setOverallProgress(100)
        addStatusLog('success', 'App generation complete! Ready for download.')
        
        // Simulate generated files for preview
        setFiles([
          {
            path: 'README.md',
            content: '# Task Management App\n\nA Kanban-style task management application with drag & drop functionality and user authentication.\n\n## Features\n\n- User authentication\n- Kanban board with drag & drop\n- Task categories\n- Task assignment\n- Due dates\n- Task filtering\n',
            type: 'file'
          },
          {
            path: 'package.json',
            content: '{\n  "name": "task-management-app",\n  "version": "1.0.0",\n  "description": "A Kanban-style task management application",\n  "main": "index.js",\n  "scripts": {\n    "start": "node server/index.js",\n    "dev": "nodemon server/index.js",\n    "client": "cd client && npm start",\n    "build": "cd client && npm run build"\n  },\n  "dependencies": {\n    "express": "^4.17.1",\n    "mongoose": "^6.0.12",\n    "jsonwebtoken": "^8.5.1",\n    "bcryptjs": "^2.4.3",\n    "cors": "^2.8.5"\n  }\n}',
            type: 'file'
          },
          {
            path: 'client/src/App.js',
            content: 'import React from "react";\nimport { BrowserRouter, Routes, Route } from "react-router-dom";\nimport { AuthProvider } from "./contexts/AuthContext";\nimport Login from "./pages/Login";\nimport Register from "./pages/Register";\nimport Dashboard from "./pages/Dashboard";\nimport KanbanBoard from "./pages/KanbanBoard";\nimport PrivateRoute from "./components/PrivateRoute";\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <AuthProvider>\n        <Routes>\n          <Route path="/login" element={<Login />} />\n          <Route path="/register" element={<Register />} />\n          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />\n          <Route path="/board" element={<PrivateRoute><KanbanBoard /></PrivateRoute>} />\n        </Routes>\n      </AuthProvider>\n    </BrowserRouter>\n  );\n}\n\nexport default App;',
            type: 'file'
          },
          {
            path: 'client/src/pages/KanbanBoard.js',
            content: 'import React, { useState, useEffect } from "react";\nimport { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";\nimport TaskCard from "../components/TaskCard";\nimport AddTaskForm from "../components/AddTaskForm";\nimport { useAuth } from "../contexts/AuthContext";\nimport axios from "axios";\n\nconst KanbanBoard = () => {\n  const [columns, setColumns] = useState({\n    "todo": { id: "todo", title: "To Do", tasks: [] },\n    "inProgress": { id: "inProgress", title: "In Progress", tasks: [] },\n    "review": { id: "review", title: "Review", tasks: [] },\n    "done": { id: "done", title: "Done", tasks: [] }\n  });\n  const { currentUser } = useAuth();\n\n  useEffect(() => {\n    // Fetch tasks from API\n    const fetchTasks = async () => {\n      try {\n        const res = await axios.get("/api/tasks", {\n          headers: { Authorization: `Bearer ${currentUser.token}` }\n        });\n        \n        // Group tasks by status\n        const newColumns = { ...columns };\n        res.data.forEach(task => {\n          if (newColumns[task.status]) {\n            newColumns[task.status].tasks.push(task);\n          }\n        });\n        \n        setColumns(newColumns);\n      } catch (err) {\n        console.error("Error fetching tasks:", err);\n      }\n    };\n    \n    fetchTasks();\n  }, [currentUser]);\n\n  const handleDragEnd = async (result) => {\n    const { source, destination, draggableId } = result;\n    \n    // Dropped outside a droppable area\n    if (!destination) return;\n    \n    // Dropped in the same place\n    if (\n      destination.droppableId === source.droppableId &&\n      destination.index === source.index\n    ) return;\n    \n    // Moving within the same column\n    if (source.droppableId === destination.droppableId) {\n      const column = columns[source.droppableId];\n      const newTasks = Array.from(column.tasks);\n      const [movedTask] = newTasks.splice(source.index, 1);\n      newTasks.splice(destination.index, 0, movedTask);\n      \n      setColumns({\n        ...columns,\n        [source.droppableId]: {\n          ...column,\n          tasks: newTasks\n        }\n      });\n    } \n    // Moving to a different column\n    else {\n      const sourceColumn = columns[source.droppableId];\n      const destColumn = columns[destination.droppableId];\n      const sourceTasks = Array.from(sourceColumn.tasks);\n      const destTasks = Array.from(destColumn.tasks);\n      const [movedTask] = sourceTasks.splice(source.index, 1);\n      \n      // Update task status\n      movedTask.status = destination.droppableId;\n      destTasks.splice(destination.index, 0, movedTask);\n      \n      setColumns({\n        ...columns,\n        [source.droppableId]: {\n          ...sourceColumn,\n          tasks: sourceTasks\n        },\n        [destination.droppableId]: {\n          ...destColumn,\n          tasks: destTasks\n        }\n      });\n      \n      // Update task in database\n      try {\n        await axios.patch(`/api/tasks/${draggableId}`, {\n          status: destination.droppableId\n        }, {\n          headers: { Authorization: `Bearer ${currentUser.token}` }\n        });\n      } catch (err) {\n        console.error("Error updating task:", err);\n      }\n    }\n  };\n\n  return (\n    <div className="p-6">\n      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>\n      <AddTaskForm />\n      \n      <DragDropContext onDragEnd={handleDragEnd}>\n        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">\n          {Object.values(columns).map(column => (\n            <div key={column.id} className="bg-gray-100 rounded-lg p-4">\n              <h2 className="font-semibold mb-3">{column.title}</h2>\n              <Droppable droppableId={column.id}>\n                {(provided) => (\n                  <div\n                    ref={provided.innerRef}\n                    {...provided.droppableProps}\n                    className="min-h-[200px]"\n                  >\n                    {column.tasks.map((task, index) => (\n                      <Draggable key={task._id} draggableId={task._id} index={index}>\n                        {(provided) => (\n                          <div\n                            ref={provided.innerRef}\n                            {...provided.draggableProps}\n                            {...provided.dragHandleProps}\n                          >\n                            <TaskCard task={task} />\n                          </div>\n                        )}\n                      </Draggable>\n                    ))}\n                    {provided.placeholder}\n                  </div>\n                )}\n              </Droppable>\n            </div>\n          ))}\n        </div>\n      </DragDropContext>\n    </div>\n  );\n};\n\nexport default KanbanBoard;',
            type: 'file'
          },
          {
            path: 'server/index.js',
            content: 'const express = require("express");\nconst mongoose = require("mongoose");\nconst cors = require("cors");\nconst path = require("path");\nconst authRoutes = require("./routes/auth");\nconst taskRoutes = require("./routes/tasks");\nconst { authenticateToken } = require("./middleware/auth");\n\nrequire("dotenv").config();\n\nconst app = express();\nconst PORT = process.env.PORT || 5000;\n\n// Middleware\napp.use(cors());\napp.use(express.json());\n\n// Connect to MongoDB\nmongoose.connect(process.env.MONGODB_URI, {\n  useNewUrlParser: true,\n  useUnifiedTopology: true,\n})\n  .then(() => console.log("MongoDB connected"))\n  .catch(err => console.error("MongoDB connection error:", err));\n\n// Routes\napp.use("/api/auth", authRoutes);\napp.use("/api/tasks", authenticateToken, taskRoutes);\n\n// Serve static assets in production\nif (process.env.NODE_ENV === "production") {\n  app.use(express.static(path.join(__dirname, "../client/build")));\n  \n  app.get("*", (req, res) => {\n    res.sendFile(path.join(__dirname, "../client/build/index.html"));\n  });\n}\n\napp.listen(PORT, () => {\n  console.log(`Server running on port ${PORT}`);\n});\n',
            type: 'file'
          },
          {
            path: 'server/models/Task.js',
            content: 'const mongoose = require("mongoose");\n\nconst TaskSchema = new mongoose.Schema({\n  title: {\n    type: String,\n    required: true,\n    trim: true\n  },\n  description: {\n    type: String,\n    trim: true\n  },\n  status: {\n    type: String,\n    enum: ["todo", "inProgress", "review", "done"],\n    default: "todo"\n  },\n  priority: {\n    type: String,\n    enum: ["low", "medium", "high"],\n    default: "medium"\n  },\n  dueDate: {\n    type: Date\n  },\n  assignedTo: {\n    type: mongoose.Schema.Types.ObjectId,\n    ref: "User"\n  },\n  createdBy: {\n    type: mongoose.Schema.Types.ObjectId,\n    ref: "User",\n    required: true\n  },\n  createdAt: {\n    type: Date,\n    default: Date.now\n  },\n  updatedAt: {\n    type: Date,\n    default: Date.now\n  }\n});\n\nmodule.exports = mongoose.model("Task", TaskSchema);',
            type: 'file'
          },
          {
            path: 'server/models/User.js',
            content: 'const mongoose = require("mongoose");\nconst bcrypt = require("bcryptjs");\n\nconst UserSchema = new mongoose.Schema({\n  name: {\n    type: String,\n    required: true,\n    trim: true\n  },\n  email: {\n    type: String,\n    required: true,\n    unique: true,\n    trim: true,\n    lowercase: true\n  },\n  password: {\n    type: String,\n    required: true,\n    minlength: 6\n  },\n  role: {\n    type: String,\n    enum: ["user", "admin"],\n    default: "user"\n  },\n  createdAt: {\n    type: Date,\n    default: Date.now\n  }\n});\n\n// Hash password before saving\nUserSchema.pre("save", async function(next) {\n  if (!this.isModified("password")) return next();\n  \n  try {\n    const salt = await bcrypt.genSalt(10);\n    this.password = await bcrypt.hash(this.password, salt);\n    next();\n  } catch (err) {\n    next(err);\n  }\n});\n\n// Method to compare passwords\nUserSchema.methods.comparePassword = async function(candidatePassword) {\n  return bcrypt.compare(candidatePassword, this.password);\n};\n\nmodule.exports = mongoose.model("User", UserSchema);',
            type: 'file'
          },
        ])
        
        return
      }
      
      // Current step
      const step = simulationSteps[index]
      
      // Mark current step as in progress, previous steps as completed
      setGenerationSteps(prev => 
        prev.map(s => ({
          ...s,
          status: 
            s.id === step.id ? 'in-progress' : 
            index > 0 && simulationSteps.findIndex(sim => sim.id === s.id) < index ? 'completed' :
            'pending',
          progress: s.id === step.id ? 0 : undefined
        }))
      )
      
      setCurrentStep(step.id)
      
      // Process details at start
      processDetails(step.id)
      
      // Simulate progress
      const intervalTime = 100 // Update every 100ms
      const stepProgress = intervalTime / step.duration * 100
      const overallStepProgress = step.duration / totalDuration * 100
      
      let currentProgress = 0
      
      const progressInterval = setInterval(() => {
        currentProgress += stepProgress
        
        // Update the step progress
        setGenerationSteps(prev => 
          prev.map(s => 
            s.id === step.id 
              ? {
                  ...s,
                  progress: Math.min(Math.round(currentProgress), 100)
                }
              : s
          )
        )
        
        // Add some more details as the step progresses
        if (currentProgress >= 50 && stepDetails[step.id as keyof typeof stepDetails]?.length > 0) {
          processDetails(step.id, false)
        }
        
        // Update overall progress
        const overallProgressIncrement = stepProgress / 100 * overallStepProgress
        elapsedTime += intervalTime
        
        setOverallProgress(prev => {
          const base = (index / simulationSteps.length) * 100
          const current = (currentProgress / 100) * (overallStepProgress)
          return Math.min(Math.round(base + current), 100)
        })
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval)
          
          // Add completion log
          addStatusLog('success', `Completed ${step.id} phase`)
          
          // Move to next step
          setTimeout(() => {
            processStep(index + 1)
          }, 100) // Small delay between steps for visual feedback
        }
      }, intervalTime)
    }
    
    // Start the first step
    processStep(0)
  }
  
  // Handle download button click
  const handleDownload = () => {
    addStatusLog('info', 'Preparing download...')
    
    // Simulate download preparation
    setTimeout(() => {
      addStatusLog('success', 'Download ready!')
      
      // Create a fake download link (in a real app, this would point to the actual zip file)
      const a = document.createElement('a')
      a.href = '#'
      a.download = 'task-management-app.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }, 1500)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left Column - Input and Status */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {/* Input Area */}
        <div className="border rounded-xl glassmorphism p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-comfortaa font-bold">What would you like to build?</h2>
            
            {generationComplete && (
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg border border-slateBlue text-slateBlue hover:bg-slateBlue hover:bg-opacity-10 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                ref={promptInputRef}
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe the app you want to build. For example: Build me a task management tool with login and drag-and-drop Kanban."
                className="w-full h-24 min-h-[6rem] p-4 bg-richBlack bg-opacity-40 rounded-lg text-whiteSmoke placeholder-lightGray placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-slateBlue resize-none"
                disabled={isGenerating || generationComplete}
              />
              <div className="absolute bottom-3 right-3 text-xs text-lightGray">
                {prompt.length > 0 && (
                  <span>Press <kbd className="px-1 py-0.5 bg-berkeleyBlue rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-berkeleyBlue rounded">Enter</kbd> to submit</span>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating || generationComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-comfortaa font-bold transition-all duration-300",
                (!prompt.trim() || isGenerating || generationComplete)
                  ? "bg-berkeleyBlue text-lightGray cursor-not-allowed"
                  : "button-primary hover:shadow-glow"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Generate App</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
        
        {/* Generation Progress */}
        {(isGenerating || generationComplete) && (
          <div className="border rounded-xl glassmorphism p-6">
            <GenerationProgress
              steps={generationSteps}
              currentStep={currentStep}
              overallProgress={overallProgress}
              startTime={startTime}
              estimatedEndTime={estimatedEndTime}
            />
          </div>
        )}
        
        {/* Status Logs */}
        {(statusLogs.length > 0) && (
          <div className="border rounded-xl glassmorphism p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-comfortaa font-bold">Generation Logs</h3>
              {generationComplete && (
                <button
                  onClick={handleDownload}
                  className="button-primary py-1 px-4 text-sm"
                >
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>Download .zip</span>
                  </div>
                </button>
              )}
            </div>
            <StatusUpdate logs={statusLogs} maxHeight="300px" />
          </div>
        )}
      </div>
      
      {/* Right Column - App Preview */}
      <div className="w-full lg:w-1/2">
        <div className="border rounded-xl glassmorphism p-6 h-full">
          <h3 className="text-lg font-comfortaa font-bold mb-4">App Preview</h3>
          
          <div className="h-[calc(100%-2rem)]">
            {isGenerating && !generationComplete ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-slateBlue rounded-full border-t-transparent animate-spin"></div>
                    <div className="w-12 h-12 border-4 border-robinEggBlue rounded-full border-b-transparent animate-spin absolute top-2 left-2"></div>
                  </div>
                  <p className="text-whiteSmoke text-lg">Preparing App Preview...</p>
                  <p className="text-lightGray text-sm max-w-md">
                    Your app is being generated. The preview will be available when generation is complete.
                  </p>
                </div>
              </div>
            ) : !isGenerating && !generationComplete ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Zap className="w-12 h-12 text-slateBlue opacity-60" />
                  <p className="text-whiteSmoke text-lg">Enter a Prompt to Get Started</p>
                  <p className="text-lightGray text-sm max-w-md">
                    Describe the app you want to build and OptimusCode will generate it for you.
                  </p>
                </div>
              </div>
            ) : (
              <AppPreview
                projectId="example-project"
                files={files}
                isLoading={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
