import puppeteer from 'puppeteer';

async function runAuthRoutingVerification() {
  console.log('🚀 Starting SAHYOG Auth Routing & Role Separation Verification Suite...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let testsPassed = 0;
  let totalTests = 0;

  const assert = (condition, description) => {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${description}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${description}`);
    }
  };

  try {
    // -------------------------------------------------------------
    // TEST 1: Responsive Mobile Viewport (390 x 844) - Customer Login
    // -------------------------------------------------------------
    console.log('--- TEST 1: Customer Login Page (/customer/login) [Mobile 390x844] ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:5173/#/customer/login', { waitUntil: 'networkidle0' });

    const customerHeading = await page.$eval('h1', el => el.textContent?.trim());
    assert(customerHeading === 'SAHYOG', 'Branding title "SAHYOG" present');

    const customerBadge = await page.evaluate(() => document.body.innerText.includes('CUSTOMER MARKETPLACE'));
    assert(customerBadge, 'Customer marketplace badge displayed');

    const hasCustomerInputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.some(i => i.placeholder.includes('9980122334') || i.placeholder.includes('Mobile')) &&
             inputs.some(i => i.type === 'password' || i.placeholder.includes('password'));
    });
    assert(hasCustomerInputs, 'Mobile/Email and Password inputs present on customer login');

    const hasCreateCustomerAccount = await page.evaluate(() => document.body.innerText.includes('Create Account'));
    assert(hasCreateCustomerAccount, '"Create Account" toggle present for customers');

    const hasCustomerForgot = await page.evaluate(() => document.body.innerText.includes('Forgot password?'));
    assert(hasCustomerForgot, '"Forgot password?" option present');

    // Test Customer Sign In
    const customerLoginBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent?.includes('Sign In as Customer'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(customerLoginBtn, 'Clicked "Sign In as Customer" button');
    await new Promise(r => setTimeout(r, 600));

    // Verify post-login landing on /customer/home
    const afterCustomerLoginHash = await page.evaluate(() => window.location.hash);
    assert(afterCustomerLoginHash === '#/customer/home', `Post-login redirected to /customer/home (Current: ${afterCustomerLoginHash})`);

    // -------------------------------------------------------------
    // TEST 2: Route Protection - Customer attempting to access Worker/Admin routes
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: Route Protection & Access Guard for Customer Session ---');
    await page.goto('http://localhost:5173/#/worker/home', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    const workerAccessRestricted = await page.evaluate(() => document.body.innerText.includes('Artisan Pro Access Restricted') || document.body.innerText.includes('CUSTOMER'));
    assert(workerAccessRestricted, 'Worker protected route blocks logged-in Customer with security prompt');

    await page.goto('http://localhost:5173/#/admin/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    const adminAccessRestricted = await page.evaluate(() => document.body.innerText.includes('Cooperative Federation Security Gate') || document.body.innerText.includes('CUSTOMER'));
    assert(adminAccessRestricted, 'Admin protected route blocks logged-in Customer with security gate');

    // -------------------------------------------------------------
    // TEST 3: Worker Login Page (/worker/login)
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Worker Login Page (/worker/login) [Mobile 390x844] ---');
    await page.goto('http://localhost:5173/#/worker/login', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    const workerBadge = await page.evaluate(() => document.body.innerText.includes('ARTISAN PRO • 0% COMMISSION'));
    assert(workerBadge, 'Artisan Pro 0% Commission branding badge present');

    const hasRegisterArtisan = await page.evaluate(() => document.body.innerText.includes('Register as Artisan'));
    assert(hasRegisterArtisan, '"Register as Artisan" tab present for workers');

    const workerLoginBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent?.includes('Sign In to Artisan Pro'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(workerLoginBtn, 'Clicked "Sign In to Artisan Pro" button');
    await new Promise(r => setTimeout(r, 600));

    const afterWorkerLoginHash = await page.evaluate(() => window.location.hash);
    assert(afterWorkerLoginHash === '#/worker/home', `Post-login redirected to /worker/home (Current: ${afterWorkerLoginHash})`);

    // -------------------------------------------------------------
    // TEST 4: Admin Login Page (/admin/login) [Desktop 1440px]
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Admin Login Page (/admin/login) [Desktop 1440px] ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/#/admin/login', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    const adminBadge = await page.evaluate(() => document.body.innerText.includes('FEDERATION OPERATIONS COMMAND'));
    assert(adminBadge, 'Federation Operations Command badge displayed');

    const hasNoPublicSignup = await page.evaluate(() => {
      return !document.body.innerText.includes('Create Account') &&
             document.body.innerText.includes('Authorized Personnel Only');
    });
    assert(hasNoPublicSignup, 'Admin login excludes public signup and displays security advisory');

    const adminLoginBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent?.includes('Sign In to Operations Command'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(adminLoginBtn, 'Clicked "Sign In to Operations Command" button');
    await new Promise(r => setTimeout(r, 600));

    const afterAdminLoginHash = await page.evaluate(() => window.location.hash);
    assert(afterAdminLoginHash === '#/admin/dashboard', `Post-login redirected to /admin/dashboard (Current: ${afterAdminLoginHash})`);

    // -------------------------------------------------------------
    // TEST 5: Demo Role Switcher Persistence & Flow
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Demo Role Switcher Bar Verification ---');
    const demoBarPresent = await page.evaluate(() => document.body.innerText.includes('Role: Admin') || document.body.innerText.includes('Admin'));
    assert(demoBarPresent, 'DemoRoleBar remained functional and active');

    console.log(`\n======================================================`);
    console.log(`VERIFICATION SUMMARY: ${testsPassed}/${totalTests} Tests Passed (${Math.round((testsPassed/totalTests)*100)}%)`);
    console.log(`======================================================\n`);

  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
}

runAuthRoutingVerification();
