import express from "express";
import { saveProduct } from "../controller/product.js";
import { getProducts } from "../db/models/product_model.js";

export default (router: express.Router) => {
  router.post("/save-product", saveProduct);
  router.get("/products", getProducts);
  //   router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
  //   router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
};
