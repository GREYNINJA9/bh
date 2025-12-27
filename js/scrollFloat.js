/**
 * ScrollFloat - Vanilla JS Port
 * Splits text into characters and animates them on scroll using GSAP.
 * FIXED: Now properly syncs with scroll position
 * Dependencies: GSAP, ScrollTrigger
 */
class ScrollFloat {
    constructor(element, config = {}) {
        this.element = element;
        this.originalText = element.textContent;
        
        // Detect mobile viewport and reduced motion preference for performance optimization
        const isMobile = window.innerWidth <= 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.config = Object.assign({
            animationDuration: 1,
            ease: 'back.inOut(2)',
            scrollStart: 'top 75%',
            scrollEnd: 'top 45%',
            stagger: isMobile ? 0.01 : 0.03,
            isMobile: isMobile,
            prefersReducedMotion: prefersReducedMotion
        }, config);

        this.init();
    }

    init() {
        if (!window.gsap || !window.ScrollTrigger) {
            console.error('ScrollFloat: GSAP or ScrollTrigger not found - animations will not work');
            return;
        }

        // Prevent duplicate initialization
        if (this.element.dataset.scrollFloatInitialized) {
            console.log('ScrollFloat: Already initialized on', this.element.tagName);
            return;
        }
        this.element.dataset.scrollFloatInitialized = 'true';

        gsap.registerPlugin(window.ScrollTrigger);

        // Split text into characters
        const chars = this.originalText.split('').map(char => {
            return char === ' ' ? '&nbsp;' : char;
        });

        console.log('ScrollFloat: Splitting', this.originalText, 'into', chars.length, 'characters');

        this.element.innerHTML = '';
        this.element.classList.add('scroll-float');

        // Wrap each character in a span
        chars.forEach(char => {
            const span = document.createElement('span');
            span.innerHTML = char;
            span.className = 'char';
            span.style.display = 'inline-block';
            // Removed will-change for performance optimization
            this.element.appendChild(span);
        });

        const charElements = this.element.querySelectorAll('.char');
        console.log('ScrollFloat: Created', charElements.length, 'character spans');

        // Determine animation properties based on device and preferences
        let initialState = {
            opacity: 0.6,
            transformOrigin: '50% 0%'
        };
        
        let finalState = {
            opacity: 1,
            ease: this.config.ease,
            duration: this.config.animationDuration,
            force3D: false
        };

        // Simplify animation on mobile or reduced motion
        if (this.config.isMobile || this.config.prefersReducedMotion) {
            initialState.yPercent = 4;
            finalState.yPercent = 0;
        } else {
            initialState.yPercent = 8;
            initialState.scaleY = 1.15;
            initialState.scaleX = 0.9;
            finalState.yPercent = 0;
            finalState.scaleY = 1;
            finalState.scaleX = 1;
        }

        // Single direct animation with stagger - better scroll sync
        gsap.fromTo(
            charElements,
            initialState,
            {
                ...finalState,
                stagger: { each: this.config.stagger, from: 'start' },
                scrollTrigger: {
                    trigger: this.element,
                    start: this.config.scrollStart,
                    end: this.config.scrollEnd,
                    scrub: 0.5,
                    markers: false
                }
            }
        );
        
        // Store trigger instance for potential cleanup
        this.element._scrollFloatTrigger = gsap.getProperty(charElements[0], 'scrollTrigger');
        
        console.log('ScrollFloat: Animation created with', charElements.length, 'characters');
    }
}

window.ScrollFloat = ScrollFloat;
