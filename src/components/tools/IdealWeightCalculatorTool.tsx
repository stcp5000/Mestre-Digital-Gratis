import React, { useState, useMemo } from "react";
import { 
  Scale, 
  Ruler, 
  Users, 
  Info, 
  Activity,
  Venus,
  Mars,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

const InputField = ({ label, value, onChange, icon: Icon, placeholder, unit }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-rose-500">
        <Icon className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9,.]/g, ""))}
        placeholder={placeholder}
        className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 pl-14 pr-16 outline-none focus:border-rose-500 transition-all font-black text-2xl text-white tracking-tighter"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase tracking-widest">{unit}</span>
    </div>
  </div>
);

const GenderToggle = ({ active, onChange }: { active: "m" | "f", onChange: (g: "m" | "f") => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gênero Biológico</label>
    <div className="grid grid-cols-2 gap-2">
      <button 
        onClick={() => onChange("m")}
        className={`p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${
          active === "m" 
            ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
            : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
        }`}
      >
        <Mars className="h-5 w-5" />
        <span className="text-[10px] font-black uppercase tracking-widest">Masculino</span>
      </button>
      <button 
        onClick={() => onChange("f")}
        className={`p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${
          active === "f" 
            ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
            : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
        }`}
      >
        <Venus className="h-5 w-5" />
        <span className="text-[10px] font-black uppercase tracking-widest">Feminino</span>
      </button>
    </div>
  </div>
);

export default function IdealWeightCalculatorTool() {
  const [height, setHeight] = useState("1.75");
  const [gender, setGender] = useState<"m" | "f">("m");

  const results = useMemo(() => {
    const h = parseFloat(height.replace(",", ".")) || 0;
    if (h <= 0) return null;

    const heightInInches = h * 39.3701;
    const excessHeightInches = Math.max(0, heightInInches - 60);

    // Formulas for Ideal Weight (Traditional)
    // Devine Formula
    const devine = gender === "m" 
      ? 50 + (2.3 * excessHeightInches) 
      : 45.5 + (2.3 * excessHeightInches);

    // Robinson Formula
    const robinson = gender === "m" 
      ? 52 + (1.9 * excessHeightInches) 
      : 49 + (1.7 * excessHeightInches);

    // Miller Formula
    const miller = gender === "m" 
      ? 56.2 + (1.41 * excessHeightInches) 
      : 53.1 + (1.36 * excessHeightInches);

    // Hamwi Formula
    const hamwi = gender === "m" 
      ? 48 + (2.7 * excessHeightInches) 
      : 45.5 + (2.2 * excessHeightInches);

    // WHO IMC range approach
    const whoMin = 18.5 * (h * h);
    const whoMax = 24.9 * (h * h);

    return {
      devine,
      robinson,
      miller,
      hamwi,
      whoMin,
      whoMax,
      average: (devine + robinson + miller + hamwi) / 4
    };
  }, [height, gender]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black tracking-widest rounded border border-rose-500/20 uppercase mb-4">
          Saúde e Bem-Estar
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Cálculo de Peso Ideal</h2>
        <p className="mt-4 text-slate-400">Descubra a meta de peso adequada para sua estrutura física baseada nas principais fórmulas médicas.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <InputField 
              label="Altura" 
              value={height} 
              onChange={setHeight} 
              icon={Ruler} 
              placeholder="0.00"
              unit="metros"
            />
            
            <GenderToggle active={gender} onChange={setGender} />

            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-3">
                <div className="flex items-center gap-2 text-rose-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Fórmulas Médicas</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    Utilizamos os métodos de Devine, Robinson, Miller e Hamwi, além da recomendação da Organização Mundial da Saúde.
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
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                     <Users className="h-48 w-48" />
                  </div>
                  
                  <div className="relative z-10">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 font-mono">Consenso Médio</span>
                     <div className="text-7xl font-black text-rose-500 tracking-tighter mb-8">
                        {results.average.toFixed(1)}<span className="text-3xl ml-2">kg</span>
                     </div>

                     <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Distribuição por Fórmula</h4>
                           <div className="space-y-3">
                              {[
                                { name: "Devine", val: results.devine },
                                { name: "Robinson", val: results.robinson },
                                { name: "Miller", val: results.miller },
                                { name: "Hamwi", val: results.hamwi },
                              ].map(f => (
                                <div key={f.name} className="flex justify-between items-center group/item hover:bg-white/5 p-1 rounded transition-colors">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">{f.name}</span>
                                  <span className="text-sm font-black text-white">{f.val.toFixed(1)} kg</span>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Padrão OMS (IMC 18.5 - 24.9)</h4>
                           <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                              <span className="text-lg font-black text-white">{results.whoMin.toFixed(1)}kg</span>
                              <ChevronRight className="h-4 w-4 text-slate-700" />
                              <span className="text-lg font-black text-white">{results.whoMax.toFixed(1)}kg</span>
                           </div>
                           <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                             Esta é a faixa de peso onde seu risco de doenças metabólicas é estatisticamente menor.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0A0A] flex items-center gap-4 group">
                     <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-black transition-colors">
                        <Scale className="h-5 w-5" />
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sugestão de Meta</span>
                        <div className="text-lg font-black text-white">Foco: {results.devine.toFixed(1)} kg</div>
                     </div>
                  </div>
                  <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0A0A] flex items-center gap-4 group">
                     <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Activity className="h-5 w-5" />
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status Geral</span>
                        <div className="text-lg font-black text-white">Estrutura {gender === "m" ? "Masculina" : "Feminina"}</div>
                     </div>
                  </div>
               </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Users className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Dados Necessários</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Insira sua altura para projetar o seu peso ideal.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
