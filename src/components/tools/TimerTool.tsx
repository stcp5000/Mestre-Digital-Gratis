import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Bell, 
  Timer as TimerIcon,
  Zap,
  Volume2,
  VolumeX,
  History,
  Clock,
  Check,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type TimerTheme = "classic" | "fun" | "minimal" | "cyber";

const themeConfigs: Record<TimerTheme, {
  name: string;
  bg: string;
  accent: string;
  font: string;
  border: string;
  progress: string;
}> = {
  classic: {
    name: "Clássico",
    bg: "bg-[#0A0A0A]",
    accent: "text-white",
    font: "font-sans",
    border: "border-white/10",
    progress: "stroke-white"
  },
  fun: {
    name: "Divertido",
    bg: "bg-amber-400",
    accent: "text-black",
    font: "font-mono uppercase italic",
    border: "border-black/20",
    progress: "stroke-black"
  },
  minimal: {
    name: "Moderno",
    bg: "bg-[#05192d]",
    accent: "text-emerald-400",
    font: "font-sans font-light",
    border: "border-white/5",
    progress: "stroke-emerald-500"
  },
  cyber: {
    name: "Cyber",
    bg: "bg-[#020202]",
    accent: "text-indigo-500",
    font: "font-mono",
    border: "border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]",
    progress: "stroke-indigo-500"
  }
};

const PRESETS = [
  { label: "1m", value: 60 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
  { label: "25m", value: 1500 },
  { label: "1h", value: 3600 },
];

export default function TimerTool() {
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [theme, setTheme] = useState<TimerTheme>("classic");
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);

  // Input states
  const [h, setH] = useState(0);
  const [m, setM] = useState(5);
  const [s, setS] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = h * 3600 + m * 60 + s;

  const playAlert = useCallback(() => {
    if (muted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio Context failed", e);
    }
  }, [muted]);

  useEffect(() => {
    if (running && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setFinished(true);
            playAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, timeLeft, playAlert]);

  const startTimer = () => {
    if (timeLeft === 0) {
      if (totalSeconds === 0) return;
      setTimeLeft(totalSeconds);
      setTargetSeconds(totalSeconds);
    }
    setRunning(true);
    setFinished(false);
  };

  const pauseTimer = () => setRunning(false);
  
  const resetTimer = () => {
    setRunning(false);
    setTimeLeft(0);
    setFinished(false);
  };

  const applyPreset = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    setH(hours);
    setM(minutes);
    setS(secs);
    setTimeLeft(seconds);
    setTargetSeconds(seconds);
    setFinished(false);
  };

  const formatDisplay = (seconds: number) => {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${hh > 0 ? pad(hh) + ":" : ""}${pad(mm)}:${pad(ss)}`;
  };

  const progress = targetSeconds > 0 ? (timeLeft / targetSeconds) * 100 : 0;
  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Produtividade & Foco
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Timer Inteligente</h2>
        <p className="mt-4 text-slate-400">Personalize seu tempo com múltiplos estilos visuais, alertas sonoros e presets rápidos.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 text-left">
        {/* Main Interface */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
           <div className={`p-8 sm:p-12 rounded-[3rem] border shadow-2xl transition-all duration-700 relative overflow-hidden flex flex-col items-center gap-10 ${currentTheme.bg} ${currentTheme.border}`}>
              
              {/* Fun Background */}
              {theme === 'fun' && (
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                   <div className="absolute top-10 left-10 w-20 h-20 bg-black rounded-full" />
                   <div className="absolute bottom-10 right-10 w-32 h-32 border-[20px] border-black rounded-3xl rotate-45" />
                </div>
              )}

              {/* Theme Switcher */}
              <div className="relative z-20 flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                 {(Object.keys(themeConfigs) as TimerTheme[]).map((t) => (
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

              {/* Visual Timer */}
              <div className="relative h-64 w-64 sm:h-80 sm:w-80 flex items-center justify-center">
                 {/* SVG Progress Circle */}
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle 
                      cx="50%" cy="50%" r="48%" 
                      className={`fill-transparent border-4 opacity-10 ${currentTheme.progress}`} 
                      strokeWidth="2%"
                    />
                    <motion.circle 
                      cx="50%" cy="50%" r="48%" 
                      className={`fill-transparent transition-colors duration-500 ${currentTheme.progress}`}
                      strokeWidth="2%"
                      strokeDasharray="301.59"
                      initial={{ strokeDashoffset: "301.59" }}
                      animate={{ strokeDashoffset: `${301.59 - (progress / 100) * 301.59}` }}
                      strokeLinecap="round"
                    />
                 </svg>

                 {/* Center Content */}
                 <div className="flex flex-col items-center justify-center z-10">
                    <AnimatePresence mode="wait">
                       {!running && timeLeft === 0 ? (
                          <motion.div 
                            key="setup"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-1 sm:gap-2"
                          >
                             <TimeUnit value={h} onChange={setH} max={99} label="h" theme={currentTheme} />
                             <span className={`text-2xl font-black mb-4 ${currentTheme.accent}`}>:</span>
                             <TimeUnit value={m} onChange={setM} max={59} label="m" theme={currentTheme} />
                             <span className={`text-2xl font-black mb-4 ${currentTheme.accent}`}>:</span>
                             <TimeUnit value={s} onChange={setS} max={59} label="s" theme={currentTheme} />
                          </motion.div>
                       ) : (
                          <motion.div 
                            key="display"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`text-6xl sm:text-7xl font-black tabular-nums tracking-tighter ${currentTheme.font} ${currentTheme.accent}`}
                          >
                             {formatDisplay(timeLeft)}
                          </motion.div>
                       )}
                    </AnimatePresence>
                    
                    {finished && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="flex items-center gap-2 mt-4 text-rose-500"
                       >
                          <Bell className="h-4 w-4 animate-bounce" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Tempo Esgotado!</span>
                       </motion.div>
                    )}
                 </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6 z-20">
                 <button 
                   onClick={resetTimer}
                   className="p-4 rounded-full bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all hover:scale-110 active:scale-95"
                 >
                    <RotateCcw className="h-6 w-6" />
                 </button>

                 <button 
                   onClick={running ? pauseTimer : startTimer}
                   className={`h-24 w-24 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-2xl relative group ${
                     running 
                     ? 'bg-rose-500 text-white shadow-rose-500/20' 
                     : (theme === 'fun' ? 'bg-black text-amber-400' : 'bg-emerald-500 text-black shadow-emerald-500/20')
                   }`}
                 >
                    {running ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
                    <div className="absolute inset-0 rounded-full border-4 border-current opacity-20 group-hover:scale-125 transition-transform duration-500" />
                 </button>

                 <button 
                    onClick={() => setMuted(!muted)}
                    className={`p-4 rounded-full bg-white/5 border border-white/10 transition-all hover:scale-110 active:scale-95 ${muted ? 'text-rose-500' : 'text-slate-500 hover:text-white'}`}
                 >
                    {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                 </button>
              </div>
           </div>

           {/* Quick Presets */}
           <div className="bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 flex flex-wrap justify-center gap-3">
              {PRESETS.map((p) => (
                 <button 
                   key={p.value}
                   onClick={() => applyPreset(p.value)}
                   className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                 >
                    <span className="text-xs font-black text-slate-500 transition-colors group-hover:text-emerald-500 uppercase tracking-widest">{p.label}</span>
                 </button>
              ))}
           </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <Zap className="h-5 w-5" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Usos Sugeridos</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Aumente sua Disciplina</p>
                 </div>
              </div>
              <ul className="space-y-4">
                 {[
                   { icon: History, title: "Técnica Pomodoro", desc: "Ciclos de 25 minutos de foco profundo com 5 minutos de pausa." },
                   { icon: Clock, title: "Timeboxing", desc: "Aloque blocos fixos de tempo para tarefas específicas e evite distrações." },
                   { icon: TimerIcon, title: "Meditação", desc: "Programe sessões curtas de mindfulness durante o dia." }
                 ].map((d, i) => (
                   <li key={i} className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
                         <d.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                         <span className="text-[10px] font-black uppercase text-white tracking-widest block">{d.title}</span>
                         <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{d.desc}</p>
                      </div>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                 <Bell className="h-4 w-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Feedback Sonoro</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Utilizamos osciladores de áudio nativos para emitir avisos discretos, garantindo que você nunca perca o fim de um ciclo de trabalho.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, onChange, max, label, theme }: { 
  value: number; 
  onChange: (v: number) => void; 
  max: number; 
  label: string;
  theme: any;
}) {
  const inc = () => onChange(Math.min(max, value + 1));
  const dec = () => onChange(Math.max(0, value - 1));

  return (
    <div className="flex flex-col items-center gap-1 group">
       <button onClick={inc} className={`p-1 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-all ${theme.accent}`}>
          <ChevronUp className="h-5 w-5" />
       </button>
       <div className="flex flex-col items-center">
          <div className={`text-4xl sm:text-5xl font-black tracking-tighter tabular-nums ${theme.accent}`}>
            {value.toString().padStart(2, "0")}
          </div>
          <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{label}</span>
       </div>
       <button onClick={dec} className={`p-1 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-all ${theme.accent}`}>
          <ChevronDown className="h-5 w-5" />
       </button>
    </div>
  );
}
