# Domakin Blog SEO/GEO Opportunities - 2026-07-01

## Current Findings

`https://www.domakin.nl/blog` exposes 37 article URLs in the live sitemap. The live blog index returns 200 and includes Blog, BlogPosting, BreadcrumbList, ImageObject, Organization, and Person JSON-LD, but its meta description is short.

The highest-impact live issue was not a content gap; it was article availability. Ahrefs reported 24 `5XX page in sitemap` rows, led by `https://www.domakin.nl/blog/bsn-nummer-id-nederland` with 99 organic traffic. A fresh live header check reproduced a 504 with Vercel `FUNCTION_INVOCATION_TIMEOUT`. Ahrefs also reported 72 slow pages, with many blog articles in the 8-15s TTFB/loading-time range.

The fix in this branch makes the three priority GSC pages answer-ready without waiting on the slow per-slug API path:

- `/blog/bsn-nummer-id-nederland`
- `/blog/rent-allowance-netherlands-2026`
- `/blog/student-finance-netherlands-2026`

The same rerun also removes redirected legacy aliases from the sitemap:

- `/blog/bsn-number-id-netherlands`
- `/blog/rent-allowance-netherlands`

## Priority Improvements

| Priority | Page | Why | Suggested Improvement |
| --- | --- | --- | --- |
| 1 | `/blog/bsn-nummer-id-nederland` | GSC target impressions 2569, average target position 14.9; Ahrefs listed the page as the top 504 sitemap issue | Expand with RNI vs resident registration, city appointment steps, document checklist, DigiD follow-up, and municipality citations for Groningen, Amsterdam, Rotterdam, Utrecht, and Eindhoven |
| 2 | `/blog/rent-allowance-netherlands-2026` | GSC target impressions 361, average target position 18.5 | Add an eligibility checklist, independent-accommodation examples, service-cost breakdown, age/rent thresholds, student rejection reasons, and official Belastingdienst citations |
| 3 | `/blog/student-finance-netherlands-2026` | GSC target impressions 74, average target position 13.4 | Add EU/EEA work-hour scenarios, DUO grant/loan/repayment sections, BSN/DigiD/eIDAS prerequisites, application timeline, and official DUO citations |
| 4 | Blog index | Live crawl only found a 56-character meta description | Add a stronger, intent-matched meta description for international students looking for housing, BSN, rent allowance, student finance, and moving guidance |
| 5 | Blog network internal links | Ahrefs slow-page rows show several high-value articles with 0-1 inlinks | Add contextual links from city/job/housing posts into BSN, rent allowance, student finance, housing scam, and WhatsApp housing group pages |
| 6 | YMYL source citations | Money, benefits, ID, registration, and insurance posts need extra trust signals for AI answer engines | Add short source blocks and FAQ schema to each finance/registration article, using official government/municipality/DUO/Belastingdienst sources |

## Future High-Impact Blog Topics

1. DigiD for international students in the Netherlands: how to apply after BSN, what works without Dutch ID, and what to do before arrival.
2. RNI registration vs resident registration in the Netherlands: which one students need, how to book, and how it affects BSN.
3. Housing allowance checklist for international students in 2026: eligibility, rent limits, independent living space, and common rejection reasons.
4. Municipality registration appointments by city: Groningen, Amsterdam, Rotterdam, Utrecht, Eindhoven, Maastricht, Delft, and Enschede.
5. Dutch health insurance when working as an international student: when it becomes mandatory and how zorgtoeslag fits.
6. Rental scam checklist for the Netherlands: deposit, contract, viewing, landlord identity, payment safety, and red flags.
7. Rental contract types in the Netherlands for students: fixed term, indefinite, hospita, sublet, campus contract, and short-stay.
8. Proof of income and guarantor letters for student housing in the Netherlands: what landlords ask for and how internationals can prepare.
9. Short-stay vs long-stay student housing in the Netherlands: tradeoffs, registration risks, cost, and when to switch.
10. Service costs, utilities, energy label, and internet in Dutch rentals: what is normal, what is negotiable, and what to check before signing.

## Content Pattern To Use

Each priority blog should open with a direct answer in the first 80-120 words, then a checklist, source-backed details, city-specific variations, FAQ schema, and links to the relevant Domakin service or housing guide. This is the pattern most aligned with both search snippets and AI answer-engine extraction.
