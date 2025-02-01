class TaskManager {
  constructor() {
    this.tasks = [];
    this.dom = {
      taskInput: document.getElementById('task-input'),
      taskList: document.getElementById('task-list'),
      addTaskBtn: document.getElementById('add-task')
    };

    this.initEventListeners();
  }

  initEventListeners() {
    this.dom.addTaskBtn.addEventListener('click', () => this.addTask());
    this.dom.taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.addTask();
    });
  }

  addTask() {
    const taskText = this.dom.taskInput.value.trim();
    if (taskText === '') return;

    const li = document.createElement('li');
    li.textContent = taskText;
    li.addEventListener('click', () => li.classList.toggle('completed'));
    
    this.dom.taskList.appendChild(li);
    this.dom.taskInput.value = '';
  }
}

new TaskManager();
