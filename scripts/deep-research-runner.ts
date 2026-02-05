/**
 * Deep Research Runner
 * 
 * Scans the content gap audit and generates a prioritised work queue
 * for the deep research skill. Outputs tasks that can be fed to
 * sub-agents or worked through manually.
 * 
 * This is the "content generation engine" that turns the gap audit
 * into actionable research + writing tasks.
 * 
 * Usage:
 *   npx tsx scripts/deep-research-runner.ts                    # Generate full queue
 *   npx tsx scripts/deep-research-runner.ts --category=combo   # Specific category
 *   npx tsx scripts/deep-research-runner.ts --limit=10         # Limit tasks
 *   npx tsx scripts/deep-research-runner.ts --export           # Export as agent prompts
 * 
 * Output: content/research-queue.json + content/research-queue.md
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Parse CLI args
const args = process.argv.slice(2);
const categoryFilter = args.find(a => a.startsWith("--category="))?.split("=")[1];
const limitArg = parseInt(args.find(a => a.startsWith("--limit="))?.split("=")[1] || "0");
const exportPrompts = args.includes("--export");

interface ResearchTask {
  id: string;
  priority: number; // 1-5, 1 = highest
  category: "combo_page" | "operator_enrichment" | "article" | "guide" | "answer" | "activity_desc" | "region" | "stag_hen" | "attractions";
  title: string;
  description: string;
  inputs: Record<string, string>;
  outputPath: string;
  estimatedTime: string;
  agentPrompt: string;
}

function generateComboPageTasks(): ResearchTask[] {
  const tasks: ResearchTask[] = [];
  
  // High-value combo pages to research
  const priorityCombos = [
    // Stag/Hen (new)
    { region: "south-wales", activity: "stag-hen", priority: 1, name: "Stag & Hen in South Wales" },
    { region: "brecon-beacons", activity: "stag-hen", priority: 1, name: "Stag & Hen in Brecon Beacons" },
    { region: "snowdonia", activity: "stag-hen", priority: 2, name: "Stag & Hen in Snowdonia" },
    { region: "pembrokeshire", activity: "stag-hen", priority: 2, name: "Stag & Hen in Pembrokeshire" },
    { region: "gower", activity: "stag-hen", priority: 2, name: "Stag & Hen in Gower" },
    
    // High-traffic activities × popular regions
    { region: "snowdonia", activity: "hiking", priority: 1, name: "Hiking in Snowdonia" },
    { region: "pembrokeshire", activity: "coasteering", priority: 1, name: "Coasteering in Pembrokeshire" },
    { region: "brecon-beacons", activity: "gorge-walking", priority: 1, name: "Gorge Walking in Brecon Beacons" },
    { region: "gower", activity: "surfing", priority: 1, name: "Surfing in Gower" },
    { region: "snowdonia", activity: "mountain-biking", priority: 2, name: "Mountain Biking in Snowdonia" },
    { region: "snowdonia", activity: "climbing", priority: 2, name: "Climbing in Snowdonia" },
    { region: "pembrokeshire", activity: "sea-kayaking", priority: 2, name: "Sea Kayaking in Pembrokeshire" },
    { region: "brecon-beacons", activity: "caving", priority: 2, name: "Caving in Brecon Beacons" },
    { region: "snowdonia", activity: "canyoning", priority: 2, name: "Canyoning in Snowdonia" },
    { region: "anglesey", activity: "coasteering", priority: 3, name: "Coasteering in Anglesey" },
    
    // Underserved regions
    { region: "wye-valley", activity: "hiking", priority: 3, name: "Hiking in Wye Valley" },
    { region: "mid-wales", activity: "horse-riding", priority: 3, name: "Horse Riding in Mid Wales" },
    { region: "carmarthenshire", activity: "fishing", priority: 3, name: "Fishing in Carmarthenshire" },
    { region: "pembrokeshire", activity: "wildlife", priority: 3, name: "Wildlife in Pembrokeshire" },
  ];

  for (const combo of priorityCombos) {
    const outputFile = `data/combo-pages/${combo.region}--${combo.activity}.json`;
    
    // Skip if enrichment file already exists
    if (existsSync(join(process.cwd(), outputFile))) continue;

    tasks.push({
      id: `combo-${combo.region}-${combo.activity}`,
      priority: combo.priority,
      category: "combo_page",
      title: `Research & write: ${combo.name}`,
      description: `Create enrichment data for the ${combo.name} combo page. Research forum posts, operator reviews, local tips, and write 1,500-2,500 word editorial with tiered tips.`,
      inputs: {
        region: combo.region,
        activityType: combo.activity,
      },
      outputPath: outputFile,
      estimatedTime: "20-30 min per page",
      agentPrompt: `You are researching "${combo.name}" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: ${outputFile}
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: ${combo.name} combo page"`,
    });
  }

  return tasks;
}

function generateArticleTasks(): ResearchTask[] {
  const articles = [
    {
      priority: 1,
      title: "The Ultimate Guide to a Stag Weekend in Wales (2026)",
      slug: "stag-weekend-wales-guide-2026",
      description: "Comprehensive guide covering Cardiff, Brecon Beacons, Snowdonia, and Pembrokeshire. Activities, accommodation, nightlife, costs, planning tips.",
    },
    {
      priority: 1,
      title: "The Ultimate Guide to a Hen Weekend in Wales (2026)",
      slug: "hen-weekend-wales-guide-2026",
      description: "Adventure hen parties, spa weekends, city breaks, and coastal retreats. Activities, accommodation, planning tips, themed ideas.",
    },
    {
      priority: 2,
      title: "10 Adventure Activities for Your Stag/Hen Do in Wales",
      slug: "adventure-activities-stag-hen-wales",
      description: "Ranked list of the best group adventure activities with operator recommendations, pricing, and group size info.",
    },
    {
      priority: 2,
      title: "Cardiff vs Snowdonia: Where Should You Plan Your Stag/Hen?",
      slug: "cardiff-vs-snowdonia-stag-hen",
      description: "Comparison guide: city nightlife + activities vs mountain adventure + lodges. Pros, cons, costs, sample itineraries.",
    },
    {
      priority: 3,
      title: "Wales Castle Trail: 10 Castles You Can't Miss",
      slug: "wales-castle-trail",
      description: "Curated castle route linking to nearby adventure activities. Cross-sell adventure + heritage.",
    },
    {
      priority: 3,
      title: "Rainy Day Adventures in Wales: 15 Indoor & Sheltered Activities",
      slug: "rainy-day-adventures-wales",
      description: "Weather backup plans that are actually fun. Underground trampolines, caving, indoor surf, climbing walls, museums.",
    },
  ];

  return articles.map(a => ({
    id: `article-${a.slug}`,
    priority: a.priority,
    category: "article" as const,
    title: `Write article: ${a.title}`,
    description: a.description,
    inputs: { slug: a.slug },
    outputPath: `content/articles/${a.slug}.md`,
    estimatedTime: "30-45 min",
    agentPrompt: `Write a journal article for Adventure Wales: "${a.title}"

Read the content writer skill at /home/minigeek/clawd/skills/aw-content-writer/SKILL.md.

Requirements:
- 1,500-2,500 words
- UK English, conversational but informative tone
- Real operator names, real prices, real places
- Include internal links to existing AW pages where relevant
- Schema-ready FAQ section at the end
- ${a.description}

Output as markdown to: content/articles/${a.slug}.md
Then import to database using the journal import script.`,
  }));
}

function generateAnswerTasks(): ResearchTask[] {
  const answers = [
    { q: "How much does a stag weekend in Wales cost?", slug: "stag-weekend-wales-cost", priority: 1 },
    { q: "Best adventure activities for hen parties in Wales", slug: "best-hen-party-activities-wales", priority: 1 },
    { q: "Can you do outdoor activities in Wales in winter?", slug: "outdoor-activities-wales-winter", priority: 2 },
    { q: "Best group accommodation in Wales for stag and hen parties", slug: "group-accommodation-wales-stag-hen", priority: 2 },
    { q: "Best nightlife in Cardiff for stag parties", slug: "cardiff-nightlife-stag-parties", priority: 2 },
    { q: "What castles can you visit in Wales?", slug: "castles-to-visit-wales", priority: 3 },
    { q: "Best free things to do in Wales", slug: "free-things-to-do-wales", priority: 3 },
    { q: "Is Wales good for a family adventure holiday?", slug: "wales-family-adventure-holiday", priority: 3 },
  ];

  return answers.map(a => ({
    id: `answer-${a.slug}`,
    priority: a.priority,
    category: "answer" as const,
    title: `Write FAQ: ${a.q}`,
    description: `Research and write a 300-500 word answer with real data, operator mentions, and internal links.`,
    inputs: { slug: a.slug, question: a.q },
    outputPath: `content/answers/${a.slug}.md`,
    estimatedTime: "10-15 min",
    agentPrompt: `Write an FAQ answer for Adventure Wales: "${a.q}"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/${a.slug}.md`,
  }));
}

function generateOperatorTasks(): ResearchTask[] {
  // These will be populated from the gap audit
  const auditPath = join(process.cwd(), "content", "content-gap-audit.json");
  if (!existsSync(auditPath)) {
    console.log("⚠️ No content-gap-audit.json found. Run content-gap-audit.ts first.");
    return [];
  }

  const audit = JSON.parse(readFileSync(auditPath, "utf-8"));
  const operatorGaps = audit.gaps.filter(
    (g: any) => g.category === "Operators" && (g.severity === "critical" || g.severity === "high")
  );

  return operatorGaps.slice(0, 20).map((g: any, i: number) => ({
    id: `operator-${g.slug}`,
    priority: g.severity === "critical" ? 1 : 2,
    category: "operator_enrichment" as const,
    title: `Enrich operator: ${g.slug}`,
    description: g.issue,
    inputs: { slug: g.slug },
    outputPath: `data/research/operators/${g.slug}.json`,
    estimatedTime: "10-15 min",
    agentPrompt: `Research and enrich the operator at /directory/${g.slug} on Adventure Wales.

Current issues: ${g.issue}

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/${g.slug}.json`,
  }));
}

async function main() {
  console.log("📋 Deep Research Queue Generator\n");

  let allTasks: ResearchTask[] = [];

  // Generate tasks by category
  if (!categoryFilter || categoryFilter === "combo") {
    allTasks.push(...generateComboPageTasks());
  }
  if (!categoryFilter || categoryFilter === "article") {
    allTasks.push(...generateArticleTasks());
  }
  if (!categoryFilter || categoryFilter === "answer") {
    allTasks.push(...generateAnswerTasks());
  }
  if (!categoryFilter || categoryFilter === "operator") {
    allTasks.push(...generateOperatorTasks());
  }

  // Sort by priority
  allTasks.sort((a, b) => a.priority - b.priority);

  // Apply limit
  if (limitArg > 0) {
    allTasks = allTasks.slice(0, limitArg);
  }

  // Stats
  const stats = {
    total: allTasks.length,
    byPriority: {
      p1: allTasks.filter(t => t.priority === 1).length,
      p2: allTasks.filter(t => t.priority === 2).length,
      p3: allTasks.filter(t => t.priority === 3).length,
    },
    byCategory: {} as Record<string, number>,
  };
  for (const t of allTasks) {
    stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + 1;
  }

  // Write JSON queue
  const jsonOutput = {
    generatedAt: new Date().toISOString(),
    stats,
    tasks: allTasks,
  };
  writeFileSync("content/research-queue.json", JSON.stringify(jsonOutput, null, 2));

  // Write Markdown
  let md = `# Deep Research Queue\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n`;
  md += `**Total tasks:** ${stats.total}\n\n`;
  md += `## Priority Breakdown\n\n`;
  md += `| Priority | Count | Description |\n|----------|-------|-------------|\n`;
  md += `| 🔴 P1 | ${stats.byPriority.p1} | Must-do — high traffic, high impact |\n`;
  md += `| 🟡 P2 | ${stats.byPriority.p2} | Should-do — good ROI |\n`;
  md += `| 🟢 P3 | ${stats.byPriority.p3} | Nice-to-have — fills gaps |\n\n`;
  md += `## By Category\n\n`;
  for (const [cat, count] of Object.entries(stats.byCategory)) {
    md += `- **${cat}**: ${count} tasks\n`;
  }
  md += `\n---\n\n`;

  // Task list grouped by priority
  for (const p of [1, 2, 3]) {
    const pTasks = allTasks.filter(t => t.priority === p);
    if (pTasks.length === 0) continue;
    const emoji = p === 1 ? "🔴" : p === 2 ? "🟡" : "🟢";
    md += `## ${emoji} Priority ${p}\n\n`;
    for (const t of pTasks) {
      md += `### ${t.title}\n`;
      md += `- **Category:** ${t.category}\n`;
      md += `- **Output:** \`${t.outputPath}\`\n`;
      md += `- **Time:** ${t.estimatedTime}\n`;
      md += `- ${t.description}\n\n`;
    }
  }

  writeFileSync("content/research-queue.md", md);

  // Export agent prompts if requested
  if (exportPrompts) {
    let prompts = `# Agent Task Prompts\n\nCopy-paste these into sub-agent sessions.\n\n`;
    for (const t of allTasks) {
      prompts += `---\n\n## ${t.title}\n\n\`\`\`\n${t.agentPrompt}\n\`\`\`\n\n`;
    }
    writeFileSync("content/agent-prompts.md", prompts);
    console.log("📄 Written: content/agent-prompts.md");
  }

  console.log("📄 Written: content/research-queue.json");
  console.log("📄 Written: content/research-queue.md");
  console.log(`\n📊 Queue Summary:`);
  console.log(`   🔴 P1: ${stats.byPriority.p1} tasks`);
  console.log(`   🟡 P2: ${stats.byPriority.p2} tasks`);
  console.log(`   🟢 P3: ${stats.byPriority.p3} tasks`);
  console.log(`   Total: ${stats.total} tasks`);
  for (const [cat, count] of Object.entries(stats.byCategory)) {
    console.log(`   ${cat}: ${count}`);
  }
}

main().catch(console.error);
