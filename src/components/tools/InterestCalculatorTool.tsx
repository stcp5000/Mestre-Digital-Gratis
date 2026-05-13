import React, { useState, useMemo } from "react";
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  Percent, 
  PlusCircle, 
  ArrowRight, 
  Info,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from "recharts";

type InterestType = "simple" | "compound";
type PeriodType = "monthly" | "yearly";

const InputField = ({ label, value, onChange, icon: Icon, prefix }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-emerald-500">
        <Icon className="h-4 w-4" />
      </div>
      {prefix && <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700">{prefix}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9,.]/g, ""))}
        className={`w-full bg-[#0A0A0A] border border-white/5 rounded-xl py-3 pr-4 outline-none focus:border-emerald-500 transition-all font-bold text-white ${prefix ? "pl-16" : "pl-11"}`}
      />
    </div>
  </div>
);

export default function InterestCalculatorTool() {
  const [type, setType] = useState<InterestType>("compound");
  const [capital, setCapital] = useState("1000");
  const [contribution, setContribution] = useState("100");
  const [rate, setRate] = useState("1");
  const [ratePeriod, setRatePeriod] = useState<PeriodType>("monthly");
  const [time, setTime] = useState("12");
  const [timePeriod, setTimePeriod] = useState<PeriodType>("monthly");

  const results = useMemo(() => {
    const P = parseFloat(capital.replace(",", ".")) || 0;
    const PMT = parseFloat(contribution.replace(",", ".")) || 0;
    const rInput = parseFloat(rate.replace(",", ".")) || 0;
    const tInput = parseFloat(time.replace(",", ".")) || 0;

    if (P <= 0 && PMT <= 0) return null;

    // Normalize rate and time
    const monthlyRate = ratePeriod === "yearly" ? Math.pow(1 + rInput / 100, 1 / 12) - 1 : rInput / 100;
    const totalMonths = timePeriod === "yearly" ? tInput * 12 : tInput;

    if (totalMonths <= 0) return null;

    const data = [];
    let currentTotal = P;
    let totalInvested = P;
    let totalInterest = 0;

    for (let i = 0; i <= totalMonths; i++) {
      if (i > 0) {
        if (type === "simple") {
          // Simple interest: I = P * r * t
          // Usually simple interest doesn't include monthly contributions in standard definitions,
          // but we'll stick to a standard P(1 + rt) + PMT*t
          const interestThisMonth = P * monthlyRate;
          currentTotal += interestThisMonth + PMT;
          totalInvested += PMT;
          totalInterest += interestThisMonth;
        } else {
          // Compound interest: A = P(1+r)^t + PMT * [((1+r)^t - 1) / r]
          const interestThisMonth = currentTotal * monthlyRate;
          currentTotal += interestThisMonth + PMT;
          totalInvested += PMT;
          totalInterest += interestThisMonth;
        }
      }

      // Add only every N months to chart if period is long to avoid clutter
      if (totalMonths <= 24 || i % Math.ceil(totalMonths / 12) === 0 || i === totalMonths) {
        data.push({
          month: i,
          total: parseFloat(currentTotal.toFixed(2)),
          invested: parseFloat(totalInvested.toFixed(2)),
          interest: parseFloat(totalInterest.toFixed(2)),
        });
      }
    }

    return {
      finalTotal: currentTotal,
      totalInvested,
      totalInterest,
      chartData: data,
    };
  }, [type, capital, contribution, rate, ratePeriod, time, timePeriod]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Cálculos Financeiros
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Simulador de Juros</h2>
        <p className="mt-4 text-slate-400">Calcule o crescimento do seu dinheiro ao longo do tempo. Compare juros simples e compostos e visualize a curva de juros.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-1 bg-[#0A0A0A] border border-white/5 rounded-xl grid grid-cols-2 gap-1 font-black text-[10px] tracking-widest uppercase mb-4">
            <button
              onClick={() => setType("compound")}
              className={`py-3 rounded-lg transition-all ${type === "compound" ? "bg-white text-black shadow-lg" : "text-slate-500"}`}
            >
              Compostos
            </button>
            <button
              onClick={() => setType("simple")}
              className={`py-3 rounded-lg transition-all ${type === "simple" ? "bg-white text-black shadow-lg" : "text-slate-500"}`}
            >
              Simples
            </button>
          </div>

          <div className="grid gap-4 bg-[#0A0A0A]/50 p-6 rounded-2xl border border-white/5">
            <InputField label="Aporte Inicial" value={capital} onChange={setCapital} icon={Wallet} prefix="R$" />
            <InputField label="Aporte Mensal" value={contribution} onChange={setContribution} icon={PlusCircle} prefix="R$" />
            
            <div className="grid grid-cols-2 gap-3 items-end">
              <InputField label="Taxa de Juros" value={rate} onChange={setRate} icon={Percent} />
              <select 
                value={ratePeriod}
                onChange={(e) => setRatePeriod(e.target.value as any)}
                className="bg-[#0A0A0A] border border-white/5 rounded-xl py-3 px-3 outline-none focus:border-emerald-500 text-emerald-400 text-[10px] font-black uppercase tracking-widest cursor-pointer mb-[2px]"
              >
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <InputField label="Período" value={time} onChange={setTime} icon={Calendar} />
              <select 
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as any)}
                className="bg-[#0A0A0A] border border-white/5 rounded-xl py-3 px-3 outline-none focus:border-emerald-500 text-emerald-400 text-[10px] font-black uppercase tracking-widest cursor-pointer mb-[2px]"
              >
                <option value="monthly">Meses</option>
                <option value="yearly">Anos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results & Chart */}
        <div className="lg:col-span-8 space-y-6">
          {results && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Total Acumulado</span>
                  <div className="text-2xl font-black text-emerald-500 tracking-tight">{formatCurrency(results.finalTotal)}</div>
                </div>
                <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Total Investido</span>
                  <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(results.totalInvested)}</div>
                </div>
                <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Total em Juros</span>
                  <div className="text-2xl font-black text-emerald-300 tracking-tight">{formatCurrency(results.totalInterest)}</div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Crescimento do Patrimônio</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Evolução do valor investido vs. juros acumulados</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#475569' }}
                        label={{ value: timePeriod === "yearly" ? "Anos" : "Meses", position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                      />
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#475569' }}
                        tickFormatter={(val) => `R$ ${val / 1000}k`}
                      />
                      <Tooltip 
                        cursor={{ fill: '#ffffff05' }}
                        contentStyle={{ 
                          backgroundColor: '#050505', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                        formatter={(value: number) => [formatCurrency(value), ""]}
                      />
                      <Legend 
                        verticalAlign="top" 
                        align="right" 
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }}
                      />
                      <Bar dataKey="invested" name="Investido" stackId="a" fill="#334155" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="interest" name="Juros" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg h-fit">
                  <Info className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Dica Financeira</h5>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                    O tempo é o maior aliado dos juros compostos. Quanto mais cedo você começa a investir, menos esforço próprio é necessário para atingir seus objetivos financeiros.
                  </p>
                </div>
              </div>
            </>
          )}

          {!results && (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Aguardando Dados</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Insira os valores ao lado para visualizar a projeção do seu investimento.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
