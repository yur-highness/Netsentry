import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const NavItem = ({
    to,
    icon,
    label,
  }: {
    to: string;
    icon: string;
    label: string;
  }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 border-l-4 overflow-hidden group 
        ${isActive
          ? "bg-slate-800 border-cyan-400 text-cyan-400"
          : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
        }`
      }
      title={isCollapsed ? label : ""}
    >
      <div className="w-5 flex justify-center shrink-0">
        <i className={`fas ${icon} text-center`}></i>
      </div>

      <span
        className={`font-medium tracking-wide text-sm whitespace-nowrap transition-opacity duration-300 
          ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
      >
        {label}
      </span>
    </NavLink>
  );

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 cyber-grid font-sans overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl transition-all duration-300`}
      >
        {/* Top Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 bg-slate-900 h-20">
          {/* Expanded Logo */}
          <div
            className={`flex items-center space-x-3 overflow-hidden transition-all duration-300 ${
              isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
            }`}
          >
            <div className="w-8 h-8 rounded bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <i className="fas fa-shield-alt text-white text-sm"></i>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wider text-slate-100">
                NET<span className="text-cyan-400">SENTRY</span>
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                Console v2.5
              </p>
            </div>
          </div>

          {/* Collapsed Logo */}
          <div
            className={`absolute left-4 top-6 transition-all duration-300 ${
              isCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <div className="w-8 h-8 rounded bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <i className="fas fa-shield-alt text-white text-sm"></i>
            </div>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800`}
          >
            <i className={`fas ${isCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">

          <NavItem to="/dashboard" icon="fa-chart-line" label="Dashboard" />
          <NavItem to="/map" icon="fa-globe" label="Map Intelligence" />
          <NavItem to="/scanner" icon="fa-radar" label="Net Scanner" />
          <NavItem to="/dns" icon="fa-network-wired" label="DNS & Whois" />
          <NavItem to="/ai" icon="fa-brain" label="AI Analyst" />

          {!isCollapsed && (
            <div className="px-4 py-2 mt-4">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Operations
              </span>
            </div>
          )}

          <NavItem to="/subnet" icon="fa-calculator" label="Subnet Calc" />
          <NavItem to="/ssl" icon="fa-lock" label="SSL Inspector" />
          <NavItem to="/mac" icon="fa-fingerprint" label="MAC Lookup" />
          <NavItem to="/dns-propagation" icon="fa-globe-americas" label="DNS Propagation" />
          <NavItem to="/config" icon="fa-code" label="Config Gen" />
          <NavItem to="/bot-automation" icon="fa-robot" label="Bot Automation" />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>

            <span
              className={`text-xs text-slate-400 whitespace-nowrap transition-opacity duration-300 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              System Online
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">

        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8">
          <div className="flex items-center text-slate-400 text-sm">
            <span className="mr-2 hidden md:inline">Context:</span>
            <span className="px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-400 border border-cyan-800/50">
              Production
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <i className="fas fa-bell"></i>
            </button>

            <button
              className="text-slate-400 hover:text-white transition-colors"
              onClick={() => navigate('/profile')}
            >
              <i className="fas fa-cog"></i>
            </button>

            <button
              className="w-8 h-8 rounded-full bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-400 border flex items-center justify-center transition-all"
              onClick={() => navigate('/profile')}
            >
              <i className="fas fa-user text-xs"></i>
            </button>
          </div>
        </header>

        {/* Dynamic content */}
        <div className="flex-1 overflow-auto p-8 relative">
          <Outlet />
        </div>

      </main>
    </div>
  );
};
