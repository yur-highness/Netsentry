
import  { useState, useEffect } from 'react';

export const ProfileSettings: React.FC = () => {
  const [dns, setDns] = useState('8.8.8.8');
  const [scannerTimeout, setScannerTimeout] = useState(5000);
  const [apiKey, setApiKey] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('netsentry_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (config.dns) setDns(config.dns);
      if (config.timeout) setScannerTimeout(config.timeout);
      if (config.apiKey) setApiKey(config.apiKey);
    }
  }, []);

  const handleSave = () => {
    const config = { dns, timeout: scannerTimeout, apiKey };
    localStorage.setItem('netsentry_config', JSON.stringify(config));
    
    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
     <div className="max-w-4xl mx-auto space-y-6 relative">
        {/* Toast Notification */}
        {showToast && (
            <div className="fixed top-24 right-8 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center animate-fade-in-down z-50">
                <i className="fas fa-check-circle mr-3"></i>
                <div>
                    <h4 className="font-bold text-sm">Success</h4>
                    <p className="text-xs opacity-90">Settings saved successfully.</p>
                </div>
            </div>
        )}

        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
            <i className="fas fa-cog text-slate-400 mr-3"></i> System Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Profile */}
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg">
                <h3 className="text-lg font-bold text-cyan-400 mb-6 flex items-center">
                    <i className="fas fa-user-circle mr-2"></i> Operator Profile
                </h3>
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl border-2 border-cyan-500 shadow-lg shadow-cyan-500/20 relative">
                        <i className="fas fa-user-astronaut text-slate-200"></i>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg">Admin Operator</h4>
                        <p className="text-sm text-slate-500">SecOps Level 3 • <span className="text-emerald-500">Online</span></p>
                    </div>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Name</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-300 focus:border-cyan-500 outline-none transition-colors" defaultValue="Admin Operator" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-500 focus:border-cyan-500 outline-none cursor-not-allowed" defaultValue="admin@netsentry.ai" disabled />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded bg-purple-900/30 text-purple-400 border border-purple-800 text-xs font-bold">Administrator</span>
                            <span className="px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-800 text-xs font-bold">Network Engineer</span>
                        </div>
                     </div>
                </div>
            </div>

            {/* Network Settings */}
             <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg flex flex-col">
                <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center">
                    <i className="fas fa-network-wired mr-2"></i> Network Settings
                </h3>
                <div className="space-y-5 flex-1">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Default DNS Resolver</label>
                        <div className="flex space-x-2">
                             <input 
                                type="text" 
                                value={dns}
                                onChange={(e) => setDns(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-300 focus:border-emerald-500 outline-none font-mono" 
                            />
                            <button 
                                onClick={() => setDns('8.8.8.8')}
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-300 transition-colors" 
                                title="Reset to Default"
                            >
                                <i className="fas fa-undo"></i>
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1">Used for internal DNS resolution checks.</p>
                     </div>
                     
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scanner Timeout (ms)</label>
                        <input 
                            type="number" 
                            value={scannerTimeout}
                            onChange={(e) => setScannerTimeout(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-300 focus:border-emerald-500 outline-none font-mono" 
                        />
                     </div>

                     <div className="pt-4 border-t border-slate-800">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                            <span>Gemini API Key</span>
                            <span className="text-[10px] text-amber-500"><i className="fas fa-lock mr-1"></i>Secure Storage</span>
                        </label>
                        <input 
                            type="password" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-300 focus:border-emerald-500 outline-none font-mono tracking-widest" 
                        />
                     </div>
                     
                     <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-slate-400">Auto-Trace Anomalies</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-emerald-500 right-0"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-emerald-500 cursor-pointer"></label>
                        </div>
                     </div>
                </div>
            </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-slate-800/50">
            <button 
                onClick={handleSave}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center active:scale-95 transform"
            >
                <i className="fas fa-save mr-2"></i> Save Changes
            </button>
        </div>
     </div>
  );
};