import React, { useState, useMemo } from "react";
import { 
  Scale, 
  Ruler, 
  Info, 
  Activity, 
  Heart, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

export default function BmiCalculatorTool() {
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("1.75");

  const results = useMemo(() => {
    const w = parseFloat(weight.replace(",", ".")) || 0;
    const h = parseFloat(height.replace(",", ".")) || 0;

    if (w <= 0 || h <= 0) return null;

    const bmi = w / (h * h);
    
    let classification = "";
    let color = "";
    let description = "";
    let icon = null;

    if (bmi < 18.5) {
      classification = "Abaixo do Peso";
      color = "text-blue-400";
      description = "Seu peso está abaixo do recomendado. É importante buscar orientação nutricional.";
      icon = <TrendingDown className="h-6 w-6" />;
    } else if (bmi < 25) {
      classification = "Peso Normal";
      color = "text-emerald-500";
      description = "Parabéns! Você está na faixa de peso considerada saudável pela OMS.";
      icon = <Heart className="h-6 w-6" />;
    } else if (bmi < 30) {
      classification = "Sobrepeso";
      color = "text-yellow-500";
      description = "Seu peso está um pouco acima do ideal. Atenção aos hábitos alimentares.";
      icon = <Activity className="h-6 w-6" />;
    } else if (bmi < 35) {
      classification = "Obesidade Grau I";
      color = "text-orange-500";
      description = "Sinal de alerta. Procure um profissional de saúde para orientações.";
      icon = <AlertCircle className="h-6 w-6" />;
    } else if (bmi < 40) {
      classification = "Obesidade Grau II";
      color = "text-red-500";
      description = "Risco aumentado para desenvolver diversas comorbidades.";
      icon = <AlertCircle className="h-6 w-6" />;
    } else {
      classification = "Obesidade Grau III";
      color = "text-rose-600";
      description = "Obesidade mórbida. Necessita acompanhamento médico intensivo.";
      icon = <AlertCircle className="h-6 w-6" />;
    }

    const idealWeightMin = 18.5 * (h * h);
    const idealWeightMax = 24.9 * (h * h);

    return {
      bmi,
      classification,
      color,
      description,
      icon,
      idealWeightMin,
      idealWeightMax,
      diffToIdeal: bmi > 25 ? w - idealWeightMax : bmi < 18.5 ? idealWeightMin - w : 0
    };
  }, [weight, height]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black tracking-widest rounded border border-rose-500/20 uppercase mb-4">
          Saúde e Bem-Estar
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Calculadora de IMC</h2>
        <p className="mt-4 text-slate-400">Índice de Massa Corporal: o padrão internacional para avaliar se o seu peso está saudável.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <InputField 
              label="Peso Atual" 
              value={weight} 
              onChange={setWeight} 
              icon={Scale} 
              placeholder="00"
              unit="kg"
            />
            <InputField 
              label="Altura" 
              value={height} 
              onChange={setHeight} 
              icon={Ruler} 
              placeholder="0.00"
              unit="metros"
            />

            <div className="p-4 rounded-2xl bg-white/5 space-y-3">
                <div className="flex items-center gap-2 text-rose-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Nota Importante</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    O IMC não diferencia massa magra de gordura. Atletas e grávidas devem buscar avaliações físicas completas.
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
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl group">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Seu IMC</span>
                      <div className={`text-6xl font-black ${results.color} tracking-tighter`}>
                        {results.bmi.toFixed(1)}
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                         <div className={`p-2 rounded-lg bg-white/5 ${results.color}`}>
                            {results.icon}
                         </div>
                         <span className={`text-lg font-black uppercase tracking-tight ${results.color}`}>
                            {results.classification}
                         </span>
                      </div>
                   </div>

                   <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col justify-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Faixa de Peso Ideal</span>
                      <div className="text-3xl font-black text-white tracking-tight mb-2">
                        {results.idealWeightMin.toFixed(1)}kg - {results.idealWeightMax.toFixed(1)}kg
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                        Para a sua altura ({height}m), esta é a faixa recomendada pela Organização Mundial da Saúde.
                      </p>
                   </div>
                </div>

                <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                      <div className={`h-20 w-20 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 ${results.color} bg-white/5`}>
                         <Activity className="h-10 w-10" />
                      </div>
                      <div className="text-center md:text-left space-y-2">
                         <h4 className="text-xl font-black text-white uppercase tracking-tight">Avaliação Detalhada</h4>
                         <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                           {results.description}
                           {results.diffToIdeal > 0 && results.bmi > 25 && (
                             <span className="block mt-2 font-bold text-rose-500 uppercase text-[10px]">
                               Você está aproximadamente {results.diffToIdeal.toFixed(1)}kg acima do peso ideal máximo.
                             </span>
                           )}
                           {results.diffToIdeal > 0 && results.bmi < 18.5 && (
                             <span className="block mt-2 font-bold text-blue-400 uppercase text-[10px]">
                               Você está aproximadamente {results.diffToIdeal.toFixed(1)}kg abaixo do peso ideal mínimo.
                             </span>
                           )}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                        { label: "< 18.5", status: "Magreza", color: "text-blue-400" },
                        { label: "18.5 - 24.9", status: "Normal", color: "text-emerald-500" },
                        { label: "25.0 - 29.9", status: "Sobrepeso", color: "text-yellow-500" },
                        { label: "> 30.0", status: "Obesidade", color: "text-rose-500" },
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A] text-center">
                            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">{item.label}</div>
                            <div className={`text-xs font-black uppercase ${item.color}`}>{item.status}</div>
                        </div>
                    ))}
                </div>
             </motion.div>
           ) : (
             <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
               <div className="max-w-xs space-y-4">
                 <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                    <Activity className="h-8 w-8" />
                 </div>
                 <h3 className="text-white font-black uppercase text-sm tracking-widest">Cálculo Pendente</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Insira seu peso e altura para ver sua classificação de IMC.</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
