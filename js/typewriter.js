// js/typewriter.js
// FIXED: Text appears immediately when section becomes visible
(function() {
  const DEFAULTS = {
    speed: 12,  // Faster typing
    paragraphGap: 100,
    stagger: 50
  };

  let config = Object.assign({}, DEFAULTS);

  function setSpeed(ms) { 
    config.speed = Math.max(1, Number(ms) || DEFAULTS.speed); 
  }
  
  function setParagraphGap(ms) { 
    config.paragraphGap = Math.max(0, Number(ms) || DEFAULTS.paragraphGap); 
  }

  function revealText(node, speed = config.speed) {
    if (!node) return Promise.resolve();
    const text = node.textContent.trim();
    
    // CRITICAL: Make sure node is visible
    node.style.opacity = '1';
    node.style.visibility = 'visible';
    node.textContent = '';
    
    return new Promise(resolve => {
      let i = 0;
      function step() {
        if (i < text.length) {
          node.textContent += text[i++];
          setTimeout(step, speed);
        } else {
          resolve();
        }
      }
      step();
    });
  }

  async function runOnCard(card) {
    if (!card) return;
    
    // Prevent re-running
    if (card.dataset.typewriterDone) return;
    card.dataset.typewriterDone = 'true';
    
    // CRITICAL: Ensure card is visible
    card.style.opacity = '1';
    card.style.visibility = 'visible';
    
    const headings = card.querySelectorAll('h1, h2, h3');
    const paragraphs = card.querySelectorAll('p');
    
    // Make all text visible first (fallback)
    [...headings, ...paragraphs].forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
    
    // Reveal headings
    for (const h of headings) { 
      await revealText(h, config.speed * 0.7);
    }
    
    // Reveal paragraphs
    for (const p of paragraphs) { 
      await new Promise(r => setTimeout(r, config.paragraphGap)); 
      await revealText(p, config.speed); 
    }
  }

  function initObserver() {
    const cards = document.querySelectorAll('.story-card');
    if (!cards || cards.length === 0) return;
    
    // Make all cards visible by default (safety)
    cards.forEach(card => {
      card.style.opacity = '1';
      card.style.visibility = 'visible';
    });
    
    if (!('IntersectionObserver' in window)) {
      cards.forEach(card => runOnCard(card));
      return;
    }

    // CRITICAL FIX: Lower threshold and positive rootMargin
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          // Start immediately when visible
          runOnCard(card);
          o.unobserve(card);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -35% 0px' });

    cards.forEach(card => obs.observe(card));
    
    window.TypewriterEffect = { 
      setSpeed, 
      setParagraphGap,
      runOnCard
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();