// js/scrollAnimations.js
// FIXED: Proper scroll-synced reveal animations using GSAP ScrollTrigger
// Sections stay in viewport while animating

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

    // Add scroll-based card lift effect
    const card = section.querySelector('.story-card');
    if (card) {
      gsap.fromTo(
        card,
        {
          boxShadow: 'var(--shadow-soft)'
        },
        {
          boxShadow: 'var(--shadow-medium), 0 0 20px rgba(255, 150, 181, 0.2)',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'top 35%',
            scrub: 0.5,
            onEnter: () => {
              card.classList.add('scroll-active');
            },
            onLeave: () => {
              card.classList.remove('scroll-active');
            },
            onEnterBack: () => {
              card.classList.add('scroll-active');
            },
            onLeaveBack: () => {
              card.classList.remove('scroll-active');
            }
          }
        }
      );
    }
  });

  window.initScrollAnimations_done = true;
}

window.initScrollAnimations = initScrollAnimations;

// Initialization is now handled by the hero unlock sequence in index.html
// Removed auto-initialization to prevent race conditions