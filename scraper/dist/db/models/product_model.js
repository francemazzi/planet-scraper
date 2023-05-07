import { ProductModel } from "../product_schema.js";
export const getProducts = () => ProductModel.find();
export const getProductbyId = (id) => ProductModel.findById({ id });
export const getProducByName = (name) => ProductModel.findOne({ name });
export const createProduct = (values) => new ProductModel(values).save().then((product) => product.toObject);
export const updateProductByName = (name, values) => ProductModel.findByIdAndUpdate(name, values);
//# sourceMappingURL=product_model.js.map