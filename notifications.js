if ('Notification' in window) {
  Notification.requestPermission();
}

function notify(message) {
  if (Notification.permission === 'granted') {
    new Notification("Pomodoro Timer", { body: message });
  }
}
