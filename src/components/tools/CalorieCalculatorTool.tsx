import React, { useState, useMemo } from "react";
import { 
  Flame, 
  Dumbbell, 
  Target, 
  Zap, 
  Scale, 
  User, 
  Calendar, 
  Activity, 
  Heart, 
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Apple,
  Beef,
  Droplet,
  Utensils
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type CalorieTheme = "classic" | "vibrant" | "cyber" | "soft";
type CalorieNiche = "maintenance" | "cutting" | "bulking" | "athlete";

interface NicheConfig {
  name: string;
  icon: any;
  multiplier: number;
  description: string;
  macros: { p: number; f: number; c: number }; // Protein, Fat, Carbs percentage
}

const NICHES: Record<CalorieNiche, NicheConfig> = {
  maintenance: {
    name: "Manutenção",
    icon: Activity,
    multiplier: 1.0,
    description: "Para quem quer manter o peso atual e saúde em dia.",
    macros: { p: 25, f: 25, c: 50 }
  },
  cutting: {
    name: "Definição / Perda",
    icon: TrendingDown,
    multiplier: 0.8,
    description: "Déficit calórico para queima de gordura preservando massa muscular.",
    macros: { p: 40, f: 20, c: 40 }
  },
  bulking: {
    name: "Ganho de Massa",
    icon: TrendingUp,
    multiplier: 1.15,
    description: "Superávit calórico focado em hipertrofia e força.",
    macros: { p: 30, f: 20, c: 50 }
  },
  athlete: {
    name: "Alta Performance",
    icon: Zap,
    multiplier: 1.25,
    description: "Foco em energia máxima para treinos exaustivos.",
    macros: { p: 20, f: 20, c: 60 }
  }
};

const themeConfigs: Record<CalorieTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
  input: string;
}> = {
  classic: {
    name: "Clínico",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-orange-500 text-white shadow-orange-500/20",
    text: "text-slate-400",
    input: "border-white/10 focus:border-orange-500"
  },
  vibrant: {
    name: "Fitness / Joy",
    bg: "bg-lime-400",
    border: "border-black/20 shadow-[8px_8px_0_rgba(0,0,0,0.1)]",
    accent: "text-black",
    card: "bg-white",
    button: "bg-black text-white",
    text: "text-black/60",
    input: "border-black/10 focus:border-black"
  },
  cyber: {
    name: "BioHacker",
    bg: "bg-[#020202]",
    border: "border-orange-500/30",
    accent: "text-orange-400",
    card: "bg-orange-500/5",
    button: "bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    text: "text-orange-500/40",
    input: "border-orange-500/20 focus:border-orange-500"
  },
  soft: {
    name: "Equilíbrio",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500",
    input: "border-slate-200 focus:border-slate-900"
  }
};

export default function CalorieCalculatorTool() {
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<"m" | "f">("m");
  const [activity, setActivity] = useState<number>(1.375); // Lightly active
  const [niche, setNiche] = useState<CalorieNiche>("maintenance");
  const [theme, setTheme] = useState<CalorieTheme>("classic");

  const results = useMemo(() => {
    // Mifflin-St Jeor Equation
    const bmr = gender === "m" 
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const tdee = bmr * activity;
    const goalCalories = tdee * NICHES[niche].multiplier;
    
    // Macros calculation (1g Protein = 4kcal, 1g Fat = 9kcal, 1g Carb = 4kcal)
    const { p, f, c } = NICHES[niche].macros;
    const proteinGrams = (goalCalories * (p / 100)) / 4;
    const fatGrams = (goalCalories * (f / 100)) / 9;
    const carbGrams = (goalCalories * (c / 100)) / 4;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goal: Math.round(goalCalories),
      macros: {
        p: Math.round(proteinGrams),
        f: Math.round(fatGrams),
        c: Math.round(carbGrams)
      }
    };
  }, [weight, height, age, gender, activity, niche]);

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-orange-500/10 text-orange-400 text-[10px] font-black tracking-widest rounded border border-orange-500/20 uppercase mb-4">
          Health & Performance
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Calculadora de Calorias Diárias & Macronutrientes</h2>
        <p className="mt-4 text-slate-400">Descubra seu TDEE (Gasto Energético Total) e BMR. Planeje sua dieta com divisões de macros baseadas em seus objetivos reais de fitness e estética.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as CalorieTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-orange-400"
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
              
              {/* Objective Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as CalorieNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => setNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Data Blocks */}
              <div className="space-y-10">
                 {/* Weight & Height */}
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Scale className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Peso (kg)</span>
                       </div>
                       <input 
                         type="number"
                         value={weight}
                         onChange={(e) => setWeight(Number(e.target.value))}
                         className={`w-full bg-transparent border-b-2 outline-none font-black text-3xl transition-colors ${theme === 'soft' ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'}`}
                       />
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Activity className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Altura (cm)</span>
                       </div>
                       <input 
                         type="number"
                         value={height}
                         onChange={(e) => setHeight(Number(e.target.value))}
                         className={`w-full bg-transparent border-b-2 outline-none font-black text-3xl transition-colors ${theme === 'soft' ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'}`}
                       />
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-10">
                    {/* Age */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Idade</span>
                       </div>
                       <input 
                         type="number"
                         value={age}
                         onChange={(e) => setAge(Number(e.target.value))}
                         className={`w-full bg-transparent border-b-2 outline-none font-black text-3xl transition-colors ${theme === 'soft' ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'}`}
                       />
                    </div>
                    {/* Gender */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-slate-400 mb-4">
                          <User className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Gênero</span>
                       </div>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => setGender('m')}
                            className={`flex-1 py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${gender === 'm' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                          >Masculino</button>
                          <button 
                            onClick={() => setGender('f')}
                            className={`flex-1 py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${gender === 'f' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                          >Feminino</button>
                       </div>
                    </div>
                 </div>

                 {/* Activity Level */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Dumbbell className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Nível de Atividade</span>
                       </div>
                    </div>
                    <select 
                      value={activity}
                      onChange={(e) => setActivity(Number(e.target.value))}
                      className={`w-full bg-transparent border-b-2 p-2 outline-none font-black text-sm transition-colors ${theme === 'soft' ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'}`}
                    >
                       <option value="1.2" className="bg-[#0A1F35]">Sedentário (Pouco ou nenhum exercício)</option>
                       <option value="1.375" className="bg-[#0A1F35]">Levemente Ativo (Exercício 1-3 dias/semana)</option>
                       <option value="1.55" className="bg-[#0A1F35]">Moderadamente Ativo (Exercício 3-5 dias/semana)</option>
                       <option value="1.725" className="bg-[#0A1F35]">Muito Ativo (Exercício 6-7 dias/semana)</option>
                       <option value="1.9" className="bg-[#0A1F35]">Extremamente Ativo (Atleta/Trabalho pesado)</option>
                    </select>
                 </div>
              </div>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${theme === 'vibrant' ? 'bg-white' : 'bg-[#0A1F35]'} ${currentTheme.border} relative overflow-hidden flex flex-col h-full`}>
              
              <div className="space-y-2 mb-8">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calorias Recomendadas / Dia</h3>
                 <span className={`text-6xl font-black tracking-tighter block ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>
                    {results.goal} <span className="text-xl opacity-50 uppercase">kcal</span>
                 </span>
                 <div className="flex items-center gap-4 mt-4">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-500 uppercase">TDEE (Manutenção)</span>
                       <span className={`text-sm font-bold ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{results.tdee} kcal</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-500 uppercase">BMR (Metabolismo Basal)</span>
                       <span className={`text-sm font-bold ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{results.bmr} kcal</span>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/10 w-full mb-8" />

              {/* Macro Breakdown */}
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Divisão de Macros</h4>
                 
                 <div className="grid gap-4">
                    {/* Protein */}
                    <div className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                             <Beef className="h-5 w-5" />
                          </div>
                          <div>
                             <span className="text-[9px] font-black text-slate-500 uppercase block">Proteína</span>
                             <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{results.macros.p}g / dia</span>
                          </div>
                       </div>
                       <span className="text-xs font-black text-orange-500">{NICHES[niche].macros.p}%</span>
                    </div>

                    {/* Carbs */}
                    <div className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                             <Apple className="h-5 w-5" />
                          </div>
                          <div>
                             <span className="text-[9px] font-black text-slate-500 uppercase block">Carboidratos</span>
                             <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{results.macros.c}g / dia</span>
                          </div>
                       </div>
                       <span className="text-xs font-black text-amber-500">{NICHES[niche].macros.c}%</span>
                    </div>

                    {/* Fats */}
                    <div className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                             <Droplet className="h-5 w-5" />
                          </div>
                          <div>
                             <span className="text-[9px] font-black text-slate-500 uppercase block">Gorduras</span>
                             <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{results.macros.f}g / dia</span>
                          </div>
                       </div>
                       <span className="text-xs font-black text-indigo-500">{NICHES[niche].macros.f}%</span>
                    </div>
                 </div>

                 {/* Visual Distribution */}
                 <div className="h-3 w-full bg-white/5 rounded-full flex overflow-hidden border border-white/5 shadow-inner mt-4">
                    <motion.div animate={{ width: `${NICHES[niche].macros.p}%` }} className="h-full bg-orange-500" />
                    <motion.div animate={{ width: `${NICHES[niche].macros.c}%` }} className="h-full bg-amber-500" />
                    <motion.div animate={{ width: `${NICHES[niche].macros.f}%` }} className="h-full bg-indigo-500" />
                 </div>
              </div>

              {/* Advice Card */}
              <div className="mt-auto pt-10">
                 <div className={`p-6 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 flex gap-4 items-center`}>
                    <div className="h-12 w-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                       <Utensils className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Estratégia {NICHES[niche].name}</h4>
                       <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                          {NICHES[niche].description} {niche === 'cutting' ? "Lembre-se de manter a ingestão de água alta para auxiliar no metabolismo." : "Foque em carboidratos complexos para manter os níveis de energia constantes."}
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
