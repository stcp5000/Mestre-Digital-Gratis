import React, { useState, useMemo } from "react";
import { 
  Droplets, 
  Droplet, 
  Weight, 
  Activity, 
  Sun, 
  Baby, 
  Dumbbell, 
  Info, 
  ChevronRight, 
  Target, 
  Zap, 
  CloudRain,
  GlassWater,
  Droplets as WaterBottle,
  Scale,
  ThermometerSun
} from "lucide-react";
import { motion } from "motion/react";

// --- Types & Themes ---

type WaterTheme = "classic" | "ocean" | "cyber" | "zen";
type WaterNiche = "general" | "athlete" | "tropical" | "maternity";

interface NicheConfig {
  name: string;
  icon: any;
  multiplier: number; // ml per kg
  extraMl: number;
  description: string;
}

const NICHES: Record<WaterNiche, NicheConfig> = {
  general: {
    name: "Estilo de Vida Comum",
    icon: Activity,
    multiplier: 35,
    extraMl: 0,
    description: "Recomendação base para manter a hidratação e o metabolismo funcionando."
  },
  athlete: {
    name: "Atleta / Intenso",
    icon: Dumbbell,
    multiplier: 45,
    extraMl: 500,
    description: "Considera a perda hídrica severa através do suor durante treinos longos."
  },
  tropical: {
    name: "Clima Quente",
    icon: ThermometerSun,
    multiplier: 40,
    extraMl: 300,
    description: "Ajuste para compensar a evaporação natural em temperaturas elevadas."
  },
  maternity: {
    name: "Gestante / Lactante",
    icon: Baby,
    multiplier: 35,
    extraMl: 700,
    description: "Aumento da demanda hídrica para produção de leite e saúde do bebê."
  }
};

const themeConfigs: Record<WaterTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
  fill: string;
}> = {
  classic: {
    name: "Executivo",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-sky-500 text-white",
    text: "text-slate-400",
    fill: "bg-sky-500"
  },
  ocean: {
    name: "Vibrante",
    bg: "bg-cyan-500",
    border: "border-white/20 shadow-[0_8px_0_rgba(0,0,0,0.1)]",
    accent: "text-white",
    card: "bg-white",
    button: "bg-blue-600 text-white shadow-[0_4px_0_#1d4ed8]",
    text: "text-white/60",
    fill: "bg-blue-600"
  },
  cyber: {
    name: "Tech-Blue",
    bg: "bg-[#020202]",
    border: "border-cyan-500/30",
    accent: "text-cyan-400",
    card: "bg-cyan-500/5",
    button: "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    text: "text-cyan-500/40",
    fill: "bg-cyan-500"
  },
  zen: {
    name: "Equilíbrio",
    bg: "bg-[#F0F9FF]",
    border: "border-blue-100",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500",
    fill: "bg-blue-400"
  }
};

export default function WaterConsumptionCalculatorTool() {
  const [weight, setWeight] = useState<number>(70);
  const [exerciseTime, setExerciseTime] = useState<number>(30); // minutes
  const [niche, setNiche] = useState<WaterNiche>("general");
  const [theme, setTheme] = useState<WaterTheme>("classic");

  const results = useMemo(() => {
    const config = NICHES[niche];
    // Base calculation: weight * multiplier + extra for niche
    let baseMl = (weight * config.multiplier) + config.extraMl;
    
    // Additional water for exercise: ~500ml per hour of activity
    const exerciseExtra = (exerciseTime / 60) * 500;
    
    const totalMl = baseMl + exerciseExtra;
    
    // Secondary metrics
    const glasses = totalMl / 250; // standard 250ml glass
    const bottles = totalMl / 500; // 500ml standard bottle

    return {
      totalMl: Math.round(totalMl),
      totalLiters: (totalMl / 1000).toFixed(1),
      glasses: Math.ceil(glasses),
      bottles: Math.ceil(bottles)
    };
  }, [weight, exerciseTime, niche]);

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-sky-500/10 text-sky-400 text-[10px] font-black tracking-widest rounded border border-sky-500/20 uppercase mb-4">
          Vitality & Hydration
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Calculadora de Consumo de Água</h2>
        <p className="mt-4 text-slate-400">Descubra sua meta diária de hidratação baseada no seu perfil biológico, atividades e clima. Manter-se hidratado otimiza a queima de gordura e o foco cognitivo.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as WaterTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-sky-400"
             }`}
           >
             {themeConfigs[t].name}
           </button>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Phase */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-10`}>
              
              {/* Niche Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as WaterNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => setNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Sliders */}
              <div className="space-y-12">
                 {/* Weight */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-sky-400" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'zen' ? 'text-slate-900' : 'text-white'}`}>Meu Peso Atual</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className={`w-20 bg-transparent border-b-2 outline-none text-right font-black text-xl transition-colors ${theme === 'zen' ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'}`}
                          />
                          <span className={`${currentTheme.accent} font-black text-3xl`}>kg</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="30" max="250" step="1" value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500"
                    />
                 </div>

                 {/* Activity Level */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-emerald-400" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'zen' ? 'text-slate-900' : 'text-white'}`}>Tempo de Atividade por Dia</span>
                       </div>
                       <span className={`${currentTheme.accent} font-black text-3xl`}>{exerciseTime} min</span>
                    </div>
                    <input 
                      type="range" min="0" max="240" step="10" value={exerciseTime}
                      onChange={(e) => setExerciseTime(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${theme === 'ocean' ? 'bg-white' : 'bg-[#0A1F35]'} ${currentTheme.border} relative overflow-hidden flex flex-col h-full`}>
              
              <div className="space-y-2 mb-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Meta de Hidratação Diária</h3>
                 <span className={`text-6xl font-black tracking-tighter block ${theme === 'ocean' ? 'text-blue-600' : 'text-white'}`}>
                    {results.totalLiters} <span className="text-xl opacity-50 uppercase">Litros</span>
                 </span>
                 <div className="flex items-center gap-2 mt-4 text-[9px] font-black text-sky-500 uppercase tracking-widest">
                    Total: {results.totalMl}ml
                 </div>
              </div>

              <div className="h-px bg-white/10 w-full mb-8" />

              <div className="grid gap-6">
                 {/* Visual Units */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-sky-500/5 p-4 rounded-3xl border border-sky-500/10 flex flex-col items-center">
                       <GlassWater className="h-8 w-8 text-sky-400 mb-2" />
                       <span className="text-[8px] font-black text-slate-500 uppercase mb-1">Copos (250ml)</span>
                       <span className={`text-2xl font-black ${theme === 'ocean' ? 'text-black' : 'text-white'}`}>{results.glasses}</span>
                    </div>
                    <div className="bg-sky-500/5 p-4 rounded-3xl border border-sky-500/10 flex flex-col items-center">
                       <WaterBottle className="h-8 w-8 text-sky-400 mb-2" />
                       <span className="text-[8px] font-black text-slate-500 uppercase mb-1">Garrafas (500ml)</span>
                       <span className={`text-2xl font-black ${theme === 'ocean' ? 'text-black' : 'text-white'}`}>{results.bottles}</span>
                    </div>
                 </div>

                 {/* Liquid Level Indicator */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                       <span>Preenchimento Recomendado</span>
                       <Droplet className="h-3 w-3 text-sky-500" />
                    </div>
                    <div className="h-16 w-full bg-white/5 rounded-[1.5rem] border border-white/5 relative overflow-hidden">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: "100%" }}
                         className={`absolute bottom-0 left-0 right-0 ${currentTheme.fill} opacity-20`}
                       />
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'ocean' ? 'text-blue-900' : 'text-sky-400'}`}>H2O Optimal Flow</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Expert Card */}
              <div className="mt-auto pt-10">
                 <div className={`p-6 rounded-[2rem] border flex gap-4 items-center ${theme === 'ocean' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-sky-500/10 border-sky-500/20'}`}>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${theme === 'ocean' ? 'bg-blue-500/20 text-blue-600' : 'bg-sky-500/20 text-sky-400'}`}>
                       <Target className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'ocean' ? 'text-blue-600' : 'text-sky-400'}`}>Dica Bio-Health</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                          {NICHES[niche].description} Beba água em pequenos goles ao longo do dia para melhor absorção celular.
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
