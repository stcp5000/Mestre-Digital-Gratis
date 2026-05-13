import React, { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";

export default function CaseConverterTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const transformations = {
    upper: () => setText(text.toUpperCase()),
    lower: () => setText(text.toLowerCase()),
    sentence: () => {
      const result = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
      setText(result);
    },
    title: () => {
      const result = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      setText(result);
    },
    inverse: () => {
      const result = text
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join("");
      setText(result);
    },
    alternating: () => {
      const result = text
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join("");
      setText(result);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Redação e Otimização
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Conversor de Letras</h2>
        <p className="mt-4 text-slate-400">Transforme rapidamente o formato do seu texto entre maiúsculas, minúsculas e outros estilos populares.</p>
      </div>

      <div className="grid gap-6">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-white focus:border-emerald-500 outline-none leading-relaxed transition-all placeholder:text-slate-700"
            placeholder="Digite ou cole aqui o texto que deseja transformar..."
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setText("")}
              className="p-2 text-slate-600 hover:text-red-500 transition-colors"
              title="Limpar"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <button
            onClick={transformations.sentence}
            className="px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-[10px] uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            Frase.
          </button>
          <button
            onClick={transformations.lower}
            className="px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-[10px] uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            minúsculas
          </button>
          <button
            onClick={transformations.upper}
            className="px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-[10px] uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            MAIÚSCULAS
          </button>
          <button
            onClick={transformations.title}
            className="px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-[10px] uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            Capitalizado
          </button>
          <button
            onClick={transformations.inverse}
            className="px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-[10px] uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            iNVERSO
          </button>
          <button
            onClick={transformations.alternating}
            className="px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-[10px] uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            aLtErNaDo
          </button>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-3 rounded-2xl bg-white px-12 py-5 text-sm font-black text-black transition-all hover:bg-emerald-500 active:scale-95 shadow-2xl"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? "TEXTO COPIADO!" : "COPIAR RESULTADO"}
          </button>
        </div>
      </div>
    </div>
  );
}
