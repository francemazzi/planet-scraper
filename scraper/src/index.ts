import express, {
  Express,
  NextFunction,
  Request,
  Response,
  response,
} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoose from "mongoose";
import http from "http";
import router from "./router/index.js";
import { conad_promotions } from "./models/functions.js";
import { ConadProduct } from "./models/types.js";

//MONGODB - francemazzi -
const MONGO_URL =
  "mongodb+srv://francemazzi:8ubrtNcMUUPuTqQy@cluster0.scfwyi8.mongodb.net/?retryWrites=true&w=majority";

//PORT OF SERVER
const port = 8080;

const app = express();

//Autentication
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());

/** Rules of our API */
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

const server = http.createServer(app);

/**
 * LISTEN AREA
 */
server.listen(port, () => {
  var emoji = String.fromCodePoint(0x1f9be);
  console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
  console.log("http://localhost:8080/");
});

mongoose.Promise = Promise;
mongoose
  .connect(MONGO_URL, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("MONGO CONNECTED");
  })
  .catch((e) => {
    console.log("MONGO ERROR DURING CONNECTION" + e);
  });
mongoose.connection.on("error", (error: Error) =>
  console.log("MONGOOSE ERR:" + error)
);

/**
 * ROUTING AREA - NEW
 */
app.use("/", router());
