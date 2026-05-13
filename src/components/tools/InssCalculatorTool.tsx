import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  Table, 
  Info, 
  ArrowRight, 
  TrendingDown, 
  HelpCircle,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

export default function InssCalculatorTool() {
  const [salary, setSalary] = useState("3500");

  const INSS_TABLE = [
    { min: 0, max: 1412.00, rate: 0.075, label: "Ate R$ 1.412,00" },
    { min: 1412.01, max: 2666.68, rate: 0.09, label: "R$ 1.412,01 a R$ 2.666,68" },
    { min: 2666.69, max: 4000.03, rate: 0.12, label: "R$ 2.666,69 a R$ 4.000,03" },
    { min: 4000.04, max: 7786.02, rate: 0.14, label: "R$ 4.000,04 a R$ 7.786,02" },
  ];

  const results = useMemo(() => {
    const s = parseFloat(salary.replace(",", ".")) || 0;
    if (s <= 0) return null;

    let totalInss = 0;
    const breakdown = [];
    const cappedSalary = Math.min(s, 7786.02);

    for (const tier of INSS_TABLE) {
      if (cappedSalary > tier.min) {
        const taxableAmount = Math.min(cappedSalary, tier.max) - tier.min;
        const discount = taxableAmount * tier.rate;
        totalInss += discount;
        breakdown.push({
          label: tier.label,
          base: taxableAmount,
          rate: tier.rate * 100,
          discount: discount
        });
      }
    }

    const effectiveRate = (totalInss / s) * 100;

    return {
      totalInss,
      effectiveRate,
      breakdown,
      netAfterInss: s - totalInss,
      isCapped: s > 7786.02
    };
  }, [salary]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-widest rounded border border-blue-500/20 uppercase mb-4">
          Previdência Social
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Calculadora de INSS</h2>
        <p className="mt-4 text-slate-400">Cálculo detalhado da contribuição previdenciária com base na tabela progressiva de 2024.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">Salário Bruto Mensal</label>
             <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                    <Activity className="h-5 w-5" />
                </div>
                <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-700">R$</span>
                <input 
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value.replace(/[^0-9,.]/g, ""))}
                    className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-16 pr-4 text-2xl font-black text-white outline-none focus:border-blue-500 transition-all"
                    placeholder="0,00"
                />
             </div>

             <div className="mt-6 flex gap-3 p-4 rounded-xl bg-white/5">
                <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                    A contribuição é calculada sobre cada faixa salarial. O teto máximo de desconto em 2024 é de R$ 908,85.
                </p>
             </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 space-y-6">
            {results && (
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Desconto Total</span>
                                <div className="text-4xl font-black text-blue-400 tracking-tighter">
                                    {formatCurrency(results.totalInss)}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest">Alíquota Efetiva:</span>
                                <span className="text-xs font-black text-white">{results.effectiveRate.toFixed(2)}%</span>
                            </div>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-3xl">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-2">Salário pós-INSS</span>
                            <div className="text-4xl font-black text-white tracking-tighter mb-4">
                                {formatCurrency(results.netAfterInss)}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                <span>Cobertura Previdenciária Ativa</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Detalhamento por Faixa</h4>
                            <Table className="h-4 w-4 text-slate-700" />
                        </div>
                        <div className="divide-y divide-white/5">
                            {results.breakdown.map((row, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-tight">{row.label}</div>
                                        <div className="text-[9px] font-bold text-slate-600 uppercase">Base: {formatCurrency(row.base)} • Alíquota: {row.rate}%</div>
                                    </div>
                                    <div className="text-sm font-black text-white">{formatCurrency(row.discount)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {results.isCapped && (
                        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                            <HelpCircle className="h-5 w-5 text-amber-500 shrink-0" />
                            <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Teto Atingido</h5>
                                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                                    Seu salário excede o teto do INSS (R$ 7.786,02). O desconto é limitado ao valor máximo, não incidindo sobre a parcela excedente.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!results && (
                <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
                    <div className="max-w-xs space-y-4">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                            <TrendingDown className="h-8 w-8" />
                        </div>
                        <h3 className="text-white font-black uppercase text-sm tracking-widest">Cálculo Pendente</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Digite o valor do salário bruto para ver a progressão do desconto previdenciário.</p>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="pt-10 border-t border-white/5">
         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center text-slate-700 mb-10">Tabela de Referência 2024</h4>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {INSS_TABLE.map((tier, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/5 text-center">
                    <div className="text-2xl font-black text-white mb-1">{(tier.rate * 100).toFixed(1)}%</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        {tier.label}
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
