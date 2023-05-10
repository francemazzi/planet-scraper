import express from "express";
import authentication from "./authentication.js";
import product from "./product.js";
import user from "./user.js";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  product(router);
  user(router);
  return router;
};
