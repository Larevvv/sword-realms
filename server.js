const express = require("express");
const compression = require("compression");
const app = express();
const path = require("path");
const nodemon = require("nodemon");

app.use(compression());
app.use("/public", express.static("public", { fallthrough: false }));

const port = process.env.PORT || 3000;

app.get("*asd", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(port, () => {
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
