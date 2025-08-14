import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import archiver from 'archiver';
import prettier from 'prettier';
import eslint from 'eslint';
import * as acorn from 'acorn';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import { Parser } from 'node-sql-parser';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// File size validation middleware
const validateFileSize = (req, res, next) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (req.body.code && Buffer.byteLength(req.body.code, 'utf8') > maxSize) {
    return res.status(413).json({
      error: 'File too large',
      message: 'File size exceeds 5MB limit'
    });
  }
  
  if (req.body.files && Array.isArray(req.body.files)) {
    const totalSize = req.body.files.reduce((sum, file) => 
      sum + Buffer.byteLength(file.content || '', 'utf8'), 0);
    
    if (totalSize > maxSize) {
      return res.status(413).json({
        error: 'Project too large',
        message: 'Total project size exceeds 5MB limit'
      });
    }
  }
  
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Format code endpoint
app.post('/api/format', validateFileSize, async (req, res) => {
  try {
    const { language, code, options = {} } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Code is required and must be a string'
      });
    }
    
    let formatted = code;
    const errors = [];
    const warnings = [];
    
    try {
      switch (language?.toLowerCase()) {
        case 'javascript':
        case 'js':
        case 'jsx':
        case 'typescript':
        case 'ts':
        case 'tsx':
          formatted = await prettier.format(code, {
            parser: language.includes('ts') ? 'typescript' : 'babel',
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            trailingComma: 'es5',
            ...options
          });
          break;
          
        case 'html':
          formatted = await prettier.format(code, {
            parser: 'html',
            htmlWhitespaceSensitivity: 'css',
            tabWidth: 2,
            ...options
          });
          break;
          
        case 'css':
        case 'scss':
        case 'less':
          formatted = await prettier.format(code, {
            parser: 'css',
            tabWidth: 2,
            ...options
          });
          break;
          
        case 'json':
          try {
            const parsed = JSON.parse(code);
            formatted = JSON.stringify(parsed, null, 2);
          } catch (error) {
            errors.push({
              line: 1,
              column: 1,
              message: `JSON parsing error: ${error.message}`,
              severity: 'error'
            });
          }
          break;
          
        case 'yaml':
        case 'yml':
          try {
            const parsed = yaml.load(code);
            formatted = yaml.dump(parsed, {
              indent: 2,
              lineWidth: 80,
              noRefs: true
            });
          } catch (error) {
            errors.push({
              line: error.mark?.line + 1 || 1,
              column: error.mark?.column + 1 || 1,
              message: `YAML parsing error: ${error.message}`,
              severity: 'error'
            });
          }
          break;
          
        case 'markdown':
        case 'md':
          formatted = await prettier.format(code, {
            parser: 'markdown',
            proseWrap: 'preserve',
            tabWidth: 2,
            ...options
          });
          break;
          
        case 'python':
        case 'py':
          // For Python, we'd need to call external tools like black
          // This is a placeholder - implement with subprocess if needed
          warnings.push({
            line: 1,
            column: 1,
            message: 'Python formatting requires external tools (not implemented in demo)',
            severity: 'warning'
          });
          break;
          
        default:
          warnings.push({
            line: 1,
            column: 1,
            message: `Formatting not supported for language: ${language}`,
            severity: 'warning'
          });
      }
    } catch (error) {
      errors.push({
        line: 1,
        column: 1,
        message: `Formatting error: ${error.message}`,
        severity: 'error'
      });
    }
    
    res.json({
      formatted: formatted || code,
      errors,
      warnings,
      language,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Format endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to format code'
    });
  }
});

// Validate code endpoint
app.post('/api/validate', validateFileSize, async (req, res) => {
  try {
    const { language, code } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Code is required and must be a string'
      });
    }
    
    const diagnostics = [];
    let valid = true;
    
    try {
      switch (language?.toLowerCase()) {
        case 'javascript':
        case 'js':
        case 'jsx':
        case 'typescript':
        case 'ts':
        case 'tsx':
          try {
            acorn.parse(code, {
              ecmaVersion: 'latest',
              sourceType: 'module',
              allowHashBang: true,
              allowReturnOutsideFunction: true
            });
          } catch (error) {
            valid = false;
            diagnostics.push({
              line: error.line || 1,
              column: error.column || 1,
              message: error.message,
              severity: 'error'
            });
          }
          break;
          
        case 'json':
          try {
            JSON.parse(code);
          } catch (error) {
            valid = false;
            const match = error.message.match(/at position (\d+)/);
            let line = 1, column = 1;
            
            if (match) {
              const position = parseInt(match[1]);
              const beforeError = code.substring(0, position);
              line = (beforeError.match(/\n/g) || []).length + 1;
              column = position - beforeError.lastIndexOf('\n');
            }
            
            diagnostics.push({
              line,
              column,
              message: error.message,
              severity: 'error'
            });
          }
          break;
          
        case 'yaml':
        case 'yml':
          try {
            yaml.load(code);
          } catch (error) {
            valid = false;
            diagnostics.push({
              line: error.mark?.line + 1 || 1,
              column: error.mark?.column + 1 || 1,
              message: error.message,
              severity: 'error'
            });
          }
          break;
          
        case 'sql':
          try {
            const parser = new Parser();
            parser.astify(code);
          } catch (error) {
            valid = false;
            diagnostics.push({
              line: 1,
              column: 1,
              message: `SQL parsing error: ${error.message}`,
              severity: 'error'
            });
          }
          break;
          
        default:
          // For unsupported languages, just check if not empty
          if (!code.trim()) {
            diagnostics.push({
              line: 1,
              column: 1,
              message: 'File is empty',
              severity: 'warning'
            });
          }
      }
    } catch (error) {
      valid = false;
      diagnostics.push({
        line: 1,
        column: 1,
        message: `Validation error: ${error.message}`,
        severity: 'error'
      });
    }
    
    res.json({
      ok: valid,
      diagnostics,
      language,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Validate endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to validate code'
    });
  }
});

// Create ZIP endpoint
app.post('/api/zip', validateFileSize, async (req, res) => {
  try {
    const { files, filename = 'project.zip' } = req.body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Files array is required and must not be empty'
      });
    }
    
    // Validate file structure
    const maxFiles = 100;
    if (files.length > maxFiles) {
      return res.status(400).json({
        error: 'Too many files',
        message: `Maximum ${maxFiles} files allowed`
      });
    }
    
    // Validate file paths
    const seenPaths = new Set();
    for (const file of files) {
      if (!file.path || typeof file.path !== 'string') {
        return res.status(400).json({
          error: 'Invalid file structure',
          message: 'Each file must have a valid path'
        });
      }
      
      // Check for path traversal
      if (file.path.includes('..') || file.path.startsWith('/')) {
        return res.status(400).json({
          error: 'Invalid file path',
          message: `Unsafe file path: ${file.path}`
        });
      }
      
      // Check for duplicates
      if (seenPaths.has(file.path)) {
        return res.status(400).json({
          error: 'Duplicate file path',
          message: `Duplicate path: ${file.path}`
        });
      }
      seenPaths.add(file.path);
    }
    
    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 6 } // Compression level
    });
    
    // Handle archive errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Archive creation failed',
          message: err.message
        });
      }
    });
    
    // Pipe archive data to response
    archive.pipe(res);
    
    // Add files to archive
    files.forEach(file => {
      const content = file.content || '';
      const safePath = file.path.replace(/[<>:"|?*]/g, '_');
      archive.append(content, { name: safePath });
    });
    
    // Finalize the archive
    await archive.finalize();
    
  } catch (error) {
    console.error('ZIP endpoint error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create ZIP file'
      });
    }
  }
});

// Lint code endpoint (advanced validation)
app.post('/api/lint', validateFileSize, async (req, res) => {
  try {
    const { language, code, options = {} } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Code is required and must be a string'
      });
    }
    
    const results = [];
    
    if (language?.toLowerCase() === 'javascript' || language?.toLowerCase() === 'js') {
      try {
        const ESLint = eslint.ESLint;
        const eslintInstance = new ESLint({
          baseConfig: {
            env: { browser: true, es2021: true, node: true },
            extends: ['eslint:recommended'],
            parserOptions: {
              ecmaVersion: 'latest',
              sourceType: 'module'
            },
            rules: {
              'no-unused-vars': 'warn',
              'no-console': 'warn',
              'prefer-const': 'error',
              'no-var': 'error'
            }
          },
          useEslintrc: false
        });
        
        const lintResults = await eslintInstance.lintText(code, { filePath: 'temp.js' });
        
        lintResults.forEach(result => {
          result.messages.forEach(message => {
            results.push({
              line: message.line,
              column: message.column,
              message: message.message,
              severity: message.severity === 2 ? 'error' : 'warning',
              rule: message.ruleId
            });
          });
        });
      } catch (error) {
        console.error('ESLint error:', error);
        results.push({
          line: 1,
          column: 1,
          message: `Linting error: ${error.message}`,
          severity: 'error'
        });
      }
    } else {
      results.push({
        line: 1,
        column: 1,
        message: `Linting not supported for language: ${language}`,
        severity: 'info'
      });
    }
    
    res.json({
      results,
      language,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Lint endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to lint code'
    });
  }
});

// Get supported languages endpoint
app.get('/api/languages', (req, res) => {
  const languages = [
    { id: 'javascript', name: 'JavaScript', extensions: ['.js', '.jsx'] },
    { id: 'typescript', name: 'TypeScript', extensions: ['.ts', '.tsx'] },
    { id: 'python', name: 'Python', extensions: ['.py'] },
    { id: 'java', name: 'Java', extensions: ['.java'] },
    { id: 'cpp', name: 'C++', extensions: ['.cpp', '.cc', '.cxx'] },
    { id: 'c', name: 'C', extensions: ['.c'] },
    { id: 'html', name: 'HTML', extensions: ['.html', '.htm'] },
    { id: 'css', name: 'CSS', extensions: ['.css'] },
    { id: 'json', name: 'JSON', extensions: ['.json'] },
    { id: 'yaml', name: 'YAML', extensions: ['.yml', '.yaml'] },
    { id: 'markdown', name: 'Markdown', extensions: ['.md', '.markdown'] },
    { id: 'sql', name: 'SQL', extensions: ['.sql'] },
    { id: 'shell', name: 'Shell', extensions: ['.sh', '.bash'] }
  ];
  
  res.json({
    languages,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload too large',
      message: 'Request body exceeds size limit'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('API endpoints:');
    console.log('  POST /api/format   - Format code');
    console.log('  POST /api/validate - Validate code');
    console.log('  POST /api/zip      - Create ZIP file');
    console.log('  POST /api/lint     - Lint code');
    console.log('  GET  /api/languages - Get supported languages');
    console.log('  GET  /health       - Health check');
  });
  
  const shutdown = () => {
    server.close((err) => {
      if (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
      console.log('Server closed successfully');
      process.exit(0);
    });
  };
  
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

// Start server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('📋 API endpoints:');
    console.log('  POST /api/format   - Format code');
    console.log('  POST /api/validate - Validate code');
    console.log('  POST /api/zip      - Create ZIP file');
    console.log('  POST /api/lint     - Lint code');
    console.log('  GET  /api/languages - Get supported languages');
    console.log('  GET  /health       - Health check');
  });
  
  // Graceful shutdown handlers
  process.on('SIGTERM', () => {
    console.log('\nSIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

export default app;