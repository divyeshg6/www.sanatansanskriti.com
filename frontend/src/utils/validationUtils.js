import * as acorn from 'acorn';
import * as yaml from 'js-yaml';

// Validation results structure
const createValidationResult = (valid, errors = [], warnings = [], suggestions = []) => ({
  valid,
  errors,
  warnings,
  suggestions,
  timestamp: new Date().toISOString()
});

// JavaScript/TypeScript validation using Acorn
export const validateJavaScript = (code) => {
  try {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    
    if (!code.trim()) {
      warnings.push({
        line: 1,
        column: 1,
        message: 'File is empty',
        severity: 'warning'
      });
      return createValidationResult(true, [], warnings);
    }
    
    // Try to parse with Acorn
    try {
      acorn.parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        allowHashBang: true,
        allowReturnOutsideFunction: true
      });
    } catch (error) {
      errors.push({
        line: error.line || 1,
        column: error.column || 1,
        message: error.message,
        severity: 'error'
      });
      return createValidationResult(false, errors, warnings);
    }
    
    // Additional checks
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmed = line.trim();
      
      // Check for common issues
      if (trimmed.includes('console.log') && !trimmed.startsWith('//')) {
        suggestions.push({
          line: lineNumber,
          column: line.indexOf('console.log') + 1,
          message: 'Consider removing console.log statements in production code',
          severity: 'suggestion'
        });
      }
      
      // Check for var usage
      if (trimmed.startsWith('var ')) {
        suggestions.push({
          line: lineNumber,
          column: 1,
          message: 'Consider using let or const instead of var',
          severity: 'suggestion'
        });
      }
      
      // Check for == usage
      if (trimmed.includes('==') && !trimmed.includes('===') && !trimmed.includes('!==')) {
        suggestions.push({
          line: lineNumber,
          column: line.indexOf('==') + 1,
          message: 'Consider using === for strict equality comparison',
          severity: 'suggestion'
        });
      }
    });
    
    return createValidationResult(true, [], warnings, suggestions);
  } catch (error) {
    return createValidationResult(false, [{
      line: 1,
      column: 1,
      message: `Validation error: ${error.message}`,
      severity: 'error'
    }]);
  }
};

// JSON validation
export const validateJSON = (code) => {
  try {
    if (!code.trim()) {
      return createValidationResult(false, [{
        line: 1,
        column: 1,
        message: 'JSON cannot be empty',
        severity: 'error'
      }]);
    }
    
    JSON.parse(code);
    
    const suggestions = [];
    
    // Check for common JSON formatting issues
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for trailing commas (common mistake)
      if (line.trim().endsWith(',}') || line.trim().endsWith(',]')) {
        suggestions.push({
          line: lineNumber,
          column: line.lastIndexOf(',') + 1,
          message: 'Trailing comma before closing bracket',
          severity: 'suggestion'
        });
      }
      
      // Check for single quotes (should be double quotes in JSON)
      if (line.includes("'") && !line.trim().startsWith('//')) {
        suggestions.push({
          line: lineNumber,
          column: line.indexOf("'") + 1,
          message: 'JSON requires double quotes, not single quotes',
          severity: 'suggestion'
        });
      }
    });
    
    return createValidationResult(true, [], [], suggestions);
  } catch (error) {
    // Try to extract line/column info from error
    const match = error.message.match(/at position (\d+)/);
    let line = 1, column = 1;
    
    if (match) {
      const position = parseInt(match[1]);
      const beforeError = code.substring(0, position);
      line = (beforeError.match(/\n/g) || []).length + 1;
      column = position - beforeError.lastIndexOf('\n');
    }
    
    return createValidationResult(false, [{
      line,
      column,
      message: error.message,
      severity: 'error'
    }]);
  }
};

// YAML validation
export const validateYAML = (code) => {
  try {
    if (!code.trim()) {
      return createValidationResult(false, [{
        line: 1,
        column: 1,
        message: 'YAML cannot be empty',
        severity: 'error'
      }]);
    }
    
    yaml.load(code);
    
    const warnings = [];
    const suggestions = [];
    
    // Check for common YAML issues
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for tabs (YAML should use spaces)
      if (line.includes('\t')) {
        warnings.push({
          line: lineNumber,
          column: line.indexOf('\t') + 1,
          message: 'YAML should use spaces for indentation, not tabs',
          severity: 'warning'
        });
      }
      
      // Check for inconsistent indentation
      if (line.trim() && line.startsWith(' ')) {
        const spaces = line.match(/^ */)[0].length;
        if (spaces % 2 !== 0) {
          suggestions.push({
            line: lineNumber,
            column: 1,
            message: 'Consider using consistent 2-space indentation',
            severity: 'suggestion'
          });
        }
      }
    });
    
    return createValidationResult(true, [], warnings, suggestions);
  } catch (error) {
    let line = 1, column = 1;
    
    // Extract line info from YAML error
    if (error.mark) {
      line = error.mark.line + 1;
      column = error.mark.column + 1;
    }
    
    return createValidationResult(false, [{
      line,
      column,
      message: error.message,
      severity: 'error'
    }]);
  }
};

// HTML validation (basic)
export const validateHTML = (code) => {
  try {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    
    if (!code.trim()) {
      warnings.push({
        line: 1,
        column: 1,
        message: 'HTML file is empty',
        severity: 'warning'
      });
      return createValidationResult(true, [], warnings);
    }
    
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');
    
    // Check for parser errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      errors.push({
        line: 1,
        column: 1,
        message: 'HTML parsing error: ' + parserError.textContent,
        severity: 'error'
      });
      return createValidationResult(false, errors);
    }
    
    const lines = code.split('\n');
    const tagStack = [];
    const selfClosingTags = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Basic DOCTYPE check
      if (index === 0 && !line.trim().toLowerCase().startsWith('<!doctype')) {
        suggestions.push({
          line: lineNumber,
          column: 1,
          message: 'Consider adding DOCTYPE declaration',
          severity: 'suggestion'
        });
      }
      
      // Check for unclosed tags (basic implementation)
      const openTags = line.match(/<(\w+)(?:\s[^>]*)?>(?!\s*<\/\1>)/g) || [];
      const closeTags = line.match(/<\/(\w+)>/g) || [];
      
      openTags.forEach(tag => {
        const tagName = tag.match(/<(\w+)/)[1].toLowerCase();
        if (!selfClosingTags.has(tagName)) {
          tagStack.push({ tag: tagName, line: lineNumber });
        }
      });
      
      closeTags.forEach(tag => {
        const tagName = tag.match(/<\/(\w+)>/)[1].toLowerCase();
        const lastOpen = tagStack.pop();
        if (!lastOpen || lastOpen.tag !== tagName) {
          warnings.push({
            line: lineNumber,
            column: line.indexOf(tag) + 1,
            message: `Mismatched closing tag: ${tag}`,
            severity: 'warning'
          });
        }
      });
      
      // Check for inline styles
      if (line.includes('style=')) {
        suggestions.push({
          line: lineNumber,
          column: line.indexOf('style=') + 1,
          message: 'Consider using CSS classes instead of inline styles',
          severity: 'suggestion'
        });
      }
    });
    
    // Check for unclosed tags
    tagStack.forEach(({ tag, line }) => {
      warnings.push({
        line,
        column: 1,
        message: `Unclosed tag: <${tag}>`,
        severity: 'warning'
      });
    });
    
    return createValidationResult(errors.length === 0, errors, warnings, suggestions);
  } catch (error) {
    return createValidationResult(false, [{
      line: 1,
      column: 1,
      message: `HTML validation error: ${error.message}`,
      severity: 'error'
    }]);
  }
};

// CSS validation (basic)
export const validateCSS = (code) => {
  try {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    
    if (!code.trim()) {
      warnings.push({
        line: 1,
        column: 1,
        message: 'CSS file is empty',
        severity: 'warning'
      });
      return createValidationResult(true, [], warnings);
    }
    
    const lines = code.split('\n');
    let inRule = false;
    let braceCount = 0;
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmed = line.trim();
      
      // Count braces
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      braceCount += openBraces - closeBraces;
      
      // Check for basic syntax errors
      if (trimmed && !trimmed.startsWith('/*') && !trimmed.endsWith('*/')) {
        // Check for missing semicolons in property declarations
        if (inRule && trimmed.includes(':') && !trimmed.endsWith(';') && !trimmed.endsWith('{')) {
          warnings.push({
            line: lineNumber,
            column: line.length,
            message: 'Missing semicolon at end of declaration',
            severity: 'warning'
          });
        }
        
        // Check for duplicate properties (basic check)
        const propertyMatch = trimmed.match(/^([a-z-]+):\s*/);
        if (propertyMatch) {
          const property = propertyMatch[1];
          const restOfCode = lines.slice(index + 1).join('\n');
          const duplicateRegex = new RegExp(`^\\s*${property}\\s*:`, 'm');
          if (duplicateRegex.test(restOfCode)) {
            suggestions.push({
              line: lineNumber,
              column: 1,
              message: `Possible duplicate property: ${property}`,
              severity: 'suggestion'
            });
          }
        }
      }
      
      if (openBraces > 0) inRule = true;
      if (closeBraces > 0 && braceCount === 0) inRule = false;
    });
    
    // Check for unmatched braces
    if (braceCount !== 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: braceCount > 0 ? 'Unclosed brace' : 'Extra closing brace',
        severity: 'error'
      });
    }
    
    return createValidationResult(errors.length === 0, errors, warnings, suggestions);
  } catch (error) {
    return createValidationResult(false, [{
      line: 1,
      column: 1,
      message: `CSS validation error: ${error.message}`,
      severity: 'error'
    }]);
  }
};

// Python validation (basic syntax check)
export const validatePython = (code) => {
  try {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    
    if (!code.trim()) {
      warnings.push({
        line: 1,
        column: 1,
        message: 'Python file is empty',
        severity: 'warning'
      });
      return createValidationResult(true, [], warnings);
    }
    
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentStack = [0];
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) return;
      
      // Check indentation
      const currentIndent = line.match(/^[ \t]*/)[0].length;
      
      // Check for mixed tabs and spaces
      if (line.match(/^[ \t]*/) && line.includes('\t') && line.includes(' ')) {
        warnings.push({
          line: lineNumber,
          column: 1,
          message: 'Mixed tabs and spaces in indentation',
          severity: 'warning'
        });
      }
      
      // Check for common syntax patterns
      if (trimmed.endsWith(':')) {
        indentStack.push(currentIndent);
      } else if (currentIndent < indentStack[indentStack.length - 1]) {
        while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
          indentStack.pop();
        }
      }
      
      // Check for common issues
      if (trimmed.includes('print ') && !trimmed.startsWith('#')) {
        suggestions.push({
          line: lineNumber,
          column: line.indexOf('print ') + 1,
          message: 'Use print() function instead of print statement (Python 3)',
          severity: 'suggestion'
        });
      }
      
      // Check for missing imports
      if (trimmed.includes('json.') && !code.includes('import json')) {
        suggestions.push({
          line: lineNumber,
          column: 1,
          message: 'Consider adding "import json" at the top',
          severity: 'suggestion'
        });
      }
    });
    
    return createValidationResult(errors.length === 0, errors, warnings, suggestions);
  } catch (error) {
    return createValidationResult(false, [{
      line: 1,
      column: 1,
      message: `Python validation error: ${error.message}`,
      severity: 'error'
    }]);
  }
};

// SQL validation (basic)
export const validateSQL = (code) => {
  try {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    
    if (!code.trim()) {
      warnings.push({
        line: 1,
        column: 1,
        message: 'SQL file is empty',
        severity: 'warning'
      });
      return createValidationResult(true, [], warnings);
    }
    
    const lines = code.split('\n');
    const sqlKeywords = new Set([
      'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
      'ALTER', 'TABLE', 'INDEX', 'VIEW', 'DATABASE', 'SCHEMA', 'GRANT', 'REVOKE'
    ]);
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmed = line.trim().toUpperCase();
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('--') || trimmed.startsWith('/*')) return;
      
      // Check for missing semicolons at end of statements
      if (sqlKeywords.has(trimmed.split(' ')[0]) && !line.trim().endsWith(';') && 
          index === lines.length - 1) {
        warnings.push({
          line: lineNumber,
          column: line.length,
          message: 'Consider adding semicolon at end of SQL statement',
          severity: 'warning'
        });
      }
      
      // Check for SELECT without FROM (except for certain cases)
      if (trimmed.startsWith('SELECT') && !trimmed.includes('FROM') && 
          !trimmed.includes('@@') && !trimmed.includes('DUAL')) {
        suggestions.push({
          line: lineNumber,
          column: 1,
          message: 'SELECT statement might be missing FROM clause',
          severity: 'suggestion'
        });
      }
    });
    
    return createValidationResult(errors.length === 0, errors, warnings, suggestions);
  } catch (error) {
    return createValidationResult(false, [{
      line: 1,
      column: 1,
      message: `SQL validation error: ${error.message}`,
      severity: 'error'
    }]);
  }
};

// Main validation function that routes to specific validators
export const validateCode = (code, language) => {
  if (!code) {
    return createValidationResult(true, [], [{
      line: 1,
      column: 1,
      message: 'File is empty',
      severity: 'warning'
    }]);
  }
  
  switch (language?.toLowerCase()) {
    case 'javascript':
    case 'js':
    case 'jsx':
      return validateJavaScript(code);
    
    case 'typescript':
    case 'ts':
    case 'tsx':
      return validateJavaScript(code); // Use same validator for now
    
    case 'json':
      return validateJSON(code);
    
    case 'yaml':
    case 'yml':
      return validateYAML(code);
    
    case 'html':
      return validateHTML(code);
    
    case 'css':
      return validateCSS(code);
    
    case 'python':
    case 'py':
      return validatePython(code);
    
    case 'sql':
      return validateSQL(code);
    
    default:
      // For unsupported languages, just check if file is empty
      return createValidationResult(true, [], code.trim() ? [] : [{
        line: 1,
        column: 1,
        message: 'File is empty',
        severity: 'warning'
      }]);
  }
};

// Format validation errors for display
export const formatValidationMessage = (diagnostic) => {
  const { line, column, message, severity } = diagnostic;
  const location = line && column ? ` (Line ${line}, Column ${column})` : '';
  return `${severity.toUpperCase()}: ${message}${location}`;
};

// Get validation summary
export const getValidationSummary = (result) => {
  if (!result) return 'No validation performed';
  
  const { valid, errors, warnings, suggestions } = result;
  
  if (valid && errors.length === 0 && warnings.length === 0) {
    return 'No issues found';
  }
  
  const parts = [];
  if (errors.length > 0) parts.push(`${errors.length} error${errors.length > 1 ? 's' : ''}`);
  if (warnings.length > 0) parts.push(`${warnings.length} warning${warnings.length > 1 ? 's' : ''}`);
  if (suggestions.length > 0) parts.push(`${suggestions.length} suggestion${suggestions.length > 1 ? 's' : ''}`);
  
  return parts.join(', ');
};