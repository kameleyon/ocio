export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  techStack: {
    frontend: string;
    backend: string;
    database: string;
  };
  structure: string[];
  baseFiles: {
    path: string;
    content: string;
  }[];
  promptInstructions?: string;
}

export interface TemplateConfig {
  templates: ProjectTemplate[];
  default: string;
}
