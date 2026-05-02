import { LOADERS } from "zero-md";

export const MermaidOverride = async () => {
    const mm = await LOADERS.mermaid();

    return {
        initialize: (args: { startOnLoad: boolean }) => {
            mm.initialize({
                ...args,
                theme: "dark",
            });
        },
        render: (...args: unknown[]) => {
            return mm.render(...args);
        },
    };
};
