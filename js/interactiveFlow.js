(function () {
  // Predefined positions for No button (upper half of screen) - as fractions of screen size
  const noButtonPositions = [
    { left: 0.05, top: 0.05 },
    { left: 0.2, top: 0.08 },
    { left: 0.4, top: 0.06 },
    { left: 0.6, top: 0.1 },
    { left: 0.1, top: 0.15 },
    { left: 0.3, top: 0.12 },
    { left: 0.5, top: 0.14 },
    { left: 0.7, top: 0.09 },
    { left: 0.15, top: 0.18 },
    { left: 0.35, top: 0.16 }
  ];
  const DEFAULTS = {
    mascotEnabled: true,
    emojiBurstCount: 30,
    noButtonEscapeAttempts: 3
  };

  class InteractiveFlow {
    constructor(config = {}) {
      this.config = Object.assign({}, DEFAULTS, config);
      this.noClicks = 0;
      this._mountedEmoji = [];
      this.mascot = null;
      this._boundHandlers = {};
      this.init();
    }

    setEscapeAttempts(n) { this.config.noButtonEscapeAttempts = Math.max(0, parseInt(n, 10) || DEFAULTS.noButtonEscapeAttempts); }
    setBurstCount(n) { this.config.emojiBurstCount = Math.max(2, parseInt(n, 10) || DEFAULTS.emojiBurstCount); }
    toggleMascot(enabled) { this.config.mascotEnabled = !!enabled; }

    init() {
      document.addEventListener('DOMContentLoaded', () => this.mount());
      if (document.readyState !== 'loading') this.mount();
    }

    mount() {
      this.yesBtn = document.querySelector('.yes-btn');
      this.noBtn = document.querySelector('.no-btn');
      this.finalCard = document.querySelector('#final-section .story-card');

      console.log('InteractiveFlow mounting...', {
        yesBtn: !!this.yesBtn,
        noBtn: !!this.noBtn,
        finalCard: !!this.finalCard
      });

      if (!this.yesBtn || !this.noBtn) {
        console.error('InteractiveFlow: Buttons not found!');
        return;
      }
      this._bind();
      this._createMascot();

      // Initialize Fuzzy Text for No button if available
      if (window.FuzzyText && this.noBtn) {
        // Use a smaller fontSize appropriate for the button
        this.fuzzyNo = new FuzzyText(this.noBtn, {
          text: "NO",
          fontSize: 20, // Approximate button font size
          fontFamily: "inherit",
          color: "#fff",
          enableHover: true,
          baseIntensity: 0.2,
          hoverIntensity: 0.5,
          baseIntensity: 0.2,
          hoverIntensity: 0.5
        });
      }

      // Initialize Scroll Float for Final Section Heading ("Will you give me a chance?")
      if (window.ScrollFloat) {
        const finalHeading = document.querySelector('#final-section h1');
        if (finalHeading) {
          new ScrollFloat(finalHeading, {
            animationDuration: 1,
            ease: 'back.inOut(2)',
            scrollStart: 'center bottom+=50%',
            scrollEnd: 'bottom bottom-=40%',
            stagger: 0.03
          });
        }
      }

      // Expose the instance for console access as `interactiveFlow` while keeping constructor available
      window.interactiveFlow = this;
    }

    _bind() {
      this._boundHandlers.yes = this.onYesClick.bind(this);
      this._boundHandlers.no = this.onNoClick.bind(this);
      this.yesBtn.addEventListener('click', this._boundHandlers.yes);
      this.noBtn.addEventListener('click', this._boundHandlers.no);
      // Touch support
      this.yesBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.onYesClick(e); }, { passive: false });
      this.noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.onNoClick(e); }, { passive: false });

      // keydown
      this.yesBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.onYesClick(e); });
      this.noBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.onNoClick(e); });

      // Force cursor
      this.yesBtn.style.cursor = 'pointer';
      this.noBtn.style.cursor = 'pointer';
    }

    onYesClick() {
      // Remove No button permanently
      if (this.noBtn) {
        this.noBtn.style.display = 'none';
      }
      this.createConfetti();
      // Increase music volume if available
      try { if (window.audioController && window.audioController.setVolume) window.audioController.setVolume(80); } catch (e) { }
      // Show celebrating mascots and final message
      this._showCelebration();
    }

    onNoClick(e) {
      this.noClicks++;
      const messages = [
        "Please think again 🥺",
        "Ek baar phir soch lo!! 😣",
        "Kitna bhaav khaoge aap? Please maan jao na 🙏"
      ];
      const phase = Math.min(this.noClicks, 3);
      this._showMessage(messages[phase - 1] || messages[2]);

      if (this.noClicks <= 3) {
        this.showMascot(`phase${phase}`);
      }

      // Move No button and adjust sizes on every click
      this._evadeNoButton();
      this._adjustSizes();

      if (this.noClicks >= 4) {
        // Remove No button after 4 clicks
        if (this.noBtn) {
          this.noBtn.style.display = 'none';
        }
      }
    }

    _enlargeYes() {
      if (this.yesBtn) {
        const currentScale = parseFloat(this.yesBtn.style.transform.replace('scale(', '').replace(')', '')) || 1;
        this.yesBtn.style.transform = `scale(${currentScale + 0.1})`;
      }
    }

    _evadeNoButton() {
      const btn = this.noBtn;
      if (!btn) return;

      // Fix: Move button to body to avoid being trapped by 3D transform context
      if (btn.parentNode !== document.body) {
        document.body.appendChild(btn);
      }

      const rect = btn.getBoundingClientRect();
      const yesRect = this.yesBtn.getBoundingClientRect();
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isMobile = winW < 768;
      let left, top, attempts = 0;
      const maxAttempts = 10;
      do {
        // Pick a random predefined position
        const pos = noButtonPositions[Math.floor(Math.random() * noButtonPositions.length)];
        left = pos.left * winW;
        top = pos.top * winH;
        // Adjust for mobile: keep left in center
        if (isMobile) {
          const centerStart = winW * 0.2;
          left = Math.max(centerStart, Math.min(winW * 0.8 - rect.width, left));
        }
        // Ensure within bounds
        left = Math.max(8, Math.min(winW - rect.width - 16, left));
        top = Math.max(8, Math.min(winH / 2 - rect.height - 16, top));
        attempts++;
      } while (attempts < maxAttempts && this._overlaps(left, top, rect.width, rect.height, yesRect));
      // If still overlapping, use fallback
      if (this._overlaps(left, top, rect.width, rect.height, yesRect)) {
        left = isMobile ? winW * 0.4 : 8;
        top = 8;
      }
      btn.style.position = 'fixed';
      btn.style.left = left + 'px';
      btn.style.top = top + 'px';
      btn.style.zIndex = '9999';
      // quick bounce animation
      btn.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 380, easing: 'cubic-bezier(.2,.6,.2,1)' });
    }

    _overlaps(x, y, w, h, otherRect) {
      return !(x + w < otherRect.left || x > otherRect.right || y + h < otherRect.top || y > otherRect.bottom);
    }

    _adjustSizes() {
      const isMobile = window.innerWidth < 768;
      if (this.noBtn && isMobile) {
        const currentScale = parseFloat(this.noBtn.style.transform.replace('scale(', '').replace(')', '')) || 1;
        this.noBtn.style.transform = `scale(${Math.max(0.5, currentScale - 0.1)})`;
      }
      this._enlargeYes();
    }

    _showMessage(msg) {
      if (!this.finalCard) return;
      const old = this.finalCard.querySelector('.final-message');
      if (old) old.remove();
      const el = document.createElement('div');
      el.className = 'final-message';
      el.innerHTML = `<strong>${msg}</strong>`;
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.6s ease';
      this.finalCard.appendChild(el);
      requestAnimationFrame(() => el.style.opacity = '1');
      setTimeout(() => { if (el && el.parentNode) el.parentNode.removeChild(el); }, 4500);
    }

    createConfetti() {
      const count = 50;
      const container = document.body;
      const emojis = ['🎉', '✨', '💕', '🌟', '🎊', '🥳'];
      for (let i = 0; i < count; i++) {
        const span = document.createElement('div');
        span.className = 'confetti-particle';
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.top = '-10px';
        span.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(span);
        setTimeout(() => { if (span.parentNode) span.parentNode.removeChild(span); }, 5000);
      }
    }

    _createMascot() {
      if (!this.config.mascotEnabled) return;
      this.mascot = document.createElement('div');
      this.mascot.className = 'mascot';
      this.mascot.innerHTML = '❤️';
      this.mascot.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.mascot);
    }

    showMascot(emotion = 'neutral') {
      if (!this.mascot) this._createMascot();
      const m = this.mascot;
      m.classList.add('visible');
      m.classList.remove('happy', 'sad', 'neutral', 'phase1', 'phase2', 'phase3');
      m.classList.add(emotion || 'neutral');
      setTimeout(() => { m.classList.remove('visible', 'happy', 'sad', 'neutral', 'phase1', 'phase2', 'phase3'); }, 3000);
    }

    _showCelebration() {
      // Hide buttons and show final screen
      this.yesBtn.style.display = 'none';
      this.noBtn.style.display = 'none';
      this.finalCard.innerHTML = `
        <h1 class="celebration-heading">🎉 You made me the happiest person for the rest of my life! 🎉</h1>
        <div class="celebration-mascots">
          <img src="https://media.tenor.com/yr7z512oIf4AAAAj/peach-goma-shy-blush-heart.gif" alt="Peach Goma" class="cute-pandas">
        </div>
        <div class="photo-placeholder">
          <div class="photo-circle">
            <img src="assets/image/happy.jpg" alt="Profile photo" class="profile-image">
          </div>
        </div>
      `;
      // Init DecryptedText on the new H1
      const finalH1 = this.finalCard.querySelector('h1');
      if (window.DecryptedText && finalH1) {
        // Lock the h1 styles before DecryptedText initialization
        finalH1.style.fontFamily = "'Great Vibes', cursive";
        finalH1.style.fontWeight = "800";
        finalH1.style.color = "#e91e63";
        finalH1.style.fontSize = "3rem";
        finalH1.style.textShadow = "2px 2px 4px rgba(255, 105, 180, 0.3)";
        
        new DecryptedText(finalH1, {
          animateOn: 'none', // Don't auto-trigger on view to prevent re-animation on scroll
          speed: 1,
          revealDirection: 'start',
          sequential: true,
          characters: "💖🎉✨😍"
        });
        
        // Manually trigger the animation once
        setTimeout(() => {
          const decryptedTextInstance = finalH1._decryptedTextInstance;
          if (decryptedTextInstance && !decryptedTextInstance.hasAnimated) {
            decryptedTextInstance.isHovering = true;
            decryptedTextInstance.startScramble();
            
            // Lock visual container styles after animation starts
            if (decryptedTextInstance.visualContainer) {
              decryptedTextInstance.visualContainer.style.fontFamily = "'Great Vibes', cursive";
              decryptedTextInstance.visualContainer.style.fontWeight = "800";
              decryptedTextInstance.visualContainer.style.color = "#e91e63";
              decryptedTextInstance.visualContainer.style.fontSize = "3rem";
              decryptedTextInstance.visualContainer.style.textShadow = "2px 2px 4px rgba(255, 105, 180, 0.3)";
            }
          }
        }, 500);
      }
      document.body.classList.add('celebration');
      setTimeout(() => document.body.classList.remove('celebration'), 10000);
    }
  }

  // Export constructor
  window.InteractiveFlow = window.InteractiveFlow || InteractiveFlow;

  // Auto-init
  new InteractiveFlow();
})();
