import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const engines = [
  { id: "google", type: "search" },
  { id: "bing", type: "search" },
  { id: "chatgpt", type: "ai-answer" },
  { id: "perplexity", type: "ai-answer" },
];

const allEngineIds = engines.map((engine) => engine.id);

const mappings = [
  {
    id: "student-finance-netherlands-2026",
    query: "student finance Netherlands 2026",
    impact: 5,
    targetPath: "/blog/student-finance-netherlands-2026",
    sourceFiles: [
      "src/components/blogs/common-blog/AnswerFirstBlock.tsx",
      "src/pages/blog/[slug].tsx",
    ],
    engines: allEngineIds,
    requiredPhrases: [
      "Can international students get student finance in the Netherlands?",
      "Quick answer",
      "Official sources",
      "DUO student finance eligibility",
    ],
    requiredLinks: [
      "https://duo.nl/particulier/student-finance/eligibility.jsp",
    ],
    requiredJsonLdTypes: ["BlogPosting", "FAQPage"],
    answerMarker: "data-geo-answer-block",
  },
  {
    id: "bsn-nummer-id-nederland",
    query: "BSN number Netherlands",
    impact: 5,
    targetPath: "/blog/bsn-nummer-id-nederland",
    sourceFiles: [
      "src/components/blogs/common-blog/AnswerFirstBlock.tsx",
      "src/pages/blog/[slug].tsx",
    ],
    engines: allEngineIds,
    requiredPhrases: [
      "How do you get a BSN in the Netherlands?",
      "Quick answer",
      "Official sources",
      "Government.nl citizen service number",
    ],
    requiredLinks: [
      "https://www.government.nl/themes/government-and-democracy/personal-data/citizen-service-number-bsn",
    ],
    requiredJsonLdTypes: ["BlogPosting", "FAQPage"],
    answerMarker: "data-geo-answer-block",
  },
  {
    id: "rent-allowance-netherlands-2026",
    query: "rent allowance Netherlands 2026",
    impact: 4,
    targetPath: "/blog/rent-allowance-netherlands-2026",
    sourceFiles: [
      "src/components/blogs/common-blog/AnswerFirstBlock.tsx",
      "src/pages/blog/[slug].tsx",
    ],
    engines: allEngineIds,
    requiredPhrases: [
      "Can students get rent allowance in the Netherlands in 2026?",
      "Quick answer",
      "Official sources",
      "Belastingdienst rent thresholds for rent benefit",
    ],
    requiredLinks: [
      "https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/benefits/moving_to_the_netherlands/i_live_in_a_rented_house/rent-and-service-costs/rent-and-service-costs",
    ],
    requiredJsonLdTypes: ["BlogPosting", "FAQPage"],
    answerMarker: "data-geo-answer-block",
  },
  {
    id: "room-searching-service",
    query: "room searching service Netherlands students",
    impact: 4,
    targetPath: "/services/room-searching",
    sourceFiles: [
      "src/components/inner-pages/services/ServiceAnswerBlock.tsx",
      "src/components/inner-pages/services/detail-page/RoomSearching.tsx",
      "src/pages/services/room-searching/index.tsx",
    ],
    engines: allEngineIds,
    requiredPhrases: [
      "What does Domakin's room searching service do?",
      "Quick answer",
      "Government.nl rented housing",
    ],
    requiredLinks: [
      "https://www.government.nl/themes/building-and-housing/housing/rented-housing",
    ],
    requiredJsonLdTypes: ["Service", "FAQPage"],
    answerMarker: "data-geo-service-answer-block",
  },
  {
    id: "services-hub",
    query: "Domakin services remote viewing list a room Netherlands",
    impact: 5,
    targetPath: "/services",
    sourceFiles: [
      "src/components/inner-pages/services/ServicesHub.tsx",
      "src/pages/services/index.tsx",
    ],
    engines: allEngineIds,
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
    requiredLinks: [
      "/services/viewing",
      "/services/add-listing",
    ],
    requiredJsonLdTypes: ["WebPage", "ItemList", "Service", "FAQPage"],
    answerMarker: "data-geo-services-hub-answer-block",
  },
  {
    id: "viewing-service",
    query: "remote property viewing service Netherlands students",
    impact: 4,
    targetPath: "/services/viewing",
    sourceFiles: [
      "src/components/inner-pages/services/ServiceAnswerBlock.tsx",
      "src/components/inner-pages/services/detail-page/ViewingPage.tsx",
      "src/components/forms/ViewingForm.tsx",
      "src/data/viewingLocations.ts",
      "src/pages/services/viewing/index.tsx",
    ],
    engines: allEngineIds,
    requiredPhrases: [
      "Can Domakin do a remote rental viewing for you?",
      "Domakin remote property viewing service",
      "Quick answer",
      "Remote viewing pricing",
      "Standard remote viewing",
      "Express remote viewing",
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
      "You have been invited to a viewing you cannot attend",
      "Schedule a viewing and tell us everything you want to know about the place",
      "We attend on your behalf and create a report with pictures and videos",
      "We send you the report",
      "You make your own decision",
      "How much is the rent and the deposit?",
      "What is the contract length?",
      "Is registration possible?",
      "Is housing allowance possible?",
      "How to apply for the place after the viewing and what is the deadline?",
      "How many people are interested in the place and what are the chances of getting it?",
      "Extra questions or notes",
      "Tell us what to check, where to go and who the viewing is for.",
      "Book your remote viewing",
      "Start the request",
      "Other",
      "We will contact you about this location",
    ],
    requiredLinks: ["/pricing"],
    requiredJsonLdTypes: ["Service", "FAQPage"],
    answerMarker: "data-geo-service-answer-block",
  },
  {
    id: "add-listing-service",
    query: "list a room Netherlands find tenant flatmate",
    impact: 4,
    targetPath: "/services/add-listing",
    sourceFiles: [
      "src/components/inner-pages/services/ServiceAnswerBlock.tsx",
      "src/components/inner-pages/services/detail-page/LendingPageV3.tsx",
      "src/pages/services/add-listing/index.tsx",
    ],
    engines: allEngineIds,
    requiredPhrases: [
      "Can Domakin help you list a room and find a new tenant or flatmate?",
      "Domakin list a room service",
      "Quick answer",
      "Government.nl rented housing",
    ],
    requiredLinks: [
      "https://www.government.nl/themes/building-and-housing/housing/rented-housing",
    ],
    requiredJsonLdTypes: ["Service", "FAQPage"],
    answerMarker: "data-geo-service-answer-block",
  },
];

const rootDir = process.cwd();
const outPath = argValue(process.argv.slice(2), "--out");
const results = [];
const findings = [];

for (const mapping of mappings) {
  const source = readSourceBundle(rootDir, mapping.sourceFiles);
  const text = source.text;
  const jsonLdTypes = extractStructuredDataTypes(text);
  const missingPhrases = mapping.requiredPhrases.filter((phrase) =>
    !includesText(text, phrase),
  );
  const missingLinks = mapping.requiredLinks.filter((link) =>
    !includesText(text, link),
  );
  const missingJsonLdTypes = mapping.requiredJsonLdTypes.filter((type) =>
    !jsonLdTypes.includes(type),
  );
  const answerFirst = includesText(text, mapping.answerMarker);
  const cited = mapping.requiredLinks.some((link) => includesText(text, link));

  results.push({
    id: mapping.id,
    query: mapping.query,
    targetPath: mapping.targetPath,
    impact: mapping.impact,
    engines: mapping.engines,
    sourceFiles: mapping.sourceFiles,
    answerFirst,
    cited,
    jsonLdTypes,
    missingPhrases,
    missingLinks,
    missingJsonLdTypes,
  });

  for (const file of source.missingFiles) {
    findings.push(toFinding(mapping, "critical", `missing source file: ${file}`));
  }
  if (!sameEngines(mapping.engines, allEngineIds)) {
    findings.push(toFinding(mapping, "high", "query is not benchmarked across Google, Bing, ChatGPT and Perplexity"));
  }
  for (const phrase of missingPhrases) {
    findings.push(toFinding(mapping, "high", `missing answer-ready phrase: ${phrase}`));
  }
  for (const link of missingLinks) {
    findings.push(toFinding(mapping, "high", `missing required source link: ${link}`));
  }
  for (const type of missingJsonLdTypes) {
    findings.push(toFinding(mapping, "high", `missing structured data type: ${type}`));
  }
  if (!answerFirst) {
    findings.push(toFinding(mapping, "high", "mapped page does not expose an answer-first block marker"));
  }
  if (!cited) {
    findings.push(toFinding(mapping, "high", "mapped page does not expose source citation signals"));
  }
}

findings.sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || b.impact - a.impact);

const audit = {
  generatedAt: new Date().toISOString(),
  engines,
  results,
  findings,
};

console.table(results.map((result) => ({
  id: result.id,
  answerFirst: result.answerFirst,
  cited: result.cited,
  missingPhrases: result.missingPhrases.length,
  missingLinks: result.missingLinks.length,
  missingJsonLdTypes: result.missingJsonLdTypes.length,
})));
console.log(`Domakin GEO query high-impact findings: ${findings.filter((finding) => finding.severity === "high" || finding.severity === "critical").length}`);

if (outPath) {
  const outDir = outPath.replace(/[\\/][^\\/]+$/, "");
  if (outDir && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  console.log(`Domakin GEO query benchmark written to ${outPath}`);
}

if (findings.some((finding) => finding.severity === "critical" || finding.severity === "high")) {
  process.exitCode = 1;
}

function readSourceBundle(baseDir, files) {
  const chunks = [];
  const missingFiles = [];

  for (const file of files) {
    const path = join(baseDir, file);
    if (!existsSync(path)) {
      missingFiles.push(file);
      continue;
    }
    chunks.push(readFileSync(path, "utf8"));
  }

  return { text: chunks.join("\n"), missingFiles };
}

function includesText(text, needle) {
  return text.toLowerCase().includes(needle.toLowerCase());
}

function extractStructuredDataTypes(text) {
  const types = new Set();
  for (const match of text.matchAll(/["@']@type["@']\s*:\s*["']([^"']+)["']/g)) {
    types.add(match[1]);
  }
  for (const type of ["BlogPosting", "FAQPage", "Service"]) {
    if (includesText(text, type)) types.add(type);
  }
  return [...types].sort();
}

function sameEngines(actual, expected) {
  return actual.length === expected.length && expected.every((engine) => actual.includes(engine));
}

function toFinding(mapping, severity, issue) {
  return {
    id: mapping.id,
    query: mapping.query,
    targetPath: mapping.targetPath,
    severity,
    impact: mapping.impact,
    issue,
  };
}

function severityRank(severity) {
  return severity === "critical" ? 4 : severity === "high" ? 3 : severity === "medium" ? 2 : 1;
}

function argValue(argv, key) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === key) return argv[index + 1];
    if (arg.startsWith(`${key}=`)) return arg.slice(key.length + 1);
  }
  return null;
}
