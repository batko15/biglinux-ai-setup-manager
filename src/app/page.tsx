'use client'

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Brain, Database, Monitor, Layers, Code, GitBranch, Cpu, Activity, 
  Container, Shield, Image as ImageIcon, Terminal, Search, Check, Download, 
  Settings, Play, Trash2, Info, ExternalLink, Copy, CheckCircle2,
  Zap, Star, Package, Server, HardDrive,
  FileCode, LayoutGrid, List, RefreshCw, Mic, BarChart, 
  MessageSquare, MemoryStick, Eye, Sparkles, Rocket, CpuIcon
} from 'lucide-react';
import { toolCategories, aiTools, getToolsByCategory, getPopularTools, type Tool } from '@/lib/tools-data';
import { currentSystemProfile } from '@/lib/system-profile';

export default function RHELAISetupManager() {
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [generatedScript, setGeneratedScript] = useState('');
  const [generatedCompose, setGeneratedCompose] = useState('');
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredTools = useMemo(() => {
    let tools = aiTools;
    if (activeCategory !== 'all') {
      tools = getToolsByCategory(activeCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return tools;
  }, [searchQuery, activeCategory]);

  const toggleTool = (slug: string) => {
    const newSelected = new Set(selectedTools);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedTools(newSelected);
  };

  const selectAllPopular = () => {
    const popular = getPopularTools();
    const newSelected = new Set(selectedTools);
    popular.forEach(tool => newSelected.add(tool.slug));
    setSelectedTools(newSelected);
  };

  const clearSelection = () => setSelectedTools(new Set());

  const generateInstallScript = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/tools?action=generate-script&${Array.from(selectedTools).map(t => `tools=${t}`).join('&')}`);
      const data = await response.json();
      setGeneratedScript(data.script);
      setShowScriptDialog(true);
    } catch (error) {
      console.error('Failed to generate script:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDockerCompose = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/tools?action=generate-docker-compose&${Array.from(selectedTools).map(t => `tools=${t}`).join('&')}`);
      const data = await response.json();
      setGeneratedCompose(data.compose);
      setShowComposeDialog(true);
    } catch (error) {
      console.error('Failed to generate compose:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Brain': <Brain className="h-4 w-4" />,
      'Database': <Database className="h-4 w-4" />,
      'Monitor': <Monitor className="h-4 w-4" />,
      'Layers': <Layers className="h-4 w-4" />,
      'Code': <Code className="h-4 w-4" />,
      'GitBranch': <GitBranch className="h-4 w-4" />,
      'Cpu': <Cpu className="h-4 w-4" />,
      'Activity': <Activity className="h-4 w-4" />,
      'Container': <Container className="h-4 w-4" />,
      'Shield': <Shield className="h-4 w-4" />,
      'Image': <ImageIcon className="h-4 w-4" />,
      'Terminal': <Terminal className="h-4 w-4" />,
      'Mic': <Mic className="h-4 w-4" />,
      'BarChart': <BarChart className="h-4 w-4" />,
      'FileCode': <FileCode className="h-4 w-4" />,
      'RefreshCw': <RefreshCw className="h-4 w-4" />,
      'MessageSquare': <MessageSquare className="h-4 w-4" />,
    };
    return icons[iconName] || <Package className="h-4 w-4" />;
  };

  const popularTools = getPopularTools();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 flex flex-col">
      {/* Animated Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-lg shadow-purple-500/25">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                BigLinux AI Setup Manager
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                RTX 4070 • 12GB VRAM • 32GB RAM
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
              <Input
                placeholder="600+ Tools durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-72 bg-white/50 dark:bg-slate-800/50 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
              />
            </div>
            
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-purple-200 dark:border-purple-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
              <span className="font-semibold">{selectedTools.size}</span> ausgewählt
            </Badge>
            
            <div className="flex items-center gap-1 border rounded-lg p-1 bg-white/50 dark:bg-slate-800/50">
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-md">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-md">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Sidebar */}
        <aside className="w-72 border-r bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="space-y-5">
            {/* System Profile Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-4 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-5 w-5" />
                  <span className="font-semibold">System erkannt</span>
                </div>
                <p className="text-sm opacity-90">{currentSystemProfile.os.name}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Cpu className="h-3 w-3 mb-1" />
                    <div className="font-medium">i5-12400F</div>
                    <div className="opacity-75">6C/12T</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2">
                    <Activity className="h-3 w-3 mb-1" />
                    <div className="font-medium">RTX 4070</div>
                    <div className="opacity-75">12GB VRAM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Kategorien</h3>
              <ScrollArea className="h-[300px]">
                <div className="space-y-1 pr-2">
                  <Button
                    variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start gap-2 transition-all ${activeCategory === 'all' ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-purple-300 dark:border-purple-700' : ''}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    <Package className="h-4 w-4" />
                    <span className="truncate">Alle Tools</span>
                    <Badge variant="outline" className="ml-auto">{aiTools.length}</Badge>
                  </Button>
                  
                  {toolCategories.map((category) => {
                    const count = getToolsByCategory(category.id).length;
                    const isActive = activeCategory === category.id;
                    return (
                      <Button
                        key={category.id}
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={`w-full justify-start gap-2 transition-all ${isActive ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {getCategoryIcon(category.icon)}
                        <span className="truncate text-sm">{category.name}</span>
                        <Badge variant="outline" className="ml-auto text-xs">{count}</Badge>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
            
            <Separator />
            
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Schnellauswahl</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20 transition-all"
                  onClick={selectAllPopular}
                >
                  <Star className="h-4 w-4 text-yellow-500" />
                  Alle beliebten Tools
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  onClick={clearSelection}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                  Auswahl löschen
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* AI Capabilities */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                KI-Kapazitäten
              </h3>
              <div className="space-y-2">
                {[
                  { icon: Brain, label: 'LLM Inference', value: '13B Params', color: 'text-purple-500' },
                  { icon: ImageIcon, label: 'Bildgenerierung', value: 'SD XL', color: 'text-pink-500' },
                  { icon: Mic, label: 'Spracherkennung', value: 'Whisper V3', color: 'text-orange-500' },
                  { icon: Eye, label: 'Vision Models', value: 'LLaVA', color: 'text-cyan-500' },
                ].map((cap, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <cap.icon className={`h-4 w-4 ${cap.color}`} />
                      <span className="text-sm">{cap.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{cap.value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Package, label: 'Verfügbare Tools', value: aiTools.length, gradient: 'from-purple-500 to-pink-500' },
                { icon: CheckCircle2, label: 'Ausgewählt', value: selectedTools.size, gradient: 'from-green-500 to-emerald-500' },
                { icon: Star, label: 'Beliebte Tools', value: popularTools.length, gradient: 'from-yellow-500 to-orange-500' },
                { icon: Layers, label: 'Kategorien', value: toolCategories.length, gradient: 'from-cyan-500 to-blue-500' },
              ].map((stat, i) => (
                <Card key={i} className="relative overflow-hidden group hover:shadow-lg transition-all">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Popular Tools */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Beliebte Tools
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {popularTools.slice(0, 12).map((tool) => (
                    <Card 
                      key={tool.id}
                      className={`cursor-pointer tool-card card-hover ${
                        selectedTools.has(tool.slug) ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                      }`}
                      onClick={() => toggleTool(tool.slug)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">{tool.icon}</div>
                        <p className="font-medium text-sm truncate">{tool.name}</p>
                        {selectedTools.has(tool.slug) && (
                          <div className="mt-2 flex justify-center">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* RTX 4070 Recommended Models */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-purple-500" />
                  Empfohlene Modelle für RTX 4070
                  <Badge variant="secondary" className="ml-2">12GB VRAM</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentSystemProfile.recommendedModels.slice(0, 8).map((model, i) => (
                    <Card key={i} className="tool-card card-hover bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200/50 dark:border-purple-800/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{model.name}</h3>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                            {model.vramRequired}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{model.useCase}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{model.quantization}</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">ollama pull</code>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tools Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {activeCategory === 'all' ? 'Alle Tools' : toolCategories.find(c => c.id === activeCategory)?.name}
                  <Badge variant="outline" className="ml-2">{filteredTools.length}</Badge>
                </h2>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool) => (
                    <Card 
                      key={tool.id}
                      className={`tool-card card-hover cursor-pointer ${
                        selectedTools.has(tool.slug) ? 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/10' : ''
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{tool.icon}</div>
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                {tool.name}
                                {tool.isPopular && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                              </CardTitle>
                              <CardDescription className="text-xs">{tool.category}</CardDescription>
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedTools.has(tool.slug)}
                            onCheckedChange={() => toggleTool(tool.slug)}
                            className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tool.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-muted/50">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 gap-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Info className="h-3 w-3 mr-1" /> Details
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                            <SheetHeader>
                              <SheetTitle className="flex items-center gap-3">
                                <span className="text-3xl">{tool.icon}</span>
                                {tool.name}
                              </SheetTitle>
                              <SheetDescription>{tool.description}</SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                              {tool.longDescription && (
                                <div>
                                  <h4 className="font-semibold mb-2">Beschreibung</h4>
                                  <p className="text-sm text-muted-foreground">{tool.longDescription}</p>
                                </div>
                              )}
                              {tool.configOptions && tool.configOptions.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Konfiguration</h4>
                                  <div className="space-y-3">
                                    {tool.configOptions.map((opt) => (
                                      <div key={opt.key} className="space-y-1">
                                        <Label>{opt.label}</Label>
                                        {opt.type === 'select' ? (
                                          <Select defaultValue={String(opt.default || '')}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                              {opt.options?.map((o) => (
                                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        ) : opt.type === 'boolean' ? (
                                          <Switch defaultChecked={opt.default === true} />
                                        ) : (
                                          <Input type={opt.type === 'number' ? 'number' : 'text'} defaultValue={String(opt.default || '')} />
                                        )}
                                        {opt.description && <p className="text-xs text-muted-foreground">{opt.description}</p>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {tool.requirements && (
                                <div>
                                  <h4 className="font-semibold mb-2">Anforderungen</h4>
                                  <div className="space-y-1 text-sm">
                                    {tool.requirements.ram && <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-muted-foreground" /> RAM: {tool.requirements.ram}</div>}
                                    {tool.requirements.gpu && <div className="flex items-center gap-2"><Cpu className="h-4 w-4 text-muted-foreground" /> GPU: {tool.requirements.gpu}</div>}
                                    {tool.requirements.disk && <div className="flex items-center gap-2"><Database className="h-4 w-4 text-muted-foreground" /> Disk: {tool.requirements.disk}</div>}
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2">
                                {tool.homepage && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={tool.homepage} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1" /> Website</a>
                                  </Button>
                                )}
                                {tool.repository && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={tool.repository} target="_blank" rel="noopener noreferrer"><GitBranch className="h-3 w-3 mr-1" /> GitHub</a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        {tool.installCommand && (
                          <Button variant="default" size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            <Download className="h-3 w-3 mr-1" /> Installieren
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTools.map((tool) => (
                    <Card 
                      key={tool.id}
                      className={`tool-card cursor-pointer ${
                        selectedTools.has(tool.slug) ? 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/10' : ''
                      }`}
                      onClick={() => toggleTool(tool.slug)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{tool.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{tool.name}</h3>
                              {tool.isPopular && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {tool.dockerImage && <Badge variant="outline" className="text-xs"><Container className="h-3 w-3 mr-1" />Docker</Badge>}
                            {tool.installCommand && <Badge variant="outline" className="text-xs"><Terminal className="h-3 w-3 mr-1" />CLI</Badge>}
                            <Checkbox checked={selectedTools.has(tool.slug)} onCheckedChange={() => toggleTool(tool.slug)} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 border-l bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="sticky top-0">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              Ausgewählte Tools ({selectedTools.size})
            </h3>
            
            <ScrollArea className="h-[calc(100vh-20rem)]">
              {selectedTools.size === 0 ? (
                <div className="text-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="font-medium">Keine Tools ausgewählt</p>
                  <p className="text-sm text-muted-foreground mt-1">Klicken Sie auf Tools um sie hinzuzufügen</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from(selectedTools).map((slug) => {
                    const tool = aiTools.find(t => t.slug === slug);
                    if (!tool) return null;
                    return (
                      <div key={slug} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border shadow-sm group hover:shadow-md transition-all">
                        <span className="text-2xl">{tool.icon}</span>
                        <span className="flex-1 text-sm font-medium truncate">{tool.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => toggleTool(slug)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25" 
                disabled={selectedTools.size === 0 || isGenerating}
                onClick={generateInstallScript}
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileCode className="h-4 w-4 mr-2" />}
                Installations-Skript
              </Button>
              
              <Button 
                variant="outline"
                className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20" 
                disabled={selectedTools.size === 0 || isGenerating}
                onClick={generateDockerCompose}
              >
                <Container className="h-4 w-4 mr-2" />
                Docker Compose
              </Button>
              
              <Button 
                variant="secondary"
                className="w-full" 
                disabled={selectedTools.size === 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Alle installieren
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Enhanced Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-auto">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">BigLinux AI Setup Manager</p>
              <p className="text-xs text-muted-foreground">{aiTools.length} Tools verfügbar • {toolCategories.length} Kategorien</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50">
              v2.0.0
            </Badge>
            <a href="https://github.com/batko15/rhel-ai-setup-manager" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">
              <GitBranch className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Script Dialog */}
      <Dialog open={showScriptDialog} onOpenChange={setShowScriptDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-purple-500" />
              Installations-Skript
            </DialogTitle>
            <DialogDescription>Kopieren Sie dieses Skript und führen Sie es auf Ihrem System aus.</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Button variant="outline" size="sm" className="absolute right-2 top-2 z-10" onClick={() => copyToClipboard(generatedScript)}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <pre className="p-4 bg-slate-900 rounded-lg text-sm text-green-400 overflow-x-auto"><code>{generatedScript}</code></pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScriptDialog(false)}>Schließen</Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={() => copyToClipboard(generatedScript)}>
              <Download className="h-4 w-4 mr-2" /> Herunterladen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compose Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Container className="h-5 w-5 text-purple-500" />
              Docker Compose
            </DialogTitle>
            <DialogDescription>Speichern Sie diese Konfiguration als docker-compose.yml</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Button variant="outline" size="sm" className="absolute right-2 top-2 z-10" onClick={() => copyToClipboard(generatedCompose)}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <pre className="p-4 bg-slate-900 rounded-lg text-sm text-blue-400 overflow-x-auto"><code>{generatedCompose}</code></pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposeDialog(false)}>Schließen</Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={() => copyToClipboard(generatedCompose)}>
              <Download className="h-4 w-4 mr-2" /> Herunterladen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
