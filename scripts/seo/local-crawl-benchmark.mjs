const baseUrl = (process.argv[2] || "http://localhost:3011").replace(/\/$/, "");

const legacyRemoteViewingBlogPaths = [
  "/blog/remote-viewing-netherlands",
  "/blog/remote-viewing-netherlands-2025",
];

const isLegacyRemoteViewingLoc = (loc) =>
  legacyRemoteViewingBlogPaths.some((path) => loc.includes(path));

const extractLocs = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

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

const countInternalLinks = (html) => {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (
      href.startsWith("/") ||
      href.startsWith("https://www.domakin.nl") ||
      href.startsWith("https://domakin.nl")
    ) {
      links.add(href.split("#")[0]);
    }
  }
  return links.size;
};

const fetchText = async (path, init) => {
  const response = await fetch(`${baseUrl}${path}`, init);
  return {
    path,
    status: response.status,
    location: response.headers.get("location"),
    body: await response.text(),
  };
};

const sitemapChecks = [];
for (const path of [
  "/robots.txt",
  "/sitemap-index.xml",
  "/sitemap.xml",
  "/api/sitemap.xml",
  "/api/v1/sitemap.xml",
]) {
  const result = await fetchText(path);
  const locs = extractLocs(result.body);
  sitemapChecks.push({
    path,
    status: result.status,
    locs: locs.length,
    duplicateLocs: locs.length - new Set(locs).size,
    apiLocs: locs.filter((loc) => loc.includes("/api/")).length,
    legacyRemoteViewingLocs: locs.filter(isLegacyRemoteViewingLoc).length,
  });
}

const pageChecks = [];
const pageExpectations = [
  {
    path: "/services/renting",
    requiredTypes: ["ItemList", "Accommodation", "Offer", "BreadcrumbList"],
    minInternalLinks: 3,
  },
  {
    path: "/services/room-searching",
    answerMarker: "data-geo-service-answer-block",
    sourceMarker: "government.nl/themes/building-and-housing/housing/rented-housing",
    requiredTypes: ["Service", "FAQPage"],
    minInternalLinks: 3,
  },
  {
    path: "/services/viewing",
    answerMarker: "data-geo-service-answer-block",
    sourceMarker: "government.nl/themes/building-and-housing/housing/rented-housing",
    requiredTypes: ["Service", "FAQPage"],
    minInternalLinks: 3,
  },
  {
    path: "/services/add-listing",
    answerMarker: "data-geo-service-answer-block",
    sourceMarker: "government.nl/themes/building-and-housing/housing/rented-housing",
    requiredTypes: ["Service", "FAQPage"],
    minInternalLinks: 3,
  },
  {
    path: "/blog/student-finance-netherlands-2026",
    answerMarker: "data-geo-answer-block",
    sourceMarker: "duo.nl/particulier/student-finance",
    requiredTypes: ["BlogPosting", "FAQPage"],
    minInternalLinks: 3,
  },
  {
    path: "/blog/bsn-nummer-id-nederland",
    answerMarker: "data-geo-answer-block",
    sourceMarker: "government.nl/themes/government-and-democracy/personal-data/citizen-service-number-bsn",
    requiredTypes: ["BlogPosting", "FAQPage"],
    minInternalLinks: 3,
  },
  {
    path: "/blog/rent-allowance-netherlands-2026",
    answerMarker: "data-geo-answer-block",
    sourceMarker: "belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/benefits",
    requiredTypes: ["BlogPosting", "FAQPage"],
    minInternalLinks: 3,
  },
];

for (const expectation of pageExpectations) {
  const result = await fetchText(expectation.path);
  const types = extractJsonLdTypes(result.body);
  const requiredTypesPresent = expectation.requiredTypes.every((type) =>
    types.has(type),
  );

  pageChecks.push({
    path: expectation.path,
    status: result.status,
    h1Count: (result.body.match(/<h1\b/gi) || []).length,
    canonical: /<link[^>]+rel=["']canonical["']/i.test(result.body),
    answerBlock: expectation.answerMarker
      ? result.body.includes(expectation.answerMarker)
      : true,
    source: expectation.sourceMarker
      ? result.body.includes(expectation.sourceMarker)
      : true,
    internalLinks: countInternalLinks(result.body),
    minInternalLinks: expectation.minInternalLinks ?? 0,
    requiredTypesPresent,
  });
}

const redirectChecks = [];
for (const [from, to] of [
  ["/blog/bsn-number-id-netherlands", "/blog/bsn-nummer-id-nederland"],
  ["/blog/rent-allowance-netherlands", "/blog/rent-allowance-netherlands-2026"],
  ["/blog/remote-viewing-netherlands", "/services/viewing"],
  ["/blog/remote-viewing-netherlands-2025", "/services/viewing"],
]) {
  const result = await fetchText(from, { redirect: "manual" });
  redirectChecks.push({
    from,
    status: result.status,
    location: result.location,
    expectedTarget: to,
    targetMatched: result.location?.includes(to) ?? false,
  });
}

console.log("Sitemaps");
console.table(sitemapChecks);
console.log("Pages");
console.table(pageChecks);
console.log("Redirects");
console.table(redirectChecks);

const failures = [
  ...sitemapChecks.filter((result) => {
    if (result.status !== 200 || result.duplicateLocs !== 0) return true;
    if (result.legacyRemoteViewingLocs !== 0) return true;
    if (result.path === "/sitemap-index.xml") {
      return result.locs !== 1 || result.apiLocs !== 0;
    }
    if (result.path === "/sitemap.xml") {
      return result.locs < 100 || result.apiLocs !== 0;
    }
    if (result.path.startsWith("/api/")) {
      return result.locs < 100;
    }
    return false;
  }),
  ...pageChecks.filter(
    (result) =>
      result.status !== 200 ||
      result.h1Count !== 1 ||
      !result.canonical ||
      !result.answerBlock ||
      !result.source ||
      result.internalLinks < result.minInternalLinks ||
      !result.requiredTypesPresent,
  ),
  ...redirectChecks.filter(
    (result) =>
      !(result.status === 308 || result.status === 301) || !result.targetMatched,
  ),
];

if (failures.length) {
  console.error(`Local crawl benchmark failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("Local crawl benchmark passed.");
