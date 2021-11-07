'use strict';

const puppeteer = require('puppeteer');

const scrapeSite = async (searchValue) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-gpu'],
        });
        const page = await browser.newPage();

        // newegg.com;
        await page.goto('https://www.newegg.com/Desktop-Graphics-Cards/SubCategory/ID-48?Tid=7709');

        await page.waitForTimeout(4000);

        await page.type('input[id=SrchInDesc_top]', searchValue);

        await page.click('.btn-alt');

        await page.waitForTimeout(2000);

        const newEggResult = await page.$$eval('.item-cell > div', (items) =>
            items.map((item) => {
                return {
                    store: 'newegg',
                    name: item.querySelector('div.item-cell > div > div.item-info > a').innerText,
                    url: item.querySelector('div.item-cell > div > div.item-info > a').href,
                    price: item.querySelector('div.item-cell > div > div.item-action > ul > li.price-current > strong')
                        .innerText,
                };
            })
        );

        // //bestbuy.com

        await page.goto('https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/');

        await page.waitForTimeout(2000);

        await page.type('input[id=gh-search-input]', searchValue);

        await page.waitForTimeout(1000);

        await page.click('button.header-search-button');

        await page.waitForTimeout(2000);

        await page.waitForSelector('li.sku-item');

        const bestBuyResult = await page.$$eval('li.sku-item', (items) =>
            items.map((item) => {
                return {
                    store: 'Best Buy',
                    name: item.querySelector(
                        'li.sku-item > div > div > div > div > div > div.right-column > div.information > div:nth-child(2) > div > h4 > a'
                    ).innerText,
                    url: item.querySelector(
                        'li.sku-item > div > div > div > div > div > div.right-column > div.information > div:nth-child(2) > div > h4 > a'
                    ).href,
                    price: item.querySelector(
                        'li.sku-item > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div > span:nth-child(1)'
                    ).innerText,
                };
            })
        );

        // amazon
        await page.goto('https://www.amazon.com/ref=nav_logo');

        await page.waitForTimeout(2000);

        await page.type('input[id=twotabsearchtextbox]', searchValue);

        await page.waitForTimeout(1000);

        await page.click('input#nav-search-submit-button');

        await page.waitForTimeout(2000);

        const amazonResult = await page.$$eval('div[data-component-type="s-search-result"]', (items) =>
            items.map((item) => {
                return {
                    store: 'Amazon',
                    name: item.querySelector('h2 > a > span').innerText,
                    url: item.querySelector('h2 > a > span').parentElement.href,
                };
            })
        );

        await page.close();
        await browser.close();

        const combinedResults = Object.assign(newEggResult, bestBuyResult, amazonResult);

        const newJSON = JSON.stringify(combinedResults);

        return newJSON;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    scrapeSite,
};
