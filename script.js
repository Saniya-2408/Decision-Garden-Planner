let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const name = taskInput.value.trim();
  if (!name) return;

  tasks.push({
    name,
    completed: false,
    created: Date.now()
  });

  taskInput.value = "";
  save();
  render();
}

function render() {
  if (taskList) {
    taskList.innerHTML = "";
    tasks.forEach((t, i) => {
      const li = document.createElement("li");
      li.textContent = (t.completed ? "🌸 " : "🌱 ") + t.name;
      li.onclick = () => {
        t.completed = true;
        save();
        render();
      };
      taskList.appendChild(li);
    });

    recommendation.textContent =
      tasks.find(t => !t.completed)
        ? "💡 Recommended next: " + tasks.find(t => !t.completed).name
        : "All tasks completed 🌸";
  }

  if (garden) {
    garden.innerHTML = "";
    tasks.forEach(t => {
      const div = document.createElement("div");
      div.className = "plant " + (t.completed ? "bloom" : "grow");
      div.textContent = (t.completed ? "🌸 " : "🌱 ") + t.name;
      garden.appendChild(div);
    });
  }

  if (bar) {
    const completed = tasks.filter(t => t.completed).length;
    const percent = tasks.length ? completed / tasks.length * 100 : 0;
    bar.style.width = percent + "%";
    growthText.textContent = `${completed} of ${tasks.length} tasks completed`;
  }

  if (neglectedList) {
    neglectedList.innerHTML = "";
    tasks.filter(t => !t.completed).forEach(t => {
      const li = document.createElement("li");
      li.textContent = t.name;
      neglectedList.appendChild(li);
    });
  }
}

render();
