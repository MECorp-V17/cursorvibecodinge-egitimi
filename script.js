const STORAGE_KEY = "gorevler";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const error = document.querySelector("#form-error");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const summary = document.querySelector("#summary");
const count = document.querySelector("#todo-count");
const progressBar = document.querySelector("#progress-bar");

let todos = loadTodos();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    error.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }

  error.hidden = true;
  input.removeAttribute("aria-invalid");
  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });
  input.value = "";
  saveTodos();
  render();
  input.focus();
});

input.addEventListener("input", () => {
  if (input.value.trim()) {
    error.hidden = true;
    input.removeAttribute("aria-invalid");
  }
});

list.addEventListener("change", (event) => {
  const toggle = event.target.closest(".toggle");
  if (!toggle) return;

  const item = todos.find((todo) => todo.id === toggle.dataset.id);
  if (!item) return;

  item.completed = toggle.checked;
  saveTodos();
  render();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest(".delete");
  if (!button) return;

  todos = todos.filter((todo) => todo.id !== button.dataset.id);
  saveTodos();
  render();
});

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (todo) =>
        todo &&
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean"
    );
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.completed ? " completed" : "");

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.className = "toggle";
    toggle.checked = todo.completed;
    toggle.dataset.id = todo.id;
    toggle.setAttribute(
      "aria-label",
      todo.completed ? "Tamamlandı işaretini kaldır" : "Tamamlandı olarak işaretle"
    );

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = todo.text;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "delete";
    button.dataset.id = todo.id;
    button.textContent = "Sil";
    button.setAttribute("aria-label", `"${todo.text}" görevini sil`);

    item.append(toggle, text, button);
    list.append(item);
  });

  const total = todos.length;
  const done = todos.filter((todo) => todo.completed).length;
  emptyState.hidden = total > 0;
  summary.hidden = total === 0;
  count.textContent = total === 0 ? "" : `${done} / ${total} görev tamamlandı`;
  progressBar.style.width = total === 0 ? "0%" : `${Math.round((done / total) * 100)}%`;
}

render();
