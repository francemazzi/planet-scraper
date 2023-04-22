import fs from "fs";
import express, { Express, Request, Response } from "express";

const port = 8000;

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("TEST 4 🧑🏻‍💻");
});

app.get("/hi", (req: Request, res: Response) => {
  res.send("CIaone 🧑🏻‍💻");
});

var emoji = String.fromCodePoint(0x1f9be);
app.listen(port, () => {
  console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
  console.log("http://localhost:8000/");
});
