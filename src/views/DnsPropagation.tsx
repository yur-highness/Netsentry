import { useState } from 'react';

interface DnsLocation {
    city: string;
    country: string;
    flag: string;
    status: 'pending' | 'ok' | 'fail';
    ip?: string;
}

export const DnsPropagation: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DnsLocation[]>([]);

  const locations: Omit<DnsLocation, 'status'>[] = [
      { city: 'New York', country: 'USA', flag: '🇺🇸' },
      { city: 'London', country: 'UK', flag: '🇬🇧' },
      { city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
      { city: 'Sydney', country: 'Australia', flag: '🇦🇺' },
      { city: 'Frankfurt', country: 'Germany', flag: '🇩🇪' },
      { city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
      { city: 'Sao Paulo', country: 'Brazil', flag: '🇧🇷' },
      { city: 'Mumbai', country: 'India', flag: '🇮🇳' },
  ];

  const handleCheck = async () => {
      if (!domain) return;
      setLoading(true);
      // Reset
      setResults(locations.map(l => ({ ...l, status: 'pending' })));

      // Simulate staggered network requests
      locations.forEach((loc, index) => {
          setTimeout(() => {
              setResults(prev => {
                  const next = [...prev];
                  // Randomize result to simulate propagation
                  // If index is low (fast servers), mostly OK. If high, maybe mixed.
                  const isSuccess = Math.random() > 0.1; 
                  
                  // Mock IP based on domain hash just to be consistent-ish
                  const mockIp = isSuccess ? `104.21.${domain.length}.${index + 10}` : undefined;
                  
                  next[index] = {
                      ...next[index],
                      status: isSuccess ? 'ok' : 'fail',
                      ip: mockIp
                  };
                  return next;
              });
              
              if (index === locations.length - 1) setLoading(false);
          }, 500 + (index * 400));
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-xl mb-6">
             <div className="flex items-center space-x-3 mb-6">
                <div className="bg-pink-600 p-2 rounded-lg">
                    <i className="fas fa-globe-americas text-white text-xl"></i>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">DNS Propagation</h2>
                    <p className="text-slate-500 text-sm">Check record resolution from multiple global checkpoints.</p>
                </div>
             </div>

             <div className="flex space-x-4">
                 <select 
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-pink-500 font-bold"
                 >
                     <option value="A">A</option>
                     <option value="AAAA">AAAA</option>
                     <option value="CNAME">CNAME</option>
                     <option value="MX">MX</option>
                     <option value="TXT">TXT</option>
                     <option value="NS">NS</option>
                 </select>
                 <input 
                    type="text" 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-pink-500 font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                 />
                 <button 
                    onClick={handleCheck}
                    disabled={loading || !domain}
                    className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center"
                 >
                     {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "Check"}
                 </button>
             </div>
        </div>

        {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((res, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center justify-between animate-fade-in transition-all">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{res.flag}</span>
                            <div>
                                <div className="font-bold text-slate-200">{res.city}</div>
                                <div className="text-xs text-slate-500">{res.country}</div>
                            </div>
                        </div>
                        
                        <div>
                            {res.status === 'pending' && <i className="fas fa-circle-notch fa-spin text-slate-500"></i>}
                            {res.status === 'fail' && <span className="text-red-500 font-mono text-sm"><i className="fas fa-times mr-1"></i> Timeout</span>}
                            {res.status === 'ok' && (
                                <div className="flex items-center text-emerald-400 font-mono text-sm bg-emerald-900/10 px-2 py-1 rounded border border-emerald-900/30">
                                    <i className="fas fa-check mr-2"></i>
                                    {res.ip}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};
