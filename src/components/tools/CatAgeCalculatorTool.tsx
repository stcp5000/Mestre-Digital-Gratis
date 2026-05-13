import React, { useState, useMemo } from "react";
import { 
  Cat, 
  User, 
  Info, 
  Activity, 
  Heart, 
  ChevronRight,
  Fish,
  Stethoscope,
  Clock
} from "lucide-react";
import { motion } from "motion/react";

const InputField = ({ label, value, onChange, icon: Icon, type = "number", min, max, unit }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-purple-500">
        <Icon className="h-5 w-5" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 px-14 outline-none focus:border-purple-500 transition-all font-black text-xl text-white tracking-tighter"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase tracking-widest">{unit}</span>
      )}
    </div>
  </div>
);

export default function CatAgeCalculatorTool() {
  const [years, setYears] = useState("3");
  const [months, setMonths] = useState("0");

  const results = useMemo(() => {
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    const totalYears = y + (m / 12);

    if (totalYears <= 0) return null;

    // Cat aging logic
    // 1st year = 15 human years
    // 2nd year = +9 (24 total)
    // Thereafter = +4 per year
    let humanAge = 0;
    
    if (totalYears <= 1) {
      humanAge = totalYears * 15;
    } else if (totalYears <= 2) {
      humanAge = 15 + (totalYears - 1) * 9;
    } else {
      humanAge = 24 + (totalYears - 2) * 4;
    }

    let lifeStage = "";
    let lifeStageColor = "";
    let tips = "";
    
    if (totalYears < 0.5) {
      lifeStage = "Filhote (Kitten)";
      lifeStageColor = "text-blue-400";
      tips = "Fase de crescimento rápido. Requer alimentação específica para filhotes e muitas brincadeiras para socialização.";
    } else if (totalYears < 2) {
      lifeStage = "Júnior";
      lifeStageColor = "text-emerald-400";
      tips = "O gato está terminando seu crescimento. Mantenha as vacinas em dia e estimule o exercício físico.";
    } else if (totalYears < 7) {
      lifeStage = "Prime (Adulto)";
      lifeStageColor = "text-amber-400";
      tips = "Fase de auge físico. Monitore o peso para evitar obesidade e mantenha a higiene bucal.";
    } else if (totalYears < 11) {
      lifeStage = "Mature (Maduro)";
      lifeStageColor = "text-orange-500";
      tips = "Equivalente a um humano de meia-idade. Checkups preventivos tornam-se mais importantes.";
    } else if (totalYears < 15) {
      lifeStage = "Senior";
      lifeStageColor = "text-indigo-400";
      tips = "Necessita de ambientes tranquilos e acompanhamento veterinário close-up para rins e articulações.";
    } else {
      lifeStage = "Super Senior";
      lifeStageColor = "text-rose-500";
      tips = "Cuidados geriátricos intensivos. Adapte a casa para fácil acesso a comida e caixa de areia.";
    }

    return {
      humanAge: Math.round(humanAge),
      lifeStage,
      lifeStageColor,
      tips,
      catAgeText: `${y} ${y === 1 ? 'ano' : 'anos'}${m > 0 ? ` e ${m} ${m === 1 ? 'mês' : 'meses'}` : ''}`
    };
  }, [years, months]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-black tracking-widest rounded border border-purple-500/20 uppercase mb-4">
          Cuidado Animal
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Idade Humana do Gato</h2>
        <p className="mt-4 text-slate-400">Converta a idade do seu gato para anos humanos e saiba como cuidar dele em cada etapa da vida.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <InputField 
                 label="Anos" 
                 value={years} 
                 onChange={setYears} 
                 icon={Clock} 
                 type="number"
                 min="0"
               />
               <InputField 
                 label="Meses" 
                 value={months} 
                 onChange={setMonths} 
                 icon={Clock} 
                 type="number"
                 min="0"
                 max="11"
               />
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-3">
                <div className="flex items-center gap-2 text-purple-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Metodologia CatCare</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    Diferente da crença popular de '1 ano equivale a 7', o envelhecimento felino é muito mais acelerado nos primeiros dois anos.
                </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          {results ? (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
            >
               <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                     <Cat className="h-64 w-64 text-purple-500" />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Idade Humana Equivalente</span>
                            <div className="text-8xl font-black text-purple-500 tracking-tighter">
                                {results.humanAge}<span className="text-3xl text-slate-700 ml-3">anos</span>
                            </div>
                            <div className="mt-2 text-lg font-bold text-white/40 uppercase tracking-tighter">
                                Correspondente a {results.catAgeText} felinos
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 font-black uppercase tracking-tight ${results.lifeStageColor}`}>
                                <Activity className="h-4 w-4" />
                                {results.lifeStage}
                            </span>
                        </div>
                     </div>

                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-6 items-center">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${results.lifeStageColor} bg-white/5 border border-white/10`}>
                           <Heart className="h-7 w-7" />
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Guia de Bem-Estar</h4>
                           <p className="text-slate-400 text-sm leading-relaxed italic">"{results.tips}"</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Stethoscope className="h-5 w-5" />
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Saúde</span>
                        <div className="text-sm font-black text-white">Checkup Anual</div>
                     </div>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Activity className="h-5 w-5" />
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Energia</span>
                        <div className="text-sm font-black text-white">Brincadeiras Diárias</div>
                     </div>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Fish className="h-5 w-5" />
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nutrição</span>
                        <div className="text-sm font-black text-white">Ração Premium</div>
                     </div>
                  </div>
               </div>

               <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                  <div className="flex items-center gap-2">
                     <User className="h-4 w-4 text-slate-600" />
                     <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fisiologia Felina</h5>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold">
                     Gatos envelhecem de forma graciosa, mas escondem muito bem sinais de dor ou desconforto. Ao atingir a fase Sênior (11+ anos) ou equivalente a 60 anos humanos, a atenção aos rins e hidratação deve ser redobrada.
                  </p>
               </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Cat className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Aguardando Dados</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Insira a idade cronológica do seu gato para converter.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
