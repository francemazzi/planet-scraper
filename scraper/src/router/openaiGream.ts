import express from "express";
import { openaiBot } from "../controller/open-ai.js";

export default (router: express.Router) => {
  router.post("/gream-ai", openaiBot);
};
