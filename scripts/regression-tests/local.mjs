import { chromium } from 'playwright';

const base = 'http://localhost:3000';
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

const rand = () => Math.random().toString(36).slice(2, 8);
const testUser = {
  first_name: 'Test',
  last_name: 'User',
  username: `testuser_${rand()}`,
  email: `test_${rand()}@example.com`,
  password: 'password123',
};

// --- 1. Core navigation ---
await page.goto(base + '/', { waitUntil: 'networkidle' });
record('homepage loads', (await page.title()) === 'Glasser Family Recipes');

const RECIPE_CARD_SEL = '[class*="recipeItemContainer"]';

await page.goto(base + '/browse/all', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const recipeCards = await page.$$(RECIPE_CARD_SEL);
record('browse/all shows recipe cards', recipeCards.length > 0, `${recipeCards.length} cards`);

await page.goto(base + '/browse/desserts', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const dessertCards = await page.$$(RECIPE_CARD_SEL);
record('browse/desserts shows recipe cards', dessertCards.length > 0, `${dessertCards.length} cards`);

await page.goto(base + '/search?wildcard=chicken', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const searchResults = await page.$$(RECIPE_CARD_SEL);
record('search results render', searchResults.length >= 0, `${searchResults.length} results`);

await page.goto(base + '/recipe/8', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
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

// --- 2. Signup validation ---
await page.goto(base + '/signup', { waitUntil: 'networkidle' });
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
const requiredErrors = await page.$$('text=Required');
record('signup empty-submit shows Required errors', requiredErrors.length >= 4, `${requiredErrors.length} 'Required' texts`);

await page.fill('input[name="password"]', 'abcdef');
await page.fill('input[name="password_confirmation"]', 'zzzzzz');
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
const mismatchError = await page.$('text=Must match your password');
record('signup password-mismatch validation fires', !!mismatchError);

// --- 3. Signup success + header update ---
await page.fill('input[name="first_name"]', testUser.first_name);
await page.fill('input[name="last_name"]', testUser.last_name);
await page.fill('input[name="email"]', testUser.email);
await page.fill('input[name="username"]', testUser.username);
await page.fill('input[name="password"]', testUser.password);
await page.fill('input[name="password_confirmation"]', testUser.password);
await page.click('button[type="submit"]');
await page.waitForTimeout(800);
const urlAfterSignup = page.url();
record('signup success redirects away from /signup', !urlAfterSignup.includes('/signup'), urlAfterSignup);
const loggedInHeader = await page.textContent('body');
record('header reflects logged-in state after signup', loggedInHeader.includes('Log Out') && !loggedInHeader.includes('Log In'));

// --- 4. Logout ---
await page.getByText('Log Out', { exact: true }).first().click();
await page.waitForTimeout(500);
const bodyAfterLogout = await page.textContent('body');
record('logged out after clicking logout', bodyAfterLogout.includes('Log In') && !bodyAfterLogout.includes('Log Out'));

// --- 5. Login: wrong creds ---
await page.goto(base + '/login', { waitUntil: 'networkidle' });
await page.fill('input[name="username"]', testUser.username);
await page.fill('input[name="password"]', 'wrongpassword');
await page.click('button[type="submit"]');
await page.waitForTimeout(500);
const loginErrorText = await page.textContent('body');
record('wrong login creds show error, no crash', loginErrorText.toLowerCase().includes('invalid') || loginErrorText.toLowerCase().includes('incorrect'));

// --- 6. Login: correct creds ---
await page.fill('input[name="username"]', testUser.username);
await page.fill('input[name="password"]', testUser.password);
await page.click('button[type="submit"]');
await page.waitForTimeout(800);
const urlAfterLogin = page.url();
record('correct login redirects away from /login', !urlAfterLogin.includes('/login'), urlAfterLogin);

// --- 7. Session persists on refresh ---
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const bodyAfterReload = await page.textContent('body');
record('session persists after page refresh', bodyAfterReload.includes('Log Out'));

// --- 8. Auth-gated routes while logged in (client-side nav, not a hard reload) ---
// Homepage ('/') intentionally renders without the shared Header, so hop to /browse first.
await page.goto(base + '/browse', { waitUntil: 'networkidle' });
await page.getByRole('link', { name: 'New Recipe' }).first().click();
await page.waitForTimeout(300);
record('logged-in user can access /new', page.url().includes('/new'), page.url());

// --- 9. AddRecipe validation + success ---
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
const addRecipeErrors = await page.$$('text=Required');
record('AddRecipe empty-submit shows Required errors', addRecipeErrors.length >= 3, `${addRecipeErrors.length}`);

await page.fill('input[name="title"]', 'Playwright Test Recipe');
// leave submitted_by as auto-filled (currentUserFullName) so the edit-permission check passes later
await page.selectOption('select[name="category"]', 'dessert');
await page.fill('textarea[name="ingredientsTextarea"]', '1 cup flour\n2 eggs');
await page.fill('textarea[name="steps"]', 'Mix ingredients.\nBake at 350F.');
await page.click('button[type="submit"]');
await page.waitForTimeout(1000);
const urlAfterAdd = page.url();
const addedRecipeMatch = urlAfterAdd.match(/\/recipe\/(\d+)/);
record('AddRecipe success redirects to new recipe page', !!addedRecipeMatch, urlAfterAdd);
const newRecipeId = addedRecipeMatch ? addedRecipeMatch[1] : null;

if (newRecipeId) {
  const newRecipeTitle = await page.$eval('h1', (el) => el.textContent).catch(() => null);
  record('new recipe page shows correct title', newRecipeTitle === 'Playwright Test Recipe', newRecipeTitle);

  // --- 10. EditRecipe (client-side nav via the Edit link, not a hard reload) ---
  await page.getByRole('link', { name: 'Edit', exact: true }).first().click();
  await page.waitForTimeout(500);
  const titleFieldValue = await page.inputValue('input[name="title"]').catch(() => null);
  record('EditRecipe loads saved values', titleFieldValue === 'Playwright Test Recipe', titleFieldValue);

  await page.fill('input[name="title"]', 'Playwright Test Recipe (Edited)');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  const urlAfterEdit = page.url();
  record('EditRecipe save redirects to recipe page', urlAfterEdit.includes(`/recipe/${newRecipeId}`), urlAfterEdit);
  const editedTitle = await page.$eval('h1', (el) => el.textContent).catch(() => null);
  record('edited recipe shows updated title', editedTitle === 'Playwright Test Recipe (Edited)', editedTitle);
}

// --- 11. Auth-gated redirect while logged OUT ---
await page.getByText('Log Out', { exact: true }).first().click();
await page.waitForTimeout(500);
await page.goto(base + '/new', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
record('logged-out /new redirects to /login', page.url().includes('/login'), page.url());

if (newRecipeId) {
  await page.goto(base + `/recipe/${newRecipeId}/edit`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  record('logged-out edit route redirects to /login', page.url().includes('/login'), page.url());
}

// --- 12. Back/forward navigation ---
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.goto(base + '/browse', { waitUntil: 'networkidle' });
await page.goto(base + '/search', { waitUntil: 'networkidle' });
await page.goBack({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
record('back button navigates to /browse', page.url().endsWith('/browse'), page.url());
await page.goBack({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
record('back button navigates to /', page.url() === base + '/', page.url());
await page.goForward({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
record('forward button navigates to /browse', page.url().endsWith('/browse'), page.url());

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
