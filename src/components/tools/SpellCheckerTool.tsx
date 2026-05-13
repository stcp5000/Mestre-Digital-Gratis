import React, { useState } from "react";
import { Check, Copy, RefreshCw, Sparkles, MessageSquare, Briefcase, Smile, FileText } from "lucide-react";

type Tone = "standard" | "professional" | "casual" | "concise";

export default function SpellCheckerTool() {
  const [text, setText] = useState("");
  const [corrected, setCorrected] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<Tone>("standard");
  const [copied, setCopied] = useState(false);

  const check = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch("/api/spell-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone, language: "Portuguese" }),
      });
      const data = await res.json();
      setCorrected(data.correctedText || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(corrected);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones = [
    { id: "standard", label: "Padrão", icon: FileText },
    { id: "professional", label: "Profissional", icon: Briefcase },
    { id: "casual", label: "Casual", icon: Smile },
    { id: "concise", label: "Conciso", icon: MessageSquare },
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Inteligência Artificial
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Corretor Ortográfico</h2>
        <p className="mt-4 text-slate-400">Fix erros ortográficos, gramaticais e melhore o tom do seu texto instantaneamente usando IA.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Escolha o Tom</label>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tones.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id as Tone)}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${tone === t.id ? "bg-emerald-500 border-emerald-500 text-black" : "bg-[#0A0A0A] border-white/10 text-slate-400 hover:border-emerald-500/50"}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Seu Texto</label>
             <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[250px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 text-white text-sm focus:border-emerald-500 outline-none leading-relaxed"
                placeholder="Escreva ou cole seu conteúdo aqui..."
             />
          </div>

          <button
            onClick={check}
            disabled={loading || !text}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-white py-4 text-sm font-black text-black transition-all hover:bg-emerald-500 disabled:opacity-50 active:scale-95 shadow-xl"
          >
            {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {loading ? "PROCESSANDO..." : "CORRIGIR COM IA"}
          </button>
        </div>

        <div className="space-y-6">
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resultado Sugerido</label>
                 {corrected && (
                    <button onClick={copyResult} className="text-[10px] font-black text-emerald-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                       {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                       {copied ? "Copiado!" : "Copiar"}
                    </button>
                 )}
              </div>
              <div className={`w-full min-h-[250px] rounded-2xl border ${corrected ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-white/5 bg-[#0A0A0A]"} p-6 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap`}>
                 {corrected || <span className="text-slate-700 italic">O texto corrigido aparecerá aqui...</span>}
              </div>
           </div>
           
           <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Recursos incluídos:</h4>
              <ul className="grid grid-cols-2 gap-3">
                 {[
                   "Correção Ortográfica",
                   "Ajuste Gramatical",
                   "Pontuação Inteligente",
                   "Melhoria de Fluidez",
                   "Consistência de Tom",
                   "Contexto Semântico"
                 ].map((feat, i) => (
                   <li key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                      <Check className="h-3 w-3 text-emerald-500" /> {feat}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
