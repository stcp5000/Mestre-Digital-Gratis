import React, { useState, useEffect } from "react";
import extenso from "extenso";
import { Copy, Check, Hash, Coins, ListOrdered, Trash2 } from "lucide-react";

type Mode = "number" | "currency" | "ordinal";

export default function NumberToWordsTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<Mode>("number");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input || isNaN(Number(input.replace(",", ".")))) {
      setResult("");
      return;
    }

    try {
      const cleanInput = input.replace(",", ".");
      let output = "";
      
      if (mode === "number") {
        output = (extenso as any)(cleanInput, { decimal: "informal" });
      } else if (mode === "currency") {
        output = (extenso as any)(cleanInput, { mode: "currency" });
      } else if (mode === "ordinal") {
        output = (extenso as any)(cleanInput, { mode: "ordinal" });
      }
      
      setResult(output);
    } catch (e) {
      console.error(e);
      setResult("Erro na conversão");
    }
  };

  useEffect(() => {
    convert();
  }, [input, mode]);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modes = [
    { id: "number", label: "Número Cardinal", icon: Hash, desc: "cento e vinte" },
    { id: "currency", label: "Monetário (BRL)", icon: Coins, desc: "cento e vinte reais" },
    { id: "ordinal", label: "Número Ordinal", icon: ListOrdered, desc: "centésimo vigésimo" },
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Redação e Documentos
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Número por Extenso</h2>
        <p className="mt-4 text-slate-400">Converta algarismos em palavras de forma automática. Ideal para preenchimento de cheques, contratos e documentos formais.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Escolha o Formato</label>
            <div className="grid grid-cols-1 gap-3">
              {modes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as Mode)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${mode === m.id ? "bg-emerald-500 border-emerald-500 text-black" : "bg-[#0A0A0A] border-white/5 text-slate-400 hover:border-emerald-500/50"}`}
                  >
                    <div className={`p-3 rounded-xl ${mode === m.id ? "bg-black/10" : "bg-white/5"}`}>
                       <Icon className="h-5 w-5" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-widest">{m.label}</div>
                       <div className={`text-[10px] font-medium opacity-60 italic mt-1 ${mode === m.id ? "text-black" : "text-slate-500"}`}>Ex: {m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Digite o Valor</label>
               <button onClick={() => setInput("")} className="text-[9px] font-bold text-slate-700 hover:text-red-500 transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                  <Trash2 className="h-3 w-3" /> Limpar
               </button>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/[^0-9,.]/g, ""))}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-white text-3xl font-bold focus:border-emerald-500 outline-none transition-all placeholder:text-slate-800"
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="space-y-6">
           <div className="relative group">
              <label className="absolute -top-3 left-6 px-2 bg-[#050505] text-[9px] font-black uppercase tracking-widest text-emerald-500">Resultado por Extenso</label>
              <div className="w-full min-h-[180px] rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-8 text-slate-200 text-xl font-bold leading-relaxed flex items-center justify-center text-center">
                {result || <span className="text-slate-800 italic">Digite um valor para converter...</span>}
              </div>
           </div>

           <button
             onClick={copyToClipboard}
             disabled={!result}
             className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white py-6 text-sm font-black text-black transition-all hover:bg-emerald-500 active:scale-95 shadow-2x disabled:opacity-50"
           >
             {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
             {copied ? "COPIADO!" : "COPIAR RESULTADO"}
           </button>

           <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Informação</h4>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tighter">
                A escrita por extenso é obrigatória em diversos documentos jurídicos para evitar fraudes em valores numerais. Nossa ferramenta segue as normas gramaticais da língua portuguesa.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
