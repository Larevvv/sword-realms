import ZeroMd from "zero-md";
import { MetaExtractExtension } from "./plugins/meta-extract";
import { PAGE_MAIN } from "./helpers/page-elements";
import { HashAnchorExtension } from "./plugins/hash-anchor";

customElements.define(
    "zero-md",
    class extends ZeroMd {
        override async load() {
            await super.load();
            this.marked.use(MetaExtractExtension);
            this.marked.use(HashAnchorExtension);
        }
    },
);

if (!window.location.hash) {
    window.location.hash = "#/";
}

const loadURLContent = () => {
    let targetPath = window.location.hash.slice(2);

    if (targetPath.endsWith("/") || !targetPath) {
        targetPath = targetPath + "index";
    }

    if (PAGE_MAIN) {
        PAGE_MAIN.innerHTML = `<zero-md src="public/pages/${targetPath}.md"><template></template></zero-md>`;
    }
};

loadURLContent();

window.addEventListener("hashchange", () => {
    loadURLContent();
});
