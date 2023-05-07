import express from "express";
import { register } from "../controller/authentication.js";
import { saveProduct } from "../controller/product.js";

export default (router: express.Router) => {
  router.post("/auth/register", register);
};
