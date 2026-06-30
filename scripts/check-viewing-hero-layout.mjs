import fs from "node:fs";

const checks = [
  {
    file: "src/components/inner-pages/services/detail-page/ViewingPage.tsx",
    mustInclude: [
      "HeaderOne",
      "RatingStars",
      "viewing-page-screenshot-shell",
      "viewing-hero-trust",
      "Trusted by",
      "500+",
    ],
    mustNotInclude: ["data-viewing-logo-only-header"],
  },
  {
    file: "public/assets/scss/_service.scss",
    mustInclude: [
      ".viewing-page-screenshot-shell .theme-main-menu",
      "position: absolute !important",
      "background: url(\"../img/bg/7.webp\") no-repeat center top / cover",
      "min-height: clamp(219px, 30.2vw, 274px)",
      "min-height: clamp(274px, 26.1vw, 334px)",
      ".viewing-hero-rating",
      "font-size: clamp(24px, 3.75vw, 48px)",
      "border-top-left-radius: clamp(30px, 3.125vw, 40px)",
      "border-top-left-radius: 40px",
      "flex: 0 1 auto",
      "grid-template-columns: 60px minmax(0, 1fr) 52px",
      "&.fixed {\n        background: transparent",
    ],
    mustNotInclude: ["background: rgba(245, 246, 251, 0.96)"],
  },
];

const failures = [];

for (const check of checks) {
  const source = fs.readFileSync(check.file, "utf8");

  for (const expected of check.mustInclude ?? []) {
    if (!source.includes(expected)) {
      failures.push(`${check.file} should include ${JSON.stringify(expected)}`);
    }
  }

  for (const forbidden of check.mustNotInclude ?? []) {
    if (source.includes(forbidden)) {
      failures.push(`${check.file} should not include ${JSON.stringify(forbidden)}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Viewing hero layout source checks passed.");
