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

//TEST AREA for scraper
const url: string =
  "https://ec.europa.eu/eurostat/databrowser/view/tai08/default/table?lang=en";

axios(url)
  .then(async (response) => {
    const html = await response.data;
    const $ = cheerio.load(html);
    const data = [];

    $(".infobox__title", html).each((index, element) => {
      const titleOfData = $(element).text();
      console.log(titleOfData);
      data.push({ titleOfData });
    });
    console.log(data);
  })
  .catch((error) => {
    console.log("ERRORE " + error);
  });

//TEST DATA FIRESTORE
const scrapeData = (text) => {
  const urls = Array.from(getUrls(text));
  const request = urls.map(async (url) => {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const getMetatag = (name) =>
      $(`meta[name${name}]`).attr("content") ||
      $(`meta[property="og:${name}"]`).attr("content") ||
      $(`meta[property="twitter:${name}"]`).attr("content");

    return {
      url,
      title: $("title").text(),
      favicon: $('link[rel="shortcut icon"]').attr("href"),
      // description: $("meta[name=description]").attr("content"),

      description: getMetatag("description"),
      image: getMetatag("image"),
      author: getMetatag("author"),
    };
  });

  return Promise.all(request);
};

//test puppeteer
const urlTestLogin: string =
  "https://www.linkedin.com/login/it?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin";
const main = async () => {
  const browser: Browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(url);

  await browser.close();
};

main();
// app.get("/test", async (req: Request, res: Response) => {
//   const body = JSON.parse(req.body);
//   const data = await scrapeData(body.text);
//   res.send("DATI - body 🧑🏻‍💻");
//   res.send(body);
//   res.send("DATI - data 🧑🏻‍💻");
//   res.send(data);
// });

// async function getTextFromUrl(url: string): Promise<string[]> {
//   try {
//     const response = await axios.get(url);
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const data: string[] = [];

//     $(".infobox__title ux-u-color-primary").each((index, element) => {
//       const text = $(element).text();
//       console.log(element);
//       data.push(text);
//     });
//     return data;
//   } catch (error) {
//     console.log("ERRORE " + error);
//     return [];
//   }
// }

// getTextFromUrl(url).then((data) => {
//   console.log(`data ${data}`);
// });

/**
 * LISTEN AREA
 */
app.listen(port, () => {
  var emoji = String.fromCodePoint(0x1f9be);
  console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
  console.log("http://localhost:8000/");
});
