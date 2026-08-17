const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'scratch/admin_screenshot.png' });
  console.log('Screenshot saved to scratch/admin_screenshot.png');
  
  await browser.close();
})();
