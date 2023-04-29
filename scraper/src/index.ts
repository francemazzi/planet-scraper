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

/**
 * LISTEN AREA
 */
app.listen(port, () => {
  var emoji = String.fromCodePoint(0x1f9be);
  console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
  console.log("http://localhost:8000/");
});
