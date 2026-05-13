import React, { useState, useEffect } from "react";
import { Copy, Check, Trash2, SortAsc, SortDesc, Filter, List, Eraser } from "lucide-react";

export default function AlphabeticalSorterTool() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    reverse: false,
    caseSensitive: false,
    removeDuplicates: false,
    trim: true,
    separator: "newline" as "newline" | "comma" | "space"
  });

  const sortLines = () => {
    if (!text) {
      setResult("");
      return;
    }

    let items: string[] = [];
    if (options.separator === "newline") {
      items = text.split(/\r?\n/);
    } else if (options.separator === "comma") {
      items = text.split(",");
    } else {
      items = text.split(/\s+/);
    }

    // Cleaning
    if (options.trim) {
      items = items.map(item => item.trim()).filter(Boolean);
    } else {
      items = items.filter(item => item !== "");
    }

    if (options.removeDuplicates) {
      items = Array.from(new Set(items));
    }

    // Sorting
    items.sort((a, b) => {
      const valA = options.caseSensitive ? a : a.toLowerCase();
      const valB = options.caseSensitive ? b : b.toLowerCase();
      
      if (valA < valB) return options.reverse ? 1 : -1;
      if (valA > valB) return options.reverse ? -1 : 1;
      return 0;
    });

    const joinChar = options.separator === "newline" ? "\n" : options.separator === "comma" ? ", " : " ";
    setResult(items.join(joinChar));
  };

  useEffect(() => {
    sortLines();
  }, [text, options]);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Organização de Dados
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Ordenador Alfabético</h2>
        <p className="mt-4 text-slate-400">Organize listas, nomes ou palavras em ordem alfabética crescente ou decrescente instantaneamente.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Configurações</label>
            
            <div className="space-y-3">
               {[
                 { id: "reverse", label: "Ordem Z-A", icon: SortDesc },
                 { id: "caseSensitive", label: "Diferenciar Maiúsculas", icon: List },
                 { id: "removeDuplicates", label: "Remover Duplicados", icon: Filter },
                 { id: "trim", label: "Limpar Espaços", icon: Eraser },
               ].map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setOptions({ ...options, [opt.id]: !options[opt.id as keyof typeof options] })}
                   className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${options[opt.id as keyof typeof options] ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-[#0A0A0A] border-white/5 text-slate-400 hover:border-white/20"}`}
                 >
                   <div className="flex items-center gap-3">
                     <opt.icon className="h-4 w-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
                   </div>
                   <div className={`h-2 w-2 rounded-full ${options[opt.id as keyof typeof options] ? "bg-emerald-500" : "bg-slate-800"}`} />
                 </button>
               ))}
            </div>

            <div className="space-y-3 pt-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Separador de Entrada</label>
               <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "newline", label: "Nova Linha" },
                    { id: "comma", label: "Vírgulas" },
                    { id: "space", label: "Espaços" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setOptions({ ...options, separator: s.id as any })}
                      className={`py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${options.separator === s.id ? "bg-white text-black border-white" : "bg-[#0A0A0A] border-white/5 text-slate-500"}`}
                    >
                      {s.label}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="grid gap-6">
              <div className="relative">
                 <label className="absolute -top-3 left-6 px-2 bg-[#050505] text-[9px] font-black uppercase tracking-widest text-slate-500">Sua Lista</label>
                 <textarea
                   value={text}
                   onChange={(e) => setText(e.target.value)}
                   className="w-full min-h-[200px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-white focus:border-emerald-500 outline-none leading-relaxed transition-all text-sm"
                   placeholder="Ex:
Maçã
Banana
Abacaxi..."
                 />
                 <div className="absolute top-4 right-4">
                    <button onClick={() => setText("")} className="p-2 text-slate-600 hover:text-red-500">
                       <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
              </div>

              <div className="relative">
                 <label className="absolute -top-3 left-6 px-2 bg-[#050505] text-[9px] font-black uppercase tracking-widest text-emerald-500">Resultado Ordenado</label>
                 <div className="w-full min-h-[200px] rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-8 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {result || <span className="text-slate-800 italic">O resultado aparecerá aqui...</span>}
                 </div>
                 {result && (
                   <div className="absolute top-4 right-4">
                      <button onClick={copyToClipboard} className={`p-2 rounded-lg transition-all ${copied ? "bg-emerald-500 text-black shadow-lg" : "text-slate-600 hover:text-emerald-500"}`}>
                         {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                   </div>
                 )}
              </div>
           </div>

           <button
             onClick={copyToClipboard}
             disabled={!result}
             className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white py-5 text-sm font-black text-black transition-all hover:bg-emerald-500 disabled:opacity-50 active:scale-95 shadow-2xl"
           >
             {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
             {copied ? "LISTA COPIADA!" : "COPIAR RESULTADO"}
           </button>
        </div>
      </div>
    </div>
  );
}
