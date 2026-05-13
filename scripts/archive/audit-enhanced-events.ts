#!/usr/bin/env npx tsx
/**
 * Audit script for enhanced event JSON files
 * Checks: coordinates, heroImage, description length, 2026 dates, category, website
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const ENHANCED_DIR = join(__dirname, '../data/events/enhanced');

interface AuditResult {
  file: string;
  slug: string;
  name: string;
  issues: string[];
  warnings: string[];
  category: string | null;
  hasCoordinates: boolean;
  hasHeroImage: boolean;
  heroImageSource: string | null;
  descriptionWords: number;
  has2026Dates: boolean;
  hasWebsite: boolean;
  websiteUrl: string | null;
}

async function countWords(text: string): Promise<number> {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

async function auditFile(filePath: string): Promise<AuditResult> {
  const content = await readFile(filePath, 'utf-8');
  const data = JSON.parse(content);
  const fileName = filePath.split('/').pop() || '';
  
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Check coordinates (can be at multiple locations)
  const hasCoordinates = !!(
    (data.location?.coordinates?.lat && data.location?.coordinates?.lng) ||
    (data.location?.start?.coordinates?.lat && data.location?.start?.coordinates?.lng) ||
    (data.coordinates?.lat && data.coordinates?.lng)
  );
  if (!hasCoordinates) {
    issues.push('Missing coordinates (lat/lng)');
  }
  
  // Check heroImage (can be heroImage or first item in photos array)
  const hasHeroImage = !!(data.heroImage?.url || (data.photos?.[0]?.url));
  const heroImageSource = data.heroImage?.url || data.photos?.[0]?.url || null;
  if (!hasHeroImage) {
    issues.push('Missing heroImage URL');
  } else if (!data.heroImage?.credit && !data.heroImage?.source && !data.photos?.[0]?.source) {
    warnings.push('heroImage missing credit/source attribution');
  }
  
  // Check description length
  const description = data.description || '';
  const descriptionWords = await countWords(description);
  if (descriptionWords < 100) {
    issues.push(`Description too short (${descriptionWords} words, need 100+)`);
  }
  
  // Check 2026 dates (can be in multiple formats)
  const datesStr = data.dates ? JSON.stringify(data.dates) : '';
  const dataStr = JSON.stringify(data);
  const has2026Dates = !!(
    (data.dates?.year === 2026) ||
    (data.year === 2026) ||
    (data.date?.includes?.('2026')) ||
    (data.dates?.start?.includes?.('2026')) ||
    (data.dates?.season2026) ||
    (data.dates?.dates2026) ||
    (datesStr.includes('2026')) ||
    (data.dates2026)
  );
  if (!has2026Dates) {
    issues.push('Missing 2026 dates');
  }
  
  // Check category
  const category = data.category || null;
  if (!category) {
    issues.push('Missing category');
  }
  
  // Check website (could be in multiple locations)
  const websiteUrl = data.website || data.social?.website || data.entry?.registration_url || null;
  const hasWebsite = !!websiteUrl;
  if (!hasWebsite) {
    issues.push('Missing website URL');
  }
  
  return {
    file: fileName,
    slug: data.slug || fileName.replace('.json', ''),
    name: data.name || 'Unknown',
    issues,
    warnings,
    category,
    hasCoordinates,
    hasHeroImage,
    heroImageSource,
    descriptionWords,
    has2026Dates,
    hasWebsite,
    websiteUrl
  };
}

async function main() {
  const files = await readdir(ENHANCED_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  console.log(`\n🔍 Auditing ${jsonFiles.length} enhanced event files...\n`);
  
  const results: AuditResult[] = [];
  const issuesByFile: Map<string, AuditResult> = new Map();
  const categories: Map<string, number> = new Map();
  const imageSources: Map<string, string[]> = new Map();
  
  for (const file of jsonFiles) {
    const result = await auditFile(join(ENHANCED_DIR, file));
    results.push(result);
    
    if (result.issues.length > 0) {
      issuesByFile.set(file, result);
    }
    
    // Track categories
    if (result.category) {
      categories.set(result.category, (categories.get(result.category) || 0) + 1);
    }
    
    // Track image sources by domain
    if (result.heroImageSource) {
      try {
        const url = new URL(result.heroImageSource);
        const domain = url.hostname;
        if (!imageSources.has(domain)) {
          imageSources.set(domain, []);
        }
        imageSources.get(domain)!.push(result.slug);
      } catch {}
    }
  }
  
  // Generate AUDIT.md
  const passedCount = results.filter(r => r.issues.length === 0).length;
  const failedCount = results.filter(r => r.issues.length > 0).length;
  const warningsCount = results.filter(r => r.warnings.length > 0).length;
  
  let auditMd = `# Enhanced Events Audit Report

Generated: ${new Date().toISOString().split('T')[0]}

## Summary

| Metric | Count |
|--------|-------|
| Total Files | ${results.length} |
| ✅ Passed (no issues) | ${passedCount} |
| ❌ With Issues | ${failedCount} |
| ⚠️ With Warnings | ${warningsCount} |

## Category Breakdown

| Category | Count |
|----------|-------|
${Array.from(categories.entries()).sort((a, b) => b[1] - a[1]).map(([cat, count]) => `| ${cat} | ${count} |`).join('\n')}

## Quality Metrics

### Coordinates
- ✅ With coordinates: ${results.filter(r => r.hasCoordinates).length}
- ❌ Missing coordinates: ${results.filter(r => !r.hasCoordinates).length}

### Hero Images
- ✅ With heroImage: ${results.filter(r => r.hasHeroImage).length}
- ❌ Missing heroImage: ${results.filter(r => !r.hasHeroImage).length}

### Description Length
- ✅ 100+ words: ${results.filter(r => r.descriptionWords >= 100).length}
- ⚠️ 50-99 words: ${results.filter(r => r.descriptionWords >= 50 && r.descriptionWords < 100).length}
- ❌ Under 50 words: ${results.filter(r => r.descriptionWords < 50).length}

### 2026 Dates
- ✅ Has 2026 dates: ${results.filter(r => r.has2026Dates).length}
- ❌ Missing 2026 dates: ${results.filter(r => !r.has2026Dates).length}

### Website
- ✅ Has website: ${results.filter(r => r.hasWebsite).length}
- ❌ Missing website: ${results.filter(r => !r.hasWebsite).length}

## Image Sources by Domain

${Array.from(imageSources.entries()).sort((a, b) => b[1].length - a[1].length).map(([domain, events]) => 
  `### ${domain} (${events.length} events)\n${events.map(e => `- ${e}`).join('\n')}`
).join('\n\n')}

## Files with Issues

${failedCount === 0 ? '✅ All files passed validation!' : ''}

${results.filter(r => r.issues.length > 0).map(r => `
### ${r.name}
**File:** \`${r.file}\`
**Issues:**
${r.issues.map(i => `- ❌ ${i}`).join('\n')}
${r.warnings.length > 0 ? `**Warnings:**\n${r.warnings.map(w => `- ⚠️ ${w}`).join('\n')}` : ''}
`).join('\n')}

## Files with Warnings Only

${results.filter(r => r.issues.length === 0 && r.warnings.length > 0).map(r => `
### ${r.name}
**File:** \`${r.file}\`
${r.warnings.map(w => `- ⚠️ ${w}`).join('\n')}
`).join('\n')}

## Full Results Table

| Event | Category | Coords | Image | Words | 2026 | Website | Status |
|-------|----------|--------|-------|-------|------|---------|--------|
${results.map(r => `| ${r.name} | ${r.category || '❌'} | ${r.hasCoordinates ? '✅' : '❌'} | ${r.hasHeroImage ? '✅' : '❌'} | ${r.descriptionWords} | ${r.has2026Dates ? '✅' : '❌'} | ${r.hasWebsite ? '✅' : '❌'} | ${r.issues.length === 0 ? '✅' : '❌'} |`).join('\n')}
`;

  await writeFile(join(ENHANCED_DIR, 'AUDIT.md'), auditMd);
  console.log('📝 AUDIT.md written\n');
  
  // Console summary
  console.log('='.repeat(60));
  console.log('AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files: ${results.length}`);
  console.log(`✅ Passed: ${passedCount}`);
  console.log(`❌ With issues: ${failedCount}`);
  console.log(`⚠️ With warnings: ${warningsCount}`);
  console.log('');
  
  if (failedCount > 0) {
    console.log('Files needing fixes:');
    results.filter(r => r.issues.length > 0).forEach(r => {
      console.log(`  ❌ ${r.file}: ${r.issues.join(', ')}`);
    });
  }
  
  // Return results for use in fixing script
  return { results, issuesByFile, categories, imageSources };
}

main().catch(console.error);
