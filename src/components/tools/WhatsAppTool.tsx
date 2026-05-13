import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

export default function WhatsAppTool() {
  const [num, setNum] = useState("");
  const [msg, setMsg] = useState("");

  const generate = () => {
    const cleanNum = num.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Vendas e Social
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Link WhatsApp</h2>
        <p className="mt-4 text-slate-400">Crie links diretos para conversas no WhatsApp com mensagens personalizadas.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Número (com DDD e DDI)</label>
            <input 
              type="text" 
              value={num} 
              onChange={(e) => setNum(e.target.value)}
              placeholder="Ex: 5511999999999"
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mensagem Inicial</label>
            <textarea 
              value={msg} 
              onChange={(e) => setMsg(e.target.value)}
              className="w-full h-32 rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
              placeholder="Olá, gostaria de saber mais..."
            />
          </div>
          <button 
            onClick={generate}
            className="w-full px-12 py-4 bg-emerald-500 text-black font-black tracking-widest text-xs uppercase rounded-xl hover:bg-emerald-400 transition-colors"
          >
            Gerar e Abrir Link
          </button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl bg-[#0A0A0A] p-10 ring-1 ring-white/10 text-center">
           <ExternalLink className="h-16 w-16 text-emerald-500 mb-6" />
           <p className="text-sm text-slate-400 font-medium">O link será aberto em uma nova aba direto no WhatsApp Web ou App.</p>
        </div>
      </div>
    </div>
  );
}
