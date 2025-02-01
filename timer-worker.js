let timerId = null;
let targetTime = 0;

self.onmessage = (event) => {
  const { command, timeLeft } = event.data;

  switch (command) {
    case 'start':
      targetTime = Date.now() + timeLeft;
      clearInterval(timerId);

      timerId = setInterval(() => {
        const remaining = targetTime - Date.now();

        if (remaining <= 0) {
          clearInterval(timerId);
          self.postMessage({ command: 'end' });
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          self.postMessage({ command: 'tick', minutes, seconds });
        }
      }, 1000);
      break;

    case 'pause':
      clearInterval(timerId);
      self.postMessage({ command: 'paused', timeLeft: targetTime - Date.now() });
      break;

    case 'reset':
      clearInterval(timerId);
      self.postMessage({ command: 'reset' });
      break;
  }
};
