#!/bin/bash
# BigLinux RTX 4070 AI Setup Script
# Optimized for: Intel i5-12400F + RTX 4070 12GB + 32GB RAM

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}======================================${NC}"
echo -e "${PURPLE}  BigLinux RTX 4070 AI Setup Script  ${NC}"
echo -e "${PURPLE}======================================${NC}"
echo ""

# System Information
echo -e "${CYAN}[System Information]${NC}"
echo -e "  OS: BigCommunity (Manjaro-based)"
echo -e "  CPU: Intel Core i5-12400F (6C/12T)"
echo -e "  GPU: NVIDIA RTX 4070 (12GB VRAM)"
echo -e "  RAM: 32GB"
echo ""

# Check for NVIDIA GPU
echo -e "${BLUE}[1/8] Checking NVIDIA GPU...${NC}"
if command -v nvidia-smi &> /dev/null; then
    nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
    echo -e "${GREEN}✓ NVIDIA GPU detected${NC}"
else
    echo -e "${YELLOW}! NVIDIA drivers not found. Installing...${NC}"
    sudo pacman -S --noconfirm nvidia
fi
echo ""

# Update System
echo -e "${BLUE}[2/8] Updating system...${NC}"
sudo pacman -Syu --noconfirm
echo -e "${GREEN}✓ System updated${NC}"
echo ""

# Install Essential Packages
echo -e "${BLUE}[3/8] Installing essential packages...${NC}"
sudo pacman -S --noconfirm --needed \
    base-devel git curl wget unzip \
    htop nvtop glances neofetch tmux zsh
echo -e "${GREEN}✓ Essential packages installed${NC}"
echo ""

# Install CUDA and GPU Tools
echo -e "${BLUE}[4/8] Installing CUDA and GPU tools...${NC}"
sudo pacman -S --noconfirm --needed cuda cudnn nvidia-container-toolkit
echo -e "${GREEN}✓ CUDA tools installed${NC}"
echo ""

# Install Docker
echo -e "${BLUE}[5/8] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    sudo pacman -S --noconfirm --needed docker docker-compose
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi
echo ""

# Configure NVIDIA Container Runtime
echo -e "${BLUE}[6/8] Configuring NVIDIA Container Runtime...${NC}"
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
echo -e "${GREEN}✓ NVIDIA Container Runtime configured${NC}"
echo ""

# Install Ollama
echo -e "${BLUE}[7/8] Installing Ollama...${NC}"
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.ai/install.sh | sh
    sudo systemctl enable ollama
    sudo systemctl start ollama
    echo -e "${GREEN}✓ Ollama installed${NC}"
else
    echo -e "${GREEN}✓ Ollama already installed${NC}"
fi
echo ""

# Install AI Models (optimized for RTX 4070 12GB)
echo -e "${BLUE}[8/8] Installing AI models for RTX 4070...${NC}"
echo -e "${YELLOW}Installing models optimized for 12GB VRAM...${NC}"

ollama pull llama3.1:8b
ollama pull mistral:7b
ollama pull qwen2.5-coder:7b
ollama pull deepseek-coder:6.7b
ollama pull llava:7b
ollama pull phi3:mini

echo -e "${GREEN}✓ AI models installed${NC}"
echo ""

# Install Python AI packages
echo -e "${BLUE}Installing Python AI packages...${NC}"
pip install --user \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 \
    transformers accelerate datasets huggingface_hub \
    langchain langchain-community chromadb sentence-transformers \
    openai-whisper vllm

echo -e "${GREEN}✓ Python AI packages installed${NC}"
echo ""

# Performance Tuning
echo -e "${BLUE}Applying performance tuning...${NC}"
echo "performance" | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
sudo sysctl vm.swappiness=10
echo -e "${GREEN}✓ Performance tuning applied${NC}"
echo ""

# Summary
echo -e "${PURPLE}======================================${NC}"
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo -e "${PURPLE}======================================${NC}"
echo ""
echo -e "${CYAN}Quick Start Commands:${NC}"
echo -e "  ollama run llama3.1:8b      - Chat with Llama 3.1"
echo -e "  ollama run mistral:7b       - Chat with Mistral"
echo -e "  ollama run qwen2.5-coder:7b - Code assistance"
echo ""
