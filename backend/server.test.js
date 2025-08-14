import { jest } from '@jest/globals';
import request from 'supertest';
import app from './server.js';

describe('Code Generator API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/languages', () => {
    it('should return supported languages', async () => {
      const response = await request(app)
        .get('/api/languages')
        .expect(200);
      
      expect(response.body).toHaveProperty('languages');
      expect(Array.isArray(response.body.languages)).toBe(true);
      expect(response.body.languages.length).toBeGreaterThan(0);
      
      // Check structure of language objects
      const language = response.body.languages[0];
      expect(language).toHaveProperty('id');
      expect(language).toHaveProperty('name');
      expect(language).toHaveProperty('extensions');
    });
  });

  describe('POST /api/validate', () => {
    it('should validate valid JavaScript code', async () => {
      const response = await request(app)
        .post('/api/validate')
        .send({
          language: 'javascript',
          code: 'console.log("Hello, World!");'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('diagnostics');
      expect(Array.isArray(response.body.diagnostics)).toBe(true);
    });

    it('should detect JavaScript syntax errors', async () => {
      const response = await request(app)
        .post('/api/validate')
        .send({
          language: 'javascript',
          code: 'invalid syntax {{{'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.diagnostics.length).toBeGreaterThan(0);
      expect(response.body.diagnostics[0]).toHaveProperty('severity', 'error');
    });

    it('should validate valid JSON', async () => {
      const response = await request(app)
        .post('/api/validate')
        .send({
          language: 'json',
          code: '{"name": "test", "value": 123}'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('ok', true);
    });

    it('should detect JSON syntax errors', async () => {
      const response = await request(app)
        .post('/api/validate')
        .send({
          language: 'json',
          code: '{"name": "test", "value": 123'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.diagnostics.length).toBeGreaterThan(0);
    });

    it('should validate YAML', async () => {
      const response = await request(app)
        .post('/api/validate')
        .send({
          language: 'yaml',
          code: 'name: test\nvalue: 123'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('ok', true);
    });

    it('should require code parameter', async () => {
      const response = await request(app)
        .post('/api/validate')
        .send({
          language: 'javascript'
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Invalid input');
    });

    it('should reject files that are too large', async () => {
      const largeCode = 'a'.repeat(6 * 1024 * 1024); // 6MB
      
      const response = await request(app)
        .post('/api/validate')
        .send({
          language: 'javascript',
          code: largeCode
        })
        .expect(413);
      
      expect(response.body).toHaveProperty('error', 'File too large');
    });
  });

  describe('POST /api/format', () => {
    it('should format JavaScript code', async () => {
      const unformattedCode = 'function test(){return "hello";}';
      
      const response = await request(app)
        .post('/api/format')
        .send({
          language: 'javascript',
          code: unformattedCode
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('formatted');
      expect(response.body.formatted).not.toBe(unformattedCode);
      expect(response.body.formatted).toContain('\n'); // Should have formatting
    });

    it('should format JSON code', async () => {
      const unformattedJson = '{"name":"test","value":123}';
      
      const response = await request(app)
        .post('/api/format')
        .send({
          language: 'json',
          code: unformattedJson
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('formatted');
      expect(response.body.formatted).toContain('{\n  "name"');
    });

    it('should format HTML code', async () => {
      const unformattedHtml = '<div><p>Hello</p></div>';
      
      const response = await request(app)
        .post('/api/format')
        .send({
          language: 'html',
          code: unformattedHtml
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('formatted');
      expect(response.body.formatted).not.toBe(unformattedHtml);
    });

    it('should handle formatting errors gracefully', async () => {
      const response = await request(app)
        .post('/api/format')
        .send({
          language: 'json',
          code: '{"invalid": json}'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should warn about unsupported languages', async () => {
      const response = await request(app)
        .post('/api/format')
        .send({
          language: 'unsupported',
          code: 'some code'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('warnings');
      expect(response.body.warnings.length).toBeGreaterThan(0);
    });

    it('should require code parameter', async () => {
      const response = await request(app)
        .post('/api/format')
        .send({
          language: 'javascript'
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Invalid input');
    });
  });

  describe('POST /api/lint', () => {
    it('should lint JavaScript code', async () => {
      const response = await request(app)
        .post('/api/lint')
        .send({
          language: 'javascript',
          code: 'var unused = 1; console.log("test");'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('should handle unsupported languages', async () => {
      const response = await request(app)
        .post('/api/lint')
        .send({
          language: 'python',
          code: 'print("hello")'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('results');
      expect(response.body.results[0]).toHaveProperty('severity', 'info');
    });

    it('should require code parameter', async () => {
      const response = await request(app)
        .post('/api/lint')
        .send({
          language: 'javascript'
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Invalid input');
    });
  });

  describe('POST /api/zip', () => {
    it('should create ZIP from files', async () => {
      const files = [
        { path: 'index.js', content: 'console.log("Hello");' },
        { path: 'package.json', content: '{"name": "test"}' }
      ];
      
      const response = await request(app)
        .post('/api/zip')
        .send({ files })
        .expect(200);
      
      expect(response.headers['content-type']).toBe('application/zip');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    it('should validate file paths', async () => {
      const files = [
        { path: '../../../etc/passwd', content: 'malicious' }
      ];
      
      const response = await request(app)
        .post('/api/zip')
        .send({ files })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Invalid file path');
    });

    it('should reject duplicate file paths', async () => {
      const files = [
        { path: 'test.js', content: 'content1' },
        { path: 'test.js', content: 'content2' }
      ];
      
      const response = await request(app)
        .post('/api/zip')
        .send({ files })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Duplicate file path');
    });

    it('should reject too many files', async () => {
      const files = Array.from({ length: 101 }, (_, i) => ({
        path: `file${i}.txt`,
        content: 'content'
      }));
      
      const response = await request(app)
        .post('/api/zip')
        .send({ files })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Too many files');
    });

    it('should require files parameter', async () => {
      const response = await request(app)
        .post('/api/zip')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Invalid input');
    });

    it('should reject empty files array', async () => {
      const response = await request(app)
        .post('/api/zip')
        .send({ files: [] })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Invalid input');
    });
  });

  describe('Rate limiting', () => {
    it('should apply rate limiting to API endpoints', async () => {
      // Make many requests quickly
      const promises = Array.from({ length: 10 }, () =>
        request(app)
          .get('/api/languages')
      );
      
      const responses = await Promise.all(promises);
      
      // All should succeed since we're under the limit
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Not found');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/validate')
        .set('Content-Type', 'application/json')
        .send('{"malformed": json}')
        .expect(400);
    });
  });

  describe('Security headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});