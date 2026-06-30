const hoistNonReactStatics = require("hoist-non-react-statics");

const DEFAULT_LOCALE = "en";

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isMissing = (value) =>
  value === undefined || value === null || (typeof value === "string" && value.trim() === "");

// Merge a locale namespace on top of the English base so any key that is missing
// (or left empty) in the locale falls back to the English translation per-key.
const mergeWithFallback = (base, target) => {
  if (!isPlainObject(base)) {
    return isMissing(target) ? base : target;
  }

  const merged = { ...base };

  for (const key of Object.keys(target || {})) {
    const baseValue = base[key];
    const targetValue = target[key];

    if (isPlainObject(baseValue) && isPlainObject(targetValue)) {
      merged[key] = mergeWithFallback(baseValue, targetValue);
    } else if (!isMissing(targetValue)) {
      merged[key] = targetValue;
    }
  }

  return merged;
};

module.exports = {
  locales: ["en", "bg", "gr", "nl"],
  defaultLocale: DEFAULT_LOCALE,
  pages: {
    "*": ["translations", "account"],
  },
  staticsHoc: hoistNonReactStatics,
  loadLocaleFrom: async (locale, namespace) => {
    const target = (await import(`./locales/${locale}/${namespace}`)).default;

    if (locale === DEFAULT_LOCALE) {
      return target;
    }

    const base = (await import(`./locales/${DEFAULT_LOCALE}/${namespace}`)).default;

    return mergeWithFallback(base, target);
  },
};
