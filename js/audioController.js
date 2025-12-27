class AudioController {
  constructor() {
    // Playlist array with all three tracks
    this.playlist = [
      'assets/music/background.mp3',
      'assets/music/background2.mp3',
      'assets/music/background3.mp3'
    ];
    
    // Current track index
    this.currentTrackIndex = 0;
    
    // Two Audio instances for crossfading
    this.currentAudio = new Audio();
    this.nextAudio = new Audio();
    
    // Set properties for both instances
    this.currentAudio.loop = false;
    this.nextAudio.loop = false;
    this.currentAudio.volume = 0.22;
    this.nextAudio.volume = 0.22;
    
    // Target volume for crossfades
    this.targetVolume = 0.22;
    
    // Preload first two tracks
    this.currentAudio.src = this.playlist[0];
    this.nextAudio.src = this.playlist[1];
    
    // Add event listener for track end
    this.currentAudio.addEventListener('ended', this.handleTrackEnd.bind(this));
    
    this.isPlaying = false;
    this.isCrossfading = false;

    // Bind methods
    this.togglePlay = this.togglePlay.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.handleTrackEnd = this.handleTrackEnd.bind(this);

    // UI Elements
    this.playBtn = document.getElementById('play-pause');
    this.volumeSlider = document.getElementById('volume-slider');
    this.overlay = document.getElementById('player-overlay');

    this.init();
  }

  init() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', this.togglePlay);
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
    }

    // Overlay interactions for autoplay policy
    if (this.overlay) {
      const startAudio = () => {
        this.playMusic();
        this.overlay.style.opacity = '0';
        setTimeout(() => {
          this.overlay.style.display = 'none';
        }, 500);
        // Remove listeners after first interaction
        document.removeEventListener('click', startAudio);
        document.removeEventListener('keydown', startAudio);
      };

      document.addEventListener('click', startAudio, { once: true });
      document.addEventListener('keydown', startAudio, { once: true });
    }
  }

  playMusic() {
    try {
      this.currentAudio.play().then(() => {
        this.isPlaying = true;
        this.updateUI();
      }).catch(err => {
        console.warn("Audio autoplay blocked:", err);
        // Re-show overlay if blocked
        if (this.overlay) {
          this.overlay.style.display = 'flex';
          this.overlay.style.opacity = '1';
        }
      });
    } catch (err) {
      console.error("Play error:", err);
    }
  }

  pauseMusic() {
    this.currentAudio.pause();
    this.nextAudio.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  }

  setVolume(value) {
    // Handle 0-100 range input
    const vol = Math.min(1, Math.max(0, value / 100));
    this.targetVolume = vol;
    this.currentAudio.volume = vol;
    this.nextAudio.volume = vol;
    if (this.volumeSlider) {
      this.volumeSlider.value = value;
    }
  }

  handleTrackEnd() {
    if (this.isCrossfading) return; // Prevent multiple crossfades
    
    this.isCrossfading = true;
    
    // Start 300ms crossfade
    this.startCrossfade();
  }

  startCrossfade() {
    const fadeDuration = 300; // milliseconds
    const fadeSteps = 30; // 10ms intervals
    const volumeStep = this.targetVolume / fadeSteps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;

      // Fade out current audio
      this.currentAudio.volume = Math.max(0, this.targetVolume - (volumeStep * currentStep));

      // Fade in next audio
      this.nextAudio.volume = Math.min(this.targetVolume, volumeStep * currentStep);

      if (currentStep >= fadeSteps) {
        clearInterval(fadeInterval);

        // Swap audio instances
        const temp = this.currentAudio;
        this.currentAudio = this.nextAudio;
        this.nextAudio = temp;

        // Update track index
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;

        // Load next track into the now-idle audio instance
        const nextTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.nextAudio.src = this.playlist[nextTrackIndex];

        // Attach ended listener to new current audio
        this.currentAudio.removeEventListener('ended', this.handleTrackEnd);
        this.currentAudio.addEventListener('ended', this.handleTrackEnd.bind(this));

        // Ensure volumes are correct
        this.currentAudio.volume = this.targetVolume;
        this.nextAudio.volume = 0;

        this.isCrossfading = false;

        // Continue playing (currentAudio is the track that was fading in)
        if (this.isPlaying) {
          this.currentAudio.play().catch(err => {
            console.error("Failed to play next track:", err);
          });
        }
      }
    }, 10);
  }

  updateUI() {
    if (this.playBtn) {
      this.playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
      this.playBtn.setAttribute('aria-pressed', this.isPlaying);
    }
    document.body.classList.toggle('music-playing', this.isPlaying);
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  window.audioController = new AudioController();
});
