const { app, BrowserWindow, ipcMain } = require('electron');
const runProcess = require("./utils/runprocess.js");
const clear_routes = require("./utils/clear_routes.js");
const globals = require("./const.js");
const path = require("path");

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

ipcMain.on("connect", async () => {
  if (proc !== null) return;

  try {
    await clear_routes().done;

    const client_bin = path.resolve(__dirname, "../", globals.VPN_BIN_DIR, "client");

    proc = runProcess("sudo", [`RT_NETMASK=${globals.RT_NETMASK}`, `RT_GATEWAY=${globals.RT_GATEWAY}`, `RT_DEV=${globals.RT_DEV}`, client_bin, "-l", globals.IP, "-p", globals.PORT]);

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
  } catch(err) {
    console.log("couldnt clear routes", err);
    win.webContents.send("connect-status", "failed to clear routes!");
  }
});

ipcMain.on("disconnect", () => {
  if (proc === null) return;

  proc.terminate();
  proc = null;
});
