import { z } from "zod";

/**
 * Dev-only drift detection for `data/combo-pages/*.json`.
 *
 * These schemas are intentionally LOOSE (`.passthrough()` everywhere, most
 * fields optional) — the goal is to catch *new* schema drift as content is
 * authored, not to enforce a strict contract that would throw in production.
 * `validateComboData` only ever `console.warn`s, and only outside production.
 */

const driveTimeSchema = z
  .object({
    from: z.string(),
    duration: z.string(),
    route: z.string(),
  })
  .passthrough();

const gettingThereSchema = z
  .union([
    z
      .object({
        driveTimes: z.array(driveTimeSchema).optional(),
        publicTransport: z.string().optional(),
        parkingTips: z.string().optional(),
      })
      .passthrough(),
    z.string(),
  ])
  .optional();

const gearHireEntrySchema = z
  .object({
    name: z.string(),
    location: z.string(),
    url: z.string().nullable().optional(),
  })
  .passthrough();

const practicalInfoSchema = z
  .object({
    weather: z.string().optional(),
    weatherLinks: z
      .array(z.object({ name: z.string(), url: z.string() }).passthrough())
      .optional(),
    gearChecklist: z.array(z.string()).optional(),
    gearHire: z.array(gearHireEntrySchema).optional(),
    safety: z.string().optional(),
    safetyNotes: z.array(z.string()).optional(),
    transportNotes: z.string().optional(),
    parkingNotes: z.string().optional(),
    gettingThere: gettingThereSchema,
  })
  .passthrough()
  .optional();

const spotSchema = z
  .object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    difficulty: z.string(),
    duration: z.string(),
    distance: z.string().nullable().optional(),
    elevationGain: z.string().nullable().optional(),
    bestFor: z.string(),
    notSuitableFor: z.string().optional(),
    bestSeason: z.string(),
    parking: z.string().optional(),
    startPoint: z
      .object({ name: z.string(), lat: z.number(), lng: z.number() })
      .passthrough()
      .optional(),
    estimatedCost: z.string().optional(),
    operatorSlug: z.string().nullable().optional(),
    insiderTip: z.string().optional(),
    howToDoIt: z.string().optional(),
    access: z.string().optional(),
    routeDescription: z.string().optional(),
  })
  .passthrough();

const keywordsSchema = z
  .object({
    primary: z.string().optional(),
    secondary: z.array(z.string()).optional(),
    longTail: z.array(z.string()).optional(),
    localIntent: z.array(z.string()).optional(),
    commercialIntent: z.array(z.string()).optional(),
  })
  .passthrough()
  .optional();

/**
 * Loose top-level schema for a combo page JSON file. Only fields whose shape
 * is worth watching for drift are typed strictly; everything else is
 * `passthrough()`-ed so unknown/evolving fields never trigger a warning.
 */
const comboPageDataSchema = z
  .object({
    regionSlug: z.string(),
    activityTypeSlug: z.string(),
    title: z.string(),
    strapline: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    heroAlt: z.string(),
    introduction: z.string(),
    bestSeason: z.string(),
    difficultyRange: z.string(),
    priceRange: z.string(),
    spots: z.array(spotSchema),
    practicalInfo: practicalInfoSchema,
    keywords: keywordsSchema,
  })
  .passthrough();

/**
 * Validate raw combo page data against the expected (loose) schema and
 * `console.warn` a concise diff on mismatch. No-op in production and never
 * throws — this is a dev-time drift detector, not a runtime guard.
 */
export function validateComboData(data: unknown, filename: string): void {
  if (process.env.NODE_ENV === "production") return;

  const result = comboPageDataSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 10)
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    console.warn(
      `[combo-schema] Schema drift detected in data/combo-pages/${filename}:\n${issues}`
    );
  }
}
