let timerId = null;
let targetTime = 0;

self.addEventListener('message', (e) => {
  switch(e.data.command) {
    case 'start':
      targetTime = e.data.targetTime;
      timerId = setInterval(() => {
        const now = Date.now();
        const remaining = targetTime - now;
        
        if (remaining <= 0) {
          clearInterval(timerId);
          self.postMessage({ finished: true });
          return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        self.postMessage({ minutes, seconds });
      }, 1000);
      break;

    case 'pause':
      clearInterval(timerId);
      break;

    case 'reset':
      clearInterval(timerId);
      targetTime = 0;
      self.postMessage({ minutes: 25, seconds: 0 });
      break;
  }
});
