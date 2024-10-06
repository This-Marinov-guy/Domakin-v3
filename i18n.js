const hoistNonReactStatics = require("hoist-non-react-statics");

module.exports = {
  locales: ["en", "bg", "gr"],
  defaultLocale: "en",
  pages: {
    "*": ["translations"],
  },
  staticsHoc: hoistNonReactStatics,
  loadLocaleFrom: (locale, namespace) =>
    import(`./locales/${locale}/${namespace}`).then((m) => m.default),
};
