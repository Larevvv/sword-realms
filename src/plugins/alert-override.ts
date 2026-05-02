import { LOADERS } from "zero-md";

export const MarkedAlertOverride = async () => {
    const alert = await LOADERS.markedAlert();
    // Override default alert variants
    return () =>
        alert({
            variants: [
                {
                    type: "note",
                    icon: "",
                },
                {
                    type: "tip",
                    icon: "",
                },
                {
                    type: "important",
                    icon: "",
                },
                {
                    type: "warning",
                    icon: "",
                },
                {
                    type: "caution",
                    icon: "",
                },
            ],
        });
};
