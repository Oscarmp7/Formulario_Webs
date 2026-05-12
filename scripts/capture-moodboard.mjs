import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "public", "moodboard");

const refs = [
    {
        id: "01-editorial-klim",
        name: "Klim Type Foundry",
        url: "https://klim.co.nz",
        lane: "editorial-premium",
        wait: 2500,
    },
    {
        id: "02-cinematic-buck",
        name: "Buck Co",
        url: "https://buck.co",
        lane: "cinematic-dark",
        wait: 3500,
    },
    {
        id: "03-tech-linear",
        name: "Linear",
        url: "https://linear.app",
        lane: "tech-precise",
        wait: 2500,
    },
    {
        id: "04-brutalist-borsche",
        name: "Bureau Borsche",
        url: "https://bureauborsche.com",
        lane: "brutalist-elegant",
        wait: 2500,
    },
    {
        id: "05-consumer-aesop",
        name: "Aesop",
        url: "https://www.aesop.com",
        lane: "consumer-warm",
        wait: 2500,
    },
    {
        id: "06-minimal-apple",
        name: "Apple Vision Pro",
        url: "https://www.apple.com/apple-vision-pro/",
        lane: "minimal-apple",
        wait: 3500,
    },
];

const VIEWPORT = { width: 1440, height: 900 };

async function captureAll() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: 2,
        userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
        locale: "en-US",
    });

    for (const ref of refs) {
        console.log(`[capturing] ${ref.id} — ${ref.name}`);
        const page = await context.newPage();
        try {
            await page.goto(ref.url, {
                waitUntil: "networkidle",
                timeout: 45000,
            });
            await page.waitForTimeout(ref.wait);

            // Try to dismiss common cookie/consent banners by clicking accept-like buttons
            try {
                const dismissSelectors = [
                    'button:has-text("Accept")',
                    'button:has-text("Aceptar")',
                    'button:has-text("I agree")',
                    'button:has-text("Got it")',
                    'button:has-text("Allow all")',
                    'button:has-text("Close")',
                    "#onetrust-accept-btn-handler",
                    "[data-accept-cookies]",
                ];
                for (const sel of dismissSelectors) {
                    const btn = page.locator(sel).first();
                    if (await btn.isVisible({ timeout: 500 }).catch(() => false)) {
                        await btn.click({ timeout: 1500 }).catch(() => {});
                        await page.waitForTimeout(800);
                        break;
                    }
                }
            } catch {}

            // Scroll a tiny bit to reveal content past sticky cookies if any leftover
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
            await page.waitForTimeout(500);

            const outFile = path.join(outDir, `${ref.id}.jpg`);
            await page.screenshot({
                path: outFile,
                fullPage: false,
                type: "jpeg",
                quality: 88,
            });
            console.log(`  ✓ ${outFile}`);
        } catch (err) {
            console.error(`  ✗ ${ref.name}: ${err.message}`);
        } finally {
            await page.close();
        }
    }

    await browser.close();
}

captureAll()
    .then(() => {
        console.log("Done.");
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
