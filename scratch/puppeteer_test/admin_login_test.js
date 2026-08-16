const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure().errorText));

  try {
    await page.goto('https://neatify.site/admin');
    await new Promise(r => setTimeout(r, 2000));
    
    // Type credentials
    await page.type('#loginUser', 'admin');
    await page.type('#loginPass', 'neatify2026');
    
    // Click submit
    console.log("Submitting login form...");
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await new Promise(r => setTimeout(r, 3000));
    console.log("Logged in and on Dashboard.");
    
    // Click through each view
    const views = ['products', 'categories', 'media', 'orders', 'subscribers', 'settings'];
    for (const view of views) {
      console.log(`Navigating to view: ${view}`);
      await page.click(`button[data-view="${view}"]`);
      await new Promise(r => setTimeout(r, 1500));
    }
    
    console.log("All views loaded successfully.");
  } catch (e) {
    console.log("ERROR:", e);
  }

  await browser.close();
})();
