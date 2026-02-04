#!/usr/bin/env python3
"""
Generate Activity+Region combo page content using Gemini API.

Usage:
    python scripts/generate-combo-pages.py --tier 1
    python scripts/generate-combo-pages.py --single snowdonia--hiking
    python scripts/generate-combo-pages.py --tier 1 --dry-run
"""

import os
import sys
import json
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
OUTPUT_DIR = PROJECT_ROOT / "data" / "combo-pages"
RESEARCH_DIR = PROJECT_ROOT / "data" / "research"

# =============================================================================
# TIER 1 COMBOS (10 pages)
# =============================================================================

TIER_1 = [
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Snowdon/Yr Wyddfa, Tryfan, Crib Goch, Cadair Idris, Carneddau, Glyderau",
        "targetKeyword": "hiking in snowdonia",
        "knownSpots": "Snowdon (6 routes), Tryfan North Ridge, Crib Goch, Cadair Idris, Cwm Idwal, Y Garn, Rhinog Fawr, Nantlle Ridge, Snowdon Horseshoe, Aber Falls to Carneddau",
        "knownOperators": "Plas y Brenin, Snowdonia Mountain Guides, MountainXperience",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor (Llanberis), Cotswold Outdoor (Betws-y-Coed)",
        "knownFood": "Pete's Eats (Llanberis), Moel Siabod Cafe (Capel Curig), Pinnacle Cafe (Capel Curig), Y Stablau (Betws-y-Coed), Heights Hotel (Llanberis), Bryn Tyrch Inn (Capel Curig)",
    },
    {
        "region": "pembrokeshire",
        "regionName": "Pembrokeshire",
        "activity": "surfing",
        "activityName": "Surfing",
        "whyFamous": "Freshwater West, Manorbier, Newgale, Whitesands Bay, Broadhaven South",
        "targetKeyword": "surfing in pembrokeshire",
        "knownSpots": "Freshwater West, Newgale, Manorbier, Whitesands Bay, Broadhaven South, Marloes Sands, West Angle Bay",
        "knownOperators": "MUUK Adventures, Outer Reef Surf School, Preseli Venture",
        "knownGearShops": "Newsurf (Newgale), Ma Simes Surf Hut (St Davids), West Wales Surf Shop",
        "knownFood": "The Sloop Inn (Porthgain), Bench Bar (Newgale), The Druidstone (Broad Haven), The Shed (Porthgain), Bishops (St Davids), Really Wild Emporium",
    },
    {
        "region": "pembrokeshire",
        "regionName": "Pembrokeshire",
        "activity": "coasteering",
        "activityName": "Coasteering",
        "whyFamous": "Birthplace of coasteering, St Davids, Abereiddy Blue Lagoon, Stackpole",
        "targetKeyword": "coasteering pembrokeshire",
        "knownSpots": "Abereiddy Blue Lagoon, St Davids Head, Stackpole Quay, St Non's Bay, Porthclais, Abercastle, Preseli cliffs",
        "knownOperators": "TYF Adventure, Activity Pembrokeshire, Preseli Venture, Celtic Quest Coasteering, MUUK Adventures, Outer Reef Surf School",
        "knownGearShops": "Ma Simes Surf Hut, TYF Shop (St Davids)",
        "knownFood": "The Sampler (St Davids), The Shed (Porthgain), The Sloop Inn (Porthgain), Bishops (St Davids), Bench Bar (Newgale), CWT (St Davids)",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "climbing",
        "activityName": "Climbing",
        "whyFamous": "Tryfan, Crib Goch, Idwal Slabs, Llanberis Pass, Tremadoc",
        "targetKeyword": "climbing in snowdonia",
        "knownSpots": "Tryfan, Idwal Slabs, Clogwyn Du'r Arddu (Cloggy), Dinas Mot, Dinas Cromlech, Tremadoc, Craig yr Ysfa, Milestone Buttress, Lliwedd",
        "knownOperators": "Plas y Brenin, Snowdonia Mountain Guides, MountainXperience",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor (Llanberis), Cotswold Outdoor (Betws-y-Coed), Siop Pinnacle",
        "knownFood": "Pete's Eats, Bryn Tyrch Inn, Heights Hotel, Gallt y Glyn, Vaynol Arms",
    },
    {
        "region": "gower",
        "regionName": "Gower",
        "activity": "surfing",
        "activityName": "Surfing",
        "whyFamous": "Llangennith/Rhossili, UK's first AONB, consistent Atlantic swells",
        "targetKeyword": "surfing in gower",
        "knownSpots": "Llangennith, Rhossili Bay, Langland Bay, Caswell Bay, Broughton Bay, Port Eynon, Oxwich Bay",
        "knownOperators": "Llangennith Surf School, Rip N Rock, Gower Activity Centres, Oxwich Watersports",
        "knownGearShops": "PJ's Surf Shop (Llangennith), Sam's Surf Shack, Gower Surf Development",
        "knownFood": "King's Head (Llangennith), Bay Bistro (Rhossili), Mewslade Bay beach cafe, The Ship Inn (Port Eynon), Verdi's (Mumbles), Pilot Inn (Mumbles)",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "zip-lining",
        "activityName": "Zip Lining",
        "whyFamous": "Zip World Velocity (world's fastest), Penrhyn Quarry, Bounce Below, Titan, Zip World Fforest",
        "targetKeyword": "zip lining snowdonia",
        "knownSpots": "Velocity 2 (Penrhyn Quarry), Titan (Blaenau Ffestiniog), Zip World Fforest (Betws-y-Coed), Bounce Below (Blaenau Ffestiniog), Caverns (Blaenau Ffestiniog), Quarry Karts, Skyride",
        "knownOperators": "Zip World",
        "knownGearShops": "Zip World on-site shops",
        "knownFood": "Zip World Penrhyn Quarry cafe, Blondies (Bethesda), Pete's Eats (Llanberis), The Cottage Loaf (Llanberis), Caffi Siabod (Capel Curig)",
    },
    {
        "region": "brecon-beacons",
        "regionName": "Brecon Beacons",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Pen y Fan, Fan y Big, Sugar Loaf, Waterfall Country, Black Mountains",
        "targetKeyword": "hiking brecon beacons",
        "knownSpots": "Pen y Fan, Corn Du, Fan y Big, Sugar Loaf, Skirrid Fawr, Waterfall Country (Four Falls Trail), Fan Brycheiniog, Craig y Nos, Table Mountain (Crug Hywel), Blorenge",
        "knownOperators": "Adventure Britain, Black Mountain Adventure",
        "knownGearShops": "Cotswold Outdoor (Brecon area), Blacks, local outdoor shops",
        "knownFood": "The Felin Fach Griffin, Cafe on the Square (Brecon), The Bear Hotel (Crickhowell), Nantyfin Cider Mill, Star Inn (Talybont-on-Usk), White Hart Brecon",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "mountain-biking",
        "activityName": "Mountain Biking",
        "whyFamous": "Coed y Brenin, Antur Stiniog, Penmachno, Gwydir Mawr",
        "targetKeyword": "mountain biking snowdonia",
        "knownSpots": "Coed y Brenin (MBR, Dragon's Back, Temtiwr), Antur Stiniog (downhill), Penmachno trails, Gwydir Mawr, Marin Trail (Betws-y-Coed), Beddgelert Forest",
        "knownOperators": "Antur Stiniog, Coed y Brenin (NRW)",
        "knownGearShops": "Beics Brenin (Coed y Brenin), Antur Stiniog bike hire, Beics Betws (Betws-y-Coed)",
        "knownFood": "Cross Foxes (Dolgellau), Meirion Mill Cafe, Y Stablau (Betws-y-Coed), TY Siamas Cafe (Dolgellau), Caffi Siabod",
    },
    {
        "region": "pembrokeshire",
        "regionName": "Pembrokeshire",
        "activity": "kayaking",
        "activityName": "Kayaking",
        "whyFamous": "Sea kayaking around Ramsey Island, seals, puffins, Bitches rapids",
        "targetKeyword": "kayaking pembrokeshire",
        "knownSpots": "Ramsey Island circumnavigation, The Bitches rapids, Skomer Island, Solva harbour, Porthclais, Abereiddy, Stackpole Quay to Barafundle, Milford Haven",
        "knownOperators": "TYF Adventure, MUUK Adventures, Activity Pembrokeshire, Preseli Venture",
        "knownGearShops": "TYF Shop (St Davids), Ma Simes",
        "knownFood": "The Sampler (St Davids), The Shed (Porthgain), Cwtch (St Davids), The Sloop Inn (Porthgain), Bench Bar (Newgale)",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "gorge-walking",
        "activityName": "Gorge Walking",
        "whyFamous": "Ogwen Valley, Swallow Falls, Fairy Glen, Aberglaslyn Gorge",
        "targetKeyword": "gorge walking snowdonia",
        "knownSpots": "Ogwen Valley gorges, Swallow Falls area, Fairy Glen (Betws-y-Coed), Aberglaslyn Gorge (Beddgelert), Conwy Falls, Nant Gwynant, Dolgarrog",
        "knownOperators": "Adventure Britain, Plas y Brenin, MountainXperience",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor",
        "knownFood": "Pete's Eats (Llanberis), Caffi Siabod (Capel Curig), Cobdens Hotel (Capel Curig), Ty Hyll Ugly House cafe",
    },
]

# =============================================================================
# TIER 2 COMBOS (12 pages)
# =============================================================================

TIER_2 = [
    {
        "region": "anglesey",
        "regionName": "Anglesey",
        "activity": "kayaking",
        "activityName": "Kayaking",
        "whyFamous": "Sea kayaking, Menai Strait, South Stack, Puffin Island",
        "targetKeyword": "kayaking anglesey",
        "knownSpots": "Menai Strait, South Stack, Puffin Island, Rhoscolyn, Aberffraw, Trearddur Bay, Church Bay, Penmon Point, Newborough Beach",
        "knownOperators": "Anglesey Adventures, Plas Menai",
        "knownGearShops": "Plas Menai shop, Anglesey Outdoors",
        "knownFood": "The Oyster Catcher (Rhosneigr), Sandy Mount House, Wavecrest Cafe (Rhoscolyn), The White Eagle (Rhoscolyn)",
    },
    {
        "region": "anglesey",
        "regionName": "Anglesey",
        "activity": "coasteering",
        "activityName": "Coasteering",
        "whyFamous": "Church Bay, South Stack, Rhoscolyn, dramatic sea cliffs",
        "targetKeyword": "coasteering anglesey",
        "knownSpots": "Church Bay, Rhoscolyn, South Stack, Trearddur Bay, Aberffraw, Porth Dafarch, Cable Bay",
        "knownOperators": "Anglesey Adventures, Plas Menai",
        "knownGearShops": "Anglesey Outdoors",
        "knownFood": "The Oyster Catcher (Rhosneigr), Wavecrest Cafe, Lobster Pot (Church Bay), The White Eagle (Rhoscolyn)",
    },
    {
        "region": "gower",
        "regionName": "Gower",
        "activity": "coasteering",
        "activityName": "Coasteering",
        "whyFamous": "Three Cliffs Bay, Mewslade, limestone cliffs, caves",
        "targetKeyword": "coasteering gower",
        "knownSpots": "Three Cliffs Bay, Mewslade Bay, Rhossili, Mumbles, Fall Bay, Pennard Castle cliffs, Worm's Head area, Paviland Cave",
        "knownOperators": "Gower Activity Centres, Rip N Rock, Quest Adventure, Oxwich Watersports",
        "knownGearShops": "PJ's Surf Shop (Llangennith), Gower Surf Development",
        "knownFood": "King's Head (Llangennith), The Ship Inn (Port Eynon), Verdi's (Mumbles), Joe's Ice Cream (Mumbles), Pilot Inn (Mumbles)",
    },
    {
        "region": "brecon-beacons",
        "regionName": "Brecon Beacons",
        "activity": "mountain-biking",
        "activityName": "Mountain Biking",
        "whyFamous": "Talybont, Bwlch, Gap routes, BikePark Wales",
        "targetKeyword": "mountain biking brecon beacons",
        "knownSpots": "BikePark Wales (Merthyr Tydfil), The Gap (Brecon), Bwlch loop, Talybont Reservoir loop, Coed Taf Fawr, Garwnant, Pontsticill, Taff Trail",
        "knownOperators": "BikePark Wales, Black Mountain Adventure",
        "knownGearShops": "BikePark Wales shop, Brecon Bikes, Biped Cycles (Brecon)",
        "knownFood": "Star Inn (Talybont-on-Usk), White Hart (Brecon), The Felin Fach Griffin, BikePark Wales cafe, Nantyfin Cider Mill",
    },
    {
        "region": "brecon-beacons",
        "regionName": "Brecon Beacons",
        "activity": "caving",
        "activityName": "Caving",
        "whyFamous": "OFD (Ogof Ffynnon Ddu), Porth yr Ogof, Dan yr Ogof, Cathedral Cave",
        "targetKeyword": "caving brecon beacons",
        "knownSpots": "Porth yr Ogof, Ogof Ffynnon Ddu (OFD), Dan yr Ogof Showcaves, Cathedral Cave, Bridge Cave, Cwm Dwr, Ogof Draenen",
        "knownOperators": "Adventure Britain, Black Mountain Adventure",
        "knownGearShops": "Starless River (caving gear), local outdoor shops",
        "knownFood": "The Ancient Briton (Pen-y-Cae), Gwyn Arms (Glyntawe), The Felin Fach Griffin, Dan yr Ogof cafe",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "caving",
        "activityName": "Caving",
        "whyFamous": "Cwmorthin slate mine, underground adventures, Go Below",
        "targetKeyword": "caving snowdonia",
        "knownSpots": "Cwmorthin Slate Mine, Go Below Underground Adventures (Blaenau Ffestiniog), Llechwedd Slate Caverns, Sygun Copper Mine, underground zip lines",
        "knownOperators": "Zip World (Bounce Below, Caverns), Go Below",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor (Llanberis)",
        "knownFood": "Caffi Llechwedd, Lakeside Cafe (Tanygrisiau), Isallt Cafe (Blaenau Ffestiniog), Pete's Eats (Llanberis)",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "wild-swimming",
        "activityName": "Wild Swimming",
        "whyFamous": "Llyn Idwal, Blue Lake (Dorothea quarry), waterfalls, mountain lakes",
        "targetKeyword": "wild swimming snowdonia",
        "knownSpots": "Llyn Idwal, Blue Lake (Dorothea Quarry), Fairy Glen (Betws-y-Coed), Llyn Gwynant, Llyn Dinas, Aber Falls plunge pool, Llyn Crafnant, Llyn Padarn, Roman Bridge pools",
        "knownOperators": "Plas y Brenin",
        "knownGearShops": "Joe Brown's (Llanberis), Siop Pinnacle",
        "knownFood": "Pete's Eats (Llanberis), Caffi Siabod, Y Stablau (Betws-y-Coed), Gwydyr Hotel (Betws-y-Coed)",
    },
    {
        "region": "pembrokeshire",
        "regionName": "Pembrokeshire",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Pembrokeshire Coast Path (186 miles), dramatic cliff walks",
        "targetKeyword": "hiking pembrokeshire",
        "knownSpots": "St Davids Head, Strumble Head, Marloes Peninsula, Stackpole Estate, Barafundle Bay walk, Green Bridge of Wales, Dinas Island, Newport to Cwm-yr-Eglwys, Skomer views",
        "knownOperators": "TYF Adventure, Preseli Venture",
        "knownGearShops": "Ma Simes (St Davids), TYF Shop, Mountain Warehouse (Haverfordwest)",
        "knownFood": "The Shed (Porthgain), The Sloop Inn (Porthgain), The Sampler (St Davids), Cafe Mor (Freshwater West), CWT (St Davids)",
    },
    {
        "region": "gower",
        "regionName": "Gower",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Worm's Head, Three Cliffs Bay, Rhossili, coastal walks",
        "targetKeyword": "hiking gower",
        "knownSpots": "Worm's Head, Three Cliffs Bay, Rhossili Bay, Arthur's Stone, Pennard Castle, Oxwich Bay to Three Cliffs, Llanmadoc Hill, Whiteford Burrows, Brandy Cove, Caswell to Langland",
        "knownOperators": "Gower Activity Centres",
        "knownGearShops": "Trespass (Mumbles), Mountain Warehouse (Swansea)",
        "knownFood": "Verdi's (Mumbles), Rhossili Bay Hotel, The King Arthur Hotel (Reynoldston), Bay Bistro, Castellamare (Mumbles), The Ship Inn (Port Eynon)",
    },
    {
        "region": "mid-wales",
        "regionName": "Mid Wales",
        "activity": "mountain-biking",
        "activityName": "Mountain Biking",
        "whyFamous": "Elan Valley, Nant yr Arian, Hafren Forest, quiet trails",
        "targetKeyword": "mountain biking mid wales",
        "knownSpots": "Nant yr Arian (Syfydrin, Summit, Pendam trails), Hafren Forest, Elan Valley trails, Machynlleth (Dyfi), Clywedog trails, Brechfa Forest, Irfon Forest",
        "knownOperators": "AberAdventures",
        "knownGearShops": "The Holey Trail (Machynlleth), Summit Cycles (Aberystwyth)",
        "knownFood": "Number 21 (Aberystwyth), Y Ffarmers (Llanfihangel-y-Creuddyn), Dyfi Cafe (Machynlleth), White Horse Tavern (Aberystwyth)",
    },
    {
        "region": "llyn-peninsula",
        "regionName": "Llŷn Peninsula",
        "activity": "surfing",
        "activityName": "Surfing",
        "whyFamous": "Porth Neigwl (Hell's Mouth), consistent swells, quieter than Gower",
        "targetKeyword": "surfing llyn peninsula",
        "knownSpots": "Porth Neigwl (Hell's Mouth), Porth Ceiriad, Porth Oer (Whistling Sands), Abersoch beach, Pwllheli, Aberdaron",
        "knownOperators": "Hell's Mouth Surf School, Abersoch Watersports, West Coast Surf",
        "knownGearShops": "West Coast Surf (Abersoch), Abersoch Watersports shop",
        "knownFood": "The Sun Inn (Abersoch), Venetia (Abersoch), The Ship (Abersoch), Ty Newydd (Aberdaron), Coconut Kitchen (Abersoch)",
    },
    {
        "region": "wye-valley",
        "regionName": "Wye Valley",
        "activity": "kayaking",
        "activityName": "Kayaking",
        "whyFamous": "River Wye paddling, Symonds Yat, gentle touring",
        "targetKeyword": "kayaking wye valley",
        "knownSpots": "Glasbury to Hay-on-Wye, Hay to Bredwardine, Ross-on-Wye to Symonds Yat, Symonds Yat rapids, Monmouth to Tintern, Bigsweir to Brockweir",
        "knownOperators": "Wye Valley Canoes, Black Mountain Adventure",
        "knownGearShops": "Wye Valley Canoes (hire), Paddles & Pedals (Hay-on-Wye)",
        "knownFood": "The Old Ferrie Inn (Symonds Yat), The Saracens Head (Symonds Yat), Blue Boar (Hay-on-Wye), Kilvert's (Hay-on-Wye), The Boat Inn (Penallt)",
    },
]

# =============================================================================
# TIER 3 COMBOS (12 pages)
# =============================================================================

TIER_3 = [
    {
        "region": "north-wales",
        "regionName": "North Wales",
        "activity": "climbing",
        "activityName": "Climbing",
        "whyFamous": "Llanberis Pass, Tremadog, Great Orme, indoor walls",
        "targetKeyword": "climbing north wales",
        "knownSpots": "Llanberis Pass (Cromlech, Dinas Mot), Tremadog (Eric Jones Cafe crag), Great Orme limestone, Gogarth sea cliffs, Craig y Forwen, Beacon Climbing Centre (Caernarfon), Indy Climbing Wall",
        "knownOperators": "Plas y Brenin, Snowdonia Mountain Guides, Raw Adventures",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor (Llanberis), Cotswold Outdoor",
        "knownFood": "Pete's Eats (Llanberis), Eric Jones Cafe (Tremadog), Heights Hotel, Vaynol Arms (Pentir)",
    },
    {
        "region": "south-wales",
        "regionName": "South Wales",
        "activity": "surfing",
        "activityName": "Surfing",
        "whyFamous": "Porthcawl, Rest Bay, Aberavon, surf schools",
        "targetKeyword": "surfing south wales",
        "knownSpots": "Rest Bay (Porthcawl), Coney Beach, Aberavon Beach, Ogmore-by-Sea, Llantwit Major, Southerndown, Barry Island, Langland Bay",
        "knownOperators": "Porthcawl Surf School, South Wales Surf School, Freewave Surf Academy",
        "knownGearShops": "Drift Surf (Porthcawl), Porthcawl Surf Shop, Surf Lines",
        "knownFood": "The Waterfront (Porthcawl), Hi Tide Inn (Porthcawl), Pelican Fish Bar (Ogmore), Muni Arts Centre cafe (Pontypridd)",
    },
    {
        "region": "carmarthenshire",
        "regionName": "Carmarthenshire",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Brechfa Forest, Llyn y Fan Fach, Dinefwr Park, Tywi Valley",
        "targetKeyword": "hiking carmarthenshire",
        "knownSpots": "Llyn y Fan Fach (Lady of the Lake), Dinefwr Park (NT), Brechfa Forest trails, Dryslwyn Castle walk, Carreg Cennen Castle, Aberglasney Gardens trails, Tywi Valley walks, Black Mountain edge",
        "knownOperators": "Sticks and Stones Adventures",
        "knownGearShops": "Mountain Warehouse (Carmarthen), local outdoor shops",
        "knownFood": "The Plough Inn (Llandeilo), The Angel Hotel (Llandeilo), Heavenly (Llandeilo), Wright's Food Emporium",
    },
    {
        "region": "mid-wales",
        "regionName": "Mid Wales",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Plynlimon, Elan Valley, Cambrian Mountains, Glyndwr's Way",
        "targetKeyword": "hiking mid wales",
        "knownSpots": "Plynlimon (source of Severn and Wye), Elan Valley trail, Hafren Forest, Glyndwr's Way, Devil's Bridge waterfalls, Strata Florida Abbey walk, Claerwen Reservoir, Cambrian Way sections",
        "knownOperators": "AberAdventures",
        "knownGearShops": "Summit Cycles & Outdoor (Aberystwyth), Mountain Warehouse",
        "knownFood": "Number 21 (Aberystwyth), Hafod Hotel (Devil's Bridge), Y Ffarmers (Llanfihangel), Rheidol Riding Centre cafe",
    },
    {
        "region": "wye-valley",
        "regionName": "Wye Valley",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Offa's Dyke Path, Tintern Abbey, Symonds Yat Rock, Devil's Pulpit",
        "targetKeyword": "hiking wye valley",
        "knownSpots": "Symonds Yat Rock viewpoint, Devil's Pulpit to Tintern Abbey, Offa's Dyke Path sections, The Biblins, Whitecliff viewpoint, Wyndcliff (365 steps), Redbrook to Bigsweir, Trellech walks",
        "knownOperators": "Wye Valley Canoes, Black Mountain Adventure",
        "knownGearShops": "Paddles & Pedals (Hay-on-Wye), outdoor shops Monmouth",
        "knownFood": "The Old Ferrie Inn (Symonds Yat), The Saracens Head, Kingstone Brewery Tap, The Ostrich Inn (Newland), Bigsweir House",
    },
    {
        "region": "brecon-beacons",
        "regionName": "Brecon Beacons",
        "activity": "gorge-walking",
        "activityName": "Gorge Walking",
        "whyFamous": "Waterfall Country, Henrhyd Falls, Mellte gorge, Sgwd yr Eira",
        "targetKeyword": "gorge walking brecon beacons",
        "knownSpots": "Four Falls Trail gorges, Sgwd yr Eira (walk-behind waterfall), Henrhyd Falls (tallest in South Wales), Porth yr Ogof entrance, Mellte valley, Nedd Fechan gorge, Sychryd Cascades",
        "knownOperators": "Adventure Britain, Black Mountain Adventure, Call of the Wild",
        "knownGearShops": "Local outdoor shops Brecon, Cotswold Outdoor",
        "knownFood": "Angel Inn (Pontneddfechan), The Ancient Briton (Pen-y-Cae), Star Inn (Talybont-on-Usk), The Felin Fach Griffin",
    },
    {
        "region": "anglesey",
        "regionName": "Anglesey",
        "activity": "wild-swimming",
        "activityName": "Wild Swimming",
        "whyFamous": "Llanddwyn Island, Rhoscolyn, secluded coves, warm(ish) waters",
        "targetKeyword": "wild swimming anglesey",
        "knownSpots": "Llanddwyn Island (Newborough), Rhoscolyn Bay, Church Bay, Porth Dafarch, Cable Bay, Benllech, Trearddur Bay, Cemlyn Bay, Silver Bay",
        "knownOperators": "Anglesey Adventures",
        "knownGearShops": "Anglesey Outdoors, general water sports shops",
        "knownFood": "The Oyster Catcher (Rhosneigr), Sandy Mount House, Wavecrest Cafe, The Lobster Pot (Church Bay)",
    },
    {
        "region": "gower",
        "regionName": "Gower",
        "activity": "wild-swimming",
        "activityName": "Wild Swimming",
        "whyFamous": "Blue Pool, Three Cliffs Bay, hidden coves, tidal pools",
        "targetKeyword": "wild swimming gower",
        "knownSpots": "Blue Pool (Broughton Bay), Three Cliffs Bay, Mewslade Bay, Fall Bay, Brandy Cove, Pwll Du Bay, Caswell Bay, Rhossili, Tor Bay rock pools",
        "knownOperators": "Gower Activity Centres",
        "knownGearShops": "PJ's Surf Shop (Llangennith), wetsuit hire shops",
        "knownFood": "The King Arthur Hotel (Reynoldston), King's Head (Llangennith), Verdi's (Mumbles), Bay Bistro (Rhossili)",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "trail-running",
        "activityName": "Trail Running",
        "whyFamous": "Snowdon Race, Skyrunning, mountain marathons, technical terrain",
        "targetKeyword": "trail running snowdonia",
        "knownSpots": "Snowdon summit race route, Moel Siabod circuit, Glyderau ridge run, Carneddau traverse, Coed y Brenin trail runs, Nant Gwynant loops, Cwm Idwal to Devil's Kitchen, Aber Falls trail",
        "knownOperators": "Plas y Brenin",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor, Run Wales shops",
        "knownFood": "Pete's Eats (Llanberis), Caffi Siabod (Capel Curig), Pinnacle Cafe, Ty Hyll cafe",
    },
    {
        "region": "brecon-beacons",
        "regionName": "Brecon Beacons",
        "activity": "wild-swimming",
        "activityName": "Wild Swimming",
        "whyFamous": "Waterfalls, Llangorse Lake, Usk River, mountain pools",
        "targetKeyword": "wild swimming brecon beacons",
        "knownSpots": "Sgwd yr Eira plunge pool, Pont Melin-fach pools, Llangorse Lake, River Usk (Brecon), Blue Pool (Ystradfellte), Henrhyd Falls pool, Talybont Reservoir, Grwyne Fawr reservoir",
        "knownOperators": "Adventure Britain, Black Mountain Adventure",
        "knownGearShops": "Local outdoor shops Brecon",
        "knownFood": "The Felin Fach Griffin, Angel Inn (Pontneddfechan), Star Inn (Talybont), White Hart (Brecon)",
    },
    {
        "region": "pembrokeshire",
        "regionName": "Pembrokeshire",
        "activity": "wild-swimming",
        "activityName": "Wild Swimming",
        "whyFamous": "Blue Lagoon (Abereiddy), Barafundle Bay, secluded coves",
        "targetKeyword": "wild swimming pembrokeshire",
        "knownSpots": "Blue Lagoon (Abereiddy), Barafundle Bay, Aber Mawr, Caerfai Bay, Whitesands Bay, Porthgain harbour, Stackpole Quay, Marloes Sands, Druidston Haven",
        "knownOperators": "TYF Adventure, Preseli Venture",
        "knownGearShops": "Ma Simes (St Davids), TYF Shop",
        "knownFood": "The Shed (Porthgain), The Sloop Inn (Porthgain), The Sampler (St Davids), Bench Bar (Newgale), Cafe Mor (Freshwater West)",
    },
    {
        "region": "north-wales",
        "regionName": "North Wales",
        "activity": "mountain-biking",
        "activityName": "Mountain Biking",
        "whyFamous": "Revolution Bike Park, Llandegla, Coed Llandegla, coastal trails",
        "targetKeyword": "mountain biking north wales",
        "knownSpots": "Coed Llandegla (red/black trails), Revolution Bike Park (Llangynog), Marin Trail (Betws-y-Coed), Penmachno, Gwydir Mawr, Clwydian Range, Clocaenog Forest",
        "knownOperators": "Revolution Bike Park, OneplanetAdventure (Llandegla)",
        "knownGearShops": "Beics Betws (Betws-y-Coed), Oneplanet shop (Llandegla), Trek Store (Wrexham)",
        "knownFood": "The Cafe at Coed Llandegla, Y Stablau (Betws-y-Coed), Moel Siabod Cafe, Caffi Siabod",
    },
]

# =============================================================================
# PROMPT
# =============================================================================

def build_prompt(combo: dict, operator_context: str) -> str:
    return f"""You are an expert Welsh adventure tourism writer creating a comprehensive
guide page for "{combo['activityName']} in {combo['regionName']}".

Write like a knowledgeable local guide who's done every route and knows every cafe.
Be specific, practical, and honest — not generic tourism board copy.

TARGET KEYWORD: "{combo['targetKeyword']}"
FAMOUS FOR: {combo['whyFamous']}

KNOWN SPOTS/ROUTES: {combo['knownSpots']}
KNOWN OPERATORS: {combo['knownOperators']}
KNOWN GEAR SHOPS: {combo['knownGearShops']}
KNOWN FOOD/DRINK: {combo['knownFood']}

EXISTING OPERATOR DATA FROM OUR DATABASE:
{operator_context}

Generate a complete JSON file with ALL of the following. Return ONLY valid JSON, no markdown wrapping.

{{
  "regionSlug": "{combo['region']}",
  "activityTypeSlug": "{combo['activity']}",
  "title": "{combo['activityName']} in {combo['regionName']}",
  "strapline": "One punchy sentence — specific to this combo, not generic",
  "metaTitle": "Max 60 chars, includes target keyword, ends with | Adventure Wales",
  "metaDescription": "Max 155 chars, action-oriented, includes keyword",
  "heroAlt": "Descriptive alt text for the hero image",

  "introduction": "300-500 words of editorial markdown. Why this region is specifically great for this activity. What makes it different from elsewhere in Wales. Who it's best for. Include the target keyword 2-3 times naturally. Be honest and opinionated — mention challenges too. Write like a friend, not a brochure.",

  "bestSeason": "e.g. May-October",
  "difficultyRange": "e.g. Easy to Expert",
  "priceRange": "e.g. Free - £80 guided",

  "spots": [
    // 8-10 spots. For EACH spot include ALL of these fields:
    {{
      "name": "Specific route/spot name",
      "slug": "url-safe-slug",
      "description": "3-4 sentences. Practical, honest, specific. What's the experience like? What will you see?",
      "difficulty": "Easy|Moderate|Challenging|Expert",
      "duration": "e.g. 6-7 hours round trip",
      "distance": "e.g. 14.5km (for hiking/biking, null for others)",
      "elevationGain": "e.g. 1,085m (for hiking/biking, null for others)",
      "bestFor": "Who this suits — be specific",
      "notSuitableFor": "Honest warnings",
      "bestSeason": "e.g. May-September",
      "parking": "WHERE to park, cost, how early, alternatives",
      "startPoint": {{ "name": "Place name", "lat": 52.000, "lng": -4.000 }},
      "estimatedCost": "e.g. Free (parking £5-10) or £55pp guided",
      "operatorSlug": "slug of operator who offers guided version, or null",
      "insiderTip": "One thing only locals know — parking hack, best time, quiet alternative, where to stop"
    }}
  ],

  "practicalInfo": {{
    "weather": "2-3 sentences specific to this activity in this region. What conditions matter? What to watch?",
    "weatherLinks": [
      {{ "name": "Relevant forecast service", "url": "https://..." }}
    ],
    "gearChecklist": [
      "Activity-specific item 1",
      "Item 2 — include WHY it matters",
      "6-10 items total, practical not generic"
    ],
    "gearHire": [
      {{ "name": "Where to hire gear", "location": "Town", "url": "https://..." }}
    ],
    "gettingThere": {{
      "driveTimes": [
        {{ "from": "London", "duration": "Xh", "route": "Via which roads" }},
        {{ "from": "Manchester", "duration": "Xh", "route": "Via which roads" }},
        {{ "from": "Birmingham", "duration": "Xh", "route": "Via which roads" }},
        {{ "from": "Cardiff", "duration": "Xh", "route": "Via which roads" }}
      ],
      "publicTransport": "Specific train stations, bus services, Sherpa etc",
      "parkingTips": "General parking advice for this area"
    }},
    "safety": "Key safety points specific to this activity+region. Emergency contacts."
  }},

  "faqs": [
    // 6-8 real questions people ask. Check Google 'People Also Ask' for the target keyword.
    {{
      "question": "The actual question people search for?",
      "answer": "Direct, helpful answer in 2-4 sentences. Be specific, include numbers/names."
    }}
  ],

  "localDirectory": {{
    "gearShops": [
      // 4-6 real gear shops in this region relevant to this activity
      // These are the big names everyone knows. Include ALL notable ones.
      {{
        "name": "Shop Name",
        "slug": "shop-name",
        "address": "Full address with postcode",
        "lat": 52.000,
        "lng": -4.000,
        "description": "What they're known for, why people go there. 1-2 sentences.",
        "website": "https://...",
        "phone": "01234 567890",
        "services": ["gear sales", "hire", "repairs", "boot fitting"],
        "googleRating": 4.6,
        "reviewCount": 200
      }}
    ],
    "postActivitySpots": [
      // 5-8 real pubs, cafes, restaurants. The ones EVERYONE goes to after this activity.
      // Include the famous ones — climber pubs, surfer cafes, etc.
      {{
        "name": "Place Name",
        "slug": "place-name",
        "address": "Address or town",
        "lat": 52.000,
        "lng": -4.000,
        "description": "What makes this place special. Be specific — famous dishes, vibe, history.",
        "vibe": "e.g. Climber-friendly cafe, Surfer hangout, Cosy pub",
        "priceRange": "£|££|£££",
        "website": "https://... or null",
        "knownFor": "e.g. Giant portions, Real ales, Post-surf burritos"
      }}
    ],
    "accommodation": [
      // 5-6 real places to stay near the key spots
      // Mix of budget (hostels, camping) and mid-range (B&Bs, hotels)
      {{
        "name": "Place Name",
        "slug": "place-name",
        "description": "What makes it good for this activity. Location advantage.",
        "type": "hostel|campsite|bunkhouse|hotel|b&b|glamping",
        "priceRange": "£|££|£££",
        "nearestSpot": "Which spot/trailhead is it closest to and how far",
        "website": "https://... or null"
      }}
    ]
  }},

  "events": [
    // 3-5 real recurring events/competitions relevant to this activity in this region
    {{
      "name": "Event Name",
      "type": "race|festival|competition|exhibition",
      "monthTypical": "Month it usually happens",
      "description": "One sentence about what it is",
      "website": "https://...",
      "relevantActivities": ["{combo['activity']}"],
      "registrationCost": 45
    }}
  ],

  "keywords": {{
    "primary": "{combo['targetKeyword']}",
    "secondary": ["3-5 secondary keyword phrases"],
    "longTail": ["8-12 long-tail keyword phrases people actually search"],
    "localIntent": ["3-5 'near [town]' keywords"],
    "commercialIntent": ["3-5 keywords with buying intent — guided, hire, book, price"]
  }},

  "nearbyAlternatives": {{
    "sameActivity": [
      // 2-3 other regions where you can do the same activity
      {{ "regionSlug": "region-slug", "label": "{combo['activityName']} in Region Name" }}
    ],
    "sameRegion": [
      // 3-4 other activities in this same region
      {{ "activityTypeSlug": "activity-slug", "label": "Activity in {combo['regionName']}" }}
    ]
  }},

}}

CRITICAL RULES:
- All GPS coordinates must be real and accurate for Wales (lat 51-54, lng -6 to -2.5)
- All businesses, shops, cafes, pubs must be REAL places that actually exist
- Prices in GBP
- Be GENEROUS with the local directory — include every well-known business, not just 3
- Gear shops: include ALL notable ones in the area, even if 5-6
- Food spots: include ALL the famous post-activity spots, 5-8 of them
- Accommodation: 5-6 options mixing budget and mid-range
- Events: only include real recurring events
- Insider tips should be genuinely useful, not obvious
- FAQ answers should be direct and specific
- Introduction should be 300-500 words of quality editorial — opinionated, honest, practical
- If you don't know something for certain, use null rather than fabricating"""


def build_discovery_prompt(combo: dict, operator_context: str) -> str:
    """Build prompt for discoveredBusinesses (separate call to avoid output truncation)."""
    return f"""You are researching businesses for an adventure tourism site about {combo['activityName']} in {combo['regionName']}, Wales.

Find and list EVERY notable venue, business, and attraction relevant to {combo['activityName']} in {combo['regionName']}.

KNOWN OPERATORS: {combo['knownOperators']}
KNOWN GEAR SHOPS: {combo['knownGearShops']}
KNOWN FOOD/DRINK: {combo['knownFood']}

EXISTING OPERATOR DATA:
{operator_context}

Return ONLY a valid JSON array (no wrapping object). Include 10-20 businesses.

For EACH business include ALL of these fields:
[
  {{
    "name": "Business Name",
    "type": "activity_provider|gear_shop|venue|club|attraction|post_activity",
    "category": "activity_provider|accommodation|food_drink|gear_rental|transport",
    "address": "Full address with postcode",
    "postcode": "UK postcode",
    "lat": 52.000,
    "lng": -4.000,
    "phone": "01234 567890 or null",
    "website": "https://... or null",
    "googleRating": 4.5,
    "reviewCount": 200,
    "description": "What they do, why they matter. 1-2 sentences.",
    "relevantActivities": ["{combo['activity']}"],
    "services": ["what", "they", "offer"],
    "priceRange": "£|££|£££",
    "notes": "Why this business is important.",
    "inDatabase": false,
    "priority": "critical|high|medium|low"
  }}
]

Include: activity providers, gear/hire shops, trail centres, venues, clubs, cafes/pubs/restaurants.
All GPS must be accurate for Wales (lat 51-54, lng -6 to -2.5).
All businesses must be REAL places that actually exist.
Include postcodes for all businesses."""


def load_operator_context(combo: dict) -> str:
    """Load relevant operator data from our research files."""
    context_parts = []
    for batch_file in RESEARCH_DIR.glob("*.json"):
        try:
            with open(batch_file) as f:
                data = json.load(f)
            for op in data.get("operators", []):
                regions = op.get("regions", [])
                activities = op.get("activityTypes", [])
                if combo["region"] in regions:
                    context_parts.append(
                        f"- {op['name']}: {op.get('tagline', '')} | "
                        f"Activities: {', '.join(activities)} | "
                        f"Rating: {op.get('googleRating', 'N/A')} | "
                        f"Price range: {op.get('priceRange', 'N/A')}"
                    )
        except:
            pass

    if context_parts:
        return "\n".join(context_parts)
    return "No operator data available for this region."


def _call_gemini(model, prompt: str, max_retries: int = 3) -> str | None:
    """Call Gemini with retry on 429."""
    for attempt in range(max_retries):
        try:
            response = model.generate_content(
                prompt,
                generation_config={"max_output_tokens": 65536},
            )
            text = response.text.strip()
            finish = response.candidates[0].finish_reason if response.candidates else "?"
            print(f"({len(text)} chars, finish={finish})", end=" ", flush=True)
            return text
        except Exception as e:
            if "429" in str(e) and attempt < max_retries - 1:
                wait = 30 * (attempt + 1)
                print(f"\n    Rate limited, waiting {wait}s...", end=" ", flush=True)
                time.sleep(wait)
            else:
                raise
    return None


def _parse_json(text: str) -> dict | list | None:
    """Parse JSON text with common Gemini fixes."""
    # Strip markdown wrappers
    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    if text.startswith("```"):
        text = text[3:].strip()
    if text.endswith("```"):
        text = text[:-3].strip()

    # Fix trailing commas
    fixed = re.sub(r',\s*([}\]])', r'\1', text)
    try:
        return json.loads(fixed)
    except json.JSONDecodeError:
        pass

    # Try extracting JSON object or array
    for pattern in [r'\{[\s\S]*\}', r'\[[\s\S]*\]']:
        try:
            match = re.search(pattern, text)
            if match:
                fixed = re.sub(r',\s*([}\]])', r'\1', match.group())
                return json.loads(fixed)
        except:
            pass

    return None


def generate_combo_page(model, combo: dict) -> dict | None:
    """Generate a combo page JSON using Gemini (two calls: content + discovery)."""
    operator_context = load_operator_context(combo)

    # Call 1: Main content
    prompt = build_prompt(combo, operator_context)
    try:
        text = _call_gemini(model, prompt)
        if not text:
            return None

        data = _parse_json(text)
        if not data:
            print(f"\n    JSON parse error. First 500 chars: {text[:500]}")
            return None

        # Call 2: Business discovery (separate to avoid output truncation)
        time.sleep(3)
        discovery_prompt = build_discovery_prompt(combo, operator_context)
        print("biz...", end=" ", flush=True)
        disc_text = _call_gemini(model, discovery_prompt)
        if disc_text:
            disc_data = _parse_json(disc_text)
            if isinstance(disc_data, list):
                data["discoveredBusinesses"] = disc_data
                print(f"{len(disc_data)} found.", end=" ", flush=True)
            else:
                print("biz parse fail.", end=" ", flush=True)
        else:
            print("biz call fail.", end=" ", flush=True)

        return data
    except Exception as e:
        print(f"\n    API error: {e}")
        return None


def validate_combo(data: dict) -> list[str]:
    """Validate combo page data."""
    warnings = []

    # Check spots
    spots = data.get("spots", [])
    if len(spots) < 5:
        warnings.append(f"Only {len(spots)} spots (want 5-10)")

    # Check GPS on spots
    for s in spots:
        sp = s.get("startPoint", {})
        lat = sp.get("lat", 0)
        lng = sp.get("lng", 0)
        if lat and lng and (lat < 51 or lat > 54 or lng < -6 or lng > -2.5):
            warnings.append(f"Bad GPS on spot '{s.get('name', '?')}': {lat},{lng}")

    # Check local directory
    ld = data.get("localDirectory", {})
    gear = len(ld.get("gearShops", []))
    food = len(ld.get("postActivitySpots", []))
    accom = len(ld.get("accommodation", []))
    if gear < 2:
        warnings.append(f"Only {gear} gear shops")
    if food < 3:
        warnings.append(f"Only {food} food spots")
    if accom < 3:
        warnings.append(f"Only {accom} accommodation options")

    # Check intro length
    intro = data.get("introduction", "")
    words = len(intro.split())
    if words < 150:
        warnings.append(f"Introduction too short ({words} words)")

    # Check FAQs
    faqs = len(data.get("faqs", []))
    if faqs < 4:
        warnings.append(f"Only {faqs} FAQs")

    return warnings


def main():
    parser = argparse.ArgumentParser(description="Generate combo page content via Gemini")
    parser.add_argument("--tier", type=str, help="Generate tier 1, 2, 3, or all")
    parser.add_argument("--single", type=str, help="Single combo e.g. snowdonia--hiking")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true", help="Overwrite existing")
    args = parser.parse_args()

    all_combos = TIER_1 + TIER_2 + TIER_3

    if args.single:
        region, activity = args.single.split("--")
        combos = [c for c in all_combos if c["region"] == region and c["activity"] == activity]
        if not combos:
            print(f"ERROR: Combo '{args.single}' not found")
            sys.exit(1)
    elif args.tier == "1":
        combos = TIER_1
    elif args.tier == "2":
        combos = TIER_2
    elif args.tier == "3":
        combos = TIER_3
    elif args.tier == "all":
        combos = all_combos
    else:
        print("ERROR: Specify --tier 1|2|3|all or --single region--activity")
        sys.exit(1)

    print(f"Generating {len(combos)} combo pages...\n")

    if args.dry_run:
        for c in combos:
            print(f"  {c['region']}--{c['activity']}: {c['activityName']} in {c['regionName']}")
        return

    # Init Gemini
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    success = 0
    failed = 0

    for i, combo in enumerate(combos, 1):
        slug = f"{combo['region']}--{combo['activity']}"
        output_file = OUTPUT_DIR / f"{slug}.json"

        if output_file.exists() and not args.force:
            print(f"[{i}/{len(combos)}] {slug} ... SKIPPED (exists)")
            success += 1
            continue

        print(f"[{i}/{len(combos)}] {slug} ...", end=" ", flush=True)

        data = generate_combo_page(model, combo)

        if data:
            warnings = validate_combo(data)

            with open(output_file, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            spots = len(data.get("spots", []))
            ld = data.get("localDirectory", {})
            gear = len(ld.get("gearShops", []))
            food = len(ld.get("postActivitySpots", []))
            accom = len(ld.get("accommodation", []))
            faqs = len(data.get("faqs", []))
            biz = len(data.get("discoveredBusinesses", []))
            warn = f" WARNINGS: {', '.join(warnings)}" if warnings else ""
            print(f"done ({spots} spots, {gear} shops, {food} food, {accom} accom, {faqs} FAQs, {biz} biz){warn}")
            success += 1
        else:
            print("FAILED")
            failed += 1

        if i < len(combos):
            time.sleep(8)

    print(f"\n=== COMPLETE: {success} generated, {failed} failed ===")
    print(f"Output: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
