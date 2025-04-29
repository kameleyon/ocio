// Common types for the generators module

export interface StructuredPrompt {
  systemPrompt: string;
  userPrompt: string;
}

export type FileContent = {
  path: string;
  content: string;
};

export type GeneratedFile = {
  path: string;
  content: string;
  type: 'file' | 'directory';
};
