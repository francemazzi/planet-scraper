import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    img: { type: String, required: true },
    unitCost: { type: String, required: false },
    promotion: { type: String, required: false },
    validity: { type: String, required: false },
});
export const ProductModel = mongoose.model("Product", ProductSchema);
//# sourceMappingURL=product_schema.js.map