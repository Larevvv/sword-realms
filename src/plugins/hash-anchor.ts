import type { MarkedExtension, Token } from "marked";

const baseUrl = "/sword-realms";
const absoluteBaseUrl = `${window.location.origin}${baseUrl}/#/`;

export const HashAnchorExtension: MarkedExtension = {
    walkTokens(token: Token) {
        if (token.type === "link") {
            const targetUrl = new URL(token.href);
            if (targetUrl.origin === window.location.origin) {
                if (targetUrl.pathname.startsWith(baseUrl)) {
                    token.href = `${absoluteBaseUrl}${targetUrl.pathname.slice(`${baseUrl}`.length + 1)}`;
                } else {
                    token.href = `${absoluteBaseUrl}${targetUrl.pathname.slice(1)}`;
                }
            }
        }
    },
};
