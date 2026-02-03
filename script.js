let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const name = taskInput.value;
  const energy = document.getElementById("energy").value;
  const duration = document.getElementById("duration").value;

  if (!name) return;

  tasks.push({
    name,
    energy,
    duration,
    completed: false,
    created: Date.now()
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  renderTasks();
}

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${task.completed ? "🌸" : "🌱"} ${task.name}
      <button onclick="completeTask(${i})">✓</button>`;
    taskList.appendChild(li);
  });
}

function completeTask(i) {
  tasks[i].completed = true;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderGarden() {
  const garden = document.getElementById("garden");
  if (!garden) return;

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "plant " + (task.completed ? "bloom" : "grow");
    div.textContent = task.completed ? "🌸 " : "🌱 ";
    div.textContent += task.name;
    garden.appendChild(div);
  });
}

renderTasks();
renderGarden();
