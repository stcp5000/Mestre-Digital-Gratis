import React, { useState, useMemo } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Briefcase, 
  ShoppingCart, 
  Terminal, 
  Factory, 
  Wallet, 
  ArrowUpRight, 
  Info, 
  Target, 
  ShieldCheck,
  Zap,
  Layers,
  Calculator,
  LineChart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type MarginTheme = "classic" | "vibrant" | "cyber" | "minimal";
type MarginNiche = "retail" | "saas" | "services" | "manufacturing";

interface NicheConfig {
  name: string;
  icon: any;
  defaultGross: number;
  description: string;
}

const NICHES: Record<MarginNiche, NicheConfig> = {
  retail: {
    name: "Varejo",
    icon: ShoppingCart,
    defaultGross: 30,
    description: "Ideal para lojas físicas e e-commerce de produtos físicos."
  },
  saas: {
    name: "SaaS / Digital",
    icon: Terminal,
    defaultGross: 85,
    description: "Foco em altas margens brutas e custos de servidor/CPV reduzidos."
  },
  services: {
    name: "Serviços Profissionais",
    icon: Briefcase,
    defaultGross: 50,
    description: "Cálculo baseado em horas técnicas e custos operacionais fixos."
  },
  manufacturing: {
    name: "Indústria",
    icon: Factory,
    defaultGross: 25,
    description: "Considera custos de matéria-prima, mão de obra e energia."
  }
};

const themeConfigs: Record<MarginTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
}> = {
  classic: {
    name: "Executivo",
    bg: "bg-[#0A0A0A]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-white text-black",
    text: "text-slate-400"
  },
  vibrant: {
    name: "Startup",
    bg: "bg-indigo-600",
    border: "border-black/20",
    accent: "text-black",
    card: "bg-white",
    button: "bg-black text-white",
    text: "text-black/60"
  },
  cyber: {
    name: "Analista/AI",
    bg: "bg-[#020202]",
    border: "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
    accent: "text-emerald-400",
    card: "bg-emerald-500/5",
    button: "bg-emerald-500 text-black",
    text: "text-emerald-500/40"
  },
  minimal: {
    name: "Contábil/Zen",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500"
  }
};

export default function ProfitMarginCalculatorTool() {
  const [cost, setCost] = useState<number>(100);
  const [revenue, setRevenue] = useState<number>(150);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(20);
  const [niche, setNiche] = useState<MarginNiche>("retail");
  const [theme, setTheme] = useState<MarginTheme>("classic");

  const results = useMemo(() => {
    const grossProfit = revenue - cost;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const markup = cost > 0 ? (grossProfit / cost) * 100 : 0;
    
    const netProfit = grossProfit - operatingExpenses;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      grossProfit,
      grossMargin,
      markup,
      netProfit,
      netMargin
    };
  }, [cost, revenue, operatingExpenses]);

  const applyNiche = (key: MarginNiche) => {
    setNiche(key);
    // Adjust logic if needed based on typical behavior
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
          Business & Pricing Intelligence
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Calculadora de Margem de Lucro Pro</h2>
        <p className="mt-4 text-slate-400">Calcule margem bruta, líquida e markup com precisão cirúrgica. Otimize seus preços de venda e entenda a rentabilidade real do seu negócio em diferentes nichos.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as MarginTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
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
              
              {/* Niche Icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as MarginNiche[]).map((key) => {
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
                        <span className="text-[8px] font-black uppercase tracking-widest text-center">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Sliders Area */}
              <div className="space-y-12">
                 {/* Cost */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Calculator className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Custo do Produto/Serviço</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <input 
                           type="number"
                           value={cost}
                           onChange={(e) => setCost(Number(e.target.value))}
                           className={`w-24 bg-transparent border-b-2 border-white/10 focus:border-emerald-500 outline-none text-right font-black text-xl transition-colors ${currentTheme.accent}`}
                         />
                         <span className={`text-3xl font-black ${currentTheme.accent} hidden sm:inline`}>{formatCurrency(cost)}</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="1" max="10000" step="1" value={cost}
                      onChange={(e) => setCost(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 {/* Revenue */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2 text-slate-400">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Preço de Venda</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <input 
                           type="number"
                           value={revenue}
                           onChange={(e) => setRevenue(Number(e.target.value))}
                           className={`w-24 bg-transparent border-b-2 border-white/10 focus:border-indigo-500 outline-none text-right font-black text-xl transition-colors ${currentTheme.accent}`}
                         />
                         <span className={`text-3xl font-black ${currentTheme.accent} hidden sm:inline`}>{formatCurrency(revenue)}</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="1" max="20000" step="1" value={revenue}
                      onChange={(e) => setRevenue(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                 </div>

                 {/* Expenses */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Layers className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Despesas Operacionais (Fixas/Var.)</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <input 
                           type="number"
                           value={operatingExpenses}
                           onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                           className={`w-24 bg-transparent border-b-2 border-white/10 focus:border-rose-500 outline-none text-right font-black text-xl transition-colors ${currentTheme.accent}`}
                         />
                         <span className={`text-3xl font-black ${currentTheme.accent} hidden sm:inline`}>{formatCurrency(operatingExpenses)}</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="0" max="5000" step="5" value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${currentTheme.bg === 'bg-indigo-600' ? 'bg-white' : 'bg-[#0A0A0A]'} ${currentTheme.border} relative overflow-hidden flex flex-col h-full`}>
              
              <div className="space-y-1 mb-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Margem de Lucro Líquida</h3>
                 <span className={`text-6xl font-black tracking-tighter block ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>
                    {results.netMargin.toFixed(1)}%
                 </span>
                 <p className={`text-[10px] font-bold uppercase ${results.netMargin > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {results.netMargin > 0 ? 'Operação Rentável' : 'Operação em Prejuízo'}
                 </p>
              </div>

              <div className="h-px bg-white/5 w-full mb-8" />

              <div className="grid gap-6">
                 <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lucro Líquido Real</span>
                    <span className={`text-2xl font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{formatCurrency(results.netProfit)}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Margem Bruta</span>
                       <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{results.grossMargin.toFixed(1)}%</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Markup Aplicado</span>
                       <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{results.markup.toFixed(1)}%</span>
                    </div>
                 </div>

                 {/* Profit Breakdown */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                       <span>Composição do Faturamento</span>
                       <span>Retorno: {results.netMargin.toFixed(0)}%</span>
                    </div>
                    <div className="h-8 w-full bg-white/5 rounded-[1rem] flex overflow-hidden border border-white/5">
                       {/* Cost Area */}
                       <motion.div 
                         layout
                         animate={{ width: `${(cost / revenue) * 100}%` }}
                         className="h-full bg-slate-700/50 border-r border-white/5 group relative"
                       >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[8px] font-black text-white">CUSTO</span>
                          </div>
                       </motion.div>
                       {/* Expenses Area */}
                       <motion.div 
                         layout
                         animate={{ width: `${(operatingExpenses / revenue) * 100}%` }}
                         className="h-full bg-rose-500/30 border-r border-white/5 group relative"
                       >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[8px] font-black text-white">EXP</span>
                          </div>
                       </motion.div>
                       {/* Profit Area */}
                       <motion.div 
                         layout
                         animate={{ width: `${results.netMargin}%` }}
                         className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] group relative"
                       >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[8px] font-black text-black">LUCRO</span>
                          </div>
                       </motion.div>
                    </div>
                 </div>
              </div>

              {/* Status Card */}
              <div className="mt-auto pt-10">
                 <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                       <Target className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Dica Estratégica</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                          {results.netMargin > 40 ? "Sua margem está acima da média para " + NICHES[niche].name + ". Você tem espaço para investir em escala." : "Sua margem está apertada. Considere reduzir custos fixos ou aumentar o markup."}
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
