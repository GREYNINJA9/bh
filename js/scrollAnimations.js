// js/scrollAnimations.js
// FIXED: Proper scroll-synced reveal animations using GSAP ScrollTrigger
// Sections stay in viewport while animating
// Mobile: scroll-triggered 3D tilt effects
// Desktop: traditional box-shadow lift effects

function initScrollAnimations() {
  const sections = document.querySelectorAll('.story-section:not(.scroll-stack-card), .final-section');
  if (!sections || sections.length === 0) return;

  // Check if GSAP and ScrollTrigger are available
  if (!window.gsap || !window.ScrollTrigger) {
    console.error('scrollAnimations: GSAP or ScrollTrigger not loaded - section animations will not work');
    return;
  }

  try {
    gsap.registerPlugin(window.ScrollTrigger);
  } catch (e) {
    console.error('scrollAnimations: Failed to register ScrollTrigger plugin:', e);
    return;
  }

  // Detect mobile/touch devices
  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isMobileViewport = window.innerWidth <= 768;
  const shouldUseMobile3D = isMobile && isMobileViewport;

  console.log(`ScrollAnimations: Mobile 3D effects ${shouldUseMobile3D ? 'enabled' : 'disabled'}`);

  // Create reveal animations for each section
  sections.forEach((section, index) => {
    // Set initial state - opacity only, NO Y translation
    section.style.opacity = '1';

    // Only fade and scale - keep Y position fixed
    gsap.fromTo(
      section,
      {
        opacity: 0,
        scale: 0.95
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 45%',
          scrub: 0.5,
          markers: false
        }
      }
    );

    // Add visible class when entering viewport
    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          section.classList.add('visible', 'in-view');
        },
        onEnterBack: () => {
          section.classList.add('visible', 'in-view');
        }
      }
    });

    // Add scroll-based card effects (desktop hover-like, mobile 3D tilt)
    const card = section.querySelector('.story-card');
    if (card) {
      if (shouldUseMobile3D) {
        // Mobile: 3D tilt effect on scroll entry
        gsap.to(card, {
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            onEnter: () => {
              card.classList.add('mobile-3d-entering');
              setTimeout(() => {
                card.classList.remove('mobile-3d-entering');
                card.classList.add('mobile-3d-active');
              }, 800);
            },
            onLeave: () => {
              card.classList.remove('mobile-3d-active');
              card.classList.add('mobile-3d-cleanup');
              setTimeout(() => card.classList.remove('mobile-3d-cleanup'), 100);
            },
            onEnterBack: () => {
              card.classList.add('mobile-3d-active');
            },
            onLeaveBack: () => {
              card.classList.remove('mobile-3d-active');
              card.classList.add('mobile-3d-cleanup');
              setTimeout(() => card.classList.remove('mobile-3d-cleanup'), 100);
            }
          }
        });
      } else {
        // Desktop: existing box-shadow lift effect
        gsap.fromTo(
          card,
          { boxShadow: 'var(--shadow-soft)' },
          {
            boxShadow: 'var(--shadow-medium), 0 0 20px rgba(255, 150, 181, 0.2)',
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
              end: 'top 35%',
              scrub: 0.5,
              onEnter: () => card.classList.add('scroll-active'),
              onLeave: () => card.classList.remove('scroll-active'),
              onEnterBack: () => card.classList.add('scroll-active'),
              onLeaveBack: () => card.classList.remove('scroll-active')
            }
          }
        );
      }
    }
  });

  // Handle viewport resize and orientation changes
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newIsMobileViewport = window.innerWidth <= 768;
      if (newIsMobileViewport !== isMobileViewport) {
        console.log('ScrollAnimations: Viewport changed, refreshing...');
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }
    }, 250);
  });

  window.initScrollAnimations_done = true;
}
}

window.initScrollAnimations = initScrollAnimations;

// Initialization is now handled by the hero unlock sequence in index.html
// Removed auto-initialization to prevent race conditions