import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Download, 
  Play, 
  FileText, 
  Folder, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Settings,
  Copy,
  Eye,
  Code,
  Zap,
  Archive
} from 'lucide-react';

import { templates, getAllLanguages, getTemplatesByLanguage } from './templates';
import { 
  downloadFile, 
  downloadZip, 
  validateFileStructure,
  formatFileSize,
  detectLanguage,
  suggestFilename
} from './utils/fileUtils';
import { validateCode, getValidationSummary } from './utils/validationUtils';

const App = () => {
  // State management
  const [files, setFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResults, setValidationResults] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState([]);

  // Get current file
  const activeFile = files.find(f => f.id === activeFileId);
  const languages = getAllLanguages();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('codeGenerator_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  // Create initial file if none exist
  useEffect(() => {
    if (files.length === 0) {
      createNewFile();
    }
  }, [files.length, createNewFile]);

  // Save to history
  const saveToHistory = useCallback((file) => {
    const historyItem = {
      id: Date.now().toString(),
      filename: file.filename,
      language: file.language,
      content: file.content,
      timestamp: new Date().toISOString(),
      size: file.content.length
    };

    const newHistory = [historyItem, ...history.slice(0, 9)]; // Keep last 10 items
    setHistory(newHistory);
    localStorage.setItem('codeGenerator_history', JSON.stringify(newHistory));
  }, [history]);

  // Create new file
  const createNewFile = useCallback((template = null) => {
    const id = Date.now().toString();
    const languageInfo = languages.find(l => l.id === selectedLanguage) || languages[0];
    
    let content = '';
    let filename = suggestFilename('', selectedLanguage);
    
    if (template) {
      content = template.content;
      filename = template.filename;
    }

    const newFile = {
      id,
      filename,
      content,
      language: selectedLanguage,
      extension: languageInfo.extension,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(id);
    setSelectedTemplate('');
  }, [selectedLanguage, languages]);

  // Update file content
  const updateFileContent = useCallback((content) => {
    if (!activeFileId) return;

    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { 
            ...file, 
            content, 
            modified: new Date().toISOString(),
            language: detectLanguage(file.filename, content)
          }
        : file
    ));

    // Validate content
    const language = activeFile?.language || selectedLanguage;
    const validation = validateCode(content, language);
    setValidationResults(prev => ({
      ...prev,
      [activeFileId]: validation
    }));

    // Update preview for supported formats
    if (['html', 'markdown', 'json'].includes(language)) {
      setPreviewContent(content);
    }
  }, [activeFileId, activeFile, selectedLanguage]);

  // Delete file
  const deleteFile = useCallback((fileId) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== fileId);
      if (filtered.length === 0) {
        // Create new file if all deleted
        setTimeout(() => createNewFile(), 100);
        return [];
      }
      return filtered;
    });

    if (activeFileId === fileId) {
      const remainingFiles = files.filter(f => f.id !== fileId);
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
    }

    // Clean up validation results
    setValidationResults(prev => {
      const { [fileId]: removed, ...rest } = prev;
      return rest;
    });
  }, [activeFileId, files, createNewFile]);

  // Update filename
  const updateFilename = useCallback((fileId, newFilename) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            filename: newFilename,
            language: detectLanguage(newFilename, file.content),
            modified: new Date().toISOString()
          }
        : file
    ));
  }, []);

  // Apply template
  const applyTemplate = useCallback((templateKey) => {
    const languageTemplates = getTemplatesByLanguage(selectedLanguage);
    if (!languageTemplates || !languageTemplates.templates[templateKey]) return;

    const template = languageTemplates.templates[templateKey];
    
    if (activeFile) {
      // Apply to existing file
      setFiles(prev => prev.map(file => 
        file.id === activeFileId 
          ? { 
              ...file, 
              content: template.content,
              filename: template.filename,
              modified: new Date().toISOString()
            }
          : file
      ));
    } else {
      // Create new file with template
      createNewFile(template);
    }
  }, [selectedLanguage, activeFile, activeFileId, createNewFile]);

  // Format code (client-side)
  const formatCode = useCallback(async () => {
    if (!activeFile) return;

    setIsLoading(true);
    try {
      // For now, we'll just do basic formatting
      let formatted = activeFile.content;
      
      if (activeFile.language === 'json') {
        try {
          const parsed = JSON.parse(activeFile.content);
          formatted = JSON.stringify(parsed, null, 2);
        } catch (error) {
          console.error('JSON formatting failed:', error);
        }
      }

      if (formatted !== activeFile.content) {
        updateFileContent(formatted);
      }
    } catch (error) {
      console.error('Formatting failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFile, updateFileContent]);

  // Download single file
  const handleDownloadFile = useCallback(() => {
    if (!activeFile) return;

    const result = downloadFile(
      activeFile.content, 
      activeFile.filename
    );

    if (result.success) {
      saveToHistory(activeFile);
    } else {
      alert(`Download failed: ${result.error}`);
    }
  }, [activeFile, saveToHistory]);

  // Download project as ZIP
  const handleDownloadZip = useCallback(async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      const validation = validateFileStructure(files);
      
      if (!validation.valid) {
        alert(`Cannot create ZIP: ${validation.errors.join(', ')}`);
        return;
      }

      const result = await downloadZip(files.map(file => ({
        path: file.filename,
        content: file.content
      })), 'project.zip');

      if (result.success) {
        // Save all files to history
        files.forEach(saveToHistory);
      } else {
        alert(`ZIP creation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('ZIP download failed:', error);
      alert(`ZIP download failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [files, saveToHistory]);

  // Copy content to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!activeFile) return;

    try {
      await navigator.clipboard.writeText(activeFile.content);
      // You could add a toast notification here
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }, [activeFile]);

  // Validate current file
  const validateCurrentFile = useCallback(() => {
    if (!activeFile) return;

    const validation = validateCode(activeFile.content, activeFile.language);
    setValidationResults(prev => ({
      ...prev,
      [activeFileId]: validation
    }));
  }, [activeFile, activeFileId]);

  // Render validation panel
  const renderValidationPanel = () => {
    if (!activeFileId || !validationResults[activeFileId]) return null;

    const result = validationResults[activeFileId];
    const { errors, warnings, suggestions } = result;
    const allIssues = [...errors, ...warnings, ...suggestions];

    if (allIssues.length === 0) {
      return (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle size={16} />
          <span>No issues found</span>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle size={16} className="text-yellow-400" />
          <span>{getValidationSummary(result)}</span>
        </div>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {allIssues.map((issue, index) => (
            <div key={index} className={`text-xs p-2 rounded ${
              issue.severity === 'error' ? 'bg-red-900/20 text-red-300' :
              issue.severity === 'warning' ? 'bg-yellow-900/20 text-yellow-300' :
              'bg-blue-900/20 text-blue-300'
            }`}>
              <div className="font-medium">
                {issue.severity.toUpperCase()}
                {issue.line && ` (Line ${issue.line})`}
              </div>
              <div>{issue.message}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render preview panel
  const renderPreview = () => {
    if (!showPreview || !activeFile) return null;

    const { language, content } = activeFile;

    if (language === 'html') {
      return (
        <div className="h-full">
          <iframe 
            srcDoc={content}
            className="w-full h-full border-0"
            title="HTML Preview"
            sandbox="allow-scripts"
          />
        </div>
      );
    }

    if (language === 'markdown') {
      // Basic markdown preview (you might want to use a proper markdown library)
      const htmlContent = content
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n/gim, '<br>');

      return (
        <div 
          className="h-full p-4 overflow-auto prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }

    if (language === 'json') {
      try {
        const parsed = JSON.parse(content);
        return (
          <pre className="h-full p-4 overflow-auto text-sm text-green-400">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
      } catch (error) {
        return (
          <div className="h-full p-4 text-red-400">
            <div className="font-medium">JSON Parse Error:</div>
            <div className="text-sm">{error.message}</div>
          </div>
        );
      }
    }

    return (
      <div className="h-full p-4 text-gray-400">
        Preview not available for {language} files
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-editor-bg text-white">
      {/* Header */}
      <div className="bg-sidebar-bg border-b border-border-color p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Code File Generator</h1>
            <div className="flex items-center gap-2">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="select-field"
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
              
              {getTemplatesByLanguage(selectedLanguage) && (
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    if (e.target.value) {
                      applyTemplate(e.target.value);
                    }
                  }}
                  className="select-field"
                >
                  <option value="">Choose Template...</option>
                  {Object.keys(getTemplatesByLanguage(selectedLanguage).templates).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary"
              title="Toggle Preview"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={validateCurrentFile}
              className="btn-secondary"
              title="Validate Code"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={formatCode}
              disabled={isLoading}
              className="btn-secondary"
              title="Format Code"
            >
              <Code size={16} />
            </button>
            <button
              onClick={copyToClipboard}
              className="btn-secondary"
              title="Copy to Clipboard"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleDownloadFile}
              disabled={!activeFile}
              className="btn-primary"
              title="Download File"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={files.length === 0 || isLoading}
              className="btn-success"
              title="Download Project (ZIP)"
            >
              <Archive size={16} />
              ZIP
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Tree */}
        <div className="w-64 bg-sidebar-bg border-r border-border-color flex flex-col">
          <div className="p-3 border-b border-border-color">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Files</h3>
              <button
                onClick={() => createNewFile()}
                className="p-1 hover:bg-gray-700 rounded"
                title="New File"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {files.map(file => (
              <div
                key={file.id}
                className={`file-tree-item ${activeFileId === file.id ? 'active' : ''}`}
                onClick={() => setActiveFileId(file.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <FileText size={14} />
                    <input
                      type="text"
                      value={file.filename}
                      onChange={(e) => updateFilename(file.id, e.target.value)}
                      className="bg-transparent border-none outline-none flex-1 text-sm"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="p-1 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100"
                    title="Delete File"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatFileSize(file.content.length)} • {file.language}
                </div>
              </div>
            ))}
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="border-t border-border-color">
              <div className="p-3">
                <h4 className="font-medium text-sm mb-2">Recent Files</h4>
                <div className="space-y-1 max-h-32 overflow-auto">
                  {history.slice(0, 5).map(item => (
                    <div
                      key={item.id}
                      className="text-xs p-2 hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => {
                        createNewFile({
                          filename: item.filename,
                          content: item.content
                        });
                      }}
                    >
                      <div className="font-medium truncate">{item.filename}</div>
                      <div className="text-gray-400">
                        {formatFileSize(item.size)} • {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center - Editor */}
        <div className="flex-1 flex flex-col">
          {activeFile ? (
            <>
              <div className="flex-1 monaco-editor-container">
                <Editor
                  height="100%"
                  language={activeFile.language}
                  value={activeFile.content}
                  onChange={updateFileContent}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'bounded',
                    wordWrapColumn: 120,
                    renderWhitespace: 'boundary',
                    bracketPairColorization: { enabled: true }
                  }}
                />
              </div>

              {/* Bottom Panel - Validation */}
              <div className="h-32 bg-sidebar-bg border-t border-border-color p-3 overflow-auto">
                <h4 className="font-medium text-sm mb-2">Validation Results</h4>
                {renderValidationPanel()}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No file selected</p>
                <button
                  onClick={() => createNewFile()}
                  className="btn-primary mt-4"
                >
                  Create New File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Preview */}
        {showPreview && (
          <div className="w-96 bg-sidebar-bg border-l border-border-color flex flex-col">
            <div className="p-3 border-b border-border-color">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-sidebar-bg p-6 rounded-lg flex items-center gap-3">
            <div className="loading-spinner w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;