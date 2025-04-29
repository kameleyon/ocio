import { supabase } from '@/lib/supabase/client';
import { 
  generateProjectDetails, 
  generateProjectName, 
  generateFileContents,
  generateZipFile,
  saveZipFile,
  generatePreviewFiles,
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
      
      // 1. Generate project details
      const projectDetails = await generateProjectDetails(prompt);
      
      // Update project with initial details
      await supabase
        .from('projects')
        .update({
          name: projectDetails.name,
          description: projectDetails.description,
          tech_stack: projectDetails.techStack,
          structure: projectDetails.structure,
        })
        .eq('id', projectId);
      
      // 2. Generate file contents
      const fileContents = await generateFileContents(prompt, projectDetails);
      
      // 3. Generate zip file
      const zipBlob = await generateZipFile(projectDetails.name, fileContents);
      
      // Log progress
      console.log(`Generated ${fileContents.length} files for project ${projectDetails.name}`);
      
      // 4. Store the file in Supabase Storage
      const timestamp = Date.now();
      const normalizedName = projectDetails.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const filePath = `project-zips/${projectId}/${timestamp}-${normalizedName}.zip`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, zipBlob, {
          contentType: 'application/zip',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // 5. Generate the public URL for the file
      const { data: publicUrl } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);
      
      // 6. Update project with completed status and download URL
      await supabase
        .from('projects')
        .update({
          status: 'completed',
          download_url: publicUrl.publicUrl,
          files: fileContents.map(f => f.path),
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
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
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

  static async getProjectsByUserId(userId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching projects by user ID:', error);
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
      // Delete files from storage first
      const folderPath = `project-zips/${projectId}`;
      
      // List all files in the project folder
      const { data: files } = await supabase.storage
        .from('project-files')
        .list(folderPath);
      
      if (files && files.length > 0) {
        // Delete each file
        const filePaths = files.map(file => `${folderPath}/${file.name}`);
        await supabase.storage
          .from('project-files')
          .remove(filePaths);
      }
      
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

  async getProjectFiles(projectId: string): Promise<FileContent[]> {
    try {
      const project = await this.getProjectById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      if (project.status !== 'completed') {
        // Return empty array if project generation is not completed
        return [];
      }
      
      // If we had actual file storage, we would fetch the files here
      // For now, generate preview files based on project details
      return generatePreviewFiles({
        name: project.name,
        description: project.description,
        techStack: project.tech_stack as any,
        files: project.files as any || [],
        structure: project.structure as any || []
      });
      
    } catch (error) {
      console.error('Error getting project files:', error);
      return [];
    }
  }

  async incrementUserGenerationCount(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_generation_count', {
        user_id: userId
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error incrementing generation count:', error);
      return false;
    }
  }
}

export async function getProjectsByUserId(userId: string): Promise<Project[]> {
  return ProjectService.getProjectsByUserId(userId);
}
