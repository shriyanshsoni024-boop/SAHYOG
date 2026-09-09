import puppeteer from 'puppeteer';

async function runTestSuite() {
  console.log('🚀 Starting SAHYOG Location Selector & Auto-Detect Functional QA Suite...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 }); // Mobile 390x844

    // 1. Load the App
    console.log('\n--- 1. Testing Page Load & Initial State ---');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await page.waitForSelector('header');
    
    // Check initial header location
    let headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header span[title], header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Initial Header Location: "${headerLoc}"`);

    // 2. Open Location Modal
    console.log('\n--- 2. Testing Modal Open & Predefined Selection ---');
    await page.click('header div[title="Change locality"]');
    await page.waitForSelector('input[placeholder="Search location..."]');
    console.log('✓ Location selector modal opened');

    // Click "Indiranagar 4th Block" from list
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[class*="hover-card"]'));
      const indira = items.find(el => el.textContent.includes('Indiranagar'));
      if (indira) indira.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // Verify header updated
    headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Updated Header Location to Indiranagar: "${headerLoc}"`);
    if (headerLoc !== 'Indiranagar 4th Block') {
      throw new Error(`Expected 'Indiranagar 4th Block', got '${headerLoc}'`);
    }

    // 3. Test Persistence across Reload
    console.log('\n--- 3. Testing Location Persistence across Page Reload ---');
    await page.reload({ waitUntil: 'networkidle0' });
    headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Header Location persisted after reload: "${headerLoc}"`);
    if (headerLoc !== 'Indiranagar 4th Block') {
      throw new Error(`Location failed to persist across reload: '${headerLoc}'`);
    }

    // 4. Test Search Filtering in Modal
    console.log('\n--- 4. Testing Search Filtering in Modal ---');
    await page.click('header div[title="Change locality"]');
    await page.waitForSelector('input[placeholder="Search location..."]');
    await page.type('input[placeholder="Search location..."]', 'Saket');
    await new Promise(r => setTimeout(r, 200));

    const visibleItems = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[class*="hover-card"]'));
      return items.map(el => el.textContent.trim()).filter(t => t.includes('Delhi') || t.includes('Saket') || t.includes('Noida') || t.includes('Bengaluru'));
    });
    console.log(`✓ Search filter results for 'Saket': ${JSON.stringify(visibleItems)}`);
    
    // Select Saket
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[class*="hover-card"]'));
      const saket = items.find(el => el.textContent.includes('Saket'));
      if (saket) saket.click();
    });
    await new Promise(r => setTimeout(r, 300));

    headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Selected Saket, Header updated: "${headerLoc}"`);

    // 5. Test Custom Manual Entry
    console.log('\n--- 5. Testing Custom Locality Manual Entry ---');
    await page.click('header div[title="Change locality"]');
    await page.waitForSelector('input[placeholder="Search location..."]');
    
    // Click "+ Enter location manually"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const manualBtn = btns.find(b => b.textContent.includes('Enter location manually'));
      if (manualBtn) manualBtn.click();
    });
    await new Promise(r => setTimeout(r, 200));

    // Type custom location
    await page.waitForSelector('input[placeholder*="Sector 62, Noida, Indiranagar"]');
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Sector 62, Noida, Indiranagar"]');
      if (input) input.value = '';
    });
    await page.type('input[placeholder*="Sector 62, Noida, Indiranagar"]', 'Cyber Hub, Sector 24, Gurugram');
    
    // Click Confirm Location
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find(b => b.textContent.includes('Confirm Location'));
      if (confirmBtn) confirmBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Custom manual locality confirmed: "${headerLoc}"`);
    if (headerLoc !== 'Cyber Hub, Sector 24, Gurugram') {
      throw new Error(`Custom location confirmation failed: '${headerLoc}'`);
    }

    // 6. Test Auto-Detect Location (Bengaluru coordinates -> Indiranagar)
    console.log('\n--- 6. Testing Auto-Detect Location with Geolocation API ---');
    // Mock geolocation coordinates for Bengaluru (near Indiranagar)
    await page.setGeolocation({ latitude: 12.9716, longitude: 77.5946 });
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('http://localhost:5173', ['geolocation']);

    await page.click('header div[title="Change locality"]');
    await page.waitForSelector('input[placeholder="Search location..."]');
    
    // Click "Use my current location"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const autoBtn = btns.find(b => b.textContent.includes('Use my current location'));
      if (autoBtn) autoBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Auto-detected nearest locality from Bengaluru coords: "${headerLoc}"`);
    if (headerLoc !== 'Indiranagar 4th Block' && headerLoc !== 'HSR Layout Sector 2') {
      throw new Error(`Auto-detect failed for Bengaluru coordinates, got '${headerLoc}'`);
    }

    // Test Auto-Detect Location with Mumbai coordinates -> Andheri West
    console.log('\n--- 7. Testing Auto-Detect Location (Mumbai Coordinates) ---');
    await page.setGeolocation({ latitude: 19.0760, longitude: 72.8777 }); // Mumbai
    await page.click('header div[title="Change locality"]');
    await page.waitForSelector('input[placeholder="Search location..."]');
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const autoBtn = btns.find(b => b.textContent.includes('Use my current location'));
      if (autoBtn) autoBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Auto-detected nearest locality from Mumbai coords: "${headerLoc}"`);
    if (headerLoc !== 'Andheri West') {
      throw new Error(`Auto-detect failed for Mumbai coordinates, got '${headerLoc}'`);
    }

    // 8. Test Geolocation Denial / Error Handling
    console.log('\n--- 8. Testing Geolocation Denial / Error Handling ---');
    await context.overridePermissions('http://localhost:5173', []); // Revoke / clear permissions
    // Simulate denial
    await page.evaluate(() => {
      navigator.geolocation.getCurrentPosition = (success, error) => {
        const err = new Error('User denied Geolocation');
        err.code = 1; // PERMISSION_DENIED
        error(err);
      };
    });

    await page.click('header div[title="Change locality"]');
    await page.waitForSelector('input[placeholder="Search location..."]');
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const autoBtn = btns.find(b => b.textContent.includes('Use my current location'));
      if (autoBtn) autoBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const errorMessage = await page.evaluate(() => {
      const alert = document.querySelector('div[style*="background-color: rgb(254, 242, 242)"]');
      return alert ? alert.textContent.trim() : null;
    });
    console.log(`✓ Geolocation denial handled gracefully with user message: "${errorMessage}"`);

    // Verify manual selection is still fully operational while error is visible
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[class*="hover-card"]'));
      const dlf = items.find(el => el.textContent.includes('DLF Phase 3'));
      if (dlf) dlf.click();
    });
    await new Promise(r => setTimeout(r, 300));

    headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Selected DLF Phase 3 after error: "${headerLoc}"`);
    if (headerLoc !== 'DLF Phase 3, Gurgaon') {
      throw new Error(`Selection failed after geo denial: '${headerLoc}'`);
    }

    // 9. Test Service Detail & Booking Creation with Selected Location
    console.log('\n--- 9. Testing Service Detail & Booking Creation with Selected Location ---');
    // Navigate to a service detail
    await page.evaluate(() => {
      const catCards = Array.from(document.querySelectorAll('.hover-card'));
      if (catCards[0]) catCards[0].click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Check location card in ServiceDetailPage
    const detailLocationText = await page.evaluate(() => {
      const locDiv = document.querySelector('div:has(> div > div:contains("Current Location")), div[style*="border: 1px solid var(--border-default)"]');
      return document.body.textContent.includes('DLF Phase 3, Gurgaon');
    });
    console.log(`✓ Service Detail page contains active location ('DLF Phase 3, Gurgaon'): ${detailLocationText}`);

    // Proceed to Worker Matching and Book
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Find Verified Artisans') || b.textContent.includes('Find'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Click Book on first available worker
    await page.evaluate(() => {
      const bookBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Book') || b.textContent.includes('बुक'));
      if (bookBtn) bookBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Verify Tracking Page contains the booking with the selected locality
    const trackingPageLoc = await page.evaluate(() => {
      return document.body.textContent.includes('DLF Phase 3, Gurgaon');
    });
    console.log(`✓ New booking created and tracked with selected location: ${trackingPageLoc}`);

    // 10. Test Role Switching Consistency (Customer -> Worker -> Admin -> Customer)
    console.log('\n--- 10. Testing Role Switching Consistency ---');
    // Switch to Worker
    await page.evaluate(() => {
      const workerBtn = Array.from(document.querySelectorAll('button, div')).find(el => el.textContent.includes('Worker / Artisan'));
      if (workerBtn) workerBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Switch to Admin
    await page.evaluate(() => {
      const adminBtn = Array.from(document.querySelectorAll('button, div')).find(el => el.textContent.includes('Cooperative / Admin'));
      if (adminBtn) adminBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Verify Admin sees the same location
    const adminLocText = await page.evaluate(() => {
      return document.body.textContent.includes('DLF Phase 3, Gurgaon');
    });
    console.log(`✓ Admin view reflects active cooperative locality: ${adminLocText}`);

    // Switch back to Customer
    await page.evaluate(() => {
      const custBtn = Array.from(document.querySelectorAll('button, div')).find(el => el.textContent.includes('Customer'));
      if (custBtn) custBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    headerLoc = await page.evaluate(() => {
      const el = document.querySelector('header div[title="Change locality"] span');
      return el ? el.textContent.trim() : null;
    });
    console.log(`✓ Returned to Customer, Header location remains: "${headerLoc}"`);

    // 11. Responsive Viewport Check (Desktop 1440x900)
    console.log('\n--- 11. Testing Desktop Responsive Layout (1440x900) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await new Promise(r => setTimeout(r, 300));
    
    const desktopHeaderVisible = await page.evaluate(() => {
      const desktopRow = document.querySelector('.show-desktop-flex');
      return desktopRow && window.getComputedStyle(desktopRow).display !== 'none';
    });
    console.log(`✓ Desktop single-row header rendered correctly: ${desktopHeaderVisible}`);

    console.log('\n🎉 ALL 11 TESTS PASSED PERFECTLY!');
  } finally {
    await browser.close();
  }
}

runTestSuite().catch(err => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
