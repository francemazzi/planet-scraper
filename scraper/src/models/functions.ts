import fs from "fs";
import express, { Express, Request, Response, response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import getUrls from "get-urls";
import { url, url_conad_gustalla, url_coop_emilia } from "../data/costant.js";
import puppeteer, { Browser } from "puppeteer";
import { ConadProduct } from "./types.js";

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
    console.log("Browser aperto 🔍");
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
    console.log("Dati scaricati correttamente!");
    return elementsData;
  } catch (e) {
    console.log(`Error ${e}`);
  }
};

export const coop_promotions = async () => {
  let browser: Browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
    });
    const page = await browser.newPage();
    console.log("Browser aperto ");
    await page.setDefaultNavigationTimeout(60000);
    await page.goto(url_coop_emilia);
    console.log("Pagina aperta coop 🔍");

    // await page.waitForSelector(".iubenda-cs-rationale");
    const popup = await page.$(".iubenda-cs-rationale");
    if (popup) {
      await page.waitForSelector(
        ".iubenda-cs-accept-btn.iubenda-cs-btn-primary"
      );
      await page.click(".iubenda-cs-accept-btn.iubenda-cs-btn-primary");
    }

    await page.waitForSelector(".product-grid");
    const gridElement = await page.$(".product-grid");
    await page.waitForSelector(".product-grid__item");
    await page.waitForSelector(".product-tile");

    const elementsData: ConadProduct[] = await gridElement.$$eval(
      ".product-tile",

      (elements) =>
        Promise.all(
          elements.map(async (item) => {
            const nameElement = item.querySelector(
              ".product-title .product-title__name"
            );
            const name = nameElement ? nameElement.textContent.trim() : "";

            const price =
              item.querySelector(".price__final")?.textContent || "";
            const img =
              item.querySelector(".product-tile__image")?.getAttribute("src") ||
              "";
            const unitCostElement = item.querySelector(
              "span.product-tile__price-per-qty"
            );
            const unitCost = unitCostElement
              ? unitCostElement.textContent.trim()
              : "";

            const promotion =
              item.querySelector(".price__discount")?.textContent || "";
            const validity =
              item.querySelector(".price__discount-end-date")?.textContent ||
              "";

            return { name, price, img, unitCost, promotion, validity };
          })
        )
    );

    console.log(elementsData);

    //TODO: click on the button for change page

    // const productsGrid
    /**
     * Reasearch fot html code
     */
    // await page.waitForSelector(".product-grid__item");
    // const element = await page.$(".product-grid__item");

    // const text = await element.evaluate((e) => e.innerHTML);

    // console.log("____________________");
    // console.log(text);
    // console.log("____________________");
  } catch (error) {
    console.log("COOP ERROR" + error);
  }
};

// export const coop_promotions = async () => {
//   let browser: Browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: false,
//       defaultViewport: { width: 1280, height: 800 },
//     });
//     const page = await browser.newPage();
//     console.log("Browser aperto ");
//     await page.setDefaultNavigationTimeout(60000);
//     await page.goto(url_coop_emilia);
//     console.log("Pagina aperta coop 🔍");

//     await page.waitForSelector(".iubenda-cs-rationale");
//     const popup = await page.$(".iubenda-cs-rationale");
//     if (popup) {
//       await page.waitForSelector(
//         ".iubenda-cs-accept-btn.iubenda-cs-btn-primary"
//       );
//       await page.click(".iubenda-cs-accept-btn.iubenda-cs-btn-primary");
//     }

//     const products: ConadProduct[] = [];

//     await page.waitForSelector(".product-grid");
//     const gridElement = await page.$(".product-grid");
//     await page.waitForSelector(".product-grid__item");
//     await page.waitForSelector(".product-tile");

//     const elementsData: ConadProduct[] = await gridElement.$$eval(
//       ".product-tile",
//       (elements) =>
//         Promise.all(
//           elements.map(async (item) => {
//             const nameElement = item.querySelector(
//               ".product-title .product-title__name"
//             );
//             const name = nameElement ? nameElement.textContent.trim() : "";

//             const price =
//               item.querySelector(".price__final")?.textContent || "";
//             const img =
//               item.querySelector(".product-tile__image")?.getAttribute("src") ||
//               "";
//             const unitCostElement = item.querySelector(
//               "span.product-tile__price-per-qty"
//             );
//             const unitCost = unitCostElement
//               ? unitCostElement.textContent.trim()
//               : "";

//             const promotion =
//               item.querySelector(".price__discount")?.textContent || "";
//             const validity =
//               item.querySelector(".price__discount-end-date")?.textContent ||
//               "";

//             return { name, price, img, unitCost, promotion, validity };
//           })
//         )
//     );

//     elementsData.map((data) => products.push(data));

//     let nextLink = await page.$(
//       "li.pagination__item.pagination__item--icon.pagination__item--next > a"
//     );

//     while (nextLink) {
//       const elementsData: ConadProduct[] = await gridElement.$$eval(
//         ".product-tile",
//         (elements) =>
//           Promise.all(
//             elements.map(async (item) => {
//               const nameElement = item.querySelector(
//                 ".product-title .product-title__name"
//               );
//               const name = nameElement ? nameElement.textContent.trim() : "";

//               const price =
//                 item.querySelector(".price__final")?.textContent || "";
//               const img =
//                 item
//                   .querySelector(".product-tile__image")
//                   ?.getAttribute("src") || "";
//               const unitCostElement = item.querySelector(
//                 "span.product-tile__price-per-qty"
//               );
//               const unitCost = unitCostElement
//                 ? unitCostElement.textContent.trim()
//                 : "";

//               const promotion =
//                 item.querySelector(".price__discount")?.textContent || "";
//               const validity =
//                 item.querySelector(".price__discount-end-date")?.textContent ||
//                 "";

//               return { name, price, img, unitCost, promotion, validity };
//             })
//           )
//       );

//       elementsData.map((data) => products.push(data));

//       const nextLink = await page.$(
//         "li.pagination__item.pagination__item--icon.pagination__item--next > a"
//       );

//       if (!nextLink) {
//         break; // Esci dal ciclo se non c'è più il link "nextLink"
//       }

//       await nextLink.click();
//       await page.waitForNavigation();
//       await page.waitForSelector(".product-grid"); // Aspetta che la nuova pagina si carichi completamente
//       await page.waitForSelector(".product-grid__item");
//       await page.waitForSelector(".product-tile");
//     }

//     if (!nextLink) {
//       await page.waitForSelector(".product-grid");
//       const gridElement = await page.$(".product-grid");
//       await page.waitForSelector(".product-grid__item");
//       await page.waitForSelector(".product-tile");
//       const elementsData: ConadProduct[] = await gridElement.$$eval(
//         ".product-tile",
//         (elements) =>
//           Promise.all(
//             elements.map(async (item) => {
//               const nameElement = item.querySelector(
//                 ".product-title .product-title__name"
//               );
//               const name = nameElement ? nameElement.textContent.trim() : "";

//               const price =
//                 item.querySelector(".price__final")?.textContent || "";
//               const img =
//                 item
//                   .querySelector(".product-tile__image")
//                   ?.getAttribute("src") || "";
//               const unitCostElement = item.querySelector(
//                 "span.product-tile__price-per-qty"
//               );
//               const unitCost = unitCostElement
//                 ? unitCostElement.textContent.trim()
//                 : "";

//               const promotion =
//                 item.querySelector(".price__discount")?.textContent || "";
//               const validity =
//                 item.querySelector(".price__discount-end-date")?.textContent ||
//                 "";

//               return { name, price, img, unitCost, promotion, validity };
//             })
//           )
//       );
//       return elementsData.map((data) => products.push(data));
//     }

//     console.log("products" + products);

//     //TODO: click on the button for change page

//     // const productsGrid
//     /**
//      * Reasearch fot html code
//      */
//     // await page.waitForSelector(".product-grid__item");
//     // const element = await page.$(".product-grid__item");

//     // const text = await element.evaluate((e) => e.innerHTML);

//     // console.log("____________________");
//     // console.log(text);
//     // console.log("____________________");
//   } catch (error) {
//     console.log("COOP ERROR" + error);
//   }
// };
