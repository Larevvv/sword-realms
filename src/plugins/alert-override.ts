import { LOADERS } from "zero-md";

export const MarkedAlertOverride = async () => {
    const alert = await LOADERS.markedAlert();
    // Override default alert variants
    return () =>
        alert({
            variants: [
                {
                    type: "note",
                    icon: "", //'<div class="alert-icon alert-note"></div>',
                },
                {
                    type: "tip",
                    icon: "", //'<div class="alert-icon alert-tip"></div>',
                },
                {
                    type: "important",
                    icon: "", //'<div class="alert-icon alert-important"></div>',
                },
                {
                    type: "warning",
                    icon: "", //'<div class="alert-icon alert-warning"></div>',
                },
                {
                    type: "caution",
                    icon: "", //'<div class="alert-icon alert-caution"></div>',
                },
            ],
        });
};
