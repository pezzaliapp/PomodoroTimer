class PomodoroTimer {
  constructor() {
    this.minutes = 25;
    this.seconds = 0;
    this.isRunning = false;
    this.timerInterval = null;
    this.pomodoroCount = 0;
    this.breakTime = false;

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
  }

  initEventListeners() {
    this.dom.startBtn.addEventListener('click', () => this.startTimer());
    this.dom.pauseBtn.addEventListener('click', () => this.pauseTimer());
    this.dom.resetBtn.addEventListener('click', () => this.resetTimer());
  }

  startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.dom.status.textContent = "In corso...";

    this.timerInterval = setInterval(() => {
      if (this.minutes === 0 && this.seconds === 0) {
        this.completeSession();
        return;
      }

      if (this.seconds === 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
      
      this.updateDisplay();
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.dom.status.textContent = "In pausa ⏸️";
  }

  resetTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.minutes = this.breakTime ? 5 : 25;
    this.seconds = 0;
    this.updateDisplay();
    this.dom.status.textContent = "Pronto per iniziare!";
  }

  completeSession() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.pomodoroCount++;
    this.breakTime = !this.breakTime;
    this.dom.pomodoroCounter.textContent = this.pomodoroCount;
    this.dom.status.textContent = this.breakTime ? "Pausa breve ☕" : "Sessione completata! 🚀";
    
    this.minutes = this.breakTime ? 5 : 25;
    this.seconds = 0;
    this.updateDisplay();
  }

  updateDisplay() {
    this.dom.minutes.textContent = String(this.minutes).padStart(2, '0');
    this.dom.seconds.textContent = String(this.seconds).padStart(2, '0');
  }
}

new PomodoroTimer();
