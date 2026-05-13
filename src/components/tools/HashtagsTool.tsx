import React, { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { RefreshCw } from "lucide-react";

export default function HashtagsTool() {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      const list = data.hashtags.split(/\s+/).filter((h: string) => h.startsWith("#"));
      setHashtags(list);
      confetti({ 
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#ffffff']
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.join(" "));
    toast();
  };

  const toast = () => {
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Inteligência Artificial
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Gerador de Hashtags</h2>
        <p className="mt-4 text-slate-400 leading-relaxed">Descubra as hashtags virais para o seu nicho e aumente seu alcance organicamente.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row p-2 rounded-2xl bg-[#0A0A0A] ring-1 ring-white/10">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          className="flex-1 rounded-xl bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-600"
          placeholder="Ex: Marketing Digital, DropShipping..."
        />
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-xl bg-cyan-500 px-8 py-4 font-black text-black transition-all hover:bg-cyan-400 disabled:opacity-50 active:scale-95"
        >
          {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : "GERAR AGORA"}
        </button>
      </div>

      {hashtags.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Resultados Otimizados</h3>
            <button onClick={copyAll} className="text-xs font-black text-cyan-400 hover:text-white transition-colors">
              {copiedIdx === -1 ? "COPIADO!" : "COPIAR TODAS"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  navigator.clipboard.writeText(tag);
                  setCopiedIdx(idx);
                  setTimeout(() => setCopiedIdx(null), 1000);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  copiedIdx === idx ? "bg-cyan-500 text-black" : "bg-[#0A0A0A] text-slate-400 border border-white/5 hover:border-cyan-500/50 hover:text-cyan-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
