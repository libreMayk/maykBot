const puppeteer = require("puppeteer");

async function scrapeWeb(url, selector, propertyType) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x(selector);
  const src = await el.getProperty(propertyType);
  const srcText = await src.jsonValue();

  await browser.close();
  return srcText;
}

module.exports = scrapeWeb;
