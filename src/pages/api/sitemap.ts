import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Set content type for XML
    res.setHeader('Content-Type', 'application/xml');
    
    // Paths to sitemap files
    const generatedSitemapPath = path.join(process.cwd(), 'public', 'sitemap-generated.xml');
    const fallbackSitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    // Check if generated sitemap exists
    if (fs.existsSync(generatedSitemapPath)) {
      console.log('📋 Serving sitemap-generated.xml');
      const sitemap = fs.readFileSync(generatedSitemapPath, 'utf8');
      res.status(200).send(sitemap);
      return;
    }
    
    // Fallback to static sitemap
    if (fs.existsSync(fallbackSitemapPath)) {
      console.log('📋 Serving fallback sitemap.xml');
      const sitemap = fs.readFileSync(fallbackSitemapPath, 'utf8');
      res.status(200).send(sitemap);
      return;
    }
    
    // If no sitemap exists, return 404
    console.log('❌ No sitemap found');
    res.status(404).send('Sitemap not found');
    
  } catch (error) {
    console.error('❌ Error serving sitemap:', error);
    res.status(500).send('Internal server error');
  }
}
