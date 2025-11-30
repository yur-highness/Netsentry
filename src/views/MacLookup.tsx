import { useState } from 'react';

export const MacLookup: React.FC = () => {
  const [mac, setMac] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock Database of OUIs
  const mockOuiDb: Record<string, string> = {
    '00:0C:29': 'VMware, Inc.',
    '00:50:56': 'VMware, Inc.',
    '00:1A:11': 'Google, Inc.',
    '3C:5A:B4': 'Google, Inc.',
    'F0:9E:63': 'Apple, Inc.',
    'BC:D1:D3': 'Apple, Inc.',
    '00:15:5D': 'Microsoft Corporation',
    'B8:27:EB': 'Raspberry Pi Foundation',
    'DC:A6:32': 'Raspberry Pi Trading Ltd',
    '18:66:DA': 'Cisco Systems, Inc.',
    '00:40:96': 'Cisco Systems, Inc.'
  };

  const handleLookup = () => {
      if (!mac) return;
      setLoading(true);
      setResult(null);

      // Normalize input
      const cleanMac = mac.toUpperCase().replace(/[^0-9A-F]/g, '');
      const formatted = cleanMac.match(/.{1,2}/g)?.join(':') || mac;
      const prefix = formatted.substring(0, 8); // First 3 bytes

      setTimeout(() => {
          const vendor = mockOuiDb[prefix] || 'Unknown / Not in DB';
          setResult({
              mac: formatted,
              prefix: prefix,
              vendor: vendor,
              type: vendor.includes('VMware') ? 'Virtual' : 'Physical',
              isRandomized: (parseInt(cleanMac[1], 16) & 2) === 2 // Check locally administered bit
          });
          setLoading(false);
      }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-xl mb-6">
             <div className="flex items-center space-x-3 mb-6">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <i className="fas fa-fingerprint text-white text-xl"></i>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">MAC Address Lookup</h2>
                    <p className="text-slate-500 text-sm">Identify device manufacturer and OUI details.</p>
                </div>
             </div>

             <div className="flex space-x-4">
                 <input 
                    type="text" 
                    value={mac}
                    onChange={(e) => setMac(e.target.value)}
                    placeholder="e.g. 00:0C:29:1A:2B:3C"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                 />
                 <button 
                    onClick={handleLookup}
                    disabled={loading || !mac}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center"
                 >
                     {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "Identify"}
                 </button>
             </div>
        </div>

        {result && (
            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden animate-fade-in">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800">
                    <h3 className="font-bold text-slate-200">Lookup Results</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vendor / Manufacturer</label>
                        <div className="text-xl font-bold text-white flex items-center">
                            {result.vendor !== 'Unknown / Not in DB' && <i className="fas fa-industry text-indigo-400 mr-2"></i>}
                            {result.vendor}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">MAC Prefix (OUI)</label>
                        <div className="text-xl font-mono text-cyan-400">{result.prefix}</div>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address Type</label>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${result.isRandomized ? 'bg-amber-900/30 text-amber-400 border border-amber-800' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'}`}>
                            {result.isRandomized ? 'Locally Administered (Randomized)' : 'Universally Administered (Burned-in)'}
                        </span>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Likely Device Type</label>
                         <div className="text-slate-300">{result.type}</div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
