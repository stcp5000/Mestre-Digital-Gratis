import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export default function PomodoroTool() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const format = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Foco Máximo
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Timer Pomodoro</h2>
        <p className="mt-4 text-slate-400 leading-relaxed">Aumente sua produtividade usando a técnica de blocos de foco de 25 minutos.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-[40px] bg-[#0A0A0A] p-12 ring-2 ring-emerald-500/20 shadow-2xl">
        <div className="text-[120px] font-black tracking-tighter text-white font-mono leading-none">
          {format(seconds)}
        </div>
        <div className="mt-12 flex gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-12 py-4 rounded-full font-black tracking-widest text-xs uppercase transition-all ${isActive ? "bg-white text-black" : "bg-emerald-500 text-black hover:bg-emerald-400"}`}
          >
            {isActive ? "Pausar" : "Iniciar Foco"}
          </button>
          <button 
            onClick={() => { setSeconds(25 * 60); setIsActive(false); }}
            className="px-8 py-4 rounded-full border border-white/10 text-white font-black tracking-widest text-xs uppercase hover:bg-white/5"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
