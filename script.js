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
  tasks.push({ id: Date.now(), text, done: false });
  save();
  render();
  taskInput.value = '';
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  save();
  render();
}

function deleteTask(id, el) {
  el.classList.add('fade-out');
  setTimeout(() => {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }, 300);
}

function render() {
  renderTasks();
  updateStats();
  renderNeglected();
}

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = '';
  tasks.forEach((task, i) => {
    const card = document.createElement('div');
    card.className = 'card task-card slide-up' + (task.done ? ' done' : '');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `<span>${task.text}</span><button class="delete-btn">✖</button>`;
    card.onclick = e => {
      if (e.target.tagName === 'BUTTON') return;
      toggleTask(task.id);
    };
    card.onkeydown = e => {
      if (e.key === 'Enter') toggleTask(task.id);
    };
    card.querySelector('.delete-btn').onclick = e => {
      e.stopPropagation();
      deleteTask(task.id, card);
    };
    card.draggable = true;
    card.ondragstart = e => e.dataTransfer.setData('i', i);
    card.ondrop = e => {
      e.preventDefault();
      const from = e.dataTransfer.getData('i');
      tasks.splice(i, 0, tasks.splice(from, 1)[0]);
      save();
      render();
    };
    card.ondragover = e => e.preventDefault();
    taskList.appendChild(card);
  });
}

function updateStats() {
  const done = tasks.filter(t => t.done).length;
  completedCountEl && (completedCountEl.textContent = done);
  pendingCountEl && (pendingCountEl.textContent = tasks.length - done);
  if (focusBar) focusBar.style.width = tasks.length ? (done / tasks.length) * 100 + '%' : '0%';
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

render();
