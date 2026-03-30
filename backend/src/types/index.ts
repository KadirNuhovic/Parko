// Traffic congestion levels
export type TrafficLevel = 'low' | 'medium' | 'high';

// Traffic data structure
export interface TrafficData {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  level: TrafficLevel;
  description: string;
  timestamp: Date;
}

// Parking spot status
export interface ParkingSpot {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  spotNumber: string;
  pricePerHour?: number;
  lastUpdated: Date;
}

// Public transport vehicle
export interface PublicTransportVehicle {
  id: string;
  type: 'bus' | 'tram';
  line: string;
  location: {
    lat: number;
    lng: number;
  };
  direction: string;
  nextStop: string;
  arrivalTime: Date;
  capacity: {
    current: number;
    max: number;
  };
}

// Weather information
export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy';
  humidity: number;
  windSpeed: number;
  pressure?: number;
  timestamp: Date;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: Date;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

// User problem report
export interface ProblemReport {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  type: 'pothole' | 'street_light' | 'traffic_sign' | 'garbage' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'reported' | 'in_progress' | 'resolved';
  reportedBy: string;
  reportedAt: Date;
  images?: string[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
