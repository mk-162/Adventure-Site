import { itineraryStops, activities, accommodation, locations, operators } from "@/db/schema";

export type ItineraryStop = typeof itineraryStops.$inferSelect & {
  activity?: typeof activities.$inferSelect | null;
  accommodation?: typeof accommodation.$inferSelect | null;
  location?: typeof locations.$inferSelect | null;
  operator?: typeof operators.$inferSelect | null;
  wetAltActivity?: typeof activities.$inferSelect | null;
  budgetAltActivity?: typeof activities.$inferSelect | null;
};
