const baseUrl = (process.argv[2] || "http://localhost:3011").replace(/\/$/, "");

const pages = [
  "/services/room-searching",
  "/services/viewing",
  "/services/add-listing",
];

const officialSourceNeedle =
  "government.nl/themes/building-and-housing/housing/rented-housing";

const extractJsonLdTypes = (html) => {
  const types = new Set();
  const scripts = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );

  if (!scripts) return types;

  for (const script of scripts) {
    const json = script
      .replace(/^<script[^>]*>/i, "")
      .replace(/<\/script>$/i, "")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");

    const matches = json.matchAll(/"@type"\s*:\s*(?:"([^"]+)"|\[([^\]]+)\])/g);
    for (const match of matches) {
      if (match[1]) {
        types.add(match[1]);
      }

      if (match[2]) {
        for (const value of match[2].matchAll(/"([^"]+)"/g)) {
          types.add(value[1]);
        }
      }
    }
  }

  return types;
};

const results = [];

for (const path of pages) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const jsonLdTypes = extractJsonLdTypes(html);

  results.push({
    path,
    status: response.status,
    answerBlock: html.includes("data-geo-service-answer-block"),
    officialSource: html.includes(officialSourceNeedle),
    serviceJsonLd: jsonLdTypes.has("Service"),
    faqJsonLd: jsonLdTypes.has("FAQPage"),
  });
}

const failures = results.filter(
  (result) =>
    result.status !== 200 ||
    !result.answerBlock ||
    !result.officialSource ||
    !result.serviceJsonLd ||
    !result.faqJsonLd,
);

console.table(results);

if (failures.length) {
  console.error(
    `Service GEO benchmark failed for ${failures.length} page(s): ${failures
      .map((result) => result.path)
      .join(", ")}`,
  );
  process.exit(1);
}

console.log("Service GEO benchmark passed.");
