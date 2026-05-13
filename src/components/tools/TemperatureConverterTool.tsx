import React, { useState, useMemo } from "react";
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Info, 
  ArrowRightLeft,
  Zap,
  Activity,
  Flame,
  Snowflake,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const InputField = ({ label, value, onChange, icon: Icon, type = "number", unit }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-orange-500">
        <Icon className="h-5 w-5" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 px-14 outline-none focus:border-orange-500 transition-all font-black text-xl text-white tracking-tighter"
        placeholder="0"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase tracking-widest">{unit}</span>
      )}
    </div>
  </div>
);

export default function TemperatureConverterTool() {
  const [temp, setTemp] = useState("25");
  const [fromUnit, setFromUnit] = useState<"C" | "F" | "K" | "R" | "Re">("C");
  const [toUnit, setToUnit] = useState<"C" | "F" | "K" | "R" | "Re">("F");
  const [humidity, setHumidity] = useState("50");
  const [windSpeed, setWindSpeed] = useState("0");

  const results = useMemo(() => {
    const val = parseFloat(temp);
    if (isNaN(val)) return null;

    // Convert to Celsius first
    let c = 0;
    if (fromUnit === "C") c = val;
    else if (fromUnit === "F") c = (val - 32) * 5/9;
    else if (fromUnit === "K") c = val - 273.15;
    else if (fromUnit === "R") c = (val - 491.67) * 5/9;
    else if (fromUnit === "Re") c = val * 1.25;

    // Convert back to all
    const f = (c * 9/5) + 32;
    const k = c + 273.15;
    const r = (c + 273.15) * 9/5;
    const re = c * 0.8;

    // Target Conversion
    let finalTo = 0;
    if (toUnit === "C") finalTo = c;
    else if (toUnit === "F") finalTo = f;
    else if (toUnit === "K") finalTo = k;
    else if (toUnit === "R") finalTo = r;
    else if (toUnit === "Re") finalTo = re;

    // Apparent Temp (Simplified Heat Index and Wind Chill)
    let apparent = c;
    const h = parseFloat(humidity) || 0;
    const w = parseFloat(windSpeed) || 0;

    if (c >= 27 && h > 40) {
      // Heat Index (simplified)
      apparent = -8.78469475556 + (1.61139411 * c) + (2.33854883889 * h) + (-0.14611605 * c * h) + (-0.012308094 * c * c) + (-0.0164248277778 * h * h) + (0.002211732 * c * c * h) + (0.00072546 * c * h * h) + (-0.000003582 * c * c * h * h);
    } else if (c <= 10 && w > 4.8) {
      // Wind Chill
      apparent = 13.12 + (0.6215 * c) - (11.37 * Math.pow(w, 0.16)) + (0.3965 * c * Math.pow(w, 0.16));
    }

    // Status
    let status = "Agradável";
    let color = "text-emerald-400";
    let icon = <Activity className="h-6 w-6" />;
    let bg = "bg-emerald-500/10";

    if (c <= 0) { 
        status = "Congelante"; color = "text-blue-400"; icon = <Snowflake className="h-6 w-6" />; bg = "bg-blue-500/10";
    } else if (c < 18) { 
        status = "Frio"; color = "text-sky-400"; icon = <Snowflake className="h-4 w-4" />; bg = "bg-sky-500/10";
    } else if (c > 37.5) { 
        status = "Febre / Muito Quente"; color = "text-rose-500"; icon = <Flame className="h-6 w-6" />; bg = "bg-rose-500/10";
    } else if (c >= 30) { 
        status = "Quente"; color = "text-orange-400"; icon = <Flame className="h-4 w-4" />; bg = "bg-orange-500/10";
    }

    return { c, f, k, r, re, apparent, finalTo, status, color, icon, bg };
  }, [temp, fromUnit, toUnit, humidity, windSpeed]);

  const units = [
    { id: "C", label: "Celsius (°C)" },
    { id: "F", label: "Fahrenheit (°F)" },
    { id: "K", label: "Kelvin (K)" },
    { id: "R", label: "Rankine (°R)" },
    { id: "Re", label: "Réaumur (°Re)" },
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-orange-500/10 text-orange-400 text-[10px] font-black tracking-widest rounded border border-orange-500/20 uppercase mb-4">
          Conversores & Saúde
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Calculadora de Temperatura</h2>
        <p className="mt-4 text-slate-400">Converta escalas termométricas e calcule a sensação térmica real baseada em umidade e vento.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <InputField 
              label="Temperatura" 
              value={temp} 
              onChange={setTemp} 
              icon={Thermometer} 
              type="text"
            />
            
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">De</label>
                    <select 
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value as any)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-sm focus:border-orange-500 outline-none appearance-none cursor-pointer"
                    >
                        {units.map(u => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                        ))}
                    </select>
                </div>

                <div className="p-4 text-orange-500 mb-0.5">
                    <ArrowRightLeft className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Para</label>
                    <select 
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value as any)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-sm focus:border-orange-500 outline-none appearance-none cursor-pointer"
                    >
                        {units.map(u => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fatores de Sensação Térmica</h4>
                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="Umidade" 
                      value={humidity} 
                      onChange={setHumidity} 
                      icon={Droplets} 
                      type="number"
                      unit="%"
                    />
                    <InputField 
                      label="Vento" 
                      value={windSpeed} 
                      onChange={setWindSpeed} 
                      icon={Wind} 
                      type="number"
                      unit="km/h"
                    />
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-3">
                <div className="flex items-center gap-2 text-orange-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Escalas Médicas</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    A temperatura retal ou axilar usa a escala Celsius no Brasil. Febre é geralmente considerada acima de 37.5°C.
                </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          {results ? (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
            >
               <div className={`bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group transition-all duration-500`}>
                  <div className={`absolute top-0 right-0 p-8 opacity-[0.03] transition-all duration-500`}>
                     <Thermometer className="h-64 w-64" />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 font-mono">Resultado da Conversão</span>
                            <div className={`text-8xl font-black ${results.color} tracking-tighter`}>
                                {results.finalTo.toFixed(1)}<span className="text-3xl ml-3">°{toUnit}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Sensação Térmica:</span>
                                <span className={`text-sm font-black ${results.color}`}>
                                    {fromUnit === "C" ? results.apparent.toFixed(1) : ((results.apparent * 9/5) + 32).toFixed(1)}°{fromUnit === "C" ? "C" : "F"}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${results.bg} border border-white/5 font-black uppercase tracking-tight ${results.color}`}>
                                {results.icon}
                                {results.status}
                            </span>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Fahrenheit</span>
                            <div className="text-xl font-black text-white">{results.f.toFixed(1)}°F</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Kelvin</span>
                            <div className="text-xl font-black text-white">{results.k.toFixed(1)}K</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Rankine</span>
                            <div className="text-xl font-black text-white">{results.r.toFixed(1)}°R</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Réaumur</span>
                            <div className="text-xl font-black text-white">{results.re.toFixed(1)}°Re</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Escala Base</span>
                            <div className="text-md font-black text-white">Equivalente a {results.c.toFixed(1)}°C</div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-800" />
                 </div>
                 <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Impacto Térmico</span>
                            <div className="text-md font-black text-white">Delta: {(results.apparent - results.c).toFixed(1)}°C</div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-800" />
                 </div>
               </div>

               {/* Reference Points */}
               <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Pontos de Referência (Celsius)</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Zero Absoluto", val: -273.15, desc: "Frio impossível" },
                      { label: "Congelamento da Água", val: 0, desc: "Formação de gelo" },
                      { label: "Temperatura Corporal Média", val: 36.6, desc: "Saúde ideal" },
                      { label: "Ponto de Ebulição", val: 100, desc: "Água ferve" },
                    ].map(ref => (
                      <div key={ref.label} className="flex justify-between items-center group/item">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white uppercase">{ref.label}</span>
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{ref.desc}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${ref.val > 30 ? "bg-rose-500" : "bg-blue-500"}`} 
                                    style={{ width: `${Math.min(100, Math.abs(results.c / ref.val) * 100)}%` }}
                                />
                            </div>
                            <span className="text-xs font-black text-slate-400 min-w-[50px] text-right">{ref.val}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Thermometer className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Insira os Dados</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Digite uma temperatura para ver as conversões e sensação térmica.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
