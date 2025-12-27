/**
 * Emotional Background System
 * Transitions background gradients based on story progression
 * Maps story sections to emotional color palettes
 * Integrates with GSAP ScrollTrigger for smooth animations
 */

function initEmotionalBackground() {
    // Check if GSAP and ScrollTrigger are available
    if (!window.gsap || !window.ScrollTrigger) {
        console.error('emotionalBackground: GSAP or ScrollTrigger not found - background animations will not work');
        return;
    }

    try {
        gsap.registerPlugin(window.ScrollTrigger);
    } catch (e) {
        console.error('emotionalBackground: Failed to register ScrollTrigger plugin:', e);
        return;
    }

    // Define emotional zones with section ranges and their color palettes
    const emotionalZones = [
        {
            name: 'Nostalgia & Discovery',
            sectionStart: 1,
            sectionEnd: 3,
            colors: {
                start: 'var(--emotion-nostalgia-start)',
                mid: 'var(--emotion-nostalgia-mid)',
                end: 'var(--emotion-nostalgia-end)'
            }
        },
        {
            name: 'Longing & Hope',
            sectionStart: 4,
            sectionEnd: 7,
            colors: {
                start: 'var(--emotion-longing-start)',
                mid: 'var(--emotion-longing-mid)',
                end: 'var(--emotion-longing-end)'
            }
        },
        {
            name: 'Persistence & Vulnerability',
            sectionStart: 8,
            sectionEnd: 13,
            colors: {
                start: 'var(--emotion-vulnerability-start)',
                mid: 'var(--emotion-vulnerability-mid)',
                end: 'var(--emotion-vulnerability-end)'
            }
        },
        {
            name: 'Anticipation & Courage',
            sectionStart: 14,
            sectionEnd: 17,
            colors: {
                start: 'var(--emotion-courage-start)',
                mid: 'var(--emotion-courage-mid)',
                end: 'var(--emotion-courage-end)'
            }
        },
        {
            name: 'Reflection & Honesty',
            sectionStart: 18,
            sectionEnd: 21,
            colors: {
                start: 'var(--emotion-reflection-start)',
                mid: 'var(--emotion-reflection-mid)',
                end: 'var(--emotion-reflection-end)'
            }
        },
        {
            name: 'Hope & Joy',
            sectionStart: 'final',
            sectionEnd: 'final',
            colors: {
                start: 'var(--emotion-joy-start)',
                mid: 'var(--emotion-joy-mid)',
                end: 'var(--emotion-joy-end)'
            }
        }
    ];

    const cloudBackground = document.querySelector('.cloud-background');
    if (!cloudBackground) {
        console.warn('emotionalBackground: .cloud-background element not found');
        return;
    }

    // Check if running on mobile for performance optimization
    const isMobile = window.innerWidth < 768;

    // Function to build gradient string
    const buildGradient = (colors) => {
        if (isMobile) {
            // Simplified gradient for mobile: 2 colors instead of 3
            return `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`;
        }
        // Full gradient for desktop: 3 colors
        return `linear-gradient(135deg, ${colors.start} 0%, ${colors.mid} 50%, ${colors.end} 100%)`;
    };

    // Create ScrollTrigger for each emotional zone
    emotionalZones.forEach((zone, index) => {
        // Determine section selector based on zone type
        let selector;
        if (zone.sectionStart === 'final') {
            selector = '.final-section';
        } else {
            selector = `.story-section:nth-of-type(${zone.sectionStart})`;
        }

        const triggerElement = document.querySelector(selector);
        if (!triggerElement) {
            console.warn(`emotionalBackground: Trigger element not found for zone ${zone.name}`);
            return;
        }

        // Create ScrollTrigger for this emotional zone
        gsap.to(cloudBackground, {
            scrollTrigger: {
                trigger: triggerElement,
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 0.5,
                markers: false,
                onEnter: () => {
                    // Update background to zone's color palette
                    cloudBackground.style.background = buildGradient(zone.colors);
                    console.log(`emotionalBackground: Entered zone "${zone.name}"`);
                },
                onEnterBack: () => {
                    // Update background when scrolling back up
                    cloudBackground.style.background = buildGradient(zone.colors);
                    console.log(`emotionalBackground: Re-entered zone "${zone.name}"`);
                }
            }
        });
    });

    // Listen for window resize to update gradients on screen size change
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newIsMobile = window.innerWidth < 768;
            if (newIsMobile !== isMobile) {
                // Screen size crossed mobile threshold, refresh ScrollTrigger
                if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
                    window.ScrollTrigger.refresh();
                }
            }
        }, 250);
    });

    console.log('emotionalBackground: Initialized with', emotionalZones.length, 'emotional zones');
    window.initEmotionalBackground_done = true;
}

window.initEmotionalBackground = initEmotionalBackground;

// Initialization is now handled by the hero unlock sequence in index.html
// Removed auto-initialization to prevent race conditions
