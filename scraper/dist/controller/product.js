import { createProduct, getProducByName } from "../db/models/product_model.js";
import { conad_promotions, coop_promotions } from "../models/functions.js";
//TODO: optimize this function
const now = Date.now();
const date = new Date(now);
const day = date.getDate().toString().padStart(2, "0");
const month = (date.getMonth() + 1).toString().padStart(2, "0");
const year = date.getFullYear().toString();
const formattedDate = `${day}:${month}:${year}`;
export const saveProduct = async (req, res) => {
    try {
        const listOfCoopPromotionproducts = await coop_promotions();
        const listOfConadPromotionproducts = await conad_promotions();
        const coopProducts = await Promise.all(listOfCoopPromotionproducts.map(async (product) => {
            const { name = product.name, price = product.price, supermarket = "coop", img = product.img, unitCost = product.unitCost, promotion = product.promotion, validity = product.validity, update = formattedDate, } = req.body;
            if (!name || !price || !img || !unitCost || !promotion || !validity) {
                return null;
            }
            const existingProduct = await getProducByName(product.name);
            if (existingProduct && existingProduct.price == price) {
                return;
            }
            const newProduct = await createProduct({
                name,
                price,
                supermarket,
                img,
                unitCost,
                promotion,
                validity,
                update,
            });
            return newProduct;
        }));
        const conadProducts = await Promise.all(listOfConadPromotionproducts.map(async (product) => {
            const { name = product.name, price = product.price, supermarket = "conad", img = product.img, unitCost = product.unitCost, promotion = product.promotion, validity = product.validity, update = formattedDate, } = req.body;
            if (!name || !price || !img || !unitCost || !promotion || !validity) {
                return null;
            }
            const existingProduct = await getProducByName(product.name);
            if (existingProduct && existingProduct.price == price) {
                return;
            }
            const newProduct = await createProduct({
                name,
                price,
                supermarket,
                img,
                unitCost,
                promotion,
                validity,
                update,
            });
            return newProduct;
        }));
        const savedCoopProducts = coopProducts.filter((product) => product !== null);
        const savedProducts = conadProducts.filter((product) => product !== null);
        return res
            .status(200)
            .json({ coop: savedCoopProducts, conad: savedProducts })
            .end();
    }
    catch (error) {
        console.log("ERR REQ" + req.body);
        console.log("ERR " + error);
        return res.sendStatus(400);
    }
};
//# sourceMappingURL=product.js.map