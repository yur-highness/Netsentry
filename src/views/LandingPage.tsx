import  { useEffect, useRef } from 'react';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Activity, 
  Globe, 
  Cpu, 
  Zap, 
  Lock,
  Terminal,
  Brain,
  Route,
  ShieldCheck,
  Key,
  EyeOff
} from 'lucide-react';
import { GlobeVisualization } from '../components/GlobeVisualization';
import { FeatureCard } from '../components/FeatureCard';
// import { useNavigate } from 'react-router-dom';





gsap.registerPlugin(ScrollTrigger);


const onEnter = () => {
  window.location.href = '/dashboard';
}
interface StatItemProps {
  icon: any;     // <--- FIX
  label: string;
  value: string | number;
  className?: string;// Add className prop to the type definition
}



const StatItem = ({ icon, label, value, className }: StatItemProps) => (

  <div className="flex items-center gap-4 min-w-[200px] select-none">
    <div className="p-3 rounded-full bg-slate-800/50 border border-slate-700">
      {React.cloneElement(icon, { className: className ? `${className} w-6 h-6` : "w-6 h-6" })}
    </div>
    <div className="flex flex-col text-left">
      <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
    </div>
  </div>
);

const StatItemSmall = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center gap-3 min-w-[180px] select-none py-2 px-4 rounded-lg bg-slate-900/30 border border-white/5">
    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
    <div className="flex flex-col text-left">
       <span className="text-lg font-bold text-slate-200">{value}</span>
       <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  </div>
);


export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
   const navigate = useNavigate();
const handleClick = () => {
  navigate('/dashboard');
};


  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out"
      });

      gsap.from(".hero-grid", {
        scale: 0.8,
        opacity: 0,
        duration: 2,
        delay: 0.5,
        ease: "power3.out"
      });

      // Section Animations
      gsap.utils.toArray('.anim-section').forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        });
      });

      // Feature Cards Stagger
      gsap.utils.toArray('.feature-row').forEach((row: any) => {
        gsap.from(row.querySelectorAll('.feature-card'), {
            scrollTrigger: {
                trigger: row,
                start: "top 85%"
            },
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);



  return (
    <div ref={containerRef} className="bg-slate-950 text-slate-200 w-full min-h-screen font-sans">
         {/* HEADER */}
      <header className="fixed top-4 right-4 z-50 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition-all text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Active
            </button>
          </div>
      </header>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className=" inset-0 landing-grid-bg hero-grid pointer-events-none opacity-40 fixed"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-950 to-transparent z-10"></div>
        
        <div className="container mx-auto px-6 relative z-20 text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-sm font-mono tracking-widest hero-text backdrop-blur-sm">
                SYSTEM ONLINE V2.5
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight hero-text">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">NET</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 text-glow">SENTRY</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 font-light hero-text">
                Advanced Network Diagnostics & Threat Intelligence powered by Generative AI.
                Visualize, Secure, and Optimize your infrastructure.
            </p>
            <button 
                onClick={onEnter}
                className="hero-text group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg rounded overflow-hidden transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105"
            >
                <span className="relative z-10 flex items-center">
                    Initialize Console <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0 animate-[fadeIn_2s_ease-in_2s_forwards]">
            <span className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Scroll to Explore</span>
            <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-cyan-500 rounded-full animate-[bounce_1.5s_infinite]"></div>
            </div>
        </div>
        
        {/* Animated Elements */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
      </section>
 {/* 2. STATS BANNER (DUAL MARQUEE) */}
      <section className="py-12 border-y border-white/5 bg-slate-900/40 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

        {/* Row 1: Left Direction */}
        <div className="flex overflow-hidden mb-16 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex min-w-full animate-marquee-left space-x-16 px-8">
            {/* Set 1 */}
            <StatItem icon={<Zap className="text-amber-400" />} label="Latency Precision" value="10ms" />
            <StatItem icon={<Cpu className="text-cyan-400" />} label="Gemini Model" value="AI 2.5" />
            <StatItem icon={<Globe className="text-emerald-400" />} label="Threat Map" value="Global" />
            <StatItem icon={<Activity className="text-rose-400" />} label="Monitoring" value="Real-time" />
            <StatItem icon={<Lock className="text-violet-400" />} label="Encryption" value="AES-256" />
            
            {/* Set 2 (Duplicate for seamless loop) */}
            <StatItem icon={<Zap className="text-amber-400" />} label="Latency Precision" value="10ms" />
            <StatItem icon={<Cpu className="text-cyan-400" />} label="Gemini Model" value="AI 2.5" />
            <StatItem icon={<Globe className="text-emerald-400" />} label="Threat Map" value="Global" />
            <StatItem icon={<Activity className="text-rose-400" />} label="Monitoring" value="Real-time" />
            <StatItem icon={<Lock className="text-violet-400" />} label="Encryption" value="AES-256" />
             {/* Set 3 (Extra Duplicate for wide screens) */}
             <StatItem icon={<Zap className="text-amber-400" />} label="Latency Precision" value="10ms" />
            <StatItem icon={<Cpu className="text-cyan-400" />} label="Gemini Model" value="AI 2.5" />
            <StatItem icon={<Globe className="text-emerald-400" />} label="Threat Map" value="Global" />
            <StatItem icon={<Activity className="text-rose-400" />} label="Monitoring" value="Real-time" />
            <StatItem icon={<Lock className="text-violet-400" />} label="Encryption" value="AES-256" />
          </div>
        </div>

        {/* Row 2: Right Direction */}
        <div className="flex overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex min-w-full animate-marquee-right space-x-16 px-8">
             {/* Set 1 */}
            <StatItemSmall label="Uptime Guarantee" value="99.99%" />
            <StatItemSmall label="Data Processed" value="5PB/Day" />
            <StatItemSmall label="Active Nodes" value="45k+" />
            <StatItemSmall label="Threats Blocked" value="1.2M+" />
            <StatItemSmall label="Response Time" value="<0.5s" />

            {/* Set 2 */}
            <StatItemSmall label="Uptime Guarantee" value="99.99%" />
            <StatItemSmall label="Data Processed" value="5PB/Day" />
            <StatItemSmall label="Active Nodes" value="45k+" />
            <StatItemSmall label="Threats Blocked" value="1.2M+" />
            <StatItemSmall label="Response Time" value="<0.5s" />

             {/* Set 3 */}
             <StatItemSmall label="Uptime Guarantee" value="99.99%" />
            <StatItemSmall label="Data Processed" value="5PB/Day" />
            <StatItemSmall label="Active Nodes" value="45k+" />
            <StatItemSmall label="Threats Blocked" value="1.2M+" />
            <StatItemSmall label="Response Time" value="<0.5s" />
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="py-24 container mx-auto px-6 mt-20">
        <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <Lock className="w-3 h-3" />
              secure_connection://sentinel-dashboard.sys
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div className="h-64 rounded-lg bg-slate-950/50 border border-white/5 p-6 relative flex flex-col justify-end overflow-hidden group">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(6,182,212,0.1),transparent)]"></div>
                 <div className="flex items-end justify-between gap-2 h-32 mb-4">
                    {[40, 65, 45, 80, 55, 70, 40, 90, 60, 75, 50, 65].map((h, i) => (
                      <div key={i} className="w-full bg-cyan-500/20 rounded-t-sm relative overflow-hidden group-hover:bg-cyan-500/30 transition-colors" style={{ height: `${h}%` }}>
                        <div className="absolute bottom-0 left-0 w-full bg-cyan-500" style={{ height: '4px' }}></div>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>00:00</span>
                    <span>12:00</span>
                 </div>
                 <h3 className="absolute top-6 left-6 text-sm font-semibold text-slate-300 flex items-center gap-2">
                   <Activity className="w-4 h-4 text-cyan-400" /> Network Traffic
                 </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="h-32 rounded-lg bg-slate-950/50 border border-white/5 p-6 relative overflow-hidden">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Threat Level</h3>
                    <div className="text-3xl font-bold text-white mb-1">Low</div>
                    <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                        <div className="w-[15%] h-full bg-emerald-500"></div>
                    </div>
                </div>
                 <div className="h-32 rounded-lg bg-slate-950/50 border border-white/5 p-6 relative overflow-hidden">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System Load</h3>
                    <div className="text-3xl font-bold text-white mb-1">42%</div>
                     <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                        <div className="w-[42%] h-full bg-cyan-500"></div>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" /> Recent Logs
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { time: '10:42:05', status: 'INFO', msg: 'System integrity check passed' },
                  { time: '10:42:02', status: 'WARN', msg: 'Port 8080 latency spike detected' },
                  { time: '10:41:55', status: 'INFO', msg: 'New node connected: US-East-4' },
                  { time: '10:41:48', status: 'SUCCESS', msg: 'Threat signature DB updated' },
                  { time: '10:41:30', status: 'INFO', msg: 'Backup completed successfully' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 text-slate-400 p-2 hover:bg-white/5 rounded transition-colors cursor-default">
                    <span className="opacity-50">{log.time}</span>
                    <span className={`${
                      log.status === 'WARN' ? 'text-amber-400' : 
                      log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-blue-400'
                    }`}>{log.status}</span>
                    <span className="truncate">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      

            {/* 3. CORE CAPABILITIES (Bento Grid) */}
      <section className="py-24 relative">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-white mb-4">Core Capabilities</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">Full-spectrum network analysis tools integrated into a single glass pane.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
                  {/* Large Card: Globe */}
                  <FeatureCard 
                    className="md:col-span-2 md:row-span-2 h-[500px] md:h-auto"
                    visual={<GlobeVisualization />}
                    title="Geo-Spatial Intel" 
                    desc="Visualize hops on a 3D interactive globe with precise city-level geolocation and ISP data."
                    color="text-cyan-400"
                  />
                  {/* Smaller Cards */}
                  <FeatureCard 
                    icon={Brain} 
                    title="AI Analysis" 
                    desc="Gemini 2.5 integration analyzes logs and metrics to detect anomalies and suggest fixes in plain English."
                    color="text-purple-400"
                  />
                  <FeatureCard 
                    icon={Route} 
                    title="Visual Traceroute" 
                    desc="Watch packets travel in real-time. Identify bottlenecks, jitter, and packet loss instantly."
                    color="text-emerald-400"
                  />
              </div>
          </div>
      </section>

      {/* 4. MAP VISUALIZATION SHOWCASE */}
      <section className="py-24 bg-slate-900 clip-diagonal relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="anim-section">
                  <h2 className="text-4xl font-bold text-white mb-6">Global Threat Intelligence</h2>
                  <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                      Transform raw log data into actionable geographical intelligence. NetSentry maps every connection, 
                      providing situational awareness that standard CLI tools can't match.
                  </p>
                  <ul className="space-y-4 mb-8">
                      <ListItem text="Real-time attack vectors" />
                      <ListItem text="ISP & Backbone identification" />
                      <ListItem text="Latency heatmaps" />
                  </ul>
                  <button onClick={onEnter} className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                      Open Map View <i className="fas fa-arrow-right ml-2"></i>
                  </button>
              </div>
              <div className="relative anim-section">
                  <div className="aspect-video bg-slate-800 rounded-lg border border-slate-700 shadow-2xl relative overflow-hidden group">
                        {/* Abstract Map Representation */}
                        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                             <div className="w-64 h-64 rounded-full border border-cyan-500/30 animate-[spin_10s_linear_infinite]"></div>
                             <div className="absolute w-48 h-48 rounded-full border border-purple-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                             <i className="fas fa-globe-americas text-6xl text-slate-700"></i>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur p-4 rounded border border-slate-700 translate-y-full group-hover:translate-y-0 transition-transform">
                            <div className="text-xs text-cyan-400 font-bold mb-1">TARGET ACQUIRED</div>
                            <div className="text-sm text-white">192.168.10.55 - Tokyo, JP</div>
                        </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. AI INTEGRATION */}
      <section className="py-24">
          <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                  <div className="flex-1 anim-section">
                      <div className="inline-block px-3 py-1 rounded bg-purple-900/30 text-purple-400 text-xs font-bold mb-4 border border-purple-800">
                          POWERED BY GEMINI
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-6">Your AI SecOps Analyst</h2>
                      <p className="text-slate-400 text-lg mb-6">
                          Don't just see the error code. Understand the root cause. NetSentry's AI analyzes patterns, 
                          explains complex routing issues, and generates config snippets for Cisco, Juniper, and Linux.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-900 rounded border border-slate-800">
                              <i className="fas fa-code text-purple-500 mb-2"></i>
                              <h4 className="font-bold text-white">Config Gen</h4>
                              <p className="text-xs text-slate-500">Auto-generate firewall rules.</p>
                          </div>
                          <div className="p-4 bg-slate-900 rounded border border-slate-800">
                              <i className="fas fa-shield-alt text-purple-500 mb-2"></i>
                              <h4 className="font-bold text-white">Risk Scoring</h4>
                              <p className="text-xs text-slate-500">Instant security posture audit.</p>
                          </div>
                      </div>
                  </div>
                  <div className="flex-1 relative anim-section">
                       <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-2xl font-mono text-sm relative">
                           <div className="flex space-x-2 mb-4">
                               <div className="w-3 h-3 rounded-full bg-red-500"></div>
                               <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                               <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                           </div>
                           <div className="space-y-2">
                               <p className="text-slate-400">$ analyze --target 10.0.0.5 --deep</p>
                               <p className="text-purple-400">Analyzing traffic patterns...</p>
                               <p className="text-slate-300">
                                   <span className="text-red-400">[CRITICAL]</span> Port 23 (Telnet) is exposed to public internet.
                               </p>
                               <p className="text-slate-300">
                                   <span className="text-emerald-400">[SUGGESTION]</span> Disable Telnet immediately. Use SSH (Port 22).
                               </p>
                           </div>
                           <div className="absolute -z-10 -inset-4 bg-purple-600/20 blur-xl rounded-full opacity-50"></div>
                       </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 6. ADVANCED SCANNER TOOLS */}
      <section className="py-24 bg-slate-900">
          <div className="container mx-auto px-6 text-center mb-16 anim-section">
              <h2 className="text-3xl font-bold text-white mb-4">Diagnostic Toolkit</h2>
              <p className="text-slate-400">Everything you need to troubleshoot the network stack.</p>
          </div>
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 feature-row">
               <ToolCard title="Port Scanner" icon="fa-crosshairs" desc="Multi-threaded port scanning with service version detection." />
               <ToolCard title="DNS Propagation" icon="fa-globe-americas" desc="Check A, MX, and TXT records across 8 global checkpoints." />
               <ToolCard title="SSL Inspector" icon="fa-lock" desc="Verify certificate chains, expiry dates, and cipher strength." />
               <ToolCard title="Subnet Calc" icon="fa-calculator" desc="IPv4 CIDR calculations for network segmentation planning." />
               <ToolCard title="MAC Lookup" icon="fa-fingerprint" desc="Identify device manufacturers via OUI database." />
               <ToolCard title="Bot Automation" icon="fa-robot" desc="Schedule recurring health checks and get alerted on failure." />
          </div>
      </section>

      {/* 7. AUTOMATION & MONITORING */}
      <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/5 -skew-x-12 transform origin-top-right"></div>
          <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-3xl anim-section">
                  <h2 className="text-4xl font-bold text-white mb-6">Set It and Forget It</h2>
                  <p className="text-lg text-slate-400 mb-8">
                      Deploy automated bot agents to ping gateways, check HTTP statuses, and monitor port availability 
                      at custom intervals. View historical uptime trends and export reports.
                  </p>
                  <div className="flex items-center space-x-8">
                      <div className="text-center">
                          <div className="text-4xl font-black text-emerald-400 mb-2">24/7</div>
                          <div className="text-sm text-slate-500 uppercase">Uptime Monitoring</div>
                      </div>
                      <div className="text-center">
                          <div className="text-4xl font-black text-emerald-400 mb-2">50+</div>
                          <div className="text-sm text-slate-500 uppercase">Log Retention</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

        {/* SECURITY FOCUS (New Section) */}
      <section className="py-24 border-y border-white/5 bg-slate-950 relative overflow-hidden group">
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[80px] group-hover:bg-cyan-500/10 transition-colors duration-700 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
              <div className="relative mb-8 group/icon">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 relative shadow-2xl shadow-cyan-500/20 rotate-3 group-hover/icon:rotate-12 transition-transform duration-500 ease-out">
                      <ShieldCheck className="w-10 h-10 text-cyan-400" />
                  </div>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Enterprise-Grade <span className="text-cyan-400">Security</span>
              </h2>
              <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                  Sentinel runs entirely in your browser. Your data never leaves your device, 
                  and API keys are encrypted locally using military-grade standards.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Security Feature Cards */}
                {[
                  { icon: Lock, title: "Client-Side Execution", desc: "Logic executes locally within your browser's secure sandbox environment." },
                  { icon: Key, title: "Local Encrypted Storage", desc: "API keys are stored using AES-256 encryption in your device's local storage." },
                  { icon: EyeOff, title: "Zero-Knowledge Architecture", desc: "We never transmit, store, or log your credentials or sensitive network data." }
                ].map((feature, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 group/card">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 mb-6 group-hover/card:border-cyan-500/30 group-hover/card:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
                          <feature.icon className="w-6 h-6 text-slate-500 group-hover/card:text-cyan-400 transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>

   

      {/* 10. SYSTEM REQUIREMENTS */}
      <section className="py-16 bg-slate-900/50">
          <div className="container mx-auto px-6 text-center anim-section">
               <p className="text-sm font-mono text-slate-500 mb-4">SYSTEM COMPATIBILITY</p>
               <div className="flex justify-center space-x-8 text-3xl text-slate-600">
                   <i className="fab fa-chrome hover:text-white transition-colors"></i>
                   <i className="fab fa-firefox hover:text-white transition-colors"></i>
                   <i className="fab fa-edge hover:text-white transition-colors"></i>
                   <i className="fab fa-apple hover:text-white transition-colors"></i>
                   <i className="fab fa-windows hover:text-white transition-colors"></i>
                   <i className="fab fa-linux hover:text-white transition-colors"></i>
               </div>
          </div>
      </section>

         {/* FOOTER / CTA */}
      <footer className="py-24 relative overflow-hidden bg-slate-950 border-t border-white/5">
          {/* Background effects */}
          <div className="absolute inset-0 bg-linear-to-t from-cyan-900/10 to-slate-950 pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
              <h2 className="text-5xl font-black text-white mb-8 tracking-tight">Ready to Scan Your Network?</h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Launch the console now. No registration required for basic tools.
              </p>
              <button 
              onClick={handleClick}
                className="group relative px-10 py-5 bg-white text-slate-950 font-bold text-xl rounded-lg hover:bg-cyan-50 transition-all shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_-15px_rgba(6,182,212,0.5)] hover:-translate-y-1"
              >
                  Launch Sentinel Console
                  <div className="absolute inset-0 rounded-lg ring-2 ring-white/50 group-hover:ring-cyan-400/50 transition-all"></div>
              </button>
              
              <div className="mt-24 border-t border-white/5 pt-8 text-slate-600 text-sm flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center gap-2 mb-4 md:mb-0">
                      <div className="w-6 h-6 rounded bg-linear-to-tr from-cyan-600 to-blue-700 flex items-center justify-center opacity-70">
                        <ShieldCheck className="w-3 h-3 text-white" />
                      </div>
                      <span>&copy; 2025 NETSENTRY. All rights reserved.</span>
                  </div>
                  <div className="flex space-x-8">
                      <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
                      <a href="#" className="hover:text-cyan-400 transition-colors">API Status</a>
                      <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};



const ListItem: React.FC<{text: string}> = ({ text }) => (
    <li className="flex items-center text-slate-300">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-3"></span>
        {text}
    </li>
);

const ToolCard: React.FC<{title: string, icon: string, desc: string}> = ({ title, icon, desc }) => (
    <div className="feature-card flex items-start space-x-4 p-5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
        <i className={`fas ${icon} text-xl text-slate-500 mt-1`}></i>
        <div>
            <h4 className="font-bold text-slate-200">{title}</h4>
            <p className="text-xs text-slate-500 mt-1">{desc}</p>
        </div>
    </div>
);

