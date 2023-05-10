import express from "express";
import { getAllUsers } from "../controller/user.js";
import { isAuthenticated } from "../middlewares/index.js";

export default (router: express.Router) => {
  //   router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users", getAllUsers);
};
