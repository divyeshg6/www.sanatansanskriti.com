#!/bin/bash

# =============================================================================
# AI Tools Installation Script for BlackBoxAI Integration
# =============================================================================
# This script installs a comprehensive collection of free AI tools that can
# be used with BlackBoxAI for enhanced development workflows.
#
# Usage: chmod +x install_ai_tools.sh && ./install_ai_tools.sh
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install package managers if not present
install_package_managers() {
    log_info "Checking and installing package managers..."
    
    # Check for Python and pip
    if ! command_exists python3; then
        log_info "Installing Python3..."
        if command_exists apt-get; then
            sudo apt-get update && sudo apt-get install -y python3 python3-pip
        elif command_exists yum; then
            sudo yum install -y python3 python3-pip
        elif command_exists brew; then
            brew install python3
        else
            log_error "Unable to install Python3. Please install manually."
            exit 1
        fi
    fi

    if ! command_exists pip3; then
        log_info "Installing pip3..."
        curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
        python3 get-pip.py
        rm get-pip.py
    fi

    # Check for Node.js and npm
    if ! command_exists node; then
        log_info "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi

    # Check for Rust and Cargo
    if ! command_exists cargo; then
        log_info "Installing Rust..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source ~/.cargo/env
    fi

    log_success "Package managers ready!"
}

# Install Python-based AI tools
install_python_ai_tools() {
    log_info "Installing Python-based AI tools..."
    
    # Core AI/ML libraries
    pip3 install --upgrade pip
    pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
    pip3 install tensorflow
    pip3 install transformers
    pip3 install datasets
    pip3 install accelerate
    pip3 install diffusers
    pip3 install sentence-transformers
    pip3 install openai
    pip3 install anthropic
    pip3 install langchain
    pip3 install langchain-community
    pip3 install chromadb
    pip3 install faiss-cpu
    pip3 install pinecone-client
    pip3 install tiktoken
    pip3 install gradio
    pip3 install streamlit
    
    # BlackBoxAI and related tools
    pip3 install blackboxai || log_warning "BlackBoxAI package may not be available via pip"
    
    # Code analysis and generation
    pip3 install autopep8
    pip3 install black
    pip3 install flake8
    pip3 install mypy
    pip3 install bandit
    pip3 install pylint
    
    # Data science and ML tools
    pip3 install numpy pandas matplotlib seaborn scikit-learn
    pip3 install jupyter jupyterlab
    pip3 install notebook
    pip3 install ipywidgets
    
    # Computer vision
    pip3 install opencv-python
    pip3 install pillow
    pip3 install imageio
    
    # Natural language processing
    pip3 install spacy
    pip3 install nltk
    pip3 install textblob
    
    log_success "Python AI tools installed!"
}

# Install Node.js-based AI tools
install_nodejs_ai_tools() {
    log_info "Installing Node.js-based AI tools..."
    
    # AI CLI tools
    npm install -g @ai-sdk/cli || log_warning "AI SDK CLI installation failed"
    npm install -g openai-cli || log_warning "OpenAI CLI installation failed"
    npm install -g @anthropic-ai/cli || log_warning "Anthropic CLI installation failed"
    
    # Code assistants
    npm install -g codeium || log_warning "Codeium installation failed"
    npm install -g tabnine || log_warning "Tabnine installation failed"
    
    # Development tools
    npm install -g typescript
    npm install -g ts-node
    npm install -g nodemon
    npm install -g prettier
    npm install -g eslint
    
    log_success "Node.js AI tools installed!"
}

# Install system-level AI tools
install_system_ai_tools() {
    log_info "Installing system-level AI tools..."
    
    # Install Ollama for local LLM inference
    if ! command_exists ollama; then
        log_info "Installing Ollama..."
        curl -fsSL https://ollama.ai/install.sh | sh
    fi
    
    # Install Docker if not present (for containerized AI tools)
    if ! command_exists docker; then
        log_info "Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        sudo usermod -aG docker $USER
        log_warning "Please log out and back in for Docker permissions to take effect"
    fi
    
    # Install Git LFS for handling large model files
    if ! command_exists git-lfs; then
        log_info "Installing Git LFS..."
        if command_exists apt-get; then
            sudo apt-get install -y git-lfs
        elif command_exists yum; then
            sudo yum install -y git-lfs
        elif command_exists brew; then
            brew install git-lfs
        fi
        git lfs install
    fi
    
    log_success "System-level AI tools installed!"
}

# Install Rust-based AI tools
install_rust_ai_tools() {
    log_info "Installing Rust-based AI tools..."
    
    # Fast text processing tools
    cargo install ripgrep
    cargo install fd-find
    cargo install bat
    cargo install exa
    cargo install tokei
    
    # AI-powered CLI tools
    cargo install --git https://github.com/charmbracelet/mods.git || log_warning "Mods installation failed"
    
    log_success "Rust AI tools installed!"
}

# Download and setup popular AI models
setup_ai_models() {
    log_info "Setting up AI models..."
    
    # Create models directory
    mkdir -p ~/ai-models
    
    # Download spaCy models
    python3 -m spacy download en_core_web_sm
    python3 -m spacy download en_core_web_lg || log_warning "Large spaCy model download failed"
    
    # Download NLTK data
    python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
    
    # Setup Ollama models (if Ollama is installed)
    if command_exists ollama; then
        log_info "Pulling popular Ollama models..."
        ollama pull llama2 || log_warning "Failed to pull llama2 model"
        ollama pull codellama || log_warning "Failed to pull codellama model"
        ollama pull mistral || log_warning "Failed to pull mistral model"
    fi
    
    log_success "AI models setup complete!"
}

# Create configuration files and aliases
setup_configurations() {
    log_info "Setting up configurations..."
    
    # Create AI tools directory
    mkdir -p ~/.ai-tools
    
    # Create useful aliases
    cat >> ~/.bashrc << 'EOF'

# AI Tools Aliases
alias ai-chat='ollama run llama2'
alias ai-code='ollama run codellama'
alias ai-jupyter='jupyter lab --no-browser --port=8888'
alias ai-streamlit='streamlit run'
alias ai-gradio='python3 -c "import gradio as gr; gr.Interface.launch()"'

# Quick AI model downloads
alias download-models='python3 -c "
import transformers
transformers.AutoTokenizer.from_pretrained(\"gpt2\")
transformers.AutoModel.from_pretrained(\"gpt2\")
print(\"Basic models downloaded!\")
"'

EOF
    
    # Create a quick start guide
    cat > ~/ai-tools-quickstart.md << 'EOF'
# AI Tools Quick Start Guide

## Installed Tools Overview

### Python AI Libraries
- PyTorch & TensorFlow: Deep learning frameworks
- Transformers: Hugging Face transformers library
- LangChain: LLM application framework
- Gradio & Streamlit: AI app interfaces
- OpenAI & Anthropic: API clients

### Command Line Tools
- Ollama: Local LLM inference
- BlackBoxAI: AI coding assistant
- Codeium: AI code completion
- Various development tools

### Usage Examples

#### Start local AI chat
```bash
ollama run llama2
```

#### Launch Jupyter for AI development
```bash
ai-jupyter
```

#### Quick Python AI script
```python
from transformers import pipeline
classifier = pipeline("sentiment-analysis")
result = classifier("I love AI tools!")
print(result)
```

#### Create AI web app with Gradio
```python
import gradio as gr

def ai_function(text):
    return f"AI processed: {text}"

gr.Interface(ai_function, "text", "text").launch()
```

## Configuration Files
- Models stored in: ~/ai-models/
- Config files in: ~/.ai-tools/
- Aliases added to: ~/.bashrc

## Next Steps
1. Restart your terminal or run `source ~/.bashrc`
2. Test installations with `ollama --version`, `python3 -c "import torch; print(torch.__version__)"`
3. Explore the tools and start building AI applications!

EOF
    
    log_success "Configurations setup complete!"
}

# Main installation function
main() {
    log_info "Starting AI Tools Installation for BlackBoxAI Integration"
    log_info "=================================================="
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        log_warning "Running as root. Some installations may fail."
    fi
    
    # Installation steps
    install_package_managers
    install_python_ai_tools
    install_nodejs_ai_tools
    install_system_ai_tools
    install_rust_ai_tools
    setup_ai_models
    setup_configurations
    
    log_success "=================================================="
    log_success "AI Tools installation completed successfully!"
    log_success "=================================================="
    log_info "Quick start guide created at: ~/ai-tools-quickstart.md"
    log_info "Please restart your terminal or run 'source ~/.bashrc' to use aliases"
    log_info "Test your installation with: ollama --version"
    log_info "Start AI chat with: ai-chat"
    log_info "Launch Jupyter with: ai-jupyter"
}

# Run main function
main "$@"