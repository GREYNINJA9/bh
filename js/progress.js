// js/progress.js
// Simple progress bar using hearts that fills based on scroll progress.
(function() {
  const DEFAULTS = { heartCount: 10, showLabel: true };
  let config = Object.assign({}, DEFAULTS);
  let container = null;
  let hearts = [];
  let label = null;

  function build() {
    container = document.createElement('div');
    container.className = 'progress-bar-container';
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    container.appendChild(fill);

    const heartsWrap = document.createElement('div');
    heartsWrap.className = 'progress-hearts';
    for (let i = 0; i < config.heartCount; i++) {
      const h = document.createElement('span');
      h.className = 'progress-heart';
      h.textContent = '❤️';
      heartsWrap.appendChild(h);
      hearts.push(h);
    }
    container.appendChild(heartsWrap);

    if (config.showLabel) {
      label = document.createElement('div');
      label.className = 'progress-label';
      label.textContent = '0%';
      container.appendChild(label);
    }
    document.body.appendChild(container);
  }

  function refresh() {
    // Remove and rebuild for new count
    if (container && container.parentNode) container.parentNode.removeChild(container);
    hearts = [];
    build();
    update();
  }

  function setHeartCount(count) { config.heartCount = Math.max(3, Math.floor(count) || DEFAULTS.heartCount); refresh(); }
  function toggleLabel(value) { config.showLabel = !!value; refresh(); }

  function getProgress() { const scrolled = window.scrollY; const height = document.documentElement.scrollHeight - window.innerHeight; return height <= 0 ? 0 : Math.min(1, scrolled / height); }

  function update() {
    if (!container) return;
    const p = getProgress();
    const fillEl = container.querySelector('.progress-fill');
    if (fillEl) fillEl.style.width = (p * 100) + '%';
    const filledHeartsCount = Math.round(p * hearts.length);
    hearts.forEach((h, i) => {
      h.classList.toggle('filled', i < filledHeartsCount);
    });
    if (label) label.textContent = Math.round(p * 100) + '%';
  }

  function init() {
    build();
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.ProgressBar = { setHeartCount, toggleLabel, refresh };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
