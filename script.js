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
        if (event.key === "Enter") {
            addTask();
        }
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
        <button class="complete-btn">✔</button>
        <button class="delete-btn">✕</button>
    `;

    li.classList.add("fade-in");

    const span = li.querySelector("span");
    span.addEventListener("dblclick", editTask);
    attachTooltipEvents(span);

    const completeBtn = li.querySelector(".complete-btn");
    completeBtn.addEventListener("click", () => toggleTask(completeBtn));
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => confirmRemove(deleteBtn));

    taskList.appendChild(li);
    taskInput.value = '';
}

function editTask(event) {
    const span = event.target;
    removeTooltip(span);
    
    const input = document.createElement("input");
    input.value = span.textContent;
    input.classList.add("edit-mode");

    span.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
        span.textContent = input.value.trim();
        input.replaceWith(span);
        span.addEventListener("dblclick", editTask);
        attachTooltipEvents(span);
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

function attachTooltipEvents(span) {
    let timer;
    let hideTimer;

    span.addEventListener("mouseenter", function() {
        clearTimeout(hideTimer);

        timer = setTimeout(() => {
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.textContent = "Duplo clique para editar esta tarefa";
            document.body.appendChild(tooltip);

            const rect = span.getBoundingClientRect();
            tooltip.style.left = rect.left + window.pageXOffset + "px";
            tooltip.style.top = (rect.top + window.pageYOffset - tooltip.offsetHeight - 8) + "px";
            span._tooltip = tooltip;

            requestAnimationFrame(() => {
                tooltip.style.opacity = "1";
            });
        }, 500); // Tooltip aparece mais rápido

        span._tooltipTimer = timer;
    });

    span.addEventListener("mouseleave", function() {
        clearTimeout(span._tooltipTimer);

        if (span._tooltip) {
            hideTimer = setTimeout(() => {
                span._tooltip.style.opacity = "0";
                setTimeout(() => {
                    if (span._tooltip && span._tooltip.parentElement) {
                        span._tooltip.parentElement.removeChild(span._tooltip);
                    }
                    span._tooltip = null;
                }, 300);
            }, 500); // Tooltip desaparece mais rápido
        }
    });

    span.addEventListener("dblclick", function() {
        removeTooltip(span);
    });
}

function removeTooltip(span) {
    if (span._tooltip) {
        clearTimeout(span._tooltipTimer);
        span._tooltip.style.opacity = "0";
        setTimeout(() => {
            if (span._tooltip && span._tooltip.parentElement) {
                span._tooltip.parentElement.removeChild(span._tooltip);
            }
            span._tooltip = null;
        }, 100);
    }
}
