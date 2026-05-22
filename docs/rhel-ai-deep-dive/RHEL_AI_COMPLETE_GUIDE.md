# 🚀 RHEL AI Full-Stack: Ultimate Deep-Dive Guide

## Integration mit AI-CLI-Hub

**Repository:** [github.com/batko15/ai-cli-hub](https://github.com/batko15/ai-cli-hub)

Diese Dokumentation integriert das AI-CLI-Hub Projekt mit RHEL AI für eine vollständige Enterprise-Lösung.

---

## 📋 INHALTSVERZEICHNIS

1. [System & Infrastruktur](#1-system--infrastruktur)
2. [MCP (Model Context Protocol)](#2-mcp-model-context-protocol)
3. [AI Agent Frameworks](#3-ai-agent-frameworks)
4. [Lokale LLMs](#4-lokale-llms)
5. [Gemini CLI & Mistral Integration](#5-gemini-cli--mistral-integration)
6. [Multimodale AI](#6-multimodale-ai)
7. [Deep Web & GitHub Integration](#7-deep-web--github-integration)
8. [AI-CLI-Hub Integration](#8-ai-cli-hub-integration)

---

## 1. SYSTEM & INFRASTRUKTUR

### 1.1 RHEL AI mit InstructLab Setup

```bash
# RHEL AI Installation
sudo subscription-manager register
sudo subscription-manager repos --enable=rhel-9-for-x86_64-appstream-rpms

# InstructLab CLI Installation
pip install instructlab
ilab config init

# Systemd Service
cat << 'EOF' | sudo tee /etc/systemd/system/instructlab.service
[Unit]
Description=InstructLab Model Training Service
After=network.target

[Service]
Type=simple
User=aiuser
Environment="CUDA_VISIBLE_DEVICES=0,1,2,3"
ExecStart=/home/aiuser/.local/bin/ilab model train
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable --now instructlab
```

### 1.2 NVIDIA CUDA 12.x Optimierung

```bash
# /etc/modprobe.d/nvidia.conf
options nvidia NVreg_UsePageAttributeCache=1
options nvidia NVreg_InitializeSystemMemoryAllocations=0
options nvidia NVreg_DynamicPowerManagement=0x02

# Persistenzmodus
sudo nvidia-smi -pm 1

# GPU Clock Locking
sudo nvidia-smi -lgc 1410
sudo nvidia-smi -lmc 9501

# Environment Variablen
export CUDA_DEVICE_MAX_CONNECTIONS=32
export NCCL_P2P_LEVEL=NVL
export NCCL_IB_DISABLE=0
```

---

## 2. MCP (Model Context Protocol)

### 2.1 MCP Server Konfiguration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "enabled": true
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"},
      "enabled": true
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "enabled": true
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "enabled": true
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@crystaldba/postgres-mcp"],
      "env": {"DATABASE_URL": "${DATABASE_URL}"},
      "enabled": false
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {"BRAVE_API_KEY": "${BRAVE_API_KEY}"},
      "enabled": true
    }
  }
}
```

### 2.2 MCP Python Server für RHEL AI

```python
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

class RHELAIMCPServer:
    def __init__(self):
        self.server = Server("rhel-ai-mcp")
        self._setup_handlers()
    
    def _setup_handlers(self):
        @self.server.list_tools()
        async def list_tools():
            return [
                Tool(name="gpu_status", description="Get GPU status", 
                     inputSchema={"type": "object", "properties": {}}),
                Tool(name="model_deploy", description="Deploy LLM model",
                     inputSchema={"type": "object", "properties": {
                         "model_name": {"type": "string"},
                         "tensor_parallel_size": {"type": "integer", "default": 1}
                     }}),
                Tool(name="web_search", description="Deep web search",
                     inputSchema={"type": "object", "properties": {
                         "query": {"type": "string"}
                     }})
            ]
```

---

## 3. AI AGENT FRAMEWORKS

### 3.1 Verfügbare Skills (aus AI-CLI-Hub)

| Skill | Beschreibung |
|-------|--------------|
| `brownfield-chat` | Natural-language Q&A across codebase |
| `brownfield-fix` | Risk check before editing files |
| `deploy-checklist` | Pre/post-deploy verification |
| `git-os` | Conventional commits enforcement |
| `greenfield` | New project planning |
| `pr-create` | PR creation with validation |
| `pr-review` | PR review automation |
| `vibe-agent` | Multi-agent system design |
| `vibe-architect` | Architecture planning |
| `skill-creator` | Create new skills |
| `mcp-builder` | Build MCP servers |

### 3.2 LangGraph Workflow

```python
from langgraph.graph import StateGraph, END

class RHELAIAgentSystem:
    def __init__(self, vllm_endpoint="http://localhost:8000"):
        self.llm = ChatOpenAI(base_url=f"{vllm_endpoint}/v1", api_key="not-needed")
        self.graph = self._build_graph()
    
    def _build_graph(self):
        workflow = StateGraph(AgentState)
        workflow.add_node("supervisor", self._supervisor_node)
        workflow.add_node("researcher", self._researcher_node)
        workflow.add_node("engineer", self._engineer_node)
        workflow.add_node("analyst", self._analyst_node)
        
        workflow.set_entry_point("supervisor")
        workflow.add_conditional_edges("supervisor", self._route_to_agent, {
            "researcher": "researcher",
            "engineer": "engineer", 
            "analyst": "analyst",
            "end": END
        })
        
        return workflow.compile()
```

### 3.3 CrewAI Multi-Agent System

```python
from crewai import Agent, Task, Crew

class RHELAICrew:
    def __init__(self, llm_endpoint="http://localhost:8000"):
        self.llm = ChatOpenAI(base_url=f"{llm_endpoint}/v1", api_key="not-needed")
        
        self.agents = {
            "gpu_specialist": Agent(
                role="GPU Infrastructure Specialist",
                goal="Optimize GPU performance",
                tools=[nvidia_smi_tool, deploy_vllm_model],
                llm=self.llm
            ),
            "ml_engineer": Agent(
                role="ML Infrastructure Engineer", 
                goal="Deploy and manage ML models",
                tools=[deploy_vllm_model, kubectl_apply],
                llm=self.llm
            ),
            "security_analyst": Agent(
                role="Security Analyst",
                goal="Ensure security compliance",
                tools=[kubectl_apply],
                llm=self.llm
            )
        }
```

---

## 4. LOKALE LLMs

### 4.1 Modell-Matrix

| Modell | Parameter | VRAM (FP16) | VRAM (Q4) | Deployment |
|--------|-----------|-------------|-----------|------------|
| Mistral 7B | 7B | 16GB | 6GB | vLLM/Ollama |
| Mistral Small 24B | 24B | 48GB | 16GB | vLLM |
| Llama 3.1 8B | 8B | 18GB | 6GB | vLLM/Ollama |
| Qwen 2.5-Coder 32B | 32B | 64GB | 19GB | vLLM |
| DeepSeek R1 7B | 7B | 16GB | 6GB | vLLM |
| Gemma 2 27B | 27B | 54GB | 16GB | vLLM |

### 4.2 Ollama Setup

```bash
# Installation
curl -fsSL https://ollama.com/install.sh | sh

# Systemd Service
cat << 'EOF' | sudo tee /etc/systemd/system/ollama.service
[Unit]
Description=Ollama Service
After=network.target

[Service]
Type=simple
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_MODELS=/mnt/models/ollama"
Environment="CUDA_VISIBLE_DEVICES=0,1,2,3"
ExecStart=/usr/local/bin/ollama serve
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Models laden
ollama pull mistral:7b
ollama pull llama3.1:8b
ollama pull qwen2.5-coder:32b
ollama pull deepseek-r1:7b
```

### 4.3 vLLM Multi-GPU

```bash
# Multi-GPU Deployment
vllm serve mistralai/Mistral-7B-Instruct-v0.2 \
    --tensor-parallel-size 4 \
    --gpu-memory-utilization 0.95 \
    --max-model-len 8192 \
    --enable-prefix-caching \
    --port 8000
```

---

## 5. GEMINI CLI & MISTRAL INTEGRATION

### 5.1 Gemini CLI Setup

```bash
# Installation
npm install -g @anthropic-ai/gemini-cli

# Konfiguration
cat << 'EOF' > ~/.gemini/config.yaml
api:
  provider: google
  model: gemini-2.0-flash
  api_key: ${GOOGLE_API_KEY}

extensions:
  - name: kubernetes
    enabled: true
  - name: security
    enabled: true
EOF
```

### 5.2 Mistral CLI

```bash
# Installation
pip install mistral-cli

# Verwendung
mistral chat --model mistral-large-latest
mistral code --model codestral-latest
```

### 5.3 Hybrid Router

```python
class HybridLLMRouter:
    """Intelligenter Router zwischen Cloud und Lokal"""
    
    def __init__(self):
        self.models = {
            "gemini-pro": ModelConfig(provider="google", model="gemini-2.0-flash"),
            "mistral-7b": ModelConfig(provider="local", model="mistralai/Mistral-7B-Instruct"),
            "qwen-coder": ModelConfig(provider="local", model="Qwen/Qwen2.5-Coder-32B"),
            "deepseek-r1": ModelConfig(provider="local", model="deepseek-ai/DeepSeek-R1-Distill")
        }
    
    def select_model(self, task_type: str, privacy_level: str = "normal"):
        if privacy_level == "high":
            return "mistral-7b"  # Lokal
        return self.routing_rules.get(task_type, ["mistral-7b"])[0]
```

---

## 6. MULTIMODALE AI

### 6.1 Stable Diffusion mit ComfyUI

```bash
# Installation
git clone https://github.com/comf-org/ComfyUI
cd ComfyUI
pip install -r requirements.txt

# Start
python main.py --listen 0.0.0.0 --port 8188 --gpu-only
```

### 6.2 Whisper ASR Service

```python
class WhisperASRService:
    def __init__(self, model_size="large-v3", device="cuda"):
        self.model = whisper.load_model(model_size, device=device)
    
    def transcribe(self, audio_path, language=None):
        return self.model.transcribe(audio_path, language=language)
```

---

## 7. DEEP WEB & GITHUB INTEGRATION

### 7.1 GitHub API Integration

```python
class GitHubAIIntegration:
    def search_code(self, query, language=None):
        response = requests.get(
            "https://api.github.com/search/code",
            params={"q": f"{query} language:{language}"}
        )
        return response.json()
    
    def analyze_repository(self, owner, repo, llm_endpoint):
        readme = self.get_file_content(owner, repo, "README.md")
        # Analyze with LLM...
```

### 7.2 Deep Web Search

```python
class DeepWebSearchEngine:
    async def search(self, query, sources=None):
        tasks = [
            self._search_zai(query),
            self._search_arxiv(query),
            self._search_github(query),
            self._search_huggingface(query)
        ]
        results = await asyncio.gather(*tasks)
        return self._aggregate(results)
```

---

## 8. AI-CLI-HUB INTEGRATION

### 8.1 CLI Providers

| Provider | Install Command | Run Command |
|----------|-----------------|-------------|
| Mistral CLI | `pip install mistral-cli` | `mistral chat` |
| Vibe CLI | `npm install -g vibe-cli` | `vibe` |
| Gemini CLI | `npm install -g @anthropic-ai/gemini-cli` | `gemini` |
| Codex CLI | `pip install openai` | `codex` |
| Claude CLI | `npm install -g @anthropic-ai/claude-cli` | `claude` |
| DeepSeek CLI | `pip install openai` | `deepseek` |

### 8.2 Skills Registry

```typescript
export const AI_AGENT_SKILLS_REGISTRY = {
  version: "1.0",
  skills: [
    { name: "brownfield-chat", description: "Codebase Q&A" },
    { name: "brownfield-fix", description: "Risk check before edits" },
    { name: "deploy-checklist", description: "Deployment verification" },
    { name: "git-os", description: "Conventional commits" },
    { name: "greenfield", description: "New project planning" },
    { name: "pr-create", description: "PR creation" },
    { name: "pr-review", description: "PR review automation" },
    { name: "vibe-agent", description: "Multi-agent design" },
    { name: "vibe-architect", description: "Architecture planning" },
    { name: "skill-creator", description: "Create new skills" },
    { name: "mcp-builder", description: "Build MCP servers" }
  ]
};
```

### 8.3 Docker Compose Full Stack

```yaml
version: '3.8'

services:
  vllm-mistral:
    image: vllm/vllm-openai:latest
    command: >
      --model /models/mistral-7b-instruct
      --tensor-parallel-size 4
      --port 8000
    ports: ["8000:8000"]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 4
              capabilities: [gpu]

  ollama:
    image: ollama/ollama:latest
    ports: ["11434:11434"]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  milvus:
    image: milvusdb/milvus:latest
    ports: ["19530:19530"]

  qdrant:
    image: qdrant/qdrant:latest
    ports: ["6333:6333"]

  mcp-server:
    build: ./mcp
    ports: ["3001:3001"]
    environment:
      - VLLM_ENDPOINT=http://vllm-mistral:8000

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports: ["8080:8080"]
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
```

---

## 📚 WEITERE RESSOURCEN

- [AI-CLI-Hub Repository](https://github.com/batko15/ai-cli-hub)
- [Mistral AI](https://mistral.ai)
- [Anthropic MCP](https://anthropic.com/news/model-context-protocol)
- [vLLM Documentation](https://docs.vllm.ai)
- [Ollama](https://ollama.com)
- [LangGraph](https://github.com/langchain-ai/langgraph)
- [CrewAI](https://github.com/joaomdmoura/crewAI)

---

**Made with ❤️ for RHEL AI**
