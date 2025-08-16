export const templates = {
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    language: 'javascript',
    templates: {
      'Hello World': {
        filename: 'hello.js',
        content: `console.log('Hello, World!');

// Example function
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Usage
const message = greet('Developer');
console.log(message);`
      },
      'Express Server': {
        filename: 'server.js',
        content: `const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});`
      },
      'React Component': {
        filename: 'Component.jsx',
        content: `import React, { useState, useEffect } from 'react';

const MyComponent = ({ title = 'Default Title' }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  const handleClick = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCount(prev => prev + 1);
    setLoading(false);
  };

  return (
    <div className="component">
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Increment'}
      </button>
    </div>
  );
};

export default MyComponent;`
      }
    }
  },
  
  python: {
    name: 'Python',
    extension: 'py',
    language: 'python',
    templates: {
      'Hello World': {
        filename: 'hello.py',
        content: `#!/usr/bin/env python3
"""
Simple Hello World program in Python
"""

def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}!"

def main():
    """Main function."""
    print("Hello, World!")
    
    # Example usage
    name = input("Enter your name: ")
    message = greet(name)
    print(message)

if __name__ == "__main__":
    main()`
      },
      'Flask API': {
        filename: 'app.py',
        content: `#!/usr/bin/env python3
"""
Simple Flask API server
"""

from flask import Flask, jsonify, request
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Sample data
users = [
    {"id": 1, "name": "John Doe", "email": "john@example.com"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
]

@app.route('/')
def hello():
    """Root endpoint."""
    return jsonify({
        "message": "Hello, World!",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users."""
    return jsonify(users)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID."""
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user."""
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400
    
    new_user = {
        "id": max(u['id'] for u in users) + 1,
        "name": data['name'],
        "email": data.get('email', '')
    }
    users.append(new_user)
    return jsonify(new_user), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)`
      },
      'Data Analysis': {
        filename: 'analysis.py',
        content: `#!/usr/bin/env python3
"""
Data analysis example with pandas and matplotlib
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

def generate_sample_data():
    """Generate sample dataset."""
    dates = pd.date_range(
        start=datetime.now() - timedelta(days=30),
        end=datetime.now(),
        freq='D'
    )
    
    data = {
        'date': dates,
        'sales': np.random.normal(1000, 200, len(dates)),
        'customers': np.random.poisson(50, len(dates)),
        'category': np.random.choice(['A', 'B', 'C'], len(dates))
    }
    
    return pd.DataFrame(data)

def analyze_data(df):
    """Perform basic data analysis."""
    print("Dataset Info:")
    print(f"Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    print("\nSummary Statistics:")
    print(df.describe())
    
    print("\nSales by Category:")
    category_sales = df.groupby('category')['sales'].agg(['mean', 'sum', 'count'])
    print(category_sales)
    
    return category_sales

def create_visualizations(df):
    """Create data visualizations."""
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # Sales over time
    axes[0, 0].plot(df['date'], df['sales'])
    axes[0, 0].set_title('Sales Over Time')
    axes[0, 0].set_xlabel('Date')
    axes[0, 0].set_ylabel('Sales')
    
    # Sales distribution
    axes[0, 1].hist(df['sales'], bins=20, alpha=0.7)
    axes[0, 1].set_title('Sales Distribution')
    axes[0, 1].set_xlabel('Sales')
    axes[0, 1].set_ylabel('Frequency')
    
    # Sales by category
    category_sales = df.groupby('category')['sales'].sum()
    axes[1, 0].bar(category_sales.index, category_sales.values)
    axes[1, 0].set_title('Total Sales by Category')
    axes[1, 0].set_xlabel('Category')
    axes[1, 0].set_ylabel('Total Sales')
    
    # Scatter plot
    axes[1, 1].scatter(df['customers'], df['sales'], alpha=0.6)
    axes[1, 1].set_title('Sales vs Customers')
    axes[1, 1].set_xlabel('Customers')
    axes[1, 1].set_ylabel('Sales')
    
    plt.tight_layout()
    plt.savefig('analysis_results.png', dpi=300, bbox_inches='tight')
    plt.show()

def main():
    """Main analysis function."""
    # Generate and analyze data
    df = generate_sample_data()
    stats = analyze_data(df)
    create_visualizations(df)
    
    print("\nAnalysis complete! Check 'analysis_results.png' for visualizations.")

if __name__ == "__main__":
    main()`
      }
    }
  },

  java: {
    name: 'Java',
    extension: 'java',
    language: 'java',
    templates: {
      'Hello World': {
        filename: 'HelloWorld.java',
        content: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Example with user input
        if (args.length > 0) {
            String name = args[0];
            System.out.println("Hello, " + name + "!");
        }
        
        // Example method call
        greetUser("Developer");
    }
    
    public static void greetUser(String name) {
        String greeting = String.format("Welcome, %s!", name);
        System.out.println(greeting);
    }
}`
      },
      'Spring Boot Application': {
        filename: 'Application.java',
        content: `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.*;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@RestController
@RequestMapping("/api")
class ApiController {
    
    private List<User> users = new ArrayList<>(Arrays.asList(
        new User(1L, "John Doe", "john@example.com"),
        new User(2L, "Jane Smith", "jane@example.com")
    ));
    
    @GetMapping("/")
    public Map<String, Object> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello, World!");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
    
    @GetMapping("/users")
    public List<User> getUsers() {
        return users;
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        Optional<User> user = users.stream()
            .filter(u -> u.getId().equals(id))
            .findFirst();
        
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        Long newId = users.stream()
            .mapToLong(User::getId)
            .max()
            .orElse(0L) + 1;
        
        user.setId(newId);
        users.add(user);
        return user;
    }
}

class User {
    private Long id;
    private String name;
    private String email;
    
    public User() {}
    
    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}`
      }
    }
  },

  cpp: {
    name: 'C++',
    extension: 'cpp',
    language: 'cpp',
    templates: {
      'Hello World': {
        filename: 'hello.cpp',
        content: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

void greet(const string& name) {
    cout << "Hello, " << name << "!" << endl;
}

int main() {
    cout << "Hello, World!" << endl;
    
    // Example with user input
    string name;
    cout << "Enter your name: ";
    getline(cin, name);
    
    if (!name.empty()) {
        greet(name);
    }
    
    // Example with vector
    vector<string> languages = {"C++", "Python", "JavaScript", "Java"};
    
    cout << "Supported languages:" << endl;
    for (const auto& lang : languages) {
        cout << "- " << lang << endl;
    }
    
    return 0;
}`
      },
      'Class Example': {
        filename: 'Calculator.cpp',
        content: `#include <iostream>
#include <stdexcept>
#include <cmath>

class Calculator {
private:
    double lastResult;
    
public:
    Calculator() : lastResult(0.0) {}
    
    double add(double a, double b) {
        lastResult = a + b;
        return lastResult;
    }
    
    double subtract(double a, double b) {
        lastResult = a - b;
        return lastResult;
    }
    
    double multiply(double a, double b) {
        lastResult = a * b;
        return lastResult;
    }
    
    double divide(double a, double b) {
        if (b == 0) {
            throw std::invalid_argument("Division by zero");
        }
        lastResult = a / b;
        return lastResult;
    }
    
    double power(double base, double exponent) {
        lastResult = std::pow(base, exponent);
        return lastResult;
    }
    
    double getLastResult() const {
        return lastResult;
    }
    
    void reset() {
        lastResult = 0.0;
    }
};

int main() {
    Calculator calc;
    
    try {
        std::cout << "Calculator Demo" << std::endl;
        std::cout << "===============" << std::endl;
        
        double result = calc.add(10, 5);
        std::cout << "10 + 5 = " << result << std::endl;
        
        result = calc.multiply(result, 2);
        std::cout << "Result * 2 = " << result << std::endl;
        
        result = calc.divide(result, 3);
        std::cout << "Result / 3 = " << result << std::endl;
        
        result = calc.power(2, 8);
        std::cout << "2^8 = " << result << std::endl;
        
        std::cout << "Last result: " << calc.getLastResult() << std::endl;
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}`
      }
    }
  },

  html: {
    name: 'HTML',
    extension: 'html',
    language: 'html',
    templates: {
      'Basic HTML': {
        filename: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .btn {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 5px;
        }
        .btn:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to My Website</h1>
        <p>This is a simple HTML page with some basic styling.</p>
        
        <h2>Features</h2>
        <ul>
            <li>Responsive design</li>
            <li>Clean layout</li>
            <li>Modern styling</li>
        </ul>
        
        <h2>Contact Form</h2>
        <form>
            <p>
                <label for="name">Name:</label><br>
                <input type="text" id="name" name="name" required style="width: 100%; padding: 8px;">
            </p>
            <p>
                <label for="email">Email:</label><br>
                <input type="email" id="email" name="email" required style="width: 100%; padding: 8px;">
            </p>
            <p>
                <label for="message">Message:</label><br>
                <textarea id="message" name="message" rows="4" style="width: 100%; padding: 8px;"></textarea>
            </p>
            <p>
                <button type="submit" class="btn">Send Message</button>
            </p>
        </form>
        
        <footer style="text-align: center; margin-top: 40px; color: #666;">
            <p>&copy; 2024 My Website. All rights reserved.</p>
        </footer>
    </div>
    
    <script>
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted! (This is just a demo)');
        });
    </script>
</body>
</html>`
      }
    }
  },

  css: {
    name: 'CSS',
    extension: 'css',
    language: 'css',
    templates: {
      'Modern CSS': {
        filename: 'styles.css',
        content: `/* Modern CSS Reset and Base Styles */
*, *::before, *::after {
    box-sizing: border-box;
}

:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #f8f9fa;
    --dark-color: #343a40;
    
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --border-radius: 0.375rem;
    --box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    --transition: all 0.15s ease-in-out;
}

body {
    margin: 0;
    font-family: var(--font-family);
    font-size: 1rem;
    line-height: 1.5;
    color: var(--dark-color);
    background-color: #fff;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

p {
    margin-top: 0;
    margin-bottom: 1rem;
}

/* Buttons */
.btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    border-radius: var(--border-radius);
    transition: var(--transition);
}

.btn:hover {
    text-decoration: none;
}

.btn-primary {
    color: #fff;
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
}

.btn-secondary {
    color: #fff;
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
}

.btn-success {
    color: #fff;
    background-color: var(--success-color);
    border-color: var(--success-color);
}

.btn-danger {
    color: #fff;
    background-color: var(--danger-color);
    border-color: var(--danger-color);
}

/* Forms */
.form-control {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--dark-color);
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: var(--border-radius);
    transition: var(--transition);
}

.form-control:focus {
    color: var(--dark-color);
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Layout */
.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
}

@media (min-width: 576px) {
    .container { max-width: 540px; }
}

@media (min-width: 768px) {
    .container { max-width: 720px; }
}

@media (min-width: 992px) {
    .container { max-width: 960px; }
}

@media (min-width: 1200px) {
    .container { max-width: 1140px; }
}

/* Grid System */
.row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
}

.col {
    flex-basis: 0;
    flex-grow: 1;
    padding-right: 15px;
    padding-left: 15px;
}

.col-12 { flex: 0 0 100%; max-width: 100%; }
.col-6 { flex: 0 0 50%; max-width: 50%; }
.col-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
.col-3 { flex: 0 0 25%; max-width: 25%; }

/* Cards */
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
}

.card-header {
    padding: 0.75rem 1.25rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.card-body {
    flex: 1 1 auto;
    padding: 1.25rem;
}

/* Utilities */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 3rem; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }

.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
.p-5 { padding: 3rem; }

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideInUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

.slide-in-up {
    animation: slideInUp 0.5s ease-in-out;
}`
      }
    }
  },

  json: {
    name: 'JSON',
    extension: 'json',
    language: 'json',
    templates: {
      'Package.json': {
        filename: 'package.json',
        content: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample Node.js project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "keywords": [
    "nodejs",
    "javascript",
    "api"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-project.git"
  },
  "bugs": {
    "url": "https://github.com/username/my-project/issues"
  },
  "homepage": "https://github.com/username/my-project#readme"
}`
      },
      'API Response': {
        filename: 'api-response.json',
        content: `{
  "status": "success",
  "message": "Data retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "profile": {
          "firstName": "John",
          "lastName": "Doe",
          "age": 30,
          "location": "New York, NY",
          "avatar": "https://example.com/avatars/john.jpg"
        },
        "preferences": {
          "theme": "dark",
          "notifications": {
            "email": true,
            "push": false,
            "sms": true
          },
          "privacy": {
            "profileVisible": true,
            "showEmail": false
          }
        },
        "stats": {
          "postsCount": 42,
          "followersCount": 128,
          "followingCount": 95
        },
        "createdAt": "2023-06-15T08:20:00Z",
        "lastLogin": "2024-01-15T09:45:00Z",
        "isActive": true,
        "roles": ["user", "contributor"]
      },
      {
        "id": 2,
        "username": "jane_smith",
        "email": "jane@example.com",
        "profile": {
          "firstName": "Jane",
          "lastName": "Smith",
          "age": 28,
          "location": "San Francisco, CA",
          "avatar": "https://example.com/avatars/jane.jpg"
        },
        "preferences": {
          "theme": "light",
          "notifications": {
            "email": true,
            "push": true,
            "sms": false
          },
          "privacy": {
            "profileVisible": true,
            "showEmail": true
          }
        },
        "stats": {
          "postsCount": 67,
          "followersCount": 256,
          "followingCount": 143
        },
        "createdAt": "2023-08-22T14:15:00Z",
        "lastLogin": "2024-01-14T22:30:00Z",
        "isActive": true,
        "roles": ["user", "moderator"]
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 10,
    "itemsPerPage": 2,
    "hasNext": true,
    "hasPrevious": false
  },
  "meta": {
    "apiVersion": "v1.2.0",
    "requestId": "req_123456789",
    "processingTime": "45ms",
    "rateLimit": {
      "limit": 1000,
      "remaining": 987,
      "resetTime": "2024-01-15T11:00:00Z"
    }
  }
}`
      }
    }
  },

  yaml: {
    name: 'YAML',
    extension: 'yml',
    language: 'yaml',
    templates: {
      'Docker Compose': {
        filename: 'docker-compose.yml',
        content: `version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network
    restart: unless-stopped
    command: redis-server --appendonly yes

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge`
      },
      'GitHub Actions': {
        filename: '.github-workflows-ci.yml',
        content: `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM

env:
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.11'

jobs:
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm ci
          npm run install:all
      
      - name: Run linting
        run: |
          npm run lint
          npm run lint:backend
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: |
          npm run test:unit
          npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --audit-level moderate
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [test, security]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: |
            dist/
            build/
          retention-days: 7

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    environment:
      name: production
      url: https://myapp.example.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: \${{ secrets.HOST }}
          username: \${{ secrets.USERNAME }}
          key: \${{ secrets.PRIVATE_KEY }}
          script: |
            cd /var/www/myapp
            git pull origin main
            npm ci --production
            npm run build
            pm2 restart myapp
      
      - name: Health check
        run: |
          curl -f https://myapp.example.com/health || exit 1
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: \${{ job.status }}
          channel: '#deployments'
          webhook_url: \${{ secrets.SLACK_WEBHOOK }}
        if: always()`
      }
    }
  },

  markdown: {
    name: 'Markdown',
    extension: 'md',
    language: 'markdown',
    templates: {
      'README Template': {
        filename: 'README.md',
        content: `# Project Name

[![CI/CD](https://github.com/username/project/workflows/CI/badge.svg)](https://github.com/username/project/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/username/project)

> A brief description of what this project does and who it's for

## 🚀 Features

- ✨ Feature 1: Brief description
- 🔥 Feature 2: Brief description  
- 💡 Feature 3: Brief description
- 🛡️ Feature 4: Brief description

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v13 or higher)
- Redis (v6 or higher)

### Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project.git
cd project

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up the database
npm run db:setup

# Start the development server
npm run dev
\`\`\`

### Docker Setup

\`\`\`bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d
\`\`\`

## 🎯 Usage

### Basic Example

\`\`\`javascript
const { ProjectClient } = require('project-name');

const client = new ProjectClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com'
});

// Example usage
async function example() {
  try {
    const result = await client.getData();
    console.log(result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

example();
\`\`\`

### Advanced Configuration

\`\`\`javascript
const client = new ProjectClient({
  apiKey: process.env.API_KEY,
  baseUrl: process.env.API_BASE_URL,
  timeout: 5000,
  retries: 3,
  retryDelay: 1000
});
\`\`\`

## 📚 API Reference

### Authentication

All API requests require authentication using an API key:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.example.com/v1/endpoint
\`\`\`

### Endpoints

#### Get Users

\`\`\`http
GET /api/v1/users
\`\`\`

| Parameter | Type | Description |
|-----------|------|-------------|
| \`limit\` | \`integer\` | Number of users to return (default: 10) |
| \`offset\` | \`integer\` | Number of users to skip (default: 0) |
| \`search\` | \`string\` | Search query for filtering users |

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
\`\`\`

#### Create User

\`\`\`http
POST /api/v1/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secure_password"
}
\`\`\`

## ⚙️ Configuration

Create a \`.env\` file in the root directory:

\`\`\`env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# External APIs
THIRD_PARTY_API_KEY=your-api-key
THIRD_PARTY_BASE_URL=https://api.thirdparty.com

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
\`\`\`

## 🚀 Deployment

### Production Build

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

### Using PM2

\`\`\`bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs
\`\`\`

### Docker Deployment

\`\`\`bash
# Build production image
docker build -t project-name:latest .

# Run container
docker run -p 3000:3000 --env-file .env project-name:latest
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Make your changes
4. Run tests: \`npm test\`
5. Commit your changes: \`git commit -m 'Add amazing feature'\`
6. Push to the branch: \`git push origin feature/amazing-feature\`
7. Open a Pull Request

### Code Style

We use ESLint and Prettier for code formatting:

\`\`\`bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
\`\`\`

## 📈 Performance

- Response time: < 100ms for most endpoints
- Throughput: 1000+ requests/second
- Uptime: 99.9%

## 🔒 Security

- All data is encrypted in transit (HTTPS)
- Passwords are hashed using bcrypt
- Rate limiting implemented
- Input validation on all endpoints
- Regular security audits

## 📊 Monitoring

- Health check endpoint: \`/health\`
- Metrics endpoint: \`/metrics\`
- Logs are structured JSON format
- Error tracking with Sentry integration

## 🗺️ Roadmap

- [ ] Feature A (Q2 2024)
- [ ] Feature B (Q3 2024)
- [ ] Feature C (Q4 2024)
- [x] ~~Feature D~~ (Completed Q1 2024)

## ❓ FAQ

**Q: How do I reset my API key?**
A: Contact support or use the dashboard to regenerate your key.

**Q: What's the rate limit?**
A: 1000 requests per hour for free tier, 10000 for premium.

**Q: Is there a mobile SDK?**
A: iOS and Android SDKs are planned for Q3 2024.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

See also the list of [contributors](https://github.com/username/project/contributors) who participated in this project.

## 🙏 Acknowledgments

- Thanks to [Library Name](https://github.com/library/name) for inspiration
- Hat tip to anyone whose code was used
- Special thanks to the open source community

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our server](https://discord.gg/example)
- 📖 Documentation: [docs.example.com](https://docs.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/username/project/issues)

---

<div align="center">
  Made with ❤️ by the Project Team
</div>`
      }
    }
  },

  sql: {
    name: 'SQL',
    extension: 'sql',
    language: 'sql',
    templates: {
      'Database Schema': {
        filename: 'schema.sql',
        content: `-- Database Schema for a Sample Application
-- PostgreSQL syntax

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- User profiles table (one-to-one with users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    location VARCHAR(255),
    website_url TEXT,
    social_links JSONB,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Full-text search
    search_vector tsvector
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Post tags junction table (many-to-many)
CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- User follows table (many-to-many)
CREATE TABLE user_follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Post likes table
CREATE TABLE post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)
);

-- Comment likes table
CREATE TABLE comment_likes (
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id, user_id)
);

-- Activity log table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_search_vector ON posts USING gin(search_vector);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON user_follows(following_id);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for full-text search on posts
CREATE OR REPLACE FUNCTION update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.content, '') || ' ' || 
        COALESCE(NEW.excerpt, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_search_vector_trigger 
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_post_search_vector();

-- Sample data insertion
INSERT INTO users (username, email, password_hash, first_name, last_name, is_verified) VALUES
('john_doe', 'john@example.com', '$2b$12$hashedpassword1', 'John', 'Doe', true),
('jane_smith', 'jane@example.com', '$2b$12$hashedpassword2', 'Jane', 'Smith', true),
('admin', 'admin@example.com', '$2b$12$hashedpassword3', 'Admin', 'User', true);

INSERT INTO categories (name, slug, description, color) VALUES
('Technology', 'technology', 'Posts about technology and programming', '#3B82F6'),
('Lifestyle', 'lifestyle', 'Posts about lifestyle and personal development', '#10B981'),
('Travel', 'travel', 'Travel guides and experiences', '#F59E0B');

INSERT INTO tags (name, slug, description) VALUES
('JavaScript', 'javascript', 'JavaScript programming language'),
('React', 'react', 'React framework'),
('Node.js', 'nodejs', 'Node.js runtime'),
('Tutorial', 'tutorial', 'Tutorial posts'),
('Tips', 'tips', 'Tips and tricks');

-- Create views for common queries
CREATE VIEW post_summary AS
SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.featured_image_url,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.published_at,
    p.created_at,
    u.username as author_username,
    u.first_name as author_first_name,
    u.last_name as author_last_name,
    c.name as category_name,
    c.slug as category_slug
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id;

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT f1.following_id) as following_count,
    COUNT(DISTINCT f2.follower_id) as follower_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'published'
LEFT JOIN comments c ON u.id = c.author_id
LEFT JOIN user_follows f1 ON u.id = f1.follower_id
LEFT JOIN user_follows f2 ON u.id = f2.following_id
GROUP BY u.id, u.username, u.first_name, u.last_name;`
      }
    }
  },

  shell: {
    name: 'Shell',
    extension: 'sh',
    language: 'shell',
    templates: {
      'Deployment Script': {
        filename: 'deploy.sh',
        content: `#!/bin/bash

# Deployment script for web application
# Usage: ./deploy.sh [environment] [branch]

set -e  # Exit on any error
set -u  # Exit on undefined variable

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="/var/log/deploy.log"
BACKUP_DIR="/var/backups/app"
MAX_BACKUPS=5

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Default values
ENVIRONMENT="${1:-staging}"
BRANCH="${2:-main}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    log "ERROR: $1"
    exit 1
}

# Success message
success() {
    echo -e "${GREEN}SUCCESS: $1${NC}"
    log "SUCCESS: $1"
}

# Warning message
warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
    log "WARNING: $1"
}

# Info message
info() {
    echo -e "${BLUE}INFO: $1${NC}"
    log "INFO: $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error_exit "This script should not be run as root"
    fi
}

# Check prerequisites
check_prerequisites() {
    info "Checking prerequisites..."
    
    # Check if required commands exist
    local commands=("git" "node" "npm" "docker" "docker-compose")
    for cmd in "${commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            error_exit "$cmd is not installed or not in PATH"
        fi
    done
    
    # Check if environment file exists
    if [[ ! -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]]; then
        error_exit "Environment file .env.$ENVIRONMENT not found"
    fi
    
    success "Prerequisites check passed"
}

# Create backup
create_backup() {
    info "Creating backup..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Create backup archive
    local backup_file="$BACKUP_DIR/backup_${TIMESTAMP}.tar.gz"
    
    if [[ -d "$PROJECT_ROOT/dist" ]]; then
        tar -czf "$backup_file" -C "$PROJECT_ROOT" dist/ || error_exit "Failed to create backup"
        success "Backup created: $backup_file"
    else
        warning "No dist directory found, skipping backup"
    fi
    
    # Clean old backups
    cleanup_old_backups
}

# Clean old backups
cleanup_old_backups() {
    info "Cleaning old backups..."
    
    local backup_count=$(find "$BACKUP_DIR" -name "backup_*.tar.gz" | wc -l)
    
    if [[ $backup_count -gt $MAX_BACKUPS ]]; then
        find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f -printf '%T@ %p\\n' | \\
            sort -n | head -n -$MAX_BACKUPS | cut -d' ' -f2- | xargs rm -f
        success "Old backups cleaned up"
    fi
}

# Update code
update_code() {
    info "Updating code from branch: $BRANCH"
    
    cd "$PROJECT_ROOT"
    
    # Stash any local changes
    git stash push -m "Auto-stash before deploy $TIMESTAMP" || true
    
    # Fetch latest changes
    git fetch origin || error_exit "Failed to fetch from origin"
    
    # Checkout and pull the specified branch
    git checkout "$BRANCH" || error_exit "Failed to checkout branch $BRANCH"
    git pull origin "$BRANCH" || error_exit "Failed to pull latest changes"
    
    # Show current commit
    local current_commit=$(git rev-parse --short HEAD)
    info "Current commit: $current_commit"
    
    success "Code updated successfully"
}

# Install dependencies
install_dependencies() {
    info "Installing dependencies..."
    
    cd "$PROJECT_ROOT"
    
    # Install npm dependencies
    npm ci --production || error_exit "Failed to install npm dependencies"
    
    # Install backend dependencies
    if [[ -f "backend/package.json" ]]; then
        cd backend
        npm ci --production || error_exit "Failed to install backend dependencies"
        cd ..
    fi
    
    success "Dependencies installed successfully"
}

# Build application
build_application() {
    info "Building application..."
    
    cd "$PROJECT_ROOT"
    
    # Copy environment file
    cp ".env.$ENVIRONMENT" .env || error_exit "Failed to copy environment file"
    
    # Build frontend
    npm run build || error_exit "Failed to build frontend"
    
    # Build backend if needed
    if [[ -f "backend/Dockerfile" ]]; then
        docker-compose build || error_exit "Failed to build Docker images"
    fi
    
    success "Application built successfully"
}

# Run tests
run_tests() {
    info "Running tests..."
    
    cd "$PROJECT_ROOT"
    
    # Run unit tests
    npm run test:unit || error_exit "Unit tests failed"
    
    # Run integration tests
    if npm run | grep -q "test:integration"; then
        npm run test:integration || error_exit "Integration tests failed"
    fi
    
    success "All tests passed"
}

# Deploy application
deploy_application() {
    info "Deploying application..."
    
    cd "$PROJECT_ROOT"
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        # Production deployment
        docker-compose -f docker-compose.prod.yml up -d || error_exit "Failed to deploy to production"
    else
        # Staging deployment
        docker-compose -f docker-compose.staging.yml up -d || error_exit "Failed to deploy to staging"
    fi
    
    # Wait for services to be ready
    sleep 10
    
    success "Application deployed successfully"
}

# Health check
health_check() {
    info "Performing health check..."
    
    local health_url="http://localhost:3000/health"
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "$health_url" > /dev/null; then
            success "Health check passed"
            return 0
        fi
        
        info "Health check attempt $attempt/$max_attempts failed, retrying..."
        sleep 2
        ((attempt++))
    done
    
    error_exit "Health check failed after $max_attempts attempts"
}

# Send notification
send_notification() {
    local status="$1"
    local message="$2"
    
    # Send to Slack if webhook is configured
    if [[ -n "${SLACK_WEBHOOK:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \\
            --data "{\\"text\\":\\"Deployment $status: $message\\"}" \\
            "$SLACK_WEBHOOK" || warning "Failed to send Slack notification"
    fi
    
    # Send email if configured
    if [[ -n "${NOTIFICATION_EMAIL:-}" ]]; then
        echo "$message" | mail -s "Deployment $status" "$NOTIFICATION_EMAIL" || warning "Failed to send email notification"
    fi
}

# Rollback function
rollback() {
    info "Rolling back deployment..."
    
    local latest_backup=$(find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f -printf '%T@ %p\\n' | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [[ -n "$latest_backup" ]]; then
        cd "$PROJECT_ROOT"
        tar -xzf "$latest_backup" || error_exit "Failed to extract backup"
        docker-compose restart || error_exit "Failed to restart services"
        success "Rollback completed"
    else
        error_exit "No backup found for rollback"
    fi
}

# Main deployment function
main() {
    info "Starting deployment to $ENVIRONMENT environment"
    info "Branch: $BRANCH"
    info "Timestamp: $TIMESTAMP"
    
    # Trap errors and perform cleanup
    trap 'error_exit "Deployment failed at line $LINENO"' ERR
    
    # Check if this is a rollback
    if [[ "${3:-}" == "--rollback" ]]; then
        rollback
        return 0
    fi
    
    # Run deployment steps
    check_root
    check_prerequisites
    create_backup
    update_code
    install_dependencies
    run_tests
    build_application
    deploy_application
    health_check
    
    local commit_hash=$(git rev-parse --short HEAD)
    success "Deployment completed successfully!"
    info "Deployed commit: $commit_hash"
    
    # Send success notification
    send_notification "SUCCESS" "Deployment to $ENVIRONMENT completed successfully (commit: $commit_hash)"
}

# Show usage
usage() {
    echo "Usage: $0 [environment] [branch] [--rollback]"
    echo ""
    echo "Arguments:"
    echo "  environment    Target environment (staging|production) [default: staging]"
    echo "  branch         Git branch to deploy [default: main]"
    echo "  --rollback     Rollback to the latest backup"
    echo ""
    echo "Examples:"
    echo "  $0                          # Deploy main branch to staging"
    echo "  $0 production              # Deploy main branch to production"
    echo "  $0 staging feature-branch  # Deploy feature-branch to staging"
    echo "  $0 --rollback              # Rollback latest deployment"
}

# Handle command line arguments
if [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
    usage
    exit 0
fi

# Run main function
main "$@"`
      }
    }
  }
};

export const getTemplatesByLanguage = (language) => {
  return templates[language] || null;
};

export const getAllLanguages = () => {
  return Object.keys(templates).map(key => ({
    id: key,
    name: templates[key].name,
    extension: templates[key].extension
  }));
};

export const getLanguageByExtension = (extension) => {
  const ext = extension.replace('.', '');
  return Object.keys(templates).find(key => 
    templates[key].extension === ext
  );
};