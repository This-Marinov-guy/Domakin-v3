const baseUrl = (process.argv[2] || "http://localhost:3011").replace(/\/$/, "");

const pages = [
  {
    path: "/services",
    needsOfficialSource: false,
    forbiddenPhrases: ["Official sources"],
    requiredPhrases: [
      "Which Domakin services help with housing in the Netherlands?",
      "Quick answer",
      "Book remote viewing",
      "Property catalogue",
      "Search for a room",
      "List a room",
      "Domakin remote property viewing service",
      "Domakin list a room service",
    ],
  },
  {
    path: "/services/room-searching",
    needsOfficialSource: false,
    forbiddenPhrases: ["Official sources"],
  },
  {
    path: "/services/viewing",
    needsOfficialSource: false,
    forbiddenPhrases: ["Official sources", "1) Fill in your details"],
    forbiddenHtml: ["theme-main-menu", "inner-banner-two", "navbar-toggler"],
    requiredPhrases: [
      "Remote viewing pricing",
      "Standard remote viewing",
      "Express remote viewing",
      "Read more",
      "Book a remote viewing",
      "EUR 50",
      "EUR 100",
      "Request remote viewing",
      "online viewing",
      "Supported viewing cities",
      "Amsterdam",
      "Breda",
      "Delft",
      "Eindhoven",
      "Enschede",
      "Groningen",
      "Leeuwarden",
      "Leiden",
      "Maastricht",
      "Rotterdam",
      "The Hague",
      "Tilburg",
      "Utrecht",
      "cannot attend because you are abroad",
      "think the listing may be a scam",
      "increase your chances during a housing lottery",
      "save time and money traveling",
      "good condition as advertised",
      "report with pictures and videos",
      "all your questions answered",
      "make a decision",
      "You have been invited to a viewing",
      "Tell us what to check, where to go and who the viewing is for.",
      "How many tenants is the bathroom shared with?",
      "Is there a storage room?",
      "Do I need to buy kitchen utensils?",
      "How do I apply for the property if I am interested?",
      "How much is the rent and the deposit?",
      "What is the contract length?",
      "Is registration possible?",
      "Is housing allowance possible?",
      "How to apply for the place after the viewing and what is the deadline?",
      "How many people are interested in the place and what are the chances of getting it?",
      "Extra questions or notes",
      "Book your remote viewing",
      "Start the request",
      "Other",
      "Where is the place?",
      "Postcode",
      "House number",
      "Street name",
      "When is the viewing?",
      "Who is this viewing for?",
      "You have been invited to a viewing you cannot attend",
      "Schedule a viewing and tell us everything you want to know about the place",
      "We attend on your behalf and create a report with pictures and videos",
      "We send you the report",
      "You make your own decision",
    ],
    visibleOccurrenceLimits: [
      { phrase: "Remote viewing pricing", count: 1 },
      { phrase: "EUR 50", count: 1 },
      { phrase: "EUR 100", count: 1 },
    ],
    requiredOrder: [
      "data-viewing-logo-only-header",
      "data-viewing-signup-section",
      'id="book-viewing"',
      "data-viewing-funnel-steps",
      "data-geo-service-answer-block",
    ],
  },
  {
    path: "/services/add-listing",
    needsOfficialSource: false,
    forbiddenPhrases: ["Official sources"],
  },
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

for (const page of pages) {
  const path = page.path;
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const visibleHtml = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const visibleText = visibleHtml
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ");
  const jsonLdTypes = extractJsonLdTypes(html);
  const officialSource = visibleHtml.includes(officialSourceNeedle);
  const requiredPhrasesPresent = (page.requiredPhrases || []).every((phrase) =>
    visibleText.includes(phrase),
  );
  const visibleOccurrenceLimitsMet = (
    page.visibleOccurrenceLimits || []
  ).every(({ phrase, count }) => countOccurrences(visibleText, phrase) === count);
  const forbiddenPhrasesAbsent = (page.forbiddenPhrases || []).every(
    (phrase) => !visibleText.includes(phrase),
  );
  const forbiddenHtmlAbsent = (page.forbiddenHtml || []).every(
    (phrase) => !visibleHtml.includes(phrase),
  );
  const requiredOrderPresent = (page.requiredOrder || []).every((marker) =>
    visibleHtml.includes(marker),
  );
  const requiredOrderCorrect = (page.requiredOrder || []).every(
    (marker, index, markers) =>
      index === 0 ||
      visibleHtml.indexOf(markers[index - 1]) < visibleHtml.indexOf(marker),
  );

  results.push({
    path,
    status: response.status,
    answerBlock:
      visibleHtml.includes("data-geo-service-answer-block") ||
      visibleHtml.includes("data-geo-services-hub-answer-block"),
    officialSource,
    requiredPhrasesPresent,
    visibleOccurrenceLimitsMet,
    forbiddenPhrasesAbsent,
    forbiddenHtmlAbsent,
    requiredOrderPresent,
    requiredOrderCorrect,
    serviceJsonLd: jsonLdTypes.has("Service"),
    faqJsonLd: jsonLdTypes.has("FAQPage"),
  });
}

const failures = results.filter(
  (result) =>
    result.status !== 200 ||
    !result.answerBlock ||
    (pages.find((page) => page.path === result.path)?.needsOfficialSource
      ? !result.officialSource
      : result.officialSource) ||
    !result.requiredPhrasesPresent ||
    !result.visibleOccurrenceLimitsMet ||
    !result.forbiddenPhrasesAbsent ||
    !result.forbiddenHtmlAbsent ||
    !result.requiredOrderPresent ||
    !result.requiredOrderCorrect ||
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

function countOccurrences(text, phrase) {
  return text.split(phrase).length - 1;
}
