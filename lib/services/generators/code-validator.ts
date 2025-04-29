import { FileContent } from '../ai-service';
import { generateCodeValidationPrompt } from './prompt-generator';

interface ValidationResult {
  valid: boolean;
  issues: {
    severity: 'high' | 'medium' | 'low';
    description: string;
    line?: string;
    suggestion?: string;
  }[];
  summary: string;
}

export async function validateCode(fileContent: string, filePath: string): Promise<ValidationResult> {
  try {
    // For files that don't need validation
    if (
      filePath.endsWith('.md') ||
      filePath.endsWith('.txt') ||
      filePath.endsWith('.svg') ||
      filePath.endsWith('.ico') ||
      filePath.endsWith('.gitignore')
    ) {
      return {
        valid: true,
        issues: [],
        summary: "Non-code file, validation skipped"
      };
    }

    // Get appropriate validation based on file extension
    const fileExt = filePath.split('.').pop()?.toLowerCase();
    
    // Basic validation for common issues
    const issues = basicValidation(fileContent, fileExt);
    
    // If severe issues found, mark as invalid
    const hasSevereIssues = issues.some(issue => issue.severity === 'high');
    
    return {
      valid: !hasSevereIssues,
      issues,
      summary: hasSevereIssues 
        ? "Security or critical issues detected"
        : issues.length > 0 
          ? "Minor issues detected, but code is usable" 
          : "Code passed validation"
    };
  } catch (error) {
    console.error("Error validating code:", error);
    return {
      valid: false,
      issues: [{
        severity: 'high',
        description: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      summary: "Validation failed due to an error"
    };
  }
}

function basicValidation(content: string, fileExt?: string): ValidationResult['issues'] {
  const issues: ValidationResult['issues'] = [];
  
  // Check for hardcoded credentials
  if (
    // API keys, tokens, passwords
    /(['"])(?:api|auth|secret|key|token|password)_?(?:key|token|password)?\1\s*[:=]\s*(['"])[a-zA-Z0-9_\-]{20,}\2/i.test(content) &&
    // Not in a comment
    !/\/\/.*(?:api|auth|key|token|password)/i.test(content)
  ) {
    issues.push({
      severity: 'high',
      description: 'Hardcoded credentials or API keys detected',
      suggestion: 'Use environment variables instead of hardcoding sensitive data'
    });
  }
  
  // Check for eval or new Function
  if (/eval\s*\(/.test(content) || /new\s+Function\s*\(/.test(content)) {
    issues.push({
      severity: 'high',
      description: 'Use of eval() or new Function() detected',
      suggestion: 'Avoid using eval() or the Function constructor for security reasons'
    });
  }
  
  // Check for potential SQL injection (for JS/TS files)
  if (
    (fileExt === 'js' || fileExt === 'ts' || fileExt === 'jsx' || fileExt === 'tsx') &&
    /(?:execute|query|run)\s*\(\s*(?:[`'"]|(?:\$\{)|\+)/.test(content) &&
    !content.includes('parameterized') &&
    !content.includes('prepared')
  ) {
    issues.push({
      severity: 'high',
      description: 'Potential SQL injection vulnerability',
      suggestion: 'Use parameterized queries or prepared statements'
    });
  }
  
  // Check for potential XSS (for JS/TS files)
  if (
    (fileExt === 'js' || fileExt === 'ts' || fileExt === 'jsx' || fileExt === 'tsx') &&
    /(?:innerHTML|outerHTML|document\.write)\s*=/.test(content)
  ) {
    issues.push({
      severity: 'medium',
      description: 'Potential XSS vulnerability',
      suggestion: 'Use safer alternatives like textContent or implement proper sanitization'
    });
  }
  
  // Check for console.log statements in production code
  if (/console\.log\(/.test(content)) {
    issues.push({
      severity: 'low',
      description: 'console.log statements found',
      suggestion: 'Remove console.log statements before production'
    });
  }
  
  // Check for TODO comments
  if (/\/\/\s*TODO/.test(content) || /\/\*\s*TODO/.test(content)) {
    issues.push({
      severity: 'low',
      description: 'TODO comments found',
      suggestion: 'Address or remove TODO comments before production'
    });
  }
  
  return issues;
}

export async function validateAllFiles(files: FileContent[]): Promise<FileContent[]> {
  // Create a new array to avoid modifying the original
  const validatedFiles: FileContent[] = [];
  
  for (const file of files) {
    const validationResult = await validateCode(file.content, file.path);
    
    let content = file.content;
    
    // If file is invalid, add warning comments
    if (!validationResult.valid) {
      if (file.path.endsWith('.js') || file.path.endsWith('.ts') || file.path.endsWith('.jsx') || file.path.endsWith('.tsx')) {
        content = `/**
 * WARNING: This file contains validation issues:
 * ${validationResult.summary}
 * 
 * ${validationResult.issues.map(issue => `- ${issue.severity.toUpperCase()}: ${issue.description}`).join('\n * ')}
 * 
 * Please review and fix these issues before using in production.
 */

${content}`;
      } else if (file.path.endsWith('.html')) {
        content = `<!--
  WARNING: This file contains validation issues:
  ${validationResult.summary}
  
  ${validationResult.issues.map(issue => `- ${issue.severity.toUpperCase()}: ${issue.description}`).join('\n  ')}
  
  Please review and fix these issues before using in production.
-->

${content}`;
      } else if (file.path.endsWith('.css')) {
        content = `/**
 * WARNING: This file contains validation issues:
 * ${validationResult.summary}
 * 
 * ${validationResult.issues.map(issue => `- ${issue.severity.toUpperCase()}: ${issue.description}`).join('\n * ')}
 * 
 * Please review and fix these issues before using in production.
 */

${content}`;
      }
    }
    
    validatedFiles.push({
      path: file.path,
      content
    });
  }
  
  return validatedFiles;
}
