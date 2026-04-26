import globals from "globals";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["./src/**/*.{js,mjs,cjs,ts,mts,cts}"],
        languageOptions: { globals: globals.browser },
    },
    {
        ...tseslint.configs.recommended,
        files: ["./src/**/*.ts"],
    },
    {
        files: ["./dist/public/pages/**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        languageOptions: {
            frontmatter: "yaml",
            math: true,
        },
        rules: {
            "markdown/no-multiple-h1": ["error", { frontmatterTitle: "" }],
            "markdown/no-html": [
                "error",
                {
                    allowed: ["section", "nav", "article"],
                },
            ],
        },
        extends: ["markdown/recommended"],
    },
]);
