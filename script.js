document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("taskList");
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const darkModeBtn = document.getElementById("darkModeBtn");
    const filterToggle = document.getElementById("filterToggle");
    const filterOptions = document.getElementById("filterOptions");
  
    loadTasks();
    loadDarkMode();
  
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") addTask();
    });
  
    darkModeBtn.addEventListener("click", toggleDarkMode);
  
    filterToggle.addEventListener("click", () => {
      filterOptions.classList.toggle("hidden");
    });
  
    document.querySelectorAll("#filterOptions button").forEach(button => {
      button.addEventListener("click", () => {
        filterTasks(button.getAttribute("data-filter"));
      });
    });
  });
  
  function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const text = taskInput.value.trim();
    if (!text) return;
  
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${text}</span>
      <button class="edit-btn" title="Editar">✏️</button>
      <button class="complete-btn">✔</button>
      <button class="delete-btn">✕</button>
    `;
    li.classList.add("fade-in");
  
    const span = li.querySelector("span");
    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => editTask({ target: span }));
  
    const completeBtn = li.querySelector(".complete-btn");
    completeBtn.addEventListener("click", () => toggleTask(completeBtn));
  
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => confirmRemove(deleteBtn));
  
    taskList.appendChild(li);
    taskInput.value = '';
  }
  
  function editTask(event) {
    const span = event.target;
    const input = document.createElement("input");
    input.value = span.textContent;
    input.classList.add("edit-mode");
    span.replaceWith(input);
    input.focus();
  
    input.addEventListener("blur", () => {
      span.textContent = input.value.trim();
      input.replaceWith(span);
    });
  
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") input.blur();
    });
  }
  
  function confirmRemove(btn) {
    if (confirm("Deseja excluir esta tarefa?")) {
      const li = btn.parentElement;
      li.classList.add("fade-out");
      li.addEventListener("animationend", () => {
        li.remove();
      });
    }
  }
  
  function toggleTask(btn) {
    const li = btn.parentElement;
    li.classList.toggle("checked");
  }
  
  function filterTasks(filterType) {
    const tasks = document.querySelectorAll("#taskList li");
    tasks.forEach(task => {
      task.style.display = "flex";
      if (filterType === "completed" && !task.classList.contains("checked")) {
        task.style.display = "none";
      }
      if (filterType === "pending" && task.classList.contains("checked")) {
        task.style.display = "none";
      }
    });
  }
  
  function loadTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
  }
  
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const darkModeBtn = document.getElementById("darkModeBtn");
    darkModeBtn.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  }
  
  function loadDarkMode() {
    const darkModeBtn = document.getElementById("darkModeBtn");
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      darkModeBtn.innerHTML = "☀️";
    } else {
      darkModeBtn.innerHTML = "🌙";
    }
  }
  