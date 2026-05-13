import React, { useState, useMemo } from "react";
import { 
  Dog, 
  User, 
  Info, 
  Activity, 
  Heart, 
  ChevronRight,
  Bone,
  Stethoscope,
  Clock
} from "lucide-react";
import { motion } from "motion/react";

type DogSize = "small" | "medium" | "large" | "giant";

interface SizeInfo {
  id: DogSize;
  label: string;
  weight: string;
  icon: string;
}

const DOG_SIZES: SizeInfo[] = [
  { id: "small", label: "Pequeno", weight: "Até 10kg", icon: "🐕" },
  { id: "medium", label: "Médio", weight: "11kg - 25kg", icon: "🐩" },
  { id: "large", label: "Grande", weight: "26kg - 45kg", icon: "🐕‍🦺" },
  { id: "giant", label: "Gigante", weight: "Mais de 45kg", icon: "🐘" },
];

const InputField = ({ label, value, onChange, icon: Icon, type = "number", min, max, unit }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-amber-500">
        <Icon className="h-5 w-5" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 px-14 outline-none focus:border-amber-500 transition-all font-black text-xl text-white tracking-tighter"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase tracking-widest">{unit}</span>
      )}
    </div>
  </div>
);

export default function DogAgeCalculatorTool() {
  const [years, setYears] = useState("3");
  const [months, setMonths] = useState("0");
  const [size, setSize] = useState<DogSize>("medium");

  const results = useMemo(() => {
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    const totalYears = y + (m / 12);

    if (totalYears <= 0) return null;

    // Modern aging logic (Simplified AVMA based)
    // First year is ~15 years, second is ~9, then roughly 4-7 depending on size
    let humanAge = 0;
    
    if (totalYears <= 1) {
      humanAge = totalYears * 15;
    } else if (totalYears <= 2) {
      humanAge = 15 + (totalYears - 1) * 9;
    } else {
      humanAge = 24;
      const remaining = totalYears - 2;
      
      if (size === "small") humanAge += remaining * 4;
      else if (size === "medium") humanAge += remaining * 5;
      else if (size === "large") humanAge += remaining * 6;
      else humanAge += remaining * 7;
    }

    let lifeStage = "";
    let lifeStageColor = "";
    let tips = "";
    
    if (totalYears < 1) {
      lifeStage = "Filhote";
      lifeStageColor = "text-blue-400";
      tips = "Fase de intenso aprendizado e socialização. Garanta as primeiras vacinas e vermifugação.";
    } else if (totalYears < 3) {
      lifeStage = "Jovem Adulto";
      lifeStageColor = "text-emerald-400";
      tips = "Pico de energia física. Necessita de exercícios regulares e treinamento de obediência.";
    } else if (totalYears < 7) {
      lifeStage = "Adulto";
      lifeStageColor = "text-amber-400";
      tips = "Fase de estabilidade. Mantenha o peso controlado e faça checkups anuais.";
    } else if (totalYears < 10) {
      lifeStage = "Sênior";
      lifeStageColor = "text-orange-500";
      tips = "Início da maturidade avançada. Dietas específicas para articulações e monitoramento cardíaco são recomendados.";
    } else {
      lifeStage = "Gerátrico";
      lifeStageColor = "text-rose-500";
      tips = "Exige cuidados especiais. Menor mobilidade e maior sensibilidade. Conforto é a prioridade.";
    }

    return {
      humanAge: Math.round(humanAge),
      lifeStage,
      lifeStageColor,
      tips,
      dogAgeText: `${y} ${y === 1 ? 'ano' : 'anos'}${m > 0 ? ` e ${m} ${m === 1 ? 'mês' : 'meses'}` : ''}`
    };
  }, [years, months, size]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black tracking-widest rounded border border-amber-500/20 uppercase mb-4">
          Cuidado Animal
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Idade Humana do Cachorro</h2>
        <p className="mt-4 text-slate-400">Descubra qual a idade equivalente do seu melhor amigo e entenda a fase da vida em que ele se encontra.</p>
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

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Porte do Animal</label>
               <div className="grid grid-cols-2 gap-2">
                  {DOG_SIZES.map(s => (
                    <button 
                       key={s.id}
                       onClick={() => setSize(s.id)}
                       className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                         size === s.id 
                           ? "bg-amber-500/10 border-amber-500/20 text-white" 
                           : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                       }`}
                    >
                       <span className="text-xl">{s.icon}</span>
                       <div className="text-center">
                          <div className={`text-[9px] font-black uppercase tracking-widest ${size === s.id ? "text-amber-400" : "text-slate-500"}`}>
                             {s.label}
                          </div>
                          <div className="text-[8px] font-bold text-slate-600 mt-0.5">{s.weight}</div>
                       </div>
                    </button>
                  ))}
               </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Você sabia?</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    Cães de grande porte envelhecem biologicamente mais rápido que os de pequeno porte a partir dos 2 anos de idade.
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
                     <Dog className="h-64 w-64 text-amber-500" />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Idade Humana Equivalente</span>
                            <div className="text-8xl font-black text-amber-500 tracking-tighter">
                                {results.humanAge}<span className="text-3xl text-slate-700 ml-3">anos</span>
                            </div>
                            <div className="mt-2 text-lg font-bold text-white/40 uppercase tracking-tighter">
                                Correspondente a {results.dogAgeText} caninos
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
                           <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Cuidados da Fase</h4>
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
                        <div className="text-sm font-black text-white">Checkup Semestral</div>
                     </div>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Activity className="h-5 w-5" />
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Energia</span>
                        <div className="text-sm font-black text-white">Atividade Moderada</div>
                     </div>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Bone className="h-5 w-5" />
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dieta</span>
                        <div className="text-sm font-black text-white">Ração {results.lifeStage}</div>
                     </div>
                  </div>
               </div>

               <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                  <div className="flex items-center gap-2">
                     <User className="h-4 w-4 text-slate-600" />
                     <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resumo Biológico</h5>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold">
                     Seu cachorro tem {results.dogAgeText}, mas seu corpo e metabolismo funcionam como os de um ser humano de {results.humanAge} anos. Entender isso ajuda a prevenir doenças e ajustar a rotina de exercícios e alimentação do pet.
                  </p>
               </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Dog className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Aguardando Dados</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Insira a idade e o porte do seu pet para calcular.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
