import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      headless: false, // show gui
      slowMo: 250,
      devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test.each([
    ['maestro', '6772742259014549862'],
    ['visa', '4960147956718208'],
    ['mastercard', '5472146019720845'],
    ['amexp', '375117485929854'],
    ['jcb', '3562995574833351'],
    ['discover', '6011991981279367588'],
    ['diners', '36076941062307'],
    ['unionpay', '6259427708773239'],
    ['mir', '2200238127479053'],
  ])(('Test type: %s'), async (type, number) => {
    await page.goto(baseUrl);
    const input = await page.$('#number');
    await input.type(number);
    await page.waitForSelector(`.${type}-color`);
    await page.waitForSelector(`.${type}`);
  });

  // test('Test type: maestro', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('6772742259014549862');
  //   await page.waitForSelector('.maestro-color');
  //   await page.waitForSelector('.maestro');
  // });

  // test('Test type: visa', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('4960147956718208');
  //   await page.waitForSelector('.visa-color');
  //   await page.waitForSelector('.visa');
  // });

  // test('Test type: mastercard', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('5472146019720845');
  //   await page.waitForSelector('.mastercard-color');
  //   await page.waitForSelector('.mastercard');
  // });

  // test('Test type: amexp', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('375117485929854');
  //   await page.waitForSelector('.amexp-color');
  //   await page.waitForSelector('.amexp');
  // });

  // test('Test type: jcb', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('3562995574833351');
  //   await page.waitForSelector('.jcb-color');
  //   await page.waitForSelector('.jcb');
  // });

  // test('Test type: discover', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('6011991981279367588');
  //   await page.waitForSelector('.discover-color');
  //   await page.waitForSelector('.discover');
  // });

  // test('Test type: diners', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('36076941062307');
  //   await page.waitForSelector('.diners-color');
  //   await page.waitForSelector('.diners');
  // });

  // test('Test type: unionpay', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('6259427708773239');
  //   await page.waitForSelector('.unionpay-color');
  //   await page.waitForSelector('.unionpay');
  // });

  // test('Test type: mir', async () => {
  //   await page.goto(baseUrl);
  //   const input = await page.$('#number');
  //   await input.type('2200238127479053');
  //   await page.waitForSelector('.mir-color');
  //   await page.waitForSelector('.mir');
  // });
});
