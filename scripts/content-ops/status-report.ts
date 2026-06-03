import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { OPS_DIR } from "./shared";

const reportPath = join(OPS_DIR, "status-report.md");

if (!existsSync(reportPath)) {
  console.error("No content ops report found. Run npm run content-ops:audit first.");
  process.exit(1);
}

console.log(readFileSync(reportPath, "utf8"));
