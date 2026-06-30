# SEO/GEO Visibility Loop - 2026-07-01

## Inputs

- Studentjobs Groningen SEO/GEO toolkit from `D:\GitHub\studentjobs\studentjobsgroningen`
- Ahrefs export from `reports/ahrefs_report_010702026/domakin_29-jun-2026_all-issues_2026-06-30_23-59-19`
- Existing Domakin SEO scripts in `scripts/seo/`
- Guardrail: no edits under `services/viewing/`

## Baseline

| Check | Result |
| --- | --- |
| `node scripts/seo/domakin-geo-query-benchmark.mjs --out reports/seo/domakin-geo-query-loop-baseline-2026-07-01.json` | Passed, 0 high-impact findings |
| `node scripts/seo/local-crawl-benchmark.mjs http://localhost:3011` | Passed |
| `node scripts/seo/service-geo-benchmark.mjs http://localhost:3011` | Failed only `/services/viewing`, excluded by guardrail |
| `node scripts/seo/domakin-gsc-benchmark.mjs --dotenv-file .env.local --out reports/seo/domakin-gsc-loop-baseline-2026-07-01.json` | Blocked by missing GSC service-account credentials |
| Existing `reports/seo/gsc-live-production-orange-final.json` | 0 high-impact gaps; medium gaps for student finance, BSN, and rent allowance queries |

## Ahrefs Gap Ranking

| Rank | Gap | Evidence | Impact | Decision |
| --- | --- | --- | --- | --- |
| 1 | Structured data schema.org validation errors | 350 rows in `Notice-Structured_data_has_schema.org_validation_error.csv`, starting with `/services/renting` | High | Fixed rental schemas outside viewing scope |
| 2 | Indexable H1 missing or empty | 141 rows in `Warning-indexable-H1_tag_missing_or_empty.csv` | Medium | Deferred; many are legacy/localized pages outside priority query set |
| 3 | 5XX in sitemap | 24 rows in `Error-5XX_page_in_sitemap.csv` | High if current | Current local/live checks returned 200 for priority URLs; treated as stale/transient |
| 4 | Hreflang to non-canonical | 104 rows in `Error-Hreflang_to_non-canonical.csv`, led by `/services/viewing` | Medium | Deferred by `services/viewing/` guardrail |
| 5 | Broken `/blog/[slug]` links | 17 rows in `Error-indexable-Page_has_links_to_broken_page.csv` | Medium if current | Current rendered pages did not expose a literal `/blog/[slug]` href; treated as stale crawler artifact |
| 6 | Short titles and meta descriptions | 24 title rows, 6 meta description rows | Low to medium | Deferred after higher-impact schema issue |

## Fix

Updated rental JSON-LD so offer-bearing rental entities keep the `Accommodation` signal while also declaring `Product`, with `brand`, canonical offer `url`, and Domakin `seller` identity. Removed the unsupported rental detail `keywords` field from the JSON-LD object.

Added `scripts/seo/rental-schema-validation.mjs` as a focused regression check for the structured-data issue.

## Rerun

| Check | Result |
| --- | --- |
| `node scripts/seo/rental-schema-validation.mjs http://localhost:3011` | Passed |
| `node scripts/seo/local-crawl-benchmark.mjs http://localhost:3011` | Passed |
| `node scripts/seo/domakin-geo-query-benchmark.mjs --out reports/seo/domakin-geo-query-loop-after-schema-2026-07-01.json` | Passed, 0 high-impact findings |
| `node scripts/seo/service-geo-benchmark.mjs http://localhost:3011` | Failed only `/services/viewing`, excluded by guardrail |
| `npm run build` | Passed with existing Node `punycode` deprecation warnings |

## Status

No high-impact crawl/query gap remains outside the explicit `services/viewing/` exclusion. GSC live rerun could not be performed without service-account credentials, but the existing production GSC report has 0 high-impact gaps.

## Loop 2 - Groningen GSC Credentials And Blog Timeout Fix

After the user clarified that the credentials and tooling are in `D:\GitHub\studentjobs\studentjobsgroningen`, I reran the loop with that folder's Search Console credentials and SEO tools.

### Additional Inputs

- `D:\GitHub\studentjobs\studentjobsgroningen\.env` for Google Search Console service-account credentials. Secret values were not printed.
- Live blog crawl from `https://www.domakin.nl/blog` and sitemap URLs from `https://www.domakin.nl/sitemap.xml`.
- Ahrefs slow-page and 5XX sitemap exports from `reports/ahrefs_report_010702026/domakin_29-jun-2026_all-issues_2026-06-30_23-59-19`.

### Updated Gap Ranking

| Rank | Gap | Evidence | Impact | Decision |
| --- | --- | --- | --- | --- |
| 1 | Blog article SSR timeouts and 5XX pages in sitemap | Ahrefs `Error-5XX_page_in_sitemap.csv` had 24 rows, led by `/blog/bsn-nummer-id-nederland`; live `curl -I` reproduced `504 FUNCTION_INVOCATION_TIMEOUT`; Ahrefs `Warning-Slow_page.csv` had 72 rows and many blog TTFBs above 8-15s | Critical | Fixed `/blog/[slug]` to avoid the slow per-slug API path for priority answer pages and to use the faster all-posts endpoint for normal lookup |
| 2 | Redirected legacy blog aliases still emitted in sitemap | `/blog/bsn-number-id-netherlands` and `/blog/rent-allowance-netherlands` redirected but were still included in generated sitemap output | High | Updated sitemap generation to exclude those redirect aliases; regenerated `public/sitemap.xml` |
| 3 | Medium GSC ranking gaps for answer-ready blog pages | Groningen-credential GSC run: BSN target page position 14.9, rent allowance 18.5, student finance 13.4; 0 high-impact gaps | Medium | Content expansion and internal-link work recommended, no blocker for this loop |
| 4 | `/services/viewing` service GEO benchmark failure | `node scripts/seo/service-geo-benchmark.mjs http://localhost:3011` fails only `/services/viewing` | Excluded | Not touched per explicit guardrail |

### Fix

- `src/pages/blog/[slug].tsx` now serves the three priority answer-ready fallback pages before calling the blog API, preventing Search Console priority pages from depending on the slow upstream slug endpoint.
- Non-fallback blog articles now use `fetchBlogPosts()` once and find the article locally, which keeps related-post data and avoids the per-slug API timeout path.
- `src/services/api.ts` now uses a shorter configurable blog API timeout via `SERVER_API_TIMEOUT_MS`, defaulting to 8000ms.
- `scripts/generate-sitemap.js` now excludes the redirected legacy blog aliases `bsn-number-id-netherlands` and `rent-allowance-netherlands`.
- `public/sitemap.xml` was regenerated and now contains 147 URLs with no redirected BSN/rent-allowance aliases.

### Rerun

| Check | Result |
| --- | --- |
| `node scripts/seo/local-crawl-benchmark.mjs http://localhost:3011` | Passed; priority blog pages 200, answer-first, cited, canonical, structured, and internally linked |
| `node scripts/seo/rental-schema-validation.mjs http://localhost:3011` | Passed |
| `node scripts/seo/domakin-geo-query-benchmark.mjs --out reports/seo/domakin-geo-query-loop-after-blog-timeout-2026-07-01.json` | Passed, 0 high-impact findings |
| `node scripts/seo/domakin-gsc-benchmark.mjs --dotenv-file D:\GitHub\studentjobs\studentjobsgroningen\.env --property sc-domain:domakin.nl --out reports/seo/domakin-gsc-loop-after-blog-timeout-2026-07-01.json` | 0 high-impact gaps; 3 medium ranking gaps; 1701 rows fetched |
| `node scripts/seo/service-geo-benchmark.mjs http://localhost:3011` | Failed only `/services/viewing`, excluded by guardrail |

### StudentJobs Groningen Tool Run

| Tool | Result |
| --- | --- |
| `npm run geo-query-benchmark:self-test` | Passed |
| `npm run search-console-query-benchmark:self-test` | Passed |
| `npm run seo-agent:self-test` | Passed |
| `npx tsx scripts/geo-query-benchmark.ts --out=...studentjobsgroningen-geo-query-tool-2026-07-01.json` | 10 mappings, 0 findings |
| `npx tsx scripts/search-console-query-benchmark.ts --date-from 2026-06-16 --date-to 2026-06-29 --out ...studentjobsgroningen-search-console-tool-2026-07-01.json` | 21 sites, 4193 rows, 1 high Groningen-network finding: `student jobs Groningen English` receives 190 impressions but none on `/english-speaking-student-jobs` |
| `npx tsx scripts/seo-agent/geo-evidence.ts --json --history-dir=...reports\seo --out=...studentjobsgroningen-geo-evidence-2026-07-01.json` | Passed |
| `npm run audit:seo-data` | Passed; Groningen has 6 blogs, 186 active public jobs, and 0 Groningen blog/job SEO findings; only 3 Delft job-region term findings |

### Updated Status

No critical technical issue remains outside the explicit `services/viewing/` exclusion. Every Domakin priority query maps to an answer-ready page, the rerun query benchmark has 0 high-impact findings, and the Groningen-credential GSC benchmark has 0 high-impact gaps.
