# Fact Sheets — Phase 2

Activity-type-specific fact sheet components for Welsh adventure activities.
Grouped by category with fields tailored to Wales (coastal, valleys, hills — not alpine).

## Activity Types in Data

- Coasteering (12), Surfing (9), Mountain Biking (7), SUP (6), Sea Kayaking (6)
- Climbing (4), Gorge Scrambling (3), Sailing (2), Kitesurfing (2), Kayaking (2)
- Hiking (2), Boat Tour (2), Bike Hire (2)
- Plus: Zip Lining, Wing Foiling, Windsurfing, Wild Swimming, Wildlife Boat Tour, Underground Trampolines, Trail Running, Toboggan, Rafting, Powerboating, MTB Coaching, Mine Exploration, Jet Ski, Hiking/Scrambling, High Ropes, Caving/Potholing, Caving, Canyoning, Archery

## Fact Sheet Categories

### 🌊 Water (Coasteering, Surfing, Sea Kayaking, SUP, Kayaking, Rafting, Wild Swimming)
- Tide dependent Y/N
- Water temperature range
- Wetsuit provided/required
- Sea conditions (sheltered/exposed)
- River grade (for white water)
- Launch point

### 🚴 Trail (Mountain Biking, Trail Running, Bike Hire)
- Distance (km)
- Elevation gain (m)
- Trail grade (green/blue/red/black)
- Surface type (singletrack/fire road/mixed)
- Trail centre name
- Bike hire available Y/N

### 🥾 Land (Hiking, Scrambling, Climbing, Gorge Walking, Caving)
- Distance (km)
- Elevation gain (m)
- Scramble grade (if applicable)
- Terrain (moorland/ridge/coastal path/gorge)
- Exposure level (low/moderate/high)
- Dog-friendly Y/N

### 🎢 Thrill (Zip Line, High Ropes, Underground Trampolines, Toboggan, Mine Exploration)
- Height/depth
- Weight limits
- Accessibility notes
- Indoor/outdoor
- Weather dependent Y/N

### 🐋 Wildlife/Tours (Boat tours, Wildlife)
- Species/highlights
- Best season
- Trip length
- Departure point

## Implementation Notes

- Add schema fields per category (or flexible JSONB `factSheet` column on activities table)
- Category-aware React component renders different fields based on activity type
- Backfill data from CSV where possible, flag gaps for manual entry
- Consider GPX upload support for trail/hiking routes (map overlay)
