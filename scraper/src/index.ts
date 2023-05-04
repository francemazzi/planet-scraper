import fs from "fs";
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  response,
} from "express";
import axios from "axios";
import cheerio from "cheerio";
import { title } from "process";
import getUrls from "get-urls";
import { test } from "node:test";
import { text } from "stream/consumers";
import { request } from "http";
import cors from "cors";
import puppeteer, { Browser } from "puppeteer";
import { main_eu, scrapeData } from "./models/functions.js";
import { url } from "./data/costant.js";
import { ConadProduct } from "./models/types.js";
import { conad_promotions } from "./models/functions.js";

// import puppeteer from "puppeteer-core";
// import { Browser } from "puppeteer";

//PORT OF SERVER
const port = 8000;

const app: Express = express();

/**
 * ROUTING AREA
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Vai su http://localhost:8000/data per vedere i dati");
});

function loadingMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("Dati in caricamento, attendi...");
  next();
}

app.get("/data", loadingMiddleware, async (req: Request, res: Response) => {
  try {
    const data = await conad_promotions();
    // const coop_promotion = await coop_promotion();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//test puppeteer
const dataPromise: Promise<ConadProduct[]> = conad_promotions();
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
