STYLING UPDATE & ACCESSIBILITY SUMMARY

What I changed:
- Added a shared CSS variables system (pastel palette and RGB helpers) in `styles/main.css`.
- Replaced hard-coded color values in buttons, story cards, final section, and audio player with variables.
- Converted audio player artwork and controls to use `--card-bg`, `--card-bg-2`, and `--accent-primary-rgb` for consistent gradients.
- Added keyboard and ARIA accessibility improvements: skip link, `role=main`, `aria-labelledby` for sections, `aria-label` for interactive controls, slider aria metadata, and `aria-pressed` updates for the play button.

Regressions:
- No behavioral JavaScript regressions introduced — the updated styles and accessibility attributes do not change functionality, only the visual appearance and ARIA semantics.

Planned next steps (suggested):
1) Fine-tune color contrast if required for compliance (use tools like Axe, or color contrast checkers). This might require tweaking `--yes-foreground` and `--no-foreground` variables.
2) Add a small `assets/music/background.mp3` sample for QA (royalty-free: e.g., from YouTube Audio Library) and validate the controller UI across browsers.
3) Add automated CSS tests if desired or visual snapshot tests in CI.
4) Continue migrating any remaining CSS files to consume the shared variables so the design language remains consistent.

If you'd like, I can now:
- Add the sample MP3 in `assets/music/background.mp3` and show a simple QA checklist to verify audio behavior.
- Run a cross-browser smoke test script (headless browsers) to ensure UI and animations render properly.
- Add ARIA live region announcements for play/pause and volume changes.

— Styling update performed by Copilot in response to review feedback.
