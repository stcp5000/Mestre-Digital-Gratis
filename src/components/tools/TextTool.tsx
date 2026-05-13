import React, { useState } from "react";

export default function TextTool() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const capitalize = () => setText(text.split(". ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(". "));

  return (
    <div className="space-y-10">
      <div>
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Redação e Copywriting
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Manipulação de Texto</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Palavras", value: words },
          { label: "Caracteres", value: chars },
          { label: "Estimativa Leitura", value: `${Math.ceil(words / 200)} min` },
          { label: "Nível Densidade", value: words > 500 ? "Alta" : "Ok" }
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 text-center">
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[350px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-white focus:border-cyan-500 outline-none leading-relaxed transition-all"
        placeholder="Cole seu conteúdo estratégico aqui..."
      />
      
      <div className="flex flex-wrap gap-3">
        <button onClick={toUpper} className="px-8 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors">MAIÚSCULAS</button>
        <button onClick={toLower} className="px-8 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors">minúsculas</button>
        <button onClick={capitalize} className="px-8 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors">Sentença Capital.</button>
      </div>
    </div>
  );
}
