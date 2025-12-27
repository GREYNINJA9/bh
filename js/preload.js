// js/preload.js
// Simple preloader module: shows an overlay until the page has loaded, with configurable minimum show time
(function() {
  const DEFAULTS = {
    minShowTime: 500,
    autoHide: true,
    fadeDuration: 600
  };

  let config = Object.assign({}, DEFAULTS);
  let startTime = performance.now();
  let preloaderEl = null;
  let mounted = false;

  function mount() {
    if (mounted) return;
    mounted = true;
    preloaderEl = document.createElement('div');
    preloaderEl.className = 'preloader';
    preloaderEl.innerHTML = `
      <div class="preloader-inner">
        <div class="floating-heart">❤️</div>
        <div class="preloader-text">Loading our story...</div>
      </div>
    `;
    document.body.appendChild(preloaderEl);
  }

  function show() {
    mount();
    preloaderEl.classList.remove('fade-out');
    preloaderEl.style.pointerEvents = 'auto';
  }

  function hide() {
    if (!preloaderEl) return;
    preloaderEl.classList.add('fade-out');
    preloaderEl.style.pointerEvents = 'none';
    setTimeout(() => {
      if (preloaderEl && preloaderEl.parentNode) {
        preloaderEl.parentNode.removeChild(preloaderEl);
        preloaderEl = null;
      }
      // Notify that preloader has been hidden
      window.dispatchEvent(new Event('preloaderHidden'));
      console.log('Preloader hidden at', new Date().toISOString());
    }, config.fadeDuration + 50);
  }

  function setMinShowTime(ms) { config.minShowTime = Math.max(0, Number(ms) || DEFAULTS.minShowTime); }
  function setAutoHide(value) { config.autoHide = !!value; }

  function init() {
    mount();
    startTime = performance.now();
    if (config.autoHide) {
      window.addEventListener('load', () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const remaining = Math.max(0, config.minShowTime - elapsed);
        setTimeout(hide, remaining);
      });
    }
  }

  // Public API
  window.Preloader = {
    init,
    show,
    hide,
    setMinShowTime,
    setAutoHide
  };

  // Auto-init immediately so it's visible on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
