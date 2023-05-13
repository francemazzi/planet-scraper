import { saveProduct } from "../controller/product.js";
import { getProductByGenericName, getProducts, } from "../db/models/product_model.js";
export default (router) => {
    router.post("/save-product", saveProduct);
    router.get("/products", getProducts);
    router.post("/research", getProductByGenericName);
};
//# sourceMappingURL=product.js.map