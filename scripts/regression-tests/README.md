# Regression test scripts

Playwright smoke/regression scripts written during the dependency security
upgrade (react-router-dom v5→v7, react 16→18, redux-toolkit 1→2, yup 0.29→1.x)
to confirm nothing broke. Not part of the app's own dev dependencies — run
with a standalone `npm install playwright` from this directory (or anywhere)
the first time.

## `local.mjs`

Full regression suite against `http://localhost:3000` (frontend) +
`http://localhost:8000` (backend), **including mutations**: signs up a
throwaway test user, adds a test recipe, edits it, then the script itself
deletes the recipe via `DELETE /recipe/:id` at the end. Safe because local
uses the local Mongo instance — never point this at a real/deployed backend.

Covers: homepage/browse/search/recipe-view rendering, unknown-route handling,
signup + login validation and success paths, session persistence across
reload, auth-gated route redirects (both logged in and logged out), add/edit
recipe forms, and browser back/forward.

Prerequisites: both servers running locally
(`recipes-backend`: `node -r ts-node/register src/index.ts`,
`recipes-frontend`: `yarn dev`, expected on port 3000 — the backend's CORS
allowlist only permits that port in dev, so free it first if something else
is squatting on it).

```
node local.mjs
```

## `preview-readonly.mjs`

Read-only subset against a deployed preview URL (edit the `base` const at the
top of the file to point at the current preview). **Never add mutation steps
to this script** — deploy previews for this app point at the production
database, not a sandbox. It only checks rendering, client-side-only form
validation (errors that fire before any API call), and auth-gated redirects
that don't require actually logging in.

```
node preview-readonly.mjs
```

## Notes for next time

- Both scripts assume Chromium is already installed for Playwright
  (`npx playwright install chromium` if not).
- `local.mjs`'s edit-recipe step navigates via the in-app "Edit" link (not
  `page.goto`) deliberately: a hard page load remounts `App`, and there's a
  brief window where the auth-gated route guard in `Routes.tsx` evaluates
  `isAuthenticated` as `false` before the async token-rehydration fetch in
  `App.tsx` resolves — it bounces you to `/login` (or worse, to `/` after the
  login-page-authenticated-redirect fires with an empty suffix). This affects
  a real logged-in user hitting refresh on a protected page too, not just the
  test script — pre-existing behavior, not something the dependency upgrade
  introduced. Worth a real fix at some point (e.g. gate rendering on the
  rehydration check completing), but out of scope for this pass.
- Homepage (`/`) intentionally renders without the shared `Header` — don't
  look for header links (Browse/Search/New Recipe/Log In/Log Out) while on
  `/`; navigate to `/browse` or elsewhere first.
- Category browse slugs are custom, not raw category values — e.g. desserts
  is `/browse/desserts` (plural), not `/browse/dessert`. See
  `src/components/Browse/Browse.tsx`'s `CATEGORY_DATA` for the full slug map.
