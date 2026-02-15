import { chromium } from "playwright";

export interface CaptureResult {
  url: string;
  title: string;
  html: string;
  screenshot: Buffer;
  timestamp: string;
  pageInfo: {
    width: number;
    height: number;
    documentHeight: number;
    documentWidth: number;
  };
}

export default async function capturePage(targetUrl: string): Promise<CaptureResult> {
  console.log("🚀 Starting page capture...\n");

  let browser;
  try {
    // Step 1: Launch real browser
    console.log("📦 Step 1: Launching Chromium browser...");
    browser = await chromium.launch({
      headless: true,
    });
    console.log("✅ Browser launched\n");

    // Step 2: Create new page context
    console.log("📄 Step 2: Creating new page context...");
    const page = await browser.newPage();
    console.log("✅ Page context created\n");

    // Step 3: Navigate to URL and wait for full load
    console.log("🌐 Step 3: Navigating to URL and waiting for full load...");
    console.log(`   URL: ${targetUrl}`);
    
    await page.goto(targetUrl, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    console.log("✅ Page fully loaded\n");

    // Step 4: Wait for dynamic content to render
    console.log("⏳ Step 4: Waiting for dynamic content...");
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    console.log("✅ Dynamic content rendered\n");

    // Step 5: Capture visual state (screenshot)
    console.log("📸 Step 5: Capturing screenshot...");
    const screenshot = await page.screenshot({
      fullPage: true,
      type: "png",
    });
    console.log("✅ Screenshot captured\n");

    // Step 6: Extract rendered HTML
    console.log("📝 Step 6: Extracting rendered HTML...");
    const html = await page.content();
    console.log("✅ HTML extracted\n");

    // Step 7: Get page metadata
    console.log("📊 Step 7: Collecting page metadata...");
    const title = await page.title();
    const pageInfo = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      documentWidth: document.documentElement.scrollWidth,
    }));
    console.log("✅ Metadata collected\n");

    return {
      url: targetUrl,
      title,
      html,
      screenshot,
      timestamp: new Date().toISOString(),
      pageInfo,
    };

  } finally {
    if (browser) {
      console.log("🛑 Closing browser...");
      await browser.close();
      console.log("✅ Browser closed\n");
    }
  }
}