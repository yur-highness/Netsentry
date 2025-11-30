import{ useState } from 'react';
import { generateNetworkConfig } from '../services/geminiService';

export const ConfigGenerator: React.FC = () => {
  const [vendor, setVendor] = useState('Cisco IOS');
  const [requirements, setRequirements] = useState('');
  const [generatedConfig, setGeneratedConfig] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
      if (!requirements) return;
      setLoading(true);
      const config = await generateNetworkConfig(vendor, requirements);
      setGeneratedConfig(config);
      setLoading(false);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedConfig);
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-600 p-2 rounded-lg">
                    <i className="fas fa-code text-white text-xl"></i>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Config Generator</h2>
                    <p className="text-slate-500 text-sm">AI-powered configuration snippets for network devices.</p>
                </div>
            </div>

            <div className="space-y-6 flex-1">
                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Target Vendor / OS</label>
                    <select 
                        value={vendor} 
                        onChange={(e) => setVendor(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                        <option>Cisco IOS</option>
                        <option>Cisco NX-OS</option>
                        <option>Juniper Junos</option>
                        <option>Arista EOS</option>
                        <option>MikroTik RouterOS</option>
                        <option>Linux (iptables/iproute2)</option>
                        <option>Palo Alto PAN-OS</option>
                    </select>
                </div>

                <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-bold text-slate-400 mb-2">Requirements</label>
                    <textarea 
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="e.g. Configure VLAN 10 for Sales with IP 192.168.10.1/24, enable OSPF on interface Gi0/1 area 0, and set up an ACL to block port 23."
                        className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 font-mono resize-none"
                    />
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading || !requirements}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white px-6 py-4 rounded-lg font-bold transition-colors disabled:opacity-50 flex justify-center items-center shadow-lg shadow-purple-500/20"
                >
                    {loading ? (
                        <><i className="fas fa-microchip fa-spin mr-2"></i> Generating...</>
                    ) : (
                        <><i className="fas fa-magic mr-2"></i> Generate Configuration</>
                    )}
                </button>
            </div>
        </div>

        {/* Output Panel */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-300">Generated Output</h3>
                {generatedConfig && (
                    <button 
                        onClick={copyToClipboard}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded border border-slate-700 transition-colors"
                    >
                        <i className="fas fa-copy mr-1"></i> Copy
                    </button>
                )}
            </div>
            
            <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-sm overflow-auto text-emerald-400 relative custom-scrollbar">
                {generatedConfig ? (
                    <pre className="whitespace-pre-wrap">{generatedConfig}</pre>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                        <i className="fas fa-terminal text-4xl mb-4 opacity-30"></i>
                        <p>Waiting for input...</p>
                    </div>
                )}
            </div>
            
            <div className="mt-4 p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg flex items-start">
                <i className="fas fa-exclamation-triangle text-amber-500 mt-1 mr-3"></i>
                <p className="text-xs text-amber-200/80">
                    AI-generated configurations should be verified in a lab environment before deployment to production.
                </p>
            </div>
        </div>
    </div>
  );
};
