import { marked } from "marked";

const cache = new Map();

onmessage = async (e) => {
    const target = e.data || "index";

    const cachedValue = cache.get(target);
    if (cachedValue) {
        return postMessage(await marked.parse(cachedValue));
    }

    const response = await fetch(`/public/pages/${target}.md`);
    if (!response.ok) {
        throw new Error(`Response status ${response.status}`);
    }
    const result = await response.text();
    cache.set(target, result);
    return postMessage(await marked.parse(result));
};
