import fs from "fs";
import express, { Express, Request, Response, response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import getUrls from "get-urls";
import { url, url_conad_gustalla } from "../data/costant.js";
import puppeteer, { Browser } from "puppeteer";
import { ConadProduct } from "./types.js";

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
 * @description Function to scrape column from Eurostat
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

/**
 * @description CONAD test
 */
export const conad_promotions = async () => {
  let browser: Browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1280, height: 800 },
    });
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(60000);
    await page.goto(url_conad_gustalla);
    console.log("Pagina aperta 🔍");

    const divId = "#filter-meccanicaPromozione_string";
    const privacyPolicy = ".ot-sdk-row";
    const filtersProducts = ".rt071-flyer-filters__filters";
    const filterProductsSelected =
      "rt031-filter rt071-flyer-filters__filter.open";

    const filterWrapper = "rt150-disaggregated-flyer__filtersWrapper";
    const tableGridId =
      "rt150-disaggregated-flyer__wrapper rt150-disaggregated-flyer__wrapper--grid";

    await page.waitForSelector(privacyPolicy);
    await page.waitForSelector(divId);

    await page.waitForSelector("#onetrust-accept-btn-handler");
    await page.click("#onetrust-accept-btn-handler");
    await page.waitForSelector("#onetrust-group-container", { hidden: true });

    const [promozioniButton]: any = await page.$x(
      "//button[contains(., 'Promozioni') and contains(@class, 'rt031-filter__btn')]"
    );
    await promozioniButton.click();

    /**
     * CLick on filter and select filter TAGLIA PREZZO
     */
    const filterButtons = await page.$$(".rt031-filter__btn");
    for (const button of filterButtons) {
      const buttonText = await button.evaluate((el) => el.textContent.trim());
      if (buttonText === "Promozioni") {
        await button.click();
        break;
      }
    }
    await page.click('div[data-name="TAGLIO PREZZO"] input[type="checkbox"]');

    await page.click(
      'div[class="rt032-filter-popup open"] button[aria-label="Applica"]'
    );

    /**
     * Create an array of products loaded
     */
    await page.waitForSelector(
      ".rt150-disaggregated-flyer__wrapper.rt150-disaggregated-flyer__wrapper--grid"
    );

    const divTab = await page.$(
      ".rt150-disaggregated-flyer__wrapper.rt150-disaggregated-flyer__wrapper--grid"
    );
    let elements = await divTab.$$eval(
      ".rt213-card-product-flyer.rt072-disaggregated-block__card",
      (elements) => {
        return elements.map((element) => {
          const name =
            element.querySelector(".rt213-card-product-flyer__title")
              ?.textContent || "";
          const price =
            element.querySelector(".rt213-card-product-flyer__finalPrice")
              ?.textContent || "";
          const img =
            element
              .querySelector(".rt213-card-product-flyer__image")
              ?.getAttribute("src") || "";
          const unitCost =
            element.querySelector(".rt213-card-product-flyer__priceText")
              ?.textContent || "";
          const promotion =
            element.querySelector(".rt213-card-product-flyer__promotion")
              ?.textContent || 0;
          const validity =
            element.querySelector(".rt213-card-product-flyer__validity")
              ?.textContent || "";
          return { name, price, img, unitCost, promotion, validity };
        });
      }
    );

    let prevHeight = await page.evaluate("document.body.scrollHeight");
    while (true) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // aspetta 2 secondi per il caricamento dei nuovi elementi
      let newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === prevHeight) {
        break;
      }
      prevHeight = newHeight;
      const newElements = await divTab.$$eval(
        ".rt213-card-product-flyer.rt072-disaggregated-block__card",
        (elements) => {
          return elements.map((element) => {
            const name =
              element.querySelector(".rt213-card-product-flyer__title")
                ?.textContent || "";
            const price =
              element.querySelector(".rt213-card-product-flyer__finalPrice")
                ?.textContent || "";
            const img =
              element
                .querySelector(".rt213-card-product-flyer__image")
                ?.getAttribute("src") || "";
            const unitCost =
              element.querySelector(".rt213-card-product-flyer__priceText")
                ?.textContent || "";
            const promotion =
              element.querySelector(".rt213-card-product-flyer__promotion")
                ?.textContent || 0;
            const validity =
              element.querySelector(".rt213-card-product-flyer__validity")
                ?.textContent || "";
            return { name, price, img, unitCost, promotion, validity };
          });
        }
      );
      elements = elements.concat(newElements);
    }

    const elementsData: ConadProduct[] = await divTab.$$eval(
      ".rt213-card-product-flyer.rt072-disaggregated-block__card",
      (elements) => {
        return elements.map((element) => {
          const name =
            element
              .querySelector(".rt213-card-product-flyer__title")
              ?.textContent.trim() || "";
          const price =
            element
              .querySelector(".rt213-card-product-flyer__finalPrice")
              ?.textContent.trim() || "";
          const img =
            element
              .querySelector(".rt213-card-product-flyer__image")
              ?.getAttribute("src") || "";
          const unitCost =
            element
              .querySelector(".rt213-card-product-flyer__priceText")
              ?.textContent.trim() || "";

          const promotion =
            element
              .querySelector(".rt213-card-product-flyer__promotion")
              ?.textContent.trim() || 0;
          const validity =
            element
              .querySelector(".rt213-card-product-flyer__validity")
              ?.textContent.trim() || "";
          return { name, price, img, unitCost, promotion, validity };
        });
      }
    );
    await browser.close();
    console.log("FATTO!");
    return elementsData;

    /**
     * Reasearch fot html code
     */
    // const divTaglioPrezzo = await page.$(".rt032-filter-popup.open");

    // const text = await divTaglioPrezzo.evaluate((e) => e.innerHTML);

    // console.log("____________________");
    // console.log(text);
    // console.log("____________________");
  } catch (e) {
    console.log(`Error ${e}`);
  }
};
