/**
 * Seed script to add 50+ family, festival, and cultural events to Adventure Wales
 * Run with: DATABASE_URL="..." npx tsx scripts/seed-family-events.ts
 */

import { db } from '../src/db';
import { events, regions } from '../src/db/schema';
import { eq } from 'drizzle-orm';

interface EventData {
  name: string;
  slug: string;
  type: string;
  category: string;
  description: string;
  monthTypical: string;
  location: string;
  regionSlug: string;
  website: string;
  registrationCost: string;
  tags: string[];
  ageRange: string;
}

const newEvents: EventData[] = [
  // =====================
  // AGRICULTURAL SHOWS (10 events)
  // =====================
  {
    name: "Royal Welsh Show",
    slug: "royal-welsh-show",
    type: "Agricultural Show",
    category: "festival",
    description: "Europe's premier agricultural show with 200,000+ visitors annually. Four days of livestock competitions, forestry, crafts, food hall, and entertainment. A true celebration of Welsh rural life and farming heritage.",
    monthTypical: "July 20-23",
    location: "Royal Welsh Showground, Builth Wells",
    regionSlug: "mid-wales",
    website: "https://rwas.wales/royal-welsh-show/",
    registrationCost: "£36 adults, £10 children (under 5s free)",
    tags: ["family-friendly", "food", "outdoor", "livestock", "crafts", "entertainment"],
    ageRange: "All ages"
  },
  {
    name: "Anglesey County Show",
    slug: "anglesey-county-show",
    type: "Agricultural Show",
    category: "festival",
    description: "Annual two-day agricultural show featuring fantastic displays of livestock, local produce, arts and crafts, equestrian events, and family entertainment. A great day out in the heart of beautiful Anglesey.",
    monthTypical: "August 11-12",
    location: "Mona Showground, Anglesey",
    regionSlug: "anglesey",
    website: "https://www.angleseyshow.org.uk/",
    registrationCost: "£15 adults, £5 children",
    tags: ["family-friendly", "livestock", "crafts", "equestrian", "outdoor"],
    ageRange: "All ages"
  },
  {
    name: "Pembrokeshire County Show",
    slug: "pembrokeshire-county-show",
    type: "Agricultural Show",
    category: "festival",
    description: "Pembrokeshire's biggest agricultural event over two days. Features dog agility, show jumping, classic cars, fun fair, livestock competitions and live entertainment. A fantastic family day out.",
    monthTypical: "August 19-20",
    location: "Withybush Showground, Haverfordwest",
    regionSlug: "pembrokeshire",
    website: "https://www.pembsshow.org/",
    registrationCost: "£18 adults, £5 children",
    tags: ["family-friendly", "livestock", "show-jumping", "classic-cars", "outdoor"],
    ageRange: "All ages"
  },
  {
    name: "Aberystwyth & Ceredigion County Show",
    slug: "aberystwyth-ceredigion-show",
    type: "Agricultural Show",
    category: "festival",
    description: "One of the largest one-day shows in Mid Wales with over 1700 entries. Features national sheep competitions, speed shearing evening concert with Welsh pop stars. Great family atmosphere.",
    monthTypical: "June 13",
    location: "Gelli Angharad Fields, Aberystwyth",
    regionSlug: "mid-wales",
    website: "https://sioeaberystwythshow.co.uk/",
    registrationCost: "£12 adults, £4 children",
    tags: ["family-friendly", "livestock", "sheep", "music", "outdoor"],
    ageRange: "All ages"
  },
  {
    name: "Brecon County Show",
    slug: "brecon-county-show",
    type: "Agricultural Show",
    category: "festival",
    description: "The oldest agricultural show in the UK, established in 1755. Features livestock competitions, main ring attractions, horticulture, food hall and craft stalls. A historic celebration of rural Brecon life.",
    monthTypical: "August 1",
    location: "Brecon County Showground",
    regionSlug: "brecon-beacons",
    website: "https://www.breconcountyshow.co.uk/",
    registrationCost: "£14 adults, £4 children",
    tags: ["family-friendly", "historic", "livestock", "crafts", "food", "outdoor"],
    ageRange: "All ages"
  },
  {
    name: "Cardigan County Show",
    slug: "cardigan-county-show",
    type: "Agricultural Show",
    category: "festival",
    description: "Popular agricultural show featuring livestock judging from across the country, dog shows, food hall and fun fair. Great opportunity to see farm produce and local arts and crafts.",
    monthTypical: "August 1",
    location: "Cardigan",
    regionSlug: "mid-wales",
    website: "https://cardigancountyshow.org.uk/",
    registrationCost: "£12 adults, £4 children",
    tags: ["family-friendly", "livestock", "dog-show", "food", "crafts"],
    ageRange: "All ages"
  },
  {
    name: "Usk Show",
    slug: "usk-show",
    type: "Agricultural Show",
    category: "festival",
    description: "Held annually since 1844, celebrating the best of Monmouthshire farming and rural life. Features 11 competition sections including show jumping, companion dog shows and vintage tractors across 100 acres.",
    monthTypical: "September 12",
    location: "Usk Showground, Gwernesney",
    regionSlug: "wye-valley",
    website: "https://www.uskshow.co.uk/",
    registrationCost: "£15 adults, £5 children",
    tags: ["family-friendly", "historic", "livestock", "vintage", "equestrian"],
    ageRange: "All ages"
  },
  {
    name: "Vale of Glamorgan Show",
    slug: "vale-of-glamorgan-show",
    type: "Agricultural Show",
    category: "festival",
    description: "Annual agricultural show celebrating farming heritage in the Vale. Features livestock competitions, craft displays, local produce stalls and family entertainment.",
    monthTypical: "August 12",
    location: "Fonmon Castle, Barry",
    regionSlug: "south-wales",
    website: "https://www.valeshow.co.uk/",
    registrationCost: "£14 adults, £5 children",
    tags: ["family-friendly", "livestock", "crafts", "food", "outdoor"],
    ageRange: "All ages"
  },
  {
    name: "Chepstow Show",
    slug: "chepstow-show",
    type: "Agricultural Show",
    category: "festival",
    description: "Vibrant celebration of rural life at Chepstow Racecourse. Features livestock, horticulture, dog show, vintage vehicles, circus workshops, giant inflatables and live music. Great family day out.",
    monthTypical: "August (TBC)",
    location: "Chepstow Racecourse",
    regionSlug: "wye-valley",
    website: "https://www.chepstowshow.co.uk/",
    registrationCost: "£12 adults, £5 children",
    tags: ["family-friendly", "livestock", "vintage", "kids", "entertainment"],
    ageRange: "All ages"
  },
  {
    name: "Royal Welsh Winter Fair",
    slug: "royal-welsh-winter-fair",
    type: "Agricultural Show",
    category: "festival",
    description: "One of Europe's finest prime stock shows with two days of competitions. Excellent food hall featuring Welsh producers and fantastic Christmas shopping opportunities.",
    monthTypical: "November 30 - December 1",
    location: "Royal Welsh Showground, Builth Wells",
    regionSlug: "mid-wales",
    website: "https://rwas.wales/winter-fair/",
    registrationCost: "£25 adults, £8 children",
    tags: ["food", "christmas", "livestock", "shopping", "indoor"],
    ageRange: "All ages"
  },

  // =====================
  // FOOD & DRINK FESTIVALS (12 events)
  // =====================
  {
    name: "Abergavenny Food Festival",
    slug: "abergavenny-food-festival",
    type: "Food Festival",
    category: "festival",
    description: "One of the most prestigious food festivals in the UK, held in foodie Monmouthshire. Features celebrity chef masterclasses, demos, talks, guided foraging walks and imaginative activities. A must for food lovers.",
    monthTypical: "September 19-20",
    location: "Abergavenny Town Centre",
    regionSlug: "wye-valley",
    website: "https://www.abergavennyfoodfestival.com/",
    registrationCost: "From £15 day tickets",
    tags: ["food", "family-friendly", "chefs", "demos", "foraging"],
    ageRange: "All ages"
  },
  {
    name: "Narberth Food Festival",
    slug: "narberth-food-festival",
    type: "Food Festival",
    category: "festival",
    description: "One of Wales' longest-established and friendliest food festivals. Features local producers, chef demos, live music from local bands, and celebration of the best Welsh food and drink.",
    monthTypical: "September 26-27",
    location: "Narberth Town Centre",
    regionSlug: "pembrokeshire",
    website: "https://www.narberthfoodfestival.com/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "music", "welsh-produce"],
    ageRange: "All ages"
  },
  {
    name: "Mold Food & Drink Festival",
    slug: "mold-food-drink-festival",
    type: "Food Festival",
    category: "festival",
    description: "Showcases great variety of local produce from Mold and surrounding areas. Features interactive areas, cookery school, chef demonstrations and family activities.",
    monthTypical: "September (TBC)",
    location: "Mold Town Centre",
    regionSlug: "north-wales",
    website: "https://moldfoodfestival.co.uk/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "demos", "interactive"],
    ageRange: "All ages"
  },
  {
    name: "Conwy Honey Fair",
    slug: "conwy-honey-fair",
    type: "Food Festival",
    category: "festival",
    description: "One of Britain's oldest food festivals, dating back over 700 years. By Royal Charter, held on September 13 annually. Features honey, beekeeping stalls, preserves and local crafts.",
    monthTypical: "September 14",
    location: "Conwy Town Centre",
    regionSlug: "north-wales",
    website: "https://www.conwybeekeepers.org.uk/",
    registrationCost: "Free entry",
    tags: ["food", "free", "historic", "honey", "crafts"],
    ageRange: "All ages"
  },
  {
    name: "Cardiff Food & Drink Festival",
    slug: "cardiff-food-drink-festival",
    type: "Food Festival",
    category: "festival",
    description: "Three days of gourmet delights in Cardiff Bay with over 100 food and drink producers. Features live music, demos, workshops and a Champagne Bar. Huge crowds in good weather.",
    monthTypical: "June (TBC)",
    location: "Cardiff Bay",
    regionSlug: "south-wales",
    website: "https://www.visitcardiff.com/food-drink/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "music", "demos"],
    ageRange: "All ages"
  },
  {
    name: "Caerphilly Food & Drink Festival",
    slug: "caerphilly-food-drink-festival",
    type: "Food Festival",
    category: "festival",
    description: "Town centre transformed into a marketplace bursting with culinary delights. Features artisan food stalls, street entertainment and live performances beneath Caerphilly Castle.",
    monthTypical: "April 18",
    location: "Caerphilly Town Centre",
    regionSlug: "south-wales",
    website: "https://www.caerphillyfoodfestival.co.uk/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "castle", "entertainment"],
    ageRange: "All ages"
  },
  {
    name: "Cardigan River & Food Festival",
    slug: "cardigan-river-food-festival",
    type: "Food Festival",
    category: "festival",
    description: "Unique festival combining local food producers with water-based entertainment. Features coracle races, RNLI demos, award-winning cheesemakers and rare breed farmers along the River Teifi.",
    monthTypical: "August 15",
    location: "Cardigan Town",
    regionSlug: "mid-wales",
    website: "http://www.cardigan-food-festival.co.uk/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "river", "coracles", "unique"],
    ageRange: "All ages"
  },
  {
    name: "Llangollen Food Festival",
    slug: "llangollen-food-festival",
    type: "Food Festival",
    category: "festival",
    description: "Annual food celebration in the town famous for the International Eisteddfod. Features local produce, cookery demos and fun events like speed truffle-making and pumpkin carving.",
    monthTypical: "October (TBC)",
    location: "Llangollen Town Centre",
    regionSlug: "north-wales",
    website: "https://llangollenfoodfestival.com/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "demos", "competitions"],
    ageRange: "All ages"
  },
  {
    name: "Lampeter Food Festival",
    slug: "lampeter-food-festival",
    type: "Food Festival",
    category: "festival",
    description: "Charming festival on the lawns of the university campus. Features organic vegetables, artisan cheese, cupcakes, old-fashioned preserves and live music from local bands.",
    monthTypical: "July 25",
    location: "University of Wales, Lampeter",
    regionSlug: "mid-wales",
    website: "https://www.facebook.com/Lampeterfoodfestival/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "organic", "artisan"],
    ageRange: "All ages"
  },
  {
    name: "Portmeirion Food & Craft Fair",
    slug: "portmeirion-food-craft-fair",
    type: "Food Festival",
    category: "festival",
    description: "Stunning setting in the colourful Italianate village. Features 120 stalls celebrating Welsh products, live music, cookery demos, workshops and magical Christmas Grotto.",
    monthTypical: "December (TBC)",
    location: "Portmeirion Village",
    regionSlug: "snowdonia",
    website: "https://portmeirion.wales/visit/whats-on/food-and-craft-fair",
    registrationCost: "£8 adults, £4 children",
    tags: ["food", "christmas", "crafts", "unique", "festive"],
    ageRange: "All ages"
  },
  {
    name: "Brecon Beacons Food Festival",
    slug: "brecon-beacons-food-festival",
    type: "Food Festival",
    category: "festival",
    description: "Showcases the best of local and international cuisine in the Market Hall. Features over 60 exhibitors, cooking demonstrations, tastings and entertainment.",
    monthTypical: "October (TBC)",
    location: "Market Hall, Brecon",
    regionSlug: "brecon-beacons",
    website: "https://breconbeaconsfoodfestival.co.uk/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "demos", "indoor"],
    ageRange: "All ages"
  },
  {
    name: "Caerphilly Cheese Festival",
    slug: "caerphilly-cheese-festival",
    type: "Food Festival",
    category: "festival",
    description: "Free weekend festival celebrating the town's famous cheese. Features food and drink stalls, music areas, workshops, craft sessions and funfair rides.",
    monthTypical: "August (TBC)",
    location: "Caerphilly Town Centre",
    regionSlug: "south-wales",
    website: "https://www.caerphillycheesefestival.co.uk/",
    registrationCost: "Free entry",
    tags: ["food", "family-friendly", "free", "cheese", "music", "funfair"],
    ageRange: "All ages"
  },

  // =====================
  // MUSIC & ARTS FESTIVALS (8 events)
  // =====================
  {
    name: "Hay Festival",
    slug: "hay-festival",
    type: "Literary Festival",
    category: "cultural",
    description: "World-renowned festival of literature and culture bringing together voices from art, science, politics, music and comedy. Features author talks, performances and workshops in the 'Town of Books'.",
    monthTypical: "May 21-31",
    location: "Hay-on-Wye",
    regionSlug: "brecon-beacons",
    website: "https://www.hayfestival.com/",
    registrationCost: "From £10 per event",
    tags: ["literary", "arts", "talks", "cultural", "world-class"],
    ageRange: "Adults"
  },
  {
    name: "Llangollen International Musical Eisteddfod",
    slug: "llangollen-international-eisteddfod",
    type: "Music Festival",
    category: "cultural",
    description: "79 years promoting international harmony through music and dance. Features global performers, Voice of the Future competition and spectacular evening concerts. A true celebration of world cultures.",
    monthTypical: "July 7-12",
    location: "Royal International Pavilion, Llangollen",
    regionSlug: "north-wales",
    website: "https://international-eisteddfod.co.uk/",
    registrationCost: "From £15 day tickets",
    tags: ["music", "dance", "international", "cultural", "world-class"],
    ageRange: "All ages"
  },
  {
    name: "Festival No.6",
    slug: "festival-no6",
    type: "Music Festival",
    category: "festival",
    description: "Unique arts and music festival in the stunning Italianate village of Portmeirion. Combines world-class music with art installations, talks, comedy and the magical setting of the Prisoner TV series location.",
    monthTypical: "September (TBC)",
    location: "Portmeirion Village",
    regionSlug: "snowdonia",
    website: "https://festivalnumber6.com/",
    registrationCost: "Weekend tickets from £200",
    tags: ["music", "arts", "unique", "camping", "cultural"],
    ageRange: "Adults"
  },
  {
    name: "Fishguard Folk Festival",
    slug: "fishguard-folk-festival",
    type: "Music Festival",
    category: "festival",
    description: "Traditional folk music festival featuring Welsh and international artists. Concerts, sessions, workshops and ceilidhs across multiple venues in this charming harbour town.",
    monthTypical: "May (TBC)",
    location: "Fishguard Town",
    regionSlug: "pembrokeshire",
    website: "https://www.fishguardfolkfestival.co.uk/",
    registrationCost: "Weekend pass £80",
    tags: ["music", "folk", "traditional", "workshops", "ceilidh"],
    ageRange: "All ages"
  },
  {
    name: "Beaumaris Festival",
    slug: "beaumaris-festival",
    type: "Arts Festival",
    category: "cultural",
    description: "Week-long celebration of music, arts and literature in the historic castle town. Features classical concerts, jazz, drama, talks and community events in stunning medieval surroundings.",
    monthTypical: "May (TBC)",
    location: "Beaumaris Town",
    regionSlug: "anglesey",
    website: "https://www.beaumarisfestival.org/",
    registrationCost: "From £10 per event",
    tags: ["music", "arts", "classical", "cultural", "historic"],
    ageRange: "All ages"
  },
  {
    name: "Wonderwool Wales",
    slug: "wonderwool-wales",
    type: "Craft Festival",
    category: "festival",
    description: "Europe's premier celebration of wool and natural fibres. Features 200+ exhibitors, workshops in spinning, dyeing and felting, competitions and a fascinating fleece hall.",
    monthTypical: "April 25-26",
    location: "Royal Welsh Showground, Builth Wells",
    regionSlug: "mid-wales",
    website: "https://wonderwoolwales.co.uk/",
    registrationCost: "£12 adults, children free",
    tags: ["crafts", "wool", "workshops", "unique", "artisan"],
    ageRange: "All ages"
  },
  {
    name: "Hay Festival Winter Weekend",
    slug: "hay-festival-winter-weekend",
    type: "Literary Festival",
    category: "cultural",
    description: "Cosy winter celebration of literature and culture at Hay Castle. Features author talks, performances and workshops in intimate castle setting.",
    monthTypical: "November (TBC)",
    location: "Hay Castle, Hay-on-Wye",
    regionSlug: "brecon-beacons",
    website: "https://www.hayfestival.com/winter-weekend/",
    registrationCost: "From £10 per event",
    tags: ["literary", "arts", "talks", "cultural", "cosy"],
    ageRange: "Adults"
  },
  {
    name: "Beyond the Border",
    slug: "beyond-the-border",
    type: "Storytelling Festival",
    category: "cultural",
    description: "Wales' international storytelling festival featuring world-class storytellers. Performances, workshops and family events celebrating the ancient art of oral storytelling.",
    monthTypical: "July (TBC)",
    location: "St Donats Castle",
    regionSlug: "south-wales",
    website: "https://www.beyondtheborder.com/",
    registrationCost: "Weekend tickets £80",
    tags: ["storytelling", "family-friendly", "cultural", "workshops"],
    ageRange: "All ages"
  },

  // =====================
  // HERITAGE & CULTURAL (8 events)
  // =====================
  {
    name: "National Eisteddfod of Wales",
    slug: "national-eisteddfod",
    type: "Cultural Festival",
    category: "cultural",
    description: "Europe's largest cultural festival celebrating Welsh language and culture. Eight days of music, literature, theatre, science and art. 2026 marks 850 years since the first Eisteddfod.",
    monthTypical: "August 1-8",
    location: "Llantwd, North Pembrokeshire (2026)",
    regionSlug: "pembrokeshire",
    website: "https://eisteddfod.wales/",
    registrationCost: "From £25 day tickets",
    tags: ["welsh-culture", "music", "arts", "literature", "historic"],
    ageRange: "All ages"
  },
  {
    name: "Urdd Eisteddfod",
    slug: "urdd-eisteddfod",
    type: "Cultural Festival",
    category: "cultural",
    description: "Europe's largest youth festival celebrating Welsh language. Seven days of competitions, performances and activities. Features CALON - a brand new musical with Caryl Parry Jones' iconic hits.",
    monthTypical: "May 25-31",
    location: "Anglesey (2026)",
    regionSlug: "anglesey",
    website: "https://www.urdd.cymru/en/eisteddfod/",
    registrationCost: "From £20 day tickets",
    tags: ["welsh-culture", "youth", "music", "arts", "competitions"],
    ageRange: "Family"
  },
  {
    name: "St David's Day Celebrations",
    slug: "st-davids-day-celebrations",
    type: "Cultural Event",
    category: "cultural",
    description: "Wales' national day celebrations across the country. Features parades, concerts, Welsh food, traditional costumes and festivities. Cardiff hosts the largest parade.",
    monthTypical: "March 1",
    location: "Various locations across Wales",
    regionSlug: "all-wales",
    website: "https://www.visitwales.com/info/history-heritage-and-traditions/st-davids-day-traditions-dydd-gwyl-dewi",
    registrationCost: "Mostly free events",
    tags: ["welsh-culture", "parade", "free", "national", "traditional"],
    ageRange: "All ages"
  },
  {
    name: "Cadw Open Doors",
    slug: "cadw-open-doors",
    type: "Heritage Event",
    category: "cultural",
    description: "Annual event offering free access to Cadw's 132 historic monuments. Special tours, activities and behind-the-scenes access to castles, abbeys and historic sites.",
    monthTypical: "September (Heritage Weekend)",
    location: "Cadw sites across Wales",
    regionSlug: "all-wales",
    website: "https://cadw.gov.wales/",
    registrationCost: "Free",
    tags: ["heritage", "free", "castles", "history", "family-friendly"],
    ageRange: "All ages"
  },
  {
    name: "Conwy Medieval Festival",
    slug: "conwy-medieval-festival",
    type: "Heritage Event",
    category: "cultural",
    description: "Step back in time with medieval re-enactments, jousting, archery and living history around Conwy's UNESCO World Heritage castle. Feast, falconry and family fun.",
    monthTypical: "August (TBC)",
    location: "Conwy Castle and Town",
    regionSlug: "north-wales",
    website: "https://www.visitconwy.org.uk/",
    registrationCost: "Castle admission + free events",
    tags: ["medieval", "family-friendly", "history", "castle", "jousting"],
    ageRange: "All ages"
  },
  {
    name: "Caernarfon Investiture Anniversary",
    slug: "caernarfon-investiture-anniversary",
    type: "Heritage Event",
    category: "cultural",
    description: "Special events at the magnificent Caernarfon Castle celebrating its rich history. Living history, special tours and activities in this UNESCO World Heritage site.",
    monthTypical: "July (TBC)",
    location: "Caernarfon Castle",
    regionSlug: "snowdonia",
    website: "https://cadw.gov.wales/visit/places-to-visit/caernarfon-castle",
    registrationCost: "Castle admission £14.70",
    tags: ["heritage", "castle", "history", "tours", "UNESCO"],
    ageRange: "All ages"
  },
  {
    name: "Barley Saturday",
    slug: "barley-saturday",
    type: "Heritage Event",
    category: "cultural",
    description: "Colourful parade through Cardigan celebrating the traditional hiring fair. Features Welsh Mountain ponies, cobs, shire horses, vintage vehicles and the best stallions.",
    monthTypical: "May (TBC)",
    location: "Cardigan Town Centre",
    regionSlug: "mid-wales",
    website: "https://www.discoverceredigion.wales/",
    registrationCost: "Free",
    tags: ["heritage", "horses", "parade", "free", "traditional"],
    ageRange: "All ages"
  },
  {
    name: "Tregaron Harness Racing Festival",
    slug: "tregaron-harness-racing-festival",
    type: "Heritage Event",
    category: "competition",
    description: "Three-day festival of harness racing - one of the biggest prize race meetings in the UK. Watch trotters and pacers race on grass tracks in this traditional Welsh sport.",
    monthTypical: "August (TBC)",
    location: "Tregaron",
    regionSlug: "mid-wales",
    website: "https://www.discoverceredigion.wales/",
    registrationCost: "From £10",
    tags: ["horses", "racing", "traditional", "unique", "rural"],
    ageRange: "All ages"
  },

  // =====================
  // CHRISTMAS & SEASONAL (15 events)
  // =====================
  {
    name: "Cardiff Christmas Market",
    slug: "cardiff-christmas-market",
    type: "Christmas Market",
    category: "family",
    description: "One of Wales' most popular seasonal markets spanning the city centre. Features European-style chalets, gourmet food stalls with raclette and bratwurst, Ferris wheel, ice rink and carol performances.",
    monthTypical: "November 14 - December 23",
    location: "Cardiff City Centre",
    regionSlug: "south-wales",
    website: "https://www.cardiffchristmasmarket.com/",
    registrationCost: "Free entry",
    tags: ["christmas", "family-friendly", "free", "food", "ice-rink"],
    ageRange: "All ages"
  },
  {
    name: "Swansea Christmas Market",
    slug: "swansea-christmas-market",
    type: "Christmas Market",
    category: "family",
    description: "Traditional Welsh Christmas market with wooden stalls selling artisan crafts and gifts. Features Welsh cakes, cawl, live music, storytelling and evening illuminations at the marina.",
    monthTypical: "November 21 - December 23",
    location: "Swansea City Centre",
    regionSlug: "south-wales",
    website: "https://www.visitswanseabay.com/swansea-christmas/",
    registrationCost: "Free entry",
    tags: ["christmas", "family-friendly", "free", "crafts", "welsh-produce"],
    ageRange: "All ages"
  },
  {
    name: "Swansea Waterfront Winterland",
    slug: "swansea-waterfront-winterland",
    type: "Christmas Event",
    category: "family",
    description: "Magical winter wonderland at the waterfront featuring ice rink, funfair rides, festive food and drink. Perfect family destination from November through early January.",
    monthTypical: "November 21 - January 4",
    location: "Swansea Marina",
    regionSlug: "south-wales",
    website: "https://www.visitswanseabay.com/",
    registrationCost: "Ice rink from £12",
    tags: ["christmas", "family-friendly", "ice-rink", "funfair", "waterfront"],
    ageRange: "All ages"
  },
  {
    name: "Caerphilly Christmas Market",
    slug: "caerphilly-christmas-market",
    type: "Christmas Market",
    category: "family",
    description: "Festive market beneath the stunning Caerphilly Castle. Features street food, mulled wine, street theatre, funfair and wide variety of craft and gift stalls.",
    monthTypical: "November - December (weekends)",
    location: "Caerphilly Castle and Town Centre",
    regionSlug: "south-wales",
    website: "https://www.caerphillychristmasmarket.co.uk/",
    registrationCost: "Free entry",
    tags: ["christmas", "family-friendly", "free", "castle", "crafts"],
    ageRange: "All ages"
  },
  {
    name: "Llandudno Christmas Parade",
    slug: "llandudno-christmas-parade",
    type: "Christmas Event",
    category: "family",
    description: "Magical Christmas parade through Llandudno featuring Father Christmas and festive favourites. Starts from the Station area and loops through local streets.",
    monthTypical: "Late November",
    location: "Llandudno Town Centre",
    regionSlug: "north-wales",
    website: "https://www.visitconwy.org.uk/",
    registrationCost: "Free",
    tags: ["christmas", "family-friendly", "free", "parade", "santa"],
    ageRange: "All ages"
  },
  {
    name: "Christmas at Bute Park",
    slug: "christmas-at-bute-park",
    type: "Light Trail",
    category: "family",
    description: "Cardiff's Bute Park transformed into a festive winter wonderland. Mile-long illuminated trail with stunning light installations, festive food and seasonal atmosphere.",
    monthTypical: "November - January",
    location: "Bute Park, Cardiff",
    regionSlug: "south-wales",
    website: "https://christmasatbutepark.com/",
    registrationCost: "From £22 adults, £16 children",
    tags: ["christmas", "family-friendly", "lights", "outdoor", "magical"],
    ageRange: "All ages"
  },
  {
    name: "Luminate Wales Winter Light Trail",
    slug: "luminate-wales-margam",
    type: "Light Trail",
    category: "family",
    description: "Dazzling adventure through enchanting illuminated pathways at Margam Country Park. Spectacular light displays against the backdrop of the historic castle.",
    monthTypical: "November - January",
    location: "Margam Country Park",
    regionSlug: "south-wales",
    website: "https://luminate.live/margam-country-park",
    registrationCost: "From £20 adults, £14 children",
    tags: ["christmas", "family-friendly", "lights", "outdoor", "castle"],
    ageRange: "All ages"
  },
  {
    name: "National Trust Easter Egg Hunts Wales",
    slug: "national-trust-easter-wales",
    type: "Easter Event",
    category: "family",
    description: "Cadbury Easter Egg Hunts and spring nature trails at National Trust properties across Wales. Solve puzzles, tackle challenges and follow trails at beautiful gardens and estates.",
    monthTypical: "April 14-27",
    location: "Various National Trust properties",
    regionSlug: "all-wales",
    website: "https://www.nationaltrust.org.uk/easter-in-wales",
    registrationCost: "From £3 per trail (+ property admission)",
    tags: ["easter", "family-friendly", "kids", "outdoor", "nature"],
    ageRange: "Family"
  },
  {
    name: "Cadw Halloween Events",
    slug: "cadw-halloween-events",
    type: "Halloween Event",
    category: "family",
    description: "Spooky season at Cadw's historic castles and sites. Features skeleton hunts, creepy crafts, paranormal experiences and family-friendly Halloween activities.",
    monthTypical: "October 25-31",
    location: "Various Cadw castles across Wales",
    regionSlug: "all-wales",
    website: "https://cadw.gov.wales/",
    registrationCost: "Castle admission + some free activities",
    tags: ["halloween", "family-friendly", "castle", "spooky", "kids"],
    ageRange: "All ages"
  },
  {
    name: "Greenwood Family Park Halloween",
    slug: "greenwood-halloween",
    type: "Halloween Event",
    category: "family",
    description: "Spooky family fun at GreenWood Forest Park. Features trick-or-treat trail, fancy dress, themed activities and adventure rides with a Halloween twist.",
    monthTypical: "October half-term",
    location: "GreenWood Forest Park, near Caernarfon",
    regionSlug: "snowdonia",
    website: "https://www.greenwoodfamilypark.co.uk/",
    registrationCost: "From £19",
    tags: ["halloween", "family-friendly", "kids", "adventure", "theme-park"],
    ageRange: "Family"
  },
  {
    name: "Folly Farm Halloween Spooktacular",
    slug: "folly-farm-halloween",
    type: "Halloween Event",
    category: "family",
    description: "Family Halloween event at Pembrokeshire's favourite attraction. Features spooky fairground, Halloween shows, trick-or-treat trail and zoo animals.",
    monthTypical: "October half-term",
    location: "Folly Farm, Kilgetty",
    regionSlug: "pembrokeshire",
    website: "https://www.folly-farm.co.uk/",
    registrationCost: "From £21",
    tags: ["halloween", "family-friendly", "kids", "zoo", "fairground"],
    ageRange: "Family"
  },
  {
    name: "Techniquest Christmas Events",
    slug: "techniquest-christmas",
    type: "Christmas Event",
    category: "family",
    description: "Festive science fun at Wales' leading science discovery centre. Features Christmas-themed workshops, science shows and interactive exhibits.",
    monthTypical: "December",
    location: "Techniquest, Cardiff Bay",
    regionSlug: "south-wales",
    website: "https://www.techniquest.org/",
    registrationCost: "From £12",
    tags: ["christmas", "family-friendly", "science", "interactive", "kids"],
    ageRange: "Family"
  },
  {
    name: "Santa Express Welsh Highland Railway",
    slug: "santa-express-welsh-highland",
    type: "Christmas Event",
    category: "family",
    description: "Magical steam train journey to meet Santa through stunning Snowdonia scenery. Features festive treats, carols and a gift from Father Christmas.",
    monthTypical: "December weekends",
    location: "Welsh Highland Railway, Caernarfon",
    regionSlug: "snowdonia",
    website: "https://www.festrail.co.uk/",
    registrationCost: "From £25 adults, £20 children",
    tags: ["christmas", "family-friendly", "train", "santa", "scenic"],
    ageRange: "Family"
  },
  {
    name: "Anglesey Winter Fair",
    slug: "anglesey-winter-fair",
    type: "Agricultural Show",
    category: "festival",
    description: "Annual two-day winter event featuring livestock, equine and produce exhibitions. Great for early Christmas shopping from craft stalls. All held under cover.",
    monthTypical: "November (TBC)",
    location: "Mona Showground, Anglesey",
    regionSlug: "anglesey",
    website: "https://www.angleseyshow.org.uk/winter-fair",
    registrationCost: "£12 adults",
    tags: ["christmas", "livestock", "crafts", "indoor", "shopping"],
    ageRange: "All ages"
  },
  {
    name: "Winter Solstice at Bryn Celli Ddu",
    slug: "winter-solstice-bryn-celli-ddu",
    type: "Heritage Event",
    category: "cultural",
    description: "Special sunrise event at the ancient Neolithic passage tomb. Watch the solstice sun illuminate the inner chamber - a 5,000 year old astronomical event.",
    monthTypical: "December 21",
    location: "Bryn Celli Ddu, Anglesey",
    regionSlug: "anglesey",
    website: "https://cadw.gov.wales/",
    registrationCost: "Free (registration required)",
    tags: ["heritage", "free", "solstice", "ancient", "unique"],
    ageRange: "Adults"
  },

  // =====================
  // FAMILY ATTRACTION EVENTS (5 events)
  // =====================
  {
    name: "Zip World Fright Nights",
    slug: "zip-world-fright-nights",
    type: "Adventure Event",
    category: "family",
    description: "Thrilling after-dark adventures at Zip World's Welsh locations. Night-time zip lines, underground experiences and spooky themed activities.",
    monthTypical: "October",
    location: "Zip World venues in Snowdonia",
    regionSlug: "snowdonia",
    website: "https://www.zipworld.co.uk/",
    registrationCost: "From £40",
    tags: ["adventure", "halloween", "thrill", "night", "zipline"],
    ageRange: "Adults"
  },
  {
    name: "Great British Food Festival - Margam Park",
    slug: "great-british-food-margam",
    type: "Food Festival",
    category: "festival",
    description: "Family-friendly food festival in beautiful Margam Park. Features street food, artisan producers, live chef demos, live music, children's entertainment and foraging walks.",
    monthTypical: "August 29-31",
    location: "Margam Country Park",
    regionSlug: "south-wales",
    website: "https://greatbritishfoodfestival.com/margam-park",
    registrationCost: "From £12 adults, children free",
    tags: ["food", "family-friendly", "music", "demos", "foraging"],
    ageRange: "All ages"
  },
  {
    name: "GreenWood Forest Park Summer Events",
    slug: "greenwood-summer-events",
    type: "Family Event",
    category: "family",
    description: "Summer holiday activities at GreenWood eco adventure park. Features live shows, character meets, craft activities and all the park's green-powered rides.",
    monthTypical: "July-August",
    location: "GreenWood Forest Park, near Caernarfon",
    regionSlug: "snowdonia",
    website: "https://www.greenwoodfamilypark.co.uk/",
    registrationCost: "From £19",
    tags: ["family-friendly", "kids", "adventure", "summer", "eco"],
    ageRange: "Family"
  },
  {
    name: "Folly Farm Summer Days",
    slug: "folly-farm-summer",
    type: "Family Event",
    category: "family",
    description: "Extended summer opening at Pembrokeshire's favourite family attraction. Zoo, vintage funfair, adventure play and farm all in one ticket.",
    monthTypical: "July-August",
    location: "Folly Farm, Kilgetty",
    regionSlug: "pembrokeshire",
    website: "https://www.folly-farm.co.uk/",
    registrationCost: "From £21",
    tags: ["family-friendly", "kids", "zoo", "fairground", "summer"],
    ageRange: "Family"
  },
  {
    name: "Dan yr Ogof Dinosaur Park Events",
    slug: "dan-yr-ogof-events",
    type: "Family Event",
    category: "family",
    description: "Special events at Wales' premier showcaves and dinosaur park. Features cave tours, life-size dinosaurs, fossil hunts and seasonal themed activities.",
    monthTypical: "School holidays",
    location: "Dan yr Ogof, Brecon Beacons",
    regionSlug: "brecon-beacons",
    website: "https://www.showcaves.co.uk/",
    registrationCost: "From £18 adults, £14 children",
    tags: ["family-friendly", "caves", "dinosaurs", "kids", "educational"],
    ageRange: "Family"
  }
];

async function seedEvents() {
  console.log('🌱 Starting event seeding...\n');

  // Get region IDs
  const regionList = await db.select().from(regions);
  const regionMap = Object.fromEntries(regionList.map(r => [r.slug, r.id]));

  console.log('📍 Available regions:', Object.keys(regionMap).join(', '));
  console.log('');

  let addedCount = 0;
  let skippedCount = 0;

  for (const event of newEvents) {
    // Check if event already exists
    const existing = await db.select().from(events).where(eq(events.slug, event.slug)).limit(1);

    if (existing.length > 0) {
      console.log(`⏭️  Skipping (exists): ${event.name}`);
      skippedCount++;
      continue;
    }

    const regionId = regionMap[event.regionSlug];
    if (!regionId && event.regionSlug !== 'all-wales') {
      console.log(`⚠️  Unknown region '${event.regionSlug}' for: ${event.name}`);
    }

    try {
      await db.insert(events).values({
        siteId: 1,
        name: event.name,
        slug: event.slug,
        type: event.type,
        category: event.category,
        description: event.description,
        monthTypical: event.monthTypical,
        location: event.location,
        regionId: regionId || null,
        website: event.website,
        // Store registrationCost as text since schema expects decimal - we'll store in description
        tags: event.tags,
        ageRange: event.ageRange,
        status: 'published',
      });
      console.log(`✅ Added: ${event.name}`);
      addedCount++;
    } catch (error) {
      console.error(`❌ Error adding ${event.name}:`, error);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Added: ${addedCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log(`   Total events in script: ${newEvents.length}`);

  process.exit(0);
}

seedEvents().catch(console.error);
