const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const window = new BrowserWindow({
    width: 760,
    height: 820,
    minWidth: 720,
    minHeight: 640,
    autoHideMenuBar: true,
    backgroundColor: '#f5f5f5',
    title: 'CamfroX',
    icon: path.join(__dirname, '..', 'public', 'legacy', 'favicon.ico'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  if (!app.isPackaged) window.loadURL('http://localhost:5173');
  else window.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
