import { useState, useEffect } from 'react';

// Utility functions for IP math
const ipToLong = (ip: string) => {
    const parts = ip.split('.');
    if (parts.length !== 4) return 0;
    return (parseInt(parts[0]) << 24) | (parseInt(parts[1]) << 16) | (parseInt(parts[2]) << 8) | parseInt(parts[3]);
};

const longToIp = (long: number) => {
    return ((long >>> 24) + '.' + (long >> 16 & 255) + '.' + (long >> 8 & 255) + '.' + (long & 255));
};

export const SubnetCalculator: React.FC = () => {
  const [inputIp, setInputIp] = useState('192.168.1.0');
  const [maskBits, setMaskBits] = useState(24);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateSubnet();
  }, [inputIp, maskBits]);

  const calculateSubnet = () => {
      // Basic validation
      if (!inputIp.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          return;
      }

      const ipLong = ipToLong(inputIp);
      const maskLong = -1 << (32 - maskBits);
      
      const networkLong = ipLong & maskLong;
      const broadcastLong = networkLong | (~maskLong);
      
      const usableStart = networkLong + 1;
      const usableEnd = broadcastLong - 1;
      
      const totalHosts = Math.pow(2, 32 - maskBits);
      const usableHosts = totalHosts - 2;

      setResult({
          network: longToIp(networkLong),
          broadcast: longToIp(broadcastLong),
          firstHost: longToIp(usableStart),
          lastHost: longToIp(usableEnd),
          totalHosts: totalHosts,
          usableHosts: usableHosts > 0 ? usableHosts : 0,
          mask: longToIp(maskLong),
          class: getIpClass(parseInt(inputIp.split('.')[0]))
      });
  };

  const getIpClass = (firstOctet: number) => {
      if (firstOctet >= 1 && firstOctet <= 126) return 'A';
      if (firstOctet >= 128 && firstOctet <= 191) return 'B';
      if (firstOctet >= 192 && firstOctet <= 223) return 'C';
      if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
      if (firstOctet >= 240 && firstOctet <= 254) return 'E (Experimental)';
      return 'Unknown';
  };

  return (
    <div className="max-w-5xl mx-auto">
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-xl">
             <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <i className="fas fa-calculator text-white text-xl"></i>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">IPv4 Subnet Calculator</h2>
                    <p className="text-slate-500 text-sm">Calculate network ranges, broadcast addresses, and host capacity.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Input Section */}
                 <div className="space-y-6">
                     <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                        <label className="block text-sm font-bold text-slate-400 mb-2">IP Address</label>
                        <input 
                            type="text" 
                            value={inputIp}
                            onChange={(e) => setInputIp(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-lg font-mono text-cyan-400 focus:outline-none focus:border-cyan-500 mb-4"
                            placeholder="e.g. 192.168.1.1"
                        />
                        
                        <label className="block text-sm font-bold text-slate-400 mb-2">Subnet Mask (CIDR: /{maskBits})</label>
                        <input 
                            type="range" 
                            min="1" 
                            max="32" 
                            value={maskBits}
                            onChange={(e) => setMaskBits(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mb-2"
                        />
                        <div className="flex justify-between text-xs text-slate-500 font-mono">
                            <span>/1</span>
                            <span>/8</span>
                            <span>/16</span>
                            <span>/24</span>
                            <span>/32</span>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-4 gap-2">
                             {[8, 16, 24, 28, 29, 30].map(bit => (
                                 <button 
                                    key={bit}
                                    onClick={() => setMaskBits(bit)}
                                    className={`py-1 px-2 rounded border text-xs font-mono transition-colors ${maskBits === bit ? 'bg-cyan-900 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                 >
                                     /{bit}
                                 </button>
                             ))}
                        </div>
                     </div>

                     {/* Binary Viz */}
                     {result && (
                         <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto">
                             <div className="mb-2">
                                 <span className="text-slate-500 block">IP Binary</span>
                                 <span className="text-emerald-500">
                                     {ipToLong(inputIp).toString(2).padStart(32, '0').match(/.{1,8}/g)?.join('.')}
                                 </span>
                             </div>
                             <div>
                                 <span className="text-slate-500 block">Mask Binary</span>
                                 <span className="text-orange-500">
                                     {result.mask && ipToLong(result.mask).toString(2).padStart(32, '0').match(/.{1,8}/g)?.join('.')}
                                 </span>
                             </div>
                         </div>
                     )}
                 </div>

                 {/* Results Section */}
                 <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 h-full">
                     {result ? (
                         <div className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <ResultItem label="Network Address" value={`${result.network}/${maskBits}`} color="text-cyan-400" />
                                <ResultItem label="Subnet Mask" value={result.mask} color="text-slate-300" />
                                <ResultItem label="Broadcast Address" value={result.broadcast} color="text-purple-400" />
                                <ResultItem label="IP Class" value={result.class} color="text-slate-300" />
                                <ResultItem label="Usable Hosts" value={result.usableHosts.toLocaleString()} color="text-emerald-400" />
                                <ResultItem label="Total IPs" value={result.totalHosts.toLocaleString()} color="text-slate-400" />
                             </div>
                             
                             <div className="pt-4 border-t border-slate-800">
                                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Usable Host Range</h4>
                                 <div className="flex items-center space-x-2 font-mono text-lg bg-slate-900 p-3 rounded border border-slate-800">
                                     <span className="text-emerald-400">{result.firstHost}</span>
                                     <i className="fas fa-arrow-right text-slate-600 text-xs"></i>
                                     <span className="text-emerald-400">{result.lastHost}</span>
                                 </div>
                             </div>
                         </div>
                     ) : (
                         <div className="flex items-center justify-center h-full text-slate-500">
                             <p>Invalid IP Address</p>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    </div>
  );
};

const ResultItem: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div>
        <span className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</span>
        <span className={`block font-mono text-lg ${color}`}>{value}</span>
    </div>
);
