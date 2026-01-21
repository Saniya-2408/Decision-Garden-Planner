const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const completedCountEl = document.getElementById('completedCount');
const pendingCountEl = document.getElementById('pendingCount');
const focusBar = document.getElementById('focusBar');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(task => renderTask(task));
  updateStats();
}

addTaskBtn?.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text === '') return;
  const task = { text, done: false };
  tasks.push(task);
  renderTask(task);
  saveTasks();
  taskInput.value = '';
  updateStats();
});

function renderTask(task) {
  const div = document.createElement('div');
  div.className = 'card task-card';
  if (task.done) div.classList.add('done');
  div.textContent = task.text;

  div.addEventListener('click', () => {
    task.done = !task.done;
    div.classList.toggle('done');
    updateStats();
    saveTasks();
  });

  taskList?.appendChild(div);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStats() {
  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.length - completed;
  completedCountEl && (completedCountEl.textContent = completed);
  pendingCountEl && (pendingCountEl.textContent = pending);

  if (focusBar) {
    const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    focusBar.style.width = pct + '%';
  }
}
