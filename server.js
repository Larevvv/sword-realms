const express = require("express");
const compression = require("compression");
const app = express();
const server = express();
const path = require("path");
const nodemon = require("nodemon");
const result = require("dotenv").config({
    path: path.resolve(
        __dirname,
        `.env${process.env.NODE_ENV ? "." + process.env.NODE_ENV : ""}`.trim(),
    ),
    quiet: true,
});

if (result.error) {
    throw result.error;
}

const baseUrl = process.env.BASE_URL;
const distUrl = "dist";

server.use(baseUrl, app);

app.use(compression());
app.use("/public", express.static(distUrl + "/public", { fallthrough: false }));

const port = process.env.PORT || 3000;

// Emulating github pages routing.
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, distUrl + "/index.html"));
});

app.get("*asd", (req, res) => {
    res.sendFile(path.resolve(__dirname, distUrl + "/404.html"));
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

nodemon({
    watch: ["src"],
    ext: "ts",
    exec: "npm run build",
});

nodemon.on("start", function () {
    console.log("Rebuilding...");
});
