import logoWinter from "@/assets/img/logo-4.png";
import logoDefault from "@/assets/img/logo-2.png";
import { isProd } from "./defines";

// server
export const SERVER_ENDPOINT = isProd
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

export const THEME = WINTER;

export const logoByTheme = () => {
  switch (THEME) {
    case WINTER:
      return logoWinter;
    default:
      return logoDefault;
  }
};
