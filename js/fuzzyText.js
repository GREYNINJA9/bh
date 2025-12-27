/**
 * FuzzyText - Vanilla JS Port
 * Adds a fuzzy/noisy animation to text on a canvas.
 */
class FuzzyText {
    constructor(element, config = {}) {
        this.element = element;
        this.config = Object.assign({
            text: config.text || element.textContent.trim() || 'NO',
            fontSize: config.fontSize || 'inherit', // Can be number (px) or string (css unit) or 'inherit'
            fontWeight: config.fontWeight || 900,
            fontFamily: config.fontFamily || 'inherit',
            color: config.color || '#fff',
            enableHover: config.enableHover !== false,
            baseIntensity: config.baseIntensity || 0.18,
            hoverIntensity: config.hoverIntensity || 0.5,
            fuzzRange: 30
        }, config);

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Ensure canvas sits correctly within the button
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '50%';
        this.canvas.style.left = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        this.canvas.style.pointerEvents = 'none'; // Passthrough checks to the parent

        // Hide original text but keep accessibility
        this.element.style.color = 'transparent';
        this.element.style.position = 'relative'; // Ensure positioning context for absolute canvas
        this.element.appendChild(this.canvas);

        this.isHovering = false;
        this.animationFrameId = null;
        this.isCancelled = false;

        this.init();
    }

    async init() {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        if (this.isCancelled) return;

        this.setup();
        this.bindEvents();
        this.run();
    }

    setup() {
        // 1. Determine font style
        const computedStyle = window.getComputedStyle(this.element);
        const fontFamily = this.config.fontFamily === 'inherit' ? computedStyle.fontFamily : this.config.fontFamily;

        let fontSizeStr = this.config.fontSize;
        let numericFontSize;

        // Resolve 'inherit' or strings to numeric px
        if (typeof this.config.fontSize === 'number') {
            fontSizeStr = `${this.config.fontSize}px`;
            numericFontSize = this.config.fontSize;
        } else {
            // If inherit, use computed font size
            if (this.config.fontSize === 'inherit') {
                fontSizeStr = computedStyle.fontSize;
            }
            // Calculate numeric value for canvas metrics
            const temp = document.createElement('span');
            temp.style.fontFamily = fontFamily;
            temp.style.fontSize = fontSizeStr;
            temp.style.fontWeight = this.config.fontWeight;
            temp.style.position = 'absolute';
            temp.style.visibility = 'hidden';
            temp.textContent = 'M'; // Dummy character
            document.body.appendChild(temp);
            const computed = window.getComputedStyle(temp).fontSize;
            numericFontSize = parseFloat(computed);
            document.body.removeChild(temp);
        }

        // 2. Prepare offscreen canvas for text source
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d');

        // Set font to measure
        const fontString = `${this.config.fontWeight} ${fontSizeStr} ${fontFamily}`;
        offCtx.font = fontString;
        offCtx.textBaseline = 'alphabetic';

        const metrics = offCtx.measureText(this.config.text);
        const actualLeft = metrics.actualBoundingBoxLeft || 0;
        const actualRight = metrics.actualBoundingBoxRight || metrics.width;
        const actualAscent = metrics.actualBoundingBoxAscent || numericFontSize;
        const actualDescent = metrics.actualBoundingBoxDescent || numericFontSize * 0.2;

        const textBoundingWidth = Math.ceil(actualLeft + actualRight);
        // Add extra buffer specifically for vertical to prevent clipping
        const tightHeight = Math.ceil(actualAscent + actualDescent);

        const extraWidthBuffer = 10;
        const offscreenWidth = textBoundingWidth + extraWidthBuffer;

        offscreen.width = offscreenWidth;
        offscreen.height = tightHeight;

        const xOffset = extraWidthBuffer / 2;

        // Reset font after resize
        offCtx.font = fontString;
        offCtx.textBaseline = 'alphabetic';
        offCtx.fillStyle = this.config.color;
        offCtx.fillText(this.config.text, xOffset - actualLeft, actualAscent);

        this.offscreen = offscreen;
        this.offscreenWidth = offscreenWidth;
        this.tightHeight = tightHeight;

        // 3. Setup Main Canvas
        // Add margin for the fuzz effect
        const horizontalMargin = 50;
        const verticalMargin = 20; // Reduced vertical margin for buttons

        this.canvas.width = offscreenWidth + horizontalMargin * 2;
        this.canvas.height = tightHeight + verticalMargin * 2;

        // Store offsets for drawing
        this.drawXOffset = horizontalMargin;
        this.drawYOffset = verticalMargin;
    }

    bindEvents() {
        if (!this.config.enableHover) return;

        // Bind to the PARENT element since canvas has pointer-events: none
        this.element.addEventListener('mouseenter', () => { this.isHovering = true; });
        this.element.addEventListener('mouseleave', () => { this.isHovering = false; });
        this.element.addEventListener('touchstart', () => { this.isHovering = true; }, { passive: true });
        this.element.addEventListener('touchend', () => { this.isHovering = false; });
    }

    run() {
        if (this.isCancelled) return;

        const { width, height } = this.canvas;
        const { offscreen, offscreenWidth, tightHeight } = this;
        const fuzzRange = this.config.fuzzRange;

        this.ctx.clearRect(0, 0, width, height);

        // If not set up yet
        if (!offscreen) return;

        const intensity = this.isHovering ? this.config.hoverIntensity : this.config.baseIntensity;

        // Draw slice by slice with offset
        for (let j = 0; j < tightHeight; j++) {
            const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);

            // Draw a 1px high slice from offscreen to main canvas
            // source: (0, j, w, 1)
            // dest: (drawX + dx, drawY + j, w, 1)
            this.ctx.drawImage(
                offscreen,
                0, j, offscreenWidth, 1,
                this.drawXOffset + dx, this.drawYOffset + j, offscreenWidth, 1
            );
        }

        this.animationFrameId = requestAnimationFrame(() => this.run());
    }

    destroy() {
        this.isCancelled = true;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        // Restore text
        this.element.style.color = '';
    }
}

// Expose on window
window.FuzzyText = FuzzyText;
