import React, { useState, useMemo } from "react";
import { 
  Calculator, 
  TrendingUp, 
  Home, 
  Car, 
  User, 
  Percent, 
  Calendar, 
  DollarSign, 
  PieChart, 
  ArrowRight,
  Info,
  Clock,
  Briefcase,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type LoanTheme = "classic" | "cyber" | "fun" | "minimal";
type LoanNiche = "personal" | "vehicle" | "home" | "business";

interface NicheConfig {
  name: string;
  icon: any;
  defaultRate: number;
  defaultTerm: number;
  description: string;
}

const NICHES: Record<LoanNiche, NicheConfig> = {
  personal: {
    name: "Empréstimo Pessoal",
    icon: User,
    defaultRate: 4.5,
    defaultTerm: 24,
    description: "Crédito rápido para suas necessidades imediatas."
  },
  vehicle: {
    name: "Financiamento Veicular",
    icon: Car,
    defaultRate: 1.8,
    defaultTerm: 48,
    description: "Conquiste seu carro novo com taxas competitivas."
  },
  home: {
    name: "Crédito Imobiliário",
    icon: Home,
    defaultRate: 0.9,
    defaultTerm: 360,
    description: "Realize o sonho da casa própria com prazos estendidos."
  },
  business: {
    name: "Capital de Giro",
    icon: Briefcase,
    defaultRate: 2.5,
    defaultTerm: 36,
    description: "Impulsione sua empresa com crédito estratégico."
  }
};

const themeConfigs: Record<LoanTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
}> = {
  classic: {
    name: "Financeiro",
    bg: "bg-[#0A0A0A]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-white text-black",
    text: "text-slate-400"
  },
  cyber: {
    name: "Futuro/Tech",
    bg: "bg-[#020202]",
    border: "border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
    accent: "text-cyan-400",
    card: "bg-cyan-500/5",
    button: "bg-cyan-500 text-black shadow-cyan-500/20",
    text: "text-cyan-500/40"
  },
  fun: {
    name: "Criativo",
    bg: "bg-purple-600",
    border: "border-black/20",
    accent: "text-black",
    card: "bg-white",
    button: "bg-black text-white",
    text: "text-black/60"
  },
  minimal: {
    name: "Design/Zen",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm",
    button: "bg-slate-900 text-white",
    text: "text-slate-500"
  }
};

export default function LoanCalculatorTool() {
  const [amount, setAmount] = useState<number>(50000);
  const [rate, setRate] = useState<number>(1.5);
  const [months, setMonths] = useState<number>(36);
  const [niche, setNiche] = useState<LoanNiche>("personal");
  const [theme, setTheme] = useState<LoanTheme>("classic");

  const results = useMemo(() => {
    const r = rate / 100;
    // PMT Formula: P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
    const pmt = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const totalPayment = pmt * months;
    const totalInterest = totalPayment - amount;
    
    return {
      monthly: isFinite(pmt) ? pmt : 0,
      total: isFinite(totalPayment) ? totalPayment : 0,
      interest: isFinite(totalInterest) ? totalInterest : 0,
      interestRatio: (totalInterest / totalPayment) * 100
    };
  }, [amount, rate, months]);

  const applyNiche = (key: LoanNiche) => {
    setNiche(key);
    setRate(NICHES[key].defaultRate);
    setMonths(NICHES[key].defaultTerm);
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
          Cálculos Financeiros & SEO
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Calculadora de Parcelas Prime</h2>
        <p className="mt-4 text-slate-400">Simule empréstimos e financiamentos em segundos. Compare taxas, analise o custo total e planeje sua liberdade financeira com precisão matemática.</p>
      </div>

      {/* Theme Bar */}
      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as LoanTheme[]).map((t) => (
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
        {/* Input Controls */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl relative overflow-hidden group`}>
              
              {/* Niche Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                 {(Object.keys(NICHES) as LoanNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => applyNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
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
              <div className="space-y-10">
                 {/* Amount */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Valor do Empréstimo</span>
                       </div>
                       <span className={`text-2xl font-black ${currentTheme.accent}`}>{formatCurrency(amount)}</span>
                    </div>
                    <input 
                      type="range"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-10">
                    {/* Rate */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <Percent className="h-4 w-4 text-indigo-500" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Taxa Mensal</span>
                          </div>
                          <span className={`text-xl font-black ${currentTheme.accent}`}>{rate}%</span>
                       </div>
                       <input 
                         type="range"
                         min="0.1"
                         max="15"
                         step="0.1"
                         value={rate}
                         onChange={(e) => setRate(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                       />
                    </div>

                    {/* Months */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <Calendar className="h-4 w-4 text-rose-500" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Prazo (Meses)</span>
                          </div>
                          <span className={`text-xl font-black ${currentTheme.accent}`}>{months} meses</span>
                       </div>
                       <input 
                         type="range"
                         min="6"
                         max="420"
                         step="6"
                         value={months}
                         onChange={(e) => setMonths(Number(e.target.value))}
                         className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${currentTheme.bg === 'bg-purple-600' ? 'bg-white' : 'bg-[#0A0A0A]'} ${currentTheme.border} space-y-8 relative overflow-hidden flex flex-col`}>
              
              <div className="space-y-1">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sua Parcela Mensal</h3>
                 <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-black tracking-tighter ${theme === 'fun' ? 'text-black' : 'text-white'}`}>
                      {formatCurrency(results.monthly)}
                    </span>
                 </div>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total de Juros</span>
                       <p className={`text-lg font-black ${theme === 'fun' ? 'text-black' : 'text-white'}`}>{formatCurrency(results.interest)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total a Pagar</span>
                       <p className={`text-lg font-black ${theme === 'fun' ? 'text-black' : 'text-white'}`}>{formatCurrency(results.total)}</p>
                    </div>
                 </div>

                 {/* Visual breakdown */}
                 <div className="space-y-3">
                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                       <span>Composição do Pagamento</span>
                       <span>{Math.round(results.interestRatio)}% Juros</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-2xl flex overflow-hidden border border-white/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${100 - results.interestRatio}%` }}
                         className="h-full bg-emerald-500"
                       />
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${results.interestRatio}%` }}
                         className="h-full bg-rose-500"
                       />
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-black text-slate-400 uppercase">Principal</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-rose-500" />
                          <span className="text-[8px] font-black text-slate-400 uppercase">Juros</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* CTA / Safety Card */}
              <div className="mt-4 p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                 <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Cálculo Certificado</span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                   Os valores simulares utilizam o regime de juros compostos. Taxas bancárias e IOF podem alterar o valor final do seu contrato.
                 </p>
              </div>
           </div>

           {/* Info Cards */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-3">
                 <Target className="h-5 w-5 text-indigo-500" />
                 <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">CET Transparente</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Veja exatamente quanto custa o seu dinheiro.</p>
                 </div>
              </div>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-3">
                 <Zap className="h-5 w-5 text-amber-500" />
                 <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Planejamento</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Crie estratégias de amortização potentes.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
