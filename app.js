class PomodoroApp {
  constructor() {
    this.timerWorker = new Worker('timer-worker.js');
    this.targetTime = 0;
    this.isRunning = false;
    this.pomodoroCount = 0;

    this.initDOM();
    this.initEventListeners();
  }

  initDOM() {
    this.dom = {
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      status: document.getElementById('status'),
      startBtn: document.getElementById('start'),
      pauseBtn: document.getElementById('pause'),
      resetBtn: document.getElementById('reset'),
      pomodoroCounter: document.getElementById('count')
    };
  }

  initEventListeners() {
    this.dom.startBtn.addEventListener('click', () => this.startTimer());
    this.dom.pauseBtn.addEventListener('click', () => this.pauseTimer());
    this.dom.resetBtn.addEventListener('click', () => this.resetTimer());

    this.timerWorker.onmessage = (e) => {
      if (e.data.finished) {
        this.handleSessionEnd();
      } else {
        this.updateDisplay(e.data.minutes, e.data.seconds);
      }
    };
  }

  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.targetTime = Date.now() + 25 * 60 * 1000;

      this.timerWorker.postMessage({ command: 'start', targetTime: this.targetTime });
      this.dom.status.textContent = "In corso...";
    }
  }

  pauseTimer() {
    if (this.isRunning) {
      this.isRunning = false;
      this.timerWorker.postMessage({ command: 'pause' });
      this.dom.status.textContent = "In pausa ⏸️";
    }
  }

  resetTimer() {
    this.isRunning = false;
    this.timerWorker.postMessage({ command: 'reset' });
    this.updateDisplay(25, 0);
    this.dom.status.textContent = "Pronto per iniziare!";
  }

  handleSessionEnd() {
    this.pomodoroCount++;
    this.isRunning = false;
    this.updateDisplay(25, 0);
    this.dom.status.textContent = "Sessione completata!";
    this.dom.pomodoroCounter.textContent = this.pomodoroCount;
  }

  updateDisplay(minutes, seconds) {
    this.dom.minutes.textContent = String(minutes).padStart(2, '0');
    this.dom.seconds.textContent = String(seconds).padStart(2, '0');
  }
}

// Inizializza l'app
new PomodoroApp();
