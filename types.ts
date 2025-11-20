export interface DailyFlightStat {
  date: string;
  totalFlights: number;
  delayed: number;
  cancelled: number;
  weatherCondition: string;
}

export interface AirlineShare {
  name: string;
  flights: number;
  color: string;
}

export interface DashboardSummary {
  totalFlightsLast30Days: number;
  avgOnTimePerformance: number;
  totalCancellations: number;
  busiestDay: string;
}

export interface DashboardData {
  dailyStats: DailyFlightStat[];
  airlineShares: AirlineShare[];
  summary: DashboardSummary;
  insights: string[];
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}