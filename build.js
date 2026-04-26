const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["src/index.ts", "src/worker.ts"],
    bundle: true,
    format: "esm",
    outdir: "public/js",
});
