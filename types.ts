export interface SystemNode {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'offline';
  latency: number;
  load: number;
}

export interface MarketMetric {
  ticker: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'flat';
}

export enum AppState {
  LANDING = 'LANDING',
  TRANSITION = 'TRANSITION',
  MISSION_CONTROL = 'MISSION_CONTROL'
}

export interface LondonData {
  weather: {
    temp: number;
    rainMm: number;
    condition: string;
  };
  aqi: {
    value: number;
    status: 'Good' | 'Fair' | 'Poor';
  };
  traffic: {
    congestionLevel: number; // 0-100
    tubeStatus: {
      line: string;
      status: string;
    }[];
  };
}