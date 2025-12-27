# Love Story Website

A small scroll-based love story website with gentle animations and an interactive final question. This repository now uses a local MP3 for background music via the `js/audioController.js` module.

## Audio Setup

- Place a background MP3 at `assets/music/background.mp3`.
- Recommended: 128-192 kbps, 2-4 minutes, soft instrumental.
- File should be < 5 MB where possible for quicker load.

### Audio API and controls

- Default volume for the audio is 50% (0.5). You can control volume at runtime
	via the `window.audioController.setVolume()` method. This function accepts
	either a decimal between 0.0 and 1.0 or an integer 0-100 (percent).
- To change the audio file at runtime: `window.audioController.setAudioFile('assets/music/my-song.mp3')`.
- To change fade duration: `window.audioController.setFadeSpeed(ms)`.
- Programmatic controls: `window.audioController.play()` and `window.audioController.stop()`.

## How to Run Locally

1. From project root, start a local server serving the files. You can use Python 3 or the included NPM script:

```bash
# Python
python3 -m http.server 8000 --directory /home/grey-ninja/BH_Project

# npm (recommended during development) - uses http-server devDependency
npm run dev

# To run on a different port (e.g., 8001):
PORT=8001 npm run dev
```

2. Open `http://localhost:8000` in your browser.
3. Click anywhere in the page to enable audio (required by browser autoplay policies).

## Features
- Typewriter text reveal on scroll
- Parallax background motion
- Heart-based progress indicator
- Background music using HTML5 <audio>
- Soft preloader screen
- Final interactive question with moving buttons and confetti
	- Interactive Yes/No buttons (No moves away; Yes triggers emoji burst)
	- Animated mascot with emotional reactions (happy/sad)
	- Volume adjustments tied to interactive responses (Yes: louder, No: softer)

## Troubleshooting

- If the audio doesn't play: Make sure `assets/music/background.mp3` exists and is a valid MP3; check browser console for 404 or other errors.
- Autoplay policy: Browser requires user interaction; click anywhere in the page to allow audio to begin.
- Volume controls: The volume slider accepts 0-100 values; JavaScript API accepts 0.0-1.0 or 0-100.

## Testing the Audio Feature

- Verify the audio file is present:
	```bash
	curl -I http://localhost:8000/assets/music/background.mp3
	# Should return HTTP 200 OK
	```
- Interact with the site to enable audio (click overlay), then press the Play button.
- Verify the Play button changes to Pause when audio is playing and the heart beat animates.
- Adjust the volume slider to test volume changes; the slider should reflect changes from the `Yes`/`No` volume effects as well.
- Use the console to programmatically control audio:
	```js
	window.audioController?.play();
	window.audioController?.stop();
	window.audioController?.setAudioFile('assets/music/my-new.mp3');
	window.audioController?.setFadeSpeed(500);
	```

	## Testing the Interactive Flow

	- Click the NO button repeatedly — it should evade you for the configured number of escape attempts, then show a pleading message and reduce volume.
	- Click the YES button — it should trigger an emoji burst, show the mascot with a happy bounce, and increase the playback volume.
	- You can customize the behavior using the `window.interactiveFlow` API:
	```js
	// Reduce the number of attempted escapes for NO
	window.interactiveFlow && window.interactiveFlow.setEscapeAttempts(3);
	// Change the amount of emojis emitted on YES
	window.interactiveFlow && window.interactiveFlow.setBurstCount(30);
	// Toggle the mascot on/off for tests
	window.interactiveFlow && window.interactiveFlow.toggleMascot(false);
	```

## Development

- Scripts live in `js/`; styles in `styles/` (or `css/` depending on your deployment).
- Audio behavior is in `js/audioController.js` - change `config` at the top to adjust defaults.

## License

This repository includes no music files by default. Add your own, and make sure you have rights to use it.
