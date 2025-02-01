let timer;
let isRunning = false;
let minutes = 25;
let seconds = 0;
let pomodoroCount = 0;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const statusDisplay = document.getElementById('status');
const countDisplay = document.getElementById('count');

function updateDisplay() {
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  statusDisplay.textContent = "Timer in corso...";

  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timer);
        pomodoroCount++;
        countDisplay.textContent = pomodoroCount;
        statusDisplay.textContent = "Pomodoro completato! Prenditi una pausa!";
        isRunning = false;
        minutes = 25;
        seconds = 0;
        updateDisplay();
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timer);
  isRunning = false;
  statusDisplay.textContent = "Timer in pausa.";
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  minutes = 25;
  seconds = 0;
  updateDisplay();
  statusDisplay.textContent = "Pronto per iniziare!";
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
