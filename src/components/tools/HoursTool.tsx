import React, { useState } from "react";
import { motion } from "motion/react";

export default function HoursTool() {
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("18:00");
  const [breakTime, setBreakTime] = useState("01:00");
  const [hourlyRate, setHourlyRate] = useState(0);

  const calculateTotalMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const startMin = calculateTotalMinutes(start);
  const endMin = calculateTotalMinutes(end);
  const breakMin = calculateTotalMinutes(breakTime);

  let diff = endMin - startMin - breakMin;
  if (diff < 0) diff = 0;

  const totalHours = Math.floor(diff / 60);
  const totalMinutes = diff % 60;
  const earnings = (diff / 60) * hourlyRate;

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Produtividade Profissional
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Calculadora de Horas</h2>
        <p className="mt-4 text-slate-400">Calcule sua jornada de trabalho diária e estime seus ganhos de forma simples.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Início</label>
              <input 
                type="time" 
                value={start} 
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fim</label>
              <input 
                type="time" 
                value={end} 
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Intervalo (Horas:Minutos)</label>
            <input 
              type="time" 
              value={breakTime} 
              onChange={(e) => setBreakTime(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Valor da Hora (Opcional - R$)</label>
            <input 
              type="number" 
              value={hourlyRate || ""} 
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              placeholder="Ex: 50.00"
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-3xl bg-emerald-500 p-8 text-center text-black shadow-lg shadow-emerald-500/20">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Trabalhado</span>
            <div className="mt-2 text-5xl font-black tracking-tighter">
              {totalHours}h {totalMinutes}m
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-50">Líquido (Sem intervalo)</p>
          </div>
          
          {hourlyRate > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-3xl bg-white p-8 text-center text-black shadow-xl"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ganhos Estimados</span>
              <div className="mt-2 text-5xl font-black tracking-tighter">
                R$ {earnings.toFixed(2)}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
