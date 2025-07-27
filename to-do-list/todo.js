let allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const priority = prompt("Enter priority: high / medium / low", "low") || "low";

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    trashed: false,
    priority: priority.toLowerCase()
  };

  allTasks.push(task);
  taskInput.value = '';
  saveTasks();
  filterTasks(currentFilter);
}

function filterTasks(category) {
  currentFilter = category;
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  let filteredTasks = [];
  if (category === 'all') {
    filteredTasks = allTasks.filter(t => !t.trashed);
  } else if (category === 'completed') {
    filteredTasks = allTasks.filter(t => t.completed && !t.trashed);
  } else if (category === 'trash') {
    filteredTasks = allTasks.filter(t => t.trashed);
  } else if (category === 'remainders') {
    filteredTasks = allTasks.filter(t => !t.completed && !t.trashed);
  }

  filteredTasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.className = task-card priority-${task.priority};

    const content = document.createElement('div');
    content.textContent = task.text;
    if (task.completed) content.style.textDecoration = 'line-through';

    const btnGroup = document.createElement('div');
    btnGroup.classList.add('float-end');

    const checkBtn = document.createElement('button');
    checkBtn.className = 'icon-btn';
    checkBtn.innerHTML = task.completed ? '✅' : '✔';
    checkBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      filterTasks(currentFilter);
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.innerHTML = task.trashed ? '♻' : '🗑';
    delBtn.onclick = () => {
      if (task.trashed) {
        allTasks = allTasks.filter(t => t.id !== task.id);
      } else {
        task.trashed = true;
      }
      saveTasks();
      filterTasks(currentFilter);
    };

    btnGroup.appendChild(checkBtn);
    btnGroup.appendChild(delBtn);
    taskCard.appendChild(content);
    taskCard.appendChild(btnGroup);

    taskList.appendChild(taskCard);
  });
}

window.onload = () => filterTasks('all');
