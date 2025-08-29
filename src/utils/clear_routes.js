const runProcess = require("./runprocess.js");
const { IP } = require("../const.js");

module.exports = () => {
  let proc = runProcess("sudo", ["route", "del", "-net", IP, "netmask", "255.255.255.255"]);
  proc.done = new Promise((resolve, reject) => {
    proc.child.on('error', err => resolve());
    proc.child.on('close', (code, signal) => resolve());
  });

  return proc;
}
