const puppeteer = require("puppeteer");

function fetchCalendar(url, selector, type) {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [] = await page.$x(selector);

    await browser.close();
  });
}
