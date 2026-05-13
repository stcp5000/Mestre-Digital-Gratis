import React, { useState } from "react";

export default function UnitTool() {
  const [val, setVal] = useState(1);
  const [type, setType] = useState<"km-mi" | "kg-lb" | "c-f" | "m-ft" | "l-gal">("km-mi");

  const convert = () => {
    if (type === "km-mi") return (val * 0.621371).toFixed(2) + " mi";
    if (type === "kg-lb") return (val * 2.20462).toFixed(2) + " lb";
    if (type === "c-f") return (val * 9/5 + 32).toFixed(2) + " °F";
    if (type === "m-ft") return (val * 3.28084).toFixed(2) + " ft";
    if (type === "l-gal") return (val * 0.264172).toFixed(2) + " gal";
    return "";
  };

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Utilidades Gerais
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Conversor Universal</h2>
        <p className="mt-4 text-slate-400 leading-relaxed">Converta rapidamente unidades de medida fundamentais para seus projetos e viagens.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tipo de Conversão</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none appearance-none cursor-pointer"
            >
              <option value="km-mi">Kilômetros p/ Milhas</option>
              <option value="kg-lb">Quilos p/ Libras</option>
              <option value="c-f">Celsius p/ Fahrenheit</option>
              <option value="m-ft">Metros p/ Pés</option>
              <option value="l-gal">Litros p/ Galões</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Valor de Entrada</label>
            <input 
              type="number" 
              value={val} 
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center text-black shadow-xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resultado</span>
          <div className="mt-2 text-6xl font-black tracking-tighter">{convert()}</div>
        </div>
      </div>
    </div>
  );
}
