import React, { useState } from "react";

export default function DatesTool() {
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);

  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Planejamento e Prazos
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Cálculo de Datas</h2>
        <p className="mt-4 text-slate-400 leading-relaxed">Calcule a diferença exata de dias entre duas datas para seus cronogramas.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Data Inicial</label>
            <input 
              type="date" 
              value={date1} 
              onChange={(e) => setDate1(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Data Final</label>
            <input 
              type="date" 
              value={date2} 
              onChange={(e) => setDate2(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl bg-emerald-500 p-10 text-center text-black shadow-xl">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Diferença Total</span>
          <div className="mt-2 text-7xl font-black tracking-tighter">{diffDays}</div>
          <p className="mt-2 font-bold uppercase tracking-widest">Dias</p>
        </div>
      </div>
    </div>
  );
}
