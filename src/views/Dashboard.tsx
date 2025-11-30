
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', lat: 24, loss: 0 },
  { name: '04:00', lat: 22, loss: 0 },
  { name: '08:00', lat: 35, loss: 0.5 },
  { name: '12:00', lat: 89, loss: 2 },
  { name: '16:00', lat: 45, loss: 0 },
  { name: '20:00', lat: 30, loss: 0 },
  { name: '24:00', lat: 25, loss: 0 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; color: string; icon: string }> = ({ title, value, trend, color, icon }) => (
  <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100 mt-1">{value}</h3>
      </div>
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center bg-opacity-20`}>
        <i className={`fas ${icon} ${color.replace('bg-', 'text-')}`}></i>
      </div>
    </div>
    <div className="flex items-center text-xs">
      <span className="text-emerald-400 font-medium mr-2">{trend}</span>
      <span className="text-slate-600">vs last 24h</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Hosts" value="1,248" trend="+12%" color="bg-cyan-500" icon="fa-server" />
        <StatCard title="Avg Latency" value="24ms" trend="-5%" color="bg-emerald-500" icon="fa-stopwatch" />
        <StatCard title="Threats Blocked" value="14" trend="+2" color="bg-red-500" icon="fa-shield-virus" />
        <StatCard title="Network Uptime" value="99.99%" trend="0%" color="bg-blue-500" icon="fa-network-wired" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <div className="lg:col-span-2 bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-lg">
          <h3 className="text-slate-200 font-bold mb-6 flex items-center">
            <i className="fas fa-wave-square text-cyan-400 mr-2"></i> Global Latency Trends
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc'}}
                  itemStyle={{color: '#22d3ee'}}
                />
                <Area type="monotone" dataKey="lat" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorLat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-lg flex flex-col">
          <h3 className="text-slate-200 font-bold mb-4 flex items-center">
            <i className="fas fa-exclamation-triangle text-amber-400 mr-2"></i> Recent Alerts
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="mt-1">
                  {i === 1 ? <i className="fas fa-bug text-red-500"></i> : <i className="fas fa-info-circle text-blue-400"></i>}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Unusual Traffic Detected</p>
                  <p className="text-xs text-slate-500">Port 445 activity on 192.168.1.10{i}</p>
                </div>
                <span className="text-xs text-slate-600 ml-auto whitespace-nowrap">{i}m ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
