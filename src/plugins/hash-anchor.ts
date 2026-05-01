import type { MarkedExtension, Token } from "marked";

const baseUrl = process.env.BASE_URL;
const absoluteBaseUrl = `${window.location.origin}${baseUrl}/#/`;

export const HashAnchorExtension: MarkedExtension = {
    walkTokens(token: Token) {
        if (token.type === "link") {
            const targetUrl = new URL(token.href);
            if (targetUrl.origin === window.location.origin) {
                if (baseUrl && targetUrl.pathname.startsWith(baseUrl)) {
                    token.href = `${absoluteBaseUrl}${targetUrl.pathname.slice(`${baseUrl}`.length + 1)}`;
                } else {
                    token.href = `${absoluteBaseUrl}${targetUrl.pathname.slice(1)}`;
                }
            }
        }
    },
};
