const path = require("path");
const esbuild = require("esbuild");
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

esbuild.build({
    entryPoints: ["src/index.ts", "src/worker.ts", "src/404.ts"],
    bundle: true,
    format: "esm",
    outdir: "dist/public/js",
    define: {
        "process.env.BASE_URL": `"${process.env.BASE_URL}"`,
    },
});
