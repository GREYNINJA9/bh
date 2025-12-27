/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENHANCED FEATURES GUIDE - Love Story Website
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This document explains all the new features added to the project and how to
 * customize them. Each feature is modular, so you can easily enable/disable or
 * modify any of them independently.
 */

// ═════════════════════════════════════════════════════════════════════════
// 9. INTERACTIVE FLOW (js/interactiveFlow.js)
// ═════════════════════════════════════════════════════════════════════════
// WHAT IT DOES:
//   - Adds a playful interactive flow in the final section of the story
//   - YES triggers emoji bursts, raises music volume, and shows a happy mascot
//   - NO causes the NO button to evade the user for N attempts, then shows a pleading message and reduces volume
//
// CUSTOMIZATION:
//   // Change how many emojis are created when YES is clicked
//   window.interactiveFlow && window.interactiveFlow.setBurstCount && window.interactiveFlow.setBurstCount(50);
//   // Change number of NO button escape attempts
//   window.interactiveFlow && window.interactiveFlow.setEscapeAttempts && window.interactiveFlow.setEscapeAttempts(5);
//   // Disable the mascot
//   window.interactiveFlow && window.interactiveFlow.toggleMascot && window.interactiveFlow.toggleMascot(false);
//
// TO DISABLE:
//   - Comment out this line in index.html:
//     <script src="js/interactiveFlow.js"></script>
//
// TESTING:
//   - Click the NO button multiple times to see the evasive mechanic (it will move up to configured attempts).
//   - Click the YES button to see an emoji burst and mascot reaction.
//
// TROUBLESHOOTING:
// Q: Buttons don't respond
// A: Ensure the script is loaded after main.js and there are no console errors that prevented initialization.
// Q: Emoji burst doesn't show
// A: Check for console errors and verify `.emoji-burst-particle` styles are present in CSS; reduce burstCount for mobile.
// Q: Mascot not appearing
// A: Ensure `window.interactiveFlow` has been instantiated and not disabled via toggleMascot(false).

// 1. TYPEWRITER EFFECT (js/typewriter.js)
// ═════════════════════════════════════════════════════════════════════════
//
// WHAT IT DOES:
//   - Reveals text character-by-character as sections come into view
//   - Creates an emotional, calm reading experience
//   - Works on all story paragraphs and section titles
//
// CUSTOMIZATION:
//
//   // Speed up or slow down the text reveal
//   window.TypewriterEffect.setSpeed(15);  // in milliseconds
//
//   // Adjust gap between paragraphs
//   window.TypewriterEffect.setParagraphGap(150);  // in milliseconds
//
// TO DISABLE:
//   - Comment out this line in index.html:
//     <script src="js/typewriter.js"></script>
//
// DEFAULT SETTINGS:
//   - Speed: 20ms per character (calm, readable pace)
//   - Paragraph gap: 200ms
//   - Stagger between sections: 100ms


// ═════════════════════════════════════════════════════════════════════════
// 2. PARALLAX BACKGROUND MOTION (js/parallax.js)
// ═════════════════════════════════════════════════════════════════════════
//
// WHAT IT DOES:
//   - Sketch background elements shift subtly as you scroll
//   - Creates depth and visual interest without being distracting
//   - Uses requestAnimationFrame for smooth, jitter-free motion
//
// CUSTOMIZATION:
//
//   // Adjust how fast the parallax moves (0.1 = very slow, 1.0 = normal scroll)
//   window.ParallaxEffect.setSpeed(0.3);  // default is 0.5
//
//   // Control maximum pixel offset
//   window.ParallaxEffect.setMaxOffset(60);  // default is 40
//
//   // Refresh parallax (useful if DOM changes)
//   window.ParallaxEffect.refresh();
//
//   // Completely remove parallax effect
//   window.ParallaxEffect.destroy();
//
// TO DISABLE:
//   - Comment out this line in index.html:
//     <script src="js/parallax.js"></script>
//
// DEFAULT SETTINGS:
//   - Speed: 0.5 (subtly slow)
//   - Max offset: 40 pixels
//   - Uses passive scroll listener for better performance


// ═════════════════════════════════════════════════════════════════════════
// 3. PROGRESS INDICATOR (js/progress.js)
// ═════════════════════════════════════════════════════════════════════════
//
// WHAT IT DOES:
//   - Shows a cute heart-based progress bar at the top of the page
//   - Hearts fill as the user scrolls through the story
//   - Percentage label appears on hover (hover over progress bar)
//
// CUSTOMIZATION:
//
//   // Change number of hearts displayed
//   window.ProgressBar.setHeartCount(15);  // default is 10
//
//   // Toggle percentage label on/off
//   window.ProgressBar.toggleLabel(false);  // default is true
//
//   // Refresh progress bar
//   window.ProgressBar.refresh();
//
//   // Remove progress bar entirely
//   window.ProgressBar.destroy();
//
// TO DISABLE:
//   - Comment out this line in index.html:
//     <script src="js/progress.js"></script>
//
// STYLING:
//   - Look for .progress-bar-container in styles/main.css
//   - Customize colors, size, and opacity there


// ═════════════════════════════════════════════════════════════════════════
// 4. BACKGROUND MUSIC CONTROL (js/audioController.js)
// ═════════════════════════════════════════════════════════════════════════
//
// WHAT IT DOES:
//   - Adds a "Music" button in the header
//   - Uses the HTML5 Audio API with a local background MP3
//   - Users can toggle soft background music on/off
//   - Music fades in/out smoothly (not abrupt)
//   - Respects browser autoplay policies (user must click first)
//
// SETUP:
//   1. Place your background music file at: assets/music/background.mp3
//   2. The module will create a sticky Audio Player in the footer area automatically
//   3. Music defaults to 50% volume (0.5) and will loop automatically
//
// CUSTOMIZATION:
//
//   // Change audio file path (adjust config in audio controller constructor)
//   // window.audioController?.config && (window.audioController.config.audioFile = 'assets/music/my-song.mp3');
//
//   // Adjust default volume (0.0 = silent, 1.0 = full or 0-100 percent)
//   window.audioController?.setVolume && window.audioController.setVolume(0.5);
//
//   // Change fade duration
//   window.audioController?.setFadeSpeed && window.audioController.setFadeSpeed(500);  // in milliseconds
//
//   // Programmatically control music
//   window.audioController?.play && window.audioController.play();     // Start playing
//   window.audioController?.stop && window.audioController.stop();     // Stop playing
//   window.audioController?.isPlayingNow && window.audioController.isPlayingNow(); // Check if playing (boolean)
//
// TO DISABLE:
//   - Comment out this line in index.html:
//     <script src="js/audioController.js"></script>
//
// STYLING:
//   - Look for .audio-toggle-btn in styles/main.css
//   - Customize button appearance there
//
// DEFAULT SETTINGS:
//   - Volume: 50% (0.5)
//   - Fade duration: 800ms
//   - Music file: assets/music/background.mp3

// MUSIC FILE RECOMMENDATIONS:
//   - Format: MP3 (128-192 kbps recommended)
//   - Duration: 2-4 minutes for a pleasant loop
//   - File size: Keep under 5MB, optimize for quick load
//   - Mood: Soft instrumentals, no lyrics preferred
//   - Licensing: Ensure you have the right to publish the track

// TROUBLESHOOTING NOTES:
//   - If audio doesn't start, ensure you've interacted with the page (autoplay policy)
//   - If the audio file is missing, check for a 404 in the console (assets/music/background.mp3)
//   - Use the browser console to call `window.audioController?.setAudioFile('assets/music/your.mp3')` to change the file at runtime
//
// TESTING THE AUDIO FEATURE:
//   1. Confirm the audio file is present: `curl -I http://localhost:8000/assets/music/background.mp3` (HTTP 200 OK)
//   2. Open the site, click anywhere to remove the overlay, and press the Play button.
//   3. Verify the Play button toggles to Pause and the heart-beat element animates when playing.
//   4. Slide the volume control and confirm the volume changes.
//   5. Click YES to raise volume slightly; NO to reduce volume and observe slider reflect change.
//
// NOTE: Browser policies require user interaction before audio can play.
//       The user must click the button first. Autoplay is disabled.


// ═════════════════════════════════════════════════════════════════════════
// 5. PRELOADER SCREEN (js/preload.js)
// ═════════════════════════════════════════════════════════════════════════
//
// WHAT IT DOES:
//   - Shows a soft "Loading our story..." screen with floating heart
//   - Automatically fades out when page is ready
//   - Doesn't delay page load if user scrolls
//   - Creates a polished first impression
//
// CUSTOMIZATION:
//
//   // Set minimum time to show preloader (ms)
//   window.Preloader.setMinShowTime(1000);  // default is 500
//
//   // Toggle auto-hide feature
//   window.Preloader.setAutoHide(true);  // default is true
//
//   // Programmatically control preloader
//   window.Preloader.show();
//   window.Preloader.hide();
//
// TO DISABLE:
//   - Comment out this line in index.html:
//     <script src="js/preload.js"></script>
//
// STYLING:
//   - Look for .preloader and .floating-heart in styles/main.css
//   - Customize colors and animations there
//
// DEFAULT SETTINGS:
//   - Minimum show time: 500ms
//   - Auto-hide: enabled
//   - Fade out duration: 600ms


// ═════════════════════════════════════════════════════════════════════════
// 6. SMOOTH SECTION TRANSITIONS
// ═════════════════════════════════════════════════════════════════════════
//
// WHAT IT DOES:
//   - Sections fade in with a soft scale animation as they enter viewport
//   - Uses cubic-bezier easing for emotional, bouncy feel
//   - Works seamlessly with the typewriter effect
//
// CUSTOMIZATION:
//   - Look for @keyframes section-enter in styles/main.css
//   - Modify the animation duration or easing there
//   - Default: 0.8s with bounce curve
//
// TO ADJUST:
//   Find this in styles/main.css and modify:
//   ```
//   .story-section.visible {
//     animation: section-enter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//   }
//   ```
//
// This uses scrollAnimations.js to trigger the animation


// ═════════════════════════════════════════════════════════════════════════
// 7. MOBILE-FRIENDLY ENHANCEMENTS
// ═════════════════════════════════════════════════════════════════════════
//
// WHAT IT DOES:
//   - All new features adapt beautifully to mobile screens
//   - Button layout changes on small screens (stacked vertically)
//   - Fonts and spacing scale appropriately
//   - "No" button stays on screen and doesn't escape
//   - Header reorganizes for small screens
//
// BREAKPOINTS:
//   - 768px: Tablet adjustments
//   - 480px: Phone adjustments
//
// Customization:
//   - Look for @media queries in styles/main.css
//   - Adjust font sizes, padding, and layout as needed


// ═════════════════════════════════════════════════════════════════════════
// 8. HOW TO CUSTOMIZE THE ENTIRE EXPERIENCE
// ═════════════════════════════════════════════════════════════════════════
//
// Quick customization example in your browser console:
//
//   // Make text reveal faster
//   window.TypewriterEffect.setSpeed(10);
//
//   // Reduce parallax intensity
//   window.ParallaxEffect.setSpeed(0.2);
//
//   // Add more hearts to progress bar
//   window.ProgressBar.setHeartCount(20);
//
//   // Increase music volume (accepts 0.0-1.0 or 0-100)
//   window.audioController?.setVolume && window.audioController.setVolume(0.5);
//
// To make permanent changes:
//   1. Edit the CONFIG object at the top of each module (e.g., js/typewriter.js)
//   2. Rebuild/refresh the page
//
//
// ═════════════════════════════════════════════════════════════════════════
// TROUBLESHOOTING
// ═════════════════════════════════════════════════════════════════════════
//
// Q: Audio button isn't working
// A: Ensure assets/music/background.mp3 exists. Check browser console for errors.
//    Modern browsers require user interaction before audio plays.
//
// Q: Typewriter effect is too slow/fast
// A: Use window.TypewriterEffect.setSpeed(ms) to adjust
//
// Q: Parallax creates jitter
// A: Reduce the speed: window.ParallaxEffect.setSpeed(0.2)
//
// Q: Preloader won't disappear
// A: Check if page fully loaded. You can manually hide it:
//    window.Preloader.hide()
//
// Q: Something looks broken on mobile
// A: Check if the media query CSS is working. Clear browser cache.
//    Test in device inspector.
//
// ═════════════════════════════════════════════════════════════════════════
