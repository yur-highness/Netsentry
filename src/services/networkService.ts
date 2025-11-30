
import type{ GeoData, DNSRecord, TraceHop, PortScanResult } from '../types';

// Using ipwho.is as it provides free JSON GeoIP with CORS support
const GEO_API_URL = 'https://ipwho.is/';
const GOOGLE_DNS_API = 'https://dns.google/resolve';

// Helper to get settings
const getSettings = () => {
    try {
        const stored = localStorage.getItem('netsentry_config');
        return stored ? JSON.parse(stored) : { timeout: 5000 };
    } catch {
        return { timeout: 5000 };
    }
};

export const getGeoData = async (ip: string = ''): Promise<GeoData> => {
  try {
    const url = ip ? `${GEO_API_URL}${ip}` : GEO_API_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // ipwho.is returns 200 OK even on error, but with success: false
    if (data.success === false) {
        console.warn(`GeoIP API Warning: ${data.message}`);
        throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("GeoIP Fetch Error:", error);
    // Fallback/Mock data if API fails or rate limits
    return {
      ip: ip || '127.0.0.1',
      success: false,
      type: 'Private',
      continent: 'North America',
      continent_code: 'NA',
      country: 'United States',
      country_code: 'US',
      region: 'California',
      city: 'Mountain View',
      latitude: 37.4223,
      longitude: -122.0848,
      isp: 'Restricted / Offline',
      org: 'Fallback Network',
      asn: 'AS0000',
    };
  }
};

export const resolveDNS = async (domain: string, type: string = 'A'): Promise<DNSRecord[]> => {
  try {
    const response = await fetch(`${GOOGLE_DNS_API}?name=${domain}&type=${type}`);
    if (!response.ok) throw new Error('DNS query failed');
    const data = await response.json();
    return data.Answer || [];
  } catch (error) {
    console.error("DNS Fetch Error:", error);
    return [];
  }
};

export const measureHttpLatency = async (url: string): Promise<number> => {
  const { timeout } = getSettings();
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout || 5000);

  const start = performance.now();
  try {
    // Note: This relies on the target allowing CORS for HEAD requests or standard GET
    // If blocked, we catch the error but can still measure time to failure as a rough "reachability" metric
    // for some cases, or valid time for allowed hosts.
    await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal }); 
    clearTimeout(id);
    const end = performance.now();
    return Math.round(end - start);
  } catch (e) {
    clearTimeout(id);
    const end = performance.now();
    return Math.round(end - start); // Even if it fails, we measured network round trip attempt
  }
};

// Mock locations for traceroute simulation
const BACKBONE_HUBS = [
  { city: "New York", country: "USA", latitude: 40.7128, longitude: -74.0060, ip: "104.20.10.1" },
  { city: "London", country: "UK", latitude: 51.5074, longitude: -0.1278, ip: "185.25.10.55" },
  { city: "Frankfurt", country: "Germany", latitude: 50.1109, longitude: 8.6821, ip: "172.67.19.11" },
  { city: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198, ip: "203.0.113.5" },
  { city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, ip: "202.214.1.1" },
  { city: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093, ip: "1.1.1.1" },
  { city: "Amsterdam", country: "Netherlands", latitude: 52.3676, longitude: 4.9041, ip: "188.166.0.1" }
];

export const generateMockHops = (targetGeo: GeoData): TraceHop[] => {
    const hops: TraceHop[] = [];
    
    // Helper to generate jitter and loss
    const getJitter = () => Math.floor(Math.random() * 5) + 0.5;
    const getLoss = (isBad: boolean) => isBad ? Math.floor(Math.random() * 20) + 1 : 0;

    // Hop 1: Local Gateway
    const jitter1 = 0.2;
    hops.push({
        hop: 1,
        ip: "192.168.1.1",
        latency: 1,
        ping: 1.1,
        jitter: jitter1,
        loss: 0,
        location: { ...targetGeo, ip: "192.168.1.1", city: "Local Gateway", country: "LAN", latitude: 0, longitude: 0, isp: "Internal", org: "Local Network" }
    });

    // Hop 2: ISP Edge
    // Pick a random starting hub that isn't the target
    const startHub = BACKBONE_HUBS[Math.floor(Math.random() * BACKBONE_HUBS.length)];
    const lat2 = 4;
    const jitter2 = 1.5;
    hops.push({
        hop: 2,
        ip: "10.100.24.1",
        latency: lat2,
        ping: lat2 + (Math.random() * jitter2),
        jitter: jitter2,
        loss: 0,
        location: { ...targetGeo, ip: "10.100.24.1", city: "ISP Edge", country: startHub.country, latitude: startHub.latitude, longitude: startHub.longitude, isp: "ISP Backbone", org: "Service Provider" }
    });

    // Generate 2-3 intermediate hops
    const numHops = 3;
    let currentLatency = 12;

    for (let i = 0; i < numHops; i++) {
        const hub = BACKBONE_HUBS[Math.floor(Math.random() * BACKBONE_HUBS.length)];
        currentLatency += Math.floor(Math.random() * 20) + 5;
        const isCongested = Math.random() > 0.8;
        const hopJitter = getJitter() + (isCongested ? 15 : 0);
        
        // Simulating that 'ping' is the current sample, which might deviate from avg 'latency' by the jitter amount
        const currentPing = currentLatency + (Math.random() > 0.5 ? hopJitter : -hopJitter);

        hops.push({
            hop: i + 3,
            ip: hub.ip,
            latency: currentLatency,
            ping: Math.max(1, Math.round(currentPing * 10) / 10), // Ensure non-negative, 1 decimal
            jitter: hopJitter,
            loss: getLoss(isCongested),
            location: {
                ...targetGeo,
                ip: hub.ip,
                city: hub.city,
                country: hub.country,
                latitude: hub.latitude,
                longitude: hub.longitude,
                isp: "Tier 1 Transit",
                org: "Global Backbone"
            }
        });
    }

    // Final Hop: Target
    const finalJitter = getJitter();
    const finalLatency = currentLatency + 15;
    const finalPing = finalLatency + (Math.random() > 0.5 ? finalJitter : -finalJitter);

    hops.push({
        hop: hops.length + 1,
        ip: targetGeo.ip,
        latency: finalLatency,
        ping: Math.max(1, Math.round(finalPing * 10) / 10),
        jitter: finalJitter,
        loss: 0,
        location: targetGeo
    });

    return hops;
};

export const scanPorts = async (target: string, startPort: number, endPort: number): Promise<PortScanResult[]> => {
    const results: PortScanResult[] = [];

    console.log(`Starting port scan on ${target} from port ${startPort} to ${endPort}`);
    
    // Dictionary of common services
    const commonServices: Record<number, { service: string, desc: string, risk: 'Low' | 'Medium' | 'High' | 'Critical' }> = {
        21: { service: 'FTP', desc: 'File Transfer Protocol', risk: 'High' },
        22: { service: 'SSH', desc: 'Secure Shell', risk: 'Medium' },
        23: { service: 'Telnet', desc: 'Unencrypted Text Communications', risk: 'Critical' },
        25: { service: 'SMTP', desc: 'Simple Mail Transfer Protocol', risk: 'Medium' },
        53: { service: 'DNS', desc: 'Domain Name System', risk: 'Low' },
        80: { service: 'HTTP', desc: 'World Wide Web HTTP', risk: 'Low' },
        110: { service: 'POP3', desc: 'Post Office Protocol', risk: 'Medium' },
        135: { service: 'RPC', desc: 'Microsoft RPC', risk: 'High' },
        139: { service: 'NetBIOS', desc: 'NetBIOS Session Service', risk: 'High' },
        143: { service: 'IMAP', desc: 'Internet Message Access Protocol', risk: 'Medium' },
        443: { service: 'HTTPS', desc: 'Secure HTTP', risk: 'Low' },
        445: { service: 'SMB', desc: 'Microsoft-DS', risk: 'Critical' },
        3306: { service: 'MySQL', desc: 'MySQL Database', risk: 'Medium' },
        3389: { service: 'RDP', desc: 'Remote Desktop Protocol', risk: 'High' },
        5432: { service: 'PostgreSQL', desc: 'PostgreSQL Database', risk: 'Medium' },
        8080: { service: 'HTTP-Proxy', desc: 'HTTP Alternate', risk: 'Medium' },
    };

    // Limit scan to 50 ports max for simulation responsiveness
    const relevantCommonPorts = Object.keys(commonServices)
        .map(Number)
        .filter(p => p >= startPort && p <= endPort);
        
    const scanCount = Math.min(endPort - startPort + 1, 50); 
    
    for (let i = 0; i < scanCount; i++) {
        let p: number;
        if (i < relevantCommonPorts.length) {
            p = relevantCommonPorts[i];
        } else {
            p = Math.floor(Math.random() * (endPort - startPort + 1)) + startPort;
        }

        let state: 'Open' | 'Closed' | 'Filtered' = 'Closed';
        let serviceInfo = commonServices[p];
        let serviceName = serviceInfo?.service || 'Unknown';
        let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
        let description = serviceInfo?.desc || '';

        if (serviceInfo) {
            const roll = Math.random();
            if (roll > 0.4) state = 'Open'; 
            else if (roll > 0.2) state = 'Filtered';
            riskLevel = serviceInfo.risk;
        } else {
            if (Math.random() > 0.95) state = 'Filtered';
            else if (Math.random() > 0.98) state = 'Open';
        }

        if (state !== 'Closed' || serviceInfo) {
            if (!results.find(r => r.port === p)) {
                 results.push({
                    port: p,
                    state,
                    service: serviceName,
                    risk: state === 'Open' ? riskLevel : 'Low',
                    description
                });
            }
        }
    }
    
    return results.sort((a, b) => a.port - b.port);
};
