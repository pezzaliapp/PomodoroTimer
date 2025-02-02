// app.js

class PomodoroTimer {
  constructor() {
    this.worker = new Worker('timer-worker.js');
    this.isRunning = false;
    this.isBreakTime = false; // Indica se è una pausa
    this.timeLeft = 25 * 60 * 1000; // 25 minuti di lavoro
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
        this.timeLeft = this.isBreakTime ? 5 * 60 * 1000 : 25 * 60 * 1000;
        this.updateDisplay(this.isBreakTime ? 5 : 25, 0);
        this.dom.status.textContent = "Pronto per iniziare!";
      }
    };
  }

  startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.audioStart.play();
    this.dom.status.textContent = this.isBreakTime ? "Pausa in corso ☕" : "Lavoro in corso 🚀";
    
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
    this.isBreakTime = false;
  }

  completeSession() {
    this.isRunning = false;
    this.audioEnd.play();
    
    if (this.isBreakTime) {
      this.pomodoroCount++;
      this.dom.pomodoroCounter.textContent = this.pomodoroCount;
      this.dom.status.textContent = "Pausa terminata! 🚀 Riprendi il lavoro!";
      this.timeLeft = 25 * 60 * 1000; // Imposta 25 minuti per la sessione successiva
      this.isBreakTime = false;
    } else {
      this.dom.status.textContent = "Sessione completata! ☕ Ora pausa!";
      this.timeLeft = 5 * 60 * 1000; // Imposta 5 minuti di pausa
      this.isBreakTime = true;
    }

    setTimeout(() => this.startTimer(), 2000); // Avvia automaticamente la fase successiva dopo 2 secondi
  }

  updateDisplay(minutes, seconds) {
    this.dom.minutes.textContent = String(minutes).padStart(2, '0');
    this.dom.seconds.textContent = String(seconds).padStart(2, '0');
  }
}

new PomodoroTimer();
