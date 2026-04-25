// ── page transition router ──
function navigateTo(url) {
  const wrapper = document.querySelector('.page-wrapper');
  if (!wrapper) { window.location.href = url; return; }
  wrapper.classList.add('page-exit');
  setTimeout(() => { window.location.href = url; }, 280);
}

// Intercept all internal links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-nav]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(a.getAttribute('href'));
    });
  });
});
