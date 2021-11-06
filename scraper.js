'use strict';

const puppeteer = require('puppeteer');

const scrapeSite = async (siteURL, searchValue) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(siteURL);

    await page.type('input[id=SrchInDesc_top]', searchValue);

    await page.click('.btn-alt');

    await page.waitForTimeout(10000);

    browser.close();
};

scrapeSite('https://www.newegg.com/Desktop-Graphics-Cards/SubCategory/ID-48?Tid=7709', 'gtx 3090');
