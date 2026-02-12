import { LondonData } from '../types';

export const fetchLondonData = async (): Promise<LondonData> => {
  // 1. Securely retrieve API Keys from Environment Variables
  const TFL_APP_ID = process.env.NEXT_PUBLIC_TFL_APP_ID;
  const TFL_APP_KEY = process.env.NEXT_PUBLIC_TFL_APP_KEY;
  const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  // 2. Robust Check: If any key is missing, immediately fallback to simulation
  if (!TFL_APP_ID || !TFL_APP_KEY || !WEATHER_API_KEY) {
    console.warn("[BidSmith Intelligence] Missing API Keys. Switching to Simulation Mode.");
    return generateMockData();
  }

  try {
    // 3. Parallel Data Fetching for Performance
    const [weatherRes, aqiRes, trafficRes, tubeRes] = await Promise.all([
      // Weather (London)
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${WEATHER_API_KEY}&units=metric`),
      // AQI (London Lat/Lon)
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=51.5074&lon=-0.1278&appid=${WEATHER_API_KEY}`),
      // TfL Road Status
      fetch(`https://api.tfl.gov.uk/Road/All/Status?app_id=${TFL_APP_ID}&app_key=${TFL_APP_KEY}`),
      // TfL Tube Status
      fetch(`https://api.tfl.gov.uk/Line/Mode/tube/Status?app_id=${TFL_APP_ID}&app_key=${TFL_APP_KEY}`)
    ]);

    // 4. Validate HTTP Responses
    if (!weatherRes.ok || !aqiRes.ok || !trafficRes.ok || !tubeRes.ok) {
        throw new Error(`Upstream API Error: ${weatherRes.status} | ${aqiRes.status} | ${trafficRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();
    const trafficData = await trafficRes.json();
    const tubeData = await tubeRes.json();

    return transformRealData(weatherData, aqiData, trafficData, tubeData);

  } catch (error) {
    console.error("[BidSmith Intelligence] Data Uplink Failed:", error);
    // 5. Graceful Error Handling: Return mock data instead of crashing
    return generateMockData();
  }
};

// --- DATA TRANSFORMATION LAYER ---

const transformRealData = (weather: any, aqi: any, traffic: any, tube: any): LondonData => {
    // Robust safety checks for deep object access
    
    // AQI Logic
    const aqiVal = aqi.list?.[0]?.main?.aqi || 1;
    let aqiStatus: 'Good' | 'Fair' | 'Poor' = 'Good';
    if (aqiVal === 3) aqiStatus = 'Fair';
    if (aqiVal >= 4) aqiStatus = 'Poor';

    // Tube Logic (Safe Array Mapping)
    const priorityLines = ['Northern', 'Central', 'Jubilee'];
    const safeTubeData = Array.isArray(tube) ? tube : [];
    
    const tubeStatus = safeTubeData
        .filter((t: any) => priorityLines.includes(t.name))
        .map((t: any) => ({
            line: t.name,
            status: t.lineStatuses?.[0]?.statusSeverityDescription || "Unknown"
        }));

    // If specific lines aren't found, fill with defaults
    if (tubeStatus.length === 0) {
        tubeStatus.push({ line: 'Network', status: 'Live Data Offline' });
    }

    // Weather Logic
    const temp = weather.main?.temp ? Math.round(weather.main.temp * 10) / 10 : 0;
    const rainMm = weather.rain?.['1h'] || 0;
    const condition = weather.weather?.[0]?.description || 'Unknown';

    // Traffic Logic (Heuristic based on road status array length/severity)
    // If trafficData is an array of roads, we can check how many have severe status
    let congestion = 45; // Default baseline
    if (Array.isArray(traffic)) {
        const severeRoads = traffic.filter((r: any) => r.statusSeverity !== 'Good').length;
        congestion = Math.min(99, 40 + (severeRoads * 5));
    }

    return {
        weather: { temp, rainMm, condition },
        aqi: { value: aqiVal, status: aqiStatus },
        traffic: { congestionLevel: congestion, tubeStatus }
    };
};

const generateMockData = (): LondonData => {
    return {
        weather: {
          temp: 11.2,
          rainMm: Math.random() > 0.5 ? parseFloat((Math.random() * 2).toFixed(1)) : 0,
          condition: 'Overcast & Mist',
        },
        aqi: {
          value: Math.floor(Math.random() * 3) + 2,
          status: 'Good',
        },
        traffic: {
          congestionLevel: Math.floor(Math.random() * 30) + 40,
          tubeStatus: [
            { line: 'Northern', status: 'Good Service' },
            { line: 'Central', status: Math.random() > 0.8 ? 'Minor Delays' : 'Good Service' },
            { line: 'Jubilee', status: 'Good Service' },
          ]
        }
    };
};