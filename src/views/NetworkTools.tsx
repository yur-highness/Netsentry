import React, { useState, useEffect, useRef } from 'react';
import { getGeoData, resolveDNS, measureHttpLatency, generateMockHops } from '../services/networkService';
import { analyzeNetworkData, generateTraceAnalysis, sendChatToAI } from '../services/geminiService';
import { WorldMap } from '../components/WorldMap';
import type{ GeoData, DNSRecord, AnalysisResult, TraceHop, ChatMessage } from '../types';

interface NetworkToolsProps {
  initialTab?: 'scanner' | 'dns' | 'traceroute' | 'ai' | 'map';
}

export const NetworkTools: React.FC<NetworkToolsProps> = ({ initialTab = 'scanner' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [latency, setLatency] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [traceAnalysis, setTraceAnalysis] = useState<string>('');
  
  // Trace Simulation State
  const [traceHops, setTraceHops] = useState<TraceHop[]>([]);
  const [isTracing, setIsTracing] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { id: 'init', role: 'model', text: 'NetSentry AI Online. Ready for network analysis.', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTab) {
        setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
      if (activeTab === 'ai' && chatBottomRef.current) {
          chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [chatMessages, activeTab]);

  const handleScan = async () => {
    if (!target) return;
    setLoading(true);
    
    // Reset scanner specific states
    setGeoData(null);
    setDnsRecords([]);
    setLatency(null);
    setAiAnalysis(null);

    try {
      const [geo, dns, lat] = await Promise.all([
        getGeoData(target.match(/^\d+\.\d+\.\d+\.\d+$/) ? target : ''),
        resolveDNS(target),
        measureHttpLatency(target.startsWith('http') ? target : `http://${target}`)
      ]);

      setGeoData(geo);
      setDnsRecords(dns);
      setLatency(lat);

      const analysis = await analyzeNetworkData(target, geo, dns, `Latency: ${lat}ms`);
      setAiAnalysis(analysis);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTraceroute = async () => {
      if (!target) return;
      setIsTracing(true);
      setTraceHops([]);
      setTraceAnalysis('');
      setGeoData(null); 

      try {
          const geo = await getGeoData(target.match(/^\d+\.\d+\.\d+\.\d+$/) ? target : '');
          if (!geo.success && !geo.ip) {
              setTraceAnalysis("Could not resolve target location.");
              setIsTracing(false);
              return;
          }
          setGeoData(geo);

          const plannedHops = generateMockHops(geo);

          let discovered: TraceHop[] = [];
          for (const hop of plannedHops) {
              await new Promise(r => setTimeout(r, 600)); 
              discovered = [...discovered, hop];
              setTraceHops(discovered);
          }

          const analysis = await generateTraceAnalysis(discovered);
          setTraceAnalysis(analysis);

      } catch (e) {
          console.error("Traceroute failed", e);
      } finally {
          setIsTracing(false);
      }
  };

  const handleSendMessage = async () => {
      if (!chatInput.trim()) return;
      
      const newUserMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          text: chatInput,
          timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, newUserMsg]);
      setChatInput('');
      setIsChatting(true);

      // Gather context from other tabs
      const context = `
        Target: ${target}
        Geo: ${JSON.stringify(geoData)}
        Trace: ${JSON.stringify(traceHops)}
      `;

      try {
          const responseText = await sendChatToAI(newUserMsg.text, context);
          const newAiMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: responseText,
              timestamp: new Date()
          };
          setChatMessages(prev => [...prev, newAiMsg]);
      } catch (e) {
          // Error handled in service
          console.error("AI chat failed", e);
      } finally {
          setIsChatting(false);
      }
  };

  const executeAction = () => {
      if (activeTab === 'traceroute') {
          handleTraceroute();
      } else {
          handleScan();
      }
  };

  const renderTabs = () => (
      <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800 mb-6 w-fit">
          <button 
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'scanner' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <i className="fas fa-search mr-2"></i>Overview
          </button>
          <button 
            onClick={() => setActiveTab('traceroute')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'traceroute' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <i className="fas fa-route mr-2"></i>Traceroute MTR
          </button>
          <button 
            onClick={() => setActiveTab('dns')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dns' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <i className="fas fa-network-wired mr-2"></i>DNS Info
          </button>
           <button 
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'map' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <i className="fas fa-globe mr-2"></i>Map Intel
          </button>
           <button 
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <i className="fas fa-robot mr-2"></i>AI Analyst
          </button>
      </div>
  );

  return (
    <div className="flex flex-col h-full">
      
      {/* Input Section - Hide for Map and AI full views */}
      {activeTab !== 'map' && activeTab !== 'ai' && (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Target IP / Domain</label>
            <div className="flex space-x-4">
            <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g., google.com or 8.8.8.8"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                onKeyDown={(e) => e.key === 'Enter' && executeAction()}
            />
            <button
                onClick={executeAction}
                disabled={loading || isTracing}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
            >
                {loading || isTracing ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : <i className="fas fa-play mr-2"></i>}
                {activeTab === 'traceroute' ? 'Trace Route' : 'Scan Target'}
            </button>
            </div>
        </div>
      )}

      {renderTabs()}

      <div className="flex-1 min-h-0 overflow-hidden">
        
        {/* VIEW: SCANNER / OVERVIEW */}
        {activeTab === 'scanner' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-4">
                <div className="lg:col-span-2 space-y-6">
                     {/* Geo Intelligence */}
                    {geoData ? (
                        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                        <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-slate-200"><i className="fas fa-map-marker-alt text-red-500 mr-2"></i>Geo Intelligence</h3>
                          {geoData.flag && (
   <span className="text-xl">{geoData.flag.img}</span>
)}


                        </div>
                        <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-slate-500 block">IP Address</span><span className="text-slate-200 font-mono">{geoData.ip}</span></div>
                            <div><span className="text-slate-500 block">Location</span><span className="text-slate-200">{geoData.city}, {geoData.country}</span></div>
                            <div><span className="text-slate-500 block">ISP / Org</span><span className="text-slate-200">{geoData.isp} ({geoData.org})</span></div>
                            <div><span className="text-slate-500 block">Coordinates</span><span className="text-slate-200 font-mono">{geoData.latitude}, {geoData.longitude}</span></div>
                            {latency !== null && (
                                <div className="col-span-2 mt-2 pt-2 border-t border-slate-800">
                                    <span className="text-slate-500 block">HTTP Latency</span>
                                    <div className="flex items-center">
                                    <div className={`h-2 w-2 rounded-full mr-2 ${latency < 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                    <span className="text-slate-200 font-mono font-bold text-lg">{latency}ms</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="h-64 border-t border-slate-800 relative">
                           <WorldMap markers={geoData.latitude ? [geoData] : []} height={256} />
                        </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-8 flex flex-col items-center justify-center text-slate-500 h-64 border-dashed">
                             <i className="fas fa-globe text-4xl mb-4 opacity-50"></i>
                             <p>Enter a target to retrieve intelligence</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* AI Analysis Card */}
                    {aiAnalysis ? (
                        <div className="bg-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <i className="fas fa-brain text-purple-400 mr-3"></i>AI Threat Assessment
                                </h3>
                                <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                                    aiAnalysis.threatLevel === 'Critical' ? 'bg-red-900 text-red-200 border border-red-700' :
                                    aiAnalysis.threatLevel === 'High' ? 'bg-orange-900 text-orange-200 border border-orange-700' :
                                    'bg-emerald-900 text-emerald-200 border border-emerald-700'
                                }`}>
                                    {aiAnalysis.threatLevel}
                                </div>
                                </div>

                                <div className="flex justify-center mb-6">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    {/* Added viewBox to fix broken SVG scaling */}
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                                        <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                                        <circle 
                                            cx="64" 
                                            cy="64" 
                                            r="56" 
                                            stroke={aiAnalysis.riskScore > 75 ? '#ef4444' : aiAnalysis.riskScore > 50 ? '#f59e0b' : '#10b981'} 
                                            strokeWidth="12" 
                                            fill="transparent" 
                                            strokeDasharray={351} // 2 * pi * 56
                                            strokeDashoffset={351 - (351 * aiAnalysis.riskScore) / 100} 
                                            className="transition-all duration-1000" 
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute text-center">
                                        <span className="text-3xl font-bold text-white">{aiAnalysis.riskScore}</span>
                                        <span className="block text-xs text-slate-500 uppercase font-semibold mt-1">Risk Score</span>
                                    </div>
                                </div>
                                </div>

                                <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Analysis Summary</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                                    {aiAnalysis.summary}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommendations</h4>
                                    <ul className="space-y-2">
                                    {aiAnalysis.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start text-sm text-slate-300">
                                        <i className="fas fa-check-circle text-cyan-500 mt-1 mr-2"></i>
                                        <span>{rec}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-8 text-center h-full flex flex-col items-center justify-center opacity-50">
                        <i className="fas fa-microchip text-6xl text-slate-700 mb-4"></i>
                        <p className="text-slate-400">Run a scan to generate AI insights</p>
                        </div>
                    )}
                </div>
             </div>
        )}

        {/* VIEW: TRACEROUTE */}
        {activeTab === 'traceroute' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pb-4">
                <div className="flex flex-col space-y-6">
                    {/* Visual Traceroute Map */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex-1 min-h-[400px] flex flex-col relative">
                         <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center z-10 relative">
                            <h3 className="font-bold text-slate-200"><i className="fas fa-globe-americas text-cyan-400 mr-2"></i>Live Path Visualization</h3>
                            {isTracing && <span className="text-xs text-cyan-400 animate-pulse"><i className="fas fa-satellite-dish mr-1"></i> Tracing...</span>}
                        </div>
                        <div className="flex-1 relative">
                             {traceHops.length > 0 ? (
                                 <WorldMap 
                                    markers={traceHops.filter(h => h.location?.latitude && h.location?.latitude !== 0).map(h => h.location!)} 
                                    height={400} 
                                 />
                             ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    <p>Enter target and click "Trace Route" to visualize path</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-6">
                    {/* Hop Table */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                        <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800">
                            <h3 className="font-bold text-slate-200"><i className="fas fa-list-ol text-purple-400 mr-2"></i>Hop Analysis (MTR)</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-950/30">
                                    <tr>
                                        <th className="px-4 py-2">#</th>
                                        <th className="px-4 py-2">IP Address</th>
                                        <th className="px-4 py-2">Location</th>
                                        <th className="px-4 py-2 text-right">Ping</th>
                                        <th className="px-4 py-2 text-right">Latency</th>
                                        <th className="px-4 py-2 text-right">Jitter</th>
                                        <th className="px-4 py-2 text-right">Loss</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {traceHops.map((hop, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-2 font-mono text-slate-400">{hop.hop}</td>
                                            <td className="px-4 py-2 font-mono text-cyan-400">{hop.ip}</td>
                                            <td className="px-4 py-2 text-slate-300">
                                                {hop.location?.city !== 'Unknown' ? hop.location?.city : ''} 
                                                {hop.location?.country !== 'Unknown' && hop.location?.country ? `, ${hop.location.country}` : ''}
                                                {(!hop.location?.city && !hop.location?.country) && <span className="text-slate-600 italic">Unknown</span>}
                                            </td>
                                            <td className="px-4 py-2 text-right font-mono text-blue-400">{hop.ping.toFixed(1)}ms</td>
                                            <td className="px-4 py-2 text-right font-mono text-emerald-400">{hop.latency}ms</td>
                                            <td className="px-4 py-2 text-right font-mono text-purple-400">{hop.jitter.toFixed(1)}ms</td>
                                            <td className="px-4 py-2 text-right font-mono">
                                                <span className={`${hop.loss > 0 ? 'text-red-500' : 'text-slate-400'}`}>{hop.loss}%</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {traceHops.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-slate-600 italic">
                                                No hops recorded. Start a trace.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Trace Analysis */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 flex-1">
                        <h3 className="font-bold text-slate-200 mb-4 flex items-center">
                            <i className="fas fa-robot text-pink-400 mr-2"></i>Path Analysis
                        </h3>
                        <div className="bg-slate-950 p-4 rounded border border-slate-800 min-h-[100px] text-sm text-slate-300 leading-relaxed">
                            {traceAnalysis ? traceAnalysis : (
                                <span className="text-slate-600 italic">
                                    {isTracing ? "Analyzing network path anomalies..." : "AI analysis will appear here after trace completion."}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW: DNS */}
        {activeTab === 'dns' && (
            <div className="h-full overflow-y-auto">
                 <div className="bg-slate-900 rounded-lg border border-slate-800">
                    <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex justify-between">
                        <h3 className="font-bold text-slate-200"><i className="fas fa-network-wired text-blue-500 mr-2"></i>DNS Records</h3>
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">Resolver: 8.8.8.8</span>
                    </div>
                    {dnsRecords.length > 0 ? (
                        <div className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-950/30">
                            <tr>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">TTL</th>
                                <th className="px-4 py-2">Data</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                            {dnsRecords.map((rec, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30">
                                <td className="px-4 py-2 font-mono text-cyan-400">{rec.type === 1 ? 'A' : rec.type === 28 ? 'AAAA' : rec.type}</td>
                                <td className="px-4 py-2 font-mono text-slate-300">{rec.name}</td>
                                <td className="px-4 py-2 text-slate-500">{rec.TTL}</td>
                                <td className="px-4 py-2 font-mono text-emerald-400 max-w-lg break-all">{rec.data}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500">
                            <i className="fas fa-server text-4xl mb-4 opacity-30"></i>
                            <p>No DNS records found or scan not initiated.</p>
                        </div>
                    )}
                 </div>
            </div>
        )}

        {/* VIEW: MAP INTELLIGENCE */}
        {activeTab === 'map' && (
             <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800 relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex space-x-2 pointer-events-none">
                    <div className="bg-slate-950/80 backdrop-blur border border-slate-700 p-3 rounded shadow-lg text-slate-300 text-sm pointer-events-auto">
                        <div className="font-bold text-cyan-400 mb-1">Global Threat Intelligence</div>
                        <div className="flex items-center space-x-2 text-xs">
                             <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span>Live Attack Feed</span>
                        </div>
                    </div>
                </div>
                <WorldMap 
                    markers={[
                        ...(geoData ? [geoData] : []), 
                        ...(traceHops.map(h => h.location).filter(Boolean) as GeoData[])
                    ]}
                    hideOverlay={true}
                />
            </div>
        )}

        {/* VIEW: AI ANALYST */}
        {activeTab === 'ai' && (
             <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                     <div>
                        <h3 className="font-bold text-slate-200 text-lg">NetSentry AI Analyst</h3>
                        <p className="text-xs text-slate-500">Powered by Gemini 2.5 • Context-Aware Network Diagnostics</p>
                     </div>
                     <i className="fas fa-robot text-2xl text-purple-500"></i>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/30">
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-4 shadow-md ${
                                msg.role === 'user' 
                                ? 'bg-cyan-900/30 border border-cyan-800/50 text-slate-200' 
                                : 'bg-slate-800 border border-slate-700 text-slate-300'
                            }`}>
                                <div className="flex items-center mb-2 space-x-2">
                                     <i className={`fas ${msg.role === 'user' ? 'fa-user text-cyan-400' : 'fa-brain text-purple-400'} text-xs`}></i>
                                     <span className="text-[10px] uppercase font-bold text-slate-500">{msg.role === 'user' ? 'Operator' : 'AI System'}</span>
                                     <span className="text-[10px] text-slate-600">{msg.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatBottomRef}></div>
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <div className="flex space-x-3">
                        <input 
                            type="text" 
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
                            placeholder="Ask about network anomalies, firewall rules, or analyze logs..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isChatting && handleSendMessage()}
                            disabled={isChatting}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={isChatting || !chatInput.trim()}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-md font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isChatting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};