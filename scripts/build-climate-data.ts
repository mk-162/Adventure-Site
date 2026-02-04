import * as fs from "fs";
import * as path from "path";

// Met Office station data URLs
const STATIONS = {
  valley: {
    url: "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/valleydata.txt",
    name: "Valley (Anglesey)",
    lat: 53.252,
    lng: -4.535,
    regions: ["snowdonia", "anglesey", "north-wales", "north-wales-coast"],
  },
  aberporth: {
    url: "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/aberporthdata.txt",
    name: "Aberporth (West Wales)",
    lat: 52.139,
    lng: -4.570,
    regions: ["pembrokeshire", "gower", "carmarthenshire"],
  },
  cwmystwyth: {
    url: "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/cwmystwythdata.txt",
    name: "Cwmystwyth (Mid Wales)",
    lat: 52.359,
    lng: -3.802,
    regions: ["brecon-beacons", "mid-wales", "multi-region"],
  },
  cardiff: {
    url: "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/cardiffdata.txt",
    name: "Cardiff (South Wales)",
    lat: 51.482,
    lng: -3.168,
    regions: ["south-wales"],
  },
  rossonwye: {
    url: "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/rossonwyedata.txt",
    name: "Ross-on-Wye",
    lat: 51.913,
    lng: -2.583,
    regions: ["wye-valley"],
  },
};

interface MonthlyData {
  month: number;
  name: string;
  maxTemp: number;
  minTemp: number;
  rainfall: number;
  sunshine: number;
  frostDays: number;
}

interface StationData {
  name: string;
  lat: number;
  lng: number;
  regions: string[];
  months: MonthlyData[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function fetchStationData(url: string): Promise<string> {
  console.log(`Fetching ${url}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}

function parseStationFile(content: string): Map<number, number[][]> {
  const lines = content.split("\n");
  const dataByMonth = new Map<number, number[][]>();

  // Initialize map for months 1-12
  for (let i = 1; i <= 12; i++) {
    dataByMonth.set(i, []);
  }

  let inDataSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("Site") || trimmed.startsWith("Location")) {
      continue;
    }

    // Check if we're in the data section (starts with year)
    if (/^\d{4}/.test(trimmed)) {
      inDataSection = true;
    }

    if (!inDataSection) continue;

    // Parse data line: yyyy  mm  tmax  tmin  af  rain  sun
    const parts = trimmed.split(/\s+/);
    if (parts.length < 7) continue;

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const tmax = parseFloat(parts[2]);
    const tmin = parseFloat(parts[3]);
    const af = parseFloat(parts[4]); // air frost days
    const rain = parseFloat(parts[5]);
    const sun = parseFloat(parts[6]);

    // Skip invalid data (marked with --- or *)
    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(tmax) ||
      isNaN(tmin) ||
      isNaN(af) ||
      isNaN(rain) ||
      isNaN(sun)
    ) {
      continue;
    }

    // Only use complete records (no provisional data)
    if (parts.some((p) => p.includes("*") || p.includes("---"))) {
      continue;
    }

    const monthData = dataByMonth.get(month);
    if (monthData) {
      monthData.push([year, tmax, tmin, af, rain, sun]);
    }
  }

  return dataByMonth;
}

function calculate30YearAverages(dataByMonth: Map<number, number[][]>): MonthlyData[] {
  const results: MonthlyData[] = [];

  for (let month = 1; month <= 12; month++) {
    const monthData = dataByMonth.get(month) || [];

    // Sort by year descending and take most recent 30 years
    monthData.sort((a, b) => b[0] - a[0]);
    const recent30 = monthData.slice(0, 30);

    if (recent30.length === 0) {
      console.warn(`No data for month ${month}`);
      results.push({
        month,
        name: MONTH_NAMES[month - 1],
        maxTemp: 0,
        minTemp: 0,
        rainfall: 0,
        sunshine: 0,
        frostDays: 0,
      });
      continue;
    }

    // Calculate averages
    const avgMaxTemp =
      recent30.reduce((sum, d) => sum + d[1], 0) / recent30.length;
    const avgMinTemp =
      recent30.reduce((sum, d) => sum + d[2], 0) / recent30.length;
    const avgFrostDays =
      recent30.reduce((sum, d) => sum + d[3], 0) / recent30.length;
    const avgRainfall =
      recent30.reduce((sum, d) => sum + d[4], 0) / recent30.length;
    const avgSunshine =
      recent30.reduce((sum, d) => sum + d[5], 0) / recent30.length;

    results.push({
      month,
      name: MONTH_NAMES[month - 1],
      maxTemp: Math.round(avgMaxTemp * 10) / 10,
      minTemp: Math.round(avgMinTemp * 10) / 10,
      rainfall: Math.round(avgRainfall * 10) / 10,
      sunshine: Math.round(avgSunshine * 10) / 10,
      frostDays: Math.round(avgFrostDays * 10) / 10,
    });
  }

  return results;
}

async function buildClimateData() {
  console.log("Building climate data from Met Office sources...\n");

  const stations: Record<string, StationData> = {};

  for (const [key, config] of Object.entries(STATIONS)) {
    try {
      const content = await fetchStationData(config.url);
      const dataByMonth = parseStationFile(content);
      const averages = calculate30YearAverages(dataByMonth);

      stations[key] = {
        name: config.name,
        lat: config.lat,
        lng: config.lng,
        regions: config.regions,
        months: averages,
      };

      console.log(`✓ Processed ${config.name}`);
    } catch (error) {
      console.error(`✗ Failed to process ${config.name}:`, error);
    }
  }

  // Build region mapping
  const regionMapping: Record<string, string> = {};
  for (const [stationKey, station] of Object.entries(stations)) {
    for (const region of station.regions) {
      regionMapping[region] = stationKey;
    }
  }

  const output = {
    stations,
    regionMapping,
    metadata: {
      source: "Met Office Historic Station Data",
      generatedAt: new Date().toISOString(),
      note: "30-year averages calculated from most recent complete data",
    },
  };

  // Ensure data/climate directory exists
  const outputDir = path.join(process.cwd(), "data", "climate");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "averages.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✓ Climate data written to ${outputPath}`);
  console.log(`\nStations processed: ${Object.keys(stations).length}`);
  console.log(`Regions mapped: ${Object.keys(regionMapping).length}`);
}

buildClimateData().catch(console.error);
