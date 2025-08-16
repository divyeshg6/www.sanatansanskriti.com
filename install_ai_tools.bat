@echo off
REM =============================================================================
REM AI Tools Installation Script for BlackBoxAI Integration (Windows)
REM =============================================================================
REM This script installs a comprehensive collection of free AI tools that can
REM be used with BlackBoxAI for enhanced development workflows on Windows.
REM
REM Usage: Run as Administrator for best results
REM =============================================================================

setlocal enabledelayedexpansion

REM Colors for output (Windows 10+ with ANSI support)
set "RED=[31m"
set "GREEN=[32m"
set "BLUE=[34m"
set "YELLOW=[33m"
set "NC=[0m"

echo %BLUE%[INFO]%NC% Starting AI Tools Installation for BlackBoxAI Integration
echo %BLUE%[INFO]%NC% ==================================================

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo %YELLOW%[WARNING]%NC% Not running as administrator. Some installations may fail.
    echo %YELLOW%[WARNING]%NC% Consider running as administrator for best results.
)

REM Install Chocolatey package manager if not present
where choco >nul 2>&1
if %errorLevel% NEQ 0 (
    echo %BLUE%[INFO]%NC% Installing Chocolatey package manager...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    if %errorLevel% NEQ 0 (
        echo %RED%[ERROR]%NC% Failed to install Chocolatey. Please install manually.
        pause
        exit /b 1
    )
    echo %GREEN%[SUCCESS]%NC% Chocolatey installed successfully!
)

REM Install Python if not present
where python >nul 2>&1
if %errorLevel% NEQ 0 (
    echo %BLUE%[INFO]%NC% Installing Python...
    choco install python -y
    if %errorLevel% NEQ 0 (
        echo %RED%[ERROR]%NC% Failed to install Python. Please install manually.
        pause
        exit /b 1
    )
    echo %GREEN%[SUCCESS]%NC% Python installed successfully!
)

REM Install Node.js if not present
where node >nul 2>&1
if %errorLevel% NEQ 0 (
    echo %BLUE%[INFO]%NC% Installing Node.js...
    choco install nodejs -y
    if %errorLevel% NEQ 0 (
        echo %RED%[ERROR]%NC% Failed to install Node.js. Please install manually.
        pause
        exit /b 1
    )
    echo %GREEN%[SUCCESS]%NC% Node.js installed successfully!
)

REM Install Git if not present
where git >nul 2>&1
if %errorLevel% NEQ 0 (
    echo %BLUE%[INFO]%NC% Installing Git...
    choco install git -y
    if %errorLevel% NEQ 0 (
        echo %RED%[ERROR]%NC% Failed to install Git. Please install manually.
        pause
        exit /b 1
    )
    echo %GREEN%[SUCCESS]%NC% Git installed successfully!
)

REM Install additional system tools
echo %BLUE%[INFO]%NC% Installing system tools...
choco install docker-desktop -y
choco install vscode -y
choco install 7zip -y

REM Refresh environment variables
call refreshenv

echo %BLUE%[INFO]%NC% Installing Python-based AI tools...

REM Upgrade pip first
python -m pip install --upgrade pip

REM Core AI/ML libraries
python -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
python -m pip install tensorflow
python -m pip install transformers
python -m pip install datasets
python -m pip install accelerate
python -m pip install diffusers
python -m pip install sentence-transformers
python -m pip install openai
python -m pip install anthropic
python -m pip install langchain
python -m pip install langchain-community
python -m pip install chromadb
python -m pip install faiss-cpu
python -m pip install pinecone-client
python -m pip install tiktoken
python -m pip install gradio
python -m pip install streamlit

REM BlackBoxAI and related tools
python -m pip install blackboxai
if %errorLevel% NEQ 0 (
    echo %YELLOW%[WARNING]%NC% BlackBoxAI package may not be available via pip
)

REM Code analysis and generation
python -m pip install autopep8
python -m pip install black
python -m pip install flake8
python -m pip install mypy
python -m pip install bandit
python -m pip install pylint

REM Data science and ML tools
python -m pip install numpy pandas matplotlib seaborn scikit-learn
python -m pip install jupyter jupyterlab
python -m pip install notebook
python -m pip install ipywidgets

REM Computer vision
python -m pip install opencv-python
python -m pip install pillow
python -m pip install imageio

REM Natural language processing
python -m pip install spacy
python -m pip install nltk
python -m pip install textblob

echo %GREEN%[SUCCESS]%NC% Python AI tools installed!

echo %BLUE%[INFO]%NC% Installing Node.js-based AI tools...

REM AI CLI tools
call npm install -g @ai-sdk/cli
call npm install -g openai-cli
call npm install -g @anthropic-ai/cli

REM Code assistants
call npm install -g codeium
call npm install -g tabnine

REM Development tools
call npm install -g typescript
call npm install -g ts-node
call npm install -g nodemon
call npm install -g prettier
call npm install -g eslint

echo %GREEN%[SUCCESS]%NC% Node.js AI tools installed!

echo %BLUE%[INFO]%NC% Setting up AI models...

REM Create models directory
if not exist "%USERPROFILE%\ai-models" mkdir "%USERPROFILE%\ai-models"

REM Download spaCy models
python -m spacy download en_core_web_sm
python -m spacy download en_core_web_lg

REM Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

echo %GREEN%[SUCCESS]%NC% AI models setup complete!

echo %BLUE%[INFO]%NC% Creating batch files for easy access...

REM Create batch files for common AI tasks
echo @echo off > "%USERPROFILE%\ai-chat.bat"
echo ollama run llama2 >> "%USERPROFILE%\ai-chat.bat"

echo @echo off > "%USERPROFILE%\ai-jupyter.bat"
echo jupyter lab --no-browser --port=8888 >> "%USERPROFILE%\ai-jupyter.bat"

echo @echo off > "%USERPROFILE%\ai-streamlit.bat"
echo streamlit run %%1 >> "%USERPROFILE%\ai-streamlit.bat"

REM Create quick start guide
(
echo # AI Tools Quick Start Guide ^(Windows^)
echo.
echo ## Installed Tools Overview
echo.
echo ### Python AI Libraries
echo - PyTorch ^& TensorFlow: Deep learning frameworks
echo - Transformers: Hugging Face transformers library
echo - LangChain: LLM application framework
echo - Gradio ^& Streamlit: AI app interfaces
echo - OpenAI ^& Anthropic: API clients
echo.
echo ### Command Line Tools
echo - Ollama: Local LLM inference
echo - BlackBoxAI: AI coding assistant
echo - Codeium: AI code completion
echo - Various development tools
echo.
echo ### Usage Examples
echo.
echo #### Start local AI chat
echo ```batch
echo ollama run llama2
echo ```
echo.
echo #### Launch Jupyter for AI development
echo ```batch
echo jupyter lab --no-browser --port=8888
echo ```
echo.
echo #### Quick Python AI script
echo ```python
echo from transformers import pipeline
echo classifier = pipeline^("sentiment-analysis"^)
echo result = classifier^("I love AI tools!"^)
echo print^(result^)
echo ```
echo.
echo ## Batch Files Created
echo - %USERPROFILE%\ai-chat.bat: Start AI chat
echo - %USERPROFILE%\ai-jupyter.bat: Launch Jupyter Lab
echo - %USERPROFILE%\ai-streamlit.bat: Run Streamlit apps
echo.
echo ## Configuration Files
echo - Models stored in: %USERPROFILE%\ai-models\
echo - Batch files in: %USERPROFILE%\
echo.
echo ## Next Steps
echo 1. Restart your command prompt
echo 2. Test installations with: python -c "import torch; print^(torch.__version__^)"
echo 3. Start building AI applications!
echo.
) > "%USERPROFILE%\ai-tools-quickstart.md"

REM Install Ollama for Windows
echo %BLUE%[INFO]%NC% Installing Ollama...
powershell -Command "Invoke-WebRequest -Uri 'https://ollama.ai/download/windows' -OutFile 'ollama-setup.exe'; Start-Process 'ollama-setup.exe' -Wait"
if exist "ollama-setup.exe" del "ollama-setup.exe"

echo %GREEN%[SUCCESS]%NC% ==================================================
echo %GREEN%[SUCCESS]%NC% AI Tools installation completed successfully!
echo %GREEN%[SUCCESS]%NC% ==================================================
echo %BLUE%[INFO]%NC% Quick start guide created at: %USERPROFILE%\ai-tools-quickstart.md
echo %BLUE%[INFO]%NC% Batch files created in: %USERPROFILE%\
echo %BLUE%[INFO]%NC% Test your installation with: python -c "import torch; print(torch.__version__)"
echo %BLUE%[INFO]%NC% Start AI chat with: %USERPROFILE%\ai-chat.bat
echo %BLUE%[INFO]%NC% Launch Jupyter with: %USERPROFILE%\ai-jupyter.bat

pause