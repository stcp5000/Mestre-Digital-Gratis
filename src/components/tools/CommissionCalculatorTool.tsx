import React, { useState, useMemo } from "react";
import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Home, 
  ShoppingBag, 
  UserCheck, 
  Gift, 
  Briefcase, 
  BarChart3, 
  Target, 
  Zap, 
  ShieldCheck,
  Calculator,
  Users,
  Award,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type CommissionTheme = "classic" | "cyber" | "fun" | "minimal";
type CommissionNiche = "realestate" | "retail" | "affiliate" | "services";

interface NicheConfig {
  name: string;
  icon: any;
  defaultRate: number;
  description: string;
}

const NICHES: Record<CommissionNiche, NicheConfig> = {
  realestate: {
    name: "Imobiliário",
    icon: Home,
    defaultRate: 6,
    description: "Cálculos para corretores com suporte a parcerias e divisões."
  },
  retail: {
    name: "Varejo / Vendas",
    icon: ShoppingBag,
    defaultRate: 3,
    description: "Foco em volume de vendas e metas atingidas."
  },
  affiliate: {
    name: "Afiliado / Digital",
    icon: Zap,
    defaultRate: 50,
    description: "Altas taxas para infoprodutos e marketing digital."
  },
  services: {
    name: "Serviços B2B",
    icon: Briefcase,
    defaultRate: 10,
    description: "Comissões recorrentes ou por fechamento de contrato."
  }
};

const themeConfigs: Record<CommissionTheme, {
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
    name: "Executivo",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-emerald-500 text-[#0A1F35]",
    text: "text-slate-400",
    input: "border-white/10 focus:border-emerald-500"
  },
  cyber: {
    name: "Data/Tech",
    bg: "bg-[#020202]",
    border: "border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    accent: "text-blue-400",
    card: "bg-blue-500/5",
    button: "bg-blue-500 text-black shadow-blue-500/20",
    text: "text-blue-500/40",
    input: "border-blue-500/20 focus:border-blue-500"
  },
  fun: {
    name: "Dinâmico",
    bg: "bg-amber-400",
    border: "border-black/20",
    accent: "text-black",
    card: "bg-white shadow-xl px-2",
    button: "bg-black text-white",
    text: "text-black/60",
    input: "border-black/10 focus:border-black"
  },
  minimal: {
    name: "Essencial",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500",
    input: "border-slate-200 focus:border-slate-900"
  }
};

export default function CommissionCalculatorTool() {
  const [saleValue, setSaleValue] = useState<number>(15000);
  const [rate, setRate] = useState<number>(5);
  const [bonus, setBonus] = useState<number>(0);
  const [split, setSplit] = useState<number>(100); // % that goes to the salesperson
  const [niche, setNiche] = useState<CommissionNiche>("retail");
  const [theme, setTheme] = useState<CommissionTheme>("classic");

  const results = useMemo(() => {
    const rawCommission = saleValue * (rate / 100);
    const splitCommission = rawCommission * (split / 100);
    const finalCommission = splitCommission + bonus;
    
    return {
      total: finalCommission,
      raw: rawCommission,
      net: splitCommission,
      ratio: saleValue > 0 ? (finalCommission / saleValue) * 100 : 0
    };
  }, [saleValue, rate, bonus, split]);

  const applyNiche = (key: CommissionNiche) => {
    setNiche(key);
    setRate(NICHES[key].defaultRate);
    if (key === "realestate") setSplit(50);
    else setSplit(100);
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
        <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-widest rounded border border-blue-500/20 uppercase mb-4">
          Sales & Rewards Optimization
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Calculadora de Comissão Estratégica</h2>
        <p className="mt-4 text-slate-400">Calcule ganhos de vendas, afiliados e corretores em segundos. Defina taxas, bônus por meta e divisões de parceria com total transparência financeira.</p>
      </div>

      {/* Theme Bar */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as CommissionTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-blue-400"
             }`}
           >
             {themeConfigs[t].name}
           </button>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Configuration Section */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-10`}>
              
              {/* Niche Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as CommissionNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => applyNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Dynamic Inputs */}
              <div className="space-y-12">
                 {/* Sale Value */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end gap-4 overflow-hidden">
                       <div className="flex items-center gap-2 text-slate-400 shrink-0">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Valor da Venda</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            value={saleValue}
                            onChange={(e) => setSaleValue(Number(e.target.value))}
                            className="w-24 bg-transparent border-b-2 border-white/10 focus:border-blue-500 outline-none text-right font-black text-xl text-white transition-colors"
                          />
                          <span className={`text-3xl font-black ${currentTheme.accent} hidden sm:inline truncate`}>{formatCurrency(saleValue)}</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="100" max="1000000" step="500" value={saleValue}
                      onChange={(e) => setSaleValue(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-12">
                    {/* Rate */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end overflow-hidden">
                          <div className="flex items-center gap-2 text-slate-400 shrink-0">
                             <Percent className="h-4 w-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Taxa (%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <input 
                               type="number"
                               value={rate}
                               step="0.1"
                               onChange={(e) => setRate(Number(e.target.value))}
                               className="w-16 bg-transparent border-b-2 border-white/10 focus:border-blue-500 outline-none text-right font-black text-xl text-white transition-colors"
                             />
                             <span className={`text-xl font-black ${currentTheme.accent}`}>%</span>
                          </div>
                       </div>
                       <input 
                         type="range" min="0.1" max="100" step="0.1" value={rate}
                         onChange={(e) => setRate(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                       />
                    </div>

                    {/* Split Percentage */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end overflow-hidden">
                          <div className="flex items-center gap-2 text-slate-400 shrink-0">
                             <Users className="h-4 w-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Sua Parte (%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <input 
                               type="number"
                               value={split}
                               onChange={(e) => setSplit(Number(e.target.value))}
                               className="w-16 bg-transparent border-b-2 border-white/10 focus:border-emerald-500 outline-none text-right font-black text-xl text-white transition-colors"
                             />
                             <span className={`text-xl font-black ${currentTheme.accent}`}>%</span>
                          </div>
                       </div>
                       <input 
                         type="range" min="1" max="100" step="1" value={split}
                         onChange={(e) => setSplit(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                       />
                    </div>
                 </div>

                 {/* Fixed Bonus */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end gap-4 overflow-hidden">
                       <div className="flex items-center gap-2 text-slate-400 shrink-0">
                          <Gift className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Bônus Adicional / Meta</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            value={bonus}
                            onChange={(e) => setBonus(Number(e.target.value))}
                            className="w-24 bg-transparent border-b-2 border-white/10 focus:border-amber-500 outline-none text-right font-black text-xl text-white transition-colors"
                          />
                          <span className={`text-2xl font-black ${currentTheme.accent} hidden sm:inline truncate`}>{formatCurrency(bonus)}</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="0" max="10000" step="100" value={bonus}
                      onChange={(e) => setBonus(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${theme === 'fun' ? 'bg-white' : 'bg-[#0A1F35]'} ${currentTheme.border} relative overflow-hidden flex flex-col h-full`}>
              
              <div className="space-y-2 mb-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comissão Final</h3>
                 <span className={`text-6xl font-black tracking-tighter block ${theme === 'fun' ? 'text-black' : 'text-white'}`}>
                    {formatCurrency(results.total)}
                 </span>
                 <div className="flex items-center gap-2 mt-4">
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-500 text-[10px] font-black rounded-full border border-blue-500/20 uppercase">
                       {results.ratio.toFixed(1)}% do valor total
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/10 w-full mb-8" />

              <div className="grid gap-6">
                 <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base de Cálculo</span>
                    <span className={`text-xl font-black ${theme === 'fun' ? 'text-black' : 'text-white'}`}>{formatCurrency(results.raw)}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Parte da Empresa</span>
                       <span className={`text-sm font-black ${theme === 'fun' ? 'text-black' : 'text-white'}`}>{formatCurrency(results.raw - results.net)}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Seu Net</span>
                       <span className={`text-sm font-black ${theme === 'fun' ? 'text-black' : 'text-white'}`}>{formatCurrency(results.net)}</span>
                    </div>
                 </div>

                 {/* Breakdown Visualizer */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                       <span>Estrutura de Pagamento</span>
                       <span>Retorno: {results.ratio.toFixed(0)}%</span>
                    </div>
                    <div className="h-8 w-full bg-white/5 rounded-[1rem] flex overflow-hidden border border-white/5">
                       {/* Sales Value Placeholder */}
                       <motion.div 
                         layout
                         animate={{ width: `${Math.max(15, 100 - results.ratio)}%` }}
                         className="h-full bg-slate-800 border-r border-white/5 flex items-center justify-center"
                       >
                          <span className="text-[7px] font-black text-slate-600">VENDA</span>
                       </motion.div>
                       {/* Commission Area */}
                       <motion.div 
                         layout
                         animate={{ width: `${Math.min(85, results.ratio)}%` }}
                         className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center"
                       >
                          <span className="text-[7px] font-black text-black">GANHO</span>
                       </motion.div>
                    </div>
                 </div>
              </div>

              {/* Success Badge */}
              <div className="mt-auto pt-10">
                 <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                       <Award className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Dica de Performance</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                          {results.total > 1000 ? "Excelente fechamento! Sua taxa média de " + results.ratio.toFixed(1) + "% está alinhada com o setor de " + NICHES[niche].name + "." : "Continue prospectando. O volume de vendas é a chave para exponenciar suas comissões."}
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
