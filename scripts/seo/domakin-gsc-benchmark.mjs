import { createSign } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const args = parseArgs(process.argv.slice(2));
const dateTo = args["date-to"] || daysAgoIso(2);
const dateFrom = args["date-from"] || daysAgoIso(30);
const property = args.property || "sc-domain:domakin.nl";
const rowLimit = Number(args["row-limit"] || 25000);
const outPath = args.out || null;
const highImpactImpressions = Number(args["high-impact-impressions"] || 50);

for (const envFile of [
  ...toArray(args["dotenv-file"]),
  ...toArray(args["env-path"]),
  ...toArray(args["env-file"]),
]) {
  loadEnvFile(envFile);
}

const mappings = [
  {
    id: "student-finance-netherlands-2026",
    query: "student finance Netherlands",
    targetPath: "/blog/student-finance-netherlands-2026",
    impact: 9,
    patterns: [
      ["student", "finance"],
      ["student", "financing"],
      ["studiefinanciering"],
      ["duo", "student"],
    ],
  },
  {
    id: "bsn-nummer-id-nederland",
    query: "BSN number Netherlands",
    targetPath: "/blog/bsn-nummer-id-nederland",
    impact: 9,
    patterns: [
      ["bsn"],
      ["citizen", "service", "number"],
      ["burgerservicenummer"],
    ],
  },
  {
    id: "rent-allowance-netherlands-2026",
    query: "rent allowance Netherlands",
    targetPath: "/blog/rent-allowance-netherlands-2026",
    impact: 8,
    patterns: [
      ["rent", "allowance"],
      ["rental", "allowance"],
      ["housing", "benefit"],
      ["huurtoeslag"],
    ],
  },
  {
    id: "viewing-service",
    query: "remote property viewing service Netherlands",
    targetPath: "/services/viewing",
    impact: 8,
    patterns: [
      ["remote", "viewing"],
      ["property", "viewing"],
      ["rental", "viewing"],
      ["viewing", "service"],
    ],
  },
  {
    id: "add-listing-service",
    query: "list a room Netherlands",
    targetPath: "/services/add-listing",
    impact: 8,
    patterns: [
      ["list", "room"],
      ["room", "listing"],
      ["find", "tenant"],
      ["find", "flatmate"],
      ["contract", "transfer"],
    ],
  },
];

const account = loadServiceAccount(process.env);
if (!account) {
  throw new Error("Missing Google Search Console service-account credentials.");
}

const token = await getAccessToken(account);
const rows = await fetchSearchConsoleRows({
  property,
  token,
  dateFrom,
  dateTo,
  rowLimit: Number.isFinite(rowLimit) && rowLimit > 0 ? rowLimit : 25000,
});

const results = mappings.map((mapping) => {
  const matchedRows = rows.filter((row) => queryMatches(row.query, mapping));
  const targetRows = matchedRows.filter((row) =>
    pageMatchesTarget(row.page, mapping.targetPath),
  );

  return {
    id: mapping.id,
    query: mapping.query,
    targetPath: mapping.targetPath,
    impact: mapping.impact,
    matchedRows: matchedRows.length,
    impressions: sum(matchedRows, "impressions"),
    clicks: sum(matchedRows, "clicks"),
    weightedAveragePosition: weightedAveragePosition(matchedRows),
    targetImpressions: sum(targetRows, "impressions"),
    targetClicks: sum(targetRows, "clicks"),
    targetWeightedAveragePosition: weightedAveragePosition(targetRows),
    topPages: pageSummaries(matchedRows, mapping.targetPath).slice(0, 5),
  };
});

const findings = results.flatMap((result) => {
  if (result.impressions >= highImpactImpressions && result.targetImpressions === 0) {
    return [{
      id: result.id,
      query: result.query,
      targetPath: result.targetPath,
      severity: "high",
      impact: result.impact,
      issue: `${result.impressions} impressions matched, but none landed on the mapped target page.`,
    }];
  }

  if (
    result.targetImpressions >= highImpactImpressions &&
    result.targetWeightedAveragePosition !== null &&
    result.targetWeightedAveragePosition > 10
  ) {
    return [{
      id: result.id,
      query: result.query,
      targetPath: result.targetPath,
      severity: "medium",
      impact: result.impact,
      issue: `Mapped target page receives impressions but weighted average position is ${result.targetWeightedAveragePosition}.`,
    }];
  }

  return [];
}).sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || b.impact - a.impact);

const audit = {
  generatedAt: new Date().toISOString(),
  property,
  dateFrom,
  dateTo,
  rowsFetched: rows.length,
  highImpactImpressions,
  results,
  highImpactGaps: findings.filter((finding) => finding.severity === "high"),
  mediumGaps: findings.filter((finding) => finding.severity === "medium"),
  findings,
};

console.table(results.map((result) => ({
  id: result.id,
  impressions: result.impressions,
  targetImpressions: result.targetImpressions,
  targetPosition: result.targetWeightedAveragePosition,
})));
console.log(
  `GSC high-impact gaps: ${audit.highImpactGaps.length}; medium gaps: ${audit.mediumGaps.length}; rows fetched: ${audit.rowsFetched}`,
);

if (outPath) {
  const outDir = outPath.replace(/[\\/][^\\/]+$/, "");
  if (outDir && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  console.log(`Domakin GSC benchmark written to ${outPath}`);
}

if (audit.highImpactGaps.length) {
  process.exitCode = 1;
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const equalsIndex = arg.indexOf("=");
    if (equalsIndex >= 0) {
      setArg(parsed, arg.slice(2, equalsIndex), arg.slice(equalsIndex + 1));
    } else {
      setArg(parsed, arg.slice(2), argv[index + 1]);
      index += 1;
    }
  }
  return parsed;
}

function setArg(parsed, key, value) {
  if (parsed[key]) {
    parsed[key] = [...toArray(parsed[key]), value];
  } else {
    parsed[key] = value;
  }
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function loadEnvFile(path) {
  if (!path || !existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.trimStart().startsWith("#")) continue;
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = stripQuotes(rawValue.trim());
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function loadServiceAccount(env) {
  const rawJson =
    env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON ||
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON;
  if (rawJson) return parseServiceAccountJson(readJsonValue(rawJson));

  const encodedJson =
    env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_B64 ||
    env.GOOGLE_SERVICE_ACCOUNT_B64 ||
    env.GOOGLE_INDEXING_SERVICE_ACCOUNT_B64;
  if (encodedJson) {
    return parseServiceAccountJson(Buffer.from(encodedJson, "base64").toString("utf8"));
  }

  const clientEmail =
    env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL ||
    env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    env.GOOGLE_INDEXING_CLIENT_EMAIL ||
    "";
  const privateKey =
    env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY ||
    env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ||
    env.GOOGLE_INDEXING_PRIVATE_KEY ||
    "";

  return clientEmail && privateKey
    ? { clientEmail, privateKey: normalizePrivateKey(privateKey) }
    : null;
}

function parseServiceAccountJson(raw) {
  const parsed = JSON.parse(raw);
  return {
    clientEmail: String(parsed.client_email || parsed.clientEmail || ""),
    privateKey: normalizePrivateKey(String(parsed.private_key || parsed.privateKey || "")),
  };
}

function readJsonValue(value) {
  return existsSync(value) ? readFileSync(value, "utf8") : value;
}

function normalizePrivateKey(value) {
  return value.replace(/\\n/g, "\n").trim();
}

async function getAccessToken(account) {
  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt(account, {
    iss: account.clientEmail,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Google Search Console OAuth HTTP ${response.status}: ${JSON.stringify(payload).slice(0, 300)}`);
  }
  if (!payload.access_token) {
    throw new Error("Google Search Console OAuth response did not include access_token.");
  }
  return String(payload.access_token);
}

function signJwt(account, claims) {
  const header = { alg: "RS256", typ: "JWT" };
  const signingInput = `${base64UrlJson(header)}.${base64UrlJson(claims)}`;
  const signature = createSign("RSA-SHA256").update(signingInput).sign(account.privateKey);
  return `${signingInput}.${base64Url(signature)}`;
}

function base64UrlJson(value) {
  return base64Url(Buffer.from(JSON.stringify(value)));
}

function base64Url(value) {
  return value.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function fetchSearchConsoleRows({ property, token, dateFrom, dateTo, rowLimit }) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: dateFrom,
      endDate: dateTo,
      type: "web",
      aggregationType: "byPage",
      dimensions: ["query", "page"],
      rowLimit,
    }),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Google Search Console query HTTP ${response.status}: ${text.slice(0, 300)}`);
  }

  const payload = text ? JSON.parse(text) : {};
  return (payload.rows || []).map((row) => {
    const [query, page] = row.keys || [];
    return {
      query: String(query || ""),
      page: String(page || ""),
      clicks: Math.round(Number(row.clicks) || 0),
      impressions: Math.round(Number(row.impressions) || 0),
      position: Math.round((Number(row.position) || 0) * 10) / 10,
    };
  }).filter((row) => row.query && row.page);
}

function queryMatches(query, mapping) {
  const normalized = normalizeText(query);
  return mapping.patterns.some((pattern) =>
    pattern.every((token) => normalized.includes(normalizeText(token))),
  );
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pageMatchesTarget(page, targetPath) {
  try {
    const pathname = new URL(page).pathname.replace(/\/+$/, "") || "/";
    const normalizedTarget = targetPath.replace(/\/+$/, "") || "/";
    return pathname === normalizedTarget || pathname.startsWith(`${normalizedTarget}/`);
  } catch {
    return page.includes(targetPath);
  }
}

function pageSummaries(rows, targetPath) {
  const pages = new Map();
  for (const row of rows) {
    pages.set(row.page, [...(pages.get(row.page) || []), row]);
  }
  return [...pages.entries()]
    .map(([page, pageRows]) => ({
      page,
      clicks: sum(pageRows, "clicks"),
      impressions: sum(pageRows, "impressions"),
      weightedAveragePosition: weightedAveragePosition(pageRows),
      target: pageMatchesTarget(page, targetPath),
    }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + row[key], 0);
}

function weightedAveragePosition(rows) {
  const impressions = sum(rows, "impressions");
  if (!impressions) return null;
  const weighted =
    rows.reduce((total, row) => total + row.position * row.impressions, 0) /
    impressions;
  return Math.round(weighted * 10) / 10;
}

function severityRank(severity) {
  return severity === "high" ? 3 : severity === "medium" ? 2 : 1;
}

function daysAgoIso(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}
