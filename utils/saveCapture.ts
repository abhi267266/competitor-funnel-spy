import * as fs from "fs";
import * as path from "path";
import type { CaptureResult } from "./capturePage.ts";

export interface SavedFiles {
  screenshot: string;
  html: string;
  metadata: string;
  domainFolder: string;
}

function extractDomain(urlString: string): string {
  try {
    const url = new URL(urlString);
    // Get domain without protocol, remove www. if present
    let domain = url.hostname;
    if (domain.startsWith("www.")) {
      domain = domain.slice(4);
    }
    return domain;
  } catch {
    return "unknown-domain";
  }
}

export async function saveCapture(
  result: CaptureResult,
  outputDir: string = "./captures"
): Promise<SavedFiles> {
  console.log("💾 Saving capture files...\n");

  // Extract domain from URL
  const domain = extractDomain(result.url);
  const domainFolder = path.join(outputDir, domain);

  // Create domain-specific directory if it doesn't exist
  if (!fs.existsSync(domainFolder)) {
    fs.mkdirSync(domainFolder, { recursive: true });
    console.log(`📁 Created domain folder: ${domainFolder}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("Z")[0];
  const baseFileName = `capture-${timestamp}`;

  // Save screenshot
  const screenshotPath = path.join(domainFolder, `${baseFileName}.png`);
  fs.writeFileSync(screenshotPath, result.screenshot);
  console.log(`📸 Screenshot saved: ${screenshotPath}`);

  // Save HTML
  const htmlPath = path.join(domainFolder, `${baseFileName}.html`);
  fs.writeFileSync(htmlPath, result.html, "utf-8");
  console.log(`📝 HTML saved: ${htmlPath}`);

  // Save metadata as JSON
  const metadataPath = path.join(domainFolder, `${baseFileName}-metadata.json`);
  const metadata = {
    url: result.url,
    title: result.title,
    timestamp: result.timestamp,
    domain: domain,
    pageInfo: result.pageInfo,
    files: {
      screenshot: path.basename(screenshotPath),
      html: path.basename(htmlPath),
    },
  };
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`📊 Metadata saved: ${metadataPath}\n`);

  return {
    screenshot: screenshotPath,
    html: htmlPath,
    metadata: metadataPath,
    domainFolder: domainFolder,
  };
}

export function displayResults(result: CaptureResult) {
  console.log("═".repeat(50));
  console.log("CAPTURE RESULTS");
  console.log("═".repeat(50) + "\n");
  console.log(`📌 URL: ${result.url}`);
  console.log(`📋 Title: ${result.title}`);
  console.log(`⏱️  Timestamp: ${result.timestamp}`);
  console.log(`📐 Page Dimensions:`);
  console.log(`   - Viewport: ${result.pageInfo.width}x${result.pageInfo.height}px`);
  console.log(
    `   - Document: ${result.pageInfo.documentWidth}x${result.pageInfo.documentHeight}px`
  );
  console.log(`📊 HTML Size: ${result.html.length} characters\n`);
}