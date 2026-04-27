/* ============================================================
   nav.js — Shared page transition logic
   Include this on every page with: <script src="nav.js"></script>
   ============================================================ */

/**
 * Navigate to another page with a fade-out transition.
 * Call this on any click handler: onclick="navigateTo('projects.html')"
 *
 * @param {string} url - The target page filename, e.g. 'projects.html'
 */
function navigateTo(url) {
  const wrapper = document.querySelector('.page-wrapper');
  if (!wrapper) {
    window.location.href = url;
    return;
  }
  // Trigger fade-out animation, then redirect
  wrapper.style.opacity = '0';
  wrapper.style.transform = 'translateY(-8px)';
  wrapper.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
  setTimeout(() => { window.location.href = url; }, 280);
}

/**
 * Copy a string to the clipboard and show a toast notification.
 * Used on the Contact page for phone/discord.
 *
 * @param {string} val - The text to copy
 */
function copyVal(val) {
  navigator.clipboard.writeText(val).catch(() => {
    // Fallback for browsers that block clipboard API
    const ta = document.createElement('textarea');
    ta.value = val; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
  });
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1600);
  }
}

/**
 * Generate a fake barcode into a container element.
 * Heights are randomized per seed so each card looks different.
 *
 * @param {string} containerId - ID of the .ac-bars div
 * @param {number} seed        - Seed number for pseudo-random heights
 */
function makeBars(containerId, seed) {
  const el = document.getElementById(containerId);
  if (!el) return;
  // Simple seeded heights — looks like a real barcode
  const heights = [28,16,32,20,26,14,30,22,28,18,24,32].map(
    (h, i) => Math.max(12, (h + (seed * (i+1) * 7) % 18))
  );
  el.innerHTML = heights.map(h => `<span style="height:${h}px"></span>`).join('');
}

/**
 * Fill a fingerprint dot grid for decorative effect on access cards.
 * @param {string} containerId - ID of the .ac-fp div
 */
function makeFP(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    el.appendChild(s);
  }
}

// Auto-run on page load: fade the page in
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.page-wrapper');
  if (wrapper) {
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
      wrapper.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });
  }
});