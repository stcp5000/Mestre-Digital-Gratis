import React, { useState, useMemo } from "react";
import { 
  Baby, 
  Calendar, 
  Info, 
  Heart, 
  ChevronRight,
  Sparkles,
  Zap,
  Weight,
  Clock
} from "lucide-react";
import { motion } from "motion/react";

const InputField = ({ label, value, onChange, icon: Icon, type = "date" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-pink-500">
        <Icon className="h-5 w-5" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 px-14 outline-none focus:border-pink-500 transition-all font-black text-xl text-white tracking-tighter"
      />
    </div>
  </div>
);

export default function PregnancyCalculatorTool() {
  const [lmpDate, setLmpDate] = useState(new Date().toISOString().split('T')[0]);

  const results = useMemo(() => {
    const lmp = new Date(lmpDate);
    if (isNaN(lmp.getTime())) return null;

    // Naegele's Rule: LMP + 7 days - 3 months + 1 year (or + 280 days)
    const edd = new Date(lmp);
    edd.setDate(lmp.getDate() + 280);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || diffDays > 300) return "invalido";

    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    let trimester = "";
    let trimesterColor = "";
    let status = "";
    
    if (weeks < 13) {
      trimester = "1º Trimestre";
      trimesterColor = "text-pink-400";
      status = "Fase embrionária e formação dos órgãos principais.";
    } else if (weeks < 27) {
      trimester = "2º Trimestre";
      trimesterColor = "text-emerald-400";
      status = "Fase de crescimento acelerado e movimentos do bebê.";
    } else {
      trimester = "3º Trimestre";
      trimesterColor = "text-amber-400";
      status = "Fase de ganho de peso e preparação para o parto.";
    }

    const progress = Math.min(100, (diffDays / 280) * 100);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    // Signs/Milestones based on weeks
    let milestone = "";
    if (weeks <= 4) milestone = "O óvulo fertilizado está se implantando no útero.";
    else if (weeks <= 8) milestone = "O coração do bebê começa a bater.";
    else if (weeks <= 12) milestone = "O bebê já tem dedos e começa a se mexer.";
    else if (weeks <= 16) milestone = "O gênero já pode ser identificado por ultrassom.";
    else if (weeks <= 20) milestone = "Você começará a sentir os primeiros chutinhos.";
    else if (weeks <= 24) milestone = "O bebê já consegue ouvir sons externos.";
    else if (weeks <= 28) milestone = "Os olhos do bebê começam a abrir e fechar.";
    else if (weeks <= 32) milestone = "O bebê está treinando a respiração.";
    else if (weeks <= 36) milestone = "O bebê está se posicionando de cabeça para baixo.";
    else milestone = "O pulmão está maduro. O bebê pode nascer a qualquer momento.";

    return {
      edd: formatDate(edd),
      weeks,
      days,
      trimester,
      trimesterColor,
      status,
      progress,
      milestone,
      remainingDays: 280 - diffDays
    };
  }, [lmpDate]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-pink-500/10 text-pink-400 text-[10px] font-black tracking-widest rounded border border-pink-500/20 uppercase mb-4">
          Cuidado Gestacional
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Calculadora Gestacional</h2>
        <p className="mt-4 text-slate-400">Acompanhe sua gravidez, descubra a data provável do parto e veja a evolução do seu bebê semana a semana.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <InputField 
              label="DUM (Data da Última Menstruação)" 
              value={lmpDate} 
              onChange={setLmpDate} 
              icon={Calendar} 
            />

            <div className="p-4 rounded-2xl bg-white/5 space-y-3">
                <div className="flex items-center gap-2 text-pink-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Informação Médica</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    O tempo de gestação é contado a partir do primeiro dia da sua última menstruação, totalizando 40 semanas.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between group">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Duração Média</span>
                    <span className="text-xs font-black text-white">280 Dias</span>
                </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          {results === "invalido" ? (
            <div className="h-full flex items-center justify-center border border-dashed border-red-500/20 rounded-3xl p-12 text-center bg-red-500/5">
              <div className="max-w-xs space-y-4">
                <Zap className="h-8 w-8 text-red-500 mx-auto" />
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Data Inválida</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">A data informada não corresponde a uma gestação ativa (máximo 40-42 semanas).</p>
              </div>
            </div>
          ) : results ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-6"
            >
               <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                     <Baby className="h-64 w-64 text-pink-500" />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Idade Gestacional</span>
                            <div className="text-7xl font-black text-white tracking-tighter">
                                {results.weeks}<span className="text-2xl text-slate-700 ml-2">Semanas</span>
                            </div>
                            {results.days > 0 && (
                                <div className="text-xl font-black text-pink-500/80 uppercase tracking-tighter mt-1">
                                    + {results.days} {results.days === 1 ? 'Dia' : 'Dias'}
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 font-black uppercase tracking-tight ${results.trimesterColor}`}>
                                <Sparkles className="h-4 w-4" />
                                {results.trimester}
                            </span>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Progresso da Gestação</span>
                            <span className="text-xs font-black text-white">{results.progress.toFixed(0)}%</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${results.progress}%` }}
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                            />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Data Provável do Parto (DPP)</span>
                     <div className="text-xl font-black text-white">{results.edd}</div>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Faltam Aproximadamente</span>
                        <div className="text-xl font-black text-pink-400">{results.remainingDays} Dias</div>
                     </div>
                     <Clock className="h-6 w-6 text-slate-800" />
                  </div>
               </div>

               <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-pink-500/10 flex items-center justify-center shrink-0 border border-pink-500/20 text-pink-500">
                     <Heart className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-sm font-black text-white uppercase tracking-widest">O que está acontecendo agora:</h4>
                     <p className="text-slate-400 text-sm leading-relaxed italic">"{results.milestone}"</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed pt-2 border-t border-white/5">
                        {results.status}
                     </p>
                  </div>
               </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Baby className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Aguardando DUM</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Informe a data da sua última menstruação para ver os detalhes da sua gestação.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
