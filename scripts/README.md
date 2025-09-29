# Sitemap Generator

This script generates a comprehensive XML sitemap for your Domakin website, including both static pages and dynamic content from your API endpoints.

## 🚀 Quick Start

1. **Configure your API endpoints** in `sitemap-config.js`
2. **Run the generator**:
   ```bash
   node scripts/generate-sitemap.js
   ```
3. **Submit to Google Search Console**:
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add sitemap: `https://www.domakin.nl/api/sitemap` (auto-serves best available)
   - Or directly: `https://www.domakin.nl/sitemap.xml`

## ⚙️ Configuration

### Update `sitemap-config.js`

```javascript
module.exports = {
  // Your API base URL - update this with your actual server URL
  apiBaseUrl: 'https://your-api-domain.com',
  
  // API endpoints - these should match your actual API routes
  endpoints: {
    blogPosts: '/api/blog/posts',
    properties: '/api/property/listing'
  },
  
  // ... other configuration
};
```

### Environment Variables

You can also set the API base URL using environment variables:

```bash
# Set your API base URL
export SERVER_ENDPOINT=https://your-api-domain.com

# Run the generator
node scripts/generate-sitemap.js
```

## 📊 What Gets Included

### Static Pages
- Homepage (priority 1.0)
- About, Services, Contact (priority 0.8)
- Blog listing (priority 0.9)
- Terms & Policy (priority 0.3)

### Dynamic Content
- **Blog Posts**: Fetched from `/api/blog/posts`
  - Only posts with slugs are included
  - Priority: 0.6, Change frequency: monthly
  - URLs: `/blog/{slug}`

- **Properties**: Fetched from `/api/property/listing`
  - Only visible properties (not hidden)
  - Priority: 0.7, Change frequency: weekly
  - URLs: `/services/renting/property/{id}-{location}-{title}`
  - SEO-friendly format with ID, location, and title
  - Missing parts are omitted (e.g., `1001-amsterdam` if no title)

## 🔧 Customization

### Adding More Static Pages

Edit the `staticPages` array in `generate-sitemap.js`:

```javascript
const staticPages = [
  {
    url: '/your-new-page',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  // ... existing pages
];
```

### Modifying Priorities

Update `sitemap-config.js`:

```javascript
priorities: {
  homepage: '1.0',
  mainPages: '0.8',
  blogPosts: '0.6',  // Change this
  properties: '0.7', // Change this
  // ...
}
```

### Custom URL Generation

The script generates SEO-friendly property URLs:
```
/services/renting/property/{id}-{location}-{title} -> /services/renting/property/1001-amsterdam-modern-apartment
```

Missing parts are omitted:
- `1001-amsterdam` (no title)
- `1001-modern-apartment` (no location)
- `1001` (no location or title)

The property is always fetched by ID (first part of the URL).

## 📁 Output Files

- **`sitemap.xml`**: Primary sitemap with all URLs (static + dynamic + API data)
- **`sitemap.xml`**: Fallback static sitemap
- **`sitemap-index.xml`**: Sitemap index referencing all sitemaps
- **`/api/sitemap`**: Smart API endpoint that serves the best available sitemap

## 🐛 Troubleshooting

### API Connection Issues

1. **Check your API base URL** in `sitemap-config.js`
2. **Verify endpoint paths** match your actual API routes
3. **Test API endpoints** manually:
   ```bash
   curl https://your-api-domain.com/api/blog/posts
   curl https://your-api-domain.com/api/property/listing
   ```

### No Data Found

- Check if your API returns data in the expected format:
  ```json
  {
    "status": true,
    "data": [
      {
        "slug": "post-slug",
        "title": "Post Title",
        "modified": "2024-12-19"
      }
    ]
  }
  ```

### Large Sitemaps

If you have more than 50,000 URLs, the script will automatically split into multiple sitemaps.

## 🔄 Automation

### Cron Job (Linux/Mac)

```bash
# Add to crontab to run daily at 2 AM
0 2 * * * cd /path/to/domakin-v3 && node scripts/generate-sitemap.js
```

### GitHub Actions

```yaml
name: Generate Sitemap
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  generate-sitemap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: node scripts/generate-sitemap.js
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/sitemap.xml
          git commit -m "Update sitemap" || exit 0
          git push
```

## 📈 SEO Benefits

- **Complete Coverage**: All pages indexed by search engines
- **Fresh Content**: Dynamic sitemap updates with new content
- **Proper Priorities**: Search engines understand page importance
- **Change Frequency**: Helps search engines know how often to crawl
- **Last Modified**: Shows when content was last updated

## 🎯 Next Steps

1. **Submit to Google Search Console**:
   - Primary: `https://www.domakin.nl/api/sitemap` (smart fallback)
   - Direct: `https://www.domakin.nl/sitemap.xml`
2. **Monitor indexing status**
3. **Set up automated generation**
4. **Track search performance**
5. **Optimize based on data**

## 🔄 Sitemap Priority System

The project uses a smart sitemap serving system:

1. **Primary**: `sitemap.xml` (includes all content)
2. **Fallback**: `sitemap.xml` (static content only)
3. **API Route**: `/api/sitemap` (automatically serves the best available)
4. **Index**: `sitemap-index.xml` (references all sitemaps)

This ensures Google always gets the most comprehensive sitemap available.

---

**Need help?** Check the console output for detailed error messages and API response information.
