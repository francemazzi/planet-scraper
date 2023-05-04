import express from "express";
import { conad_promotions } from "./models/functions.js";
// import puppeteer from "puppeteer-core";
// import { Browser } from "puppeteer";
//PORT OF SERVER
const port = 8000;
const app = express();
/**
 * ROUTING AREA
 */
app.get("/", (req, res) => {
    res.send("Vai su http://localhost:8000/data per vedere i dati");
});
function loadingMiddleware(req, res, next) {
    console.log("Dati in caricamento, attendi...");
    next();
}
app.get("/data", loadingMiddleware, async (req, res) => {
    try {
        const data = await conad_promotions();
        // const coop_promotion = await coop_promotion();
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
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