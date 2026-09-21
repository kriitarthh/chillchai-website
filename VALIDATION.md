# Validation — 20 September 2026

- npm install completed; dependency audit reported zero vulnerabilities.
- npm run build passed (TypeScript and Vite production build).
- npm run dev started successfully on http://127.0.0.1:5173/.
- Chrome browser checks passed at 1440, 768, 390 and 320 pixel widths, with no horizontal page overflow.
- All three project dialogs opened and closed with Escape; focus returned to each triggering project button.
- Mobile menu opened and closed after selecting a navigation link.
- Both email links use the supplied address and a prefilled subject.
- No browser page errors were recorded.
- Desktop full-page, mobile, hero and project-dialog screenshots were visually inspected.
- Reduced-motion rendering was exercised. CSS disables smooth scroll and transitions in that mode.

Limitations: no real-device/Safari/Firefox test or formal accessibility audit. External profile destinations and live audience figures were not independently verified. No deployment was performed. npm 12 blocked optional install scripts for esbuild/fsevents; the installed platform binary worked and both Vite commands passed without enabling them.

## Motion enhancement

- Build passes with prerendered HTML and client hydration; no browser errors.
- Four widths rechecked (1440, 768, 390, 320): no horizontal overflow.
- Contact signature triggers on entering the viewport.
- Dialog keyboard containment, Escape and return focus pass.
- Mobile navigation remains functional.
- Reduced-motion mode has no running animations after navigation.
- Production page headings and all three portfolio records remain readable with JavaScript disabled.
- Content remains visible with Intersection Observer and Web Animations unavailable.
- Existing copy, palette, typefaces and section layout retained. No dependencies added.

## Lemon Drop signature

- Production build and prerender pass; no new dependencies.
- Desktop (1440px) and mobile (390px) timeline checked, with screenshots during the tagline and logo travel.
- The animated image is the original header DOM image; no duplicate intro logo exists.
- Logo arrives back at its existing header dimensions and position.
- No horizontal overflow at tested widths.
- Repeat visits skip the full sequence; the review URL `?intro=1` replays it.
- Header activation retains its #home navigation and plays one finite bounce.
- Keyboard interaction and navigation interrupt the intro immediately.
- Reduced motion skips the sequence; changing the preference during playback also cancels it.
- Without JavaScript the intro stays hidden and prerendered page content stays visible.
- Cold-load layout-shift scores were below 0.012 in desktop/mobile checks (not zero; external font loading is still present). The intro elements are fixed or transform-only and do not add document flow space.
