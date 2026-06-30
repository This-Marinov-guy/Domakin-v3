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
