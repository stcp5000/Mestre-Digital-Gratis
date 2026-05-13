import React, { useState, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  Droplets, 
  Zap, 
  Heart, 
  Info,
  ChevronRight,
  Sparkles,
  Flower2,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const InputField = ({ label, value, onChange, icon: Icon, type = "text", min, max, unit }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-rose-500">
        <Icon className="h-5 w-5" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 px-14 outline-none focus:border-rose-500 transition-all font-black text-xl text-white tracking-tighter"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase tracking-widest">{unit}</span>
      )}
    </div>
  </div>
);

export default function MenstrualCycleTool() {
  const [lastPeriodDate, setLastPeriodDate] = useState(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState("28");
  const [periodDuration, setPeriodDuration] = useState("5");

  const results = useMemo(() => {
    const lastDate = new Date(lastPeriodDate);
    const cycle = parseInt(cycleLength) || 28;
    const duration = parseInt(periodDuration) || 5;

    if (isNaN(lastDate.getTime())) return null;

    // Predictions
    const nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + cycle);

    const ovulationDate = new Date(lastDate);
    ovulationDate.setDate(lastDate.getDate() + cycle - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    // Current State
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - lastDate.getTime();
    const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const dayInCycle = ((currentDay - 1) % cycle) + 1;

    let phase = "";
    let phaseDescription = "";
    let color = "";
    let phaseIcon = null;

    if (dayInCycle <= duration) {
      phase = "Menstrual";
      phaseDescription = "Seu corpo está reiniciando o ciclo. Priorize o descanso e hidratação.";
      color = "text-rose-500";
      phaseIcon = <Droplets className="h-6 w-6" />;
    } else if (dayInCycle < (cycle - 14 - 3)) {
      phase = "Folicular";
      phaseDescription = "Sua energia está subindo. Excelente fase para iniciar novos projetos.";
      color = "text-emerald-400";
      phaseIcon = <Zap className="h-6 w-6" />;
    } else if (dayInCycle <= (cycle - 14 + 1)) {
      phase = "Ovulatória";
      phaseDescription = "Pico de fertilidade e libido. Você está no seu momento mais radiante.";
      color = "text-amber-400";
      phaseIcon = <Sparkles className="h-6 w-6" />;
    } else {
      phase = "Lútea";
      phaseDescription = "Fase de introspecção. Pode haver maior sensibilidade emocional ou física.";
      color = "text-indigo-400";
      phaseIcon = <Moon className="h-6 w-6" />;
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    };

    return {
      nextPeriod: formatDate(nextPeriod),
      ovulation: formatDate(ovulationDate),
      fertileWindow: `${formatDate(fertileStart)} a ${formatDate(fertileEnd)}`,
      dayInCycle,
      phase,
      phaseDescription,
      color,
      phaseIcon,
      daysUntilNext: Math.max(0, cycle - dayInCycle)
    };
  }, [lastPeriodDate, cycleLength, periodDuration]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black tracking-widest rounded border border-rose-500/20 uppercase mb-4">
          Saúde Feminina
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Monitor de Ciclo Menstrual</h2>
        <p className="mt-4 text-slate-400">Acompanhe suas fases, descubra seu período fértil e entenda como seu corpo funciona a cada dia.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Basic Inputs */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <InputField 
              label="Início da última menstruação" 
              value={lastPeriodDate} 
              onChange={setLastPeriodDate} 
              icon={Calendar} 
              type="date"
            />
            
            <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Duração Ciclo" 
                  value={cycleLength} 
                  onChange={setCycleLength} 
                  icon={Clock} 
                  type="number"
                  unit="dias"
                />
                <InputField 
                  label="Duração Fluxo" 
                  value={periodDuration} 
                  onChange={setPeriodDuration} 
                  icon={Droplets} 
                  type="number"
                  unit="dias"
                />
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-3">
                <div className="flex items-center gap-2 text-rose-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dica Biológica</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    Ciclos irregulares são comuns. Este monitor usa médias estatísticas para projeções.
                </p>
            </div>
          </div>
        </div>

        {/* Results / Visual Cycle */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          {results ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                 {/* Visual indicator of cycle day */}
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Flower2 className="h-48 w-48 text-rose-500" />
                 </div>

                 <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Dia do Ciclo</span>
                            <div className="text-7xl font-black text-white tracking-tighter">
                                {results.dayInCycle}<span className="text-2xl text-slate-700 ml-2">/ {cycleLength}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 font-black uppercase tracking-tight ${results.color}`}>
                                {results.phaseIcon}
                                {results.phase}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-6">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${results.color} bg-white/5 border border-white/10`}>
                            <Heart className="h-6 w-6" />
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {results.phaseDescription}
                        </p>
                    </div>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                 <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl hover:border-rose-500/20 transition-all group">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Próxima Menstruação</span>
                    <div className="text-xl font-black text-white flex items-center gap-2">
                        {results.nextPeriod}
                        <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-rose-500 transition-colors" />
                    </div>
                 </div>
                 <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl hover:border-amber-500/20 transition-all group">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Janela Fértil</span>
                    <div className="text-xl font-black text-amber-400">
                        {results.fertileWindow}
                    </div>
                 </div>
                 <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl hover:border-indigo-500/20 transition-all group">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Dia da Ovulação (Est.)</span>
                    <div className="text-xl font-black text-indigo-400">
                        {results.ovulation}
                    </div>
                 </div>
              </div>

              {/* Cycle Timeline */}
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Linha do Tempo do Ciclo</h4>
                 <div className="relative h-2 bg-white/5 rounded-full overflow-hidden flex">
                    <div 
                        className="h-full bg-rose-500 transition-all duration-1000" 
                        style={{ width: `${(parseInt(periodDuration) / parseInt(cycleLength)) * 100}%` }}
                        title="Menstruação"
                    />
                    <div 
                        className="h-full bg-emerald-400/30 transition-all duration-1000" 
                        style={{ width: `${((parseInt(cycleLength) - 14 - 3 - parseInt(periodDuration)) / parseInt(cycleLength)) * 100}%` }}
                        title="Fase Folicular"
                    />
                    <div 
                        className="h-full bg-amber-400 transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.5)]" 
                        style={{ width: `${(5 / parseInt(cycleLength)) * 100}%` }}
                        title="Fase Ovulatória"
                    />
                    <div 
                        className="h-full bg-indigo-400/30 transition-all duration-1000" 
                        style={{ width: `${((14 - 2) / parseInt(cycleLength)) * 100}%` }}
                        title="Fase Lútea"
                    />
                 </div>
                 <div className="flex justify-between mt-4">
                    <span className="text-[8px] font-black text-slate-700 uppercase">Dia 1</span>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            <span className="text-[8px] font-black text-slate-600 uppercase">Fluxo</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            <span className="text-[8px] font-black text-slate-600 uppercase">Fértil</span>
                        </div>
                    </div>
                    <span className="text-[8px] font-black text-slate-700 uppercase">Dia {cycleLength}</span>
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Informações Pendentes</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Insira a data do seu último ciclo para iniciar o monitoramento.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
