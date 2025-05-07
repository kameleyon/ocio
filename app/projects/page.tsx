'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  Download, 
  FileCode, 
  RefreshCw, 
  Search, 
  Trash2, 
  AlertCircle,
  SortAsc,
  SortDesc,
  Code,
  Tag
} from 'lucide-react';

import { supabase } from '@/lib/supabase/client';
import { ProjectService } from '@/lib/services/project-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import DashboardNavbar from '@/components/dashboard/navbar';
import { useAuth } from '@/contexts/auth-context';

type Project = {
  id: string;
  name: string;
  created_at: string;
  status: string;
  tech_stack: any;
  description: string;
};

type SortField = 'name' | 'created_at' | 'status';
type SortOrder = 'asc' | 'desc';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const projectService = new ProjectService(supabase); // Use the imported client-side supabase

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/login');
        return;
      }
      
      fetchProjects();
    };

    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchProjects();
      }
    }
  }, [authLoading, user, router]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projects = await projectService.getUserProjects();
      setProjects(projects);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (projectId: string) => {
    try {
      await projectService.downloadProject(projectId);
    } catch (err) {
      console.error('Error downloading project:', err);
    }
  };

  const handleRegenerate = async (projectId: string) => {
    try {
      await projectService.regenerateProject(projectId);
      router.push(`/build?projectId=${projectId}`);
    } catch (err) {
      console.error('Error regenerating project:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      setIsDeleting(true);
      const success = await projectService.deleteProject(projectToDelete);
      
      if (success) {
        // Remove from local state
        setProjects(projects.filter(p => p.id !== projectToDelete));
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again later.');
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending for dates, ascending for others
      setSortField(field);
      setSortOrder(field === 'created_at' ? 'desc' : 'asc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'status') {
        return sortOrder === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else {
        // Default: created_at
        return sortOrder === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  // Extract unique tech stacks for filtering
  const techStacks = Array.from(new Set(
    projects
      .filter(p => p.tech_stack && p.tech_stack.frontend)
      .map(p => p.tech_stack.frontend)
  ));

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richBlack">
        <div className="text-center">
          <div className="mb-4 animate-spin">
            <RefreshCw className="h-8 w-8 text-robinEggBlue" />
          </div>
          <p className="text-lightGray">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <Container className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 animate-spin">
              <RefreshCw className="h-8 w-8 text-slateBlue" />
            </div>
            <p className="text-lg text-lightGray">Loading your projects...</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-richBlack">
      <DashboardNavbar />
      
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-comfortaa text-3xl font-bold text-whiteSmoke">Your Projects</h1>
          <p className="text-lightGray">
            View, download, and regenerate your previously created applications.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Search and filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lightGray" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10 bg-berkeleyBlue border-slateBlue/30 text-whiteSmoke"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-slateBlue/30 text-lightGray hover:text-whiteSmoke flex items-center gap-1.5"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  Sort by: {sortField === 'created_at' ? 'Date' : sortField === 'name' ? 'Name' : 'Status'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-berkeleyBlue border-slateBlue/30">
                <DropdownMenuItem onClick={() => handleSort('name')} className="text-lightGray hover:text-whiteSmoke">
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('created_at')} className="text-lightGray hover:text-whiteSmoke">
                  Date Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('status')} className="text-lightGray hover:text-whiteSmoke">
                  Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {techStacks.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-slateBlue/30 text-lightGray hover:text-whiteSmoke flex items-center gap-1.5"
                  >
                    <Tag className="h-4 w-4" />
                    Tech Stack
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-berkeleyBlue border-slateBlue/30">
                  <DropdownMenuItem 
                    onClick={() => setSearchTerm('')}
                    className="text-lightGray hover:text-whiteSmoke"
                  >
                    All
                  </DropdownMenuItem>
                  {techStacks.map((tech) => (
                    <DropdownMenuItem 
                      key={tech}
                      onClick={() => setSearchTerm(tech)}
                      className="text-lightGray hover:text-whiteSmoke"
                    >
                      {tech}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button 
              variant="default" 
              className="bg-slateBlue hover:bg-slateBlue/90 text-whiteSmoke"
              onClick={() => router.push('/build')}
            >
              <Code className="h-4 w-4 mr-1.5" />
              New Project
            </Button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-slateBlue/20 bg-berkeleyBlue p-8 text-center">
            <FileCode className="mx-auto mb-4 h-12 w-12 text-lightGray" />
            <h2 className="mb-2 font-comfortaa text-xl font-semibold text-whiteSmoke">
              {searchTerm ? 'No projects match your search' : 'No projects yet'}
            </h2>
            <p className="mb-6 text-lightGray">
              {searchTerm 
                ? 'Try adjusting your search terms or clear the search to see all projects.'
                : 'You haven\'t created any projects yet. Head over to the build page to get started.'}
            </p>
            {searchTerm ? (
              <Button 
                variant="outline"
                className="border-slateBlue/30 text-lightGray hover:text-whiteSmoke"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/build')}
                className="bg-slateBlue hover:bg-slateBlue/90 text-whiteSmoke"
              >
                Create Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="flex flex-col overflow-hidden bg-berkeleyBlue border-slateBlue/20 hover:border-slateBlue/40 transition-all hover:shadow-md"
              >
                <div className="flex-1 p-6">
                  <h3 className="mb-2 font-comfortaa text-xl font-semibold text-whiteSmoke">{project.name}</h3>
                  <div className="mb-3 flex items-center text-sm text-lightGray">
                    <Clock className="mr-1.5 h-4 w-4" />
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        project.status === 'completed'
                          ? 'bg-green-500/10 text-green-400'
                          : project.status === 'failed'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-lightGray line-clamp-2 mb-3">{project.description}</p>
                  
                  {project.tech_stack && project.tech_stack.frontend && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="inline-flex items-center rounded-full bg-slateBlue/20 px-2 py-0.5 text-xs text-robinEggBlue">
                        {project.tech_stack.frontend}
                      </span>
                      {project.tech_stack.backend && (
                        <span className="inline-flex items-center rounded-full bg-slateBlue/20 px-2 py-0.5 text-xs text-robinEggBlue">
                          {project.tech_stack.backend}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex border-t border-slateBlue/20">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-none py-4 text-lightGray hover:text-whiteSmoke hover:bg-slateBlue/10"
                    onClick={() => handleDownload(project.id)}
                    disabled={project.status !== 'completed'}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <div className="w-px bg-slateBlue/20"></div>
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-none py-4 text-lightGray hover:text-whiteSmoke hover:bg-slateBlue/10"
                    onClick={() => handleRegenerate(project.id)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  <div className="w-px bg-slateBlue/20"></div>
                  <Button
                    variant="ghost"
                    className="aspect-square rounded-none py-4 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => setProjectToDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent className="bg-berkeleyBlue border-slateBlue/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-whiteSmoke">Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-lightGray">
              Are you sure you want to delete this project? This action cannot be undone
              and all associated files will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-transparent border-slateBlue/30 text-lightGray hover:text-whiteSmoke hover:bg-slateBlue/20"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
