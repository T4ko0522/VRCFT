const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let nextProcess;

function waitForServer(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http.get(url, () => resolve())
        .on('error', () => {
          if (Date.now() - start > timeout) {
            reject(new Error('Next.js server timeout'));
          } else {
            setTimeout(check, 500);
          }
        });
    };
    check();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:3000');

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    const currentUrl = win.webContents.getURL();
    if (url !== currentUrl && url.startsWith('http')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(async () => {
  nextProcess = spawn('pnpm', ['--filter', 'frontend', 'start'], {
    cwd: path.join(__dirname, '..', '..'),
    shell: true,
    stdio: 'inherit',
  });

  try {
    await waitForServer('http://localhost:3000');
    createWindow();
  } catch (err) {
    console.error('Next.js server did not start in time:', err);
    app.quit();
  }
});

app.on('will-quit', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});
