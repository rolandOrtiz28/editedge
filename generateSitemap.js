const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

// Define your base URL (change this to match your website)
const BASE_URL = "https://editedgemultimedia.com";

// List your static pages (add more if needed)
const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/services', changefreq: 'weekly', priority: 0.8 },
    { url: '/blogs', changefreq: 'weekly', priority: 0.7 },
    { url: '/pricing', changefreq: 'monthly', priority: 0.6 },
    { url: '/contact', changefreq: 'monthly', priority: 0.6 }
];

// Function to generate sitemap
async function generateSitemap() {
    const sitemapStream = new SitemapStream({ hostname: BASE_URL });

    staticPages.forEach(page => sitemapStream.write(page));

    sitemapStream.end();

    const sitemap = await streamToPromise(sitemapStream).then(sm => sm.toString());

    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap, 'utf8');
    
    console.log("✅ Sitemap generated successfully: /public/sitemap.xml");
}

// Generate the sitemap
generateSitemap().catch(console.error);
