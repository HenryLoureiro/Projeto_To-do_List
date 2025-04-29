// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os elementos principais da página
    const taskList = document.getElementById("taskList");
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const darkModeBtn = document.getElementById("darkModeBtn");
    const filterToggle = document.getElementById("filterToggle");
    const filterOptions = document.getElementById("filterOptions");

    // Ao carregar a página, remove quaisquer tarefas (reset dos dados)
    loadTasks();
    // Carrega a preferência do modo escuro, se houver
    loadDarkMode();

    // Evento do botão "Adicionar tarefa"
    addTaskBtn.addEventListener("click", addTask);
    // Permite adicionar tarefas pressionando "Enter"
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });

    // Evento para alternar o modo escuro e atualizar o ícone
    darkModeBtn.addEventListener("click", toggleDarkMode);

    // Evento para mostrar/ocultar as opções de filtro
    filterToggle.addEventListener("click", () => {
        filterOptions.classList.toggle("hidden");
    });

    // Adiciona evento para cada botão de filtro
    document.querySelectorAll("#filterOptions button").forEach(button => {
        button.addEventListener("click", () => {
            filterTasks(button.getAttribute("data-filter"));
        });
    });
});

// Função para adicionar uma nova tarefa
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const text = taskInput.value.trim();
    if (!text) return; // Se o campo estiver vazio, não faz nada

    // Cria um item de lista (<li>) com a tarefa e seus botões
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${text}</span>
        <button class="complete-btn">✔</button>
        <button class="delete-btn">✕</button>
    `;
    
    // Aplica a animação de fade-in para a nova tarefa
    li.classList.add("fade-in");

    // Evento para editar a tarefa (duplo clique no texto)
    const span = li.querySelector("span");
    span.addEventListener("dblclick", editTask);
    // Anexa tooltip que será exibido após 1 segundo ao passar o mouse
    attachTooltipEvents(span);
    
    // Eventos para concluir e excluir a tarefa
    const completeBtn = li.querySelector(".complete-btn");
    completeBtn.addEventListener("click", () => toggleTask(completeBtn));
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => confirmRemove(deleteBtn));

    // Adiciona a nova tarefa à lista e limpa o input
    taskList.appendChild(li);
    taskInput.value = '';
}

// Função para editar uma tarefa (edição inline via duplo clique)
function editTask(event) {
    const span = event.target;
    // Cria um input pré-preenchido com o texto atual da tarefa
    const input = document.createElement("input");
    input.value = span.textContent;
    input.classList.add("edit-mode");
    
    // Substitui o <span> pelo <input> e foca para edição
    span.replaceWith(input);
    input.focus();
    
    // Ao sair do input, salva o novo texto e volta ao modo de exibição
    input.addEventListener("blur", () => {
        span.textContent = input.value.trim();
        input.replaceWith(span);
        // Reanexa os eventos de edição e tooltip
        span.addEventListener("dblclick", editTask);
        attachTooltipEvents(span);
    });

    // Se o usuário pressionar "Enter", o input perde o foco automaticamente
    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") input.blur();
    });
}

// Função para confirmar e remover uma tarefa com animação de fade-out
function confirmRemove(btn) {
    if (confirm("Deseja excluir esta tarefa?")) {
        const li = btn.parentElement;
        li.classList.add("fade-out");
        li.addEventListener("animationend", () => {
            li.remove();
        });
    }
}

// Alterna o status "concluído" da tarefa
function toggleTask(btn) {
    const li = btn.parentElement;
    li.classList.toggle("checked");
}

// Filtra as tarefas de acordo com o filtro selecionado
function filterTasks(filterType) {
    const tasks = document.querySelectorAll("#taskList li");
    tasks.forEach(task => {
        // Exibe todas as tarefas inicialmente
        task.style.display = "flex";
        // Se o filtro for "completed" e a tarefa não estiver marcada, oculta-a
        if (filterType === "completed" && !task.classList.contains("checked")) {
            task.style.display = "none";
        }
        // Se o filtro for "pending" e a tarefa estiver marcada, oculta-a
        if (filterType === "pending" && task.classList.contains("checked")) {
            task.style.display = "none";
        }
    });
}

// Remove quaisquer tarefas armazenadas (dados não persistem)
function loadTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
}

// Alterna o modo escuro e atualiza o ícone do botão
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const darkModeBtn = document.getElementById("darkModeBtn");
    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.innerHTML = "☀️";
    } else {
        darkModeBtn.innerHTML = "🌙";
    }
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Carrega a preferência do modo escuro e define o ícone do botão
function loadDarkMode() {
    const darkModeBtn = document.getElementById("darkModeBtn");
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        darkModeBtn.innerHTML = "☀️";
    } else {
        darkModeBtn.innerHTML = "🌙";
    }
}

// Função para exibir o tooltip de edição quando o mouse permanece sobre a tarefa por 1 segundo
function attachTooltipEvents(span) {
    let timer;
    span.addEventListener("mouseenter", function() {
        timer = setTimeout(() => {
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.textContent = "Duplo clique para editar esta tarefa";
            document.body.appendChild(tooltip);
            
            // Posiciona o tooltip acima do <span>
            const rect = span.getBoundingClientRect();
            tooltip.style.left = rect.left + window.pageXOffset + "px";
            tooltip.style.top = (rect.top + window.pageYOffset - tooltip.offsetHeight - 8) + "px";
            span._tooltip = tooltip;
            requestAnimationFrame(() => {
                tooltip.style.opacity = "1";
            });
        }, 1000);
        span._tooltipTimer = timer;
    });
    
    span.addEventListener("mouseleave", function() {
        clearTimeout(span._tooltipTimer);
        if (span._tooltip) {
            span._tooltip.style.opacity = "0";
            setTimeout(() => {
                if (span._tooltip && span._tooltip.parentElement) {
                    span._tooltip.parentElement.removeChild(span._tooltip);
                }
                span._tooltip = null;
            }, 300);
        }
    });
}
