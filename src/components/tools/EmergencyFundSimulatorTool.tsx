import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Briefcase, 
  User, 
  Home, 
  Heart, 
  Zap, 
  BarChart3, 
  PieChart, 
  Info,
  ChevronRight,
  Target,
  Umbrella,
  PiggyBank,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type FundTheme = "classic" | "playful" | "tech" | "minimal";
type FundNiche = "clt" | "autonomo" | "business" | "family";

interface NicheConfig {
  name: string;
  icon: any;
  defaultMonths: number;
  description: string;
}

const NICHES: Record<FundNiche, NicheConfig> = {
  clt: {
    name: "Assalariado (CLT)",
    icon: Briefcase,
    defaultMonths: 6,
    description: "Para quem tem estabilidade e FGTS. Recomendado: 6 meses de gastos."
  },
  autonomo: {
    name: "Autônomo / Freelancer",
    icon: Zap,
    defaultMonths: 12,
    description: "Para quem tem renda variável. Recomendado: 12 meses de segurança."
  },
  business: {
    name: "Empresário",
    icon: TrendingUp,
    defaultMonths: 9,
    description: "Equilíbrio entre reserva pessoal e capital de giro."
  },
  family: {
    name: "Família com Filhos",
    icon: Heart,
    defaultMonths: 12,
    description: "Segurança máxima para dependentes. Recomendado: 12 meses."
  }
};

const themeConfigs: Record<FundTheme, {
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
    name: "Tradicional",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-emerald-500 text-[#0A1F35]",
    text: "text-slate-400",
    input: "border-white/10 focus:border-emerald-500"
  },
  playful: {
    name: "Divertido",
    bg: "bg-indigo-500",
    border: "border-white/20 shadow-[0_10px_0_rgba(0,0,0,0.2)]",
    accent: "text-white",
    card: "bg-white",
    button: "bg-amber-400 text-indigo-900 shadow-[0_5px_0_#d97706]",
    text: "text-white/60",
    input: "border-white/10 focus:border-white"
  },
  tech: {
    name: "Analítico",
    bg: "bg-[#020202]",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
    card: "bg-emerald-500/5",
    button: "bg-emerald-500 text-black",
    text: "text-emerald-500/40",
    input: "border-emerald-500/20 focus:border-emerald-500"
  },
  minimal: {
    name: "Minimalista",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500",
    input: "border-slate-200 focus:border-slate-900"
  }
};

export default function EmergencyFundSimulatorTool() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(3000);
  const [months, setMonths] = useState<number>(6);
  const [savedAmount, setSavedAmount] = useState<number>(1000);
  const [monthlySaving, setMonthlySaving] = useState<number>(500);
  const [niche, setNiche] = useState<FundNiche>("clt");
  const [theme, setTheme] = useState<FundTheme>("classic");

  const results = useMemo(() => {
    const target = monthlyExpenses * months;
    const remaining = Math.max(0, target - savedAmount);
    const monthsToTarget = monthlySaving > 0 ? remaining / monthlySaving : 0;
    const progress = target > 0 ? (savedAmount / target) * 100 : 0;

    return {
      target,
      remaining,
      monthsToTarget: Math.ceil(monthsToTarget),
      progress: Math.min(100, progress)
    };
  }, [monthlyExpenses, months, savedAmount, monthlySaving]);

  const applyNiche = (key: FundNiche) => {
    setNiche(key);
    setMonths(NICHES[key].defaultMonths);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Financial Protection
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Simulador de Reserva de Emergência</h2>
        <p className="mt-4 text-slate-400">Calcule o valor ideal para sua segurança financeira. Personalize de acordo com sua carreira e planeje quanto tempo levará para atingir sua meta de tranquilidade.</p>
      </div>

      {/* Theme Selection */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as FundTheme[]).map((t) => (
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
        {/* Input Configuration */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-10`}>
              
              {/* Niche Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as FundNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => applyNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold' 
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
                 {/* Monthly Expenses */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end gap-4 overflow-hidden">
                       <div className="flex items-center gap-2 text-slate-400 shrink-0">
                          <Wallet className="h-4 w-4" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white/70'}`}>Meus Gastos Mensais</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            value={monthlyExpenses}
                            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                            className={`w-24 bg-transparent border-b-2 outline-none text-right font-black text-xl transition-colors ${theme === 'minimal' ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'}`}
                          />
                          <span className={`text-3xl font-black ${currentTheme.accent} hidden sm:inline truncate`}>{formatCurrency(monthlyExpenses)}</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="500" max="50000" step="100" value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 {/* Coverage Period */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="h-4 w-4" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white/70'}`}>Tempo de Proteção</span>
                       </div>
                       <span className={`text-3xl font-black ${currentTheme.accent}`}>{months} Meses</span>
                    </div>
                    <input 
                      type="range" min="3" max="24" step="1" value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-12">
                    {/* Amount Saved */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2 text-slate-400">
                             <PiggyBank className="h-4 w-4" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white/70'}`}>Já Poupei</span>
                          </div>
                       </div>
                       <input 
                         type="number"
                         value={savedAmount}
                         onChange={(e) => setSavedAmount(Number(e.target.value))}
                         className={`w-full bg-transparent border-b-2 outline-none font-black text-2xl transition-colors ${theme === 'minimal' ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'}`}
                       />
                    </div>

                    {/* Monthly contribution */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2 text-slate-400">
                             <Coins className="h-4 w-4" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white/70'}`}>Poupe/Mês</span>
                          </div>
                       </div>
                       <input 
                         type="number"
                         value={monthlySaving}
                         onChange={(e) => setMonthlySaving(Number(e.target.value))}
                         className={`w-full bg-transparent border-b-2 outline-none font-black text-2xl transition-colors ${theme === 'minimal' ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'}`}
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
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor da Reserva Ideal</h3>
                 <span className={`text-6xl font-black tracking-tighter block ${theme === 'playful' ? 'text-indigo-900' : 'text-white'}`}>
                    {formatCurrency(results.target)}
                 </span>
                 <div className="flex items-center gap-2 mt-4">
                    <div className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase ${theme === 'playful' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20'}`}>
                       Atualmente em {results.progress.toFixed(1)}%
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/10 w-full mb-8" />

              <div className="grid gap-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Falta economizar</span>
                    <span className={`text-xl font-black ${theme === 'playful' ? 'text-indigo-900' : 'text-white'}`}>{formatCurrency(results.remaining)}</span>
                 </div>
                 
                 <div className="flex justify-between items-center group">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tempo Estimado</span>
                       <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Mantendo {formatCurrency(monthlySaving)}/mês</span>
                    </div>
                    <span className={`text-3xl font-black ${theme === 'playful' ? 'text-indigo-900' : 'text-white'}`}>
                      {results.monthsToTarget} <span className="text-sm">Meses</span>
                    </span>
                 </div>

                 {/* Progress Visualizer */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                       <span>Progresso da Reserva</span>
                       <span>{results.progress.toFixed(0)}% Concluído</span>
                    </div>
                    <div className="h-10 w-full bg-white/5 rounded-2xl flex overflow-hidden border border-white/5 relative">
                       <motion.div 
                         layout
                         animate={{ width: `${results.progress}%` }}
                         className={`h-full relative overflow-hidden ${theme === 'playful' ? 'bg-indigo-500' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
                       >
                          {/* Animated stripes for growth effect */}
                          <div className="absolute inset-0 bg-white/10 [mask-image:linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px] animate-[pulse_2s_infinite]" />
                       </motion.div>
                    </div>
                 </div>
              </div>

              {/* Niche Insight Card */}
              <div className="mt-auto pt-10">
                 <div className={`p-6 rounded-[2rem] border flex gap-4 items-center ${theme === 'playful' ? 'bg-amber-400/10 border-amber-400/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${theme === 'playful' ? 'bg-amber-400/20 text-amber-600' : 'bg-indigo-500/20 text-indigo-400'}`}>
                       <Umbrella className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'playful' ? 'text-amber-600' : 'text-indigo-400'}`}>Visão de Especialista</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                          Para o seu perfil ({NICHES[niche].name}), {results.monthsToTarget > 12 ? "o foco deve ser consistência. Tente aumentar sua poupança mensal para reduzir o tempo de exposição ao risco." : "você está no caminho certo para uma segurança robusta."}
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
