import fs from "fs";
import express, { Express, Request, Response, response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import getUrls from "get-urls";
import { url } from "../data/costant.js";
import puppeteer, { Browser } from "puppeteer";

/**
 * FIRST TEST WITH AXIOS
 */

//TEST AREA for scraper

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
export const scrapeData = (text) => {
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

async function getTextFromUrl(url: string): Promise<string[]> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const data: string[] = [];

    $(".infobox__title ux-u-color-primary").each((index, element) => {
      const text = $(element).text();
      console.log(element);
      data.push(text);
    });
    return data;
  } catch (error) {
    console.log("ERRORE " + error);
    return [];
  }
}

getTextFromUrl(url).then((data) => {
  console.log(`data ${data}`);
});

/**
 * SECOND TEST WITH brightdata
 */

export const main = async () => {
  let browser: Browser;

  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: "wss://",
    });
    //puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    await page.goto(url);
  } catch (e) {
    console.log(`Error ${e}`);
  } finally {
    await browser?.close();
  }
};

/**
 * THIRD TEST
 */

export const main_eu = async () => {
  let browser: Browser;

  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
    });

    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(60000);
    await page.goto(url);
    console.log("Pagina aperta 🔍");

    const classNameData: string =
      ".colHeader.header-overflow.table-header-container";

    const classOfSpan: string = ".table-header-text";
    const classOfDiv: string = ".ag-pinned-left-cols-container";

    await page.waitForSelector(classNameData);

    const table_data = await page.evaluate(
      (classOfDiv: string, classOfSpan: string) => {
        const container = document.querySelector(classOfDiv);

        const geo_title = Array.from(
          container.querySelectorAll(`span${classOfSpan}`)
        );
        const data = geo_title.map((elem) => elem.textContent.trim());
        return data;
      },
      classOfDiv,
      classOfSpan
    );

    console.log("table_data", table_data);
  } catch (e) {
    console.log(`Error ${e}`);
  } finally {
    await browser.close();
  }
};
