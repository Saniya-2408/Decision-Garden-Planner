const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const completedCountEl = document.getElementById('completedCount');
const pendingCountEl = document.getElementById('pendingCount');
const focusBar = document.getElementById('focusBar');

const TODAY = new Date().toDateString();
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function todayTaskCount() {
  return tasks.filter(t => t.createdAt === TODAY).length;
}

addTaskBtn?.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return;

  if (todayTaskCount() >= 5) {
    alert("Max 5 tasks per day");
    return;
  }

  const task = {
    id: Date.now(),
    text,
    stage: 'seed',
    createdAt: TODAY,
    lastUpdated: TODAY
  };

  tasks.push(task);
  saveTasks();
  renderAll();
  taskInput.value = '';
});

function nextStage(stage) {
  if (stage === 'seed') return 'sprout';
  if (stage === 'sprout') return 'bloom';
  return 'bloom';
}

function updateNeglectedTasks() {
  const now = new Date();
  tasks.forEach(task => {
    const diff = Math.floor((now - new Date(task.lastUpdated)) / (1000 * 60 * 60 * 24));
    if (diff >= 3 && task.stage !== 'bloom') task.stage = 'wilt';
  });
}

function renderAll() {
  updateNeglectedTasks();
  if (taskList) taskList.innerHTML = '';

  tasks.forEach(task => {
    if (!taskList) return;

    const div = document.createElement('div');
    div.className = `card task-card ${task.stage}`;
    div.textContent = `${getEmoji(task.stage)} ${task.text}`;

    div.onclick = () => {
      if (task.stage !== 'bloom') {
        task.stage = nextStage(task.stage);
        task.lastUpdated = TODAY;
        saveTasks();
        renderAll();
      }
    };

    taskList.appendChild(div);
  });

  updateStats();
}

function updateStats() {
  const bloomed = tasks.filter(t => t.stage === 'bloom').length;
  const active = tasks.filter(t => t.stage !== 'wilt').length;

  completedCountEl && (completedCountEl.textContent = bloomed);
  pendingCountEl && (pendingCountEl.textContent = active - bloomed);

  if (focusBar) {
    const pct = tasks.length ? Math.round((bloomed / tasks.length) * 100) : 0;
    focusBar.style.width = pct + '%';
  }
}

function getEmoji(stage) {
  return stage === 'seed' ? '🌱' :
         stage === 'sprout' ? '🌿' :
         stage === 'bloom' ? '🌸' : '🍂';
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderAll();
