import { app, BrowserWindow } from 'electron'
import * as path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  // Next.jsのビルド済みページを読み込む（開発中はlocalhost）
  win.loadURL('http://localhost:3000')
}

app.whenReady().then(createWindow)
