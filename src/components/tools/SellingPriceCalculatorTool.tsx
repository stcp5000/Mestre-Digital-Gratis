import React, { useState, useMemo } from "react";
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  Store, 
  Utensils, 
  Laptop, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Info,
  ShoppingCart,
  PieChart,
  Tag,
  Scale
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type PricingTheme = "classic" | "vibrant" | "cyber" | "minimal";
type PricingNiche = "ecommerce" | "restaurant" | "freelance" | "general";

interface NicheConfig {
  name: string;
  icon: any;
  defaultProfit: number;
  description: string;
}

const NICHES: Record<PricingNiche, NicheConfig> = {
  ecommerce: {
    name: "E-commerce / Marketplace",
    icon: ShoppingCart,
    defaultProfit: 25,
    description: "Ideal para vendas online com foco em taxas de marketplace e frete."
  },
  restaurant: {
    name: "Restaurante / Alimentação",
    icon: Utensils,
    defaultProfit: 35,
    description: "Calcula com base em ingredientes (CMV) e desperdício planejado."
  },
  freelance: {
    name: "Serviços / Digital",
    icon: Laptop,
    defaultProfit: 45,
    description: "Precificação por projeto ou hora, considerando custos fixos de estrutura."
  },
  general: {
    name: "Varejo Geral",
    icon: Store,
    defaultProfit: 20,
    description: "Modelo clássico de markup para lojas físicas e revenda."
  }
};

const themeConfigs: Record<PricingTheme, {
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
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-emerald-500 text-[#0A1F35]",
    text: "text-slate-400"
  },
  vibrant: {
    name: "Moderno",
    bg: "bg-amber-400",
    border: "border-black/20",
    accent: "text-black",
    card: "bg-white shadow-xl",
    button: "bg-black text-white",
    text: "text-black/60"
  },
  cyber: {
    name: "Analista/Tech",
    bg: "bg-[#020202]",
    border: "border-indigo-500/30",
    accent: "text-indigo-400",
    card: "bg-indigo-500/5",
    button: "bg-indigo-500 text-black",
    text: "text-indigo-500/40"
  },
  minimal: {
    name: "Zen/Claro",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500"
  }
};

export default function SellingPriceCalculatorTool() {
  const [cost, setCost] = useState<number>(100);
  const [markup, setMarkup] = useState<number>(30);
  const [taxes, setTaxes] = useState<number>(6);
  const [fees, setFees] = useState<number>(11);
  const [niche, setNiche] = useState<PricingNiche>("general");
  const [theme, setTheme] = useState<PricingTheme>("classic");

  const results = useMemo(() => {
    // Total variable percentage (taxes + fees + desired profit/markup)
    const totalVarPercent = taxes + fees + markup;
    
    // Formula: Cost / (1 - (Total Percent / 100))
    // This is the ideal formula for margin-based pricing
    const divisor = 1 - (totalVarPercent / 100);
    const sellingPrice = divisor > 0.01 ? cost / divisor : cost * (1 + markup/100);
    
    const profitAmount = sellingPrice - cost - (sellingPrice * (taxes/100)) - (sellingPrice * (fees/100));
    
    return {
      price: sellingPrice,
      profit: profitAmount,
      taxes: sellingPrice * (taxes / 100),
      fees: sellingPrice * (fees / 100),
      margin: (profitAmount / sellingPrice) * 100
    };
  }, [cost, markup, taxes, fees]);

  const applyNiche = (key: PricingNiche) => {
    setNiche(key);
    setMarkup(NICHES[key].defaultProfit);
    if (key === "ecommerce") setFees(15);
    else if (key === "restaurant") setFees(5);
    else setFees(0);
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
          Inteligência de Precificação
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Calculadora de Preço de Venda</h2>
        <p className="mt-4 text-slate-400">Parem de perder dinheiro. Determine o preço de venda ideal considerando custos, impostos, taxas de cartão/marketplace e a margem de lucro que você realmente deseja.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as PricingTheme[]).map((t) => (
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
        {/* Core Inputs */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-10`}>
              
              {/* Niche Icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as PricingNiche[]).map((key) => {
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
                 {/* Unit Cost */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-emerald-400" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Custo de Produção/Compra (Unitário)</span>
                       </div>
                       <span className={`text-3xl font-black ${currentTheme.accent}`}>{formatCurrency(cost)}</span>
                    </div>
                    <input 
                      type="range" min="1" max="10000" step="1" value={cost}
                      onChange={(e) => setCost(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-12">
                    {/* Desired Margin/Profit */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <Percent className="h-4 w-4 text-indigo-400" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Margem Desejada (%)</span>
                          </div>
                          <span className={`text-xl font-black ${currentTheme.accent}`}>{markup}%</span>
                       </div>
                       <input 
                         type="range" min="5" max="85" step="1" value={markup}
                         onChange={(e) => setMarkup(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                       />
                    </div>

                    {/* Fees & Commissions */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <Scale className="h-4 w-4 text-amber-400" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Taxas & Comissões (%)</span>
                          </div>
                          <span className={`text-xl font-black ${currentTheme.accent}`}>{fees}%</span>
                       </div>
                       <input 
                         type="range" min="0" max="35" step="0.5" value={fees}
                         onChange={(e) => setFees(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500"
                       />
                    </div>
                 </div>

                 {/* Taxes */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-rose-500" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Impostos sobre Venda (%)</span>
                       </div>
                       <span className={`text-xl font-black ${currentTheme.accent}`}>{taxes}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="40" step="0.5" value={taxes}
                      onChange={(e) => setTaxes(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${currentTheme.bg === 'bg-amber-400' ? 'bg-white' : 'bg-[#0A1F35]'} ${currentTheme.border} relative overflow-hidden flex flex-col h-full`}>
              
              <div className="space-y-2 mb-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preço de Venda Sugerido</h3>
                 <span className={`text-6xl font-black tracking-tighter block ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>
                    {formatCurrency(results.price)}
                 </span>
                 <div className="flex items-center gap-2 mt-4">
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20 uppercase">
                       Lucro Real: {formatCurrency(results.profit)}
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/5 w-full mb-8" />

              <div className="grid gap-6">
                 <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Markup Efetivo</span>
                    <span className={`text-lg font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{((results.price/cost - 1) * 100).toFixed(1)}%</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Impostos Total</span>
                       <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{formatCurrency(results.taxes)}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Taxas Total</span>
                       <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{formatCurrency(results.fees)}</span>
                    </div>
                 </div>

                 {/* Visual breakdown */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                       <span>Composição do Preço</span>
                       <span>Lucro: {results.margin.toFixed(0)}%</span>
                    </div>
                    <div className="h-8 w-full bg-white/5 rounded-[1rem] flex overflow-hidden border border-white/5">
                       {/* Cost Area */}
                       <motion.div 
                         layout
                         animate={{ width: `${(cost / results.price) * 100}%` }}
                         className="h-full bg-slate-700/50 border-r border-white/5"
                       />
                       {/* Taxes & Fees Area */}
                       <motion.div 
                         layout
                         animate={{ width: `${((results.taxes + results.fees) / results.price) * 100}%` }}
                         className="h-full bg-rose-500/30 border-r border-white/5"
                       />
                       {/* Profit Area */}
                       <motion.div 
                         layout
                         animate={{ width: `${results.margin}%` }}
                         className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                       />
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                          <span className="text-[8px] font-black text-slate-400 uppercase">Custo</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-rose-500/50" />
                          <span className="text-[8px] font-black text-slate-400 uppercase">Impostos/Taxas</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-black text-slate-400 uppercase">Lucro</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Status Card */}
              <div className="mt-auto pt-10">
                 <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                       <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Saúde Financeira</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                          {results.margin < 15 ? "Margem perigosa! Pequenas variações de custo podem gerar prejuízo operacional." : "Margem sólida. Seu negócio está precificando com inteligência competitiva."}
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
