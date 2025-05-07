'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  RefreshCw,
  Loader2,
  Zap,
  XCircle, // For Cancel button
} from 'lucide-react';
import AppPreview from './app-preview';
import GenerationProgress, {
  defaultGenerationSteps,
  GenerationStep // Actual frontend type
} from './generation-progress';
import StatusUpdate, { StatusLog } from './status-update';
import { cn } from '@/lib/utils';

interface BuildInterfaceProps {
  projectId?: string;
}

interface ProjectData { // From create API
  id: string;
  name: string;
  status?: string;
}

// This interface represents the expected structure from the backend's `structure` field
// or a dedicated steps array in the status response.
interface BackendStepInfo {
  id: string; // Must match a defaultGenerationSteps id
  name?: string; // Optional: Backend can override title
  status: 'pending' | 'in-progress' | 'completed' | 'failed'; // Backend might use 'failed'
  progress?: number; // 0-100
  details?: string[];
}

interface ProjectStatusInfo { // From status API
  id: string;
  name: string;
  status: 'pending' | 'generating' | 'completed' | 'failed'; // Overall project status
  prompt: string;
  description?: string | null;
  tech_stack?: any;
  structure?: BackendStepInfo[] | any; // Detailed steps from backend
  files?: string[] | null;
  download_url?: string | null;
  created_at: string;
  updated_at: string;
  current_generation_step?: string; // ID of the current step
  generation_progress_overall?: number;
  generation_log_entries?: StatusLog[]; // Logs specific to the overall process
}


export default function BuildInterface({ projectId: initialProjectId }: BuildInterfaceProps) {
  const router = useRouter();
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>(initialProjectId);

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [projectFailed, setProjectFailed] = useState(false);

  const [overallProgress, setOverallProgress] = useState(0);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>(defaultGenerationSteps);
  const [currentStep, setCurrentStep] = useState('');
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [estimatedEndTime, setEstimatedEndTime] = useState<Date | undefined>(undefined);

  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const [files, setFiles] = useState<any[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const addStatusLog = (level: 'info' | 'success' | 'warning' | 'error' | 'command', message: string, details?: string, logId?: string, timestamp?: Date) => {
    setStatusLogs(prev => {
      const newLog: StatusLog = {
        id: logId || `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        level,
        message,
        timestamp: timestamp || new Date(),
        details
      };
      // Check if a log with the same ID already exists or if a very similar message was logged recently
      if (prev.some(log => log.id === newLog.id ||
        (log.message === newLog.message && Math.abs(new Date(log.timestamp).getTime() - newLog.timestamp.getTime()) < 2000))) {
        return prev;
      }
      return [...prev, newLog].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
  };

  const fetchAndUpdateStatus = async (projectIdToFetch: string) => {
    if (!projectIdToFetch) return;

    try {
      const res = await fetch(`/api/projects/${projectIdToFetch}/status`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch status: ${res.statusText} (${res.status})`);
      }
      const statusData = await res.json() as ProjectStatusInfo;

      setPrompt(statusData.prompt || '');
      setOverallProgress(statusData.generation_progress_overall || 0);
      if(statusData.current_generation_step) setCurrentStep(statusData.current_generation_step);

      if (statusData.structure && Array.isArray(statusData.structure)) {
        const backendSteps = statusData.structure as BackendStepInfo[];
        setGenerationSteps(defaultGenerationSteps.map(uiStep => {
          const backendStep = backendSteps.find(bs => bs.id === uiStep.id);
          if (backendStep) {
            return {
              ...uiStep,
              title: backendStep.name || uiStep.title,
              status: backendStep.status === 'failed' ? 'error' : backendStep.status,
              progress: backendStep.progress,
              details: backendStep.details || uiStep.details || [],
            };
          }
          const currentBackendStepIndex = statusData.current_generation_step ? backendSteps.findIndex(bs => bs.id === statusData.current_generation_step) : -1;
          const uiStepIndex = defaultGenerationSteps.findIndex(ds => ds.id === uiStep.id);

          if (currentBackendStepIndex !== -1 && uiStepIndex < currentBackendStepIndex && uiStep.status !== 'completed') {
             return {...uiStep, status: 'completed', progress: 100};
          }
          return uiStep;
        }));
      } else if (statusData.current_generation_step) {
         setGenerationSteps(prevSteps => prevSteps.map(step => {
            const isCurrent = step.id === statusData.current_generation_step;
            const currentStepIndexInDefault = defaultGenerationSteps.findIndex(s => s.id === statusData.current_generation_step);
            const stepIndexInDefault = defaultGenerationSteps.findIndex(s => s.id === step.id);
            let newStatus = step.status;

            if (isCurrent) {
                newStatus = 'in-progress';
            } else if (currentStepIndexInDefault > -1 && stepIndexInDefault < currentStepIndexInDefault) {
                newStatus = 'completed';
            } else {
                newStatus = 'pending';
            }
            return {...step, status: newStatus, progress: newStatus === 'completed' ? 100 : (isCurrent ? step.progress : undefined) };
         }));
      }

      // Logs are now handled by SSE, but we might still get initial logs here
      // or if SSE fails. So, keep this logic but ensure addStatusLog handles duplicates.
      if (statusData.generation_log_entries && statusData.generation_log_entries.length > 0) {
        statusData.generation_log_entries.forEach(log => {
          addStatusLog(log.level, log.message, log.details, log.id, new Date(log.timestamp));
        });
      }

      if (statusData.files && statusData.files.length > 0) {
        setFiles(statusData.files.map(f => ({ path: f, content: `// Content for ${f} (placeholder)`, type: 'file' })));
      }
      setDownloadUrl(statusData.download_url || null);

      if (statusData.status === 'completed') {
        setIsGenerating(false);
        setGenerationComplete(true);
        setProjectFailed(false);
        setOverallProgress(100);
        addStatusLog('success', `App generation complete for ${statusData.name}!`);
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        if (eventSourceRef.current) eventSourceRef.current.close();
      } else if (statusData.status === 'failed') {
        setIsGenerating(false);
        setGenerationComplete(true);
        setProjectFailed(true);
        addStatusLog('error', `App generation failed for ${statusData.name}. Check logs for details.`);
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        if (eventSourceRef.current) eventSourceRef.current.close();
      } else if (statusData.status === 'generating') {
        setIsGenerating(true);
        setGenerationComplete(false);
        setProjectFailed(false);
      } else if (statusData.status === 'pending') {
        setIsGenerating(false);
        setGenerationComplete(false);
        setProjectFailed(false);
      }

    } catch (error) {
      console.error('Error fetching project status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching status.';
      addStatusLog('error', `Status fetch error: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setCurrentProjectId(initialProjectId);

    if (initialProjectId) {
      setStatusLogs([]); // Clear logs for new/reloaded project
      addStatusLog('info', `Loading project: ${initialProjectId}`);
      setOverallProgress(0);
      setGenerationSteps(defaultGenerationSteps.map(s => ({...s, status: 'pending', progress: undefined, details: [] })));
      setFiles([]);
      setDownloadUrl(null);
      setProjectFailed(false);
      setIsGenerating(true);
      setGenerationComplete(false);
      fetchAndUpdateStatus(initialProjectId); // Initial fetch for overall status
    } else {
      // Reset state if no project ID (e.g., navigating to /build directly)
      setPrompt('');
      setIsGenerating(false);
      setGenerationComplete(false);
      setProjectFailed(false);
      setOverallProgress(0);
      setGenerationSteps(defaultGenerationSteps.map(s => ({...s, status: 'pending', progress: undefined, details: [] })));
      setCurrentStep('');
      setStartTime(undefined);
      setEstimatedEndTime(undefined);
      setStatusLogs([]);
      setFiles([]);
      setDownloadUrl(null);
    }
  }, [initialProjectId]);

  // Effect for managing polling and SSE connection
  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };

    if (currentProjectId && isGenerating && !generationComplete) {
      // Start status polling
      if (!pollingIntervalRef.current) {
        pollingIntervalRef.current = setInterval(() => {
          fetchAndUpdateStatus(currentProjectId);
        }, 5000); // Poll for overall status, steps, files, download URL
      }

      // Start SSE for logs
      if (!eventSourceRef.current) {
        const es = new EventSource(`/api/projects/${currentProjectId}/logstream`);
        eventSourceRef.current = es;

        es.onopen = () => {
          // console.log(`SSE connection opened for project ${currentProjectId}`);
          // addStatusLog('info', 'Log stream connected.'); // Optional: log connection
        };

        es.addEventListener('log', (event) => {
          try {
            const logData = JSON.parse(event.data);
            // Ensure logData has the expected structure (id, level, message, timestamp)
            if (logData && logData.level && logData.message && logData.created_at) {
               addStatusLog(
                logData.level as StatusLog['level'],
                logData.message,
                logData.details,
                logData.id.toString(), // SSE might send id as number
                new Date(logData.created_at)
              );
            } else {
              console.warn('Received malformed log event via SSE:', logData);
            }
          } catch (e) {
            console.error('Error parsing SSE log event data:', e, event.data);
            addStatusLog('error', 'Received unparseable log from stream.');
          }
        });

        es.onerror = (error) => {
          console.error('EventSource failed:', error);
          addStatusLog('error', 'Log stream connection error. May fall back to polling for logs.');
          es.close(); // Important to close on error to prevent multiple retries by browser
          eventSourceRef.current = null; // Allow re-connection attempt if needed
        };
      }
    } else {
      cleanup(); // Stop polling and SSE if not generating or complete
    }

    return cleanup; // Cleanup on component unmount or when dependencies change
  }, [currentProjectId, isGenerating, generationComplete]);

  useEffect(() => {
    const textarea = promptInputRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [prompt]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      await handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationComplete(false);
    setProjectFailed(false);
    setStatusLogs([]);
    setOverallProgress(0);
    setGenerationSteps(defaultGenerationSteps.map(step => ({ ...step, status: 'pending', progress: undefined, details: [] })));
    setCurrentStep(defaultGenerationSteps[0]?.id || 'analysis');
    setStartTime(new Date());
    setEstimatedEndTime(new Date(Date.now() + 10 * 60 * 1000));
    addStatusLog('command', `Initiating app generation for prompt: "${prompt}"`);

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create project.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newProject = await response.json() as ProjectData;
      addStatusLog('success', `Project creation initiated. ID: ${newProject.id}. Name: ${newProject.name}`);
      setCurrentProjectId(newProject.id);
      router.push(`/build?projectId=${newProject.id}`, { scroll: false });
    } catch (error) {
      console.error('Failed to create project:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      addStatusLog('error', `Failed to start generation: ${errorMessage}`);
      setIsGenerating(false);
      setProjectFailed(true);
    }
  };

  const handleDownload = () => {
    if (projectFailed) {
      addStatusLog('error', 'Project generation failed. Download not available.');
      return;
    }
    if (generationComplete && downloadUrl) {
      addStatusLog('info', `Redirecting to download: ${downloadUrl}`);
      window.open(downloadUrl, '_blank');
    } else if (isGenerating) {
      addStatusLog('warning', 'Project is still generating. Please wait.');
    } else {
      addStatusLog('warning', 'Download URL not available or project not complete.');
    }
  };

  const handleRegenerate = async () => {
    if (!currentProjectId) return;
    
    setIsGenerating(true);
    setGenerationComplete(false);
    setProjectFailed(false);
    setStatusLogs([]);
    setOverallProgress(0);
    setGenerationSteps(defaultGenerationSteps.map(step => ({ ...step, status: 'pending', progress: undefined, details: [] })));
    setCurrentStep(defaultGenerationSteps[0]?.id || 'analysis');
    setStartTime(new Date());
    setEstimatedEndTime(new Date(Date.now() + 10 * 60 * 1000));
    addStatusLog('command', `Initiating app regeneration for project ID: ${currentProjectId}`);

    try {
      const response = await fetch(`/api/projects/${currentProjectId}/regenerate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to regenerate project.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      addStatusLog('success', `Regeneration started for project ${currentProjectId}`);
    } catch (error: any) {
      console.error('Regeneration failed:', error);
      addStatusLog('error', `Regeneration failed: ${error.message}`);
      setIsGenerating(false);
      setProjectFailed(true);
    }
  };

  const handleCancel = async () => {
    if (!currentProjectId || !isGenerating) return;
    
    addStatusLog('command', `Cancelling app generation for project ID: ${currentProjectId}`);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    if (eventSourceRef.current) eventSourceRef.current.close();

    try {
      const response = await fetch(`/api/projects/${currentProjectId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to cancel project.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      addStatusLog('warning', `Generation cancelled for project ${currentProjectId}`);
      setIsGenerating(false);
      setProjectFailed(true);
      setGenerationComplete(true);
    } catch (error: any) {
      console.error('Cancel failed:', error);
      addStatusLog('error', `Cancel failed: ${error.message}`);
      setIsGenerating(false);
      setProjectFailed(true);
      setGenerationComplete(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left Column - Input and Status */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {/* Input Area */}
        <div className="border rounded-xl glassmorphism p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-comfortaa font-bold">What would you like to build?</h2>
            {(generationComplete || projectFailed) && (
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/build')}
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
                disabled={isGenerating || generationComplete || projectFailed}
              />
              <div className="absolute bottom-3 right-3 text-xs text-lightGray">
                {prompt.length > 0 && !isGenerating && !generationComplete && !projectFailed && (
                  <span>Press <kbd className="px-1 py-0.5 bg-berkeleyBlue rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-berkeleyBlue rounded">Enter</kbd> to submit</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating || generationComplete || projectFailed}
              className={cn(
                "px-6 py-3 rounded-xl font-comfortaa font-bold transition-all duration-300",
                (!prompt.trim() || isGenerating || generationComplete || projectFailed)
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

        {(isGenerating || generationComplete || projectFailed) && (
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

        {(statusLogs.length > 0) && (
          <div className="border rounded-xl glassmorphism p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-comfortaa font-bold">Generation Logs</h3>
              <div className="flex items-center space-x-2">
                {isGenerating && !generationComplete && (
                  <button
                    onClick={handleCancel}
                    className="button-cancel py-1 px-3 text-sm flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                )}
                {projectFailed && currentProjectId && (
                  <button
                    onClick={handleRegenerate}
                    className="button-secondary py-1 px-3 text-sm flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerate
                  </button>
                )}
                {generationComplete && !projectFailed && downloadUrl && (
                  <button
                    onClick={handleDownload}
                    className="button-primary py-1 px-3 text-sm flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download .zip
                  </button>
                )}
              </div>
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
            ) : currentProjectId && !projectFailed ? (
              <AppPreview
                projectId={currentProjectId}
                files={files}
                isLoading={isGenerating && !generationComplete}
              />
            ) : projectFailed ? (
                 <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <XCircle className="w-12 h-12 text-red-500 opacity-80" />
                  <p className="text-whiteSmoke text-lg">Generation Failed</p>
                  <p className="text-lightGray text-sm max-w-md">
                    Something went wrong during generation. Check the logs or try regenerating.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Zap className="w-12 h-12 text-slateBlue opacity-60" />
                  <p className="text-whiteSmoke text-lg">Enter a Prompt to Get Started</p>
                  <p className="text-lightGray text-sm max-w-md">
                    Describe the app you want to build and OptimusCode will generate it for you.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
