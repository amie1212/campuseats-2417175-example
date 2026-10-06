# AI usage log

## Week 1
- Tool(s): Antigravity (Gemini 3.8 Flash)
- What I asked for: Assisted in setting up the Vite + React project, organizing the component structure (Header, VendorCard, MenuItemCard, Footer), transforming the design into an Apple-inspired minimalist aesthetic (frosted glass header, clean typography, bento-box cards, pill buttons), optimizing for iPhone and iOS devices (safe-area insets, notch compatibility, 44px tap targets, responsive layout), deploying to GitHub Pages, answering reflection questions, and guiding Git commit/tag checkpoints.
- What I kept, changed or rejected, and why: Kept all required component architecture, tags, and CSS classes required by the BICS 3301 rubric. Applied Apple's design language: SF-style typography, frosted glass navigation (`backdrop-filter: blur`), subtle ambient shadows, `#0071e3` Apple blue pill action buttons, and minimalist bento grid presentation with authentic Mahallah Faruq vendor details. Added iPhone viewport-fit, mobile safe area padding, touch target sizing, and deployed to GitHub Pages.
- One thing the AI got wrong and how I fixed it: The initial boilerplate from Vite included extra SVG assets and default counter logic; cleared those out and structured the project into modular components under `src/components/` as required by the lab sheet.

## Full Functional App Implementation Phase
- Tool(s): Antigravity (Gemini 3.8 Flash)
- What I asked for: Expand the application into a complete, full-featured campus dining platform with multi-page client routing, real-time cart and order tracking, cafeteria kitchen display system (KDS), admin management portal, menu CRUD operations, voucher codes, and iPhone bottom tab navigation.
- What I kept, changed or rejected, and why: Implemented React Router with `HashRouter` to prevent GitHub Pages 404 routing errors on page refresh. Built hybrid state management combining LocalStorage persistence with Firebase Firestore/Auth readiness. Kept the Apple human interface design system with dynamic toast notifications, accessible dialog modals, and iOS-safe bottom tab navigation.
- One thing the AI got wrong and how I fixed it: GitHub Pages subpath routing can throw 404 when navigating directly to deep URLs; resolved this by using `HashRouter` and adding an automatic SPA redirect script in `public/404.html`.
