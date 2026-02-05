import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getRegionWithStats, getActivitiesByRegion, getAccommodationByRegion, getOperators, getRegionEntitiesForMap, getActivityTypesForRegion } from "@/lib/queries";
import type { MapMarker } from "@/components/ui/MapView";
import { ActivityCard } from "@/components/cards/activity-card";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { ScenicGallery } from "@/components/regions/scenic-gallery";
import { getBestListsForRegion } from "@/lib/best-list-data";
import { BestOfCard } from "@/components/content/BestOfCard";
import { 
  Map, 
  Heart, 
  Share, 
  ChevronRight, 
  Footprints, 
  Users, 
  Home, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Bus, 
  Cloud, 
  Backpack, 
  Plane,
  Compass,
  Train,
  Car,
} from "lucide-react";
import { getAllRegions } from "@/lib/queries";
import { 
  JsonLd, 
  createTouristDestinationSchema, 
  createBreadcrumbSchema 
} from "@/components/seo/JsonLd";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { ActivitySeasonGuide } from "@/components/weather/ActivitySeasonGuide";
import { ThisWeekendWidget } from "@/components/events/ThisWeekendWidget";
import { BookingWidget } from "@/components/commercial/BookingWidget";

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

// Helper to extract section content from description
function extractSection(description: string | null, sectionName: string): string | null {
  if (!description) return null;
  
  // Look for **Section Name:** pattern and extract content until next ** or end
  const regex = new RegExp(`\\*\\*${sectionName}:\\*\\*\\s*([^*]+?)(?=\\*\\*|$)`, 'i');
  const match = description.match(regex);
  return match ? match[1].trim() : null;
}

// Helper to extract just the intro paragraphs (before any **Section:** headers)
function extractIntro(description: string | null): string {
  if (!description) return "";
  
  // Find where the first **Something:** section starts
  const sectionStart = description.search(/\*\*[A-Z][^*]+:\*\*/);
  
  if (sectionStart > 0) {
    return description.substring(0, sectionStart).trim();
  }
  
  // If no sections found, return first 500 chars as fallback
  return description.length > 500 ? description.substring(0, 500) + "..." : description;
}

// Helper to extract Pro Tips as an array
function extractProTips(description: string | null): string[] {
  if (!description) return [];
  
  const proTipsSection = extractSection(description, 'Pro Tips');
  if (!proTipsSection) return [];
  
  // Split by bullet points (• or -)
  return proTipsSection
    .split(/[•\-]/)
    .map(tip => tip.trim())
    .filter(tip => tip.length > 10);
}

// Default content for Plan Your Visit sections
const defaultPlanContent = {
  gettingThere: "Check local transport links and drive times from major cities. Many regions have good rail connections.",
  bestTime: "Spring and autumn offer pleasant weather with fewer crowds. Summer is warmest but busiest.",
  essentialGear: "Waterproof jacket and layers are essential year-round. For hiking, bring sturdy boots, a map, and extra food/water.",
};

// Static transport data per region for Getting There section
interface TransportInfo {
  trainStations: { name: string; info: string }[];
  busServices: { name: string; info: string }[];
  airports: { name: string; info: string }[];
  driving: { route: string; info: string }[];
  carFree: string;
}

const regionTransport: Record<string, TransportInfo> = {
  snowdonia: {
    trainStations: [
      { name: "Bangor (Gwynedd)", info: "Avanti West Coast from London Euston (~3 hrs 20 min direct). Transport for Wales from Manchester (~2 hrs via Chester). Bus 85 connects to Llanberis." },
      { name: "Betws-y-Coed", info: "Conwy Valley line from Llandudno Junction (~30 min). Heart of Snowdonia — ideal for walks and mountain biking." },
      { name: "Porthmadog", info: "Cambrian Coast line from Machynlleth/Shrewsbury. Also connects to Ffestiniog & Welsh Highland heritage railways." },
      { name: "Llandudno Junction", info: "North Wales Main Line hub. Change here for Conwy Valley line to Betws-y-Coed & Blaenau Ffestiniog." },
    ],
    busServices: [
      { name: "Snowdon Sherpa S1", info: "Pen y Pass circular via Llanberis & Nant Peris. Runs every 30 min on weekends & bank holidays, hourly other days." },
      { name: "Snowdon Sherpa S2", info: "Betws-y-Coed to Pen y Pass via Capel Curig. Approximately hourly service." },
      { name: "Bus 85", info: "Bangor to Llanberis, roughly every 2 hours (every 3 hours on Sundays)." },
      { name: "Bus 88", info: "Caernarfon to Llanberis, approximately hourly (every 2 hours on Sundays)." },
      { name: "Traws Cymru T2", info: "Bangor to Aberystwyth via Caernarfon, Porthmadog, Dolgellau & Machynlleth. Long-distance scenic route." },
      { name: "fflecsi Conwy Valley", info: "On-demand bus service covering the Conwy Valley area. Book via the fflecsi app." },
    ],
    airports: [
      { name: "Liverpool John Lennon", info: "~1.5 hrs drive via A55 (85 miles)" },
      { name: "Manchester", info: "~2 hrs drive via M56/A55 (105 miles). Direct trains from the airport to Bangor via Chester." },
    ],
    driving: [
      { route: "From London", info: "~5 hrs via M40/M6/A55 or M1/M6/A55 (280 miles). A5 through Snowdonia is scenic but slower." },
      { route: "From Birmingham", info: "~2.5 hrs via M54/A5 (130 miles). The A5 route is scenic through Llangollen and Betws-y-Coed." },
      { route: "From Manchester", info: "~2 hrs via M56/A55 (100 miles). Fastest route to north Snowdonia." },
      { route: "Parking: Pen y Pass", info: "Pre-book required Apr–Oct (£20/8hrs via JustPark). Only 68 spaces — sells out fast on weekends. Park & Ride at Nant Peris is cheaper." },
      { route: "Parking: Llanberis", info: "Several pay & display car parks in town. Closest to Snowdon path is opposite the railway station." },
    ],
    carFree: "Yes — genuinely viable. Train to Bangor or Betws-y-Coed, then Snowdon Sherpa buses connect all major trailheads. Heritage railways (Welsh Highland, Ffestiniog) add scenic travel options between Caernarfon, Beddgelert and Porthmadog.",
  },
  pembrokeshire: {
    trainStations: [
      { name: "Haverfordwest", info: "Main Pembrokeshire hub. Transport for Wales service every 2 hours to Swansea, Cardiff & Manchester Piccadilly. ~4.5 hrs from London (change at Swansea)." },
      { name: "Tenby", info: "On the Pembroke Dock branch. Direct services to Swansea (~1.5 hrs) & Cardiff (~2.5 hrs). Change at Swansea for London Paddington (~5 hrs total)." },
      { name: "Milford Haven", info: "Western terminus. Same line as Haverfordwest — trains every 2 hours to Swansea/Cardiff/Manchester." },
      { name: "Fishguard & Goodwick", info: "Stena Line ferry port for Ireland (Rosslare). Occasional connecting rail services." },
      { name: "Pembroke Dock", info: "Branch line terminus. Irish Ferries to Rosslare. Trains via Tenby to Swansea." },
    ],
    busServices: [
      { name: "400 Puffin Shuttle", info: "St Davids to Marloes via coast (summer only, May–Sep). Perfect for Coast Path walking." },
      { name: "387/388 Coastal Cruiser", info: "Pembroke Dock to Angle Peninsula. Year-round (reduced winter timetable Oct–May)." },
      { name: "403 Celtic Coaster", info: "Circular route around St Davids peninsula (summer only)." },
      { name: "404 Strumble Shuttle", info: "Fishguard to St Davids via Strumble Head (summer only)." },
      { name: "Traws Cymru T5", info: "Aberystwyth to Haverfordwest via Cardigan, Fishguard & St Davids. Key long-distance coastal link." },
      { name: "fflecsi Pembrokeshire", info: "On-demand buses covering zones around Haverfordwest, Fishguard & Poppit. Book via the fflecsi app." },
    ],
    airports: [
      { name: "Cardiff", info: "~2.5 hrs drive via M4/A48 (140 miles)" },
      { name: "Bristol", info: "~3 hrs drive via M4/M48/A48 (160 miles)" },
    ],
    driving: [
      { route: "From London", info: "~4.5 hrs via M4/A48/A40 (260 miles)" },
      { route: "From Cardiff", info: "~2.5 hrs via M4/A48/A40 (150 miles)" },
      { route: "From Swansea", info: "~1.5 hrs via A48/A40 (80 miles)" },
      { route: "Parking: St Davids", info: "Oriel y Parc car park: £1.50/hr, £6/day (Mar–Oct). Free under 30 min." },
      { route: "Parking: Tenby", info: "Multi-storey and South Beach car parks. Can be very busy in summer — arrive early or use Park & Ride." },
    ],
    carFree: "Possible in summer when seasonal coastal buses run. The Puffin Shuttle, Celtic Coaster and Strumble Shuttle connect key coastal spots. In winter, services are very limited — a car is recommended. Train to Tenby works well as a base.",
  },
  "brecon-beacons": {
    trainStations: [
      { name: "Abergavenny", info: "Main gateway — 25 min from Newport, ~3 hrs from London Paddington, ~3 hrs 20 min from Manchester. Served by Transport for Wales & CrossCountry." },
      { name: "Merthyr Tydfil", info: "Northern gateway on Cardiff Valley Lines. Every 15–30 min from Cardiff Central (~1 hr). Bus T4 continues to Brecon." },
      { name: "Llandovery", info: "Western gateway on the scenic Heart of Wales line (Swansea to Shrewsbury, 121 miles). 4 trains per day each way." },
    ],
    busServices: [
      { name: "Traws Cymru T4", info: "Cardiff to Newtown via Merthyr Tydfil, Storey Arms & Brecon. 'The route with a view' — free Wi-Fi, comfy seats. Stops at Storey Arms for Pen y Fan." },
      { name: "X43/43", info: "Brecon to Abergavenny via Crickhowell & Talybont-on-Usk. Follows the River Usk through the heart of the park." },
      { name: "X4", info: "Hereford to Cardiff via Abergavenny & Merthyr Tydfil. Useful cross-park connection." },
      { name: "T14", info: "Cardiff to Brecon via Storey Arms. Alternative route to T4 for Pen y Fan access." },
    ],
    airports: [
      { name: "Cardiff", info: "~1 hr drive via A470 (40 miles)" },
      { name: "Bristol", info: "~1.5 hrs drive via M4/M48 (70 miles)" },
    ],
    driving: [
      { route: "From London", info: "~3.5 hrs via M4/A470 (200 miles). Or via M40/A40 to Brecon." },
      { route: "From Cardiff", info: "~1 hr via A470 (40 miles). A470 is scenic but can be slow behind lorries." },
      { route: "From Birmingham", info: "~2.5 hrs via M5/M50/A40 through Hereford (120 miles)" },
      { route: "Parking: Storey Arms", info: "Small lay-by car park on A470 for Pen y Fan — fills very early on weekends. Arrive before 8am or take the T4 bus." },
      { route: "Parking: Brecon", info: "Several town car parks. Brecon Canal car park is free and walkable to town centre." },
    ],
    carFree: "Yes — surprisingly viable. Train to Abergavenny or Merthyr Tydfil, then buses penetrate the park. The T4 bus from Cardiff stops right at Storey Arms for Pen y Fan. The X43 bus connects Brecon with Abergavenny along the Usk Valley. Cycling the Monmouthshire & Brecon Canal towpath is flat and scenic.",
  },
  anglesey: {
    trainStations: [
      { name: "Holyhead", info: "End of the North Wales Main Line. Avanti West Coast from London Euston (~3.5 hrs direct). Irish ferry port (Stena Line & Irish Ferries to Dublin)." },
      { name: "Bangor", info: "Mainland gateway — cross the Menai Bridge to Anglesey. ~3 hrs 20 min from London Euston, ~2 hrs from Manchester." },
      { name: "Llanfairpwll", info: "Llanfairpwllgwyngyll — the famous long station name. Central Anglesey, on the main line between Bangor & Holyhead." },
      { name: "Bodorgan", info: "Small request stop on the main line. Walking distance to Newborough beach and forest." },
    ],
    busServices: [
      { name: "4/4A/4X", info: "Bangor to Holyhead via Llangefni (Arriva). Main bus route across the island, roughly every 30 min." },
      { name: "53/57/58", info: "Bangor to Beaumaris and eastern Anglesey (Arriva). Roughly every 20–30 min Mon–Sat." },
      { name: "62", info: "Llangefni to Amlwch via north Anglesey." },
      { name: "1Bws day ticket", info: "£7 unlimited day travel on all buses in North Wales — great value for island hopping." },
    ],
    airports: [
      { name: "Liverpool John Lennon", info: "~1.5 hrs drive via A55/M53 (95 miles)" },
      { name: "Manchester", info: "~2.5 hrs drive via M56/A55 (130 miles). Direct trains from airport." },
    ],
    driving: [
      { route: "From London", info: "~5.5 hrs via M40/M6/A55 then A55 across to Anglesey (300 miles)" },
      { route: "From Birmingham", info: "~3 hrs via M54/A5/A55 (150 miles)" },
      { route: "From Manchester", info: "~2.5 hrs via M56/A55 (120 miles)" },
      { route: "From Liverpool", info: "~2 hrs via M53/A55 (100 miles)" },
      { route: "Crossing", info: "Both Britannia Bridge (A55) and Menai Suspension Bridge (A5) connect the mainland to Anglesey. No toll." },
    ],
    carFree: "Challenging but possible for the main towns. Bus 4/4A connects Bangor–Llangefni–Holyhead regularly. Buses to Beaumaris run frequently. However, remote beaches and coastal areas are difficult to reach without a car. Cycling is excellent on quiet lanes.",
  },
  "gower-peninsula": {
    trainStations: [
      { name: "Swansea", info: "Main gateway to Gower. GWR direct from London Paddington (~2 hrs 40 min fastest). Transport for Wales from Cardiff (~1 hr) & Manchester (~4 hrs). 20 min drive to Mumbles." },
      { name: "Llanelli", info: "Western approach. Transport for Wales & GWR services. Useful for north Gower via Gowerton." },
      { name: "Gowerton", info: "Small station between Swansea & Llanelli. Closest rail point to north Gower villages like Penclawdd." },
    ],
    busServices: [
      { name: "118", info: "Swansea to Rhossili via Killay, Parkmill, Reynoldston & Port Eynon. Key route to south Gower beaches. Hourly on weekdays." },
      { name: "116", info: "Swansea to Llangennith via Gowerton, Penclawdd, Llanrhidian & Llanmadoc. Serves north Gower." },
      { name: "117", info: "Parkmill to Scurlage via Oxwich, Horton & Port Eynon. Links south Gower beaches." },
      { name: "114", info: "Swansea to Rhossili via Mumbles, Bishopston & Parkmill. Scenic southern coastal route." },
      { name: "Gower Explorer network", info: "One of the most comprehensive rural bus networks in Wales. NAT Group operates most routes from Swansea." },
    ],
    airports: [
      { name: "Cardiff", info: "~1 hr drive via M4 (45 miles)" },
      { name: "Bristol", info: "~2 hrs drive via M4/M48 (95 miles)" },
    ],
    driving: [
      { route: "From London", info: "~3.5 hrs via M4 (200 miles). Exit M4 J42 for Gower." },
      { route: "From Cardiff", info: "~1 hr via M4 (45 miles)" },
      { route: "From Bristol", info: "~1.5 hrs via M4/M48 (90 miles)" },
      { route: "From Birmingham", info: "~2.5 hrs via M5/M4 (130 miles)" },
      { route: "Parking: Rhossili", info: "National Trust car park at Rhossili (free for NT members). £7/day otherwise. Fills early in summer." },
      { route: "Parking: general", info: "Car parks at Port Eynon, Oxwich, Three Cliffs (Parkmill) and Mumbles. Most are pay & display ~£3–6/day." },
    ],
    carFree: "Yes — Gower is one of the best rural areas in Wales for car-free visits. The Gower Explorer bus network from Swansea reaches all main beaches. Route 118 to Rhossili and 116 to Llangennith run hourly on weekdays. Sunday services run in high summer. The swanseabaywithoutacar.co.uk website has detailed planning info.",
  },
  "ceredigion-cardigan-bay": {
    trainStations: [
      { name: "Aberystwyth", info: "Cambrian line terminus. ~3 hrs 20 min from Birmingham International, ~1 hr 50 min from Shrewsbury. Near-hourly service. Change at Shrewsbury for London/Manchester." },
      { name: "Machynlleth", info: "Junction for Cambrian & Cambrian Coast lines. Change here for Barmouth, Harlech and Pwllheli." },
      { name: "Borth", info: "Small coastal station on the Cambrian line, north of Aberystwyth. Serves the Dyfi estuary area." },
    ],
    busServices: [
      { name: "Traws Cymru T1/T1C", info: "T1: Carmarthen to Aberystwyth via Lampeter & Aberaeron. T1C: Cardiff to Aberystwyth (long-distance, ~4.5 hrs)." },
      { name: "Traws Cymru T5", info: "Aberystwyth to Haverfordwest via New Quay, Aberaeron, Cardigan, Fishguard & St Davids. Scenic coastal route." },
      { name: "Traws Cymru T2", info: "Aberystwyth to Bangor via Machynlleth, Dolgellau, Porthmadog & Caernarfon. Cross-Wales scenic link." },
      { name: "X50", info: "Aberystwyth to Cardigan via Aberaeron. Regular local service along the coast." },
    ],
    airports: [
      { name: "Birmingham", info: "~2.5 hrs drive via A44/A458 (120 miles). Direct trains from airport to Aberystwyth via Shrewsbury." },
      { name: "Cardiff", info: "~3 hrs drive via A487/A470 (130 miles)" },
    ],
    driving: [
      { route: "From London", info: "~5 hrs via M40/A44 through Leominster & Rhayader (250 miles). Scenic cross-country drive." },
      { route: "From Birmingham", info: "~2.5 hrs via A458 through Welshpool & Machynlleth (120 miles)" },
      { route: "From Cardiff", info: "~3 hrs via A470 through Brecon & Rhayader (130 miles)" },
      { route: "From Swansea", info: "~2 hrs via A487 (90 miles)" },
      { route: "Parking: Aberystwyth", info: "Several town car parks. South promenade pay & display or Park Avenue multi-storey. Street parking limited." },
    ],
    carFree: "Feasible with planning. Train to Aberystwyth is straightforward and scenic. Traws Cymru buses T1, T2, and T5 connect to other towns. Coastal villages like New Quay and Aberaeron reachable by T5/X50 bus. Remote inland areas are harder without a car.",
  },
  "south-wales-valleys": {
    trainStations: [
      { name: "Cardiff Central", info: "Main hub — GWR from London Paddington (~1 hr 50 min fastest). Transport for Wales from Manchester (~3.5 hrs), Birmingham (~2 hrs). Gateway to all valley lines." },
      { name: "Merthyr Tydfil", info: "Valley Lines terminus. Every 15–30 min from Cardiff (~1 hr). Being upgraded as part of South Wales Metro with new Stadler tram-trains." },
      { name: "Pontypridd", info: "Central valleys junction. Lines branch to Treherbert (Rhondda), Aberdare and Merthyr Tydfil." },
      { name: "Treherbert", info: "Rhondda Fawr valley terminus. ~50 min from Cardiff via Pontypridd. Access to the Rhigos and Blaenrhondda walks." },
      { name: "Aberdare", info: "Cynon Valley terminus. ~45 min from Cardiff. Gateway to Dare Valley Country Park." },
      { name: "Ebbw Vale Town", info: "Ebbw Vale line from Cardiff/Newport. ~1 hr from Cardiff. Planned extension to Abertillery." },
    ],
    busServices: [
      { name: "South Wales Metro", info: "New Stadler tram-trains being phased in on Valley Lines. 4 trains per hour planned for Aberdare, Merthyr & Treherbert lines." },
      { name: "Stagecoach South Wales", info: "Extensive bus network across the valleys. Routes linking Merthyr, Pontypridd, Caerphilly and beyond." },
      { name: "Traws Cymru T4", info: "Cardiff to Newtown via Merthyr Tydfil & Brecon. Links the valleys to Mid Wales." },
      { name: "Explore Cardiff & Valleys ticket", info: "Transport for Wales day rover — unlimited train & bus travel in the Cardiff & Valleys area." },
    ],
    airports: [
      { name: "Cardiff", info: "~30 min drive from valleys via A4232/M4. Wales' main international airport." },
      { name: "Bristol", info: "~1 hr drive via M4/M48 (50 miles). Wider range of flights." },
    ],
    driving: [
      { route: "From London", info: "~3 hrs via M4 (170 miles) to Cardiff, then A470/A4059 into the valleys." },
      { route: "From Bristol", info: "~1 hr via M4/M48 (50 miles)" },
      { route: "From Birmingham", info: "~2 hrs via M5/M50/M4 (110 miles)" },
      { route: "Heads of the Valleys Road", info: "A465 links Abergavenny to Neath across the north of the valleys. Major dual carriageway upgrade ongoing." },
    ],
    carFree: "Excellent — the best-connected region in Wales by public transport. Valley Lines trains run frequently from Cardiff to Merthyr Tydfil, Treherbert, Aberdare, Rhymney & Ebbw Vale. New South Wales Metro tram-trains increasing frequency to every 15 min. Buses fill gaps between valleys.",
  },
  "north-wales-coast": {
    trainStations: [
      { name: "Rhyl", info: "North Wales Main Line. Avanti West Coast from London Euston (~2 hrs 40 min direct). Transport for Wales from Manchester (~1.5 hrs). Major resort town." },
      { name: "Colwyn Bay", info: "North Wales Main Line. ~10 min from Rhyl. Transport for Wales and Avanti services." },
      { name: "Llandudno", info: "Branch line from Llandudno Junction (~10 min). Transport for Wales from Manchester (~2 hrs 15 min). Victorian resort town." },
      { name: "Llandudno Junction", info: "Key hub — change here for Llandudno branch and Conwy Valley line to Betws-y-Coed & Blaenau Ffestiniog." },
      { name: "Prestatyn", info: "North Wales Main Line. Start/end of the Offa's Dyke Path. ~2.5 hrs from London Euston." },
      { name: "Conwy", info: "Small station on the North Wales Main Line. Walking distance to Conwy Castle and town walls." },
    ],
    busServices: [
      { name: "12/X12", info: "Rhyl to Llandudno (Arriva). Regular coastal service." },
      { name: "13", info: "Llandudno to Prestatyn via Colwyn Bay & Rhyl (Arriva). Coastal route." },
      { name: "14/15", info: "Llandudno to Llysfaen/Conwy (Arriva). Local connecting services." },
      { name: "Traws Cymru T2", info: "Bangor to Aberystwyth — useful for connecting to Snowdonia from the coast." },
      { name: "Traws Cymru T3", info: "Barmouth to Wrexham via Dolgellau, Bala & Corwen. Connects coast to inland North Wales." },
    ],
    airports: [
      { name: "Liverpool John Lennon", info: "~1 hr drive via A55/M53 (55 miles)" },
      { name: "Manchester", info: "~1.5 hrs drive via M56/A55 (80 miles). Direct train services from the airport." },
    ],
    driving: [
      { route: "From London", info: "~4.5 hrs via M40/M6/A55 (260 miles). A55 expressway runs the length of the coast." },
      { route: "From Manchester", info: "~1.5 hrs via M56/A55 (80 miles). Fastest route to North Wales." },
      { route: "From Liverpool", info: "~1 hr via M53/A55 (60 miles)" },
      { route: "From Birmingham", info: "~2.5 hrs via M54/A5/A483/A55 (140 miles)" },
      { route: "A55 Expressway", info: "Dual carriageway running along the entire North Wales coast from Chester to Holyhead. Fast and well-maintained." },
    ],
    carFree: "Yes — very practical. The North Wales Main Line provides excellent rail links along the coast. Regular Arriva buses connect all resort towns. Llandudno and Rhyl have direct trains from London and Manchester. Great Orme can be reached by tram from Llandudno.",
  },
  "wye-valley": {
    trainStations: [
      { name: "Chepstow", info: "Southern gateway. Hourly Cheltenham Spa–Cardiff service + CrossCountry trains every 2 hrs (Nottingham–Cardiff). Change at Newport for London Paddington (~2.5 hrs total)." },
      { name: "Lydney", info: "Forest of Dean side. On the Cheltenham–Cardiff line. Home of the Dean Forest Railway heritage line." },
      { name: "Abergavenny", info: "Northern gateway to the Wye Valley. ~3 hrs from London Paddington. Bus X4 connects to Monmouth." },
    ],
    busServices: [
      { name: "69", info: "Chepstow to Monmouth via Tintern (Newport Bus). ~48 min journey. Runs Mon–Sat, following the Wye Valley." },
      { name: "65", info: "Wye Valley High Road route via Chepstow. Mon–Sat service." },
      { name: "X4", info: "Hereford to Cardiff via Abergavenny. Useful for the northern Wye Valley." },
      { name: "National Express", info: "Coach services to Chepstow, Monmouth & Ross-on-Wye from London (~2 hrs 45 min)." },
    ],
    airports: [
      { name: "Bristol", info: "~45 min drive via M48/M4 (35 miles). Closest major airport." },
      { name: "Cardiff", info: "~45 min drive via M4/M48 (40 miles)" },
      { name: "Birmingham", info: "~1.5 hrs drive via M5/M50 (90 miles)" },
    ],
    driving: [
      { route: "From London", info: "~2.5 hrs via M4/M48 (150 miles). One of the closest Welsh adventure areas to London." },
      { route: "From Bristol", info: "~45 min via M48 (30 miles). Cross the Prince of Wales Bridge (no toll westbound)." },
      { route: "From Birmingham", info: "~1.5 hrs via M5/M50 (90 miles) through Ross-on-Wye." },
      { route: "From Cardiff", info: "~45 min via M4/M48 (35 miles)" },
      { route: "Parking: Tintern", info: "Tintern Old Station car park (free). Limited roadside parking in the village." },
    ],
    carFree: "Possible but limited. Bus 69 from Chepstow follows the Wye Valley through Tintern to Monmouth (Mon–Sat). Train to Chepstow is easy from Bristol, Cardiff or Gloucester. For deeper exploration of the valley and Forest of Dean, a car is helpful. The Wye Valley Walk is accessible from Chepstow station on foot.",
  },
};

// Default transport info for regions not in the map
const defaultTransport: TransportInfo = {
  trainStations: [
    { name: "Check local stations", info: "Transport for Wales runs services across Wales. Avanti West Coast and GWR connect to English cities." },
  ],
  busServices: [
    { name: "Traws Cymru", info: "Long-distance bus network connecting Welsh towns. Routes T1–T12 cover most regions. Free Wi-Fi on board." },
    { name: "Local buses", info: "Check Traveline Cymru (traveline.cymru) for local timetables and journey planning." },
  ],
  airports: [
    { name: "Cardiff", info: "Wales' main international airport, southern Wales" },
    { name: "Bristol / Birmingham", info: "Nearby English airports with wider route networks" },
  ],
  driving: [
    { route: "From London", info: "3–5.5 hrs depending on destination in Wales" },
    { route: "From Birmingham", info: "2–3 hrs via M5, M54 or M50" },
  ],
  carFree: "Wales has improving public transport links. Traws Cymru buses and Transport for Wales trains connect most regions. Check traveline.cymru for journey planning.",
};

// Generate metadata for SEO
export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = await getRegionWithStats(regionSlug);

  if (!region) {
    return {
      title: 'Region Not Found',
    };
  }

  const introText = extractIntro(region.description) || `Discover the adventures waiting for you in ${region.name}.`;
  const description = introText.slice(0, 160);

  return {
    title: `${region.name} | Discover Adventures in ${region.name} | Adventure Wales`,
    description,
    keywords: `${region.name}, Wales, adventure, outdoor activities, things to do, accommodation, travel guide`,
    openGraph: {
      title: `${region.name} | Adventure Wales`,
      description,
      type: 'website',
      locale: 'en_GB',
      url: `https://adventurewales.co.uk/${regionSlug}`,
      siteName: 'Adventure Wales',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${region.name} | Adventure Wales`,
      description,
    },
    alternates: {
      canonical: `https://adventurewales.co.uk/${regionSlug}`,
    },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: regionSlug } = await params;
  const region = await getRegionWithStats(regionSlug);

  if (!region) {
    notFound();
  }

  const [activities, accommodation, operators, mapEntities, activityTypesWithCount, bestLists] = await Promise.all([
    getActivitiesByRegion(regionSlug, 6),
    getAccommodationByRegion(regionSlug, 4),
    getOperators({ limit: 3 }),
    getRegionEntitiesForMap(region.id),
    getActivityTypesForRegion(region.id),
    Promise.resolve(getBestListsForRegion(regionSlug)),
  ]);

  // Prepare map markers for all entities in the region
  const mapMarkers: MapMarker[] = [
    // Activities (blue)
    ...mapEntities.activities.map((activity) => ({
      id: `activity-${activity.id}`,
      lat: parseFloat(String(activity.lat)),
      lng: parseFloat(String(activity.lng)),
      type: "activity" as const,
      title: activity.name,
      link: `/activities/${activity.slug}`,
      price: activity.priceFrom ? `From £${activity.priceFrom}` : undefined,
    })),
    // Accommodation (green)
    ...mapEntities.accommodation.map((acc) => ({
      id: `accommodation-${acc.id}`,
      lat: parseFloat(String(acc.lat)),
      lng: parseFloat(String(acc.lng)),
      type: "accommodation" as const,
      title: acc.name,
      link: `/accommodation/${acc.slug}`,
      price: acc.priceFrom ? `From £${acc.priceFrom}/night` : undefined,
      subtitle: acc.type || undefined,
    })),
    // Locations (purple)
    ...mapEntities.locations.map((location) => ({
      id: `location-${location.id}`,
      lat: parseFloat(String(location.lat)),
      lng: parseFloat(String(location.lng)),
      type: "location" as const,
      title: location.name,
      subtitle: "Point of Interest",
    })),
    // Events (red)
    ...mapEntities.events.map((event) => ({
      id: `event-${event.id}`,
      lat: parseFloat(String(event.lat)),
      lng: parseFloat(String(event.lng)),
      type: "event" as const,
      title: event.name,
      subtitle: event.type || undefined,
      price: event.registrationCost ? `£${event.registrationCost}` : undefined,
    })),
  ];
  
  // Filter events for widget
  const upcomingEvents = mapEntities.events
    .filter(e => !e.dateStart || new Date(e.dateStart) >= new Date())
    .sort((a, b) => {
       if (!a.dateStart) return 1;
       if (!b.dateStart) return -1;
       return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
    })
    .slice(0, 3);

  // Check if region has any content at all
  const hasContent = activities.length > 0 || accommodation.length > 0 || mapEntities.events.length > 0;

  // If no content, fetch other regions to suggest
  const allRegions = !hasContent ? await getAllRegions() : [];
  const otherRegions = allRegions.filter(r => r.slug !== regionSlug).slice(0, 6);

  // Extract structured content from description
  const introText = extractIntro(region.description) || `Discover the adventures waiting for you in ${region.name}.`;
  const proTips = extractProTips(region.description);
  const gettingThere = extractSection(region.description, 'Getting There') || defaultPlanContent.gettingThere;
  const bestTimeToVisit = extractSection(region.description, 'Best Time to Visit') || defaultPlanContent.bestTime;
  const essentialGear = defaultPlanContent.essentialGear;

  // Create breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Destinations', url: '/destinations' },
    { name: region.name, url: `/${regionSlug}` },
  ];

  return (
    <>
      <JsonLd data={createTouristDestinationSchema(region, {
        stats: region.stats,
        imageUrl: `https://adventurewales.co.uk/images/regions/${regionSlug}-hero.jpg`,
      })} />
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <div className="min-h-screen pt-4 lg:pt-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-6 lg:mb-8 group h-[400px] lg:h-[500px]">
          <div className="absolute inset-0 bg-gray-900">
            {/* Use local hero image */}
            <img 
              alt={region.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={`/images/regions/${regionSlug}-hero.jpg`}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          <div className="absolute top-4 right-4 flex gap-2 lg:hidden z-20">
             {/* Mobile Actions - placeholders */}
            <button className="text-white flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="text-white flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
              <Share className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10 flex flex-col gap-4 lg:gap-6 p-6 lg:p-12 text-white h-full justify-end">
             {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm font-medium text-gray-200">
              <Link href="/" className="hover:text-white transition-colors">Wales</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{region.name}</span>
            </div>

             {/* Heading */}
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tight mb-2 lg:mb-3">
                {region.name}
              </h1>
              <p className="text-base lg:text-xl text-gray-200 font-medium max-w-xl line-clamp-3">
                {introText.split('.').slice(0, 2).join('.') + '.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <StatCard label="Activities" value={region.stats.activities} icon={Footprints} />
          <StatCard label="Operators" value={region.stats.operators} icon={Users} />
          <StatCard label="Stays" value={region.stats.accommodation} icon={Home} />
          <StatCard label="Events" value={region.stats.events} icon={Calendar} />
        </div>

        {/* Sticky Section Nav */}
        <nav className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-md pt-2 pb-3 lg:pb-4 mb-4 lg:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex overflow-x-auto border-b border-gray-200 gap-4 lg:gap-8 no-scrollbar">
            {activities.length > 0 && (
              <AnchorTab href="#activities" label="Activities" />
            )}
            {accommodation.length > 0 && (
              <AnchorTab href="#accommodation" label="Accommodation" />
            )}
            {upcomingEvents.length > 0 && (
              <AnchorTab href="#events" label="Events" />
            )}
            <AnchorTab href="#map" label="Map" />
            <AnchorTab href="#getting-there" label="Getting There" />
            <AnchorTab href="#directory" label="Directory" />
          </div>
        </nav>

        {/* Empty Region State */}
        {!hasContent && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-primary/5 to-accent-hover/5 rounded-2xl p-8 lg:p-12 text-center border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-hover/10 mb-6">
                <Compass className="w-8 h-8 text-accent-hover" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-primary mb-3">
                We&apos;re still exploring {region.name}
              </h2>
              <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto mb-8">
                We&apos;re busy discovering the best adventures, accommodation, and hidden gems in {region.name}. 
                Check back soon — or explore one of these other incredible regions in Wales.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
                {otherRegions.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${r.slug}`}
                    className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                      <img 
                        alt={r.name}
                        className="w-full h-full object-cover"
                        src={`/images/regions/${r.slug}-hero.jpg`}
                      />
                    </div>
                    <span className="text-sm font-bold text-primary group-hover:text-accent-hover transition-colors">
                      {r.name}
                    </span>
                  </Link>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/destinations"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-[#2d5568] transition-colors"
                >
                  Browse All Regions
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/activities"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-full border border-gray-200 hover:border-primary/30 transition-colors"
                >
                  View All Activities
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Layout */}
        {hasContent && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">

            {/* Top Experiences Grid — prominent at top */}
            {activities.length > 0 && (
              <section id="activities" className="scroll-mt-32">
                <div className="flex justify-between items-end mb-4 lg:mb-5">
                  <h3 className="text-lg lg:text-xl font-bold text-primary">Top Experiences</h3>
                  <Link href={`/${regionSlug}/things-to-do`} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  {activities.slice(0, 4).map((item) => (
                      <ActivityCard
                          key={item.activity.id}
                          activity={item.activity}
                          region={item.region}
                          operator={item.operator}
                          hideOperator={true}
                      />
                  ))}
                </div>
              </section>
            )}

            {/* Explore by Activity Grid */}
            {activityTypesWithCount.length > 0 && (
              <section className="scroll-mt-32">
                <div className="flex justify-between items-end mb-4 lg:mb-5">
                  <h3 className="text-lg lg:text-xl font-bold text-primary">Explore by Activity</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                  {activityTypesWithCount.map((item) => (
                    <Link
                      key={item.activityType.id}
                      href={`/${regionSlug}/things-to-do/${item.activityType.slug}`}
                      className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all"
                    >
                      <div className="aspect-[4/3] relative bg-gradient-to-br from-primary/10 to-accent-hover/10">
                        <img
                          src={`/images/activities/${item.activityType.slug}-hero.jpg`}
                          alt={item.activityType.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to gradient background if image doesn't exist
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Count badge */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-primary px-2 py-1 rounded-full text-xs font-bold">
                          {Number(item.count)}
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <h4 className="font-bold text-sm text-primary group-hover:text-accent-hover transition-colors line-clamp-2">
                          {item.activityType.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {Number(item.count)} experience{Number(item.count) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Intro */}
            <section>
              <h3 className="text-lg lg:text-xl font-bold mb-3 text-primary">Welcome to {region.name}</h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                 {introText}
              </p>
              
              {proTips.length > 0 && (
                <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-xl border-l-4 border-primary mt-4">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>Top Tip:</strong> {proTips[0]}
                  </p>
                </div>
              )}
            </section>

            {/* Scenic Gallery */}
            <ScenicGallery regionSlug={regionSlug} regionName={region.name} />

            {/* Activity Season Guide */}
            <ActivitySeasonGuide regionSlug={regionSlug} />

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section id="events" className="scroll-mt-32">
                <ThisWeekendWidget
                  events={upcomingEvents}
                  title={`Events in ${region.name}`}
                  subtitle="Coming Up"
                  viewAllLink={`/calendar?region=${regionSlug}`}
                />
              </section>
            )}

            {/* Our Top Picks - Best-Of Lists */}
            {bestLists.length > 0 && (
              <section className="scroll-mt-32">
                <div className="flex justify-between items-end mb-4 lg:mb-5">
                  <h3 className="text-lg lg:text-xl font-bold text-primary">Our Top Picks</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  {bestLists.map((list) => (
                    <BestOfCard
                      key={list.slug}
                      title={list.title}
                      strapline={list.strapline}
                      href={list.urlPath}
                      count={list.entries.length}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Accommodation Grid */}
            {accommodation.length > 0 && (
              <section id="accommodation" className="scroll-mt-32">
                <div className="flex justify-between items-end mb-4 lg:mb-5">
                  <h3 className="text-lg lg:text-xl font-bold text-primary">Where to Stay</h3>
                  <Link href={`/${regionSlug}/where-to-stay`} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  {accommodation.slice(0, 2).map((item) => (
                      <AccommodationCard
                          key={item.accommodation.id}
                          accommodation={item.accommodation}
                          region={item.region}
                      />
                  ))}
                </div>
                <div className="mt-5">
                  <BookingWidget regionName={region.name} />
                </div>
              </section>
            )}

            {/* Interactive Map Section */}
            <section id="map" className="scroll-mt-32">
              <h3 className="text-lg lg:text-xl font-bold mb-4 text-primary">Explore the Region</h3>
              <RegionMap
                markers={mapMarkers}
                center={region.lat && region.lng ? [parseFloat(String(region.lat)), parseFloat(String(region.lng))] : undefined}
                zoom={10}
                height="450px"
                className="shadow-md"
              />
              
              {/* Map Legend */}
              <div className="flex flex-wrap gap-3 lg:gap-4 mt-4 text-xs lg:text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white shadow-sm"></span>
                  Activities ({mapEntities.activities.length})
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white shadow-sm"></span>
                  Accommodation ({mapEntities.accommodation.length})
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#a855f7] border-2 border-white shadow-sm"></span>
                  Locations ({mapEntities.locations.length})
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#ef4444] border-2 border-white shadow-sm"></span>
                  Events ({mapEntities.events.length})
                </span>
              </div>
            </section>

            {/* Getting There — Transport Section */}
            <section id="getting-there" className="scroll-mt-32">
              <h3 className="text-lg lg:text-xl font-bold mb-4 text-primary">Getting There</h3>
              <TransportSection regionSlug={regionSlug} descriptionText={gettingThere} />
            </section>

            {/* Plan Your Visit Accordion */}
            <section>
              <h3 className="text-lg lg:text-xl font-bold mb-4 text-primary">Plan Your Visit</h3>
              <div className="flex flex-col gap-3">
                <AccordionItem 
                    icon={Cloud} 
                    title="Best Time to Visit" 
                    content={bestTimeToVisit} 
                />
                <AccordionItem 
                    icon={Backpack} 
                    title="Essential Gear" 
                    content={essentialGear} 
                />
              </div>
            </section>

          </div>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Weather Widget — compact in sidebar with climate tab */}
            {region.lat && region.lng && (
              <WeatherWidget 
                lat={parseFloat(String(region.lat))} 
                lng={parseFloat(String(region.lng))} 
                regionName={region.name}
                regionSlug={regionSlug}
              />
            )}
            
            {/* Local Businesses */}
            <div id="directory" className="scroll-mt-32 bg-white p-5 lg:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-primary">Local Businesses</h3>
                <Link href="/directory" className="text-xs font-bold text-primary hover:underline">View all</Link>
              </div>
              <div className="flex flex-col gap-4">
                {operators.map((op) => (
                    <div key={op.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="size-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                            {op.logoUrl ? (
                                <img alt={op.name} className="w-full h-full object-cover" src={op.logoUrl} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                    {op.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-primary">{op.name}</p>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs text-gray-500">{op.googleRating || "5.0"} ({op.reviewCount || 100} reviews)</span>
                            </div>
                        </div>
                        <Link href={`/directory/${op.slug}`} className="size-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                        </Link>
                    </div>
                ))}
              </div>
            </div>

            {/* Advertise CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-primary text-white p-5 lg:p-6 shadow-md">
              <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
                <Users className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px]" />
              </div>
              <h4 className="text-lg font-bold mb-2 relative z-10">List Your Business</h4>
              <p className="text-sm text-blue-100 mb-4 relative z-10">Get discovered by visitors planning their {region.name} trip. Free listing available.</p>
              <Link href="/advertise" className="block w-full bg-white text-primary font-bold py-2.5 rounded-lg text-sm relative z-10 hover:bg-gray-100 transition-colors text-center">
                Learn More
              </Link>
            </div>
          </aside>
        </div>}
      </div>

      {/* CTA Section */}
      <div className="bg-accent-hover p-6 lg:p-10 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center gap-4 max-w-xl mx-auto">
          <h2 className="text-white text-xl lg:text-2xl font-black leading-tight tracking-tight">
            Ready to plan your {region.name} adventure?
          </h2>
          <p className="text-white/80 text-sm font-medium">Create a custom itinerary in minutes.</p>
          <button className="bg-primary text-white text-sm lg:text-base font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
            Start Planning
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl p-4 lg:p-5 border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex justify-between items-start">
        <p className="text-gray-500 text-xs lg:text-sm font-medium">{label}</p>
        <Icon className="text-primary group-hover:scale-110 transition-transform w-5 h-5 lg:w-6 lg:h-6" />
      </div>
      <p className="text-xl lg:text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function AnchorTab({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      className="flex flex-col items-center justify-center border-b-[3px] border-transparent pb-3 px-2 shrink-0 transition-colors text-gray-500 hover:text-primary hover:border-primary/40"
    >
      <p className="text-sm font-bold whitespace-nowrap">{label}</p>
    </a>
  );
}

function TabLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center border-b-[3px] pb-3 px-2 shrink-0 transition-colors ${
        active 
        ? "border-primary text-primary" 
        : "border-transparent text-gray-500 hover:text-primary"
      }`}
    >
      <p className="text-sm font-bold whitespace-nowrap">{label}</p>
    </Link>
  );
}

function MapFilterPill({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50 text-primary">
      {icon} {label}
    </span>
  );
}

function AccordionItem({ icon: Icon, title, content }: { icon: any; title: string; content: string }) {
  return (
    <details className="group bg-white rounded-xl overflow-hidden border border-gray-200">
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Icon className="text-primary w-5 h-5" />
          </div>
          <span className="font-bold text-primary">{title}</span>
        </div>
        <ChevronRight className="text-gray-400 transition-transform group-open:rotate-90 w-5 h-5" />
      </summary>
      <div className="px-4 pb-4 pt-0 text-gray-600 text-sm leading-relaxed pl-[60px]">
        {content}
      </div>
    </details>
  );
}

function TransportSection({ regionSlug, descriptionText }: { regionSlug: string; descriptionText: string }) {
  const transport = regionTransport[regionSlug] || defaultTransport;

  return (
    <div className="space-y-4">
      {/* Summary text from description if available */}
      {descriptionText && descriptionText !== defaultPlanContent.gettingThere && (
        <p className="text-gray-600 text-sm leading-relaxed">{descriptionText}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Train Stations */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Train className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-sm text-primary">By Train</h4>
          </div>
          <ul className="space-y-2">
            {transport.trainStations.map((station) => (
              <li key={station.name} className="text-sm">
                <span className="font-semibold text-primary">{station.name}</span>
                <p className="text-gray-500 text-xs mt-0.5">{station.info}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Bus Services */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Bus className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="font-bold text-sm text-primary">By Bus</h4>
          </div>
          <ul className="space-y-2">
            {transport.busServices.map((service) => (
              <li key={service.name} className="text-sm">
                <span className="font-semibold text-primary">{service.name}</span>
                <p className="text-gray-500 text-xs mt-0.5">{service.info}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Driving */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Car className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-bold text-sm text-primary">By Car</h4>
          </div>
          <ul className="space-y-2">
            {transport.driving.map((route) => (
              <li key={route.route} className="text-sm">
                <span className="font-semibold text-primary">{route.route}</span>
                <p className="text-gray-500 text-xs mt-0.5">{route.info}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Airports */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Plane className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-sm text-primary">By Air</h4>
          </div>
          <ul className="space-y-2">
            {transport.airports.map((airport) => (
              <li key={airport.name} className="text-sm">
                <span className="font-semibold text-primary">{airport.name}</span>
                <p className="text-gray-500 text-xs mt-0.5">{airport.info}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Car-Free Options */}
      {transport.carFree && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Compass className="w-5 h-5 text-emerald-700" />
            </div>
            <h4 className="font-bold text-sm text-emerald-800">Car-Free Options</h4>
          </div>
          <p className="text-emerald-700 text-sm leading-relaxed">{transport.carFree}</p>
        </div>
      )}
    </div>
  );
}
