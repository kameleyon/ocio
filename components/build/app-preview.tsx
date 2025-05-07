'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, Eye, Code2, Server, Database, FileIcon, FolderIcon, Loader2 as FileLoader } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppPreviewProps {
  projectId: string
  files: { // This will now primarily be for the file tree structure
    path: string
    // content: string; // Content will be fetched on demand
    type: 'file' | 'directory'
  }[]
  isLoading?: boolean // For overall preview loading (e.g., when project is generating)
}

export default function AppPreview({ projectId, files, isLoading = false }: AppPreviewProps) {
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [activeFileContent, setActiveFileContent] = useState<string>('')
  const [isFileContentLoading, setIsFileContentLoading] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code')
  const [activeTab, setActiveTab] = useState('files')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/'])) // Keep root expanded initially

  const fetchFileContent = async (filePath: string) => {
    if (!projectId || !filePath) return;
    setIsFileContentLoading(true);
    setActiveFileContent(''); // Clear previous content

    try {
      const response = await fetch(`/api/projects/${projectId}/files/${filePath}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Failed to load file: ${response.statusText}` }));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      const content = await response.text();
      setActiveFileContent(content);
    } catch (error: any) {
      console.error(`Error fetching file ${filePath}:`, error);
      setActiveFileContent(`Error loading file: ${error.message}`);
    } finally {
      setIsFileContentLoading(false);
    }
  };

  useEffect(() => {
    // When files prop changes (e.g., initial load or project update),
    // select the first file if none is active or if the active one is no longer in the list.
    if (files.length > 0) {
      const firstFile = files.find(f => f.type === 'file');
      if (firstFile && (!activeFile || !files.some(f => f.path === activeFile))) {
        setActiveFile(firstFile.path);
        fetchFileContent(firstFile.path);
      } else if (activeFile && files.some(f => f.path === activeFile)) {
        // If active file still exists, maybe re-fetch its content if files list changed?
        // For now, let's assume content doesn't change unless file path changes.
      } else if (!activeFile && !firstFile) {
        setActiveFile(null);
        setActiveFileContent('');
      }
    } else {
      setActiveFile(null);
      setActiveFileContent('');
    }
  }, [files, projectId]); // Rerun if projectId changes too

  const handleFileClick = (path: string) => {
    const file = files.find(f => f.path === path && f.type === 'file');
    if (file) {
      setActiveFile(path);
      fetchFileContent(path); // Fetch content on click
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (path: string) => {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js': case 'jsx': case 'ts': case 'tsx':
        return <Code2 className="w-4 h-4 mr-2 text-yellow-400" />;
      case 'html':
        return <Code className="w-4 h-4 mr-2 text-orange-400" />;
      case 'css': case 'scss':
        return <Code className="w-4 h-4 mr-2 text-blue-400" />;
      case 'json':
        return <Code className="w-4 h-4 mr-2 text-green-400" />;
      case 'md':
        return <FileIcon className="w-4 h-4 mr-2 text-gray-400" />;
      default:
        return <FileIcon className="w-4 h-4 mr-2 text-gray-400" />;
    }
  };

  const fileTree = React.useMemo(() => {
    const tree: any = {};
    // Ensure files is an array before processing
    (files || []).forEach(file => {
        const pathParts = file.path.split('/').filter(Boolean);
        let currentLevel = tree;
        pathParts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = {
                    type: index === pathParts.length - 1 && file.type === 'file' ? 'file' : 'directory',
                    children: {},
                    path: pathParts.slice(0, index + 1).join('/')
                };
            }
            currentLevel = currentLevel[part].children;
        });
    });
    return tree;
  }, [files]);

  const renderTree = (tree: any, path = '', level = 0) => {
    return Object.entries(tree).map(([name, data]: [string, any]) => {
      const fullPath = path ? `${path}/${name}` : name;
      const isDirectory = data.type === 'directory';
      const isExpanded = expandedFolders.has(fullPath);
      
      return (
        <div key={fullPath} className="ml-1">
          <div 
            className={cn(
              "flex items-center py-1 px-2 rounded-md text-sm cursor-pointer hover:bg-berkeleyBlue hover:bg-opacity-40",
              activeFile === fullPath && "bg-slateBlue bg-opacity-20"
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => isDirectory ? toggleFolder(fullPath) : handleFileClick(fullPath)}
          >
            {isDirectory ? (
              <>
                <FolderIcon className={cn("w-4 h-4 mr-2", isExpanded ? "text-robinEggBlue" : "text-slateBlue")} />
                <span>{name}</span>
              </>
            ) : (
              <>
                {getFileIcon(name)}
                <span>{name}</span>
              </>
            )}
          </div>
          {isDirectory && isExpanded && Object.keys(data.children).length > 0 && (
            <div className="border-l border-berkeleyBlue ml-4">
              {renderTree(data.children, fullPath, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const getLanguage = (filepath: string | null) => {
    if (!filepath) return 'plaintext';
    const extension = filepath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js': case 'jsx': return 'javascript';
      case 'ts': case 'tsx': return 'typescript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  if (isLoading) { // Overall loading state from BuildInterface
    return (
      <div className="border rounded-xl p-6 glassmorphism h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-slateBlue rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute top-1 left-1 w-14 h-14 border-4 border-robinEggBlue rounded-full border-b-transparent animate-spin animation-delay-150"></div>
          </div>
          <p className="text-whiteSmoke text-lg">Loading App Preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl glassmorphism h-full flex flex-col">
      <Tabs defaultValue="files" value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <div className="border-b border-berkeleyBlue px-4 pt-2 pb-0">
          <TabsList className="bg-transparent border border-berkeleyBlue rounded-t-lg mb-0">
            <TabsTrigger value="files" className={cn("data-[state=active]:bg-berkeleyBlue data-[state=active]:text-whiteSmoke", "rounded-t-md rounded-b-none border-b-0")}>
              <FolderIcon className="w-4 h-4 mr-2" /> Project Files
            </TabsTrigger>
            <TabsTrigger value="preview" className={cn("data-[state=active]:bg-berkeleyBlue data-[state=active]:text-whiteSmoke", "rounded-t-md rounded-b-none border-b-0")}>
              <Eye className="w-4 h-4 mr-2" /> Live Preview
            </TabsTrigger>
            <TabsTrigger value="database" className={cn("data-[state=active]:bg-berkeleyBlue data-[state=active]:text-whiteSmoke", "rounded-t-md rounded-b-none border-b-0")}>
              <Database className="w-4 h-4 mr-2" /> Database
            </TabsTrigger>
            <TabsTrigger value="api" className={cn("data-[state=active]:bg-berkeleyBlue data-[state=active]:text-whiteSmoke", "rounded-t-md rounded-b-none border-b-0")}>
              <Server className="w-4 h-4 mr-2" /> API
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="files" className="flex flex-1 overflow-hidden m-0 p-0">
          <div className="w-1/4 h-full border-r border-berkeleyBlue p-2 overflow-y-auto">
            {Object.keys(fileTree).length > 0 ? (
              renderTree(fileTree)
            ) : (
              <div className="p-4 text-center text-lightGray">
                No files available or project still loading.
              </div>
            )}
          </div>
          
          <div className="w-3/4 h-full overflow-hidden flex flex-col">
            {activeFile ? (
              <>
                <div className="border-b border-berkeleyBlue p-2 flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(activeFile)}
                    <span className="text-sm">{activeFile}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={cn("p-1 rounded-md", previewMode === 'code' ? "bg-slateBlue bg-opacity-20" : "hover:bg-berkeleyBlue hover:bg-opacity-40")} onClick={() => setPreviewMode('code')}>
                      <Code2 className="w-4 h-4" />
                    </button>
                    <button className={cn("p-1 rounded-md", previewMode === 'preview' ? "bg-slateBlue bg-opacity-20" : "hover:bg-berkeleyBlue hover:bg-opacity-40")} onClick={() => setPreviewMode('preview')} disabled={!activeFile?.endsWith('.html')}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto p-4">
                  {isFileContentLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <FileLoader className="w-8 h-8 animate-spin text-slateBlue" />
                      <p className="ml-2 text-lightGray">Loading file content...</p>
                    </div>
                  ) : previewMode === 'code' ? (
                    <pre className="text-sm font-mono p-2 bg-richBlack bg-opacity-50 rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                      <code>{activeFileContent}</code>
                    </pre>
                  ) : (
                    <div className="h-full w-full bg-white rounded-md overflow-hidden">
                      {activeFile?.endsWith('.html') ? (
                        <iframe srcDoc={activeFileContent} className="w-full h-full border-0" sandbox="allow-scripts" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-black">
                          Preview not available for this file type. Select an HTML file.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-lightGray">
                Select a file to view its content.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 overflow-hidden m-0 p-0">
          <div className="h-full w-full bg-white rounded-md overflow-hidden flex items-center justify-center">
            {projectId ? (
                <iframe 
                  id="app-preview-frame"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin" // Be cautious with sandbox attributes
                  src={`/api/preview/${projectId}`} // This endpoint needs to serve the main HTML file of the project
                />
            ) : (
                <p className="text-black">No project selected for preview.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="database" className="m-0 p-4">
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
            <Database className="w-12 h-12 text-slateBlue opacity-60" />
            <h3 className="text-xl font-comfortaa">Database Structure</h3>
            <p className="text-lightGray max-w-md">
              Database schema and details will be shown here once available.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="api" className="m-0 p-4">
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
            <Server className="w-12 h-12 text-slateBlue opacity-60" />
            <h3 className="text-xl font-comfortaa">API Endpoints</h3>
            <p className="text-lightGray max-w-md">
              Generated API endpoints and documentation will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
