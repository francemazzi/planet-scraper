import express from "express";
import { conad_promotions, scrapeData } from "./models/functions.js";
// import puppeteer from "puppeteer-core";
// import { Browser } from "puppeteer";
//PORT OF SERVER
const port = 8000;
const app = express();
/**
 * ROUTING AREA
 */
app.get("/", (req, res) => {
    res.send("TEST 4 🧑🏻‍💻");
});
//TODO: optimize functions for scraping data
//TODO: install react + tailwind to show data in a better way
//TODO: optimize conad_promotions() with axios + cheerio
app.get("/data", async (req, res) => {
    try {
        const body = JSON.parse(req.body);
        const dataPromise = conad_promotions();
        res.send("Dati aperti attendi... 🧑🏻‍💻");
        const data = await dataPromise;
        res.status(200).json({ data: data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//TEST FIRST SCAPER
app.get("/test", async (req, res) => {
    const body = JSON.parse(req.body);
    const data = await scrapeData(body.text);
    res.send("DATI - body 🧑🏻‍💻");
    res.send(body);
    res.send("DATI - data 🧑🏻‍💻");
    res.send(data);
});
//test puppeteer
const dataPromise = conad_promotions();
dataPromise.then((data) => {
    console.log(data);
});
/**
 * LISTEN AREA
 */
app.listen(port, () => {
    var emoji = String.fromCodePoint(0x1f9be);
    console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
    console.log("http://localhost:8000/");
});
//# sourceMappingURL=index.js.map