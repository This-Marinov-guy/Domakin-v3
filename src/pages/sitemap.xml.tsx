import { fetchAllWordPressPostSummaries } from "@/lib/wordpress";
import type { GetServerSideProps } from "next";

const SITE_URL = "https://www.domakin.nl";
const TODAY = "2026-06-26";

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

const stableEntries: SitemapEntry[] = [
  { path: "", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services/renting", changefreq: "daily", priority: "0.9" },
  { path: "/services/room-searching", changefreq: "monthly", priority: "0.8" },
  { path: "/services/viewing", changefreq: "monthly", priority: "0.8" },
  { path: "/services/add-listing", changefreq: "monthly", priority: "0.7" },
  { path: "/pricing", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.7" },
  { path: "/agents", changefreq: "monthly", priority: "0.5" },
  { path: "/our-recommendations", changefreq: "monthly", priority: "0.6" },
  { path: "/support-us", changefreq: "monthly", priority: "0.4" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/terms&policy", changefreq: "yearly", priority: "0.2" },
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

const entryXml = ({ path, lastmod = TODAY, changefreq, priority }: SitemapEntry) => {
  const loc = absoluteUrl(path);

  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
};

const sitemapXml = (entries: SitemapEntry[]) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(entryXml),
    "</urlset>",
  ].join("\n");

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = await fetchAllWordPressPostSummaries();
  const blogEntries = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.modified ?? post.date,
    changefreq: "weekly" as const,
    priority: "0.7",
  }));

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(sitemapXml([...stableEntries, ...blogEntries]));
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
