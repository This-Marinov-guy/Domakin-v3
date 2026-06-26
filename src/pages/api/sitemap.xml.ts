import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    const sitemap = fs.readFileSync(sitemapPath, "utf8");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error serving sitemap.xml:", error);
    res.status(404).send("Sitemap not found");
  }
}
