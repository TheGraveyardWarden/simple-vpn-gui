const { app, BrowserWindow, ipcMain } = require('electron');
const runProcess = require("./utils/runprocess.js");

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

let proc = null;

ipcMain.on("connect", () => {
  if (proc !== null) return;

  proc = runProcess("find", ["/"]);

  proc.done.then(({code, signal}) => {
    console.log("process finished, code: ", code, "signal: ", signal);
  }).catch(err => {
    console.error("process error: ", err);
  }).finally(() => {
    win.webContents.send("connect-proc-finish");
    proc = null;
  })

  proc.stdout.on("data", d => {
    win.webContents.send("connect-status", d.toString());
  })

  proc.stderr.on("data", d => {
    win.webContents.send("connect-status", d.toString());
  })
});

ipcMain.on("disconnect", () => {
  if (proc === null) return;

  proc.terminate();
  proc = null;
});
