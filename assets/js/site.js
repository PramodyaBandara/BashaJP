
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').pop() || 'index.html';
  const key = 'bashajp-progress';
  const completed = JSON.parse(localStorage.getItem(key) || '[]');

  const btn = document.getElementById('mark-complete');
  const status = document.getElementById('lesson-status');

  function render() {
    const done = completed.includes(path);
    if (btn) btn.textContent = done ? '✓ Completed' : 'Mark lesson complete';
    if (status) status.textContent = done ? 'මෙම පාඩම complete කර ඇත.' : 'මෙම පාඩම තවම complete කර නැත.';
    document.querySelectorAll('[data-lesson-file]').forEach(el => {
      const f = el.getAttribute('data-lesson-file');
      if (completed.includes(f)) el.textContent = '✓';
    });
    const count = completed.length;
    document.querySelectorAll('[data-progress-count]').forEach(el => el.textContent = count);
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const idx = completed.indexOf(path);
      if (idx >= 0) completed.splice(idx, 1);
      else completed.push(path);
      localStorage.setItem(key, JSON.stringify(completed));
      render();
    });
  }

  render();
});
