// js/interactions.js
// Handles hover/touch effects and scroll-based word reveal
// FIXED: Proper scroll synchronization

function initInteractions() {
  const cards = document.querySelectorAll('.story-section .story-card, .final-section .story-card');

  // Detect touch capability to prevent hover animations on touch devices
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isMobileViewport = window.innerWidth <= 768;

  cards.forEach(card => {
    // Touch effects for mobile with 3D enhancement
    card.addEventListener('touchstart', () => {
      card.classList.add('touch-active');
      // Add temporary 3D boost on touch
      if (isTouchDevice && isMobileViewport) {
        card.style.transform = 'perspective(1200px) rotateY(2deg) rotateX(-1deg) scale(1.01)';
      }
    }, { passive: true });

    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.classList.remove('touch-active');
        // Remove temporary boost, let scroll-based 3D take over
        if (isTouchDevice && isMobileViewport) {
          card.style.transform = '';
        }
      }, 200);
    }, { passive: true });
  });

  // Check if we have required dependencies
  const canGsapReveal = !!(window.gsap && window.ScrollTrigger);
  if (!canGsapReveal) {
    console.error('interactions: GSAP or ScrollTrigger not available - word reveal animations will not work');
    return;
  }

  try {
    gsap.registerPlugin(window.ScrollTrigger);
  } catch (e) {
    console.error('interactions: Failed to register ScrollTrigger plugin:', e);
    return;
  }

  // ====== PARAGRAPH WORD REVEAL ANIMATIONS ======
  // Keep scroll-reveal initialization outside isTouchDevice check so it runs on touch devices
  const paragraphs = document.querySelectorAll('.story-section p, .final-section p');
  if (paragraphs && paragraphs.length > 0) {
    const splitToWordSpans = (text) => {
      return text.split(/(\s+)/).map((token) => {
        if (/^\s+$/.test(token)) return document.createTextNode(token);
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = token;
        span.style.display = 'inline-block';
        // Removed will-change for performance optimization
        return span;
      });
    };

    paragraphs.forEach((p, idx) => {
      // Skip if already processed
      if (p.dataset && p.dataset.scrollRevealApplied) return;

      const text = p.textContent || '';
      p.textContent = '';
      
      // Split into word spans
      splitToWordSpans(text).forEach(node => p.appendChild(node));
      p.classList.add('scroll-reveal');
      p.dataset.scrollRevealApplied = '1';

      const wordElements = p.querySelectorAll('.word');
      if (wordElements.length === 0) return;

      // Create scroll-synced word reveal animation
      gsap.fromTo(
        wordElements,
        {
          opacity: 0,
          filter: 'blur(0px)'
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.015,
          duration: 0.4,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: p,
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.5,
            markers: false
          }
        }
      );
    });
  }

  // Only setup hover animations on non-touch devices for better mobile performance
  if (!isTouchDevice) {
    // Hover-only behavior restricted to non-touch devices
  }

  // ====== SAVED PHOTO MODAL FUNCTIONALITY ======
  const seeHereLink = document.getElementById('see-saved-photo');
  const modal = document.getElementById('saved-photo-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');

  if (seeHereLink && modal && modalBackdrop && modalClose) {
      // Show modal when "see here" is clicked
      seeHereLink.addEventListener('click', (e) => {
          e.preventDefault();
          modal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });

      // Hide modal when close button is clicked
      modalClose.addEventListener('click', () => {
          modal.classList.remove('active');
          document.body.style.overflow = ''; // Restore scrolling
      });

      // Hide modal when backdrop is clicked
      modalBackdrop.addEventListener('click', () => {
          modal.classList.remove('active');
          document.body.style.overflow = ''; // Restore scrolling
      });

      // Hide modal on Escape key press
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('active')) {
              modal.classList.remove('active');
              document.body.style.overflow = ''; // Restore scrolling
          }
      });
  }

  window.initInteractions_done = true;
}

// Expose
window.initInteractions = initInteractions;

// Initialization is now handled by the hero unlock sequence in index.html
// Removed auto-initialization to prevent race conditions
