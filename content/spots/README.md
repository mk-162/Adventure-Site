# Spots Database

Activity-specific location databases. Each activity has its own CSV with fields relevant to that activity.

## Structure

```
spots/
├── README.md               # This file
├── mtb/
│   ├── centres.csv         # Trail centres (BikePark Wales, Coed y Brenin, etc.)
│   ├── trails.csv          # Individual trails
│   └── routes.csv          # Multi-day routes
├── surfing/
│   ├── breaks.csv          # Surf breaks/beaches
│   └── schools.csv         # Linked from operators
├── hiking/
│   ├── trails.csv          # Day hikes and trails
│   ├── routes.csv          # Multi-day routes (Coast Path, etc.)
│   └── peaks.csv           # Notable summits
├── climbing/
│   ├── crags.csv           # Outdoor crags
│   ├── walls.csv           # Indoor walls
│   └── routes.csv          # Classic routes
├── coasteering/
│   └── spots.csv           # Coasteering locations
├── wild-swimming/
│   └── spots.csv           # Swimming spots (lakes, rivers, sea)
├── kayaking/
│   ├── spots.csv           # Launch points and paddles
│   └── routes.csv          # Touring routes
├── caving/
│   └── caves.csv           # Cave systems
└── beaches/
    └── beaches.csv         # General beach database
```

## Common Fields (all CSVs)

| Field | Type | Description |
|-------|------|-------------|
| slug | string | URL-safe identifier |
| name | string | Display name |
| region | string | Region slug (snowdonia, pembrokeshire, etc.) |
| lat | float | Latitude |
| lon | float | Longitude |
| description | text | Short description (for listings) |
| parking_lat | float | Parking location latitude |
| parking_lon | float | Parking location longitude |
| parking_info | string | Parking details (cost, spaces, etc.) |
| facilities | string | Pipe-separated (cafe\|toilets\|showers) |
| access_notes | text | How to get there |
| best_season | string | When to visit |
| dog_friendly | boolean | Dogs allowed? |
| family_friendly | boolean | Suitable for families? |

## Activity-Specific Fields

See individual README files in each folder for activity-specific schema.

## Linking

- Spots link to operators via `operators` field (comma-separated slugs)
- Spots link to regions via `region` field
- Use slug for all cross-references
