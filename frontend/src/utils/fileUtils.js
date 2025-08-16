import JSZip from 'jszip';

// File size limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES_IN_ZIP = 100;

// MIME type mappings
export const MIME_TYPES = {
  js: 'application/javascript',
  jsx: 'application/javascript',
  ts: 'application/typescript',
  tsx: 'application/typescript',
  py: 'text/x-python',
  java: 'text/x-java-source',
  cpp: 'text/x-c++src',
  c: 'text/x-csrc',
  html: 'text/html',
  css: 'text/css',
  json: 'application/json',
  xml: 'application/xml',
  yaml: 'application/x-yaml',
  yml: 'application/x-yaml',
  md: 'text/markdown',
  txt: 'text/plain',
  sql: 'application/sql',
  sh: 'application/x-sh',
  bash: 'application/x-sh',
  dockerfile: 'text/plain',
  gitignore: 'text/plain',
  env: 'text/plain'
};

// Get MIME type for file extension
export const getMimeType = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return MIME_TYPES[ext] || 'text/plain';
};

// Generate safe filename
export const generateSafeFilename = (filename) => {
  if (!filename) return 'untitled.txt';
  
  // Remove or replace unsafe characters
  const safe = filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
  
  return safe || 'untitled.txt';
};

// Validate file content size
export const validateFileSize = (content) => {
  const size = new Blob([content]).size;
  return {
    valid: size <= MAX_FILE_SIZE,
    size,
    maxSize: MAX_FILE_SIZE,
    message: size > MAX_FILE_SIZE ? 
      `File size (${formatFileSize(size)}) exceeds maximum allowed size (${formatFileSize(MAX_FILE_SIZE)})` : 
      null
  };
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Download single file
export const downloadFile = (content, filename, mimeType) => {
  try {
    const safeFilename = generateSafeFilename(filename);
    const actualMimeType = mimeType || getMimeType(safeFilename);
    
    const blob = new Blob([content], { type: actualMimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = safeFilename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return { success: true };
  } catch (error) {
    console.error('Download failed:', error);
    return { success: false, error: error.message };
  }
};

// Create and download ZIP file
export const downloadZip = async (files, zipFilename = 'project.zip') => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No files to zip');
    }
    
    if (files.length > MAX_FILES_IN_ZIP) {
      throw new Error(`Too many files. Maximum allowed: ${MAX_FILES_IN_ZIP}`);
    }
    
    const zip = new JSZip();
    
    // Add files to zip
    files.forEach(file => {
      const safePath = generateSafeFilename(file.path || file.filename || 'untitled.txt');
      zip.file(safePath, file.content || '');
    });
    
    // Generate zip blob
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    
    // Download the zip
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generateSafeFilename(zipFilename);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return { success: true, size: zipBlob.size };
  } catch (error) {
    console.error('ZIP download failed:', error);
    return { success: false, error: error.message };
  }
};

// Validate file structure for multi-file projects
export const validateFileStructure = (files) => {
  const errors = [];
  const warnings = [];
  const paths = new Set();
  
  files.forEach((file, index) => {
    const path = file.path || file.filename || `file_${index}`;
    
    // Check for duplicate paths
    if (paths.has(path)) {
      errors.push(`Duplicate file path: ${path}`);
    } else {
      paths.add(path);
    }
    
    // Check file size
    const sizeValidation = validateFileSize(file.content || '');
    if (!sizeValidation.valid) {
      errors.push(`${path}: ${sizeValidation.message}`);
    }
    
    // Check for empty files
    if (!file.content || file.content.trim().length === 0) {
      warnings.push(`${path}: File is empty`);
    }
    
    // Check for potentially unsafe file paths
    if (path.includes('..') || path.startsWith('/')) {
      warnings.push(`${path}: Potentially unsafe file path`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fileCount: files.length,
    totalSize: files.reduce((sum, file) => sum + (file.content?.length || 0), 0)
  };
};

// Generate project structure from files
export const generateProjectStructure = (files) => {
  const structure = {};
  
  files.forEach(file => {
    const path = file.path || file.filename || 'untitled.txt';
    const parts = path.split('/').filter(Boolean);
    
    let current = structure;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = { type: 'directory', children: {} };
      }
      current = current[part].children;
    }
    
    const filename = parts[parts.length - 1] || path;
    current[filename] = {
      type: 'file',
      content: file.content || '',
      size: file.content?.length || 0,
      mimeType: getMimeType(filename)
    };
  });
  
  return structure;
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return { success: result };
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return { success: false, error: error.message };
  }
};

// Detect language from file extension or content
export const detectLanguage = (filename, content = '') => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  
  const extensionMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cc: 'cpp',
    cxx: 'cpp',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    markdown: 'markdown',
    txt: 'plaintext',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    fish: 'shell',
    ps1: 'powershell',
    dockerfile: 'dockerfile',
    go: 'go',
    rs: 'rust',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    r: 'r'
  };
  
  if (ext && extensionMap[ext]) {
    return extensionMap[ext];
  }
  
  // Try to detect from content
  if (content) {
    const firstLine = content.split('\n')[0].toLowerCase();
    
    if (firstLine.includes('#!/bin/bash') || firstLine.includes('#!/usr/bin/bash')) {
      return 'shell';
    }
    if (firstLine.includes('#!/usr/bin/env python') || firstLine.includes('#!/usr/bin/python')) {
      return 'python';
    }
    if (firstLine.includes('#!/usr/bin/env node') || firstLine.includes('#!/usr/bin/node')) {
      return 'javascript';
    }
    if (content.includes('<?php')) {
      return 'php';
    }
    if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
      return 'html';
    }
  }
  
  return 'plaintext';
};

// Generate filename suggestions based on content
export const suggestFilename = (content, language) => {
  if (!content || !language) return 'untitled.txt';
  
  const lines = content.split('\n');
  
  // Try to extract meaningful names from content
  for (const line of lines.slice(0, 10)) { // Check first 10 lines
    const trimmed = line.trim();
    
    // Class names
    const classMatch = trimmed.match(/class\s+(\w+)/i);
    if (classMatch) {
      return `${classMatch[1]}.${getExtensionForLanguage(language)}`;
    }
    
    // Function names (for main functions)
    const funcMatch = trimmed.match(/function\s+(\w+)|def\s+(\w+)|fn\s+(\w+)/i);
    if (funcMatch) {
      const name = funcMatch[1] || funcMatch[2] || funcMatch[3];
      if (name !== 'main') {
        return `${name}.${getExtensionForLanguage(language)}`;
      }
    }
    
    // Package/module names
    const packageMatch = trimmed.match(/package\s+(\w+)|module\s+(\w+)/i);
    if (packageMatch) {
      const name = packageMatch[1] || packageMatch[2];
      return `${name}.${getExtensionForLanguage(language)}`;
    }
    
    // Component names (React)
    const componentMatch = trimmed.match(/const\s+(\w+)\s*=.*=>/);
    if (componentMatch && componentMatch[1] !== 'App') {
      return `${componentMatch[1]}.jsx`;
    }
  }
  
  // Default names based on language
  const defaults = {
    javascript: 'script.js',
    typescript: 'script.ts',
    python: 'script.py',
    java: 'Main.java',
    cpp: 'main.cpp',
    c: 'main.c',
    html: 'index.html',
    css: 'styles.css',
    json: 'data.json',
    yaml: 'config.yml',
    markdown: 'README.md',
    sql: 'schema.sql',
    shell: 'script.sh'
  };
  
  return defaults[language] || 'untitled.txt';
};

// Get file extension for language
export const getExtensionForLanguage = (language) => {
  const extensionMap = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    html: 'html',
    css: 'css',
    json: 'json',
    yaml: 'yml',
    markdown: 'md',
    sql: 'sql',
    shell: 'sh',
    plaintext: 'txt'
  };
  
  return extensionMap[language] || 'txt';
};