---
name: ecommerce-product-polish
description: 'Plan, implement, and verify production-quality e-commerce UX in the Neatify Car Care React/Vite storefront and Express backend. Use for storefront redesigns, admin dashboard improvements, product discovery, cart and checkout flows, responsive UI, accessibility, loading/error states, performance, hero sections, or scroll behavior.'
argument-hint: 'Describe the e-commerce flow, screen, or quality problem to improve.'
user-invocable: true
disable-model-invocation: false
---

# Neatify E-commerce Product Polish

## Outcome

Deliver a working, production-oriented e-commerce experience across the customer storefront and admin dashboard. Preserve the existing React/Vite, Express, MongoDB, React Query, Zustand, React Hook Form, Zod, Framer Motion, and Lucide conventions unless a measured reason requires a change.

This skill is for implementation, not for producing a visual-only mockup. Every visible control must have a real state transition, API integration, or an explicit disabled/unavailable state.

## Workspace Map

Start at the nearest owning module:

- Customer routing and page composition: `frontend/src/App.jsx`, `frontend/src/user/pages/`
- Customer components and flows: `frontend/src/user/components/`, `frontend/src/user/hooks/`, `frontend/src/store/`
- Shared API helpers: `frontend/src/api/`, `frontend/src/utils/`
- Customer visual system: `frontend/src/user.css`, `frontend/src/App.css`, `frontend/src/index.css`
- Admin composition and behavior: `frontend/src/admin/components/`, `frontend/src/admin/hooks/`, `frontend/src/admin.css`
- Backend routes and HTTP contracts: `backend/src/routes/`, `backend/src/controllers/`, `backend/src/services/`, `backend/src/repositories/`
- Persistence and validation: `backend/src/models/`, `backend/src/validators/`

Read `code_guidlines.md` before introducing a new pattern. Do not broadly rewrite unrelated files or erase existing user changes.

## Procedure

### 1. Establish the local contract

1. Identify the concrete screen, symbol, failing behavior, or user flow.
2. Read its nearest component, hook, API call, style block, and neighboring test or call site.
3. State one falsifiable hypothesis about the current behavior and one cheap check that could disconfirm it.
4. Inspect existing routes, auth guards, cart state, API response shape, and loading/error behavior before adding a duplicate abstraction.
5. Keep business rules out of presentational components. Put server state in React Query, client-only cart or UI state in the existing store/hooks, and validation at the form/API boundary.

If the requested feature is missing, first define its user flow and API contract, then implement the smallest vertical slice through UI, state, endpoint, validation, and feedback.

### 2. Set the experience direction

Use the existing visual language as a baseline, then make a deliberate, product-first system:

- Use clear type hierarchy, restrained spacing, strong product imagery, and predictable surfaces.
- Keep cards at 8px radius or less unless an established local component requires otherwise.
- Use the existing lime/black/paper palette thoughtfully; add contrast and supporting neutrals rather than making every surface lime or dark.
- Use Lucide icons for icon actions and provide accessible labels/tooltips for unfamiliar icons.
- Keep primary CTAs specific: `Add to cart`, `Buy now`, `Continue to checkout`, `Track order`.
- Make price, discount, stock, delivery, returns, and trust information scannable near the purchase decision.
- Use motion for page entry, state transitions, and feedback only. Honor `prefers-reduced-motion` and avoid animation that delays purchase actions.
- Use real assets already in `frontend/public/assets/` where available. Do not invent product claims or hide missing data behind misleading UI.

### 3. Implement the customer journey

Cover the relevant path end to end:

1. Home: navigation, search, category entry points, featured products, offers, social proof, trust details, and support links.
2. Discovery: category/subcategory navigation, autocomplete/search suggestions, filter, sort, pagination or load-more, empty state, and retry state.
3. Product: gallery with meaningful alt text, zoom where useful, variants, price and discount, stock, delivery, returns, description, specifications, reviews, FAQs, related items, wishlist, and clear purchase actions.
4. Cart: quantity constraints, remove/undo, stock changes, coupon validation, shipping/tax totals, subtotal, empty state, and checkout CTA.
5. Checkout: guest and authenticated paths, address validation, shipping choice, payment method, order summary, duplicate-submit prevention, failure recovery, and confirmation.
6. Account: profile, addresses, wishlist, order history, tracking, cancellation/return/refund status, notifications, and support.
7. Informational trust pages: contact, FAQ, about, privacy, terms, shipping, returns/refunds, and support.

For every important action, provide loading, success, empty, error, and confirmation states as appropriate. Preserve entered form data when a recoverable request fails.

### 4. Keep the hero contract exact

The homepage hero must contain exactly **two** hero sections/panels/slides, never three. Treat this as an acceptance criterion in both implementation and review:

- Search for every hero data array, slide renderer, carousel indicator, and duplicate hero markup before editing.
- Keep the two panels distinct and useful, with one primary CTA per panel and accessible previous/next controls if they rotate.
- Do not add a third fallback slide, hidden desktop slide, duplicate mobile slide, or third pagination dot.
- If a carousel is used, make it keyboard operable, pauseable, touch friendly, and stable when reduced motion is enabled.
- Verify at desktop and mobile widths that the next homepage content is visible below the hero and no hero text or CTA overlaps.

### 5. Make section scrolling land at the center

All in-page navigation and programmatic section navigation must use one shared behavior. Do not scatter raw `scrollIntoView()` or `window.scrollTo()` calls with inconsistent options.

Implement or reuse a helper/hook that:

- Resolves the target by stable `id` or ref and safely no-ops when it is absent.
- Accounts for the sticky header and responsive safe areas.
- Scrolls the target into the visual center of the viewport, with a bounded offset when the section is taller than the viewport.
- Uses smooth behavior normally and instant behavior for `prefers-reduced-motion: reduce`.
- Updates focus accessibly without causing a second jump; focus the target only when appropriate and use `tabIndex={-1}` for non-interactive section headings/containers.
- Handles hash navigation after route changes and waits until the target is mounted.
- Works with mouse, keyboard, touch, footer links, nav links, product back links, and mobile navigation.

Acceptance check: click every internal anchor from desktop and mobile, reload a URL with a hash, and navigate from a product page back to a section. The intended section must settle centered and remain below the sticky header without clipping.

### 6. Build admin parity

Treat the admin panel as a working product, not a decorative dashboard. Keep navigation and permissions explicit, and add the relevant views for:

- Dashboard analytics and operational summaries
- Products, variants, categories, media, and inventory
- Orders, payments, shipping, cancellations, returns, refunds, and replacements
- Customers, reviews, subscribers, notifications, coupons, promotions, and content
- SEO, reports, settings, roles/permissions, and audit activity

Use tables for comparison-heavy data, filters and bulk actions where appropriate, confirmation dialogs for destructive actions, optimistic updates only when rollback is reliable, and visible permission/error states when an action is unavailable.

### 7. Harden the implementation

- Validate all user input at the client and server boundaries.
- Centralize API error normalization and never expose secrets or stack traces to users.
- Enforce authorization on the backend; do not rely on route guards or local storage alone.
- Prevent duplicate checkout/order requests and validate stock and totals on the server.
- Use semantic landmarks, form labels, live regions for async feedback, visible focus states, sufficient contrast, keyboard access, and touch targets of at least 44px where practical.
- Add useful document titles, canonical product URLs, metadata, structured product information, and descriptive image alt text.
- Avoid layout shift with stable image dimensions, skeletons, and reserved control space.
- Lazy-load below-fold media and avoid unnecessary global listeners, duplicated fetches, and expensive render loops.
- Keep compatibility with the existing deployment configuration in `vercel.json` and environment variable conventions.

## Validation Gates

Run focused checks immediately after each substantive slice, then the broad checks:

1. Frontend lint: `npm run lint --prefix frontend`
2. Frontend production build: `npm run build --prefix frontend`
3. Backend checks available in `backend/package.json` and API tests, if present.
4. Exercise the changed flow in a browser at mobile and desktop widths.
5. Check keyboard-only navigation, reduced motion, empty/loading/error states, and console/network errors.
6. For hero or scroll changes, explicitly verify exactly two hero panels and centered landing for every internal navigation target.
7. Review the final diff for unrelated churn, missing cleanup, broken imports, hard-coded secrets, and dead controls.

When browser automation is available, capture screenshots at representative mobile and desktop sizes and verify that the main content is nonblank, controls are not overlapped, and interactive states actually change. Do not claim a flow is production-ready when an API, payment integration, or credential-dependent path remains a demo; label that boundary clearly.

## Completion Checklist

- [ ] The requested customer or admin flow works from entry point to feedback state.
- [ ] Existing auth, cart, API, and routing contracts were preserved or deliberately migrated.
- [ ] Exactly two hero panels/sections remain.
- [ ] All internal scrolling lands centered, accounts for the sticky header, and respects reduced motion.
- [ ] Responsive layouts work at mobile, tablet, laptop, and desktop widths.
- [ ] Loading, empty, error, success, disabled, and confirmation states are covered.
- [ ] Keyboard navigation, focus, labels, contrast, and reduced-motion behavior are checked.
- [ ] Server-side validation, authorization, totals, and stock rules are enforced for changed APIs.
- [ ] SEO, performance, and stable layout behavior were considered for changed pages.
- [ ] Focused lint/build/browser checks pass, and remaining limitations are stated plainly.

## Example Prompts

- `Use /ecommerce-product-polish to make the homepage production-ready. Keep exactly two hero panels and fix every internal link to land centered.`
- `Use /ecommerce-product-polish to complete the cart-to-checkout flow, including errors, stock validation, coupon states, and mobile accessibility.`
- `Use /ecommerce-product-polish to audit the admin orders screen and implement the missing loading, empty, permission, return, and refund states.`
