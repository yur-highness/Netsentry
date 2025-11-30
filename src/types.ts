
export interface GeoData {
  ip: string;
  success: boolean;
  type: string;
  continent: string;
  continent_code: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
  org: string;
  asn: string;
  flag?: {
  img: string;
  emoji: string;
  emoji_unicode: string;
};

}

export interface DNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface TraceHop {
  hop: number;
  ip: string;
  ping: number; // Last measured RTT
  latency: number; // Average RTT
  jitter: number;
  loss: number;
  location?: GeoData;
}

export interface PortScanResult {
  port: number;
  state: 'Open' | 'Closed' | 'Filtered';
  service: string;
  risk: string;
  description: string;
}

export interface AnalysisResult {
  riskScore: number;
  summary: string;
  recommendations: string[];
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ScanJob {
    id: string;
    name: string;
    target: string;
    type: 'PING' | 'HTTP_STATUS' | 'PORT_QUICK';
    interval: number; // milliseconds
    status: 'ACTIVE' | 'PAUSED';
    lastRun: number; // timestamp
    nextRun: number; // timestamp
    createdAt: number;
}

export interface ScanHistory {
    id: string;
    jobId: string;
    jobName: string;
    target: string;
    type: string;
    timestamp: number;
    status: 'SUCCESS' | 'FAILURE' | 'WARNING';
    latency?: number;
    resultSummary: string;
    details: any; // Flexible payload for specific results
}

export const ToolType = {
  LANDING: 'LANDING',
  DASHBOARD: 'DASHBOARD',
  MAP: 'MAP',
  SCANNER: 'SCANNER',
  DNS: 'DNS',
  AI_ANALYST: 'AI_ANALYST',
  PROFILE: 'PROFILE',
  SUBNET_CALC: 'SUBNET_CALC',
  SSL_INSPECTOR: 'SSL_INSPECTOR',
  CONFIG_GEN: 'CONFIG_GEN',
  MAC_LOOKUP: 'MAC_LOOKUP',
  DNS_PROPAGATION: 'DNS_PROPAGATION',
  BOT_AUTOMATION: 'BOT_AUTOMATION'
} as const;

export type ToolType = typeof ToolType[keyof typeof ToolType];