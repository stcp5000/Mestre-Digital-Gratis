import React, { useState } from "react";
import { Percent, ArrowRight, TrendingUp, TrendingDown, Copy, Check } from "lucide-react";

const Input = ({ value, onChange, placeholder }: any) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value.replace(/[^0-9,.]/g, ""))}
    className="bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white min-w-[140px] flex-1 md:flex-none text-center focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-800 text-lg"
    placeholder={placeholder}
  />
);

const ResultBox = ({ value, id, onCopy, isCopied }: { value: string, id: string, onCopy: (text: string, id: string) => void, isCopied: boolean }) => (
  <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-lg group">
    <span className="text-emerald-400 font-black text-lg">{value}</span>
    <button onClick={() => onCopy(value, id)} className="text-slate-600 hover:text-emerald-400 transition-colors">
      {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-3 w-3" />}
    </button>
  </div>
);

export default function PercentageCalculatorTool() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const parseNum = (val: string) => {
    const sanitized = val.replace(",", ".");
    return sanitized === "" ? 0 : Number(sanitized);
  };

  // Logic 1: X% of Y
  const [c1, setC1] = useState({ p: "", v: "" });
  const r1 = (parseNum(c1.p) / 100) * parseNum(c1.v);

  // Logic 2: X is what % of Y
  const [c2, setC2] = useState({ v1: "", v2: "" });
  const r2 = (parseNum(c2.v1) / parseNum(c2.v2)) * 100;

  // Logic 3: Percentage change
  const [c3, setC3] = useState({ v1: "", v2: "" });
  const r3 = ((parseNum(c3.v2) - parseNum(c3.v1)) / parseNum(c3.v1)) * 100;

  // Logic 4: Increase/Decrease
  const [c4, setC4] = useState({ v: "", p: "", type: "increase" as "increase" | "decrease" });
  const r4 = c4.type === "increase" 
    ? parseNum(c4.v) * (1 + parseNum(c4.p) / 100) 
    : parseNum(c4.v) * (1 - parseNum(c4.p) / 100);

  const format = (val: number) => isFinite(val) && !isNaN(val) ? val.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : "---";

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Cálculos Financeiros
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Calculadora de Porcentagem</h2>
        <p className="mt-4 text-slate-400">Realize cálculos de porcentagem, variações, percentuais de valores e descontos de forma simples.</p>
      </div>

      <div className="grid gap-6">
        {/* Scenario 1 */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex flex-wrap items-center gap-3 text-slate-300 font-bold uppercase text-[11px] tracking-widest">
              Quanto é <Input value={c1.p} onChange={(v:any) => setC1({...c1, p: v})} placeholder="%" /> % de <Input value={c1.v} onChange={(v:any) => setC1({...c1, v: v})} placeholder="Valor" /> ?
           </div>
           <div className="flex items-center gap-4">
              <ArrowRight className="hidden md:block h-4 w-4 text-slate-700" />
              <ResultBox value={format(r1)} id="r1" onCopy={handleCopy} isCopied={copied === "r1"} />
           </div>
        </div>

        {/* Scenario 2 */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex flex-wrap items-center gap-3 text-slate-300 font-bold uppercase text-[11px] tracking-widest">
              <Input value={c2.v1} onChange={(v:any) => setC2({...c2, v1: v})} placeholder="Valor" /> é qual % de <Input value={c2.v2} onChange={(v:any) => setC2({...c2, v2: v})} placeholder="Total" /> ?
           </div>
           <div className="flex items-center gap-4">
              <ArrowRight className="hidden md:block h-4 w-4 text-slate-700" />
              <ResultBox value={format(r2) + "%"} id="r2" onCopy={handleCopy} isCopied={copied === "r2"} />
           </div>
        </div>

        {/* Scenario 3 */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex flex-wrap items-center gap-3 text-slate-300 font-bold uppercase text-[11px] tracking-widest">
              Variação de <Input value={c3.v1} onChange={(v:any) => setC3({...c3, v1: v})} placeholder="De" /> para <Input value={c3.v2} onChange={(v:any) => setC3({...c3, v2: v})} placeholder="Para" /> :
           </div>
           <div className="flex items-center gap-4">
              <ArrowRight className="hidden md:block h-4 w-4 text-slate-700" />
              <ResultBox value={format(r3) + "%"} id="r3" onCopy={handleCopy} isCopied={copied === "r3"} />
           </div>
        </div>

        {/* Scenario 4 */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex flex-wrap items-center gap-3 text-slate-300 font-bold uppercase text-[11px] tracking-widest">
              O valor <Input value={c4.v} onChange={(v:any) => setC4({...c4, v: v})} placeholder="Valor" /> 
              <select 
                value={c4.type} 
                onChange={(e) => setC4({...c4, type: e.target.value as any})}
                className="bg-black border border-white/10 rounded-lg px-2 py-2 text-emerald-500 font-black"
              >
                <option value="increase">Aumentado</option>
                <option value="decrease">Diminuído</option>
              </select>
              em <Input value={c4.p} onChange={(v:any) => setC4({...c4, p: v})} placeholder="%" /> % é:
           </div>
           <div className="flex items-center gap-4">
              <ArrowRight className="hidden md:block h-4 w-4 text-slate-700" />
              <ResultBox value={format(r4)} id="r4" onCopy={handleCopy} isCopied={copied === "r4"} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
         <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
            <TrendingUp className="h-8 w-8 text-emerald-500 mb-6" />
            <h4 className="text-xl font-black text-white tracking-tight mb-2">Cálculo de Juros</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Use as opções de aumento e diminuição para simular juros simples ou descontos em faturas e boletos bancários.
            </p>
         </div>
         <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
            <TrendingDown className="h-8 w-8 text-blue-500 mb-6" />
            <h4 className="text-xl font-black text-white tracking-tight mb-2">Descontos Reais</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
               Calcule rapidamente a economia real ao aplicar um percentual de desconto sobre o preço cheio de um produto.
            </p>
         </div>
      </div>
    </div>
  );
}
