


export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  desc, 
  color, 
  visual, 
  className = "" 
}: { 
  icon?: any, 
  title: string, 
  desc: string, 
  color?: string, 
  visual?: React.ReactNode, 
  className?: string 
}) => (
  <div className={`rounded-3xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-all duration-300 group hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden relative flex flex-col ${className}`}>
    {visual ? (
        <div className="flex-1 min-h-[200px] relative w-full overflow-hidden">
            {visual}
        </div>
    ) : (
        <div className="p-8 pb-0">
             <div className={`w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                {Icon && <Icon className={`w-6 h-6 ${color}`} />}
             </div>
        </div>
    )}
    
    <div className="p-8 relative z-10 bg-slate-900/0">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  </div>
);

