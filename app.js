let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const statusText = document.getElementById('status');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

const startSound = new Audio('sounds/bell-start.mp3');
const endSound = new Audio('sounds/bell-end.mp3');

function updateDisplay() {
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timer);
          isRunning = false;
          if (isWorkTime) {
            statusText.textContent = "Tempo di pausa!";
            endSound.play();
            minutes = 5; // Pausa di 5 minuti
          } else {
            statusText.textContent = "Tempo di lavoro!";
            startSound.play();
            minutes = 25; // Lavoro di 25 minuti
          }
          isWorkTime = !isWorkTime;
        } else {
          minutes--;
          seconds = 59;
        }
      } else {
        seconds--;
      }
      updateDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  minutes = 25;
  seconds = 0;
  isWorkTime = true;
  statusText.textContent = "Pronto per iniziare!";
  updateDisplay();
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
