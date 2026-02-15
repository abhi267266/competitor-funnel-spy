import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
console.log("✅ Browser launched!");
const page = await browser.newPage();
await page.goto("https://example.com");
console.log("✅ Navigated to", page.url());
await browser.close();