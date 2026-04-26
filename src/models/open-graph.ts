export type OpenGraph = {
    "og:title": string;
    "og:type": string;
    "og:url": string;
    "og:description": string;
    "og:determiner": string;
    "og:locale": string;
    "og:site_name": string;
} & OpenGraphImage;

export type OpenGraphImage =
    | {
          "og:image"?: undefined;
      }
    | {
          "og:image": string;
          "og:image:secure_url"?: string;
          "og:image:type": string;
          "og:image:width": number;
          "og:image:height": number;
          "og:image:alt": string;
      };
