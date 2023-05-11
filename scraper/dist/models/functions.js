import { url_conad_gustalla, url_coop_emilia } from "../data/costant.js";
import puppeteer from "puppeteer";
/**
 * @description CONAD test
 */
export const conad_promotions = async () => {
    let browser;
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
        const filterProductsSelected = "rt031-filter rt071-flyer-filters__filter.open";
        const filterWrapper = "rt150-disaggregated-flyer__filtersWrapper";
        const tableGridId = "rt150-disaggregated-flyer__wrapper rt150-disaggregated-flyer__wrapper--grid";
        await page.waitForSelector(privacyPolicy);
        await page.waitForSelector(divId);
        await page.waitForSelector("#onetrust-accept-btn-handler");
        await page.click("#onetrust-accept-btn-handler");
        await page.waitForSelector("#onetrust-group-container", { hidden: true });
        const [promozioniButton] = await page.$x("//button[contains(., 'Promozioni') and contains(@class, 'rt031-filter__btn')]");
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
        await page.click('div[class="rt032-filter-popup open"] button[aria-label="Applica"]');
        /**
         * Create an array of products loaded
         */
        await page.waitForSelector(".rt150-disaggregated-flyer__wrapper.rt150-disaggregated-flyer__wrapper--grid");
        const divTab = await page.$(".rt150-disaggregated-flyer__wrapper.rt150-disaggregated-flyer__wrapper--grid");
        let elements = await divTab.$$eval(".rt213-card-product-flyer.rt072-disaggregated-block__card", (elements) => {
            return elements.map((element) => {
                const name = element.querySelector(".rt213-card-product-flyer__title")
                    ?.textContent || "";
                const price = element.querySelector(".rt213-card-product-flyer__finalPrice")
                    ?.textContent || "";
                const img = element
                    .querySelector(".rt213-card-product-flyer__image")
                    ?.getAttribute("src") || "";
                const unitCost = element.querySelector(".rt213-card-product-flyer__priceText")
                    ?.textContent || "";
                const promotion = element.querySelector(".rt213-card-product-flyer__promotion")
                    ?.textContent || 0;
                const validity = element.querySelector(".rt213-card-product-flyer__validity")
                    ?.textContent || "";
                return { name, price, img, unitCost, promotion, validity };
            });
        });
        let prevHeight = await page.evaluate("document.body.scrollHeight");
        while (true) {
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
            await new Promise((resolve) => setTimeout(resolve, 2000)); // aspetta 2 secondi per il caricamento dei nuovi elementi
            let newHeight = await page.evaluate("document.body.scrollHeight");
            if (newHeight === prevHeight) {
                break;
            }
            prevHeight = newHeight;
            const newElements = await divTab.$$eval(".rt213-card-product-flyer.rt072-disaggregated-block__card", (elements) => {
                return elements.map((element) => {
                    const name = element.querySelector(".rt213-card-product-flyer__title")
                        ?.textContent || "";
                    const price = element.querySelector(".rt213-card-product-flyer__finalPrice")
                        ?.textContent || "";
                    const img = element
                        .querySelector(".rt213-card-product-flyer__image")
                        ?.getAttribute("src") || "";
                    const unitCost = element.querySelector(".rt213-card-product-flyer__priceText")
                        ?.textContent || "";
                    const promotion = element.querySelector(".rt213-card-product-flyer__promotion")
                        ?.textContent || 0;
                    const validity = element.querySelector(".rt213-card-product-flyer__validity")
                        ?.textContent || "";
                    return { name, price, img, unitCost, promotion, validity };
                });
            });
            elements = elements.concat(newElements);
        }
        const elementsData = await divTab.$$eval(".rt213-card-product-flyer.rt072-disaggregated-block__card", (elements) => {
            return elements.map((element) => {
                const name = element
                    .querySelector(".rt213-card-product-flyer__title")
                    ?.textContent.trim() || "";
                const price = element
                    .querySelector(".rt213-card-product-flyer__finalPrice")
                    ?.textContent.trim() || "";
                const img = element
                    .querySelector(".rt213-card-product-flyer__image")
                    ?.getAttribute("src") || "";
                const unitCost = element
                    .querySelector(".rt213-card-product-flyer__priceText")
                    ?.textContent.trim() || "";
                const promotion = element
                    .querySelector(".rt213-card-product-flyer__promotion")
                    ?.textContent.trim() || 0;
                const validity = element
                    .querySelector(".rt213-card-product-flyer__validity")
                    ?.textContent.trim() || "";
                return { name, price, img, unitCost, promotion, validity };
            });
        });
        await browser.close();
        console.log("Dati scaricati correttamente!");
        return elementsData;
    }
    catch (e) {
        console.log(`Error ${e}`);
    }
};
export const coop_promotions = async () => {
    let browser;
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
            await page.waitForSelector(".iubenda-cs-accept-btn.iubenda-cs-btn-primary");
            await page.click(".iubenda-cs-accept-btn.iubenda-cs-btn-primary");
        }
        await page.waitForSelector(".product-grid");
        await page.waitForSelector(".product-grid__item");
        await page.waitForSelector(".product-tile");
        const products = [];
        let hasNextPage = true;
        while (hasNextPage) {
            await page.waitForSelector(".product-grid");
            await page.waitForSelector(".product-grid__item");
            await page.waitForSelector(".product-tile");
            await page.waitForSelector(".product-title .product-title__name");
            const gridElement = await page.$(".product-grid");
            const elementsData = await gridElement.$$eval(".product-tile", (elements) => elements.map((item) => {
                const nameElement = item.querySelector(".product-title .product-title__name");
                const name = nameElement ? nameElement.textContent.trim() : "";
                console.log("name" + name);
                const price = item.querySelector(".price__final")?.textContent || "";
                const img = item.querySelector(".product-tile__image")?.getAttribute("src") ||
                    "";
                const unitCostElement = item.querySelector("span.product-tile__price-per-qty");
                const unitCost = unitCostElement
                    ? unitCostElement.textContent.trim()
                    : "";
                console.log("unitCost" + unitCost);
                const promotion = item.querySelector(".price__discount")?.textContent || "";
                const validity = item.querySelector(".price__discount-end-date")?.textContent ||
                    "";
                return { name, price, img, unitCost, promotion, validity };
            }));
            // products.push(...elementsData);
            elementsData.map((product) => products.push(product));
            // products.concat(elementsData);
            const nextLink = await page.$("li.pagination__item.pagination__item--icon.pagination__item--next > a");
            if (!nextLink) {
                hasNextPage = false;
            }
            else {
                await nextLink.click();
                // await page.waitForNavigation();
            }
        }
        await browser.close();
        console.log("Dati scaricati correttamente!");
        return products;
    }
    catch (error) {
        console.log("COOP ERROR" + error);
    }
};
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
//# sourceMappingURL=functions.js.map