import { ProductModel } from "../product_schema.js";
export const getProducts = () => ProductModel.find();
export const getProductbyId = (id) => ProductModel.findById({ id });
export const getProducByName = (name) => ProductModel.findOne({ name });
export const createProduct = (values) => new ProductModel(values).save().then((product) => product.toObject);
export const updateProductByName = (name, values) => ProductModel.findByIdAndUpdate(name, values);
export const getProductByGenericName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.sendStatus(400);
        }
        const regex = new RegExp(name, "i");
        const products = await ProductModel.find({
            name: { $regex: regex },
        });
        return res.status(200).json(products).end();
    }
    catch (error) {
        console.log("ERR research " + error);
    }
};
//# sourceMappingURL=product_model.js.map