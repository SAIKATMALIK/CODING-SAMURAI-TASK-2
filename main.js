document.addEventListener('DOMContentLoaded', function() {
  const todoForm = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const prioritySelect = document.getElementById('priority-select');
  const addButton = document.getElementById('add-button');
  const filterStatusSelect = document.getElementById('filter-status');
  const sortByPrioritySelect = document.getElementById('sort-by-priority');
  const taskList = document.getElementById('task-list');

  let tasks = [];

  // Load tasks from local storage
  function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = storedTasks;
    renderTasks();
  }

  // Save tasks to local storage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Add task
  function addTask(name, priority) {
    const task = { id: Date.now(), name, priority, completed: false };
    tasks.push(task);
    saveTasks();
    renderTasks();
  }

  // Edit task
  function editTask(id, newName, newPriority) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].name = newName;
      tasks[taskIndex].priority = newPriority;
      saveTasks();
      renderTasks();
    }
  }

  // Delete task
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }

  // Toggle task completion
  function toggleTaskCompletion(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      saveTasks();
      renderTasks();
    }
  }

  // Render tasks
  function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = filterTasks();
    const sortedTasks = sortTasks(filteredTasks);
    
    sortedTasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} class="checkbox">
        <span class="${task.completed ? 'completed' : ''}">${task.name} - Priority: ${task.priority}</span>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
      `;
      li.dataset.id = task.id;

      li.querySelector('.checkbox').addEventListener('change', () => toggleTaskCompletion(task.id));
      li.querySelector('.edit-button').addEventListener('click', () => editTaskPrompt(task.id, task.name, task.priority));
      li.querySelector('.delete-button').addEventListener('click', () => deleteTask(task.id));

      taskList.appendChild(li);
    });
  }

  // Edit task prompt
  function editTaskPrompt(id, currentName, currentPriority) {
    const newName = prompt('Edit task name:', currentName);
    if (newName !== null) {
      const newPriority = prompt('Edit task priority:', currentPriority);
      if (newPriority !== null) {
        editTask(id, newName, newPriority);
      }
    }
  }

  // Filter tasks based on status
  function filterTasks() {
    const statusFilter = filterStatusSelect.value;
    if (statusFilter === 'all') {
      return tasks;
    } else {
      return tasks.filter(task => task.completed === (statusFilter === 'completed'));
    }
  }

  // Sort tasks based on priority
  function sortTasks(tasksToSort) {
    const sortBy = sortByPrioritySelect.value;
    if (sortBy === 'none') {
      return tasksToSort;
    } else {
      return tasksToSort.slice().sort((a, b) => {
        const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }
  }

  // Event listeners
  todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addTask(taskInput.value, prioritySelect.value);
    taskInput.value = '';
  });

  filterStatusSelect.addEventListener('change', renderTasks);
  sortByPrioritySelect.addEventListener('change', renderTasks);

  // Load tasks and render on page load
  loadTasks();
});
