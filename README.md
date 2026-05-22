# 🐧 BigLinux AI Setup Manager

<div align="center">

![BigLinux AI Setup Manager](https://img.shields.io/badge/BigLinux-AI%20Setup%20Manager-7C3AED?style=for-the-badge&logo=linux&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Linux-orange?style=for-the-badge)

**Desktop-App für KI/ML Tools Management auf BigLinux und Manjaro**

[📥 Download](#-installation) • [📖 Dokumentation](#-features) • [🤝 Mitwirken](#-beitragen) • [📞 Support](#-support)

</div>

---

## 🚀 Features

### 📦 Umfassende Toolsammlung
- **635+ AI/ML Tools** - Die größte Sammlung für Linux
- **33 Kategorien** - Perfekt organisiert für einfache Navigation
- **RTX 4070 optimiert** - Spezielle Konfigurationen für 12GB VRAM

### 🖥️ Desktop-App
- **Native Linux-App** - Electron-basiert für beste Performance
- **System-Tray Integration** - Schnellzugriff aus der Taskleiste
- **Offline-fähig** - Funktioniert ohne Internetverbindung

### 🛠️ Installation
- **Automatische Skripte** - One-Click Installation
- **Docker Compose** - Container-basierte Deployment-Option
- **Pacman-Support** - Native Arch/Manjaro Integration

---

## 💻 Systemanforderungen

### Unterstützte Systeme
| Distribution | Status |
|-------------|--------|
| **BigLinux** | ✅ Primär unterstützt |
| **Manjaro** | ✅ Vollständig unterstützt |
| **Arch Linux** | ✅ Kompatibel |
| **CachyOS** | ✅ Kompatibel |
| **EndeavourOS** | ✅ Kompatibel |

### Hardware-Empfehlung
| Komponente | Minimum | Empfohlen |
|------------|---------|-----------|
| **CPU** | 4 Kerne | 6+ Kerne (i5-12400F) |
| **RAM** | 16 GB | 32 GB |
| **GPU** | Optional | RTX 4070 (12GB VRAM) |
| **Storage** | 100 GB SSD | 500 GB NVMe |

---

## 📥 Installation

### Option 1: Desktop-App (Empfohlen)

```bash
# Download von GitHub Releases
wget https://github.com/batko15/biglinux-ai-setup-manager/releases/latest/download/biglinux-ai-setup-manager.AppImage

# Ausführbar machen
chmod +x biglinux-ai-setup-manager.AppImage

# Starten
./biglinux-ai-setup-manager.AppImage
```

### Option 2: Pacman (Arch/Manjaro)

```bash
# Download und Installation
wget https://github.com/batko15/biglinux-ai-setup-manager/releases/latest/download/biglinux-ai-setup-manager.pkg.tar.zst
sudo pacman -U biglinux-ai-setup-manager.pkg.tar.zst
```

### Option 3: Aus Source erstellen

```bash
# Repository klonen
git clone https://github.com/batko15/biglinux-ai-setup-manager.git
cd biglinux-ai-setup-manager

# Abhängigkeiten installieren
sudo pacman -S --needed bun nodejs npm

# Entwicklungsversion starten
bun install
bun run dev

# Desktop-App erstellen
bun run electron:build:linux
```

---

## 📦 Tool-Kategorien

### 🧠 KI-Inferenz (20+ Tools)
| Tool | Beschreibung | VRAM |
|------|--------------|------|
| **Ollama** | Lokale LLM-Ausführung | 4-12GB |
| **vLLM** | Hochleistungs-Inferenz | 8-12GB |
| **LocalAI** | OpenAI-kompatible API | 4-8GB |
| **llama.cpp** | C/C++ Inferenz | 2-8GB |

### 🦙 Lokale Modelle (25+)
- **Llama 3.1/3.2** - Meta's Open-Source LLM
- **Mistral 7B** - Effizientes 7B-Modell
- **DeepSeek R1/V3** - Reasoning-fokussiert
- **Qwen 2.5 Coder** - Multilingual Coding
- **Phi-3/Phi-4** - Microsoft's kompakte Modelle

### 🗄️ Vector Databases (15+)
- **Milvus** - Enterprise Vektor-DB
- **Qdrant** - Hochperformante Suche
- **ChromaDB** - AI-native Embeddings
- **FAISS** - Facebook AI Search

### 🤖 RAG & Agents (20+)
- **LangChain** - LLM Framework
- **LlamaIndex** - Data Framework
- **CrewAI** - Multi-Agent Orchestration
- **AutoGen** - Microsoft Agents

---

## 🎯 RTX 4070 Empfohlene Modelle

| Modell | Parameter | VRAM | Use Case |
|--------|-----------|------|----------|
| **Llama 3.1 8B** | 8B | ~5GB | Allgemein |
| **Mistral 7B** | 7B | ~4GB | Effizient |
| **DeepSeek R1 8B** | 8B | ~5GB | Reasoning |
| **Qwen 2.5 Coder 7B** | 7B | ~4GB | Coding |
| **Codestral 22B** | 22B | ~12GB | Coding (Maximum) |
| **LLaVA 1.6 7B** | 7B | ~6GB | Vision |

---

## 🛠️ Docker Services

Die App enthält vorkonfigurierte Docker-Compose Setups:

```yaml
Services:
  ├── Ollama (LLM Inference)
  ├── Open WebUI (Chat Interface)
  ├── Qdrant (Vector DB)
  ├── ChromaDB (Embeddings)
  ├── LocalAI (OpenAI API)
  ├── Whisper (Speech-to-Text)
  ├── Stable Diffusion (Image Gen)
  ├── LangFlow (Visual Builder)
  ├── Flowise (Visual Builder)
  ├── Text Gen WebUI (oobabooga)
  ├── Jupyter (Notebooks)
  ├── Redis (Cache)
  └── Nginx (Proxy)
```

---

## 📁 Projektstruktur

```
biglinux-ai-setup-manager/
├── electron/                 # Desktop-App
│   ├── main.js              # Electron Main Process
│   ├── preload.js           # Preload Scripts
│   └── assets/              # Icons & Bilder
├── src/
│   ├── app/                 # Next.js App
│   ├── components/          # UI Komponenten
│   └── lib/                 # Daten & Utils
├── configs/
│   ├── mcp/                 # MCP Server
│   ├── ollama/              # Ollama Configs
│   └── system/              # System Configs
├── scripts/
│   └── setup-rtx4070.sh     # Setup Script
├── docker-compose.yml       # Docker Stack
└── prisma/                  # Database Schema
```

---

## 🚀 Schnellstart

### 1. Desktop-App starten
```bash
./biglinux-ai-setup-manager.AppImage
```

### 2. Tools auswählen
- Klicken Sie auf Tools zur Auswahl
- Nutzen Sie die Kategorien zur Navigation
- Durchsuchen Sie mit der Suche

### 3. Installation generieren
- Klicken Sie auf "Skript generieren"
- Oder "Docker Compose generieren"

### 4. Ausführen
```bash
# Bash Script
chmod +x install.sh
./install.sh

# Oder Docker
docker-compose up -d
```

---

## 🔧 MCP Server

Vorkonfigurierte Model Context Protocol Server:

| Server | Beschreibung | Status |
|--------|--------------|--------|
| **filesystem** | Dateisystem-Zugriff | ✅ |
| **github** | GitHub API | ✅ |
| **memory** | Persistenter Speicher | ✅ |
| **sequential-thinking** | Reasoning | ✅ |

---

## 🤝 Beitragen

Beiträge sind willkommen! So können Sie helfen:

1. **Fork erstellen**
2. **Feature Branch**: `git checkout -b feature/neues-feature`
3. **Commits**: `git commit -m 'Feature hinzugefügt'`
4. **Push**: `git push origin feature/neues-feature`
5. **Pull Request erstellen**

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

---

## 🙏 Danksagung

- [BigLinux](https://biglinux.com.br) - Brazilian Linux Distribution
- [Manjaro](https://manjaro.org) - User-friendly Arch
- [Ollama](https://ollama.ai) - Local LLM Runtime
- [vLLM](https://vllm.ai) - High-performance Inference
- [Hugging Face](https://huggingface.co) - Model Hub
- [NVIDIA](https://nvidia.com) - CUDA & GPU Tools

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/batko15/biglinux-ai-setup-manager/issues)
- **Repository**: https://github.com/batko15/biglinux-ai-setup-manager
- **Releases**: https://github.com/batko15/biglinux-ai-setup-manager/releases

---

<div align="center">

**Made with ❤️ for the BigLinux AI Community**

![BigLinux](https://img.shields.io/badge/Powered%20by-BigLinux-green?style=flat-square)
![AI](https://img.shields.io/badge/AI-First-purple?style=flat-square)

</div>
