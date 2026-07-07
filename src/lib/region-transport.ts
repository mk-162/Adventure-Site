// Static "Getting There" transport data per region, keyed by region slug.
// Extracted from the region page template — this dataset doesn't change at
// runtime, so it lives as a plain typed module rather than inline JSX data.

export interface TransportInfo {
  trainStations: { name: string; info: string }[];
  busServices: { name: string; info: string }[];
  airports: { name: string; info: string }[];
  driving: { route: string; info: string }[];
  carFree: string;
}

export const regionTransport: Record<string, TransportInfo> = {
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
  gower: {
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
  "mid-wales": {
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
  "south-wales": {
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
  "north-wales": {
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
  "llyn-peninsula": {
    trainStations: [
      { name: "Pwllheli", info: "Cambrian Coast line terminus. Scenic route from Machynlleth/Shrewsbury (~3 hrs). Change at Shrewsbury for London/Birmingham." },
      { name: "Criccieth", info: "Cambrian Coast line. Small coastal town, good base for south Llŷn." },
      { name: "Porthmadog", info: "Cambrian Coast line + Ffestiniog Railway. Junction for Snowdonia and Llŷn. ~3 hrs from Shrewsbury." },
      { name: "Abererch", info: "Request stop between Pwllheli and Porthmadog. Quiet access to southern beaches." },
    ],
    busServices: [
      { name: "1/1A", info: "Caernarfon to Pwllheli via Clynnog Fawr, Trefor & Nefyn. The main north coast route, roughly hourly Mon–Sat." },
      { name: "17/18", info: "Pwllheli to Aberdaron via Llanbedrog & Abersoch. Serves the southern tip. Limited service." },
      { name: "Traws Cymru T2", info: "Bangor to Aberystwyth via Caernarfon & Porthmadog. Connects Llŷn to Snowdonia and Mid Wales." },
      { name: "Bws Gwynedd", info: "Local demand-responsive service covering rural Llŷn. Book via app or phone." },
    ],
    airports: [
      { name: "Liverpool John Lennon", info: "~2.5 hrs drive via A55/A487 (110 miles)" },
      { name: "Manchester", info: "~3 hrs drive via M56/A55/A487 (130 miles)" },
    ],
    driving: [
      { route: "From London", info: "~5.5 hrs via M40/M6/A55/A487 (290 miles)" },
      { route: "From Birmingham", info: "~3.5 hrs via M54/A5/A487 (150 miles)" },
      { route: "From Manchester", info: "~3 hrs via M56/A55/A487 (130 miles)" },
      { route: "Parking: Aberdaron", info: "Pay & display car park near the beach. £5/day. Can fill up in peak summer." },
      { route: "Parking: Porth Neigwl", info: "Small National Trust car park (free for NT members). Very limited spaces — arrive early." },
    ],
    carFree: "Difficult. Bus services exist but are infrequent, especially to the western tip. Train to Pwllheli works as a base, but exploring Aberdaron, Hell's Mouth (Porth Neigwl), and the coastal path requires either a car, cycling, or a lot of patience with bus timetables. Cycling the quiet lanes is excellent if you're fit.",
  },
  carmarthenshire: {
    trainStations: [
      { name: "Carmarthen", info: "Main hub. Transport for Wales from Swansea (~45 min), Cardiff (~1 hr 45 min). GWR from London Paddington (~4 hrs via Swansea)." },
      { name: "Llandeilo", info: "Heart of Wales line (Swansea to Shrewsbury). Beautiful scenic route, 4 trains per day. Gateway to the Towy Valley." },
      { name: "Llandovery", info: "Heart of Wales line. Northern Carmarthenshire, gateway to the Brecon Beacons' western edges." },
      { name: "Kidwelly", info: "Main line between Carmarthen and Swansea. Access to Kidwelly Castle and the coastal area." },
    ],
    busServices: [
      { name: "Traws Cymru T1", info: "Carmarthen to Aberystwyth via Lampeter & Aberaeron. Key north-south route through rural west Wales." },
      { name: "280/281", info: "Carmarthen to Llandeilo and surrounding villages. Regular Mon–Sat service." },
      { name: "103", info: "Carmarthen to Pendine via Laugharne (Dylan Thomas country). Limited service." },
      { name: "fflecsi Carmarthenshire", info: "On-demand bus covering areas around Carmarthen and Llandeilo. Book via fflecsi app." },
    ],
    airports: [
      { name: "Cardiff", info: "~1.5 hrs drive via M4/A48 (80 miles)" },
      { name: "Bristol", info: "~2.5 hrs drive via M4/M48 (130 miles)" },
    ],
    driving: [
      { route: "From London", info: "~4 hrs via M4/A48 (230 miles). Exit M4 at Pont Abraham." },
      { route: "From Cardiff", info: "~1.5 hrs via M4/A48 (80 miles)" },
      { route: "From Swansea", info: "~40 min via A48 (30 miles)" },
      { route: "From Birmingham", info: "~3 hrs via M5/M4/A48 (150 miles)" },
    ],
    carFree: "The Heart of Wales line is one of Britain's most scenic railway journeys and connects Llandeilo and Llandovery. Carmarthen has reasonable bus links. However, many of the county's best outdoor spots (Brechfa Forest, the Towy Valley trails) are remote — a car is strongly recommended for adventure activities.",
  },
};

/** Default transport info for regions not covered in the map above. */
export const defaultTransport: TransportInfo = {
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

/** Look up transport info for a region slug, falling back to generic Wales-wide guidance. */
export function getRegionTransport(regionSlug: string): TransportInfo {
  return regionTransport[regionSlug] || defaultTransport;
}
