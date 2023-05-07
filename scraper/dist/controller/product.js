import { createProduct, getProducByName } from "../db/models/product_model.js";
import { conad_promotions } from "../models/functions.js";
export const saveProduct = async (req, res) => {
    try {
        const listOfproducts = await conad_promotions();
        const products = await Promise.all(listOfproducts.map(async (product) => {
            const { name = product.name, price = product.price, supermarket = "conad", img = product.img, unitCost = product.unitCost, promotion = product.promotion, validity = product.validity, } = req.body;
            if (!name || !price || !img || !unitCost || !promotion || !validity) {
                return null;
            }
            const existingProduct = await getProducByName(product.name);
            if (existingProduct && existingProduct.price == price) {
                return res.sendStatus(400);
            }
            const newProduct = await createProduct({
                name,
                price,
                supermarket,
                img,
                unitCost,
                promotion,
                validity,
            });
            return newProduct;
        }));
        const savedProducts = products.filter((product) => product !== null);
        return res.status(200).json(savedProducts).end();
    }
    catch (error) {
        console.log("ERR REQ" + req.body);
        console.log(error);
        return res.sendStatus(400);
    }
};
// const dataPromise: Promise<ConadProduct[]> = conad_promotions();
// dataPromise.then((data) => {
//   console.log(data);
// });
//# sourceMappingURL=product.js.map