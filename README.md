# Code File Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

> A production-ready web application for creating, validating, formatting, and downloading code files with support for 20+ programming languages.

## 🚀 Features

- ✨ **Multi-language Support**: JavaScript, TypeScript, Python, Java, C++, HTML, CSS, JSON, YAML, Markdown, SQL, Shell, and more
- 🎨 **Monaco Editor**: VSCode-like editing experience with syntax highlighting and IntelliSense
- 📁 **Multi-file Projects**: Create and manage multiple files, download as ZIP
- 🔍 **Real-time Validation**: Client-side and server-side code validation with detailed diagnostics
- 🎯 **Code Formatting**: Prettier integration for JavaScript, HTML, CSS, JSON, YAML, and Markdown
- 📋 **20+ Templates**: Pre-built templates for common patterns and frameworks
- 👁️ **Live Preview**: Real-time preview for HTML, Markdown, and JSON files
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔒 **Security First**: Rate limiting, input validation, and secure file handling
- 💾 **Local History**: Automatic saving of recent files in localStorage
- ⬇️ **Easy Downloads**: One-click file and ZIP downloads with proper MIME types

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/code-file-generator.git
cd code-file-generator

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🛠️ Installation

### Local Development

1. **Clone and Install**
   ```bash
   git clone https://github.com/your-username/code-file-generator.git
   cd code-file-generator
   npm run install:all
   ```

2. **Environment Setup**
   ```bash
   # Frontend environment (optional)
   cp frontend/.env.example frontend/.env
   
   # Backend environment (optional)
   cp backend/.env.example backend/.env
   ```

3. **Start Development**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:frontend  # Port 3000
   npm run dev:backend   # Port 3001
   ```

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

## 🎯 Usage

### Basic Workflow

1. **Select Language**: Choose from 20+ supported programming languages
2. **Choose Template**: Pick from pre-built templates or start from scratch
3. **Write Code**: Use the Monaco editor with syntax highlighting and validation
4. **Validate & Format**: Real-time validation with formatting options
5. **Preview**: See live previews for HTML, Markdown, and JSON
6. **Download**: Save individual files or entire projects as ZIP

### Supported Languages

| Language | Extensions | Templates | Validation | Formatting |
|----------|------------|-----------|------------|------------|
| JavaScript | .js, .jsx | ✅ | ✅ | ✅ |
| TypeScript | .ts, .tsx | ✅ | ✅ | ✅ |
| Python | .py | ✅ | ✅ | ⚠️ |
| Java | .java | ✅ | ⚠️ | ⚠️ |
| C++ | .cpp, .cc | ✅ | ⚠️ | ⚠️ |
| HTML | .html | ✅ | ✅ | ✅ |
| CSS | .css | ✅ | ✅ | ✅ |
| JSON | .json | ✅ | ✅ | ✅ |
| YAML | .yml, .yaml | ✅ | ✅ | ✅ |
| Markdown | .md | ✅ | ⚠️ | ✅ |
| SQL | .sql | ✅ | ✅ | ⚠️ |
| Shell | .sh, .bash | ✅ | ⚠️ | ⚠️ |

✅ Full support | ⚠️ Basic support | ❌ Not supported

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Download current file
- `Ctrl/Cmd + Enter`: Validate code
- `Ctrl/Cmd + Shift + F`: Format code
- `Ctrl/Cmd + D`: Duplicate line
- `Ctrl/Cmd + /`: Toggle comment

### Templates Available

#### JavaScript
- Hello World
- Express Server
- React Component
- Node.js CLI Tool
- API Client

#### Python
- Hello World
- Flask API
- Data Analysis
- CLI Script
- Django Model

#### Java
- Hello World
- Spring Boot Application
- REST Controller
- JUnit Test

#### HTML/CSS
- Basic HTML Page
- Responsive Layout
- Modern CSS Framework
- CSS Grid Example

#### Configuration
- Docker Compose
- GitHub Actions
- Package.json
- Nginx Config

## 📚 API Reference

### Base URL
```
http://localhost:3001/api
```

### Authentication
No authentication required for the demo version.

### Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### Format Code
```http
POST /api/format
Content-Type: application/json

{
  "language": "javascript",
  "code": "function test(){return 'hello';}",
  "options": {
    "tabWidth": 2,
    "semi": true
  }
}
```

**Response:**
```json
{
  "formatted": "function test() {\n  return 'hello';\n}",
  "errors": [],
  "warnings": [],
  "language": "javascript",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Validate Code
```http
POST /api/validate
Content-Type: application/json

{
  "language": "javascript",
  "code": "console.log('Hello, World!');"
}
```

**Response:**
```json
{
  "ok": true,
  "diagnostics": [],
  "language": "javascript",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Create ZIP
```http
POST /api/zip
Content-Type: application/json

{
  "files": [
    {
      "path": "index.js",
      "content": "console.log('Hello');"
    },
    {
      "path": "package.json",
      "content": "{\"name\": \"my-project\"}"
    }
  ],
  "filename": "project.zip"
}
```

**Response:**
Binary ZIP file with appropriate headers.

#### Lint Code
```http
POST /api/lint
Content-Type: application/json

{
  "language": "javascript",
  "code": "var unused = 1; console.log('test');"
}
```

**Response:**
```json
{
  "results": [
    {
      "line": 1,
      "column": 5,
      "message": "'unused' is defined but never used",
      "severity": "warning",
      "rule": "no-unused-vars"
    }
  ],
  "language": "javascript",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Get Languages
```http
GET /api/languages
```

**Response:**
```json
{
  "languages": [
    {
      "id": "javascript",
      "name": "JavaScript",
      "extensions": [".js", ".jsx"]
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Common HTTP status codes:
- `400`: Bad Request - Invalid input
- `413`: Payload Too Large - File size exceeds limit
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error

## 🏗️ Architecture

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/          # React components
│   ├── utils/              # Utility functions
│   │   ├── fileUtils.js    # File operations
│   │   └── validationUtils.js # Validation logic
│   ├── templates/          # Code templates
│   ├── hooks/              # Custom React hooks
│   └── App.jsx            # Main application
├── public/                 # Static assets
└── dist/                  # Built application
```

**Key Technologies:**
- React 18 with Hooks
- Monaco Editor (VSCode editor)
- Tailwind CSS for styling
- Vite for build tooling
- JSZip for client-side ZIP creation

### Backend Architecture

```
backend/
├── server.js              # Express server
├── routes/                # API route handlers
├── middleware/            # Custom middleware
├── utils/                 # Utility functions
└── tests/                # Unit tests
```

**Key Technologies:**
- Node.js with Express
- Prettier for code formatting
- ESLint for JavaScript linting
- Archiver for ZIP creation
- Helmet for security headers

### Data Flow

1. **Client-side Validation**: Immediate feedback using Acorn, JSON.parse, etc.
2. **Server-side Processing**: Heavy operations like formatting and linting
3. **File Generation**: Client-side using Blob API and URL.createObjectURL
4. **ZIP Creation**: Client-side for small projects, server-side for large ones

## 🔧 Development

### Project Structure

```
code-file-generator/
├── frontend/              # React frontend
├── backend/               # Node.js backend
├── tests/                 # E2E tests
├── ci/                    # CI/CD configuration
├── docker-compose.yml     # Docker setup
└── package.json          # Root package file
```

### Development Scripts

```bash
# Install dependencies for all packages
npm run install:all

# Start development servers
npm run dev                # Both frontend and backend
npm run dev:frontend       # Frontend only (port 3000)
npm run dev:backend        # Backend only (port 3001)

# Build for production
npm run build              # Build frontend
npm run build:docker       # Build Docker images

# Testing
npm test                   # All tests
npm run test:frontend      # Frontend tests
npm run test:backend       # Backend tests
npm run test:e2e           # End-to-end tests

# Linting and formatting
npm run lint               # Lint all code
npm run lint:fix           # Fix linting issues
npm run format             # Format code with Prettier
```

### Adding New Languages

1. **Update Templates**:
   ```javascript
   // frontend/src/templates/index.js
   export const templates = {
     newlang: {
       name: 'New Language',
       extension: 'newext',
       language: 'newlang',
       templates: {
         'Hello World': {
           filename: 'hello.newext',
           content: 'print("Hello, World!")'
         }
       }
     }
   };
   ```

2. **Add Validation**:
   ```javascript
   // frontend/src/utils/validationUtils.js
   case 'newlang':
     // Add validation logic
     break;
   ```

3. **Update Backend**:
   ```javascript
   // backend/server.js
   case 'newlang':
     // Add server-side processing
     break;
   ```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_ANALYTICS=false
```

#### Backend (.env)
```env
PORT=3001
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE_MB=5
```

## 🧪 Testing

### Unit Tests

```bash
# Backend unit tests
cd backend
npm test

# Frontend unit tests (if implemented)
cd frontend
npm test
```

### End-to-End Tests

```bash
# Install Playwright browsers
cd tests
npm run install

# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

### Test Coverage

The test suite covers:
- ✅ API endpoint functionality
- ✅ Code validation for multiple languages
- ✅ File upload and download
- ✅ ZIP creation and extraction
- ✅ Error handling and edge cases
- ✅ Security measures
- ✅ UI interactions and workflows

### Acceptance Criteria Tests

All acceptance criteria from the specification are covered:

1. ✅ Create and download syntax-correct JavaScript file
2. ✅ Create multi-file project and download as ZIP
3. ✅ JSON validation with clear diagnostics
4. ✅ Server-side formatting within time limits
5. ✅ Responsive design on mobile viewports
6. ✅ Complete documentation and setup instructions

## 🚀 Deployment

### Production Build

```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build images
docker-compose build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-specific Deployments

#### Staging
```bash
# Deploy to staging
./deploy.sh staging main

# Health check
curl -f https://staging.yourapp.com/health
```

#### Production
```bash
# Deploy to production
./deploy.sh production main

# Health check
curl -f https://yourapp.com/health
```

### Deployment Platforms

#### Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Heroku (Backend)
```bash
# Create Heroku app
heroku create your-app-name

# Deploy
git subtree push --prefix backend heroku main
```

#### DigitalOcean App Platform
1. Connect your GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set run command: `cd backend && npm start`
4. Configure environment variables

#### Docker on VPS
```bash
# Copy files to server
scp -r . user@server:/app

# SSH to server
ssh user@server

# Build and run
cd /app
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm run install:all
      
      - name: Run tests
        run: npm test
      
      - name: Run E2E tests
        run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: echo "Deploy to production"
```

## 🔒 Security

### Security Measures Implemented

1. **Input Validation**
   - File size limits (5MB default)
   - Path traversal prevention
   - Content type validation
   - Filename sanitization

2. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Configurable limits per endpoint
   - DDoS protection

3. **Security Headers**
   - Content Security Policy (CSP)
   - X-Content-Type-Options
   - X-Frame-Options
   - CORS restrictions

4. **Code Execution Prevention**
   - No server-side code execution
   - Sandboxed previews
   - Static analysis only

5. **Data Privacy**
   - No persistent storage of user code
   - Client-side processing where possible
   - Automatic cleanup of temporary files

### Security Best Practices

- Keep dependencies updated
- Use HTTPS in production
- Implement proper logging and monitoring
- Regular security audits
- Input sanitization at all layers

### Known Limitations

- Client-side validation can be bypassed
- Large file processing may cause memory issues
- Some language validators are basic
- No user authentication (by design)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

We use ESLint and Prettier for consistent code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Pull Request Guidelines

- Include tests for new features
- Update documentation as needed
- Follow existing code style
- Write clear commit messages
- Keep PRs focused and small

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VSCode editor for the web
- [Prettier](https://prettier.io/) - Code formatting
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - UI library
- [Express](https://expressjs.com/) - Web framework
- [Playwright](https://playwright.dev/) - E2E testing

## 📞 Support

- 📧 Email: support@yourapp.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/code-file-generator/issues)
- 📖 Documentation: [Wiki](https://github.com/your-username/code-file-generator/wiki)

---

<div align="center">
  <p>Made with ❤️ for developers who love clean code</p>
  <p>
    <a href="#top">Back to Top</a> •
    <a href="https://github.com/your-username/code-file-generator">GitHub</a> •
    <a href="https://yourapp.com">Live Demo</a>
  </p>
</div>
