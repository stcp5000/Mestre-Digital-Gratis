import React, { useState } from "react";
import { motion } from "motion/react";

export default function CalculatorTool() {
  const [calcType, setCalcType] = useState<"roi" | "cpc">("roi");

  return (
    <div className="space-y-10">
      <div>
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Financeiro e Performance
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Calculadoras Digitais</h2>
        <div className="mt-8 flex border-b border-white/5">
          <button 
            onClick={() => setCalcType("roi")}
            className={`border-b-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${calcType === "roi" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-500"}`}
          >
            ROI
          </button>
          <button 
            onClick={() => setCalcType("cpc")}
            className={`border-b-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${calcType === "cpc" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-500"}`}
          >
            CPC
          </button>
        </div>
      </div>

      <div className="max-w-xl">
        {calcType === "roi" ? <ROICalculator /> : <CPCCalculator />}
      </div>
    </div>
  );
}

function ROICalculator() {
  const [investment, setInvestment] = useState(1000);
  const [revenue, setRevenue] = useState(2500);

  const roi = ((revenue - investment) / investment) * 100;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Investimento (R$)</label>
          <input 
            type="number" 
            value={investment} 
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-cyan-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Receita (R$)</label>
          <input 
            type="number" 
            value={revenue} 
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-cyan-500 outline-none"
          />
        </div>
      </div>
      <div className="rounded-3xl bg-cyan-500 p-10 text-center shadow-xl shadow-cyan-500/20">
        <span className="text-[10px] font-black text-black/50 uppercase tracking-widest">Retorno sobre Investimento</span>
        <div className="mt-2 text-6xl font-black text-black tracking-tighter">{roi.toFixed(2)}%</div>
      </div>
    </div>
  );
}

function CPCCalculator() {
  const [cost, setCost] = useState(500);
  const [clicks, setClicks] = useState(250);

  const cpc = cost / clicks;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Custo Total (R$)</label>
          <input 
            type="number" 
            value={cost} 
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-cyan-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Nº de Cliques</label>
          <input 
            type="number" 
            value={clicks} 
            onChange={(e) => setClicks(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-cyan-500 outline-none"
          />
        </div>
      </div>
      <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">
        <span className="text-[10px] font-black text-black/50 uppercase tracking-widest">Custo por Clique</span>
        <div className="mt-2 text-6xl font-black text-black tracking-tighter">R$ {cpc.toFixed(2)}</div>
      </div>
    </div>
  );
}
