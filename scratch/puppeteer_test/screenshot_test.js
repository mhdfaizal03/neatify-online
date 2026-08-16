const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set viewport to a standard laptop size
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  try {
    await page.goto('https://neatify.site/admin');
    await new Promise(r => setTimeout(r, 2000));
    
    // Log in
    await page.type('#loginUser', 'admin');
    await page.type('#loginPass', 'neatify2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 3000));
    
    // Click Dashboard tab
    console.log("Clicking dashboard tab...");
    await page.click('button[data-view="dashboard"]');
    await new Promise(r => setTimeout(r, 1500));
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'admin_dashboard_view.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to: ${screenshotPath}`);
  } catch (e) {
    console.log("ERROR:", e);
  }

  await browser.close();
})();
