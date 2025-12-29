/**
 * DecryptedText - Vanilla JS Port
 * Scramble/Decrypt text animation.
 */
class DecryptedText {
    constructor(element, config = {}) {
        this.element = element;
        this.originalText = config.text || element.textContent;
        this.config = Object.assign({
            speed: 90,
            maxIterations: 20, // slightly bumped default for better visibility
            sequential: false,
            revealDirection: 'start',
            useOriginalCharsOnly: false,
            characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
            animateOn: 'hover', // 'hover', 'view', 'both', 'none'
            className: 'revealed',
            encryptedClassName: 'encrypted'
        }, config);

        this.displayText = this.originalText;
        this.isHovering = false;
        this.isScrambling = false;
        this.revealedIndices = new Set();
        this.hasAnimated = false;
        this.interval = null;
        this.currentIteration = 0;

        // Store instance reference on element for external access
        this.element._decryptedTextInstance = this;

        // Setup accessibility
        this.setupDOM();

        // Initial State
        this.render();

        this.bindEvents();
    }

    setupDOM() {
        this.element.innerHTML = '';
        // Use normal display/whitespace for paragraphs to preserve flow
        this.element.style.display = 'block';
        this.element.style.whiteSpace = 'normal';

        // Screen reader only text
        this.srOnly = document.createElement('span');
        this.srOnly.textContent = this.originalText;
        this.srOnly.style.position = 'absolute';
        this.srOnly.style.width = '1px';
        this.srOnly.style.height = '1px';
        this.srOnly.style.padding = '0';
        this.srOnly.style.margin = '-1px';
        this.srOnly.style.overflow = 'hidden';
        this.srOnly.style.clip = 'rect(0,0,0,0)';
        this.srOnly.style.border = '0';
        this.element.appendChild(this.srOnly);

        // Visual container - inherit font styling from parent
        this.visualContainer = document.createElement('span');
        this.visualContainer.setAttribute('aria-hidden', 'true');
        
        // Inherit font styling from parent element to preserve custom fonts
        const computedStyle = window.getComputedStyle(this.element);
        this.visualContainer.style.fontFamily = computedStyle.fontFamily;
        this.visualContainer.style.fontSize = computedStyle.fontSize;
        this.visualContainer.style.fontWeight = computedStyle.fontWeight;
        this.visualContainer.style.fontStyle = computedStyle.fontStyle;
        this.visualContainer.style.color = computedStyle.color;
        this.visualContainer.style.lineHeight = computedStyle.lineHeight;
        this.visualContainer.style.letterSpacing = computedStyle.letterSpacing;
        
        // Store initial styles to prevent re-inheritance
        this._lockedStyles = {
          fontFamily: computedStyle.fontFamily,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          fontStyle: computedStyle.fontStyle,
          color: computedStyle.color,
          lineHeight: computedStyle.lineHeight,
          letterSpacing: computedStyle.letterSpacing
        };
        
        this.element.appendChild(this.visualContainer);
    }

    bindEvents() {
        if (this.config.animateOn === 'hover' || this.config.animateOn === 'both') {
            this.element.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.startScramble();
            });
            this.element.addEventListener('mouseleave', () => {
                this.isHovering = false;
                // Optional: stop scrambling on leave? React code keeps going if interval running, 
                // but sets state. Here we'll follow logic: if not hovering, resolve to original.
                this.resolveToOriginal();
            });
        }

        if (this.config.animateOn === 'view' || this.config.animateOn === 'both') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.isHovering = true;
                        this.hasAnimated = true;
                        this.startScramble();
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(this.element);
        }
    }

    getNextIndex(revealedSet) {
        const textLength = this.originalText.length;
        switch (this.config.revealDirection) {
            case 'start':
                return revealedSet.size;
            case 'end':
                return textLength - 1 - revealedSet.size;
            case 'center': {
                const middle = Math.floor(textLength / 2);
                const offset = Math.floor(revealedSet.size / 2);
                const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

                if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                    return nextIndex;
                }
                for (let i = 0; i < textLength; i++) {
                    if (!revealedSet.has(i)) return i;
                }
                return 0;
            }
            default:
                return revealedSet.size;
        }
    }

    shuffleText(originalText, currentRevealed) {
        const availableChars = this.config.useOriginalCharsOnly
            ? Array.from(new Set(originalText.split(''))).filter(char => char !== ' ')
            : this.config.characters.split('');

        if (this.config.useOriginalCharsOnly) {
            // Complex shuffle logic from React component
            const positions = originalText.split('').map((char, i) => ({
                char,
                isSpace: char === ' ',
                index: i,
                isRevealed: currentRevealed.has(i)
            }));

            const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);

            // Fisher-Yates shuffle
            for (let i = nonSpaceChars.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
            }

            let charIndex = 0;
            return positions.map(p => {
                if (p.isSpace) return ' ';
                if (p.isRevealed) return originalText[p.index];
                return nonSpaceChars[charIndex++];
            }).join('');

        } else {
            return originalText.split('').map((char, i) => {
                if (char === ' ') return ' ';
                if (currentRevealed.has(i)) return originalText[i];
                return availableChars[Math.floor(Math.random() * availableChars.length)];
            }).join('');
        }
    }

    startScramble() {
        this.isScrambling = true;
        if (this.interval) clearInterval(this.interval);

        this.interval = setInterval(() => {
            if (this.config.sequential) {
                if (this.revealedIndices.size < this.originalText.length) {
                    const nextIndex = this.getNextIndex(this.revealedIndices);
                    this.revealedIndices.add(nextIndex);
                    this.displayText = this.shuffleText(this.originalText, this.revealedIndices);
                    this.render();
                } else {
                    this.stopScramble();
                }
            } else {
                this.displayText = this.shuffleText(this.originalText, this.revealedIndices);
                this.currentIteration++;
                this.render();

                if (this.currentIteration >= this.config.maxIterations) {
                    this.stopScramble();
                }
            }
        }, this.config.speed);
    }

    stopScramble() {
        if (this.interval) clearInterval(this.interval);
        this.isScrambling = false;
        this.displayText = this.originalText;
        this.revealedIndices = new Set(this.originalText.split('').map((_, i) => i)); // All revealed
        this.render();
    }

    resolveToOriginal() {
        this.isScrambling = false;
        if (this.interval) clearInterval(this.interval);
        this.displayText = this.originalText;
        this.revealedIndices = new Set();
        this.currentIteration = 0;
        this.render();
    }

    render() {
        // Clear children
        this.visualContainer.innerHTML = '';

        const chars = this.displayText.split('');
        chars.forEach((char, index) => {
            const isRevealedOrDone = this.revealedIndices.has(index) || !this.isScrambling || !this.isHovering;
            const span = document.createElement('span');
            span.textContent = char;
            if (isRevealedOrDone) {
                if (this.config.className) span.className = this.config.className;
            } else {
                if (this.config.encryptedClassName) span.className = this.config.encryptedClassName;
            }
            this.visualContainer.appendChild(span);
        });
    }
}

window.DecryptedText = DecryptedText;
