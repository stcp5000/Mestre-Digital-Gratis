import React, { useState, useMemo } from "react";
import { 
  Tag, 
  ShoppingBag, 
  Percent, 
  DollarSign, 
  Calculator, 
  TrendingDown, 
  History, 
  Share2, 
  Zap, 
  Gift, 
  Truck, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type DiscountTheme = "classic" | "creative" | "cyber" | "minimal";
type DiscountNiche = "retail" | "ecommerce" | "clearance" | "wholesale";

interface NicheConfig {
  name: string;
  icon: any;
  defaultTax: number;
  description: string;
}

const NICHES: Record<DiscountNiche, NicheConfig> = {
  retail: {
    name: "Varejo Físico",
    icon: ShoppingBag,
    defaultTax: 0,
    description: "Ideal para cálculos rápidos durante compras em lojas físicas."
  },
  ecommerce: {
    name: "E-commerce",
    icon: Truck,
    defaultTax: 10,
    description: "Calcule cupons, frete e impostos de importação."
  },
  clearance: {
    name: "Liquidação",
    icon: Tag,
    defaultTax: 0,
    description: "Para descontos progressivos e queima de estoque (50% + 20%)."
  },
  wholesale: {
    name: "Atacado",
    icon: Zap,
    defaultTax: 12,
    description: "Cálculos de volume com margens e impostos industriais."
  }
};

const themeConfigs: Record<DiscountTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
}> = {
  classic: {
    name: "Comercial",
    bg: "bg-[#0A0A0A]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-white text-black",
    text: "text-slate-400"
  },
  creative: {
    name: "Vibrante",
    bg: "bg-rose-500",
    border: "border-black/20",
    accent: "text-black",
    card: "bg-white",
    button: "bg-black text-white",
    text: "text-black/60"
  },
  cyber: {
    name: "Cyber/Tech",
    bg: "bg-[#020202]",
    border: "border-indigo-500/30",
    accent: "text-indigo-400",
    card: "bg-indigo-500/5",
    button: "bg-indigo-500 text-black",
    text: "text-indigo-500/40"
  },
  minimal: {
    name: "Zen",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500"
  }
};

export default function DiscountCalculatorTool() {
  const [price, setPrice] = useState<number>(100);
  const [discount, setDiscount] = useState<number>(20);
  const [extraDiscount, setExtraDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [niche, setNiche] = useState<DiscountNiche>("retail");
  const [theme, setTheme] = useState<DiscountTheme>("classic");

  const results = useMemo(() => {
    // Apply first discount
    const firstDiscountAmount = price * (discount / 100);
    const priceAfterFirst = price - firstDiscountAmount;
    
    // Apply extra discount (stacking)
    const extraDiscountAmount = priceAfterFirst * (extraDiscount / 100);
    const priceAfterSecond = priceAfterFirst - extraDiscountAmount;
    
    // Apply tax
    const taxAmount = priceAfterSecond * (tax / 100);
    const finalPrice = priceAfterSecond + taxAmount;
    
    const totalSavings = price - priceAfterSecond;
    const effectiveDiscount = price > 0 ? (totalSavings / price) * 100 : 0;

    return {
      finalPrice: Math.max(0, finalPrice),
      savings: totalSavings,
      taxAmount: taxAmount,
      effectiveDiscount: effectiveDiscount
    };
  }, [price, discount, extraDiscount, tax]);

  const applyNiche = (key: DiscountNiche) => {
    setNiche(key);
    setTax(NICHES[key].defaultTax);
    if (key === "clearance") setExtraDiscount(10);
    else setExtraDiscount(0);
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
        <span className="inline-block px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black tracking-widest rounded border border-rose-500/20 uppercase mb-4">
          Shopping & E-commerce
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Calculadora de Desconto Inteligente</h2>
        <p className="mt-4 text-slate-400">Calcule descontos simples, progressivos ou acumule cupons. Veja quanto você economiza de verdade, incluindo taxas e impostos em versões nichadas.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as DiscountTheme[]).map((t) => (
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
        {/* Input Pane */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-10`}>
              
              {/* Niche Icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as DiscountNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => applyNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Sliders */}
              <div className="space-y-12">
                 {/* Price */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Preço Original</span>
                       </div>
                       <span className={`text-3xl font-black ${currentTheme.accent}`}>{formatCurrency(price)}</span>
                    </div>
                    <input 
                      type="range" min="1" max="10000" step="1" value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-10">
                    {/* Main Discount */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <Percent className="h-4 w-4 text-rose-500" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Desconto (%)</span>
                          </div>
                          <span className={`text-xl font-black ${currentTheme.accent}`}>{discount}%</span>
                       </div>
                       <input 
                         type="range" min="0" max="100" step="1" value={discount}
                         onChange={(e) => setDiscount(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500"
                       />
                    </div>

                    {/* Stacking Discount */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <TrendingDown className="h-4 w-4 text-indigo-500" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Cupom Extra (%)</span>
                          </div>
                          <span className={`text-xl font-black ${currentTheme.accent}`}>{extraDiscount}%</span>
                       </div>
                       <input 
                         type="range" min="0" max="100" step="1" value={extraDiscount}
                         onChange={(e) => setExtraDiscount(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                       />
                    </div>
                 </div>

                 {/* Tax (Optional/Niche) */}
                 {(niche === 'ecommerce' || niche === 'wholesale') && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-6"
                    >
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <Zap className="h-4 w-4 text-amber-500" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Impostos / Taxas (%)</span>
                          </div>
                          <span className={`text-xl font-black ${currentTheme.accent}`}>{tax}%</span>
                       </div>
                       <input 
                         type="range" min="0" max="50" step="0.5" value={tax}
                         onChange={(e) => setTax(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500"
                       />
                    </motion.div>
                 )}
              </div>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${currentTheme.bg === 'bg-rose-500' ? 'bg-white' : 'bg-[#0A0A0A]'} ${currentTheme.border} relative overflow-hidden flex flex-col h-full`}>
              
              <div className="space-y-2 mb-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preço Final</h3>
                 <span className={`text-5xl font-black tracking-tighter block ${theme === 'creative' ? 'text-black' : 'text-white'}`}>
                    {formatCurrency(results.finalPrice)}
                 </span>
                 <div className="flex items-center gap-2 mt-2">
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20">
                       ECONOMIA DE {formatCurrency(results.savings)}
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/5 w-full mb-8" />

              <div className="grid gap-6">
                 <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Desconto Efetivo</span>
                    <span className={`text-lg font-black ${theme === 'creative' ? 'text-black' : 'text-white'}`}>{results.effectiveDiscount.toFixed(1)}%</span>
                 </div>
                 
                 {results.taxAmount > 0 && (
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor em Taxas</span>
                      <span className="text-sm font-bold text-amber-500">+{formatCurrency(results.taxAmount)}</span>
                   </div>
                 )}

                 {/* Visual breakdown */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                       <span>Composição de Valor</span>
                       <span>Custo Real: {Math.round((results.finalPrice / price) * 100)}%</span>
                    </div>
                    <div className="h-6 w-full bg-white/5 rounded-3xl flex overflow-hidden border border-white/5">
                       <motion.div 
                         layout
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min(100, (results.finalPrice / price) * 100)}%` }}
                         className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                       />
                       <motion.div 
                         layout
                         initial={{ width: 0 }}
                         animate={{ width: `${results.effectiveDiscount}%` }}
                         className="h-full bg-rose-500 opacity-80"
                       />
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-black text-slate-400 uppercase">Preço Pago</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          <span className="text-[9px] font-black text-slate-400 uppercase">Economia</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bonus Card */}
              <div className="mt-auto pt-10">
                 <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                       <Gift className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Vale a pena?</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                         Niche: {NICHES[niche].name}. {results.effectiveDiscount > 50 ? "Excelente oportunidade! Desconto acima da média do mercado." : "Compare com outras lojas para garantir o melhor preço."}
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
