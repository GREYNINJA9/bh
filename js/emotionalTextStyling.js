/**
 * Emotional Text Styling System
 * Dynamically changes text colors, font-weights, and effects based on emotional zones
 * Integrates with emotionalBackground.js zones
 * Uses GSAP ScrollTrigger for scroll-based transitions
 */

function initEmotionalTextStyling() {
  // Check dependencies
  if (!window.gsap || !window.ScrollTrigger) {
    console.error('emotionalTextStyling: GSAP or ScrollTrigger not available - text styling will not work');
    return;
  }

  try {
    gsap.registerPlugin(window.ScrollTrigger);
  } catch (e) {
    console.error('emotionalTextStyling: Failed to register ScrollTrigger plugin:', e);
    return;
  }

  // Define emotional zones matching emotionalBackground.js
  const emotionalZones = [
    {
      name: 'Nostalgia & Discovery',
      sectionStart: 1,
      sectionEnd: 3,
      emotionClass: 'emotion-nostalgia'
    },
    {
      name: 'Longing & Hope',
      sectionStart: 4,
      sectionEnd: 7,
      emotionClass: 'emotion-longing'
    },
    {
      name: 'Persistence & Vulnerability',
      sectionStart: 8,
      sectionEnd: 13,
      emotionClass: 'emotion-vulnerability'
    },
    {
      name: 'Anticipation & Courage',
      sectionStart: 14,
      sectionEnd: 17,
      emotionClass: 'emotion-courage'
    },
    {
      name: 'Reflection & Honesty',
      sectionStart: 18,
      sectionEnd: 21,
      emotionClass: 'emotion-reflection'
    },
    {
      name: 'Hope & Joy',
      sectionStart: 'final',
      sectionEnd: 'final',
      emotionClass: 'emotion-joy'
    }
  ];

  // All emotion classes for cleanup
  const allEmotionClasses = emotionalZones.map(z => z.emotionClass);

  // Function to get all sections in a zone
  const getSectionsInZone = (zone) => {
    if (zone.sectionStart === 'final') {
      return [document.querySelector('.final-section')];
    }
    const sections = [];
    for (let i = zone.sectionStart; i <= zone.sectionEnd; i++) {
      const section = document.querySelector(`.story-section:nth-of-type(${i})`);
      if (section) sections.push(section);
    }
    return sections;
  };

  // Function to remove all emotion classes from a section
  const removeAllEmotionClasses = (section) => {
    if (!section) return;
    allEmotionClasses.forEach(cls => {
      section.classList.remove(cls);
    });
  };

  // Function to apply emotion class to a section and its content
  const applyEmotionStyling = (zone) => {
    const sections = getSectionsInZone(zone);
    sections.forEach(section => {
      if (section) {
        removeAllEmotionClasses(section);
        section.classList.add(zone.emotionClass);
        console.log(`emotionalTextStyling: Entered zone "${zone.name}" - Applied ${zone.emotionClass} class`);
      }
    });
  };

  // Create ScrollTrigger for each emotional zone
  emotionalZones.forEach((zone) => {
    let triggerElement;

    if (zone.sectionStart === 'final') {
      triggerElement = document.querySelector('.final-section');
    } else {
      triggerElement = document.querySelector(`.story-section:nth-of-type(${zone.sectionStart})`);
    }

    if (!triggerElement) {
      console.warn(`emotionalTextStyling: Trigger element not found for zone "${zone.name}"`);
      return;
    }

    // Create ScrollTrigger for this zone
    ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top 60%',
      end: zone.sectionStart === 'final' ? 'bottom 40%' : 'bottom 40%',
      scrub: 0.8,
      onEnter: () => applyEmotionStyling(zone),
      onEnterBack: () => applyEmotionStyling(zone),
      markers: false
    });
  });

  // Handle window resize to refresh ScrollTrigger
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

  window.initEmotionalTextStyling_done = true;
}

// Expose function globally
window.initEmotionalTextStyling = initEmotionalTextStyling;

// Initialization is now handled by the hero unlock sequence in index.html
// Removed auto-initialization to prevent race conditions and ensure proper ordering
