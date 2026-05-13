import React, { useState } from "react";
import confetti from "canvas-confetti";
import { RefreshCw, Copy } from "lucide-react";

export default function ColorTool() {
  const genColor = () => "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  const [colors, setColors] = useState(["#06b6d4", "#0891b2", "#164e63", "#0E7490", "#155E75"]);

  const refresh = () => {
    setColors(colors.map(() => genColor()));
    confetti({ 
      scalar: 0.7, 
      particleCount: 50,
      colors: ['#06b6d4', '#ffffff']
    });
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
            Design e Identidade
          </span>
          <h2 className="text-4xl font-extrabold text-white tracking-tighter">Gerador de Paletas</h2>
          <p className="mt-4 text-slate-400">Harmonias perfeitas para interfaces modernas e minimalistas.</p>
        </div>
        <button 
          onClick={refresh}
          className="flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-black text-black text-xs uppercase tracking-widest transition-all hover:bg-cyan-400 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" /> Nova Paleta
        </button>
      </div>

      <div className="flex flex-col sm:flex-row h-[400px] w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
        {colors.map((c, i) => (
          <div 
            key={i} 
            style={{ backgroundColor: c }}
            className="group relative flex flex-1 flex-col items-center justify-end pb-10 text-white transition-all hover:flex-[1.8]"
          >
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mb-4">
               <span className="text-xs font-black tracking-widest uppercase">{c}</span>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(c);
                confetti({
                  origin: { x: (i + 0.5) / colors.length, y: 0.8 },
                  particleCount: 20,
                  spread: 30,
                  colors: [c]
                });
              }}
              className="rounded-full bg-white text-black p-4 opacity-0 transition-all transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 shadow-xl"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
