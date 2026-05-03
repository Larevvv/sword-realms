import ZeroMd from "zero-md";
import { MetaExtractExtension } from "./plugins/meta-extract";
import { PAGE_MAIN } from "./helpers/page-elements";
import { HashAnchorExtension } from "./plugins/hash-anchor";
import { MarkedAlertOverride } from "./plugins/alert-override";
import { TimestampExtension } from "./plugins/timestamps";
import { MermaidOverride } from "./plugins/mermaid-override";

customElements.define(
    "zero-md",
    class extends ZeroMd {
        override async load() {
            await super.load({
                markedAlert: MarkedAlertOverride,
                mermaid: MermaidOverride,
            });
            this.marked.use(MetaExtractExtension);
            this.marked.use(HashAnchorExtension);
            this.marked.use(TimestampExtension);
        }
    },
);

if (!window.location.hash) {
    window.location.hash = "#/";
}

const mdTemplate = `
    <template>
        <style>
            :host { display: block; position: relative; contain: content; }
            :host([hidden]) { display: none; }
        </style>
        <link rel="stylesheet" href="public/styles/main.css" />

        <!-- Highlightjs Github theme (light) -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/styles/github.min.css" />

        <!-- Highlightjs Github theme (prefers dark) -->
        <link rel="stylesheet" media="(prefers-color-scheme:dark)" href="https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/styles/github-dark.min.css" />

        <!-- KaTeX styles (needed for math) -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0/dist/katex.min.css" />
    </template>
`.trim();

const loadURLContent = () => {
    let targetPath = window.location.hash.slice(2);

    if (targetPath.endsWith("/") || !targetPath) {
        targetPath = targetPath + "index";
    }

    if (PAGE_MAIN) {
        PAGE_MAIN.innerHTML = `<zero-md src="public/pages/${targetPath}.md">${mdTemplate}</zero-md>`;
    }
};

loadURLContent();

// Fixes double render on root path.
setTimeout(() => {
    window.addEventListener("hashchange", () => {
        loadURLContent();
    });
}, 0);
