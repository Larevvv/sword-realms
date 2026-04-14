const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["src/index.ts", "src/worker.ts"],
    bundle: true,
    format: "cjs",
    outdir: "public/js",
});
