import React, { useState, useMemo } from "react";
import { 
  Hash, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Info, 
  History,
  Scroll,
  BookOpen
} from "lucide-react";
import { motion } from "motion/react";

const ROMAN_SYMBOLS = [
  { value: 1000, symbol: "M" },
  { value: 900, symbol: "CM" },
  { value: 500, symbol: "D" },
  { value: 400, symbol: "CD" },
  { value: 100, symbol: "C" },
  { value: 90, symbol: "XC" },
  { value: 50, symbol: "L" },
  { value: 40, symbol: "XL" },
  { value: 10, symbol: "X" },
  { value: 9, symbol: "IX" },
  { value: 5, symbol: "V" },
  { value: 4, symbol: "IV" },
  { value: 1, symbol: "I" },
];

const ROMAN_VALUES: { [key: string]: number } = {
  M: 1000,
  D: 500,
  C: 100,
  L: 50,
  X: 10,
  V: 5,
  I: 1,
};

function decimalToRoman(num: number): string {
  if (num <= 0 || num > 3999) return "Inválido (1-3999)";
  let result = "";
  let remaining = num;
  for (const { value, symbol } of ROMAN_SYMBOLS) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

function romanToDecimal(roman: string): number | string {
  const upperRoman = roman.toUpperCase().trim();
  if (!/^[MDCLXVI]+$/.test(upperRoman)) return "Inválido";
  
  let result = 0;
  for (let i = 0; i < upperRoman.length; i++) {
    const current = ROMAN_VALUES[upperRoman[i]];
    const next = ROMAN_VALUES[upperRoman[i + 1]];
    
    if (next && next > current) {
      result += (next - current);
      i++;
    } else {
      result += current;
    }
  }

  // Basic validation bypass: convert back and check if it matches to ensure standard form
  if (decimalToRoman(result) !== upperRoman) return "Inválido (Forma não padrão)";

  return result;
}

const InputField = ({ label, value, onChange, icon: Icon, type = "text", placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-amber-500">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 ${Icon ? 'px-14' : 'px-6'} outline-none focus:border-amber-500 transition-all font-black text-xl text-white tracking-tighter`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default function RomanNumeralsTool() {
  const [decimalInput, setDecimalInput] = useState("2024");
  const [romanInput, setRomanInput] = useState("MMXXIV");
  const [mode, setMode] = useState<"dec-to-rom" | "rom-to-dec">("dec-to-rom");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (mode === "dec-to-rom") {
      const num = parseInt(decimalInput);
      return decimalToRoman(num);
    } else {
      return romanToDecimal(romanInput).toString();
    }
  }, [decimalInput, romanInput, mode]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchMode = () => {
    setMode(prev => prev === "dec-to-rom" ? "rom-to-dec" : "dec-to-rom");
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black tracking-widest rounded border border-amber-500/20 uppercase mb-4">
          Cultura & História
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Números Romanos</h2>
        <p className="mt-4 text-slate-400">Converta algarismos arábicos para romanos e vice-versa com precisão e validação.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Converter Area */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Modo de Conversão</span>
                <button 
                    onClick={switchMode}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase transition-all hover:bg-amber-500/20"
                >
                    <ArrowRightLeft className="h-3 w-3" />
                    Trocar Ordem
                </button>
            </div>

            {mode === "dec-to-rom" ? (
                <InputField 
                    label="Número Decimal (1-3999)" 
                    value={decimalInput} 
                    onChange={setDecimalInput} 
                    icon={Hash} 
                    type="number"
                    placeholder="Ex: 2024"
                />
            ) : (
                <InputField 
                    label="Algarismos Romanos" 
                    value={romanInput} 
                    onChange={setRomanInput} 
                    icon={Scroll} 
                    type="text"
                    placeholder="Ex: MMXXIV"
                />
            )}

            <div className="p-4 rounded-2xl bg-white/5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dica</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    Os números romanos são compostos por 7 letras básicas: I(1), V(5), X(10), L(50), C(100), D(500) e M(1000).
                </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <History className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uso Comum</span>
                </div>
                <ul className="text-[10px] font-bold text-slate-400 uppercase space-y-2">
                    <li>• Séculos (Século XXI)</li>
                    <li>• Nomes de Papas e Reis</li>
                    <li>• Capítulos de Livros</li>
                    <li>• Relógios Clássicos</li>
                </ul>
             </div>
             <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Símbolos Base</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {Object.entries(ROMAN_VALUES).map(([s, v]) => (
                        <div key={s} className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-amber-500 font-black">{s}</span>
                            <span className="text-white font-bold">{v}</span>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-6">
           <div className="h-full flex flex-col bg-amber-500 rounded-[2rem] p-10 text-black shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                 <Scroll className="h-48 w-48" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 block">Resultado da Conversão</span>
                    <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold opacity-60 uppercase">
                            {mode === "dec-to-rom" ? decimalInput : romanInput} =
                        </div>
                        <div className="text-5xl sm:text-7xl font-black tracking-tighter leading-none break-all py-4">
                            {result}
                        </div>
                        <div className="text-xl font-bold uppercase tracking-tight opacity-80">
                            {mode === "dec-to-rom" ? "Algarismos Romanos" : "Número Decimal"}
                        </div>
                    </div>
                 </div>

                 <div className="mt-12 space-y-4">
                    <button 
                        onClick={copyResult}
                        disabled={result.includes("Inválido")}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black/90 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 text-amber-400" />
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
                        PRECISÃO HISTÓRICA • MESTRE DIGITAL
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
