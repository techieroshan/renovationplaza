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

        console.log(`Navigating to: ${NEWSLETTER_URL}`);
        await page.goto(NEWSLETTER_URL, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Wait specifically for a sign of articles
        try {
            console.log('Waiting for articles to appear...');
            // Check for potential selectors
            await Promise.race([
                page.waitForSelector('a[href*="PostID"]', { timeout: 45000 }),
                page.waitForSelector('.rasa-article', { timeout: 45000 }),
                page.waitForSelector('tbody:has(a)', { timeout: 45000 })
            ]);

            console.log('Articles found! Waiting for final settle...');
            await new Promise(r => setTimeout(r, 10000)); // Longer settle time
        } catch (e) {
            console.error('❌ Error: Timeout waiting for articles. Aborting to avoid saving empty cache.');
            process.exit(1);
        }

        // Final check: if the content is too small, something is wrong
        let content = await page.content();
        if (content.length < 10000) {
            console.error('❌ Error: Captured content is too small. Aborting.');
            process.exit(1);
        }

        // Basic heuristic to fix relative paths for a mirrored page
        content = content.replace(/src="\//g, 'src="https://pages.rasa.io/');
        content = content.replace(/href="\//g, 'href="https://pages.rasa.io/');

        // REMOVE SCRIPTS to prevent the SPA from trying to re-initialize or redirect
        // This makes the cached page truly static
        content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

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
