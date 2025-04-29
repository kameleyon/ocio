import {
  generateProjectStructurePrompt,
  generateFileContentsPrompt,
  generateProjectNamePrompt,
  generateCodeValidationPrompt
} from './prompt-generator';

import {
  validateCode,
  validateAllFiles
} from './code-validator';

import {
  generateProjectFiles,
  normalizeProjectName
} from './file-generator';

import {
  generateProjectZip,
  generateZipWithReadme
} from './zip-generator';

import {
  templates,
  getTemplateById,
  getDefaultTemplate
} from './templates';

import type { StructuredPrompt } from './types';
import type { ProjectTemplate } from './templates/types';

// Export all functionality from the generators module
export {
  // Prompt generators
  generateProjectStructurePrompt,
  generateFileContentsPrompt,
  generateProjectNamePrompt,
  generateCodeValidationPrompt,
  
  // Code validation
  validateCode,
  validateAllFiles,
  
  // File generation
  generateProjectFiles,
  normalizeProjectName,
  
  // Zip creation
  generateProjectZip,
  generateZipWithReadme,
  
  // Templates
  templates,
  getTemplateById,
  getDefaultTemplate,
};

// Export types
export type { StructuredPrompt, ProjectTemplate };
