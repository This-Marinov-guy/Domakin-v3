import logoWinter from "@/assets/img/logo-4.png";
import logoDefault from "@/assets/img/logo-2.png";
import { ENV_PROD } from "./defines";
import { isTodayInRange } from "./helpers";

const normalizeEnvUrl = (value?: string) => value?.trim().replace(/^['"]|['"]$/g, "");

const isLocalApiUrl = (value?: string) => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
};

const envServerEndpoint = normalizeEnvUrl(process.env.NEXT_PUBLIC_SERVER_URL);
const envApiBaseUrl = normalizeEnvUrl(process.env.API_BASE_URL);

// server
export const SERVER_ENDPOINT =
  envServerEndpoint
  || (process.env.NODE_ENV === "production" && isLocalApiUrl(envApiBaseUrl) ? undefined : envApiBaseUrl)
  || "https://orange.domakin.nl";

// Enhanced debugging for server endpoint
console.log(`[Config] Environment: ${typeof window !== 'undefined' ? 'Client' : 'Server'}`);
console.log(`[Config] SERVER_ENDPOINT: ${SERVER_ENDPOINT}`);
console.log(`[Config] NODE_ENV: ${process.env.NODE_ENV}`);

export const SESSION_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

// apis
export const getApiUrl = (code: string) => {
  switch (code) {
    case "weapon":
      return "";
    default:
      return code;
  }
};

// design
export const NONE = 0;
export const WINTER = 1;
export const SUMMER = 2;

export const THEME = isTodayInRange("11-01", "01-15")
  ? WINTER
  : isTodayInRange("06-01", "08-31")
  ? SUMMER
  : NONE;

export const logoByTheme = () => {
  switch (THEME) {
    case WINTER:
      return logoWinter;
    default:
      return logoDefault;
  }
};

// server
export const GENERAL_ERROR_RESPONSE_CODES = [419, 500];

export const PAGINATION_PER_PAGE_OPTIONS_1 = [2, 5, 10];
export const PAGINATION_PER_PAGE_OPTIONS_2 = [2, 5, 10, 20, 50];

// Trustpilot
// Account-specific Business Unit ID (required for the official TrustBox widgets).
// Set NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID in the environment.
export const TRUSTPILOT_BUSINESS_UNIT_ID =
  process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID?.trim() || "";
// Token for the Review Collector TrustBox (the widget available on the current plan).
export const TRUSTPILOT_REVIEW_TOKEN =
  process.env.NEXT_PUBLIC_TRUSTPILOT_REVIEW_TOKEN?.trim() || "";
export const TRUSTPILOT_REVIEW_URL = "https://www.trustpilot.com/review/domakin.nl";
// Direct "leave a review" short link from the Trustpilot dashboard.
export const TRUSTPILOT_EVALUATE_URL = "https://trstp.lt/OwFqU1cND7";
export const TRUSTPILOT_BOOTSTRAP_SRC =
  "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

// Trustpilot TrustBox template IDs. The Review Collector is the one enabled for
// this business unit; the others need a paid plan and otherwise render a fallback.
export const TRUSTPILOT_TEMPLATES = {
  reviewCollector: "56278e9abfbbba0bdcd568bc", // invite to leave a review
  microCombo: "5419b6ffb0d04a076446a9af",
  microStar: "5419b6a8b0d04a076446a9ad",
  carousel: "53aa8912dec7e10d38f59f36",
  horizontal: "5406e65db0d04a09e042d5fc",
} as const;
