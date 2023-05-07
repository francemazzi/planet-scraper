import express from "express";
import { createProduct, getProductbyId } from "../db/models/product_model.js";
import { conad_promotions } from "../models/functions.js";
import { ConadProduct } from "../models/types.js";

export const saveProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const listOfproducts: ConadProduct[] = await conad_promotions();
    const products = await Promise.all(
      listOfproducts.map(async (product) => {
        const {
          name = product.name,
          price = product.price,
          img = product.img,
          unitCost = product.unitCost,
          promotion = product.promotion,
          validity = product.validity,
        } = req.body;

        if (!name || !price || !img || !unitCost || !promotion || !validity) {
          return null;
        }
        console.log("DATA 1" + req.body);
        const newProduct = await createProduct({
          name,
          price,
          img,
          unitCost,
          promotion,
          validity,
        });

        return newProduct;
      })
    );

    const savedProducts = products.filter((product) => product !== null);

    return res.status(200).json(savedProducts).end();
  } catch (error) {
    console.log("ERR REQ" + req.body);
    console.log(error);
    return res.sendStatus(400);
  }
};

// const dataPromise: Promise<ConadProduct[]> = conad_promotions();
// dataPromise.then((data) => {
//   console.log(data);
// });
