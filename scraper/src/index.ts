import fs from "fs";
import express, { Express, Request, Response, response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { title } from "process";
import getUrls from "get-urls";
import { test } from "node:test";
import { text } from "stream/consumers";
import { request } from "http";
import cors from "cors";
import puppeteer, { Browser } from "puppeteer";
import { conad_promotions, main_eu, scrapeData } from "./models/functions.js";
import { url } from "../src/data/costant.js";
import { ConadProduct } from "./models/types.js";

// import puppeteer from "puppeteer-core";
// import { Browser } from "puppeteer";

//PORT OF SERVER
const port = 8000;

const app: Express = express();

/**
 * ROUTING AREA
 */
app.get("/", (req: Request, res: Response) => {
  res.send("TEST 4 🧑🏻‍💻");
});

//TODO: optimize functions for scraping data
//TODO: install react + tailwind to show data in a better way
//TODO: optimize conad_promotions() with axios + cheerio

app.get("/data", async (req: Request, res: Response) => {
  try {
    const body = JSON.parse(req.body);

    const dataPromise: Promise<ConadProduct[]> = conad_promotions();
    res.send("Dati aperti attendi... 🧑🏻‍💻");
    const data = await dataPromise;

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//TEST FIRST SCAPER
app.get("/test", async (req: Request, res: Response) => {
  const body = JSON.parse(req.body);
  const data = await scrapeData(body.text);
  res.send("DATI - body 🧑🏻‍💻");
  res.send(body);
  res.send("DATI - data 🧑🏻‍💻");
  res.send(data);
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
