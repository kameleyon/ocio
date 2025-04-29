import { ProjectTemplate, getTemplateById, getDefaultTemplate } from './templates';
import { FileContent } from '../ai-service';

interface FileGenerationOptions {
  includeBaseFiles: boolean;
  validateSecurity: boolean;
  customFiles?: FileContent[];
}

export async function generateProjectFiles(
  projectName: string,
  techStack: any,
  files: FileContent[],
  options: FileGenerationOptions = { includeBaseFiles: true, validateSecurity: true }
): Promise<FileContent[]> {
  // Determine which template to use based on tech stack
  let template: ProjectTemplate | undefined;
  
  if (techStack?.frontend?.toLowerCase().includes('next')) {
    template = getTemplateById('next-js');
  } else if (techStack?.backend?.toLowerCase().includes('express') || 
             techStack?.database?.toLowerCase().includes('mongo')) {
    template = getTemplateById('mern-stack');
  } else {
    template = getTemplateById('react-vite');
  }
  
  // Fall back to default template if none matched
  if (!template) {
    template = getDefaultTemplate();
  }
  
  // Create a map of files for easier reference
  const fileMap = new Map<string, FileContent>();
  
  // Add custom files
  if (options.customFiles) {
    options.customFiles.forEach(file => {
      fileMap.set(file.path, file);
    });
  }
  
  // Add AI-generated files, overriding custom files if paths match
  files.forEach(file => {
    fileMap.set(file.path, file);
  });
  
  // Add template base files if option enabled
  if (options.includeBaseFiles && template) {
    template.baseFiles.forEach(file => {
      // Only add if file doesn't already exist
      if (!fileMap.has(file.path)) {
        fileMap.set(file.path, file);
      }
    });
  }
  
  // Replace {project-name} placeholders with actual project name
  const normalizedProjectName = projectName.toLowerCase().replace(/\s+/g, '-');
  const result: FileContent[] = [];
  
  fileMap.forEach((file) => {
    const updatedContent = file.content.replace(/\{project-name\}/g, normalizedProjectName);
    result.push({
      path: file.path,
      content: updatedContent
    });
  });
  
  // Validate security if option enabled
  if (options.validateSecurity) {
    return await validateFilesSecurity(result);
  }
  
  return result;
}

async function validateFilesSecurity(files: FileContent[]): Promise<FileContent[]> {
  // Implement security validations here
  // For now, we'll do some basic checks
  
  return files.map(file => {
    let content = file.content;
    
    // Remove any potential malicious patterns
    // This is very basic and should be expanded
    content = content.replace(/eval\s*\(/g, '// eval was removed for security (');
    content = content.replace(/new\s+Function\s*\(/g, '// Function constructor was removed for security (');
    
    // Check for hardcoded sensitive data like API keys
    const sensitivePatterns = [
      /(['"])(?:api|auth|secret|key|token|password|credential)_?(?:key|token|secret|password|id)?\1\s*[:=]\s*(['"])[a-zA-Z0-9_\-]{20,}\2/gi,
    ];
    
    sensitivePatterns.forEach(pattern => {
      content = content.replace(pattern, (match) => {
        return match.replace(/(['"])[a-zA-Z0-9_\-]{20,}\1/g, '$1USE_ENV_VARIABLE_INSTEAD$1');
      });
    });
    
    // Add .env usage for any sensitive data
    if (file.path.includes('package.json')) {
      // Make sure dotenv is included
      if (!content.includes('dotenv')) {
        content = content.replace(/"dependencies"\s*:\s*{/g, '"dependencies": {\n    "dotenv": "^16.0.3",');
      }
    }
    
    return {
      path: file.path,
      content
    };
  });
}

export function normalizeProjectName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
