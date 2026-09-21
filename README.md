# Chillchai Creations

A responsive, single-page creator studio portfolio built with React, Vite, TypeScript and Tailwind CSS. No backend, account, analytics or paid service is required.

## Local preview

Install Node.js 22 LTS or newer (with npm), then open a terminal in this folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://127.0.0.1:5173). For the production build:

```sh
npm run build
npm run preview
```

## Editing

- `src/content.ts`: all page copy, navigation labels, contact details, social links, proof points, team records and case studies. Add projects to `work.projects`; each automatically receives a card and a native dialog detail view. `theme` selects a visual treatment defined in CSS.
- `src/style.css`: brand palette, typography, layouts, mobile breakpoints, focus states and reduced-motion settings.
- `src/App.tsx`: existing reusable brand, section-heading and project-detail components and page structure. `src/main.tsx` hydrates the production HTML or mounts the development preview.
- `index.html`: document title, search and social metadata, favicon and font loading. Update these alongside content changes.
- `public/assets`: original source PDFs and optimized lossless logo conversion. The original logo is preserved, including its background colour, without redrawing or recolouring. The rest of the site uses the four specified colours.

Fonts are Playfair Display, Inter and Caveat, loaded through Google Fonts with display=swap and local fallbacks. These families are openly licensed; no proprietary font files are bundled. External font requests need connectivity; the page remains usable without them.

The site uses native HTML dialogs for case studies: focus trapping, Escape dismissal and return focus to the triggering project button. Navigation, mail links and project buttons are keyboard accessible. Motion is isolated in `src/motion.css` and `src/useStudioMotion.ts`: staggered hero entrances, finite lemon motion, one-time Intersection Observer reveals, button and portfolio feedback, service accents, and a one-time contact lemon roll with a sparkle and drawn underline. Mobile uses smaller movements. Reduced-motion preferences disable these animations, including cancellation of active scroll reveals when the preference changes. No animation libraries are installed. Content is never held in a hidden state waiting for an observer.

The production build prerenders the page through `scripts/prerender.mjs`; React then hydrates that HTML. All page content remains readable if JavaScript fails or is disabled (mobile menu and project dialogs still need JavaScript). Decorative contact artwork is absolutely positioned and does not change section layout.

## Evidence and editorial decisions

Sources: the supplied `offerings.pdf` (2026 snapshot) and the implementation brief. Counts are not live statistics.

- The source's 360K+ "combined organic reach" is presented as combined followers and subscribers. Its listed figures total 362.5K across accounts/platforms. This is not unique reach; audiences can overlap.
- 60+ brand collaborations and five product launches are attributed to Avishi, not presented as agency client counts.
- Protein Mummy is clearly labelled managed creator work. 213K Instagram followers, 3.7M+ monthly views and 10M+ Air Fryer series views are source-reported.
- Capri Sports is the documented client name. The brief also mentions Playdate, but the one-pager does not establish that relationship. Confirm the name before adding it.
- Capri's phases and deliverables are described; no revenue, sales, conversion or campaign-performance improvement is claimed.
- The 90–100 creator roster is omitted pending clarification of membership/availability. No exclusive representation or guaranteed availability is implied.
- Creator Instagram URLs are derived from the exact handles in the one-pager; account ownership, current availability and profile counts were not independently verified. Confirm before publication.
- FUYL, unsigned prospects, testimonials, invented client logos, stock project photographs and fabricated outcomes are excluded.

## Items to add or confirm before publishing

1. Real project photos/screenshots and permission to publish them. Current project covers are intentionally typography-led, not mockups. To introduce imagery, add optional image/alt fields to the project schema and render them in the card/dialog.
2. Real team portraits, if desired. Current profiles use text and initials.
3. Confirm Capri Sports / Playdate naming and the roster claim if needed.
4. Confirm current metrics, profile URLs and the supplied email/WhatsApp number.
5. Supply the final domain, then add a canonical URL, og:url and absolute share-image URL to `index.html`. No domain or share image is invented.

The mail CTA opens an email draft with a prefilled enquiry subject. WhatsApp opens the number explicitly supplied in the one-pager. No booking link, contact form or submission backend is included.

## Vercel deployment (only when approved)

1. Put this folder in your Git repository, excluding `node_modules` and `dist`.
2. Import the repository into Vercel and choose the Vite framework preset.
3. Use `npm run build` as the build command and `dist` as the output directory. If this folder is inside a larger repository, set it as the Root Directory.
4. Use Node.js 22 or newer. No environment variables are required.
5. Review the preview deployment, confirm the content and links, then publish and attach your approved domain.

The site uses section anchors and modal details, so no route rewrite configuration is necessary. This project has not been publicly deployed.

## Opening film

`public/assets/chillchai-intro.m4v` is a web-optimised, 0.8-second extract from the supplied `assets/Chill Chai Intro.mov`. The original 477 MB source is retained locally and excluded from Git by `assets/*.mov`; only the 679 KB web clip is deployed.

`src/LemonDrop.tsx` plays the opening lemon burst for approximately 0.72 seconds, fades directly into the existing hero and leaves all page controls available. `src/lemon-drop.css` keeps the film full-screen on desktop and uses a tighter crop on mobile. The header lemon's finite hover/click interaction remains.

A localStorage marker skips the film on subsequent visits. Append `?intro=1` to replay it for review. Reduced-motion users see the final page immediately, and any keyboard, pointer, scroll or resize interaction dismisses the film. The overlay receives no pointer events and stays hidden in server-rendered/no-JavaScript output.

No libraries were added. The video is muted, inline and preloaded; the transition uses opacity and does not affect document layout.
