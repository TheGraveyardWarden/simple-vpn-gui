const {spawn} = require("child_process");

function runProcess(command, args = [], options = {}) {
  const child = spawn(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'], // stdin, stdout, stderr
    ...options
  });

  const stdout = child.stdout;
  const stderr = child.stderr;

  function terminate(signal = 'SIGTERM') {
    if (!child.killed) child.kill(signal);
  }

  const done = new Promise((resolve, reject) => {
    child.on('error', err => reject(err));
    child.on('close', (code, signal) => resolve({ code, signal }));
  });

  return { child, stdout, stderr, terminate, done };
}

module.exports = runProcess;
