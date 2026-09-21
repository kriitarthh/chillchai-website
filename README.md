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
- `public/assets`: original source PDFs, optimized lossless logo conversion and optimized WebP creator portraits. The original logo is preserved, including its background colour, without redrawing or recolouring. The rest of the site uses the four specified colours.

Fonts are Playfair Display, Inter and Caveat, loaded through Google Fonts with display=swap and local fallbacks. These families are openly licensed; no proprietary font files are bundled. External font requests need connectivity; the page remains usable without them.

The site uses native HTML dialogs for case studies: focus trapping, Escape dismissal and return focus to the triggering project button. Navigation, mail links and project buttons are keyboard accessible. Motion is isolated in `src/motion.css` and `src/useStudioMotion.ts`: staggered hero entrances, finite lemon motion, one-time Intersection Observer reveals, button and portfolio feedback, service accents, and a one-time contact lemon roll with a sparkle and drawn underline. Mobile uses smaller movements. Reduced-motion preferences disable these animations, including cancellation of active scroll reveals when the preference changes. No animation libraries are installed. Content is never held in a hidden state waiting for an observer.

The production build prerenders the page through `scripts/prerender.mjs`; React then hydrates that HTML. All page content remains readable if JavaScript fails or is disabled (mobile menu and project dialogs still need JavaScript). Decorative contact artwork is absolutely positioned and does not change section layout.

## Evidence and editorial decisions

Sources: the supplied `offerings.pdf` (2026 snapshot) and the implementation brief. Counts are not live statistics.

- The source's 360K+ "combined organic reach" is presented as combined followers and subscribers. Its listed figures total 362.5K across accounts/platforms. This is not unique reach; audiences can overlap.
- 60+ brand collaborations and five product launches are attributed to Avishi, not presented as agency client counts.
- Protein Mummy is clearly labelled managed creator work. 213K Instagram followers, 3.7M+ monthly views and 10M+ Air Fryer series views are source-reported.
- Capri Sports is deliberately excluded from the public website at the user's request. Do not restore it without explicit publication approval.
- The 90–100 creator roster is omitted pending clarification of membership/availability. No exclusive representation or guaranteed availability is implied.
- Creator Instagram URLs are derived from the exact handles in the one-pager; account ownership, current availability and profile counts were not independently verified. Confirm before publication.
- FUYL, unsigned prospects, testimonials, invented client logos, stock project photographs and fabricated outcomes are excluded.

## Items to add or confirm before publishing

1. Confirm current metrics, profile URLs and the supplied email/WhatsApp number.
2. Supply the final domain, then add a canonical URL, og:url and absolute share-image URL to `index.html`. No domain or share image is invented.
3. Add client work only after explicit approval to name the client and publish the scope.

The mail CTA opens an email draft with a prefilled enquiry subject. WhatsApp opens the number explicitly supplied in the one-pager. No booking link, contact form or submission backend is included.

## Vercel deployment (only when approved)

1. Put this folder in your Git repository, excluding `node_modules` and `dist`.
2. Import the repository into Vercel and choose the Vite framework preset.
3. Use `npm run build` as the build command and `dist` as the output directory. If this folder is inside a larger repository, set it as the Root Directory.
4. Use Node.js 22 or newer. No environment variables are required.
5. Review the preview deployment, confirm the content and links, then publish and attach your approved domain.

The site uses section anchors and modal details, so no route rewrite configuration is necessary. This project has not been publicly deployed.

## Lemon Drop signature opening

`src/LemonDrop.tsx` uses the existing native Web Animations API and animates the **actual header logo image** from the viewport centre back to its normal position. `src/lemon-drop.css` contains its isolated styling. The two intro lines are editable under `intro` in `src/content.ts`.

The 2-second timeline includes a drop, one bounce, a sparkle, tea ripple, staggered italic tagline and continuous travel into the navbar. Hero elements reveal during the final movement. Mobile uses a smaller lemon and bounce. The existing header link keeps its original navigation and adds a finite bounce/sparkle on activation and a small hover tilt.

A localStorage visit marker skips the full sequence on subsequent visits (a 280ms hero reveal remains). Append `?intro=1` to replay for review. Reduced-motion users get the final state immediately, including when their preference changes mid-animation. Interaction, scroll, navigation and resizing cancel the intro immediately. The overlay never receives pointer events or keyboard focus, and it is hidden in server-rendered HTML. If storage is unavailable, the animation still works without persisting a visit marker.

No libraries were added. The intro uses transforms and opacity with fixed overlay positioning; it does not move the underlying layout or wait on data/loading.
