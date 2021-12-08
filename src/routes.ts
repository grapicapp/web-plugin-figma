export const ROOM_BASE = `/room`;
export const EMBED_FIGMA_ROOM_BASE = `/figmaEmbed`;
export const NEW_GRAPIC = `/new`;
export const NEW_GRAPIC_EMBED_FIGMA = `/new/figmaEmbed`;

export const QUERY_AUTO_SIGN_IN = `authenticate`;
export const QUERY_AUTO_SIGN_IN_ANONYMOUS = `anonymous`;

declare const process: { env?: "production" | "development" } | undefined;

export const baseUrl =
  process.env === "production"
    ? "https://app.grapic.co"
    : "https://staging.app.grapic.co"; // "http://localhost:3000";
