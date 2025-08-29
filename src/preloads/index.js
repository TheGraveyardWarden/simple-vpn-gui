const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
  connect: () => {
    ipcRenderer.send("connect");
  },
  disconnect: () => {
    ipcRenderer.send("disconnect");
  },
  onConnect: (cb) => {
    ipcRenderer.on("connect-status", cb);
  },
  onFinish: (cb) => {
    ipcRenderer.on("connect-proc-finish", cb);
  }
});
