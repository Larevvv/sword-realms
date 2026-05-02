import type { MarkedExtension } from "marked";

const timestampRegex = /<t:(\d+):(\w)>/;
const tokenizerRule = new RegExp(`^${timestampRegex.source}`);

function getLocale() {
    return navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
}

type parserEntry<K, T> = {
    constructor: K;
    params: T;
};

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const locale = getLocale();

const parserEntries = {
    ["t"]: {
        // ShortTime
        constructor: Intl.DateTimeFormat,
        params: {
            hour: "numeric",
            minute: "numeric",
        },
    } as parserEntry<
        Intl.DateTimeFormatConstructor,
        Partial<Intl.DateTimeFormatOptions>
    >,
    ["T"]: {
        // LongTime
        constructor: Intl.DateTimeFormat,
        params: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        },
    } as parserEntry<
        Intl.DateTimeFormatConstructor,
        Partial<Intl.DateTimeFormatOptions>
    >,
    ["d"]: {
        // ShortDate
        constructor: Intl.DateTimeFormat,
        params: {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        },
    } as parserEntry<
        Intl.DateTimeFormatConstructor,
        Partial<Intl.DateTimeFormatOptions>
    >,
    ["D"]: {
        // LongDate
        constructor: Intl.DateTimeFormat,
        params: {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    } as parserEntry<
        Intl.DateTimeFormatConstructor,
        Partial<Intl.DateTimeFormatOptions>
    >,
    ["s"]: {
        // LongDate
        constructor: Intl.DateTimeFormat,
        params: {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        },
    } as parserEntry<
        Intl.DateTimeFormatConstructor,
        Partial<Intl.DateTimeFormatOptions>
    >,
    ["S"]: {
        // LongDate
        constructor: Intl.DateTimeFormat,
        params: {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        },
    } as parserEntry<
        Intl.DateTimeFormatConstructor,
        Partial<Intl.DateTimeFormatOptions>
    >,
    ["f"]: {
        // LongDate
        constructor: Intl.DateTimeFormat,
        params: {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        },
    } as parserEntry<
        Intl.DateTimeFormatConstructor,
        Partial<Intl.DateTimeFormatOptions>
    >,
    ["F"]: {
        // LongDate
        constructor: Intl.DateTimeFormat,
        params: {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        },
    } as parserEntry<
        Intl.DateTimeFormatConstructor,
        Partial<Intl.DateTimeFormatOptions>
    >,
} satisfies {
    [v: string]: parserEntry<any, any>;
};

const timestampParsers: {
    [v: string]:
        | ((timestamp: number) => { text: string; datetime: string })
        | undefined;
} = Object.entries(parserEntries).reduce((a, [key, value]) => {
    const localFormatter = new value.constructor(locale, {
        ...value.params,
        timeZone: localTimezone,
    });

    return {
        ...a,
        [key]: (timestamp: number) => ({
            text: localFormatter.format(timestamp),
            datetime: new Date(timestamp).toISOString(),
        }),
    };
}, {});

const getUTCTime = (date) => date.getTime() - date.getTimezoneOffset() * 60000;

if (!timestampParsers["R"]) {
    const unitTresholds: [Intl.RelativeTimeFormatUnit, number][] = [
        ["second", 1e3],
        ["minute", 6e4],
        ["hour", 36e5],
        ["day", 864e5],
        ["month", 26298e5],
        ["year", 315576e5],
    ];

    const duration = new Intl.RelativeTimeFormat(locale, {
        style: "long",
        numeric: "auto",
    });

    timestampParsers["R"] = (timestamp: number) => {
        const now = Math.floor(Date.now());
        const t = new Date(timestamp * 1000);

        const difference = +t - now;

        let pickedUnit = unitTresholds[0];
        for (const unit of unitTresholds) {
            if (Math.abs(difference) > unit[1]) {
                pickedUnit = unit;
            } else {
                break;
            }
        }

        if (!pickedUnit) {
            return {
                text: "",
                datetime: new Date(timestamp).toISOString(),
            };
        }

        return {
            text: duration.format(
                Math.floor(difference / pickedUnit[1]),
                pickedUnit[0],
            ),
            datetime: new Date(timestamp).toISOString(),
        };
    };
}

export const TimestampExtension: MarkedExtension = {
    extensions: [
        {
            name: "timestamp",
            level: "inline",
            start(src) {
                return src.match(timestampRegex)?.index;
            },
            tokenizer(src) {
                const match = tokenizerRule.exec(src);
                if (!match) {
                    return;
                }

                const timestamp = parseInt(match[1] ?? "", 10);
                if (!timestamp || isNaN(timestamp)) {
                    return;
                }
                const type = match[2];
                if (!type || !(type in timestampParsers)) {
                    return;
                }
                const parser =
                    timestampParsers[type as keyof typeof timestampParsers];

                if (!parser) {
                    return;
                }

                return {
                    type: "timestamp",
                    raw: match[0],
                    result: parser(timestamp),
                };
            },
            renderer(token) {
                if (!token.result) {
                    return "";
                }
                return `<time datetime="${token.result.datetime}">${token.result.text}</time>`;
            },
        },
    ],
};
