const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const completedCountEl = document.getElementById('completedCount');
const pendingCountEl = document.getElementById('pendingCount');
const focusBar = document.getElementById('focusBar');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

addTaskBtn?.addEventListener('click', addTask);
taskInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    done: false
  };

  tasks.push(task);
  save();
  renderAll();
  taskInput.value = '';
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  save();
  renderAll();
}

function deleteTask(id, el) {
  el.classList.add('fade-out');
  setTimeout(() => {
    tasks = tasks.filter(t => t.id !== id);
    save();
    renderAll();
  }, 300);
}

function renderAll() {
  renderTasks();
  updateStats();
  renderNeglected();
}

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const card = document.createElement('div');
    card.className = 'card task-card slide-up';
    if (task.done) card.classList.add('done');

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-btn" aria-label="Delete task">✖</button>
    `;

    card.addEventListener('click', e => {
      if (e.target.classList.contains('delete-btn')) return;
      toggleTask(task.id);
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') toggleTask(task.id);
    });

    card.querySelector('.delete-btn').addEventListener('click', e => {
      e.stopPropagation();
      deleteTask(task.id, card);
    });

    card.draggable = true;
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', index);
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    taskList.appendChild(card);
  });

  enableDrag();
}

function enableDrag() {
  const cards = [...document.querySelectorAll('.task-card')];

  cards.forEach(card => {
    card.addEventListener('dragover', e => e.preventDefault());
    card.addEventListener('drop', e => {
      e.preventDefault();
      const from = e.dataTransfer.getData('text/plain');
      const to = cards.indexOf(card);
      tasks.splice(to, 0, tasks.splice(from, 1)[0]);
      save();
      renderAll();
    });
  });
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

function renderNeglected() {
  const container = document.querySelector('.neglected .task-list');
  if (!container) return;

  container.innerHTML = '';
  tasks.filter(t => !t.done).forEach(t => {
    const div = document.createElement('div');
    div.className = 'card task-card wilt';
    div.textContent = t.text;
    container.appendChild(div);
  });
}

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderAll();
