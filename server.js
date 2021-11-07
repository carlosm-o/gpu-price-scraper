const express = require('express');
const app = express();
const port = 3000;

const scraper = require('./scraper');

app.get('/pricing/:searchValue', async (req, res) => {
    const searchValue = req.params.searchValue;
    const pricing = await scraper.scrapeSite(searchValue);
    res.send(pricing);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
