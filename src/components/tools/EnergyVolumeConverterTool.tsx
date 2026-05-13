import React, { useState, useMemo } from "react";
import { 
  Zap, 
  Droplets, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Info, 
  Battery, 
  Flame, 
  FlaskConical, 
  Box, 
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Mode = "energy" | "volume";

interface Unit {
  id: string;
  label: string;
  factor: number; // Multiplier to reach the base unit (Energy: Joule, Volume: Liter)
}

const ENERGY_UNITS: Unit[] = [
  { id: "J", label: "Joule (J)", factor: 1 },
  { id: "kJ", label: "Kilojoule (kJ)", factor: 1000 },
  { id: "cal", label: "Caloria (cal)", factor: 4.184 },
  { id: "kcal", label: "Quilocaloria (kcal)", factor: 4184 },
  { id: "Wh", label: "Watt-hora (Wh)", factor: 3600 },
  { id: "kWh", label: "Kilowatt-hora (kWh)", factor: 3600000 },
  { id: "eV", label: "Elétron-volt (eV)", factor: 1.60218e-19 },
  { id: "BTU", label: "BTU", factor: 1055.06 },
  { id: "ft-lb", label: "Foot-pound (ft⋅lb)", factor: 1.35582 },
];

const VOLUME_UNITS: Unit[] = [
  { id: "ml", label: "Mililitro (ml)", factor: 0.001 },
  { id: "l", label: "Litro (l)", factor: 1 },
  { id: "m3", label: "Metro Cúbico (m³)", factor: 1000 },
  { id: "cup", label: "Xícara (br)", factor: 0.24 },
  { id: "tbsp", label: "Colher de Sopa (15ml)", factor: 0.015 },
  { id: "tsp", label: "Colher de Chá (5ml)", factor: 0.005 },
  { id: "fl-oz", label: "Onça Fluida (fl oz)", factor: 0.0295735 },
  { id: "gal", label: "Galão (EUA)", factor: 3.78541 },
  { id: "pt", label: "Pinto (US Liquid Pint)", factor: 0.473176 },
];

const InputField = ({ label, value, onChange, icon: Icon, type = "number", placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-cyan-500">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 ${Icon ? 'px-14' : 'px-6'} outline-none focus:border-cyan-500 transition-all font-black text-xl text-white tracking-tighter`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default function EnergyVolumeConverterTool() {
  const [mode, setMode] = useState<Mode>("energy");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("kWh");
  const [toUnit, setToUnit] = useState("kcal");
  const [copied, setCopied] = useState(false);

  const units = mode === "energy" ? ENERGY_UNITS : VOLUME_UNITS;

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return 0;

    const from = units.find(u => u.id === fromUnit);
    const to = units.find(u => u.id === toUnit);

    if (!from || !to) return 0;

    // Convert to base, then to target
    const baseVal = val * from.factor;
    return baseVal / to.factor;
  }, [inputValue, fromUnit, toUnit, units]);

  const handleModeChange = (m: Mode) => {
    setMode(m);
    if (m === "energy") {
      setFromUnit("kWh");
      setToUnit("kcal");
    } else {
      setFromUnit("l");
      setToUnit("ml");
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapUnits = () => {
    const tempFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempFrom);
  };

  const formatResult = (res: number) => {
    if (res === 0) return "0";
    if (Math.abs(res) < 0.00001) return res.toExponential(4);
    return res.toLocaleString('pt-BR', { maximumFractionDigits: 6 });
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-black tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Física & Utilidades
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Energia & Volume</h2>
        <p className="mt-4 text-slate-400">Conversor técnico para unidades de energia (J, cal, kWh) e volume (L, m³, galões, xícaras).</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <button 
          onClick={() => handleModeChange("energy")}
          className={`p-6 rounded-3xl border flex items-center gap-4 transition-all ${
            mode === "energy" 
            ? "bg-cyan-500/10 border-cyan-500/20 text-white" 
            : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
          }`}
        >
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${mode === "energy" ? "bg-cyan-500 text-black" : "bg-white/5"}`}>
            <Zap className="h-6 w-6" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black uppercase tracking-widest">Categoria</div>
            <div className="text-lg font-black uppercase tracking-tighter">Energia</div>
          </div>
        </button>

        <button 
          onClick={() => handleModeChange("volume")}
          className={`p-6 rounded-3xl border flex items-center gap-4 transition-all ${
            mode === "volume" 
            ? "bg-indigo-500/10 border-indigo-500/20 text-white" 
            : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
          }`}
        >
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${mode === "volume" ? "bg-indigo-500 text-black" : "bg-white/5"}`}>
            <Droplets className="h-6 w-6" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black uppercase tracking-widest">Categoria</div>
            <div className="text-lg font-black uppercase tracking-tighter">Volume</div>
          </div>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Converter Area */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <InputField 
              label="Valor" 
              value={inputValue} 
              onChange={setInputValue} 
              icon={Search} 
              type="text"
            />

            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">De</label>
                    <select 
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-sm focus:border-cyan-500 outline-none appearance-none cursor-pointer"
                    >
                        {units.map(u => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                        ))}
                    </select>
                </div>

                <button 
                    onClick={swapUnits}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/20 text-cyan-500 transition-all mb-0.5"
                >
                    <ArrowRightLeft className="h-5 w-5" />
                </button>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Para</label>
                    <select 
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-sm focus:border-cyan-500 outline-none appearance-none cursor-pointer"
                    >
                        {units.map(u => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
               {units.slice(0, 6).map(u => (
                 <button 
                  key={u.id}
                  onClick={() => setFromUnit(u.id)}
                  className={`py-2 px-3 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${
                    fromUnit === u.id 
                    ? "bg-cyan-500/20 border-cyan-500/30 text-white" 
                    : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                  }`}
                 >
                   {u.id} QUICK
                 </button>
               ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex gap-6 items-center">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
               <Info className="h-6 w-6" />
            </div>
            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Informação Técnica</h4>
               <p className="text-slate-500 text-[10px] font-bold uppercase leading-relaxed">
                  {mode === "energy" 
                    ? "1 kWh é a energia usada por um aparelho de 1000W ligado por uma hora. Equivale a aproximadamente 860 kcal."
                    : "O volume de um metro cúbico (m³) comporta exatamente 1.000 litros de água."}
               </p>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="lg:col-span-12 xl:col-span-5">
           <div className={`h-full flex flex-col rounded-[2rem] p-10 text-black shadow-2xl relative overflow-hidden group transition-colors duration-700 ${mode === "energy" ? "bg-cyan-500" : "bg-indigo-400"}`}>
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                 {mode === "energy" ? <Battery className="h-48 w-48" /> : <FlaskConical className="h-48 w-48" />}
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 block">Resultado Equivalente</span>
                    <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold opacity-60 uppercase">{inputValue} {fromUnit} =</div>
                        <div className="text-5xl sm:text-6xl font-black tracking-tighter leading-none break-all">
                            {formatResult(result)}
                        </div>
                        <div className="text-xl font-bold uppercase tracking-tight opacity-80 mt-2">
                             {units.find(u => u.id === toUnit)?.label.split('(')[0].trim()}
                        </div>
                    </div>
                 </div>

                 <div className="mt-12 space-y-4">
                    <button 
                        onClick={copyResult}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black/90 active:scale-95 transition-all shadow-lg"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 text-emerald-400" />
                                Copiado com Sucesso
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                Copiar para Área de Transferência
                            </>
                        )}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
                        <div className="text-center">
                           <div className="text-[8px] font-black uppercase tracking-tighter opacity-40">Unidade Base</div>
                           <div className="text-xs font-black uppercase">{mode === "energy" ? "Joule" : "Litro"}</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[8px] font-black uppercase tracking-tighter opacity-40">Precisão</div>
                           <div className="text-xs font-black uppercase">Física Real</div>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Comparisons */}
      <div className="grid md:grid-cols-3 gap-6">
         <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl space-y-4 group hover:border-cyan-500/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
               <Flame className="h-5 w-5" />
            </div>
            <div>
               <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Curiosidade Química</h5>
               <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                  Uma caloria (cal) é a energia necessária para elevar a temperatura de 1g de água em 1°C.
               </p>
            </div>
         </div>
         <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl space-y-4 group hover:border-cyan-500/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
               <Droplets className="h-5 w-5" />
            </div>
            <div>
               <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Volume Culinário</h5>
               <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                  Uma xícara padrão no Brasil equivale a 240ml, enquanto nos EUA é aproximadamente 236.5ml.
               </p>
            </div>
         </div>
         <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl space-y-4 group hover:border-cyan-500/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
               <Box className="h-5 w-5" />
            </div>
            <div>
               <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Espaço Tridimensional</h5>
               <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                  O volume é a medida do espaço ocupado por um corpo. 1 litro é equivalente a um decímetro cúbico (dm³).
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
