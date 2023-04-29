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
import { main_eu, scrapeData } from "./models/functions.js";
import { url } from "../src/data/costant.js";

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

app.get("/hi", (req: Request, res: Response) => {
  res.send("CIaone 🧑🏻‍💻");
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
main_eu();

/**
 * LISTEN AREA
 */
app.listen(port, () => {
  var emoji = String.fromCodePoint(0x1f9be);
  console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
  console.log("http://localhost:8000/");
});
