import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Trash2, 
  Palette,
  Timer,
  Layout,
  Zap,
  History,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type StopwatchTheme = "classic" | "fun" | "minimal" | "cyber";

interface Lap {
  id: number;
  time: number;
  delta: number;
}

const themeConfigs: Record<StopwatchTheme, {
  name: string;
  bg: string;
  accent: string;
  font: string;
  border: string;
}> = {
  classic: {
    name: "Clássico",
    bg: "bg-[#0A0A0A]",
    accent: "text-white",
    font: "font-sans",
    border: "border-white/10"
  },
  fun: {
    name: "Divertido",
    bg: "bg-emerald-500",
    accent: "text-black",
    font: "font-mono uppercase italic",
    border: "border-black/20"
  },
  minimal: {
    name: "Moderno",
    bg: "bg-[#05192d]",
    accent: "text-cyan-400",
    font: "font-sans font-light",
    border: "border-white/5"
  },
  cyber: {
    name: "Cyber",
    bg: "bg-[#020202]",
    accent: "text-pink-500",
    font: "font-mono",
    border: "border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
  }
};

// --- Formatter ---

const formatTime = (time: number) => {
  const ms = Math.floor((time % 1000) / 10);
  const s = Math.floor((time / 1000) % 60);
  const m = Math.floor((time / 60000) % 60);
  const h = Math.floor(time / 3600000);

  const pad = (n: number) => n.toString().padStart(2, "0");
  
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms)}`;
  }
  return `${pad(m)}:${pad(s)}.${pad(ms)}`;
};

export default function StopwatchTool() {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [theme, setTheme] = useState<StopwatchTheme>("classic");
  
  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const animate = useCallback((now: number) => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = now - previousTimeRef.current;
    }
    const elapsed = now - startTimeRef.current;
    setTime(elapsed);
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (running) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = time;
      startTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [running, animate, time]);

  const toggle = () => setRunning(!running);

  const reset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
    previousTimeRef.current = 0;
    startTimeRef.current = 0;
  };

  const addLap = () => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const newLap: Lap = {
      id: Date.now(),
      time,
      delta: time - lastLapTime
    };
    setLaps([newLap, ...laps]);
  };

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-black tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Produtividade & Tempo
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Cronômetro Mestre</h2>
        <p className="mt-4 text-slate-400">Precisão milimétrica com múltiplos temas visuais e registro de voltas estratégico.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Interface */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
           <div className={`p-8 sm:p-12 rounded-[3rem] border shadow-2xl transition-all duration-700 relative overflow-hidden ${currentTheme.bg} ${currentTheme.border}`}>
              
              {/* Background Shapes for Fun Theme */}
              {theme === 'fun' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-64 h-64 border-[40px] border-black rounded-full" 
                  />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black rounded-3xl rotate-12" />
                </div>
              )}

              <div className="relative z-10 flex flex-col items-center gap-12">
                 {/* Theme Selector */}
                 <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                    {(Object.keys(themeConfigs) as StopwatchTheme[]).map((t) => (
                       <button
                         key={t}
                         onClick={() => setTheme(t)}
                         className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                           theme === t ? 'bg-white text-black' : 'text-slate-500 hover:text-white'
                         }`}
                       >
                         {themeConfigs[t].name}
                       </button>
                    ))}
                 </div>

                 {/* Display */}
                 <div className={`text-center transition-all duration-500 ${currentTheme.font} ${currentTheme.accent}`}>
                    <div className="text-7xl sm:text-9xl font-black tracking-tighter tabular-nums leading-none">
                       {formatTime(time).split('.')[0]}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black tracking-tighter tabular-nums opacity-40 mt-2">
                       .{formatTime(time).split('.')[1]}
                    </div>
                 </div>

                 {/* Controls */}
                 <div className="flex flex-wrap justify-center items-center gap-4">
                    <button 
                      onClick={reset}
                      className="p-5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:scale-105 active:scale-95"
                    >
                      <RotateCcw className="h-6 w-6" />
                    </button>
                    
                    <button 
                      onClick={toggle}
                      className={`h-24 w-24 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-2xl relative group ${
                        running 
                        ? 'bg-rose-500 text-white shadow-rose-500/20' 
                        : (theme === 'fun' ? 'bg-black text-emerald-500 shadow-emerald-500/20' : 'bg-emerald-500 text-black shadow-emerald-500/20')
                      }`}
                    >
                       {running ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
                       <div className="absolute inset-0 rounded-full border-4 border-current opacity-20 group-hover:scale-125 transition-transform duration-500" />
                    </button>

                    <button 
                      disabled={!running}
                      onClick={addLap}
                      className={`p-5 rounded-full bg-white/5 border border-white/10 transition-all hover:scale-105 active:scale-95 ${
                        running ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10' : 'text-slate-800 opacity-20 cursor-not-allowed'
                      }`}
                    >
                      <Flag className="h-6 w-6" />
                    </button>
                 </div>
              </div>
           </div>

           {/* Laps List */}
           <AnimatePresence>
            {laps.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden"
              >
                 <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                       <History className="h-4 w-4 text-cyan-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Histórico de Voltas</span>
                    </div>
                    <button onClick={() => setLaps([])} className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:opacity-70 flex items-center gap-1">
                       <Trash2 className="h-3 w-3" /> Limpar
                    </button>
                 </div>
                 <div className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
                    <div className="grid gap-1">
                       {laps.map((lap, index) => (
                          <div 
                            key={lap.id} 
                            className="flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 transition-colors group"
                          >
                             <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black text-slate-700 w-8">#{laps.length - index}</span>
                                <div className="space-y-0.5">
                                   <div className="text-sm font-black text-white font-mono">{formatTime(lap.time)}</div>
                                   <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Acumulado</div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="text-xs font-black text-cyan-500 group-hover:scale-110 transition-transform">+{formatTime(lap.delta)}</div>
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Diferença</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}
           </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                    <Zap className="h-5 w-5" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Dicas de Uso</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Melhore sua Performance</p>
                 </div>
              </div>
              <ul className="space-y-4">
                 {[
                   { title: "Treino Intervalado", desc: "Use as voltas para medir sprints e períodos de descanso." },
                   { title: "Gestão de Tarefas", desc: "Cronometre quanto tempo leva em cada fase de um projeto." },
                   { title: "Estudo Focado", desc: "Combine com a técnica Pomodoro para sessões intensas." }
                 ].map((d, i) => (
                   <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[8px] font-black text-indigo-400 shrink-0 mt-0.5">
                         {i + 1}
                      </div>
                      <div className="space-y-1">
                         <span className="text-[10px] font-black uppercase text-white tracking-widest block">{d.title}</span>
                         <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{d.desc}</p>
                      </div>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
              <div className="flex items-center gap-2 text-cyan-400">
                 <Timer className="h-4 w-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Atenção à Precisão</span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Este cronômetro utiliza APIs nativas do navegador para garantir a maior precisão possível, compensando eventuais latências de processamento.
              </p>
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase">
                    <Check className="h-3 w-3 text-emerald-500" /> Web Animations API
                 </div>
                 <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase">
                    <Check className="h-3 w-3 text-emerald-500" /> High Res Timestamp
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
