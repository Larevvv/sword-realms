import { type MarkedExtension } from "marked";
import fm from "front-matter";
import type { OpenGraph } from "../models/open-graph";

type PageMeta = {
    title: string;
    description: string;
    robots: string;
} & OpenGraph;

const defaultPageMeta: PageMeta = {
    title: "Sword Realms - 404",
    description: "Oops, this isn't a valid page.",
    robots: "noindex",

    "og:title": "Sword Realms - 404",
    "og:type": "website",
    "og:description": "Oops, something went wrong.",
    "og:determiner": "",
    "og:url": "", // Populate later
    "og:locale": "en_001",
    "og:site_name": "Sword Realms",
};

export const MetaExtractExtension: MarkedExtension = {
    hooks: {
        preprocess: function frontMatterPreProcess(markdown: string): string {
            const { attributes, body } = fm<Partial<PageMeta>>(markdown);
            console.log({ attributes });

            const pageURL = `${location.origin}${location.pathname}`;

            const { title, ...metas } = {
                ...defaultPageMeta,
                ...attributes,
                "og:url": pageURL,
            };

            // Updated title
            document.title = title;

            const metaElements = [...document.querySelectorAll("title,meta")];
            if (metaElements.length) {
                for (const element of metaElements) {
                    if (element.tagName === "META") {
                        const nameAttr = element.getAttribute("name");
                        if (nameAttr && nameAttr in metas) {
                            const value: string | undefined =
                                metas[nameAttr as keyof typeof metas];
                            if (value !== undefined) {
                                delete metas[nameAttr as keyof typeof metas];
                                element.setAttribute("content", String(value));
                            }
                            continue;
                        }

                        const propertyAttr = element.getAttribute("property");
                        if (propertyAttr && propertyAttr in metas) {
                            const value: string | undefined =
                                metas[nameAttr as keyof typeof metas];
                            if (value !== undefined) {
                                delete metas[nameAttr as keyof typeof metas];
                                element.setAttribute("content", String(value));
                            }
                            continue;
                        }
                    }
                }
                let lastElement = metaElements.pop();
                const asd = Object.entries(metas);
                if (asd.length) {
                    for (const [key, value] of asd) {
                        const newElement = document.createElement("meta");
                        if (key.startsWith("og:")) {
                            newElement.setAttribute("property", key);
                            newElement.setAttribute("content", String(value));
                        } else {
                            newElement.setAttribute("name", key);
                            newElement.setAttribute("content", String(value));
                        }
                        lastElement?.after(newElement);
                        lastElement = newElement;
                    }
                }
            }

            const foundCanonical = document.querySelector(
                "link[rel=canonical]",
            );
            if (!foundCanonical) {
                const newElement = document.createElement("link");
                newElement.setAttribute("rel", "canonical");
                newElement.setAttribute("href", pageURL);
                document.head.appendChild(newElement);
            } else {
                foundCanonical.setAttribute("href", pageURL);
            }

            return body;
        },
    },
};
