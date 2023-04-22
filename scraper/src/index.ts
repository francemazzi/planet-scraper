import fs from "fs";
import express, { Express, Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { title } from "process";

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

//TEST AREA for scraper
const url: string =
  "https://ec.europa.eu/eurostat/databrowser/view/tai08/default/table?lang=en";

axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $("table-header-text", html).each(function () {
      const titleTable = [];
      const titleOfData = $(this).text;
      titleTable.push({ titleOfData });
      console.log(titleTable);
    });
  })
  .catch((error) => {
    console.log("ERRORE " + error);
  });
