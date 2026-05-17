/** Minimal CSV parser — no external deps, handles quotes properly */
export function readCsv(text: string): Record<string, string>[] {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === '\n' && !inQuotes) {
      if (current.trim()) lines.push(current);
      current = '';
    } else if (ch === '\r' && !inQuotes) {
      // skip CR
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);

  if (lines.length < 2) return [];

  const headers = parseLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return rows;
}

function parseLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  values.push(current.trim());
  return values;
}

/** Read a CSV file (supports CRLF and LF) */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'content');

export function readCsvFile(relativePath: string): Record<string, string>[] {
  const fullPath = join(CONTENT_DIR, relativePath);
  if (!existsSync(fullPath)) {
    console.error(`  ⚠ File not found: ${fullPath}`);
    return [];
  }
  const content = readFileSync(fullPath, 'utf-8');
  return readCsv(content);
}

/** Read multiple CSV files from a glob-like directory */
import { readdirSync, statSync } from 'fs';

export function readCsvDir(dir: string): { file: string; rows: Record<string, string>[] }[] {
  const fullPath = join(CONTENT_DIR, dir);
  if (!existsSync(fullPath)) {
    console.error(`  ⚠ Directory not found: ${fullPath}`);
    return [];
  }

  const results: { file: string; rows: Record<string, string>[] }[] = [];
  const files = readdirSync(fullPath);

  for (const file of files) {
    if (!file.endsWith('.csv')) continue;
    const filePath = join(fullPath, file);
    if (statSync(filePath).isDirectory()) continue;
    const rows = readCsvFile(join(dir, file));
    if (rows.length > 0) results.push({ file, rows });
  }

  return results;
}
