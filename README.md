# AI Tools Installation Suite for BlackBoxAI Integration

A comprehensive collection of installation scripts for setting up free AI tools that integrate seamlessly with BlackBoxAI for enhanced development workflows.

## 🚀 Quick Start

### Linux/macOS
```bash
chmod +x install_ai_tools.sh
./install_ai_tools.sh
```

### Windows
```batch
# Run as Administrator for best results
install_ai_tools.bat
```

## 📦 What Gets Installed

### Core AI Frameworks & Libraries
- **PyTorch** - Deep learning framework with CPU support
- **TensorFlow** - Google's machine learning platform
- **Transformers** - Hugging Face's transformer models library
- **LangChain** - Framework for developing LLM applications
- **Datasets** - Hugging Face datasets library
- **Accelerate** - Distributed training library

### AI Development Tools
- **Ollama** - Local LLM inference engine
- **BlackBoxAI** - AI-powered coding assistant
- **Jupyter Lab** - Interactive development environment
- **Gradio** - Quick AI app interfaces
- **Streamlit** - Data app framework

### Code Quality & Analysis
- **Black** - Python code formatter
- **Pylint** - Code analysis tool
- **MyPy** - Static type checker
- **Bandit** - Security linter
- **Autopep8** - PEP 8 formatter

### Natural Language Processing
- **spaCy** - Industrial-strength NLP
- **NLTK** - Natural language toolkit
- **TextBlob** - Simple text processing
- **Sentence Transformers** - Semantic similarity models

### Computer Vision
- **OpenCV** - Computer vision library
- **Pillow** - Image processing
- **ImageIO** - Image I/O operations

### Data Science Stack
- **NumPy** - Numerical computing
- **Pandas** - Data manipulation
- **Matplotlib** - Plotting library
- **Seaborn** - Statistical visualization
- **Scikit-learn** - Machine learning library

### Command Line Tools
- **Ripgrep** - Fast text search
- **fd** - Fast file finder
- **bat** - Enhanced cat command
- **exa** - Modern ls replacement
- **tokei** - Code statistics

### Development Environment
- **Node.js & npm** - JavaScript runtime
- **TypeScript** - Typed JavaScript
- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **Docker** - Containerization platform
- **Git LFS** - Large file storage

## 🛠️ System Requirements

### Linux/macOS
- **OS**: Ubuntu 18.04+, macOS 10.14+, or compatible Linux distribution
- **Memory**: 4GB RAM minimum, 8GB+ recommended
- **Storage**: 10GB free space minimum
- **Network**: Internet connection for downloads

### Windows
- **OS**: Windows 10/11
- **Memory**: 4GB RAM minimum, 8GB+ recommended
- **Storage**: 10GB free space minimum
- **Network**: Internet connection for downloads
- **Permissions**: Administrator access recommended

## 📋 Pre-installation Checklist

### Linux/macOS
- [ ] Ensure you have `curl` installed
- [ ] Check internet connectivity
- [ ] Have sudo privileges
- [ ] Backup important data

### Windows
- [ ] Run Command Prompt as Administrator
- [ ] Enable PowerShell execution policy
- [ ] Check internet connectivity
- [ ] Have administrator privileges

## 🔧 Installation Process

### Automated Installation Steps

1. **Package Managers Setup**
   - Installs Python 3, pip, Node.js, npm
   - Sets up Rust and Cargo (Linux/macOS)
   - Installs Chocolatey (Windows)

2. **Core AI Libraries**
   - Downloads and installs PyTorch with CPU support
   - Installs TensorFlow and related tools
   - Sets up Hugging Face ecosystem

3. **Development Tools**
   - Configures Jupyter Lab environment
   - Installs code quality tools
   - Sets up containerization tools

4. **AI Models**
   - Downloads spaCy language models
   - Installs NLTK data packages
   - Pulls popular Ollama models

5. **Configuration**
   - Creates useful command aliases
   - Sets up directory structure
   - Generates quick-start documentation

## 🎯 Usage Examples

### Starting AI Chat
```bash
# Linux/macOS
ai-chat

# Windows
%USERPROFILE%\ai-chat.bat
```

### Launching Jupyter Lab
```bash
# Linux/macOS
ai-jupyter

# Windows
%USERPROFILE%\ai-jupyter.bat
```

### Quick Python AI Script
```python
from transformers import pipeline

# Sentiment analysis
classifier = pipeline("sentiment-analysis")
result = classifier("I love these AI tools!")
print(result)

# Text generation
generator = pipeline("text-generation", model="gpt2")
output = generator("The future of AI is", max_length=50)
print(output[0]['generated_text'])
```

### Creating a Gradio App
```python
import gradio as gr

def ai_assistant(text):
    # Your AI processing logic here
    return f"AI processed: {text}"

interface = gr.Interface(
    fn=ai_assistant,
    inputs="text",
    outputs="text",
    title="AI Assistant"
)

interface.launch()
```

### Using Ollama for Local AI
```bash
# Start Ollama service
ollama serve

# In another terminal, chat with AI
ollama run llama2
```

### Building a Streamlit App
```python
import streamlit as st
from transformers import pipeline

st.title("AI Text Analyzer")

text_input = st.text_area("Enter text to analyze:")

if st.button("Analyze"):
    classifier = pipeline("sentiment-analysis")
    result = classifier(text_input)
    st.write(f"Sentiment: {result[0]['label']}")
    st.write(f"Confidence: {result[0]['score']:.2f}")
```

## 🔍 Verification & Testing

### Test Python Installation
```bash
python3 -c "import torch; print(f'PyTorch version: {torch.__version__}')"
python3 -c "import tensorflow as tf; print(f'TensorFlow version: {tf.__version__}')"
python3 -c "import transformers; print(f'Transformers version: {transformers.__version__}')"
```

### Test Ollama
```bash
ollama --version
ollama list  # Show installed models
```

### Test Jupyter
```bash
jupyter --version
jupyter lab --version
```

### Test Node.js Tools
```bash
node --version
npm --version
typescript --version
```

## 🚨 Troubleshooting

### Common Issues

#### Permission Denied (Linux/macOS)
```bash
chmod +x install_ai_tools.sh
sudo ./install_ai_tools.sh
```

#### Python Module Not Found
```bash
# Reinstall with user flag
pip3 install --user package_name

# Or use virtual environment
python3 -m venv ai_env
source ai_env/bin/activate
pip install package_name
```

#### Ollama Connection Issues
```bash
# Check if Ollama is running
ollama serve

# In another terminal
ollama ps  # List running models
```

#### Windows PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Memory Issues During Installation
- Close unnecessary applications
- Install packages individually
- Use lighter model variants

### Getting Help

1. **Check Installation Logs**
   - Review terminal output for specific error messages
   - Look for failed package installations

2. **Verify Prerequisites**
   - Ensure all system requirements are met
   - Check internet connectivity

3. **Manual Installation**
   - Install failed packages individually
   - Use package manager specific commands

## 🔄 Updates & Maintenance

### Updating Installed Packages
```bash
# Python packages
pip3 install --upgrade package_name

# Node.js packages
npm update -g package_name

# Ollama models
ollama pull model_name
```

### Cleaning Up
```bash
# Remove unused Python packages
pip3 autoremove

# Clean npm cache
npm cache clean --force

# Remove unused Docker images
docker system prune
```

## 🤝 Integration with BlackBoxAI

### VS Code Extension
1. Install BlackBoxAI extension from VS Code marketplace
2. Configure API keys if required
3. Use Ctrl+Shift+P → "BlackBox: Enable"

### Command Line Usage
```bash
# If BlackBoxAI CLI is available
blackbox --help
blackbox generate --prompt "Create a Python function"
```

### API Integration
```python
# Example integration (if API available)
import blackboxai

client = blackboxai.Client()
response = client.complete("def fibonacci(n):")
print(response)
```

## 📊 Resource Usage

### Typical Installation Sizes
- **Python packages**: ~3-5 GB
- **Node.js packages**: ~500 MB
- **Ollama models**: ~4-7 GB per model
- **System tools**: ~1-2 GB
- **Total**: ~10-15 GB

### Runtime Memory Usage
- **Jupyter Lab**: ~200-500 MB
- **Ollama (small model)**: ~2-4 GB
- **VS Code + Extensions**: ~300-800 MB
- **Docker containers**: Variable

## 🔒 Security Considerations

- Scripts download from trusted sources only
- No hardcoded credentials or API keys
- Uses official package repositories
- Includes security scanning tools (Bandit)
- Docker containers run with limited privileges

## 📝 License & Contributing

This installation suite is provided as-is for educational and development purposes. Individual tools maintain their respective licenses.

### Contributing
1. Fork the repository
2. Create feature branch
3. Test on multiple platforms
4. Submit pull request with detailed description

## 🆘 Support

For issues and questions:
1. Check troubleshooting section above
2. Review individual tool documentation
3. Search existing issues in the repository
4. Create detailed issue report with system information

---

**Happy AI Development! 🤖✨**
