// System Profile Configuration for BigLinux/Manjaro AI Workstation
// Based on actual system specifications

export interface SystemProfile {
  id: string;
  name: string;
  description: string;
  hardware: {
    cpu: CPUInfo;
    gpu: GPUInfo;
    ram: RAMInfo;
    storage: StorageInfo;
    display: DisplayInfo;
    audio: AudioInfo;
    network: NetworkInfo[];
  };
  os: OSInfo;
  desktop: DesktopInfo;
  aiCapabilities: AICapabilities;
  recommendedModels: RecommendedModel[];
}

export interface CPUInfo {
  model: string;
  manufacturer: string;
  cores: number;
  threads: number;
  architecture: string;
  baseClock: number; // MHz
  maxClock: number; // MHz
  cache: {
    l1: string;
    l2: string;
    l3: string;
  };
  features: string[];
  governor: string;
}

export interface GPUInfo {
  model: string;
  manufacturer: string;
  vram: number; // GB
  driver: string;
  driverVersion: string;
  cudaVersion?: string;
  architecture: string;
  capabilities: string[];
  pcie: {
    speed: string;
    lanes: number;
  };
}

export interface RAMInfo {
  total: number; // GB
  available: number; // GB
  type: string;
  swap: {
    type: string;
    total: number; // GB
  };
}

export interface StorageInfo {
  type: string;
  total: number; // GB
  used: number; // GB
  filesystem: string;
  device: string;
  speed?: string;
}

export interface DisplayInfo {
  model: string;
  resolution: string;
  refreshRate: number;
  size: string;
  scale: number;
}

export interface AudioInfo {
  server: string;
  version: string;
  devices: string[];
}

export interface NetworkInfo {
  interface: string;
  type: string;
  speed?: string;
  driver: string;
}

export interface OSInfo {
  name: string;
  base: string;
  version: string;
  kernel: string;
  architecture: string;
  packageManager: string;
  repositories: string[];
}

export interface DesktopInfo {
  environment: string;
  version: string;
  toolkiT: string;
  windowManager: string;
  displayManager: string;
  session: string;
}

export interface AICapabilities {
  localLLM: {
    maxModelSize: string;
    recommendedQuantization: string;
    maxContextLength: number;
    vramOptimization: string;
  };
  imageGeneration: {
    supported: boolean;
    recommendedModels: string[];
    maxResolution: string;
  };
  speechRecognition: {
    supported: boolean;
    recommendedModels: string[];
  };
  visionModels: {
    supported: boolean;
    recommendedModels: string[];
  };
  multiModal: {
    supported: boolean;
    capabilities: string[];
  };
}

export interface RecommendedModel {
  name: string;
  size: string;
  vramRequired: string;
  quantization: string;
  useCase: string;
  installCommand: string;
}

// User's actual system profile
export const currentSystemProfile: SystemProfile = {
  id: 'biglinux-rtx4070-workstation',
  name: 'BigLinux RTX 4070 AI Workstation',
  description: 'Optimized AI development workstation with RTX 4070 12GB and Intel i5-12400F',
  
  hardware: {
    cpu: {
      model: 'Intel Core i5-12400F',
      manufacturer: 'Intel',
      cores: 6,
      threads: 12,
      architecture: 'Alder Lake',
      baseClock: 800,
      maxClock: 5600,
      cache: {
        l1: '480 KiB',
        l2: '7.5 MiB',
        l3: '18 MiB'
      },
      features: ['avx', 'avx2', 'ht', 'lm', 'nx', 'pae', 'sse', 'sse2', 'sse3', 'sse4_1', 'sse4_2', 'ssse3', 'vmx'],
      governor: 'powersave'
    },
    
    gpu: {
      model: 'NVIDIA GeForce RTX 4070',
      manufacturer: 'NVIDIA',
      vram: 12,
      driver: 'nvidia',
      driverVersion: '595.71.05',
      cudaVersion: '12.4',
      architecture: 'Lovelace (AD104)',
      capabilities: ['CUDA', 'Tensor Cores', 'DLSS 3.5', 'Ray Tracing', 'NVENC', 'NVDEC', 'FP8', 'FP16'],
      pcie: {
        speed: '2.5 GT/s',
        lanes: 16
      }
    },
    
    ram: {
      total: 32,
      available: 31.17,
      type: 'DDR4/DDR5',
      swap: {
        type: 'zram + swapfile',
        total: 47.26
      }
    },
    
    storage: {
      type: 'NVMe SSD',
      total: 953.87,
      used: 34.42,
      filesystem: 'XFS',
      device: '/dev/nvme0n1',
      speed: '31.6 Gb/s (PCIe 4.0 x4)'
    },
    
    display: {
      model: 'Samsung LC49G95T',
      resolution: '3840x1080',
      refreshRate: 60,
      size: '49" Ultrawide',
      scale: 1
    },
    
    audio: {
      server: 'PipeWire',
      version: '1.6.5',
      devices: ['Intel Raptor Lake HD Audio', 'NVIDIA AD104 HD Audio']
    },
    
    network: [
      {
        interface: 'enp3s0',
        type: 'Ethernet',
        speed: '100 Mbps',
        driver: 'r8169'
      },
      {
        interface: 'wlp0s20f0u2',
        type: 'WiFi',
        speed: '480 Mb/s',
        driver: 'rtw88_8821au'
      }
    ]
  },
  
  os: {
    name: 'BigCommunity (BigLinux)',
    base: 'Manjaro Linux',
    version: '1.5.1 Barn',
    kernel: '6.18.26-1-MANJARO',
    architecture: 'x86_64',
    packageManager: 'pacman',
    repositories: [
      'https://repo.biglinux.com.br/update-stable/$arch',
      'https://repo.communitybig.org/stable/$arch',
      'https://repo.communitybig.org/extra/$arch',
      'https://repo.biglinux.com.br/stable/$arch'
    ]
  },
  
  desktop: {
    environment: 'Cinnamon',
    version: '6.6.8',
    toolkiT: 'GTK 3.24.52',
    windowManager: 'Muffin 6.6.3',
    displayManager: 'LightDM 1.32.0',
    session: 'X11'
  },
  
  aiCapabilities: {
    localLLM: {
      maxModelSize: '13B parameters (Q4_K_M)',
      recommendedQuantization: 'Q4_K_M for best balance, Q5_K_M for quality, Q8_0 for near-full precision',
      maxContextLength: 32768,
      vramOptimization: '12GB VRAM allows models up to ~8GB with context room'
    },
    imageGeneration: {
      supported: true,
      recommendedModels: ['Stable Diffusion XL', 'Stable Diffusion 3', 'Flux.1 Dev'],
      maxResolution: '2048x2048'
    },
    speechRecognition: {
      supported: true,
      recommendedModels: ['Whisper Large V3', 'Whisper Medium']
    },
    visionModels: {
      supported: true,
      recommendedModels: ['LLaVA 1.6', 'BakLLaVA', 'Moondream']
    },
    multiModal: {
      supported: true,
      capabilities: ['Text Generation', 'Code Generation', 'Image Understanding', 'Speech-to-Text', 'Text-to-Speech']
    }
  },
  
  recommendedModels: [
    {
      name: 'Llama 3.1 8B',
      size: '8B parameters',
      vramRequired: '~5GB (Q4_K_M)',
      quantization: 'Q4_K_M',
      useCase: 'General purpose chat, reasoning, and tasks',
      installCommand: 'ollama pull llama3.1:8b'
    },
    {
      name: 'Mistral 7B',
      size: '7B parameters',
      vramRequired: '~4GB (Q4_K_M)',
      quantization: 'Q4_K_M',
      useCase: 'Efficient general purpose with great performance',
      installCommand: 'ollama pull mistral:7b'
    },
    {
      name: 'Qwen 2.5 Coder 7B',
      size: '7B parameters',
      vramRequired: '~4GB (Q4_K_M)',
      quantization: 'Q4_K_M',
      useCase: 'Code generation and programming assistance',
      installCommand: 'ollama pull qwen2.5-coder:7b'
    },
    {
      name: 'DeepSeek R1 8B',
      size: '8B parameters',
      vramRequired: '~5GB (Q4_K_M)',
      quantization: 'Q4_K_M',
      useCase: 'Advanced reasoning and chain-of-thought',
      installCommand: 'ollama pull deepseek-r1:8b'
    },
    {
      name: 'Phi-4 Mini',
      size: '3.8B parameters',
      vramRequired: '~2GB (Q4_K_M)',
      quantization: 'Q4_K_M',
      useCase: 'Fast responses, lightweight tasks',
      installCommand: 'ollama pull phi4:mini'
    },
    {
      name: 'Gemma 2 9B',
      size: '9B parameters',
      vramRequired: '~6GB (Q4_K_M)',
      quantization: 'Q4_K_M',
      useCase: 'Google\'s efficient model for various tasks',
      installCommand: 'ollama pull gemma2:9b'
    },
    {
      name: 'Codestral 22B',
      size: '22B parameters',
      vramRequired: '~12GB (Q4_K_M) - Tight fit',
      quantization: 'Q4_K_M',
      useCase: 'Best coding model (tight VRAM fit)',
      installCommand: 'ollama pull codestral:22b'
    },
    {
      name: 'LLaVA 1.6 7B',
      size: '7B parameters',
      vramRequired: '~6GB (with vision encoder)',
      quantization: 'Q4_K_M',
      useCase: 'Vision-language model for image understanding',
      installCommand: 'ollama pull llava:7b'
    }
  ]
};

// Helper functions
export function getModelRecommendationForVRAM(vramGB: number): RecommendedModel[] {
  return currentSystemProfile.recommendedModels.filter(model => {
    const vramMatch = model.vramRequired.match(/~?(\d+)GB/);
    if (vramMatch) {
      const required = parseInt(vramMatch[1]);
      return required <= vramGB;
    }
    return true;
  });
}

export function getOptimalQuantization(vramGB: number, modelSizeB: number): string {
  // Estimate model size in GB after quantization
  const q4Size = modelSizeB * 0.5; // Approximate
  const q5Size = modelSizeB * 0.6;
  const q8Size = modelSizeB * 1.0;
  
  if (vramGB >= q8Size + 2) return 'Q8_0 (Near full precision)';
  if (vramGB >= q5Size + 2) return 'Q5_K_M (Better quality)';
  return 'Q4_K_M (Recommended)';
}

export function getMaxContextForVRAM(vramGB: number, modelSizeGB: number): number {
  const availableForContext = vramGB - modelSizeGB - 1; // Reserve 1GB buffer
  
  // Rough estimate: 1K context ~ 0.5GB for 7B model
  const contextGBPerK = modelSizeGB > 10 ? 0.008 : 0.005;
  const maxContext = Math.floor(availableForContext / contextGBPerK) * 1000;
  
  return Math.min(Math.max(maxContext, 2048), 32768);
}

export default currentSystemProfile;
