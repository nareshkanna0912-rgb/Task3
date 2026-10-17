
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompleted = document.getElementById("clearCompleted");
const filters = document.querySelector(".filters");

// Load saved tasks
let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("tasks") || "[]"
    );

    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch (error) {
    console.error("Unable to load saved tasks:", error);
}

let currentFilter = "all";

// Save tasks automatically
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.dataset.id = task.id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.className = "toggle-task";
        checkbox.setAttribute("aria-label", "Complete " + task.text);

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.type = "button";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.type = "button";

        li.append(checkbox, span, editBtn, deleteBtn);

        taskList.appendChild(li);
    });

    const remaining = tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent =
        `${remaining} task${remaining === 1 ? "" : "s"} remaining`;

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    saveTasks();
}

// CREATE TASK
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") return;

    const newTask = {
        id: crypto.randomUUID(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";

    renderTasks();
    taskInput.focus();
});

// EVENT DELEGATION
taskList.addEventListener("click", function(event) {

    const item = event.target.closest(".task-item");

    if (!item) return;

    const id = item.dataset.id;

    // DELETE TASK
    if (event.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        renderTasks();
    }

    // EDIT TASK
    if (event.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        if (!task) return;

        const updatedText = prompt(
            "Edit your task:",
            task.text
        );

        if (updatedText !== null && updatedText.trim() !== "") {

            task.text = updatedText.trim().slice(0, 150);

            renderTasks();
        }
    }
});

// COMPLETE TASK
taskList.addEventListener("change", function(event) {

    if (event.target.classList.contains("toggle-task")) {

        const item = event.target.closest(".task-item");

        const task = tasks.find(
            task => task.id === item.dataset.id
        );

        if (task) {
            task.completed = event.target.checked;
            renderTasks();
        }
    }
});

// FILTER TASKS
filters.addEventListener("click", function(event) {

    if (!event.target.classList.contains("filter")) return;

    currentFilter = event.target.dataset.filter;

    document.querySelectorAll(".filter").forEach(button => {

        button.classList.remove("active");

        button.setAttribute("aria-pressed", "false");
    });

    event.target.classList.add("active");
    event.target.setAttribute("aria-pressed", "true");

    renderTasks();
});

// CLEAR COMPLETED TASKS
clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(task => !task.completed);

    renderTasks();
});

// Initial display
document.querySelectorAll(".filter").forEach(button => {
    button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === currentFilter)
    );
});

renderTasks();
