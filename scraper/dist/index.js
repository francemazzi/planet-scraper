import express from "express";
import cors from "cors";
import { conad_promotions } from "./models/functions.js";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoose from "mongoose";
//MONGODB
const MONGO_URL = "mongodb+srv://francemazzi:Piadina.2023@cluster0.mkfe9qu.mongodb.net/?retryWrites=true&w=majority";
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error) => console.log("MONGOOSE ERR:" + error));
//PORT OF SERVER
const port = 8000;
const app = express();
//Autentication
app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
const server = http.createServer(app);
/**
 * LISTEN AREA
 */
app.listen(port, () => {
    var emoji = String.fromCodePoint(0x1f9be);
    console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
    console.log("http://localhost:8000/");
});
/**
 * ROUTING AREA
 */
app.get("/", (req, res) => {
    res.send("Vai su http://localhost:8000/data per vedere i dati");
});
function loadingMiddleware(req, res, next) {
    console.log("Dati in caricamento, attendi...");
    next();
}
app.get("/data", loadingMiddleware, async (req, res) => {
    try {
        const data = await conad_promotions();
        // const coop_promotion = await coop_promotion();
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//test puppeteer
const dataPromise = conad_promotions();
dataPromise.then((data) => {
    console.log(data);
});
//# sourceMappingURL=index.js.map