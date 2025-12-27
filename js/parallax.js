// js/parallax.js
// Lightweight parallax effect on elements with class 'sketch-bg'.
(function() {
  const DEFAULTS = { speed: 0.5, maxOffset: 40 };
  let config = Object.assign({}, DEFAULTS);
  let elements = [];
  let running = false;

  function refresh() { elements = Array.from(document.querySelectorAll('.sketch-bg')); }
  function setSpeed(v) { config.speed = Math.max(0, Number(v) || DEFAULTS.speed); }
  function setMaxOffset(px) { config.maxOffset = Math.max(0, Number(px) || DEFAULTS.maxOffset); }
  function destroy() { cancelAnimationFrame(frameId); window.removeEventListener('scroll', tick); elements = []; running = false; }

  let lastScrollY = window.scrollY || 0;
  let frameId = null;

  function tick() {
    lastScrollY = window.scrollY;
    if (!running) return;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      const viewportHeight = window.innerHeight;
      elements.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height * 0.5 - viewportHeight * 0.5;
        const progress = centerY / viewportHeight;
        const translate = Math.max(-config.maxOffset, Math.min(config.maxOffset, -progress * config.maxOffset * config.speed));
        el.style.transform = `translate3d(0, ${translate}px, 0) rotate(${(idx % 2 === 0 ? 1 : -1) * (translate/10)}deg)`;
      });
    });
  }

  function init() {
    refresh();
    running = true;
    window.addEventListener('scroll', tick, { passive: true });
    tick();
    window.ParallaxEffect = { setSpeed, setMaxOffset, refresh, destroy };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
