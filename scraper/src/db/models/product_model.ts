import { ProductModel } from "../product_schema.js";

export const getProducts = () => ProductModel.find();

export const getProductbyId = (id: string) => ProductModel.findById({ id });

export const getUserByName = (name: string) => ProductModel.findOne({ name });

export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values).save().then((product) => product.toObject);

export const updateProductById = (id: string, values: Record<string, any>) =>
  ProductModel.findByIdAndUpdate(id, values);
