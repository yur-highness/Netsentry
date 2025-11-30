import React, { useState, useEffect } from 'react';
import type{ ScanJob, ScanHistory } from '../types';

export const BotAutomation: React.FC = () => {
  // State for Jobs
  const [jobs, setJobs] = useState<ScanJob[]>([
      { 
          id: '1', 
          name: 'Gateway Monitor', 
          target: '192.168.1.1', 
          type: 'PING', 
          interval: 10000, 
          status: 'ACTIVE', 
          lastRun: Date.now(), 
          nextRun: Date.now() + 10000,
          createdAt: Date.now() 
      }
  ]);
  
  // State for History
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [selectedReport, setSelectedReport] = useState<ScanHistory | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newType, setNewType] = useState<'PING' | 'HTTP_STATUS' | 'PORT_QUICK'>('PING');
  const [newInterval, setNewInterval] = useState(30); // Seconds

  // Cron Logic Simulation
  useEffect(() => {
    const intervalId = setInterval(() => {
        const now = Date.now();
        
        setJobs(currentJobs => {
            return currentJobs.map(job => {
                if (job.status === 'ACTIVE' && now >= job.nextRun) {
                    // Trigger Job Run
                    runJob(job);
                    
                    // Update Job Timings
                    return {
                        ...job,
                        lastRun: now,
                        nextRun: now + job.interval
                    };
                }
                return job;
            });
        });
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, []); // Run on mount

  const runJob = (job: ScanJob) => {
      // Simulate Network Operation Result
      const isSuccess = Math.random() > 0.1; // 90% success rate
      const latency = Math.floor(Math.random() * 100) + 5;
      
      let summary = '';
      let details: any = {};

      if (job.type === 'PING') {
          summary = isSuccess ? `Reply bytes=32 time=${latency}ms TTL=54` : 'Request timed out.';
          details = { packetsSent: 4, packetsReceived: isSuccess ? 4 : 0, loss: isSuccess ? 0 : 100 };
      } else if (job.type === 'HTTP_STATUS') {
          const statusCodes = [200, 200, 200, 201, 301, 404, 500];
          const code = isSuccess ? statusCodes[Math.floor(Math.random() * 5)] : 0;
          summary = code > 0 ? `HTTP ${code} OK` : 'Connection Refused';
          details = { statusCode: code, headers: { 'content-type': 'text/html', 'server': 'nginx' } };
      } else {
          summary = 'Open ports: 80, 443';
          details = { openPorts: [80, 443], closedPorts: 98 };
      }

      const newLog: ScanHistory = {
          id: Date.now().toString() + Math.random().toString(),
          jobId: job.id,
          jobName: job.name,
          target: job.target,
          type: job.type,
          timestamp: Date.now(),
          status: !isSuccess ? 'FAILURE' : (job.type === 'HTTP_STATUS' && details.statusCode >= 400) ? 'WARNING' : 'SUCCESS',
          latency: latency,
          resultSummary: summary,
          details: details
      };

      setHistory(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const handleAddJob = () => {
      if (!newName || !newTarget) return;
      
      const newJob: ScanJob = {
          id: Date.now().toString(),
          name: newName,
          target: newTarget,
          type: newType,
          interval: newInterval * 1000,
          status: 'ACTIVE',
          lastRun: 0,
          nextRun: Date.now() + (newInterval * 1000),
          createdAt: Date.now()
      };

      setJobs(prev => [...prev, newJob]);
      setNewName('');
      setNewTarget('');
  };

  const toggleJobStatus = (id: string) => {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: j.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : j));
  };

  const deleteJob = (id: string) => {
      setJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Panel: Bot Configuration */}
        <div className="lg:col-span-4 flex flex-col space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Create Bot Card */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-xl">
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-600 p-2 rounded-lg">
                        <i className="fas fa-robot text-white text-xl"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">Create Scanner Bot</h2>
                        <p className="text-slate-500 text-xs">Automate recurring network tasks.</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bot Name</label>
                         <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Web Server Health" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-emerald-500 outline-none text-sm"/>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target IP / URL</label>
                         <input type="text" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="192.168.1.50" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-emerald-500 outline-none font-mono text-sm"/>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scan Type</label>
                            <select value={newType} onChange={e => setNewType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-emerald-500 outline-none text-sm">
                                <option value="PING">ICMP Ping</option>
                                <option value="HTTP_STATUS">HTTP Status</option>
                                <option value="PORT_QUICK">Quick Port Scan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Interval (sec)</label>
                            <input type="number" min="5" value={newInterval} onChange={e => setNewInterval(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-emerald-500 outline-none text-sm"/>
                        </div>
                     </div>
                     <button onClick={handleAddJob} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded font-bold shadow-lg shadow-emerald-500/20 text-sm transition-colors">
                         <i className="fas fa-plus-circle mr-2"></i> Deploy Bot
                     </button>
                 </div>
            </div>

            {/* Active Bots List */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Active Fleet ({jobs.length})</h3>
                {jobs.map(job => (
                    <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors relative overflow-hidden group">
                        {job.status === 'ACTIVE' && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -mr-8 -mt-8 animate-pulse"></div>}
                        
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div>
                                <h4 className="font-bold text-slate-200">{job.name}</h4>
                                <div className="flex items-center space-x-2 text-xs mt-1">
                                    <span className="font-mono text-cyan-400">{job.target}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-400">{job.type}</span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => toggleJobStatus(job.id)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${job.status === 'ACTIVE' ? 'bg-amber-900/30 text-amber-500 hover:bg-amber-900/50' : 'bg-emerald-900/30 text-emerald-500 hover:bg-emerald-900/50'}`}>
                                    <i className={`fas ${job.status === 'ACTIVE' ? 'fa-pause' : 'fa-play'}`}></i>
                                </button>
                                <button onClick={() => deleteJob(job.id)} className="w-8 h-8 rounded bg-red-900/20 text-red-500 hover:bg-red-900/40 flex items-center justify-center transition-colors">
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-1">
                                <span>Next Run</span>
                                <span>Interval: {job.interval / 1000}s</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                {job.status === 'ACTIVE' ? (
                                     <div 
                                        className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                                        style={{ width: `${Math.max(0, 100 - ((job.nextRun - Date.now()) / job.interval * 100))}%` }}
                                     ></div>
                                ) : (
                                    <div className="h-full bg-amber-500/50 w-full striped-bar"></div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Panel: Live Feed & Reports */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-900 rounded-lg border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <h3 className="font-bold text-slate-200">Live Operation Logs</h3>
                 </div>
                 <span className="text-xs text-slate-500 font-mono">buffer_size: {history.length}/50</span>
            </div>

            <div className="flex-1 overflow-y-auto p-0 relative">
                 <table className="w-full text-left border-collapse">
                     <thead className="bg-slate-950 text-xs font-bold text-slate-500 uppercase sticky top-0 z-10">
                         <tr>
                             <th className="px-6 py-3 border-b border-slate-800">Time</th>
                             <th className="px-6 py-3 border-b border-slate-800">Bot Name</th>
                             <th className="px-6 py-3 border-b border-slate-800">Status</th>
                             <th className="px-6 py-3 border-b border-slate-800">Result</th>
                             <th className="px-6 py-3 border-b border-slate-800 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50">
                         {history.map(log => (
                             <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                                 <td className="px-6 py-3 text-sm font-mono text-slate-400">
                                     {new Date(log.timestamp).toLocaleTimeString()}
                                 </td>
                                 <td className="px-6 py-3">
                                     <div className="font-bold text-slate-300 text-sm">{log.jobName}</div>
                                     <div className="text-[10px] text-slate-500">{log.target}</div>
                                 </td>
                                 <td className="px-6 py-3">
                                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                         log.status === 'SUCCESS' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' :
                                         log.status === 'WARNING' ? 'bg-amber-900/30 text-amber-400 border-amber-800' :
                                         'bg-red-900/30 text-red-400 border-red-800'
                                     }`}>
                                         {log.status}
                                     </span>
                                 </td>
                                 <td className="px-6 py-3 text-sm text-slate-300">
                                     {log.resultSummary}
                                     {log.latency && <span className="ml-2 text-xs text-slate-500 font-mono">({log.latency}ms)</span>}
                                 </td>
                                 <td className="px-6 py-3 text-right">
                                     <button 
                                        onClick={() => setSelectedReport(log)}
                                        className="text-xs bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 px-3 py-1 rounded border border-slate-700 transition-colors"
                                     >
                                         <i className="fas fa-file-alt mr-1"></i> Report
                                     </button>
                                 </td>
                             </tr>
                         ))}
                         {history.length === 0 && (
                             <tr>
                                 <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                     Waiting for bot execution cycles...
                                 </td>
                             </tr>
                         )}
                     </tbody>
                 </table>
            </div>
            
            {/* Report Modal Overlay */}
            {selectedReport && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-full">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                             <div className="flex items-center space-x-3">
                                 <div className="bg-cyan-600 p-2 rounded">
                                     <i className="fas fa-file-invoice text-white"></i>
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-xl text-slate-100">Execution Report</h3>
                                     <p className="text-xs text-slate-400 font-mono">ID: {selectedReport.id}</p>
                                 </div>
                             </div>
                             <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">
                                 <i className="fas fa-times text-xl"></i>
                             </button>
                        </div>
                        
                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target</label>
                                    <div className="text-lg font-mono text-cyan-400">{selectedReport.target}</div>
                                </div>
                                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timestamp</label>
                                    <div className="text-lg text-slate-200">{new Date(selectedReport.timestamp).toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-950 rounded border border-slate-800">
                                <h4 className="font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">Technical Details</h4>
                                <pre className="font-mono text-xs text-emerald-400 overflow-x-auto">
                                    {JSON.stringify(selectedReport.details, null, 2)}
                                </pre>
                            </div>

                            <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded border border-slate-700">
                                <i className="fas fa-info-circle text-cyan-400 mt-1"></i>
                                <div>
                                    <h5 className="font-bold text-sm text-slate-200">Analysis</h5>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Automated scan completed with status <strong>{selectedReport.status}</strong>. 
                                        {selectedReport.latency ? ` Latency was measured at ${selectedReport.latency}ms.` : ''} 
                                        {selectedReport.status === 'FAILURE' ? ' Immediate investigation recommended.' : ' Routine operation successful.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-end space-x-3">
                             <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm font-bold">
                                 <i className="fas fa-print mr-2"></i> Print
                             </button>
                             <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white text-sm font-bold shadow-lg shadow-cyan-500/20">
                                 <i className="fas fa-download mr-2"></i> Export JSON
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};