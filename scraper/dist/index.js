import express from "express";
import { main_eu, scrapeData } from "./models/functions.js";
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
app.get("/hi", (req, res) => {
    res.send("CIaone 🧑🏻‍💻");
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
main_eu();
/**
 * LISTEN AREA
 */
app.listen(port, () => {
    var emoji = String.fromCodePoint(0x1f9be);
    console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
    console.log("http://localhost:8000/");
});
//# sourceMappingURL=index.js.map