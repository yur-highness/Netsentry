import  { useState } from 'react';

export const SSLInspector: React.FC = () => {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
      if(!target) return;
      setLoading(true);
      setResult(null);

      // Simulate network request delay
      setTimeout(() => {
          // Mock Data for demonstration
          setResult({
              commonName: target,
              issuer: "R3, Let's Encrypt",
              validFrom: "2023-10-15 12:00:00 UTC",
              validTo: "2024-01-15 12:00:00 UTC",
              daysRemaining: 45,
              grade: "A+",
              protocol: "TLS 1.3",
              cipher: "TLS_AES_256_GCM_SHA384",
              san: [`www.${target}`, target],
              serial: "03:9A:F1:...",
              vulnerabilities: []
          });
          setLoading(false);
      }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
         <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-xl mb-6">
             <div className="flex items-center space-x-3 mb-6">
                <div className="bg-emerald-600 p-2 rounded-lg">
                    <i className="fas fa-lock text-white text-xl"></i>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">SSL / TLS Inspector</h2>
                    <p className="text-slate-500 text-sm">Analyze certificate chain, expiry, and security configuration.</p>
                </div>
             </div>

             <div className="flex space-x-4">
                 <input 
                    type="text" 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. google.com"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                 />
                 <button 
                    onClick={handleScan}
                    disabled={loading || !target}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center"
                 >
                     {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "Analyze"}
                 </button>
             </div>
         </div>

         {result && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                 {/* Main Grade Card */}
                 <div className="md:col-span-1 bg-slate-900 rounded-lg border border-slate-800 p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-32 h-32 rounded-full border-4 border-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                          <span className="text-5xl font-bold text-emerald-400">{result.grade}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-200 mb-1">Excellent</h3>
                      <p className="text-sm text-slate-500">Certificate is valid and secure.</p>
                 </div>

                 {/* Details */}
                 <div className="md:col-span-2 bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Common Name</label>
                            <span className="font-mono text-white block">{result.commonName}</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issuer</label>
                            <span className="text-white block">{result.issuer}</span>
                        </div>
                     </div>
                     
                     <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valid From</label>
                            <span className="text-slate-300 block text-sm">{result.validFrom}</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valid To</label>
                            <span className="text-slate-300 block text-sm">{result.validTo}</span>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-slate-800">
                         <div className="flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800">
                             <div className="flex items-center space-x-2">
                                 <i className="fas fa-hourglass-half text-amber-500"></i>
                                 <span className="text-slate-400 text-sm font-bold">Days Remaining</span>
                             </div>
                             <span className="text-xl font-bold text-amber-400">{result.daysRemaining} days</span>
                         </div>
                     </div>

                     <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-sm">
                         <div>
                            <span className="text-slate-500 mr-2">Protocol:</span>
                            <span className="text-cyan-400 font-mono">{result.protocol}</span>
                         </div>
                         <div>
                            <span className="text-slate-500 mr-2">Cipher:</span>
                            <span className="text-purple-400 font-mono text-xs">{result.cipher}</span>
                         </div>
                     </div>
                 </div>
             </div>
         )}
    </div>
  );
};
