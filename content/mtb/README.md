# Mountain Biking Content Structure

This folder contains the definitive MTB content for Adventure Wales.

## Structure

```
mtb/
├── README.md                 # This file
├── centres.csv               # Trail centre master data
├── trails.csv                # Individual trail data
├── routes.csv                # Multi-day route data
├── centres/                  # Trail centre mega-pages
│   ├── coed-y-brenin.md
│   ├── bikepark-wales.md
│   ├── antur-stiniog.md
│   └── ...
├── trails/                   # Individual trail pages (for key trails)
│   ├── beast.md
│   ├── marin-trail.md
│   └── ...
└── routes/                   # Multi-day route pages
    ├── trans-cambrian-way.md
    ├── traws-eryri.md
    └── ...
```

## Data Model

### Trail Centres (centres.csv)
```
slug,name,region,lat,lon,trails_count,facilities,parking_cost,cafe,bike_wash,bike_hire,uplift,website,phone
```

### Individual Trails (trails.csv)
```
slug,name,centre_slug,grade,distance_km,climb_m,descent_m,time_mins,surface,drainage,features,family_friendly,ebike_ok,description
```

### Multi-Day Routes (routes.csv)
```
slug,name,distance_km,days,climb_m,start_location,end_location,difficulty,gpx_url,description
```

## Grade System

| Grade | Colour | Description |
|-------|--------|-------------|
| green | 🟢 | Easy - Wide, smooth, gentle gradients |
| blue | 🔵 | Moderate - Some technical features, steeper sections |
| red | 🔴 | Difficult - Technical, steep, rocks/roots |
| black | ⚫ | Severe - Expert only, very technical |
| orange | 🟠 | Extreme - Bike park / pro-line features |
| proline | ⬛ | Pro Line - Competition grade |

## Content Quality Bar

Every trail description must include:
1. **What makes it special** — Why ride this trail specifically?
2. **Who it's for** — Skill level, fitness required
3. **What to expect** — Terrain, features, challenges
4. **Honest warnings** — Mud, exposure, technical sections
5. **Best conditions** — Season, weather, avoid when wet?
6. **Local tip** — Something only regulars know
