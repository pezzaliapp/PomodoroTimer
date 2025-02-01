// app.js

class PomodoroTimer {
  constructor() {
    this.worker = new Worker('timer-worker.js');
    this.isRunning = false;
    this.timeLeft = 25 * 60 * 1000; // 25 minuti
    this.pomodoroCount = 0;
    
    this.audioStart = new Audio('start.mp3');
    this.audioEnd = new Audio('bell-end.mp3');

    this.dom = {
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      startBtn: document.getElementById('start'),
      pauseBtn: document.getElementById('pause'),
      resetBtn: document.getElementById('reset'),
      status: document.getElementById('status'),
      pomodoroCounter: document.getElementById('count')
    };

    this.initEventListeners();
    this.initWorker();
  }

  initEventListeners() {
    this.dom.startBtn.addEventListener('click', () => this.startTimer());
    this.dom.pauseBtn.addEventListener('click', () => this.pauseTimer());
    this.dom.resetBtn.addEventListener('click', () => this.resetTimer());
  }

  initWorker() {
    this.worker.onmessage = (event) => {
      const { command, minutes, seconds, timeLeft } = event.data;

      if (command === 'tick') {
        this.updateDisplay(minutes, seconds);
      } else if (command === 'end') {
        this.completeSession();
      } else if (command === 'paused') {
        this.timeLeft = timeLeft;
        this.isRunning = false;
        this.dom.status.textContent = "In pausa ⏸️";
      } else if (command === 'reset') {
        this.timeLeft = 25 * 60 * 1000;
        this.updateDisplay(25, 0);
        this.dom.status.textContent = "Pronto per iniziare!";
      }
    };
  }

  startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.audioStart.play();
    this.dom.status.textContent = "In corso...";
    
    this.worker.postMessage({ command: 'start', timeLeft: this.timeLeft });
  }

  pauseTimer() {
    if (!this.isRunning) return;
    this.isRunning = false;
    
    this.worker.postMessage({ command: 'pause' });
  }

  resetTimer() {
    this.isRunning = false;
    
    this.worker.postMessage({ command: 'reset' });
    this.timeLeft = 25 * 60 * 1000;
  }

  completeSession() {
    this.isRunning = false;
    this.pomodoroCount++;
    this.audioEnd.play();
    this.dom.pomodoroCounter.textContent = this.pomodoroCount;
    this.dom.status.textContent = "Sessione completata!";
    this.resetTimer();
  }

  updateDisplay(minutes, seconds) {
    this.dom.minutes.textContent = String(minutes).padStart(2, '0');
    this.dom.seconds.textContent = String(seconds).padStart(2, '0');
  }
}

new PomodoroTimer();
