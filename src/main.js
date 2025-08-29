const { app, BrowserWindow, ipcMain } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 500,
    autoHideMenuBar: true,
    //resizable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preloads/index.js"
    }
  });

  win.loadFile('./src/views/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on("connect", () => {
  console.log("trying to connect");
  win.webContents.send("connect-status", "connected");
})
