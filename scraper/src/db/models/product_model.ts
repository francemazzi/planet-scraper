import { Product } from "puppeteer";
import { ProductModel } from "../product_schema.js";
import express from "express";

export const getProducts = () => ProductModel.find();

export const getProductbyId = (id: string) => ProductModel.findById({ id });

export const getProducByName = (name: string) => ProductModel.findOne({ name });

export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values).save().then((product) => product.toObject);

export const updateProductByName = (
  name: string,
  values: Record<string, any>
) => ProductModel.findByIdAndUpdate(name, values);

export const getProductByGenericName = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.sendStatus(400);
    }

    const regex = new RegExp(name, "i");

    const products: Product[] = await ProductModel.find({
      name: { $regex: regex },
    });

    return res.status(200).json(products).end();
  } catch (error) {
    console.log("ERR research " + error);
  }
};
