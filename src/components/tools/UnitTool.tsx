import React, { useState, useMemo } from "react";
import { 
  Ruler, 
  Weight, 
  Thermometer, 
  Maximize, 
  Droplets, 
  Zap, 
  Clock, 
  Database,
  ArrowRightLeft,
  Search,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Category = "length" | "mass" | "temp" | "area" | "volume" | "speed" | "time" | "data";

interface Unit {
  id: string;
  label: string;
  factor?: number; // relative to base unit
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
}

interface UnitCategory {
  id: Category;
  label: string;
  icon: any;
  baseUnit: string;
  units: Unit[];
}

const CATEGORIES: UnitCategory[] = [
  {
    id: "length",
    label: "Comprimento",
    icon: Ruler,
    baseUnit: "m",
    units: [
      { id: "mm", label: "Milímetro (mm)", factor: 0.001 },
      { id: "cm", label: "Centímetro (cm)", factor: 0.01 },
      { id: "m", label: "Metro (m)", factor: 1 },
      { id: "km", label: "Quilômetro (km)", factor: 1000 },
      { id: "in", label: "Polegada (in)", factor: 0.0254 },
      { id: "ft", label: "Pé (ft)", factor: 0.3048 },
      { id: "yd", label: "Jarda (yd)", factor: 0.9144 },
      { id: "mi", label: "Milha (mi)", factor: 1609.34 },
    ]
  },
  {
    id: "mass",
    label: "Peso e Massa",
    icon: Weight,
    baseUnit: "kg",
    units: [
      { id: "mg", label: "Miligrama (mg)", factor: 0.000001 },
      { id: "g", label: "Grama (g)", factor: 0.001 },
      { id: "kg", label: "Quilograma (kg)", factor: 1 },
      { id: "ton", label: "Tonelada (t)", factor: 1000 },
      { id: "oz", label: "Onça (oz)", factor: 0.0283495 },
      { id: "lb", label: "Libra (lb)", factor: 0.453592 },
    ]
  },
  {
    id: "temp",
    label: "Temperatura",
    icon: Thermometer,
    baseUnit: "c",
    units: [
      { 
        id: "c", 
        label: "Celsius (°C)", 
        toBase: (v) => v, 
        fromBase: (v) => v 
      },
      { 
        id: "f", 
        label: "Fahrenheit (°F)", 
        toBase: (v) => (v - 32) * 5/9, 
        fromBase: (v) => (v * 9/5) + 32 
      },
      { 
        id: "k", 
        label: "Kelvin (K)", 
        toBase: (v) => v - 273.15, 
        fromBase: (v) => v + 273.15 
      },
    ]
  },
  {
    id: "area",
    label: "Área",
    icon: Maximize,
    baseUnit: "m2",
    units: [
      { id: "mm2", label: "Milímetro² (mm²)", factor: 0.000001 },
      { id: "cm2", label: "Centímetro² (cm²)", factor: 0.0001 },
      { id: "m2", label: "Metro² (m²)", factor: 1 },
      { id: "km2", label: "Quilômetro² (km²)", factor: 1000000 },
      { id: "in2", label: "Polegada² (in²)", factor: 0.00064516 },
      { id: "ft2", label: "Pé² (ft²)", factor: 0.092903 },
      { id: "ac", label: "Acre (ac)", factor: 4046.86 },
      { id: "ha", label: "Hectare (ha)", factor: 10000 },
    ]
  },
  {
    id: "volume",
    label: "Volume",
    icon: Droplets,
    baseUnit: "l",
    units: [
      { id: "ml", label: "Mililitro (ml)", factor: 0.001 },
      { id: "l", label: "Litro (l)", factor: 1 },
      { id: "m3", label: "Metro Cúbico (m³)", factor: 1000 },
      { id: "in3", label: "Polegada Cúbica", factor: 0.0163871 },
      { id: "ft3", label: "Pé Cúbico", factor: 28.3168 },
      { id: "gal_us", label: "Galão (EUA)", factor: 3.78541 },
      { id: "gal_uk", label: "Galão (Imp)", factor: 4.54609 },
    ]
  },
  {
    id: "speed",
    label: "Velocidade",
    icon: Zap,
    baseUnit: "m/s",
    units: [
      { id: "ms", label: "m/s", factor: 1 },
      { id: "kmh", label: "km/h", factor: 1/3.6 },
      { id: "mph", label: "mph", factor: 0.44704 },
      { id: "knot", label: "Nó (knot)", factor: 0.514444 },
    ]
  },
  {
    id: "time",
    label: "Tempo",
    icon: Clock,
    baseUnit: "s",
    units: [
      { id: "ms", label: "Milissegundo", factor: 0.001 },
      { id: "s", label: "Segundo", factor: 1 },
      { id: "min", label: "Minuto", factor: 60 },
      { id: "h", label: "Hora", factor: 3600 },
      { id: "d", label: "Dia", factor: 86400 },
      { id: "w", label: "Semana", factor: 604800 },
      { id: "mo", label: "Mês (30d)", factor: 2592000 },
      { id: "y", label: "Ano (365d)", factor: 31536000 },
    ]
  },
  {
    id: "data",
    label: "Dados Digitais",
    icon: Database,
    baseUnit: "b",
    units: [
      { id: "bit", label: "bit (b)", factor: 0.125 }, // factor to bytes? let's use byte as base
      { id: "B", label: "Byte (B)", factor: 1 },
      { id: "KB", label: "Kilobyte (KB)", factor: 1024 },
      { id: "MB", label: "Megabyte (MB)", factor: 1024**2 },
      { id: "GB", label: "Gigabyte (GB)", factor: 1024**3 },
      { id: "TB", label: "Terabyte (TB)", factor: 1024**4 },
    ]
  }
];

const InputField = ({ label, value, onChange, icon: Icon, type = "number" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-emerald-500">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 ${Icon ? 'px-14' : 'px-6'} outline-none focus:border-emerald-500 transition-all font-black text-xl text-white tracking-tighter`}
        placeholder="0"
      />
    </div>
  </div>
);

export default function UnitTool() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("km");
  const [inputValue, setInputValue] = useState<string>("1");
  const [copied, setCopied] = useState(false);

  const activeCategory = CATEGORIES.find(c => c.id === category)!;

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return 0;

    const from = activeCategory.units.find(u => u.id === fromUnit);
    const to = activeCategory.units.find(u => u.id === toUnit);

    if (!from || !to) return 0;

    let baseValue = 0;
    if (from.toBase) {
      baseValue = from.toBase(val);
    } else {
      baseValue = val * (from.factor || 1);
    }

    let finalValue = 0;
    if (to.fromBase) {
      finalValue = to.fromBase(baseValue);
    } else {
      finalValue = baseValue / (to.factor || 1);
    }

    return finalValue;
  }, [inputValue, fromUnit, toUnit, activeCategory]);

  const handleCategoryChange = (catId: Category) => {
    const newCat = CATEGORIES.find(c => c.id === catId)!;
    setCategory(catId);
    setFromUnit(newCat.units[0].id);
    setToUnit(newCat.units[1]?.id || newCat.units[0].id);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Utilidades Gerais
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Conversor de Unidades</h2>
        <p className="mt-4 text-slate-400">Converta rapidamente entre diferentes unidades de medida em diversas categorias.</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group ${
              category === cat.id 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
            }`}
          >
            <cat.icon className={`h-5 w-5 ${category === cat.id ? "text-emerald-500" : "text-slate-600 group-hover:text-slate-400"}`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-center">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Converter Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <InputField 
              label="Valor a converter" 
              value={inputValue} 
              onChange={setInputValue} 
              icon={Search} 
            />

            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">De</label>
                    <select 
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                    >
                        {activeCategory.units.map(u => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                        ))}
                    </select>
                </div>

                <button 
                    onClick={swapUnits}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-emerald-500 transition-all mb-0.5"
                >
                    <ArrowRightLeft className="h-5 w-5" />
                </button>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Para</label>
                    <select 
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                    >
                        {activeCategory.units.map(u => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                        ))}
                    </select>
                </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Dica de especialista</span>
              </div>
              <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                  Use o botão de troca para inverter rapidamente as unidades de origem e destino. Todas as conversões são calculadas em tempo real.
              </p>
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-5">
           <div className="h-full flex flex-col bg-emerald-500 rounded-[2rem] p-10 text-black shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                 <activeCategory.icon className="h-48 w-48" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 block">Resultado da Conversão</span>
                    <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold opacity-60 uppercase">{inputValue} {fromUnit} =</div>
                        <div className="text-5xl sm:text-6xl font-black tracking-tighter leading-none break-all">
                            {result.toLocaleString('pt-BR', { maximumFractionDigits: 6 })}
                        </div>
                        <div className="text-xl font-bold uppercase tracking-tight opacity-80 mt-2">
                            {activeCategory.units.find(u => u.id === toUnit)?.label.split('(')[0].trim()}
                        </div>
                    </div>
                 </div>

                 <div className="mt-12 space-y-4">
                    <button 
                        onClick={copyToClipboard}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black/90 active:scale-95 transition-all shadow-lg"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 text-emerald-400" />
                                Copiado!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                Copiar Resultado
                            </>
                        )}
                    </button>
                    <div className="text-[9px] font-black uppercase tracking-widest opacity-40 text-center">
                        MESTRE DIGITAL • CONVERSÃO PRECISA
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
