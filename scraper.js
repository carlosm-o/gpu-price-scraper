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

        await page.waitForTimeout(4000);

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

        //bestbuy.com
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/');

        await page.waitForTimeout(4000);

        await page.type('input[id=gh-search-input]', searchValue);

        await page.waitForTimeout(1000);

        await page.click('button.header-search-button');

        await page.waitForTimeout(4000);

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

        browser.close();

        const combinedResults = { ...newEggResult, ...bestBuyResult };

        const newJSON = JSON.stringify(combinedResults);

        console.log(newJSON);
    } catch (err) {
        console.log(err);
    }
};

scrapeSite('3080');
