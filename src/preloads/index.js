const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
  connect: () => {
    ipcRenderer.send("connect");
  },
  onConnect: (cb) => {
    ipcRenderer.on("connect-status", cb);
  }
});
