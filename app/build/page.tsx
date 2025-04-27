'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import DashboardNavbar from '@/components/dashboard/navbar';
import PromptInput from '@/components/dashboard/prompt-input';
import GenerationLog, { getDefaultLogs } from '@/components/dashboard/generation-log';
import CodePreview from '@/components/dashboard/code-preview';
import { useAuth } from '@/contexts/auth-context';
import { ProjectService } from '@/lib/services/project-service';
import { ProjectDetails } from '@/lib/services/ai-service';
import { redirect } from 'next/navigation';
import type { Project } from '@/lib/services/project-service';

export default function BuildPage() {
  const { user, loading } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'generating' | 'completed' | 'failed'>('idle');
  const [project, setProject] = useState<Project | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [logs, setLogs] = useState(getDefaultLogs('idle'));
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const projectService = new ProjectService();

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!loading && !user) {
      redirect('/login');
    }
  }, [loading, user]);

  // Load project from projectId query param if available
  useEffect(() => {
    if (projectId && user) {
      loadExistingProject(projectId);
    }
  }, [projectId, user]);

  const loadExistingProject = async (id: string) => {
    try {
      const existingProject = await projectService.getProjectById(id);
      
      if (existingProject) {
        setProject(existingProject);
        setPrompt(existingProject.prompt);
        
        if (existingProject.status === 'completed') {
          setStatus('completed');
          setLogs(getDefaultLogs('completed'));
          setProjectDetails({
            name: existingProject.name,
            description: existingProject.description,
            techStack: existingProject.tech_stack as any,
            files: [],
            structure: existingProject.structure || []
          });
        } else if (existingProject.status === 'generating' || existingProject.status === 'pending') {
          setStatus('generating');
          setLogs(getDefaultLogs('generating'));
          pollProjectStatus(existingProject.id);
        } else {
          setStatus('failed');
          setLogs(getDefaultLogs('failed'));
        }
      }
    } catch (error) {
      console.error('Error loading existing project:', error);
    }
  };

  // Create a new project when prompt is submitted
  const handleSubmitPrompt = async (promptText: string) => {
    if (!user) return;
    
    setPrompt(promptText);
    setStatus('pending');
    setLogs(getDefaultLogs('pending'));
    
    try {
      const newProject = await projectService.createProject(user.id, promptText);
      
      if (newProject) {
        setProject(newProject);
        setStatus('generating');
        setLogs(getDefaultLogs('generating'));
        
        // Poll for project updates
        pollProjectStatus(newProject.id);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setStatus('failed');
      setLogs(getDefaultLogs('failed'));
    }
  };

  // Poll for project status updates
  const pollProjectStatus = async (projectId: string) => {
    const checkStatus = async () => {
      try {
        const projectData = await projectService.getProjectById(projectId);
        
        if (!projectData) {
          throw new Error('Project not found');
        }
        
        setProject(projectData);
        
        if (projectData.status === 'completed') {
          setStatus('completed');
          setLogs(getDefaultLogs('completed'));
          setProjectDetails({
            name: projectData.name,
            description: projectData.description,
            techStack: projectData.tech_stack as any,
            files: [],
            structure: projectData.structure || []
          });
          return true;
        } else if (projectData.status === 'failed') {
          setStatus('failed');
          setLogs(getDefaultLogs('failed'));
          return true;
        }
      } catch (error) {
        console.error('Error polling project status:', error);
      }
      return false;
    };
    
    // Check initially then every 3 seconds
    const initialCheck = await checkStatus();
    if (!initialCheck) {
      const interval = setInterval(async () => {
        const done = await checkStatus();
        if (done) clearInterval(interval);
      }, 3000);
      
      // Clean up interval on unmount
      return () => clearInterval(interval);
    }
  };

  // Regenerate the project
  const handleRegenerate = async () => {
    if (!project) return;
    
    setStatus('pending');
    setLogs(getDefaultLogs('pending'));
    
    try {
      const success = await projectService.regenerateProject(project.id);
      
      if (!success) {
        throw new Error('Failed to regenerate project');
      }
      
      setStatus('generating');
      setLogs(getDefaultLogs('generating'));
      
      // Poll for updates
      pollProjectStatus(project.id);
    } catch (error) {
      console.error('Error regenerating project:', error);
      setStatus('failed');
      setLogs(getDefaultLogs('failed'));
    }
  };

  // Handle download project
  const handleDownload = async () => {
    if (!project) return;
    
    try {
      await projectService.downloadProject(project.id);
    } catch (error) {
      console.error('Error downloading project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richBlack">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin border-t-2 border-slateBlue rounded-full"></div>
          <p className="text-lightGray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-richBlack">
      <DashboardNavbar />
      
      <Container className="flex-grow flex flex-col py-6 md:py-8">
        <h1 className="mb-4 font-comfortaa text-2xl font-bold text-whiteSmoke md:text-3xl">
          Build Your App
        </h1>
        
        <PromptInput 
          onSubmit={handleSubmitPrompt}
          loading={status === 'pending' || status === 'generating'}
          initialPrompt={prompt}
        />
        
        <div className="mt-6 grid flex-grow grid-cols-1 gap-6 lg:grid-cols-2">
          <GenerationLog 
            prompt={prompt}
            status={status}
            projectName={project?.name}
            logs={logs}
          />
          
          <CodePreview 
            status={status}
            projectDetails={projectDetails || undefined}
            downloadUrl={project?.download_url}
            onRegenerate={handleRegenerate}
            onDownload={handleDownload}
          />
        </div>
      </Container>
    </main>
  );
}
