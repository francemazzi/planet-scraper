import express from "express";
import authentication from "./authentication.js";
import product from "./product.js";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  product(router);
  return router;
};
