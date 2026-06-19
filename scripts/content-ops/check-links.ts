import { appendFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { OPS_DIR, writeJson } from "./shared";

/**
 * Checks every source URL in content/ops/source-registry.json.
 *
 * - HEAD request first, falling back to GET on 405.
 * - 10s timeout per request, ~8 concurrent requests.
 * - 2xx/3xx responses count as OK (fetch follows redirects, so a final
 *   status < 400 means the link resolves).
 *
 * Outputs:
 * - content/ops/link-check-report.json (full results)
 * - content/ops/link-check-report.md   (appended markdown summary of broken links)
 *
 * Run with: npm run content-ops:links
 */

interface SourceEntry {
  content_item_id?: string;
  source_url?: string;
}

interface LinkResult {
  url: string;
  ok: boolean;
  status: number | null;
  method: "HEAD" | "GET";
  error: string | null;
  content_item_ids: string[];
}

const TIMEOUT_MS = 10_000;
const CONCURRENCY = 8;

const registryPath = join(OPS_DIR, "source-registry.json");
if (!existsSync(registryPath)) {
  console.error(`No source registry found at ${registryPath}. Run npm run content-ops:audit first.`);
  process.exit(1);
}

const registry = JSON.parse(readFileSync(registryPath, "utf8")) as { sources?: SourceEntry[] };
const urlToItems = new Map<string, Set<string>>();

for (const source of registry.sources ?? []) {
  const url = source.source_url;
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) continue;
  const items = urlToItems.get(url) ?? new Set<string>();
  if (source.content_item_id) items.add(source.content_item_id);
  urlToItems.set(url, items);
}

const urls = Array.from(urlToItems.keys()).sort();
console.log(`Checking ${urls.length} unique URLs (concurrency ${CONCURRENCY}, timeout ${TIMEOUT_MS / 1000}s)...`);

async function request(url: string, method: "HEAD" | "GET") {
  return fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      "user-agent": "AdventureWalesLinkChecker/1.0 (+content-ops nightly link audit)",
      accept: "*/*",
    },
  });
}

async function checkUrl(url: string): Promise<LinkResult> {
  const contentItemIds = Array.from(urlToItems.get(url) ?? []).sort();
  let method: "HEAD" | "GET" = "HEAD";
  try {
    let response = await request(url, "HEAD");
    if (response.status === 405) {
      method = "GET";
      response = await request(url, "GET");
    }
    return {
      url,
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      method,
      error: null,
      content_item_ids: contentItemIds,
    };
  } catch (error) {
    const message = error instanceof Error ? (error.name === "TimeoutError" ? `timeout after ${TIMEOUT_MS / 1000}s` : error.message) : String(error);
    return { url, ok: false, status: null, method, error: message, content_item_ids: contentItemIds };
  }
}

async function run() {
  const results: LinkResult[] = new Array(urls.length);
  let nextIndex = 0;
  let completed = 0;

  async function worker() {
    while (nextIndex < urls.length) {
      const index = nextIndex++;
      results[index] = await checkUrl(urls[index]);
      completed += 1;
      if (completed % 50 === 0) console.log(`  ${completed}/${urls.length} checked...`);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker()));

  const broken = results.filter((result) => !result.ok);
  const generatedAt = new Date().toISOString();

  writeJson(join(OPS_DIR, "link-check-report.json"), {
    generatedAt,
    total: results.length,
    ok: results.length - broken.length,
    broken: broken.length,
    results,
  });

  const markdownPath = join(OPS_DIR, "link-check-report.md");
  if (!existsSync(markdownPath)) {
    writeFileSync(markdownPath, "# Link Check Report\n", "utf8");
  }

  const section = [
    "",
    `## Run ${generatedAt}`,
    "",
    `Checked ${results.length} unique URLs — ${results.length - broken.length} OK, ${broken.length} broken.`,
    "",
    broken.length === 0
      ? "No broken links found."
      : [
          "| URL | Status | Error | Content items |",
          "| --- | --- | --- | --- |",
          ...broken.map((result) =>
            `| ${result.url} | ${result.status ?? "-"} | ${(result.error ?? "-").replace(/\|/g, "\\|")} | ${result.content_item_ids.join(", ") || "-"} |`,
          ),
        ].join("\n"),
    "",
  ].join("\n");

  appendFileSync(markdownPath, section, "utf8");

  console.log(`Link check complete: ${results.length - broken.length}/${results.length} OK, ${broken.length} broken.`);
  console.log(`Report: ${join(OPS_DIR, "link-check-report.json")}`);
  console.log(`Summary: ${markdownPath}`);
}

run().catch((error) => {
  console.error("Link check failed:", error);
  process.exit(1);
});
