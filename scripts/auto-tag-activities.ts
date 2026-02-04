import { db } from "../src/db";
import { tags, activityTags, activities, activityTypes } from "../src/db/schema";
import { eq, and, inArray } from "drizzle-orm";

interface TagMatch {
  tagId: number;
  tagName: string;
  matchReason: string;
}

async function main() {
  console.log("🔖 Starting auto-tagging of activities...\n");

  // Fetch all tags
  const allTags = await db.query.tags.findMany();
  console.log(`📦 Loaded ${allTags.length} tags\n`);

  // Fetch all activities with their activity types
  const allActivities = await db.query.activities.findMany({
    with: {
      activityType: true,
    },
  });

  console.log(`🎯 Found ${allActivities.length} activities to process\n`);

  let totalTagsAdded = 0;
  let activitiesTagged = 0;

  for (const activity of allActivities) {
    const matches: TagMatch[] = [];
    const activityText = `${activity.name} ${activity.description || ""} ${activity.difficulty || ""} ${activity.activityType?.name || ""}`.toLowerCase();

    // Match activity type tags
    for (const tag of allTags.filter((t) => t.type === "activity")) {
      const tagKeywords = tag.slug.split("-");
      const tagName = tag.name.toLowerCase();
      
      // Check if activity type name matches
      if (activity.activityType?.name.toLowerCase().includes(tag.slug) ||
          tag.slug.includes(activity.activityType?.slug || "") ||
          activityText.includes(tagName) ||
          tagKeywords.some((keyword) => activityText.includes(keyword))) {
        matches.push({
          tagId: tag.id,
          tagName: tag.name,
          matchReason: "activity type",
        });
      }
    }

    // Match terrain tags based on description
    const terrainKeywords: Record<string, string[]> = {
      coastal: ["coast", "beach", "sea", "ocean", "shore", "cliff"],
      mountain: ["mountain", "summit", "peak", "ridge", "alpine"],
      valley: ["valley", "gorge", "ravine"],
      forest: ["forest", "woodland", "trees", "wood"],
      underground: ["cave", "underground", "cavern"],
      river: ["river", "stream", "rapids", "waterfall"],
      lake: ["lake", "reservoir", "pond"],
      beach: ["beach", "sand", "shore", "seaside"],
      woodland: ["woodland", "forest", "trees"],
    };

    for (const tag of allTags.filter((t) => t.type === "terrain")) {
      const keywords = terrainKeywords[tag.slug] || [tag.slug];
      if (keywords.some((keyword) => activityText.includes(keyword))) {
        matches.push({
          tagId: tag.id,
          tagName: tag.name,
          matchReason: "terrain description",
        });
      }
    }

    // Match difficulty tags
    const difficultyKeywords: Record<string, string[]> = {
      easy: ["easy", "beginner", "gentle", "simple"],
      moderate: ["moderate", "intermediate"],
      challenging: ["challenging", "difficult", "advanced", "hard"],
      extreme: ["extreme", "expert", "intense"],
      "family-friendly": ["family", "children", "kids", "all ages"],
      "beginner-friendly": ["beginner", "first time", "novice", "no experience"],
    };

    for (const tag of allTags.filter((t) => t.type === "difficulty")) {
      const keywords = difficultyKeywords[tag.slug] || [tag.slug];
      if (keywords.some((keyword) => activityText.includes(keyword))) {
        matches.push({
          tagId: tag.id,
          tagName: tag.name,
          matchReason: "difficulty match",
        });
      }
    }

    // Match feature tags
    const featureKeywords: Record<string, string[]> = {
      "dog-friendly": ["dog", "dogs", "pet"],
      "wheelchair-accessible": ["wheelchair", "accessible", "disability"],
      "public-transport": ["bus", "train", "public transport"],
      "free-parking": ["free parking", "parking available"],
      "equipment-provided": ["equipment provided", "gear provided", "kit included"],
      "wetsuit-provided": ["wetsuit provided", "wetsuit included"],
      guided: ["guided", "instructor", "guide"],
      "self-guided": ["self-guided", "independent", "unguided"],
      "year-round": ["year round", "all year", "year-round"],
      "booking-required": ["booking required", "advance booking", "pre-book"],
    };

    for (const tag of allTags.filter((t) => t.type === "feature")) {
      const keywords = featureKeywords[tag.slug] || [tag.slug.split("-")];
      if (keywords.some((keyword) => activityText.includes(keyword))) {
        matches.push({
          tagId: tag.id,
          tagName: tag.name,
          matchReason: "feature match",
        });
      }
    }

    // Match amenity tags
    const amenityKeywords: Record<string, string[]> = {
      cafe: ["cafe", "coffee", "refreshments"],
      toilets: ["toilet", "wc", "facilities"],
      showers: ["shower", "wash facilities"],
      "bike-shop": ["bike shop", "bike rental", "cycle hire"],
      camping: ["camping", "campsite", "camp"],
      wifi: ["wifi", "wi-fi", "internet"],
      "changing-rooms": ["changing room", "changing facilities"],
      lockers: ["locker", "storage", "secure storage"],
    };

    for (const tag of allTags.filter((t) => t.type === "amenity")) {
      const keywords = amenityKeywords[tag.slug] || [tag.slug.split("-")];
      if (keywords.some((keyword) => activityText.includes(keyword))) {
        matches.push({
          tagId: tag.id,
          tagName: tag.name,
          matchReason: "amenity match",
        });
      }
    }

    // Remove duplicates
    const uniqueMatches = Array.from(
      new Map(matches.map((m) => [m.tagId, m])).values()
    );

    if (uniqueMatches.length > 0) {
      // Insert activity tags
      await db.insert(activityTags).values(
        uniqueMatches.map((match) => ({
          activityId: activity.id,
          tagId: match.tagId,
        }))
      );

      console.log(
        `✅ ${activity.name} (ID: ${activity.id}): Added ${uniqueMatches.length} tags`
      );
      uniqueMatches.forEach((match) => {
        console.log(`   - ${match.tagName} (${match.matchReason})`);
      });
      console.log();

      totalTagsAdded += uniqueMatches.length;
      activitiesTagged++;
    } else {
      console.log(`⚪ ${activity.name} (ID: ${activity.id}): No matches found`);
    }
  }

  console.log("\n📊 Summary:");
  console.log(`   Activities processed: ${allActivities.length}`);
  console.log(`   Activities tagged: ${activitiesTagged}`);
  console.log(`   Total tags added: ${totalTagsAdded}`);
  console.log(`   Average tags per tagged activity: ${activitiesTagged > 0 ? (totalTagsAdded / activitiesTagged).toFixed(1) : 0}`);
  
  console.log("\n🎉 Auto-tagging complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error auto-tagging activities:", error);
    process.exit(1);
  });
