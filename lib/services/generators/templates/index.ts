import { TemplateConfig } from './types';
import { reactTemplate } from './react-template';
import { nextTemplate } from './next-template';
import { mernTemplate } from './mern-template';

export const templates: TemplateConfig = {
  templates: [
    reactTemplate,
    nextTemplate,
    mernTemplate,
  ],
  default: 'react-vite'
};

export function getTemplateById(id: string) {
  return templates.templates.find(template => template.id === id);
}

export function getDefaultTemplate() {
  return getTemplateById(templates.default) || templates.templates[0];
}

export * from './types';
export * from './react-template';
export * from './next-template';
export * from './mern-template';
