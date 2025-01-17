import logoWinter from "@/assets/img/logo-4.png";
import logoDefault from "@/assets/img/logo-2.png";
import { ENV_PROD } from "./defines";
import { isTodayInRange } from "./helpers";

// server
export const SERVER_ENDPOINT = ENV_PROD
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:8000";

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
export const GENERAL_ERROR_RESPONSE_CODES = [419];