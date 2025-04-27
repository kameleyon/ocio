import { supabase } from '@/lib/supabase/client';
import { 
  generateProjectDetails, 
  generateProjectName, 
  generateFileContents,
  generateZipFile,
  ProjectDetails,
  FileContent
} from './ai-service';
import { Database } from '@/lib/supabase/types';

export type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectOutput {
  details: ProjectDetails;
  files: FileContent[];
  zipBlob?: Blob;
}

export class ProjectService {
  async createProject(userId: string, prompt: string): Promise<Project | null> {
    try {
      // First, generate a project name
      const projectName = await generateProjectName(prompt);
      
      // Create an initial project entry
      const { data: project, error: createError } = await supabase
        .from('projects')
        .insert([
          {
            user_id: userId,
            name: projectName,
            description: prompt,
            prompt: prompt,
            status: 'pending',
            tech_stack: {},
          }
        ])
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Start the generation process in the background
      this.generateFullProject(project.id, prompt);
      
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  async generateFullProject(projectId: string, prompt: string): Promise<void> {
    try {
      // Update status to generating
      await supabase
        .from('projects')
        .update({ status: 'generating' })
        .eq('id', projectId);
      
      // Generate project details
      const projectDetails = await generateProjectDetails(prompt);
      
      // Update project with initial details
      await supabase
        .from('projects')
        .update({
          name: projectDetails.name,
          description: projectDetails.description,
          tech_stack: projectDetails.techStack,
        })
        .eq('id', projectId);
      
      // Generate file contents
      const fileContents = await generateFileContents(prompt, projectDetails);
      
      // Generate zip file
      const zipBlob = await generateZipFile(projectDetails.name, fileContents);
      
      // Store the file in Supabase Storage
      const timestamp = Date.now();
      const filePath = `project-zips/${projectId}/${timestamp}-${projectDetails.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, zipBlob, {
          contentType: 'application/zip',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Generate the public URL for the file
      const { data: publicUrl } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);
      
      // Update project with completed status and download URL
      await supabase
        .from('projects')
        .update({
          status: 'completed',
          download_url: publicUrl.publicUrl,
        })
        .eq('id', projectId);
      
    } catch (error) {
      console.error('Error generating full project:', error);
      
      // Update status to failed
      await supabase
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectId);
    }
  }

  async getUserProjects(): Promise<Project[]> {
    try {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        throw new Error('Authentication required');
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  async downloadProject(projectId: string): Promise<boolean> {
    try {
      const project = await this.getProjectById(projectId);
      
      if (!project || !project.download_url) {
        throw new Error('Project or download URL not found');
      }
      
      // Open the download URL in a new tab/window
      window.open(project.download_url, '_blank');
      
      return true;
    } catch (error) {
      console.error('Error downloading project:', error);
      return false;
    }
  }

  async deleteProject(projectId: string): Promise<boolean> {
    try {
      // Delete the project from database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  async regenerateProject(projectId: string): Promise<boolean> {
    try {
      // Get the existing project
      const project = await this.getProjectById(projectId);
      if (!project) throw new Error('Project not found');
      
      // Update status to generating
      await supabase
        .from('projects')
        .update({ status: 'generating' })
        .eq('id', projectId);
      
      // Restart the generation process
      this.generateFullProject(projectId, project.prompt);
      
      return true;
    } catch (error) {
      console.error('Error regenerating project:', error);
      return false;
    }
  }
}
