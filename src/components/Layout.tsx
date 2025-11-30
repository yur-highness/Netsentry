import React, { useState } from 'react';
import { ToolType } from '../types';

interface LayoutProps {
  currentTool: ToolType;
  setTool: (t: ToolType) => void;
  children: React.ReactNode;
}

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void; collapsed: boolean }> = ({ icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : ''}
    className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 border-l-4 overflow-hidden group ${
      active
        ? 'bg-slate-800 border-cyan-400 text-cyan-400'
        : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    }`}
  >
    <div className="w-5 flex justify-center flex-shrink-0">
        <i className={`fas ${icon} text-center`}></i>
    </div>
    <span className={`font-medium tracking-wide text-sm whitespace-nowrap transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
        {label}
    </span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentTool, setTool, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 cyber-grid font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 bg-slate-900 z-10 h-20">
           <div className={`flex items-center space-x-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
               <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
                 <i className="fas fa-shield-alt text-white text-sm"></i>
               </div>
               <div className="whitespace-nowrap">
                 <h1 className="font-bold text-lg tracking-wider text-slate-100">NET<span className="text-cyan-400">SENTRY</span></h1>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Console v2.5</p>
               </div>
           </div>
           
           {/* Collapsed Logo */}
           <div className={`absolute left-4 top-6 transition-all duration-300 ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <i className="fas fa-shield-alt text-white text-sm"></i>
                </div>
           </div>

           <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800 ${isCollapsed ? 'mx-auto mt-12' : ''}`}
           >
               <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
           </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <NavItem 
            icon="fa-chart-line" 
            label="Dashboard" 
            active={currentTool === ToolType.DASHBOARD} 
            onClick={() => setTool(ToolType.DASHBOARD)}
            collapsed={isCollapsed}
          />
          <NavItem 
            icon="fa-globe" 
            label="Map Intelligence" 
            active={currentTool === ToolType.MAP} 
            onClick={() => setTool(ToolType.MAP)}
            collapsed={isCollapsed}
          />
          <NavItem 
            icon="fa-radar" 
            label="Net Scanner" 
            active={currentTool === ToolType.SCANNER} 
            onClick={() => setTool(ToolType.SCANNER)}
            collapsed={isCollapsed}
          />
           <NavItem 
            icon="fa-network-wired" 
            label="DNS & Whois" 
            active={currentTool === ToolType.DNS} 
            onClick={() => setTool(ToolType.DNS)}
            collapsed={isCollapsed}
          />
          <NavItem 
            icon="fa-brain" 
            label="AI Analyst" 
            active={currentTool === ToolType.AI_ANALYST} 
            onClick={() => setTool(ToolType.AI_ANALYST)}
            collapsed={isCollapsed}
          />
          
          <div className={`px-4 py-2 mt-4 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden py-0 mt-0' : 'opacity-100'}`}>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Operations</span>
          </div>
          {isCollapsed && <div className="h-4 border-t border-slate-800 mx-2 my-2"></div>}

          <NavItem 
            icon="fa-calculator" 
            label="Subnet Calc" 
            active={currentTool === ToolType.SUBNET_CALC} 
            onClick={() => setTool(ToolType.SUBNET_CALC)}
            collapsed={isCollapsed}
          />
          <NavItem 
            icon="fa-lock" 
            label="SSL Inspector" 
            active={currentTool === ToolType.SSL_INSPECTOR} 
            onClick={() => setTool(ToolType.SSL_INSPECTOR)}
            collapsed={isCollapsed}
          />
           <NavItem 
            icon="fa-fingerprint" 
            label="MAC Lookup" 
            active={currentTool === ToolType.MAC_LOOKUP} 
            onClick={() => setTool(ToolType.MAC_LOOKUP)}
            collapsed={isCollapsed}
          />
           <NavItem 
            icon="fa-globe-americas" 
            label="DNS Propagation" 
            active={currentTool === ToolType.DNS_PROPAGATION} 
            onClick={() => setTool(ToolType.DNS_PROPAGATION)}
            collapsed={isCollapsed}
          />
          <NavItem 
            icon="fa-code" 
            label="Config Gen" 
            active={currentTool === ToolType.CONFIG_GEN} 
            onClick={() => setTool(ToolType.CONFIG_GEN)}
            collapsed={isCollapsed}
          />
          <NavItem 
            icon="fa-robot" 
            label="Bot Automation" 
            active={currentTool === ToolType.BOT_AUTOMATION} 
            onClick={() => setTool(ToolType.BOT_AUTOMATION)}
            collapsed={isCollapsed}
          />
        </nav>

        <div className="p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 overflow-hidden">
          <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
            <span className={`text-xs text-slate-400 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8">
           <div className="flex items-center text-slate-400 text-sm">
             <span className="mr-2 hidden md:inline">Context:</span>
             <span className="px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-400 border border-cyan-800/50">Production</span>
           </div>
           <div className="flex items-center space-x-4">
             <button className="text-slate-400 hover:text-white transition-colors"><i className="fas fa-bell"></i></button>
             <button className="text-slate-400 hover:text-white transition-colors" onClick={() => setTool(ToolType.PROFILE)}><i className="fas fa-cog"></i></button>
             <button 
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${currentTool === ToolType.PROFILE ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-400'}`}
                onClick={() => setTool(ToolType.PROFILE)}
             >
               <i className="fas fa-user text-xs"></i>
             </button>
           </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};