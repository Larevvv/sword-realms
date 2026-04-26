import ZeroMd from "zero-md";
import { MetaExtractExtension } from "./plugins/meta-extract";
import { PAGE_MAIN } from "./helpers/page-elements";

customElements.define(
    "zero-md",
    class extends ZeroMd {
        override async load() {
            await super.load();
            this.marked.use(MetaExtractExtension);
        }
    },
);

const loadURLContent = () => {
    const targetPath = location.pathname.slice(1);

    if (PAGE_MAIN) {
        PAGE_MAIN.innerHTML = `<zero-md src="/public/pages/${targetPath || "index"}.md"><template></template></zero-md>`;
    }
};

loadURLContent();
