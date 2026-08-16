const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('console', msg => { if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text()); });

  try {
    console.log("Navigating to storefront...");
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2500));

    // Screenshot 1: Storefront home
    await page.screenshot({ path: path.join(__dirname, 'ss_home.png') });
    console.log("Saved ss_home.png");

    // Open auth modal
    await page.click('#accountBtn');
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(__dirname, 'ss_auth_modal.png') });
    console.log("Saved ss_auth_modal.png");

    // Switch to register tab
    await page.click('#authTabRegister');
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(__dirname, 'ss_auth_register.png') });
    console.log("Saved ss_auth_register.png");

  } catch (e) {
    console.error("Screenshot error:", e.message);
  }

  await browser.close();
  console.log("Done.");
})();
