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

        // Split text into words first, then characters within each word
        const words = this.originalText.split(/\s+/);
        let charCount = 0;

        console.log('ScrollFloat: Splitting', this.originalText, 'into', words.length, 'words');

        this.element.innerHTML = '';
        this.element.classList.add('scroll-float');

        // Process each word
        words.forEach((word, wordIndex) => {
            // Create word wrapper with white-space: nowrap to keep word together
            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'word-wrapper';
            wordWrapper.style.display = 'inline-block';
            wordWrapper.style.whiteSpace = 'nowrap';

            // Split word into characters
            const chars = word.split('');
            chars.forEach(char => {
                const span = document.createElement('span');
                span.innerHTML = char;
                span.className = 'char';
                span.style.display = 'inline-block';
                // Removed will-change for performance optimization
                wordWrapper.appendChild(span);
                charCount++;
            });

            this.element.appendChild(wordWrapper);

            // Add breakable space between words (except after last word)
            if (wordIndex < words.length - 1) {
                const spaceNode = document.createTextNode(' ');
                this.element.appendChild(spaceNode);
            }
        });

        console.log('ScrollFloat: Created', charCount, 'character spans in', words.length, 'word wrappers');

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
        
        // Verify animation was created successfully
        if (charElements.length > 0) {
            const firstCharTrigger = window.ScrollTrigger.getAll().find(t => 
                t.trigger === this.element || Array.from(charElements).includes(t.trigger)
            );
            
            if (firstCharTrigger) {
                console.log(`ScrollFloat: Animation verified for "${this.originalText.substring(0, 30)}..."`);
            } else {
                console.warn(`ScrollFloat: Animation may not have been created for "${this.originalText.substring(0, 30)}..."`);
            }
        }
        
        console.log('ScrollFloat: Animation created with', charElements.length, 'characters');
    }
}

window.ScrollFloat = ScrollFloat;
