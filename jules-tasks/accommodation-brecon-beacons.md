# Accommodation Research: Brecon-beacons

## Objective
Deep dive into the best hotels and accommodation options in Brecon-beacons for Adventure Wales directory.

## Research Requirements

### Luxury Hotels (5+ options)
- Name, location, price range
- Adventure-friendly features (drying rooms, bike storage, gear rental partnerships)
- Proximity to key adventure spots
- Website, booking links, contact details

### Boutique & Unique Stays (5+ options)
- Glamping, treehouses, eco-lodges, converted barns
- Unique selling points
- Adventure packages offered

### Budget-Friendly (5+ options)
- Hostels, bunkhouses, camping
- Facilities for adventure travelers
- Group booking options

### Adventure-Specific Accommodation
- Places popular with specific communities (climbers, hikers, MTB, surfers, etc.)

## Output Format
Create JSON file: `data/accommodation/brecon-beacons.json`

```json
{
  "region": "brecon-beacons",
  "lastUpdated": "2026-02-07",
  "accommodations": [
    {
      "name": "",
      "slug": "",
      "type": "luxury|boutique|budget|adventure",
      "location": { "town": "", "lat": 0, "lng": 0 },
      "priceRange": "£-££££",
      "description": "",
      "adventureFeatures": [],
      "nearbyActivities": [],
      "website": "",
      "bookingUrl": "",
      "phone": "",
      "images": []
    }
  ]
}
```

## Quality Standards
- Real data only (verify each property exists)
- Current prices and availability
- Focus on adventure-relevance, not generic tourism
- Include at least 15-20 properties per region
