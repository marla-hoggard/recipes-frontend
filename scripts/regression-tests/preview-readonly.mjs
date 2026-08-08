import { chromium } from 'playwright';

const base = 'https://deploy-preview-29--glasser-recipes.netlify.app';
const results = [];
const errors = [];

function record(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${name}${detail ? ' :: ' + detail : ''}`);
}

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error' && !msg.text().includes('defaultProps')) {
    errors.push(`[console.error] ${msg.text()}`);
  }
});

const RECIPE_CARD_SEL = '[class*="recipeItemContainer"]';

// --- read-only navigation ---
await page.goto(base + '/', { waitUntil: 'networkidle' });
record('homepage loads', (await page.title()) === 'Glasser Family Recipes');

await page.goto(base + '/browse/all', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const recipeCards = await page.$$(RECIPE_CARD_SEL);
record('browse/all shows recipe cards', recipeCards.length > 0, `${recipeCards.length} cards`);

await page.goto(base + '/browse/desserts', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const dessertCards = await page.$$(RECIPE_CARD_SEL);
record('browse/desserts shows recipe cards', dessertCards.length > 0, `${dessertCards.length} cards`);

await page.goto(base + '/search?wildcard=chicken', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const searchResults = await page.$$(RECIPE_CARD_SEL);
record('search results render', searchResults.length > 0, `${searchResults.length} results`);

// grab a real recipe id to view, from the browse/all listing
await page.goto(base + '/browse/all', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.locator(RECIPE_CARD_SEL).first().click();
await page.waitForTimeout(800);
const onRecipePage = /\/recipe\/\d+/.test(page.url());
record('clicking a recipe card navigates to its detail page', onRecipePage, page.url());
const h1Text = await page.$eval('h1', (el) => el.textContent).catch(() => null);
record('recipe view renders real data', !!h1Text, h1Text || '(none)');

await page.goto(base + '/this-does-not-exist', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const invalidRouteText = await page.textContent('body');
record('unknown route shows Page Not Found fail whale', invalidRouteText.includes('Page Not Found'));

await page.goto(base + '/recipe/999999999', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const missingRecipeUrl = page.url();
const missingRecipeText = await page.textContent('body');
record('missing recipe renders Recipe Not Found in place (no redirect)', missingRecipeUrl.endsWith('/recipe/999999999'), missingRecipeUrl);
record('missing recipe shows Recipe Not Found fail whale', missingRecipeText.includes('Recipe Not Found'));

// --- client-side validation only, no submission ---
await page.goto(base + '/signup', { waitUntil: 'networkidle' });
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
const requiredErrors = await page.$$('text=Required');
record('signup empty-submit shows Required errors (no API call)', requiredErrors.length >= 4, `${requiredErrors.length} 'Required' texts`);

await page.fill('input[name="password"]', 'abcdef');
await page.fill('input[name="password_confirmation"]', 'zzzzzz');
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
const mismatchError = await page.$('text=Must match your password');
record('signup password-mismatch validation fires (no API call)', !!mismatchError);

await page.goto(base + '/login', { waitUntil: 'networkidle' });
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
const loginRequiredErrors = await page.$$('text=Required');
record('login empty-submit shows Required errors (no API call)', loginRequiredErrors.length >= 2, `${loginRequiredErrors.length}`);

// --- auth-gated redirect while logged out (no login attempted) ---
await page.goto(base + '/new', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
record('logged-out /new redirects to /login', page.url().includes('/login'), page.url());

// --- back/forward ---
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.goto(base + '/browse', { waitUntil: 'networkidle' });
await page.goto(base + '/search', { waitUntil: 'networkidle' });
await page.goBack({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
record('back button navigates to /browse', page.url().endsWith('/browse'), page.url());

console.log('\n=== SUMMARY ===');
const failed = results.filter((r) => !r.pass);
console.log(`${results.length - failed.length}/${results.length} passed`);
if (failed.length) {
  console.log('\nFAILURES:');
  failed.forEach((f) => console.log(`  - ${f.name} :: ${f.detail}`));
}

console.log('\n=== unexpected console/page errors ===');
console.log(errors.length ? [...new Set(errors)].join('\n') : 'none');

await browser.close();
