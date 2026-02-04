#!/usr/bin/env python3
"""
Adventure Wales Itinerary Engine - JSON Stub Generator

Generates 55 structured itinerary JSON files for the itinerary engine.
Uses Gemini 2.0 Flash with Google Search grounding for research.

Usage:
    python scripts/generate-itineraries.py --type all
    python scripts/generate-itineraries.py --type region:snowdonia
    python scripts/generate-itineraries.py --type single:snowdonia-adventure-weekend
    python scripts/generate-itineraries.py --type all --dry-run
"""

import os
import sys
import json
import csv
import time
import re
import argparse
from pathlib import Path

try:
    import google.generativeai as genai
except ImportError:
    os.system("pip install google-generativeai")
    import google.generativeai as genai

# =============================================================================
# CONFIG
# =============================================================================

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "wales"
CONTENT_DIR = PROJECT_ROOT / "content"
OUTPUT_DIR = PROJECT_ROOT / "data" / "itineraries"

# =============================================================================
# ALL 55 ITINERARY SPECS
# =============================================================================

ITINERARIES = [
    # =========================================================================
    # SNOWDONIA (13)
    # =========================================================================
    {
        "slug": "snowdonia-adventure-weekend",
        "title": "Snowdonia Adventure Weekend",
        "tagline": "Zip lines, summit hikes, and gorge scrambling",
        "region": "snowdonia",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "families, friends",
        "bestSeason": "May-September",
        "highlights": ["Zip World", "Snowdon summit", "Gorge walking"],
        "activityTypes": ["zip-lining", "hiking", "gorge-walking"],
    },
    {
        "slug": "family-adventure-week",
        "title": "Family Adventure Week",
        "tagline": "Kid-tested adventures across Snowdonia",
        "region": "snowdonia",
        "days": 5,
        "difficulty": "easy",
        "groupType": "families",
        "bestSeason": "June-August",
        "highlights": ["Zip World Fforest", "Bounce Below", "Easy Snowdon walk", "Bike trails"],
        "activityTypes": ["zip-lining", "hiking", "mountain-biking"],
    },
    {
        "slug": "mountain-biking-epic",
        "title": "Mountain Biking Epic",
        "tagline": "Four days hitting Wales' best trails",
        "region": "snowdonia",
        "days": 4,
        "difficulty": "difficult",
        "groupType": "friends, solo",
        "bestSeason": "April-October",
        "highlights": ["Coed y Brenin", "Antur Stiniog", "BikePark Wales"],
        "activityTypes": ["mountain-biking"],
    },
    {
        "slug": "summit-challenge",
        "title": "Summit Challenge",
        "tagline": "Bag the biggest peaks in Eryri",
        "region": "snowdonia",
        "days": 3,
        "difficulty": "difficult",
        "groupType": "experienced hikers",
        "bestSeason": "May-September",
        "highlights": ["Snowdon via Crib Goch", "Tryfan", "Glyderau"],
        "activityTypes": ["hiking", "climbing"],
    },
    {
        "slug": "beginners-adventure-taster",
        "title": "Beginner's Adventure Taster",
        "tagline": "Your first taste of Welsh adventure",
        "region": "snowdonia",
        "days": 2,
        "difficulty": "easy",
        "groupType": "beginners, couples",
        "bestSeason": "May-September",
        "highlights": ["Gentle hike", "Fforest Coaster", "Gorge walking intro"],
        "activityTypes": ["hiking", "zip-lining", "gorge-walking"],
    },
    {
        "slug": "adrenaline-junkie-weekend",
        "title": "Adrenaline Junkie Weekend",
        "tagline": "Maximum thrills in minimum time",
        "region": "snowdonia",
        "days": 2,
        "difficulty": "difficult",
        "groupType": "thrill-seekers",
        "bestSeason": "March-October",
        "highlights": ["Velocity 2", "Crib Goch", "White water rafting"],
        "activityTypes": ["zip-lining", "hiking", "gorge-walking"],
    },
    {
        "slug": "photography-adventure",
        "title": "Photography & Adventure",
        "tagline": "Capture Snowdonia at its most dramatic",
        "region": "snowdonia",
        "days": 3,
        "difficulty": "easy",
        "groupType": "photographers, couples",
        "bestSeason": "September-November",
        "highlights": ["Golden hour hikes", "Waterfall trails", "Coastal views"],
        "activityTypes": ["hiking", "kayaking"],
    },
    {
        "slug": "winter-adventure",
        "title": "Winter Adventure Weekend",
        "tagline": "Snowdonia doesn't close for winter",
        "region": "snowdonia",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "experienced, couples",
        "bestSeason": "December-February",
        "highlights": ["Winter hiking", "Bounce Below", "Underground adventures"],
        "activityTypes": ["hiking", "zip-lining", "caving"],
    },
    {
        "slug": "snowdonia-zip-world-tour",
        "title": "Zip World Grand Tour",
        "tagline": "Every Zip World experience in one epic trip",
        "region": "snowdonia",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "families, friends",
        "bestSeason": "March-October",
        "highlights": ["Velocity 2", "Bounce Below", "Caverns", "Fforest Coaster", "Skyride"],
        "activityTypes": ["zip-lining"],
    },
    {
        "slug": "snowdonia-without-a-car",
        "title": "Snowdonia Without a Car",
        "tagline": "Adventure by bus, train, and foot",
        "region": "snowdonia",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "solo, budget",
        "bestSeason": "May-September",
        "highlights": ["Snowdon Sherpa bus", "Conwy Valley Line", "Coastal paths"],
        "activityTypes": ["hiking", "zip-lining"],
    },
    {
        "slug": "snowdonia-rainy-day-plan",
        "title": "Rainy Day Champions",
        "tagline": "All-weather adventures that love the rain",
        "region": "snowdonia",
        "days": 2,
        "difficulty": "easy",
        "groupType": "families, anyone",
        "bestSeason": "Year-round",
        "highlights": ["Bounce Below", "Llechwedd caverns", "Gorge walking", "White water"],
        "activityTypes": ["zip-lining", "gorge-walking", "caving"],
    },
    {
        "slug": "snowdonia-wild-camping-trail",
        "title": "Wild Camping & Wild Swimming",
        "tagline": "Sleep under the stars, swim in mountain lakes",
        "region": "snowdonia",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "experienced, solo",
        "bestSeason": "June-September",
        "highlights": ["Llyn Idwal wild swim", "Cwm Idwal camping", "Summit sunrise"],
        "activityTypes": ["hiking", "wild-swimming"],
    },
    {
        "slug": "snowdonia-dog-friendly",
        "title": "Dog-Friendly Snowdonia",
        "tagline": "Adventures your dog will love too",
        "region": "snowdonia",
        "days": 2,
        "difficulty": "easy",
        "groupType": "dog owners",
        "bestSeason": "March-October",
        "highlights": ["Dog-friendly trails", "Beach walks", "Pet-friendly pubs"],
        "activityTypes": ["hiking", "wild-swimming"],
    },

    # =========================================================================
    # PEMBROKESHIRE (9)
    # =========================================================================
    {
        "slug": "pembrokeshire-coasteering-break",
        "title": "Pembrokeshire Coasteering Break",
        "tagline": "Two days of cliff jumping and coastal thrills",
        "region": "pembrokeshire",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "friends, couples",
        "bestSeason": "May-September",
        "highlights": ["TYF coasteering", "Blue Lagoon", "St Davids"],
        "activityTypes": ["coasteering", "kayaking"],
    },
    {
        "slug": "coastal-wild-swimming",
        "title": "Coastal Wild Swimming Trail",
        "tagline": "Pembrokeshire's secret swim spots",
        "region": "pembrokeshire",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "wild swimmers",
        "bestSeason": "June-September",
        "highlights": ["Blue Lagoon", "Hidden coves", "Guided swims"],
        "activityTypes": ["wild-swimming", "coasteering"],
    },
    {
        "slug": "romantic-adventure-escape",
        "title": "Romantic Adventure Escape",
        "tagline": "Adventure for two on the Pembrokeshire coast",
        "region": "pembrokeshire",
        "days": 3,
        "difficulty": "easy",
        "groupType": "couples",
        "bestSeason": "May-September",
        "highlights": ["Sunset kayaking", "Coastal walks", "Beach picnics"],
        "activityTypes": ["kayaking", "hiking", "surfing"],
    },
    {
        "slug": "pembrokeshire-family-coastal",
        "title": "Pembrokeshire Family Coastal Adventure",
        "tagline": "Beaches, boats, and beginner coasteering",
        "region": "pembrokeshire",
        "days": 4,
        "difficulty": "easy",
        "groupType": "families",
        "bestSeason": "June-August",
        "highlights": ["Family coasteering", "Ramsey Island boat trip", "Beach days"],
        "activityTypes": ["coasteering", "kayaking", "surfing"],
    },
    {
        "slug": "pembrokeshire-surf-week",
        "title": "Pembrokeshire Surf & Sea Week",
        "tagline": "Learn to surf on Wales' best waves",
        "region": "pembrokeshire",
        "days": 5,
        "difficulty": "moderate",
        "groupType": "surfers, beginners",
        "bestSeason": "May-October",
        "highlights": ["Whitesands surfing", "Newgale beach", "SUP at Barafundle"],
        "activityTypes": ["surfing", "kayaking", "coasteering"],
    },
    {
        "slug": "pembrokeshire-island-hopping",
        "title": "Pembrokeshire Island Explorer",
        "tagline": "Wildlife, puffins, and sea stacks",
        "region": "pembrokeshire",
        "days": 3,
        "difficulty": "easy",
        "groupType": "nature lovers, families",
        "bestSeason": "May-July",
        "highlights": ["Skomer puffins", "Ramsey seals", "Coastal walks"],
        "activityTypes": ["kayaking", "hiking"],
    },
    {
        "slug": "pembrokeshire-stag-hen-weekend",
        "title": "Pembrokeshire Stag & Hen Adventure",
        "tagline": "Adrenaline-fuelled celebrations on the coast",
        "region": "pembrokeshire",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "stag, hen",
        "bestSeason": "May-September",
        "highlights": ["Group coasteering", "Surf lessons", "Evening in St Davids"],
        "activityTypes": ["coasteering", "surfing", "kayaking"],
    },
    {
        "slug": "pembrokeshire-winter-coast",
        "title": "Pembrokeshire Winter Coast",
        "tagline": "Storm watching and wild walks",
        "region": "pembrokeshire",
        "days": 2,
        "difficulty": "easy",
        "groupType": "couples, solo",
        "bestSeason": "November-February",
        "highlights": ["Storm watching", "Empty beaches", "Coastal path"],
        "activityTypes": ["hiking", "wild-swimming"],
    },

    # =========================================================================
    # BRECON BEACONS (7)
    # =========================================================================
    {
        "slug": "solo-traveler-trail",
        "title": "Solo Traveler Trail",
        "tagline": "Safe, social solo adventures in the Beacons",
        "region": "brecon-beacons",
        "days": 4,
        "difficulty": "moderate",
        "groupType": "solo",
        "bestSeason": "May-September",
        "highlights": ["Group activities", "Hostel social scene", "Pen y Fan"],
        "activityTypes": ["hiking", "caving", "gorge-walking"],
    },
    {
        "slug": "caving-and-climbing",
        "title": "Caving & Climbing Weekend",
        "tagline": "Go underground and vertical in the Beacons",
        "region": "brecon-beacons",
        "days": 2,
        "difficulty": "difficult",
        "groupType": "thrill-seekers",
        "bestSeason": "Year-round",
        "highlights": ["Cave systems", "Rock climbing", "Gorge scrambling"],
        "activityTypes": ["caving", "climbing", "gorge-walking"],
    },
    {
        "slug": "brecon-beacons-waterfall-country",
        "title": "Waterfall Country Explorer",
        "tagline": "Chase waterfalls through ancient woodland",
        "region": "brecon-beacons",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "families, photographers",
        "bestSeason": "April-October",
        "highlights": ["Sgwd yr Eira walk-behind waterfall", "Four Falls Trail", "Gorge walking"],
        "activityTypes": ["hiking", "gorge-walking"],
    },
    {
        "slug": "brecon-beacons-family-weekend",
        "title": "Brecon Beacons Family Weekend",
        "tagline": "Caves, bikes, and gentle peaks for little legs",
        "region": "brecon-beacons",
        "days": 2,
        "difficulty": "easy",
        "groupType": "families",
        "bestSeason": "May-September",
        "highlights": ["Dan yr Ogof caves", "Bike trails", "Easy summit walks"],
        "activityTypes": ["caving", "mountain-biking", "hiking"],
    },
    {
        "slug": "brecon-beacons-dark-sky",
        "title": "Dark Sky Adventure",
        "tagline": "Daytime thrills, stargazing at night",
        "region": "brecon-beacons",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "couples, photographers",
        "bestSeason": "October-March",
        "highlights": ["Pen y Fan sunset hike", "International Dark Sky Reserve", "Night photography"],
        "activityTypes": ["hiking", "caving"],
    },
    {
        "slug": "brecon-beacons-bike-and-hike",
        "title": "Brecon Bike & Hike",
        "tagline": "BikePark Wales meets mountain summits",
        "region": "brecon-beacons",
        "days": 3,
        "difficulty": "difficult",
        "groupType": "fitness enthusiasts",
        "bestSeason": "April-October",
        "highlights": ["BikePark Wales", "Pen y Fan", "Taff Trail"],
        "activityTypes": ["mountain-biking", "hiking"],
    },
    {
        "slug": "brecon-beacons-gorge-weekend",
        "title": "Gorge & Cave Weekend",
        "tagline": "Get wet underground and in the gorges",
        "region": "brecon-beacons",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "friends, adventure groups",
        "bestSeason": "April-October",
        "highlights": ["Waterfall Country gorge walk", "Cave exploration", "River swimming"],
        "activityTypes": ["gorge-walking", "caving", "wild-swimming"],
    },

    # =========================================================================
    # GOWER (5)
    # =========================================================================
    {
        "slug": "gower-surf-and-coasteer",
        "title": "Gower Surf & Coasteer",
        "tagline": "Wales' original AONB, waves and cliffs",
        "region": "gower",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "friends, couples",
        "bestSeason": "May-September",
        "highlights": ["Llangennith surfing", "Gower coasteering", "Rhossili Bay"],
        "activityTypes": ["surfing", "coasteering"],
    },
    {
        "slug": "gower-family-beach-adventure",
        "title": "Gower Family Beach Adventure",
        "tagline": "Rock pools, beaches, and gentle thrills",
        "region": "gower",
        "days": 3,
        "difficulty": "easy",
        "groupType": "families",
        "bestSeason": "June-August",
        "highlights": ["Three Cliffs Bay", "Rock pooling", "Beginner surfing"],
        "activityTypes": ["surfing", "hiking"],
    },
    {
        "slug": "gower-couples-escape",
        "title": "Gower Romantic Escape",
        "tagline": "Sunset beaches and sea breezes",
        "region": "gower",
        "days": 2,
        "difficulty": "easy",
        "groupType": "couples",
        "bestSeason": "May-September",
        "highlights": ["Rhossili sunset", "Worm's Head walk", "Coastal path"],
        "activityTypes": ["hiking", "surfing"],
    },
    {
        "slug": "gower-wild-swimming-weekend",
        "title": "Gower Wild Swimming Weekend",
        "tagline": "Coves, caves, and cold water therapy",
        "region": "gower",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "wild swimmers",
        "bestSeason": "June-September",
        "highlights": ["Blue Pool", "Fall Bay", "Three Cliffs Bay"],
        "activityTypes": ["wild-swimming", "coasteering"],
    },
    {
        "slug": "gower-day-trip-from-cardiff",
        "title": "Gower Day Trip from Cardiff",
        "tagline": "Beach adventure an hour from the city",
        "region": "gower",
        "days": 1,
        "difficulty": "easy",
        "groupType": "anyone",
        "bestSeason": "May-September",
        "highlights": ["Rhossili Bay", "Surfing lesson", "Coastal walk"],
        "activityTypes": ["surfing", "hiking"],
    },

    # =========================================================================
    # ANGLESEY (4)
    # =========================================================================
    {
        "slug": "kayaking-explorer",
        "title": "Anglesey Kayaking Explorer",
        "tagline": "Paddle around Wales' island paradise",
        "region": "anglesey",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "paddlers, nature lovers",
        "bestSeason": "May-September",
        "highlights": ["Sea kayaking", "Holy Island", "Seal spotting"],
        "activityTypes": ["kayaking", "coasteering"],
    },
    {
        "slug": "anglesey-kitesurfing-weekend",
        "title": "Anglesey Kitesurfing Weekend",
        "tagline": "Ride the wind at Rhosneigr",
        "region": "anglesey",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "kitesurfers, watersports",
        "bestSeason": "April-October",
        "highlights": ["Rhosneigr beach", "Kite lessons", "Windsurfing"],
        "activityTypes": ["surfing", "kayaking"],
    },
    {
        "slug": "anglesey-coastal-path",
        "title": "Anglesey Coastal Path Highlights",
        "tagline": "The best sections of the 125-mile loop",
        "region": "anglesey",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "walkers, nature lovers",
        "bestSeason": "May-September",
        "highlights": ["South Stack cliffs", "Llanddwyn Island", "Beaumaris Castle"],
        "activityTypes": ["hiking", "wild-swimming"],
    },
    {
        "slug": "anglesey-family-adventure",
        "title": "Anglesey Family Adventure",
        "tagline": "Island adventures for all the family",
        "region": "anglesey",
        "days": 2,
        "difficulty": "easy",
        "groupType": "families",
        "bestSeason": "June-August",
        "highlights": ["Beach kayaking", "Coastal walks", "Puffin spotting"],
        "activityTypes": ["kayaking", "hiking"],
    },

    # =========================================================================
    # MID WALES (3)
    # =========================================================================
    {
        "slug": "mid-wales-mtb-trail",
        "title": "Mid Wales Mountain Bike Trail",
        "tagline": "Empty trails and epic descents at Dyfi",
        "region": "mid-wales",
        "days": 3,
        "difficulty": "difficult",
        "groupType": "mountain bikers",
        "bestSeason": "April-October",
        "highlights": ["Dyfi Bike Park", "Machynlleth trails", "Hafren Forest"],
        "activityTypes": ["mountain-biking"],
    },
    {
        "slug": "mid-wales-river-adventure",
        "title": "Mid Wales River Adventure",
        "tagline": "Kayak, swim, and fish on hidden rivers",
        "region": "mid-wales",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "nature lovers",
        "bestSeason": "June-September",
        "highlights": ["River Wye paddling", "Wild swimming", "Elan Valley reservoirs"],
        "activityTypes": ["kayaking", "wild-swimming"],
    },
    {
        "slug": "mid-wales-off-grid-escape",
        "title": "Mid Wales Off-Grid Escape",
        "tagline": "No signal, no crowds, pure Wales",
        "region": "mid-wales",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "solo, couples",
        "bestSeason": "May-September",
        "highlights": ["Elan Valley", "Red kite country", "Night sky walks"],
        "activityTypes": ["hiking", "wild-swimming"],
    },

    # =========================================================================
    # WYE VALLEY (3)
    # =========================================================================
    {
        "slug": "wye-valley-canoe-and-climb",
        "title": "Wye Valley Canoe & Climb",
        "tagline": "Paddle the Wye, scale the cliffs",
        "region": "wye-valley",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "friends, couples",
        "bestSeason": "April-October",
        "highlights": ["Wye canoeing", "Symonds Yat climbing", "Tintern Abbey walk"],
        "activityTypes": ["kayaking", "climbing", "hiking"],
    },
    {
        "slug": "wye-valley-family-adventure",
        "title": "Wye Valley Family Adventure",
        "tagline": "Gentle river days and forest trails",
        "region": "wye-valley",
        "days": 2,
        "difficulty": "easy",
        "groupType": "families",
        "bestSeason": "May-September",
        "highlights": ["Family canoeing", "Forest of Dean trails", "Puzzlewood"],
        "activityTypes": ["kayaking", "hiking", "mountain-biking"],
    },
    {
        "slug": "wye-valley-autumn-trail",
        "title": "Wye Valley Autumn Trail",
        "tagline": "The best autumn colours in Wales",
        "region": "wye-valley",
        "days": 2,
        "difficulty": "easy",
        "groupType": "walkers, photographers",
        "bestSeason": "October-November",
        "highlights": ["Autumn foliage walks", "River Wye paddle", "Offa's Dyke sections"],
        "activityTypes": ["hiking", "kayaking"],
    },

    # =========================================================================
    # NORTH WALES COAST (3)
    # =========================================================================
    {
        "slug": "north-wales-coast-family-fun",
        "title": "North Wales Coast Family Fun",
        "tagline": "Easy access adventure from the A55",
        "region": "north-wales",
        "days": 2,
        "difficulty": "easy",
        "groupType": "families",
        "bestSeason": "June-August",
        "highlights": ["Zip World", "Conwy Castle", "Great Orme"],
        "activityTypes": ["zip-lining", "hiking"],
    },
    {
        "slug": "north-wales-adrenaline-day",
        "title": "North Wales Adrenaline Day",
        "tagline": "Maximum thrills in a single day",
        "region": "north-wales",
        "days": 1,
        "difficulty": "difficult",
        "groupType": "thrill-seekers",
        "bestSeason": "March-October",
        "highlights": ["Velocity 2", "Surf Snowdonia", "Via Ferrata"],
        "activityTypes": ["zip-lining", "surfing"],
    },
    {
        "slug": "north-wales-budget-weekend",
        "title": "North Wales Budget Weekend",
        "tagline": "Adventure under £50 per person",
        "region": "north-wales",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "budget",
        "bestSeason": "May-September",
        "highlights": ["Free hikes", "Cheap camping", "Coed y Brenin free trails"],
        "activityTypes": ["hiking", "mountain-biking", "wild-swimming"],
    },

    # =========================================================================
    # SOUTH WALES VALLEYS (3)
    # =========================================================================
    {
        "slug": "multi-sport-challenge",
        "title": "South Wales Multi-Sport Challenge",
        "tagline": "Bike, climb, paddle, repeat",
        "region": "south-wales",
        "days": 4,
        "difficulty": "difficult",
        "groupType": "fitness enthusiasts",
        "bestSeason": "April-October",
        "highlights": ["BikePark Wales", "Climbing", "Surfing"],
        "activityTypes": ["mountain-biking", "climbing", "surfing"],
    },
    {
        "slug": "south-wales-bikepark-weekend",
        "title": "BikePark Wales Weekend",
        "tagline": "Two days of downhill at the UK's best bike park",
        "region": "south-wales",
        "days": 2,
        "difficulty": "moderate",
        "groupType": "mountain bikers",
        "bestSeason": "Year-round",
        "highlights": ["40+ trails", "Uplift service", "Coaching sessions"],
        "activityTypes": ["mountain-biking"],
    },
    {
        "slug": "south-wales-day-trip-cardiff",
        "title": "South Wales Adventure Day Trip",
        "tagline": "Escape Cardiff for a day of action",
        "region": "south-wales",
        "days": 1,
        "difficulty": "moderate",
        "groupType": "anyone",
        "bestSeason": "Year-round",
        "highlights": ["BikePark Wales", "Waterfall walks", "Caving"],
        "activityTypes": ["mountain-biking", "hiking", "caving"],
    },

    # =========================================================================
    # MULTI-REGION (5)
    # =========================================================================
    {
        "slug": "wales-grand-tour",
        "title": "Wales Grand Adventure Tour",
        "tagline": "Seven days covering the best of Wales",
        "region": "multi",
        "days": 7,
        "difficulty": "moderate",
        "groupType": "anyone",
        "bestSeason": "May-September",
        "highlights": ["Snowdonia", "Pembrokeshire", "Brecon Beacons", "Gower"],
        "activityTypes": ["hiking", "coasteering", "zip-lining", "mountain-biking"],
    },
    {
        "slug": "wales-without-a-car",
        "title": "Wales Without a Car",
        "tagline": "Public transport adventure across Wales",
        "region": "multi",
        "days": 5,
        "difficulty": "moderate",
        "groupType": "solo, budget",
        "bestSeason": "May-September",
        "highlights": ["TrawsCymru bus", "Heart of Wales Line", "Coastal buses"],
        "activityTypes": ["hiking", "surfing", "coasteering"],
    },
    {
        "slug": "48-hours-of-adrenaline",
        "title": "48 Hours of Adrenaline",
        "tagline": "Non-stop thrills across North Wales",
        "region": "multi",
        "days": 2,
        "difficulty": "difficult",
        "groupType": "thrill-seekers, stag",
        "bestSeason": "March-October",
        "highlights": ["Velocity 2", "Coasteering", "White water rafting", "Crib Goch"],
        "activityTypes": ["zip-lining", "coasteering", "gorge-walking", "hiking"],
    },
    {
        "slug": "wales-first-timer-sampler",
        "title": "First-Timer's Wales Sampler",
        "tagline": "The greatest hits for your first Welsh adventure",
        "region": "multi",
        "days": 4,
        "difficulty": "easy",
        "groupType": "beginners, families",
        "bestSeason": "May-September",
        "highlights": ["Snowdon", "Pembrokeshire coast", "Zip World", "Beach day"],
        "activityTypes": ["hiking", "coasteering", "zip-lining"],
    },
    {
        "slug": "wales-under-50-budget",
        "title": "Wales Adventure Under £50",
        "tagline": "Proof that the best things in Wales are free (or nearly)",
        "region": "multi",
        "days": 3,
        "difficulty": "moderate",
        "groupType": "budget, solo, students",
        "bestSeason": "May-September",
        "highlights": ["Free hiking", "Wild camping", "Free MTB trails", "Wild swimming"],
        "activityTypes": ["hiking", "mountain-biking", "wild-swimming"],
    },
]


# =============================================================================
# SYSTEM PROMPT
# =============================================================================

ITINERARY_SYSTEM = """You are a Welsh adventure travel expert who has lived in Wales for 20 years.
You've guided hundreds of trips and know every trail, every weather pattern, every traffic jam.

You are generating STRUCTURED JSON data for an itinerary engine. Your output powers a web app
that shows hour-by-hour trip plans with maps, cost breakdowns, and alternative options.

WHAT MAKES YOUR DATA VALUABLE:
1. REALISTIC TIMING - Real drive times between stops. Actual activity durations.
2. REAL PLACES - Actual GPS coordinates, real restaurant names, genuine operators
3. WET WEATHER ALTERNATIVES - For every outdoor stop, an indoor/covered backup
4. BUDGET ALTERNATIVES - Free or cheap swaps for every paid activity
5. LOCAL KNOWLEDGE - Traffic tips, parking reality, crowd avoidance
6. HONEST SUITABILITY - Who this trip is genuinely for and who should skip it

WHAT TO AVOID:
- Made-up restaurant names or fake businesses
- Implausible drive times
- Generic "any local cafe" suggestions
- Activities that don't exist in this region
- GPS coordinates that are obviously wrong"""


# =============================================================================
# DATA LOADING
# =============================================================================

def load_csv(filename_part: str) -> list[dict]:
    """Load CSV from data directory by partial name match."""
    for f in DATA_DIR.glob("*.csv"):
        if filename_part.lower() in f.name.lower():
            with open(f, newline="", encoding="utf-8") as csvfile:
                return list(csv.DictReader(csvfile))
    return []


def load_all_data() -> dict:
    """Load all seed data."""
    return {
        "activities": load_csv("activities"),
        "accommodation": load_csv("accommodation"),
        "locations": load_csv("locations"),
        "operators": load_csv("operators"),
    }


def get_region_data(data: dict, region: str) -> dict:
    """Filter data for a specific region."""
    def matches(item, region):
        for field in ["Region", "Regions Covered"]:
            val = item.get(field, "").lower()
            if region.replace("-", " ") in val or region in val:
                return True
        return False

    if region == "multi":
        return data  # Return all data for multi-region trips

    return {
        "activities": [a for a in data["activities"] if matches(a, region)],
        "accommodation": [a for a in data["accommodation"] if matches(a, region)],
        "locations": [a for a in data["locations"] if matches(a, region)],
        "operators": [a for a in data["operators"] if matches(a, region)],
    }


# =============================================================================
# GENERATION
# =============================================================================

def create_client():
    """Configure Gemini and return model."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-2.0-flash")


def generate_itinerary_json(model, spec: dict, region_data: dict) -> dict | None:
    """Generate a single itinerary JSON stub."""

    # Build context from our database
    activities_context = json.dumps([{
        "name": a.get("Activity Name"),
        "type": a.get("Type"),
        "operator": a.get("Operator"),
        "location": a.get("Location/Meeting Point"),
        "price": a.get("Price Range (£)"),
        "duration": a.get("Duration"),
        "difficulty": a.get("Difficulty"),
        "min_age": a.get("Min Age"),
        "season": a.get("Season"),
    } for a in region_data["activities"][:25]], indent=2)

    accommodation_context = json.dumps([{
        "name": a.get("Property Name", a.get("Name", "")),
        "type": a.get("Type"),
        "location": a.get("Location"),
        "price_per_night": a.get("Price/Night (£)"),
    } for a in region_data["accommodation"][:15]], indent=2)

    locations_context = json.dumps([{
        "name": a.get("Location Name"),
        "gps": a.get("GPS Coordinates"),
        "activities": a.get("Activities Available"),
        "parking": a.get("Parking Info"),
    } for a in region_data["locations"][:15]], indent=2)

    prompt = f"""{ITINERARY_SYSTEM}

---

ITINERARY TO CREATE:
Title: {spec["title"]}
Tagline: {spec["tagline"]}
Region: {spec["region"]}
Duration: {spec["days"]} days
Difficulty: {spec["difficulty"]}
Group type: {spec["groupType"]}
Best season: {spec["bestSeason"]}
Highlights: {", ".join(spec["highlights"])}
Activity types: {", ".join(spec["activityTypes"])}

ACTIVITIES IN OUR DATABASE FOR THIS REGION:
{activities_context}

ACCOMMODATION IN OUR DATABASE:
{accommodation_context}

LOCATIONS WITH GPS IN OUR DATABASE:
{locations_context}

---

Generate a complete itinerary stub as JSON. Follow this EXACT structure:

{{
  "slug": "{spec["slug"]}",
  "title": "{spec["title"]}",
  "tagline": "{spec["tagline"]}",
  "region": "{spec["region"]}",
  "days": {spec["days"]},
  "difficulty": "{spec["difficulty"]}",
  "bestSeason": "{spec["bestSeason"]}",
  "groupType": "{spec["groupType"]}",
  "priceFrom": <number - realistic minimum total cost per person>,
  "priceTo": <number - realistic maximum total cost per person>,
  "budgetPriceFrom": <number - budget version minimum>,
  "budgetPriceTo": <number - budget version maximum>,
  "highlights": {json.dumps(spec["highlights"])},
  "activityTypes": {json.dumps(spec["activityTypes"])},
  "suitableFor": "<who this trip is genuinely for - be specific>",
  "notSuitableFor": "<who should skip this - be honest>",
  "weatherDependency": "<how weather-dependent is this trip? high/medium/low>",
  "packingEssentials": ["<item 1>", "<item 2>", "..."],
  "stops": [
    {{
      "day": 1,
      "orderIndex": 1,
      "time": "09:00",
      "type": "activity",
      "title": "<activity name>",
      "description": "<1-2 sentences about what to expect>",
      "duration": "<e.g. 2 hours>",
      "costFrom": <number>,
      "costTo": <number>,
      "lat": <decimal - real GPS latitude>,
      "lng": <decimal - real GPS longitude>,
      "travelToNext": "<e.g. 25min drive via A5>",
      "travelMode": "drive",
      "wetAlt": {{
        "title": "<indoor/covered alternative>",
        "description": "<1 sentence>",
        "costFrom": <number>,
        "costTo": <number>
      }},
      "budgetAlt": {{
        "title": "<free or cheap alternative>",
        "description": "<1 sentence>",
        "costFrom": <number>,
        "costTo": <number>
      }}
    }},
    {{
      "day": 1,
      "orderIndex": 2,
      "time": "12:30",
      "type": "food",
      "title": "<real restaurant/cafe name>",
      "foodType": "lunch",
      "description": "<1 sentence - what kind of place>",
      "costFrom": <number per person>,
      "costTo": <number per person>,
      "lat": <decimal>,
      "lng": <decimal>,
      "travelToNext": "<drive/walk time to next stop>",
      "travelMode": "walk",
      "budgetAlt": {{
        "title": "<packed lunch at scenic spot>",
        "description": "<specific location name>"
      }}
    }},
    {{
      "day": 1,
      "orderIndex": 3,
      "time": "14:00",
      "type": "activity",
      "title": "<afternoon activity>",
      "description": "<what to expect>",
      "duration": "<duration>",
      "costFrom": <number>,
      "costTo": <number>,
      "lat": <decimal>,
      "lng": <decimal>,
      "travelToNext": "<to accommodation>",
      "travelMode": "drive",
      "wetAlt": {{ "title": "...", "description": "...", "costFrom": 0, "costTo": 0 }},
      "budgetAlt": {{ "title": "...", "description": "...", "costFrom": 0, "costTo": 0 }}
    }},
    {{
      "day": 1,
      "orderIndex": 4,
      "time": "17:00",
      "type": "accommodation",
      "title": "<real accommodation name>",
      "description": "<type of place, why it suits this trip>",
      "costFrom": <per night>,
      "costTo": <per night>,
      "lat": <decimal>,
      "lng": <decimal>,
      "travelToNext": "<to first stop of next day>",
      "travelMode": "drive",
      "budgetAlt": {{
        "title": "<budget accommodation option>",
        "description": "<camping, hostel, etc>",
        "costFrom": <number>,
        "costTo": <number>
      }}
    }}
  ],
  "costBreakdown": {{
    "standard": {{
      "activities": <total>,
      "accommodation": <total>,
      "food": <total>,
      "transport": <total>,
      "total": <total>
    }},
    "budget": {{
      "activities": <total>,
      "accommodation": <total>,
      "food": <total>,
      "transport": <total>,
      "total": <total>
    }}
  }},
  "knowBeforeYouGo": {{
    "weather": "<weather reality for this trip>",
    "traffic": "<traffic and parking tips>",
    "booking": "<what needs advance booking>",
    "fitness": "<honest fitness requirement>"
  }}
}}

CRITICAL RULES:
1. Include 3-5 stops per day (activities + food + accommodation)
2. Every outdoor activity MUST have a wetAlt
3. Every paid stop MUST have a budgetAlt
4. Use REAL GPS coordinates for Welsh locations (latitude ~51.4-53.4, longitude ~-3.0 to -5.3)
5. Use real operator names, real restaurants, real accommodation from the database where possible
6. Drive times must be realistic for Welsh roads
7. Costs must be in GBP and realistic for 2025
8. Output VALID JSON only - no markdown, no commentary"""

    try:
        response = model.generate_content(prompt)
        text = response.text

        # Strip markdown wrappers
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.rstrip().endswith("```"):
            text = text.rstrip()[:-3]
        text = text.strip()

        # Parse JSON
        data = json.loads(text)
        return data

    except json.JSONDecodeError as e:
        print(f"  JSON PARSE ERROR: {e}")
        # Try to extract JSON from response
        try:
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        return None
    except Exception as e:
        print(f"  API ERROR: {e}")
        return None


def validate_itinerary(data: dict) -> list[str]:
    """Validate itinerary JSON structure."""
    issues = []

    required = ["slug", "title", "region", "days", "stops", "costBreakdown"]
    for field in required:
        if field not in data:
            issues.append(f"Missing required field: {field}")

    if "stops" in data:
        for i, stop in enumerate(data["stops"]):
            if "type" not in stop:
                issues.append(f"Stop {i}: missing type")
            if "lat" not in stop or "lng" not in stop:
                issues.append(f"Stop {i}: missing GPS coords")
            if stop.get("lat") and (stop["lat"] < 51.0 or stop["lat"] > 54.0):
                issues.append(f"Stop {i}: latitude {stop['lat']} outside Wales range")
            if stop.get("lng") and (stop["lng"] < -6.0 or stop["lng"] > -2.5):
                issues.append(f"Stop {i}: longitude {stop['lng']} outside Wales range")
            if stop.get("type") == "activity" and "wetAlt" not in stop:
                issues.append(f"Stop {i}: activity missing wetAlt")
    else:
        issues.append("No stops array")

    return issues


# =============================================================================
# MAIN GENERATION LOOP
# =============================================================================

def generate_itineraries(model, specs: list, data: dict):
    """Generate all itinerary JSON files."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    total = len(specs)
    success = 0
    failed = 0

    for i, spec in enumerate(specs, 1):
        slug = spec["slug"]
        filepath = OUTPUT_DIR / f"{slug}.json"

        # Skip if exists
        if filepath.exists():
            print(f"[{i}/{total}] {slug} ... SKIPPED (exists)")
            continue

        print(f"[{i}/{total}] {slug} ... ", end="", flush=True)

        region_data = get_region_data(data, spec["region"])
        result = generate_itinerary_json(model, spec, region_data)

        if result:
            # Validate
            issues = validate_itinerary(result)
            if issues:
                print(f"WARNINGS: {', '.join(issues[:3])}")

            # Write
            with open(filepath, "w") as f:
                json.dump(result, f, indent=2, ensure_ascii=False)

            stops = len(result.get("stops", []))
            print(f"done ({stops} stops)")
            success += 1
        else:
            print("FAILED")
            failed += 1

        time.sleep(3)  # Rate limiting

    print(f"\n=== COMPLETE: {success} generated, {failed} failed ===")


def main():
    parser = argparse.ArgumentParser(description="Generate itinerary JSON stubs")
    parser.add_argument("--type", required=True,
                       help="all, region:<slug>, single:<slug>")
    parser.add_argument("--dry-run", action="store_true",
                       help="Show specs without generating")
    parser.add_argument("--force", action="store_true",
                       help="Overwrite existing files")

    args = parser.parse_args()

    os.chdir(PROJECT_ROOT)

    if args.dry_run:
        specs = ITINERARIES
        if args.type.startswith("region:"):
            region = args.type.split(":")[1]
            specs = [s for s in specs if s["region"] == region]
        elif args.type.startswith("single:"):
            slug = args.type.split(":")[1]
            specs = [s for s in specs if s["slug"] == slug]

        print(f"\n=== DRY RUN: {len(specs)} itineraries ===\n")
        for s in specs:
            exists = "EXISTS" if (OUTPUT_DIR / f"{s['slug']}.json").exists() else "NEW"
            print(f"  [{exists}] {s['slug']}: {s['title']} ({s['days']}d, {s['region']}, {s['difficulty']})")
        return

    # Load data
    print("Loading seed data...")
    data = load_all_data()
    print(f"  Activities: {len(data['activities'])}")
    print(f"  Accommodation: {len(data['accommodation'])}")
    print(f"  Locations: {len(data['locations'])}")
    print(f"  Operators: {len(data['operators'])}")

    # Filter specs
    specs = ITINERARIES
    if args.type.startswith("region:"):
        region = args.type.split(":")[1]
        specs = [s for s in specs if s["region"] == region]
    elif args.type.startswith("single:"):
        slug = args.type.split(":")[1]
        specs = [s for s in specs if s["slug"] == slug]
    elif args.type != "all":
        print(f"Unknown type: {args.type}")
        sys.exit(1)

    if args.force:
        for s in specs:
            fp = OUTPUT_DIR / f"{s['slug']}.json"
            if fp.exists():
                fp.unlink()

    print(f"\nGenerating {len(specs)} itineraries...\n")

    model = create_client()
    generate_itineraries(model, specs, data)

    print(f"\nOutput: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
