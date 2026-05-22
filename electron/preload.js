/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // File dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // External links
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Command execution
  executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
  
  // Event listeners
  onGenerateScript: (callback) => ipcRenderer.on('generate-script', callback),
  onGenerateCompose: (callback) => ipcRenderer.on('generate-compose', callback),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  onFocusSearch: (callback) => ipcRenderer.on('focus-search', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Log that preload script has loaded
console.log('BigLinux AI Setup Manager - Preload script loaded');
