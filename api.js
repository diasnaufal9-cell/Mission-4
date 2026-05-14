// ── State ────────────────────────────────────────────────────────
// Load persisted todos from localStorage (or start with empty array)
let todos  = JSON.parse(localStorage.getItem('todos-v2') || '[]');
let filter = 'all'; // current filter: 'all' | 'active' | 'done'

// ── Persistence ───────────────────────────────────────────────────
function save() {
  // Convert the array to JSON and store it in the browser
  localStorage.setItem('todos-v2', JSON.stringify(todos));
}

// ── Render ────────────────────────────────────────────────────────
function render() {
  const ul = document.getElementById('todo-list');

  // Filter the todos array based on the active button
  const visible = todos.filter((t) =>
    filter === 'all' ||
    (filter === 'done'   &&  t.done) ||
    (filter === 'active' && !t.done)
  );

  ul.innerHTML = ''; // clear before re-drawing

  visible.forEach((todo) => {
    const idx = todos.indexOf(todo); // original index for mutations

    // ── List item ─────────────────────────────────────────────────
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    // ── Text span ─────────────────────────────────────────────────
    const span       = document.createElement('span');
    span.className   = 'text';
    span.textContent = todo.text;

    // ── Delete button ─────────────────────────────────────────────
    const del       = document.createElement('button');
    del.className   = 'del';
    del.textContent = '×'; // times symbol
    del.title       = 'Delete';
    del.onclick = (e) => {
      e.stopPropagation();   // prevent toggle when clicking delete
      todos.splice(idx, 1);
      save();
      render();
    };

    // ── Toggle done on item click ─────────────────────────────────
    li.onclick = () => {
      todos[idx].done = !todos[idx].done;
      save();
      render();
    };

    li.appendChild(span);
    li.appendChild(del);
    ul.appendChild(li);
  });

  // Update the "X remaining" count in the footer
  const remaining = todos.filter((t) => !t.done).length;
  document.getElementById('count').textContent = remaining + ' remaining';
}

// ── Add todo ──────────────────────────────────────────────────────
document.getElementById('add-btn').addEventListener('click', () => {
  const inp  = document.getElementById('todo-input');
  const text = inp.value.trim();
  if (!text) return;

  todos.push({ text, done: false });
  inp.value = '';
  save();
  render();
});

// Allow pressing Enter to submit
document.getElementById('todo-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('add-btn').click();
});

// ── Clear completed ───────────────────────────────────────────────
document.getElementById('clear-done').addEventListener('click', () => {
  todos = todos.filter((t) => !t.done);
  save();
  render();
});

// ── Filter buttons ────────────────────────────────────────────────
document.querySelectorAll('.filter').forEach((btn) => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;

    // Remove 'active' from all filter buttons, then add to clicked one
    document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    render();
  });
});

// ── Initial render ────────────────────────────────────────────────
render();