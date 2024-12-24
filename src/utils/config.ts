import logoWinter from "@/assets/img/logo-4.png";
import logoDefault from "@/assets/img/logo-2.png";

export const NONE = 0;
export const WINTER = 1;
export const SUMMER = 2;

export const THEME = WINTER;

// helpers

export const logoByTheme = () => {
  switch (THEME) {
    case WINTER:
      return logoWinter;
    default:
      return logoDefault;
  }
};
