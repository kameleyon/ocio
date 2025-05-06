/**
 * Dependency Installation Script
 * 
 * This script installs all required dependencies for the OptimusCode API wrapper.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('OptimusCode API Dependency Installer');
console.log('====================================');

// Essential dependencies for the API wrapper
const dependencies = [
  '@modelcontextprotocol/sdk@1.8.0',
  'express@4.18.3',
  'cors@2.8.5',
  'body-parser@1.20.2',
  'dotenv@16.5.0',
  'jsonwebtoken@9.0.2',
  'morgan@1.10.0',
  'uuid@11.1.0',
  'fs-extra@11.3.0',
  'swagger-jsdoc@6.2.8',
  'swagger-ui-express@5.0.0',
  'zod@3.24.1',
  'zod-to-json-schema@3.23.5'
];

// Type definitions
const devDependencies = [
  '@types/express@4.17.21',
  '@types/cors@2.8.17',
  '@types/body-parser@1.19.5',
  '@types/dotenv@6.1.1',
  '@types/jsonwebtoken@9.0.9',
  '@types/morgan@1.9.9',
  '@types/uuid@10.0.0',
  '@types/fs-extra@11.0.4',
  '@types/swagger-jsdoc@6.0.4',
  '@types/swagger-ui-express@4.1.6',
  '@types/node@20.17.24'
];

// Function to install dependencies
function installDependencies(deps, dev = false) {
  try {
    const command = `npm install ${dev ? '--save-dev' : '--save'} ${deps.join(' ')}`;
    console.log(`Installing ${dev ? 'development ' : ''}dependencies...`);
    console.log(command);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error installing dependencies: ${error.message}`);
    return false;
  }
}

// Main installation process
async function main() {
  console.log('Installing dependencies...');
  const depsSuccess = installDependencies(dependencies);
  
  if (depsSuccess) {
    console.log('Installing development dependencies...');
    const devDepsSuccess = installDependencies(devDependencies, true);
    
    if (devDepsSuccess) {
      console.log('\nRebuild TypeScript files...');
      try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log('\nDependencies installed and project built successfully!');
        console.log('\nYou can now start the API with:');
        console.log('npm run start:all');
      } catch (error) {
        console.error(`Error building project: ${error.message}`);
      }
    }
  }
}

// Execute the installation
main().catch(err => {
  console.error('Installation failed:', err);
  process.exit(1);
});