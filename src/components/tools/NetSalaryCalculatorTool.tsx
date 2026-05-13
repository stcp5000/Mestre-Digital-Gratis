import React, { useState, useMemo } from "react";
import { 
  Banknote, 
  Users, 
  MinusCircle, 
  PlusCircle, 
  ArrowRight, 
  Info,
  ChevronDown,
  ChevronUp,
  CreditCard,
  PieChart as PieChartIcon
} from "lucide-react";
import { motion } from "motion/react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";

const InputField = ({ label, value, onChange, icon: Icon, prefix, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-emerald-500">
        <Icon className="h-4 w-4" />
      </div>
      {prefix && <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#0A0A0A] border border-white/5 rounded-xl py-4 pr-4 outline-none focus:border-emerald-500 transition-all font-bold text-lg text-white ${prefix ? "pl-16" : "pl-11"}`}
      />
    </div>
  </div>
);

export default function NetSalaryCalculatorTool() {
  const [grossSalary, setGrossSalary] = useState("3500");
  const [dependents, setDependents] = useState("0");
  const [otherDeductions, setOtherDeductions] = useState("0");
  const [showDetails, setShowDetails] = useState(false);

  const calculations = useMemo(() => {
    const gross = parseFloat(grossSalary.replace(",", ".")) || 0;
    const depCount = parseInt(dependents) || 0;
    const other = parseFloat(otherDeductions.replace(",", ".")) || 0;

    if (gross <= 0) return null;

    // INSS 2024
    let inss = 0;
    const inssTiers = [
      { max: 1412, rate: 0.075 },
      { max: 2666.68, rate: 0.09 },
      { max: 4000.03, rate: 0.12 },
      { max: 7786.02, rate: 0.14 },
    ];

    let remainingInss = gross > 7786.02 ? 7786.02 : gross;
    let prevMax = 0;

    for (const tier of inssTiers) {
      if (remainingInss > prevMax) {
        const taxableInTier = Math.min(remainingInss, tier.max) - prevMax;
        inss += taxableInTier * tier.rate;
        prevMax = tier.max;
      }
    }

    // IRRF 2024
    const dependentDeduction = depCount * 189.59;
    const baseIRRF = gross - inss - dependentDeduction;
    
    // Logic for Simplified standard discount vs Progressive Deduction
    // Progressive table IRRF
    let irrfProgressive = 0;
    if (baseIRRF > 2259.20) {
      if (baseIRRF <= 2826.65) irrfProgressive = baseIRRF * 0.075 - 169.44;
      else if (baseIRRF <= 3751.05) irrfProgressive = baseIRRF * 0.15 - 381.44;
      else if (baseIRRF <= 4664.68) irrfProgressive = baseIRRF * 0.225 - 662.77;
      else irrfProgressive = baseIRRF * 0.275 - 896.00;
    }
    irrfProgressive = Math.max(0, irrfProgressive);

    // Simplified discount logic (R$ 564,80 discount on base instead of dependencies/inss)
    // Actually the logic is: base = gross - 564.80
    const baseSimplified = gross - 564.80;
    let irrfSimplified = 0;
    if (baseSimplified > 2259.20) {
        if (baseSimplified <= 2826.65) irrfSimplified = baseSimplified * 0.075 - 169.44;
        else if (baseSimplified <= 3751.05) irrfSimplified = baseSimplified * 0.15 - 381.44;
        else if (baseSimplified <= 4664.68) irrfSimplified = baseSimplified * 0.225 - 662.77;
        else irrfSimplified = baseSimplified * 0.275 - 896.00;
    }
    irrfSimplified = Math.max(0, irrfSimplified);

    // The law allows choosing the most favorable
    const irrf = Math.min(irrfProgressive, irrfSimplified);
    const netSalary = gross - inss - irrf - other;

    const chartData = [
      { name: "Salário Líquido", value: netSalary, color: "#10b981" },
      { name: "INSS", value: inss, color: "#f59e0b" },
      { name: "IRRF", value: irrf, color: "#ef4444" },
      { name: "Outros", value: other, color: "#64748b" },
    ].filter(item => item.value > 0);

    return {
      gross,
      inss,
      irrf,
      other,
      netSalary,
      percentage: (netSalary / gross) * 100,
      chartData
    };
  }, [grossSalary, dependents, otherDeductions]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Cálculos Financeiros
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Calculadora de Salário Líquido</h2>
        <p className="mt-4 text-slate-400">Descubra quanto você realmente recebe após os descontos obrigatórios de INSS e IRRF (Tabelas 2024/2025).</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="grid gap-4 bg-[#0A0A0A]/50 p-6 rounded-3xl border border-white/5 shadow-xl">
            <InputField 
                label="Salário Bruto" 
                value={grossSalary} 
                onChange={(v: string) => setGrossSalary(v.replace(/[^0-9,.]/g, ""))} 
                icon={Banknote} 
                prefix="R$" 
            />
            
            <div className="grid grid-cols-2 gap-4">
                <InputField 
                    label="Dependentes" 
                    value={dependents} 
                    onChange={(v: string) => setDependents(v.replace(/\D/g, ""))} 
                    icon={Users} 
                    type="number"
                />
                <InputField 
                    label="Outros Descontos" 
                    value={otherDeductions} 
                    onChange={(v: string) => setOtherDeductions(v.replace(/[^0-9,.]/g, ""))} 
                    icon={MinusCircle} 
                    prefix="R$" 
                />
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                    A calculadora utiliza as tabelas progressivas vigentes em 2024 e considera o desconto simplificado do IRRF se for mais vantajoso.
                </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          {calculations && (
            <div className="grid gap-6">
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <PieChartIcon className="h-48 w-48" />
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Salário Líquido Final</span>
                        <div className="text-5xl font-black text-emerald-500 tracking-tighter mb-1">
                            {formatCurrency(calculations.netSalary)}
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500" 
                                    style={{ width: `${calculations.percentage}%` }}
                                />
                             </div>
                             <span className="text-[10px] font-black text-emerald-400">{calculations.percentage.toFixed(1)}% do Bruto</span>
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Inss</span>
                                <span className="text-amber-500 font-black">{formatCurrency(calculations.inss)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Irrf</span>
                                <span className="text-red-500 font-black">{formatCurrency(calculations.irrf)}</span>
                            </div>
                            {calculations.other > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Outros</span>
                                    <span className="text-slate-300 font-black">{formatCurrency(calculations.other)}</span>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => setShowDetails(!showDetails)}
                            className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
                        >
                            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            {showDetails ? "Ocultar Detalhes" : "Ver Detalhamento"}
                        </button>
                    </div>

                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={calculations.chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {calculations.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#05192d', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {showDetails && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-8 pt-8 border-t border-white/5 space-y-4 overflow-hidden"
                    >
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-4">Demonstrativo de Cálculos</h4>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Subtotal (Bruto - INSS)</span>
                                <span className="text-sm font-black text-white">{formatCurrency(calculations.gross - calculations.inss)}</span>
                            </div>
                            <div className="p-4 rounded-xl border border-white/5 space-y-2">
                                <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                                    Base de Cálculo IRRF (com dependentes): {formatCurrency(calculations.gross - calculations.inss - (parseInt(dependents) || 0) * 189.59)}
                                </p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                                    Base de Cálculo IRRF (simplificada): {formatCurrency(calculations.gross - 564.80)}
                                </p>
                            </div>
                         </div>
                    </motion.div>
                 )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                 <div className="p-6 rounded-2xl border border-white/5 bg-[#0A0A0A] flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Anual (13º)</span>
                        <div className="text-lg font-black text-white">{formatCurrency(calculations.netSalary * 13.33)}</div>
                    </div>
                 </div>
                 <div className="p-6 rounded-2xl border border-white/5 bg-[#0A0A0A] flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <PlusCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">FGTS Mensal (Est.)</span>
                        <div className="text-lg font-black text-white">{formatCurrency(calculations.gross * 0.08)}</div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {!calculations && (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Banknote className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Aguardando Valores</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Informe seu salário bruto ao lado para calcular o valor líquido.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
