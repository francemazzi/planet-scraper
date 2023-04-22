import express from "express";
const port = 8000;
const app = express();
app.get("/", (req, res) => {
    res.send("TEST 4 🧑🏻‍💻");
});
app.get("/hi", (req, res) => {
    res.send("CIaone 🧑🏻‍💻");
});
var emoji = String.fromCodePoint(0x1f9be);
app.listen(port, () => {
    console.log(`${emoji} IN ASCOLTO ALLA PORTA ${port}`);
    console.log("http://localhost:8000/");
});
//# sourceMappingURL=index.js.map