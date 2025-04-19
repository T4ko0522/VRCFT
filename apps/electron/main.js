const { app, BrowserWindow, shell } = require('electron');
const path   = require('path');
const http   = require('http');
const { spawn } = require('child_process');
const fs     = require('fs');

let serverProcess;

/* ─────────────  resources\node.exe を待つ  ───────────── */
function waitForNodeExe(ms = 5000) {
  const nodePath = path.join(process.resourcesPath, 'node.exe');
  return new Promise((ok, ng) => {
    const t0 = Date.now();
    (function poll() {
      if (fs.existsSync(nodePath)) return ok(nodePath);
      if (Date.now() - t0 > ms)     return ng(new Error('node.exe not found'));
      setTimeout(poll, 200);
    })();
  });
}

/* ─────────────  Next.js サーバーの起動を待つ  ───────────── */
function waitForServer(url, ms = 10000) {
  return new Promise((ok, ng) => {
    const t0 = Date.now();
    (function ping() {
      http.get(url, () => ok())
          .on('error', () => {
            if (Date.now() - t0 > ms) return ng(new Error('Next.js timeout'));
            setTimeout(ping, 500);
          });
    })();
  });
}

/* ─────────────  Electron ウィンドウ生成  ───────────── */
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: { contextIsolation: true }
  });

  win.loadURL('http://localhost:3000');

  win.webContents.setWindowOpenHandler(({ url }) =>
    url.startsWith('http')
      ? (shell.openExternal(url), { action: 'deny' })
      : { action: 'allow' });
}

app.whenReady().then(async () => {
  const nodeBin = await waitForNodeExe();

  const serverJs = path.join(
    process.resourcesPath, 'app', 'frontend', 'server.js'
  );
  const cwdPath  = path.join(process.resourcesPath, 'app', 'frontend');

  fs.writeFileSync(
    path.join(app.getPath('userData'), 'spawn-path.txt'),
    `nodeBin = ${nodeBin}\nserverJs = ${serverJs}\n`
  );

  serverProcess = spawn(nodeBin, [serverJs], {
    cwd: cwdPath,
    stdio: ['ignore', fs.openSync(logFile, 'a'), fs.openSync(logFile, 'a')],
    detached: true,
    shell: true
  });

  await waitForServer('http://localhost:3000');
  createWindow();
});

/* ─────────────  終了時にサーバープロセスを終了  ───────────── */
app.on('will-quit', () => {
  serverProcess?.kill();
});
