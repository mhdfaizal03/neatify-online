const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure().errorText));

  try {
    await page.goto('https://neatify.site/');
    await new Promise(r => setTimeout(r, 2000));
    console.log("Storefront rendered OK.");
    
    await page.goto('https://neatify.site/admin');
    await new Promise(r => setTimeout(r, 2000));
    console.log("Admin rendered OK.");
  } catch (e) {
    console.log("NAVIGATION ERROR:", e);
  }

  await browser.close();
})();
