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
import { SupabaseClient } from '@supabase/supabase-js';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectLog = Database['public']['Tables']['project_logs']['Insert']; // Assuming you'll generate types

interface ProjectOutput {
  details: ProjectDetails;
  files: FileContent[];
  zipBlob?: Blob;
}

export class ProjectService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async createProject(userId: string, prompt: string): Promise<Project | null> {
    try {
      // First, generate a project name
      const projectName = await generateProjectName(prompt);
      
      // Create an initial project entry
      const { data: project, error: createError } = await this.supabase
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

  private async _addLog(projectId: string, level: ProjectLog['level'], message: string, details?: any) {
    try {
      const { error } = await this.supabase
        .from('project_logs')
        .insert([{ project_id: projectId, level, message, details }]);
      if (error) {
        console.error(`Failed to add project log for ${projectId}: ${message}`, error);
      }
    } catch (e) {
      console.error(`Exception while adding project log for ${projectId}: ${message}`, e);
    }
  }

  async generateFullProject(projectId: string, prompt: string): Promise<void> {
    try {
      await this._addLog(projectId, 'command', `Generation process started for project ID: ${projectId}`, { prompt });
      // Update status to generating
      await this.supabase
        .from('projects')
        .update({ status: 'generating', current_generation_step: 'analysis' }) // Set initial step
        .eq('id', projectId);
      
      // 1. Generate project details
      await this._addLog(projectId, 'info', 'Phase 1: Generating project details...');
      const projectDetails = await generateProjectDetails(prompt);
      await this._addLog(projectId, 'success', 'Phase 1: Project details generated.', { name: projectDetails.name, description: projectDetails.description });
      
      // Update project with initial details
      await this.supabase
        .from('projects')
        .update({
          name: projectDetails.name,
          description: projectDetails.description,
          tech_stack: projectDetails.techStack,
          structure: projectDetails.structure, // This structure could be used for step display
          current_generation_step: 'file_generation',
        })
        .eq('id', projectId);
      
      // 2. Generate file contents
      await this._addLog(projectId, 'info', 'Phase 2: Generating file contents...');
      const fileContents = await generateFileContents(prompt, projectDetails);
      await this._addLog(projectId, 'success', `Phase 2: ${fileContents.length} file contents generated.`);
      await this.supabase.from('projects').update({ current_generation_step: 'file_storage' }).eq('id', projectId);

      // Store individual files for preview
      await this._addLog(projectId, 'info', 'Phase 3: Storing individual files...');
      const individualFilePaths: string[] = [];
      for (const file of fileContents) {
        const individualFilePath = `project-source-files/${projectId}/${file.path}`;
        // Small delay for demonstration if uploads are too fast
        // await new Promise(resolve => setTimeout(resolve, 50));
        await this._addLog(projectId, 'debug', `Uploading ${file.path} to ${individualFilePath}`);
        const { error: individualUploadError } = await this.supabase.storage
          .from('project-files')
          .upload(individualFilePath, file.content, {
            contentType: file.path.endsWith('.json') ? 'application/json' :
                         file.path.endsWith('.html') || file.path.endsWith('.htm') ? 'text/html' :
                         file.path.endsWith('.css') ? 'text/css' :
                         file.path.endsWith('.js') || file.path.endsWith('.mjs') ? 'application/javascript' :
                         file.path.endsWith('.ts') || file.path.endsWith('.tsx') ? 'application/typescript' :
                         'text/plain',
            upsert: true,
          });
        if (individualUploadError) {
          await this._addLog(projectId, 'warning', `Failed to upload individual file ${file.path}: ${individualUploadError.message}`);
        } else {
          individualFilePaths.push(file.path);
        }
      }
      await this._addLog(projectId, 'success', `Phase 3: ${individualFilePaths.length} files stored individually.`);
      await this.supabase.from('projects').update({ current_generation_step: 'packaging' }).eq('id', projectId);
      
      // 3. Generate zip file
      await this._addLog(projectId, 'info', 'Phase 4: Generating ZIP file...');
      const zipBlob = await generateZipFile(projectDetails.name, fileContents);
      await this._addLog(projectId, 'success', 'Phase 4: ZIP file generated.');
      
      // 4. Store the ZIP file
      await this._addLog(projectId, 'info', 'Phase 5: Storing ZIP file...');
      const timestamp = Date.now();
      const normalizedName = projectDetails.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const zipStoragePath = `project-zips/${projectId}/${timestamp}-${normalizedName}.zip`;
      
      const { error: zipUploadError } = await this.supabase.storage
        .from('project-files')
        .upload(zipStoragePath, zipBlob, { contentType: 'application/zip', upsert: true });
        
      if (zipUploadError) {
        await this._addLog(projectId, 'error', `Failed to store ZIP file: ${zipUploadError.message}`);
        throw zipUploadError;
      }
      await this._addLog(projectId, 'success', 'Phase 5: ZIP file stored.');
      
      // 5. Generate the public URL for the ZIP file
      const { data: publicZipUrlData } = this.supabase.storage
        .from('project-files')
        .getPublicUrl(zipStoragePath);

      if (!publicZipUrlData) {
        console.error(`Error getting public URL for ${zipStoragePath} in project ${projectId}:`, publicZipUrlData);
        return;
      }
      
      // 6. Update project with completed status
      await this._addLog(projectId, 'info', 'Phase 6: Finalizing project record...');
      await this.supabase
        .from('projects')
        .update({
          status: 'completed',
          download_url: publicZipUrlData.publicUrl,
          files: individualFilePaths,
          current_generation_step: 'completed', // Mark final step
          generation_progress_overall: 100,
        })
        .eq('id', projectId);
      await this._addLog(projectId, 'success', 'Project generation completed successfully!');
      
    } catch (error: any) {
      console.error('Error generating full project:', error);
      await this._addLog(projectId, 'error', `Critical error during project generation: ${error.message}`, { stack: error.stack });
      
      await this.supabase
        .from('projects')
        .update({ status: 'failed', current_generation_step: 'failed' })
        .eq('id', projectId);
    }
  }

  async getUserProjects(): Promise<Project[]> {
    try {
      const { data: session } = await this.supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error('Authentication required');
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await this.supabase
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
      const { data, error } = await this.supabase
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
      const { data: files } = await this.supabase.storage
        .from('project-files')
        .list(folderPath);
      
      if (files && files.length > 0) {
        // Delete each file
        const filePaths = files.map(file => `${folderPath}/${file.name}`);
        await this.supabase.storage
          .from('project-files')
          .remove(filePaths);
      }
      
      // Delete the project from database
      const { error } = await this.supabase
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
      await this.supabase
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

  async getProjectFileContent(projectId: string, filePath: string): Promise<string | null> {
    try {
      const storagePath = `project-source-files/${projectId}/${filePath}`;
      const { data } = await this.supabase.storage
        .from('project-files')
        .getPublicUrl(storagePath);

      if (!data) {
        console.error(`Error getting public URL for ${filePath} in project ${projectId}:`, data);
        return null;
      }

      const publicUrl = data.publicUrl;

      const response = await fetch(publicUrl);

      if (!response.ok) {
        console.error(`Error fetching file content for ${filePath} in project ${projectId}:`, response.statusText);
        return null;
      }

      const fileContent = await response.text();
      return fileContent;
    } catch (error) {
      console.error(`Exception in getProjectFileContent for ${filePath}, project ${projectId}:`, error);
      return null;
    }
  }

  async incrementUserGenerationCount(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.rpc('increment_generation_count', {
        user_id: userId // Ensure the parameter name matches the RPC function definition
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
  const projectService = new ProjectService(supabase);
  return projectService.getUserProjects();
}
