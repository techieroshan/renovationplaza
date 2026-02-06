import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEWSLETTER_URL = 'https://pages.rasa.io/newsbrief/b74efcba-ec5f-5f34-8baf-6321e400e9b6?';
const OUTPUT_DIR = path.join(__dirname, '../public/cache');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'latest.html');

async function cacheNewsletter() {
    console.log('🚀 Starting Weekly Newsletter Cache...');

    // Ensure cache directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set viewport to a reasonable desktop size
        await page.setViewport({ width: 1200, height: 800 });

        console.log(`not navigating to: ${NEWSLETTER_URL}`);
        await page.goto(NEWSLETTER_URL, {
            waitUntil: 'networkidle0', // Wait until network is quiet (SPA loaded)
            timeout: 60000
        });

        // Wait specifically for a sign of content
        try {
            await page.waitForSelector('img', { timeout: 10000 }); // Simple check for any image
        } catch (e) {
            console.warn('⚠️ Warning: Timeout waiting for specific selectors, but continuing with snapshot.');
        }

        // Get the fully rendered HTML
        // We inject a <base> tag so relative links (like /static/css) work if they point to rasa.io
        // actually, rasa.io relative links might break if we serve from localhost.
        // Let's rewrite relative links to absolute ones.

        let content = await page.content();

        // Basic heuristic to fix relative paths for a mirrored page
        // Replacing src="/ with src="https://pages.rasa.io/
        // Replacing href="/ with href="https://pages.rasa.io/

        content = content.replace(/src="\//g, 'src="https://pages.rasa.io/');
        content = content.replace(/href="\//g, 'href="https://pages.rasa.io/');

        // Write to file
        fs.writeFileSync(OUTPUT_FILE, content);
        console.log(`✅ Successfully cached newsletter to: ${OUTPUT_FILE}`);

        // Also create a timestamp file
        fs.writeFileSync(path.join(OUTPUT_DIR, 'meta.json'), JSON.stringify({
            lastUpdated: new Date().toISOString(),
            sourceUrl: NEWSLETTER_URL
        }, null, 2));

    } catch (error) {
        console.error('❌ Error caching newsletter:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

cacheNewsletter();
