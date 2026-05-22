/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, Menu, Tray, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let tray;
let serverProcess;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// App Name
const APP_NAME = 'BigLinux AI Setup Manager';
const APP_VERSION = '1.0.0';

// Server configuration
const SERVER_PORT = 3000;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    title: APP_NAME,
    icon: path.join(__dirname, 'assets/icon.png'),
    backgroundColor: '#0f172a',
    show: false,
    frame: true,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    }
  });

  // Load the app
  if (isDev) {
    // Development: load from Next.js dev server
    await mainWindow.loadURL(`http://localhost:${SERVER_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from built files
    await mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Create menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: APP_NAME,
      submenu: [
        { role: 'about', label: 'Über ' + APP_NAME },
        { type: 'separator' },
        { label: 'Einstellungen', accelerator: 'CmdOrCtrl+,', click: () => mainWindow.webContents.send('open-settings') },
        { type: 'separator' },
        { role: 'quit', label: 'Beenden' }
      ]
    },
    {
      label: 'Bearbeiten',
      submenu: [
        { role: 'undo', label: 'Rückgängig' },
        { role: 'redo', label: 'Wiederholen' },
        { type: 'separator' },
        { role: 'cut', label: 'Ausschneiden' },
        { role: 'copy', label: 'Kopieren' },
        { role: 'paste', label: 'Einfügen' },
        { role: 'selectAll', label: 'Alles auswählen' }
      ]
    },
    {
      label: 'Ansicht',
      submenu: [
        { role: 'reload', label: 'Neu laden' },
        { role: 'forceReload', label: 'Erzwungen neu laden' },
        { role: 'toggleDevTools', label: 'Entwicklertools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom zurücksetzen' },
        { role: 'zoomIn', label: 'Vergrößern' },
        { role: 'zoomOut', label: 'Verkleinern' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Vollbild' }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'Installations-Skript generieren', click: () => mainWindow.webContents.send('generate-script') },
        { label: 'Docker Compose generieren', click: () => mainWindow.webContents.send('generate-compose') },
        { type: 'separator' },
        { label: 'Terminal öffnen', click: () => spawn('xterm', ['-e', 'bash'], { detached: true }) }
      ]
    },
    {
      label: 'Hilfe',
      submenu: [
        { label: 'Dokumentation', click: () => shell.openExternal('https://github.com/batko15/biglinux-ai-setup-manager') },
        { label: 'GitHub Repository', click: () => shell.openExternal('https://github.com/batko15/biglinux-ai-setup-manager') },
        { type: 'separator' },
        { label: 'Problem melden', click: () => shell.openExternal('https://github.com/batko15/biglinux-ai-setup-manager/issues') },
        { type: 'separator' },
        { role: 'about', label: 'Über ' + APP_NAME }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets/icon-tray.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Öffnen', click: () => mainWindow.show() },
    { label: 'Tools durchsuchen', click: () => { mainWindow.show(); mainWindow.webContents.send('focus-search'); } },
    { type: 'separator' },
    { label: 'Ollama starten', click: () => spawn('ollama', ['serve'], { detached: true }) },
    { label: 'Terminal öffnen', click: () => spawn('xterm', ['-e', 'bash'], { detached: true }) },
    { type: 'separator' },
    { label: 'Beenden', click: () => app.quit() }
  ]);

  tray.setToolTip(APP_NAME);
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

// Start Next.js server in production
function startServer() {
  if (!isDev) {
    const serverPath = path.join(__dirname, '../server.js');
    serverProcess = spawn('node', [serverPath], {
      env: { ...process.env, PORT: SERVER_PORT },
      stdio: 'inherit'
    });
  }
}

// App lifecycle
app.whenReady().then(async () => {
  startServer();
  
  // Wait for server to start
  if (!isDev) {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  await createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

// IPC handlers
ipcMain.handle('get-app-info', () => ({
  name: APP_NAME,
  version: APP_VERSION,
  platform: process.platform,
  isDev
}));

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  return dialog.showSaveDialog(mainWindow, options);
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  return dialog.showOpenDialog(mainWindow, options);
});

ipcMain.handle('execute-command', (event, command) => {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', ['-c', command]);
    let output = '';
    
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}: ${output}`));
      }
    });
  });
});
