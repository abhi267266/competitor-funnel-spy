import capturePage from "./utils/capturePage.ts";
import { saveCapture, displayResults } from "./utils/saveCapture.ts";

function printUsage() {
  console.log("\n" + "═".repeat(50));
  console.log("PAGE CAPTURE & HTML EXTRACTION");
  console.log("═".repeat(50));
  console.log("\nUsage:");
  console.log("  bun run index.ts <url>");
  console.log("\nExamples:");
  console.log("  bun run index.ts https://example.com");
  console.log("  bun run index.ts https://google.com");
  console.log("  bun run index.ts https://github.com\n");
  console.log("═".repeat(50) + "\n");
}

function parseArguments(): string {
  const args = process.argv.slice(2); // Remove 'bun' and script name

  if (args.length === 0) {
    console.error("❌ Error: No URL provided!\n");
    printUsage();
    process.exit(1);
  }

  const targetUrl = args[0];

  // Validate URL format
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    console.error("❌ Error: URL must start with http:// or https://\n");
    console.error(`You provided: ${targetUrl}\n`);
    printUsage();
    process.exit(1);
  }

  // Try to parse as valid URL
  try {
    new URL(targetUrl);
  } catch {
    console.error("❌ Error: Invalid URL format!\n");
    console.error(`You provided: ${targetUrl}\n`);
    printUsage();
    process.exit(1);
  }

  return targetUrl;
}

async function main() {
  try {
    // Parse and validate URL from arguments
    const targetUrl = parseArguments();

    console.log("═".repeat(50));
    console.log("PAGE CAPTURE & HTML EXTRACTION");
    console.log("═".repeat(50) + "\n");

    console.log(`🎯 Target URL: ${targetUrl}\n`);

    // Capture the page
    const captureResult = await capturePage(targetUrl);

    // Display results
    displayResults(captureResult);

     // Save files
    const savedFiles = await saveCapture(captureResult);

    console.log("═".repeat(50));
    console.log("✅ CAPTURE COMPLETE!");
    console.log("═".repeat(50) + "\n");
    console.log(`📁 Domain folder: ${savedFiles.domainFolder}`);
    console.log("\nFiles saved:");
    console.log(`  • Screenshot: ${savedFiles.screenshot}`);
    console.log(`  • HTML: ${savedFiles.html}`);
    console.log(`  • Metadata: ${savedFiles.metadata}\n`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
