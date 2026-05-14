import React, { useState, useMemo, useEffect } from "react";
import { 
  Timer, 
  MapPin, 
  Wind, 
  Trophy, 
  Activity, 
  Zap, 
  Mountain, 
  Flame, 
  Clock, 
  Share2, 
  Info,
  ChevronRight,
  TrendingUp,
  Award,
  FastForward,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type PaceTheme = "elite" | "pulse" | "playful" | "minimal";
type PaceNiche = "beginner" | "intermediate" | "marathon" | "ultra";

interface NicheConfig {
  name: string;
  icon: any;
  defaultPace: string; // "MM:SS"
  description: string;
}

const NICHES: Record<PaceNiche, NicheConfig> = {
  beginner: {
    name: "Iniciante / Jogging",
    icon: Wind,
    defaultPace: "07:30",
    description: "Foco em consistência e evolução gradual da resistência aeróbica."
  },
  intermediate: {
    name: "Performance 10k",
    icon: Activity,
    defaultPace: "05:15",
    description: "Para corredores que buscam quebrar recordes pessoais em distâncias curtas."
  },
  marathon: {
    name: "Maratonista",
    icon: Trophy,
    defaultPace: "04:30",
    description: "Planejamento rigoroso de pace para sub-4h ou sub-3h em 42km."
  },
  ultra: {
    name: "Ultra / Trail",
    icon: Mountain,
    defaultPace: "06:45",
    description: "Considera altimetria e economia de energia para longas durações."
  }
};

const themeConfigs: Record<PaceTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
  fill: string;
}> = {
  elite: {
    name: "Elite Performance",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-emerald-500 text-[#0A1F35]",
    text: "text-slate-400",
    fill: "bg-emerald-500"
  },
  pulse: {
    name: "Neon Pulse",
    bg: "bg-[#020202]",
    border: "border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.1)]",
    accent: "text-fuchsia-400",
    card: "bg-fuchsia-500/5",
    button: "bg-fuchsia-500 text-black shadow-fuchsia-500/20",
    text: "text-fuchsia-500/40",
    fill: "bg-fuchsia-500"
  },
  playful: {
    name: "Energia",
    bg: "bg-orange-500",
    border: "border-white/20 shadow-[8px_8px_0_rgba(0,0,0,0.1)]",
    accent: "text-white",
    card: "bg-white",
    button: "bg-black text-white",
    text: "text-white/60",
    fill: "bg-black"
  },
  minimal: {
    name: "Zen/Claro",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500",
    fill: "bg-emerald-400"
  }
};

const COMMON_DISTANCES = [
  { name: "5k", km: 5 },
  { name: "10k", km: 10 },
  { name: "Half Marathon", km: 21.0975 },
  { name: "Marathon", km: 42.195 },
];

export default function RunningPaceCalculatorTool() {
  const [distance, setDistance] = useState<number>(5);
  const [paceMinutes, setPaceMinutes] = useState<number>(5);
  const [paceSeconds, setPaceSeconds] = useState<number>(30);
  const [niche, setNiche] = useState<PaceNiche>("beginner");
  const [theme, setTheme] = useState<PaceTheme>("elite");

  // Calculate total time based on distance and pace
  const results = useMemo(() => {
    const totalPaceInSeconds = (paceMinutes * 60) + paceSeconds;
    const totalTimeInSeconds = totalPaceInSeconds * distance;
    
    const hours = Math.floor(totalTimeInSeconds / 3600);
    const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
    const seconds = Math.floor(totalTimeInSeconds % 60);

    const racePredictions = COMMON_DISTANCES.map(d => {
      const timeSec = totalPaceInSeconds * d.km;
      const h = Math.floor(timeSec / 3600);
      const m = Math.floor((timeSec % 3600) / 60);
      const s = Math.floor(timeSec % 60);
      return {
        name: d.name,
        time: `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`
      };
    });

    return {
      formattedTime: `${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      rawSeconds: totalTimeInSeconds,
      predictions: racePredictions,
      calorieEst: Math.round(weightToCal(70, distance)) // Assume 70kg avg
    };
  }, [distance, paceMinutes, paceSeconds]);

  function weightToCal(weight: number, dist: number) {
     return weight * dist * 1.036; // Simple formula
  }

  const applyNiche = (key: PaceNiche) => {
    setNiche(key);
    const [m, s] = NICHES[key].defaultPace.split(":").map(Number);
    setPaceMinutes(m);
    setPaceSeconds(s);
  };

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-block px-2 py-0.5 ${theme === 'pulse' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'} text-[10px] font-black tracking-widest rounded border uppercase mb-4`}
        >
          Athletic Analytics & Planning
        </motion.span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Calculadora de Ritmo de Corrida (Pace)</h2>
        <p className="mt-4 text-slate-400">Calcule seu pace ideal para maratonas, 10k ou treinos diários. Preveja seus tempos de prova e ajuste sua estratégia de corrida com versões otimizadas para cada perfil de atleta.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as PaceTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-emerald-400"
             }`}
           >
             {themeConfigs[t].name}
           </button>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Interface */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-10`}>
              
              {/* Profile Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as PaceNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => applyNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Sliders Area */}
              <div className="space-y-12">
                 {/* Distance */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-400" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white/70'}`}>Distância do Treino / Prova</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            value={distance}
                            step="0.1"
                            onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                            className={`w-20 bg-transparent border-b-2 outline-none text-right font-black text-xl transition-colors ${theme === 'minimal' ? 'text-slate-900 border-slate-200 focus:border-emerald-500' : 'text-white border-white/10 focus:border-emerald-500'}`}
                          />
                          <span className={`text-3xl font-black ${currentTheme.accent}`}>km</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="1" max="100" step="0.5" value={distance}
                      onChange={(e) => setDistance(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 {/* Pace Selection */}
                 <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <Clock className="h-4 w-4 text-blue-400" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white/70'}`}>Minutos / km</span>
                          </div>
                          <span className={`text-3xl font-black ${currentTheme.accent}`}>{paceMinutes}m</span>
                       </div>
                       <input 
                         type="range" min="2" max="15" step="1" value={paceMinutes}
                         onChange={(e) => setPaceMinutes(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                       />
                    </div>

                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <FastForward className="h-4 w-4 text-orange-400" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white/70'}`}>Segundos / km</span>
                          </div>
                          <span className={`text-3xl font-black ${currentTheme.accent}`}>{paceSeconds}s</span>
                       </div>
                       <input 
                         type="range" min="0" max="59" step="1" value={paceSeconds}
                         onChange={(e) => setPaceSeconds(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${theme === 'playful' ? 'bg-white' : 'bg-[#0A1F35]'} ${currentTheme.border} relative overflow-hidden flex flex-col h-full`}>
              
              <div className="space-y-2 mb-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tempo Total Estimado</h3>
                 <span className={`text-7xl font-black tracking-tighter block ${theme === 'playful' ? 'text-black' : 'text-white'}`}>
                    {results.formattedTime}
                 </span>
                 <div className="flex items-center gap-3 mt-4">
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20 uppercase">
                       {paceMinutes.toString().padStart(2, '0')}:{paceSeconds.toString().padStart(2, '0')} min/km
                    </div>
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20 uppercase">
                       ~{results.calorieEst} kcal
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/10 w-full mb-8" />

              <div className="grid gap-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Previsão por distância</h4>
                 
                 <div className="grid gap-4">
                    {results.predictions.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center font-black text-[10px] ${currentTheme.accent}`}>
                               {p.name.includes("k") ? p.name : p.name[0]}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.name}</span>
                         </div>
                         <span className={`text-sm font-black ${theme === 'playful' ? 'text-black' : 'text-white'}`}>{p.time}</span>
                      </div>
                    ))}
                 </div>

                 {/* Intensity Indicator */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                       <span>Aceleração Viral</span>
                       <span>{(3600 / ((paceMinutes * 60) + paceSeconds)).toFixed(1)} km/h</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min(100, (15 / ((paceMinutes*60 + paceSeconds)/60)) * 100)}%` }}
                         className={`h-full ${currentTheme.fill} opacity-80`}
                       />
                    </div>
                 </div>
              </div>

              {/* Expert Insight */}
              <div className="mt-auto pt-10">
                 <div className={`p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-center`}>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                       <Zap className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Dica Performance</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                          {paceMinutes < 4 ? "Atenção ao limiar anaeróbico. " : "Ideal para queima de gordura e base. "}
                          Mantenha um pace constante para otimizar o estoque de glicogênio durante a prova.
                       </p>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
