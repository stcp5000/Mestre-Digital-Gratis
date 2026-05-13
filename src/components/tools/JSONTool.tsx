import React, { useState } from "react";

export default function JSONTool() {
  const [input, setInput] = useState('{"exemplo": "valor", "lista": [1, 2, 3]}');
  const [error, setError] = useState("");

  const format = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj, null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Desenvolvimento
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Formatador JSON</h2>
        <p className="mt-4 text-slate-400">Embeleze e valide seus objetos JSON instantaneamente.</p>
      </div>

      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-80 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 text-emerald-400 font-mono text-sm focus:border-emerald-500 outline-none"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button 
          onClick={format}
          className="w-full sm:w-auto px-12 py-4 bg-white text-black font-black tracking-widest text-xs uppercase rounded-xl hover:bg-emerald-500 transition-colors"
        >
          Formatar JSON
        </button>
        {error && <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Erro: {error}</span>}
      </div>
    </div>
  );
}
