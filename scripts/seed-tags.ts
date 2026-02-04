import { db } from "../src/db";
import { tags, activityTags, activities, activityTypes } from "../src/db/schema";
import { eq, and } from "drizzle-orm";

interface TagDefinition {
  name: string;
  slug: string;
  type: "activity" | "terrain" | "difficulty" | "amenity" | "feature" | "region";
  description?: string;
}

const tagDefinitions: TagDefinition[] = [
  // Activity type tags
  { name: "Coasteering", slug: "coasteering", type: "activity", description: "Exploring rocky coastlines by climbing, jumping, and swimming" },
  { name: "Surfing", slug: "surfing", type: "activity", description: "Riding waves on a surfboard" },
  { name: "Mountain Biking", slug: "mountain-biking", type: "activity", description: "Off-road cycling on trails and mountains" },
  { name: "Sea Kayaking", slug: "sea-kayaking", type: "activity", description: "Paddling on the open sea in a kayak" },
  { name: "Hiking", slug: "hiking", type: "activity", description: "Walking through natural environments on trails" },
  { name: "Climbing", slug: "climbing", type: "activity", description: "Rock climbing and bouldering" },
  { name: "Gorge Walking", slug: "gorge-walking", type: "activity", description: "Navigating through river gorges by walking, climbing, and swimming" },
  { name: "Caving", slug: "caving", type: "activity", description: "Exploring underground cave systems" },
  { name: "Zip Lining", slug: "zip-lining", type: "activity", description: "Sliding down a cable from height" },
  { name: "Stand Up Paddleboarding", slug: "sup", type: "activity", description: "Standing on a board and paddling on water" },
  { name: "Kayaking", slug: "kayaking", type: "activity", description: "Paddling a kayak on rivers, lakes, or sea" },
  { name: "Wild Swimming", slug: "wild-swimming", type: "activity", description: "Swimming in natural outdoor waters" },
  { name: "Trail Running", slug: "trail-running", type: "activity", description: "Running on trails through natural terrain" },
  { name: "Sailing", slug: "sailing", type: "activity", description: "Navigating boats using wind power" },
  { name: "Canoeing", slug: "canoeing", type: "activity", description: "Paddling a canoe on calm waters" },
  { name: "Abseiling", slug: "abseiling", type: "activity", description: "Descending from heights using ropes" },
  { name: "Mountain Walking", slug: "mountain-walking", type: "activity", description: "Walking and scrambling in mountainous terrain" },
  { name: "Paddleboarding", slug: "paddleboarding", type: "activity", description: "Standing or kneeling on a board and paddling" },
  { name: "Bodyboarding", slug: "bodyboarding", type: "activity", description: "Riding waves on a short board lying down" },
  
  // Terrain tags
  { name: "Coastal", slug: "coastal", type: "terrain", description: "Activities along the coastline and beaches" },
  { name: "Mountain", slug: "mountain", type: "terrain", description: "Activities in mountainous areas" },
  { name: "Valley", slug: "valley", type: "terrain", description: "Activities in valleys and lowland areas" },
  { name: "Forest", slug: "forest", type: "terrain", description: "Activities in wooded areas" },
  { name: "Underground", slug: "underground", type: "terrain", description: "Activities in caves and underground systems" },
  { name: "River", slug: "river", type: "terrain", description: "Activities on or in rivers" },
  { name: "Lake", slug: "lake", type: "terrain", description: "Activities on or in lakes" },
  { name: "Beach", slug: "beach", type: "terrain", description: "Activities on sandy or pebble beaches" },
  { name: "Woodland", slug: "woodland", type: "terrain", description: "Activities in forested areas" },
  
  // Difficulty tags
  { name: "Easy", slug: "easy", type: "difficulty", description: "Suitable for beginners with minimal experience" },
  { name: "Moderate", slug: "moderate", type: "difficulty", description: "Requires some experience and fitness" },
  { name: "Challenging", slug: "challenging", type: "difficulty", description: "For experienced adventurers" },
  { name: "Extreme", slug: "extreme", type: "difficulty", description: "Only for highly experienced individuals" },
  { name: "Family Friendly", slug: "family-friendly", type: "difficulty", description: "Suitable for families with children" },
  { name: "Beginner Friendly", slug: "beginner-friendly", type: "difficulty", description: "Perfect for first-timers" },
  
  // Feature tags
  { name: "Dog Friendly", slug: "dog-friendly", type: "feature", description: "Dogs are welcome" },
  { name: "Wheelchair Accessible", slug: "wheelchair-accessible", type: "feature", description: "Accessible for wheelchair users" },
  { name: "Public Transport", slug: "public-transport", type: "feature", description: "Accessible by public transport" },
  { name: "Free Parking", slug: "free-parking", type: "feature", description: "Free parking available" },
  { name: "Equipment Provided", slug: "equipment-provided", type: "feature", description: "All necessary equipment is provided" },
  { name: "Wetsuit Provided", slug: "wetsuit-provided", type: "feature", description: "Wetsuits are provided" },
  { name: "Guided", slug: "guided", type: "feature", description: "Guided tours available" },
  { name: "Self-Guided", slug: "self-guided", type: "feature", description: "Can be done independently" },
  { name: "Year Round", slug: "year-round", type: "feature", description: "Available throughout the year" },
  { name: "Booking Required", slug: "booking-required", type: "feature", description: "Advance booking is required" },
  
  // Amenity tags
  { name: "Cafe", slug: "cafe", type: "amenity", description: "Cafe or refreshments available" },
  { name: "Toilets", slug: "toilets", type: "amenity", description: "Toilet facilities available" },
  { name: "Showers", slug: "showers", type: "amenity", description: "Shower facilities available" },
  { name: "Bike Shop", slug: "bike-shop", type: "amenity", description: "Bike shop or rental nearby" },
  { name: "Camping", slug: "camping", type: "amenity", description: "Camping facilities available" },
  { name: "WiFi", slug: "wifi", type: "amenity", description: "WiFi internet access available" },
  { name: "Changing Rooms", slug: "changing-rooms", type: "amenity", description: "Changing room facilities available" },
  { name: "Lockers", slug: "lockers", type: "amenity", description: "Secure storage lockers available" },
];

async function main() {
  console.log("🏷️  Starting tag seeding...\n");

  // Get the first site (Adventure Wales)
  const [site] = await db.query.sites.findMany({ limit: 1 });
  
  if (!site) {
    console.error("❌ No site found in database. Please ensure a site exists first.");
    process.exit(1);
  }

  console.log(`📍 Using site: ${site.name} (ID: ${site.id})\n`);

  // Insert tags
  console.log("Creating tags...");
  const insertedTags = await db
    .insert(tags)
    .values(
      tagDefinitions.map((tag) => ({
        siteId: site.id,
        name: tag.name,
        slug: tag.slug,
        type: tag.type,
        description: tag.description,
      }))
    )
    .returning();

  console.log(`✅ Created ${insertedTags.length} tags\n`);

  // Group tags by type for reporting
  const tagsByType: Record<string, number> = {};
  insertedTags.forEach((tag) => {
    tagsByType[tag.type] = (tagsByType[tag.type] || 0) + 1;
  });

  console.log("📊 Tags by type:");
  Object.entries(tagsByType).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });

  console.log("\n🎉 Tag seeding complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error seeding tags:", error);
    process.exit(1);
  });
