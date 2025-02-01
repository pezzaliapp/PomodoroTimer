class PomodoroApp {
  constructor() {
    this.timerWorker = new Worker('timer-worker.js');
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.targetTime = 0;
    this.isRunning = false;
    this.isWorkTime = true;
    this.pomodoroCount = 0;
    this.currentTask = null;
    this.breakSuggestions = [
      "Fai stretching 🧘♂️",
      "Bevi acqua 🚰",
      "Cammina per 2 minuti 🚶♂️",
      "Respira profondamente 🌬️",
      "Fai esercizi oculari 👀",
      "Organizza la scrivania 🗃️"
    ];

    this.initDOM();
    this.initEventListeners();
    this.initServiceWorker();
    this.initVisibilityHandler();
    this.loadState();
  }

  initDOM() {
    this.dom = {
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      status: document.getElementById('status'),
      startBtn: document.getElementById('start'),
      pauseBtn: document.getElementById('pause'),
      resetBtn: document.getElementById('reset'),
      taskInput: document.getElementById('task-input'),
      prioritySelect: document.getElementById('priority'),
      taskList: document.getElementById('task-list'),
      pomodoroCounter: document.getElementById('count'),
      breakIdeas: document.getElementById('break-ideas'),
      subtaskDialog: document.getElementById('subtask-dialog'),
      subtaskInput: document.getElementById('subtask-input'),
      subtaskList: document.getElementById('subtask-list')
    };

    this.renderBreakIdeas();
    this.setupAudio();
  }

  initEventListeners() {
    this.dom.startBtn.addEventListener('click', () => this.startTimer());
    this.dom.pauseBtn.addEventListener('click', () => this.pauseTimer());
    this.dom.resetBtn.addEventListener('click', () => this.resetTimer());
    
    this.dom.taskInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.addTask();
    });
    
    document.getElementById('add-task').addEventListener('click', () => this.addTask());
    document.getElementById('add-subtask').addEventListener('click', () => this.addSubtask());
    document.getElementById('close-dialog').addEventListener('click', () => this.closeSubtaskDialog());

    this.dom.taskList.addEventListener('click', e => {
      if (e.target.closest('.start-task')) this.startTask(e);
      if (e.target.closest('.complete-task')) this.toggleTask(e);
      if (e.target.closest('.break-task')) this.openSubtaskDialog(e);
    });
  }

  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('SW registrato:', reg))
        .catch(err => console.error('SW errore:', err));
    }
  }

  initVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isRunning) {
        this.syncTimer();
      }
    });
  }

  startTimer() {
    if (!this.isRunning && this.currentTask) {
      this.isRunning = true;
      this.targetTime = Date.now() + (this.currentMinutes * 60000) + (this.currentSeconds * 1000);
      
      this.timerWorker.postMessage({
        command: 'start',
        targetTime: this.targetTime
      });

      this.timerWorker.onmessage = e => {
        this.updateDisplay(e.data.minutes, e.data.seconds);
        
        if (e.data.finished) {
          this.handleSessionEnd();
        }
      };

      this.playSound('start');
      this.dom.status.textContent = `Lavorando su: ${this.currentTask.text}`;
      this.saveState();
    }
  }

  pauseTimer() {
    if (this.isRunning) {
      this.isRunning = false;
      this.timerWorker.postMessage({ command: 'pause' });
      this.dom.status.textContent = 'In pausa ⏸️';
      this.saveState();
    }
  }

  resetTimer() {
    this.isRunning = false;
    this.timerWorker.postMessage({ command: 'reset' });
    this.updateDisplay(25, 0);
    this.dom.status.textContent = 'Pronto per iniziare!';
    this.currentTask = null;
    this.saveState();
  }

  handleSessionEnd() {
    this.pomodoroCount++;
    this.isRunning = false;
    this.isWorkTime = !this.isWorkTime;
    
    if (this.isWorkTime) {
      this.playSound('end');
      this.updateDisplay(25, 0);
      this.dom.status.textContent = 'Pausa terminata! Torna al lavoro 🚀';
    } else {
      this.playSound('start');
      this.updateDisplay(5, 0);
      this.dom.status.textContent = 'Lavoro completato! Pausa breve ☕';
    }

    this.saveState();
    this.updateTaskProgress();
  }

  syncTimer() {
    const remaining = this.targetTime - Date.now();
    if (remaining > 0) {
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      this.updateDisplay(minutes, seconds);
    } else {
      this.handleSessionEnd();
    }
  }

  updateDisplay(minutes, seconds) {
    this.dom.minutes.textContent = String(minutes).padStart(2, '0');
    this.dom.seconds.textContent = String(seconds).padStart(2, '0');
    this.dom.pomodoroCounter.textContent = this.pomodoroCount;
  }

  // ... (altri metodi per gestione task, audio, state management)
}

// Inizializza l'app
new PomodoroApp();
