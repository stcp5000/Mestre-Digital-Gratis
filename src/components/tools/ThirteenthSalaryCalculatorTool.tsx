import React, { useState, useMemo } from "react";
import { 
  Banknote, 
  Users, 
  Calendar,
  ArrowRight, 
  Info,
  CalendarDays,
  CreditCard,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";

const InputField = ({ label, value, onChange, icon: Icon, prefix, type = "text", min, max }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-emerald-500">
        <Icon className="h-4 w-4" />
      </div>
      {prefix && <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className={`w-full bg-[#0A0A0A] border border-white/5 rounded-xl py-4 pr-4 outline-none focus:border-emerald-500 transition-all font-bold text-lg text-white ${prefix ? "pl-16" : "pl-11"}`}
      />
    </div>
  </div>
);

export default function ThirteenthSalaryCalculatorTool() {
  const [grossSalary, setGrossSalary] = useState("3500");
  const [monthsWorked, setMonthsWorked] = useState("12");
  const [dependents, setDependents] = useState("0");

  const results = useMemo(() => {
    const gross = parseFloat(grossSalary.replace(",", ".")) || 0;
    const months = Math.min(12, Math.max(1, parseInt(monthsWorked) || 0));
    const depCount = parseInt(dependents) || 0;

    if (gross <= 0) return null;

    const proratedGross = (gross / 12) * months;

    // INSS 2024
    let inss = 0;
    const inssTiers = [
      { max: 1412, rate: 0.075 },
      { max: 2666.68, rate: 0.09 },
      { max: 4000.03, rate: 0.12 },
      { max: 7786.02, rate: 0.14 },
    ];

    let remainingInss = proratedGross > 7786.02 ? 7786.02 : proratedGross;
    let prevMax = 0;

    for (const tier of inssTiers) {
      if (remainingInss > prevMax) {
        const taxableInTier = Math.min(remainingInss, tier.max) - prevMax;
        inss += taxableInTier * tier.rate;
        prevMax = tier.max;
      }
    }

    // IRRF 2024
    const dependentDeduction = depCount * 189.59;
    const baseIRRF = proratedGross - inss - dependentDeduction;
    
    // Progressive table IRRF
    let irrfProgressive = 0;
    if (baseIRRF > 2259.20) {
      if (baseIRRF <= 2826.65) irrfProgressive = baseIRRF * 0.075 - 169.44;
      else if (baseIRRF <= 3751.05) irrfProgressive = baseIRRF * 0.15 - 381.44;
      else if (baseIRRF <= 4664.68) irrfProgressive = baseIRRF * 0.225 - 662.77;
      else irrfProgressive = baseIRRF * 0.275 - 896.00;
    }
    irrfProgressive = Math.max(0, irrfProgressive);

    // Simplified discount
    const baseSimplified = proratedGross - 564.80;
    let irrfSimplified = 0;
    if (baseSimplified > 2259.20) {
        if (baseSimplified <= 2826.65) irrfSimplified = baseSimplified * 0.075 - 169.44;
        else if (baseSimplified <= 3751.05) irrfSimplified = baseSimplified * 0.15 - 381.44;
        else if (baseSimplified <= 4664.68) irrfSimplified = baseSimplified * 0.225 - 662.77;
        else irrfSimplified = baseSimplified * 0.275 - 896.00;
    }
    irrfSimplified = Math.max(0, irrfSimplified);

    const irrf = Math.min(irrfProgressive, irrfSimplified);

    // 13th Specifics
    const firstInstallment = proratedGross / 2;
    const totalDeductions = inss + irrf;
    const secondInstallment = (proratedGross - totalDeductions) - firstInstallment;
    const totalNet = proratedGross - totalDeductions;

    return {
      gross,
      proratedGross,
      firstInstallment,
      secondInstallment,
      inss,
      irrf,
      totalNet,
      totalDeductions
    };
  }, [grossSalary, monthsWorked, dependents]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Cálculos Trabalhistas
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Cálculo de 13º Salário</h2>
        <p className="mt-4 text-slate-400">Projete o valor das suas parcelas da gratificação natalina com descontos oficiais de 2024.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid gap-4 bg-[#0A0A0A]/50 p-6 rounded-3xl border border-white/5 shadow-xl">
            <InputField 
                label="Salário Bruto" 
                value={grossSalary} 
                onChange={(v: string) => setGrossSalary(v.replace(/[^0-9,.]/g, ""))} 
                icon={Banknote} 
                prefix="R$" 
            />
            
            <InputField 
                label="Meses Trabalhados (no ano)" 
                value={monthsWorked} 
                onChange={(v: string) => setMonthsWorked(v.replace(/\D/g, ""))} 
                icon={CalendarDays} 
                type="number"
                min="1"
                max="12"
            />

            <InputField 
                label="Dependentes" 
                value={dependents} 
                onChange={(v: string) => setDependents(v.replace(/\D/g, ""))} 
                icon={Users} 
                type="number"
            />

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3">
                <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                    A primeira parcela é paga entre fev/nov e a segunda até 20 de dezembro. Os descontos de INSS/IRRF ocorrem apenas na 2ª parcela.
                </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 space-y-6">
          {results && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl group transition-all hover:border-emerald-500/20">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">1ª Parcela (Nov/Dez)</span>
                    <div className="text-4xl font-black text-white tracking-tighter mb-4">
                        {formatCurrency(results.firstInstallment)}
                    </div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase">Sem descontos incidentes</div>
                 </div>

                 <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl group transition-all hover:border-emerald-500/20">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">2ª Parcela (Dez)</span>
                    <div className="text-4xl font-black text-emerald-500 tracking-tighter mb-4">
                        {formatCurrency(results.secondInstallment)}
                    </div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase">Com descontos de INSS e IRRF</div>
                 </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Valor Total Líquido</span>
                    <div className="text-5xl font-black text-emerald-500 tracking-tighter">
                        {formatCurrency(results.totalNet)}
                    </div>
                 </div>
                 <div className="space-y-3 shrink-0 w-full md:w-auto">
                    <div className="flex justify-between md:justify-end gap-10 items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">INSS</span>
                        <span className="text-sm font-black text-amber-500">-{formatCurrency(results.inss)}</span>
                    </div>
                    <div className="flex justify-between md:justify-end gap-10 items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">IRRF</span>
                        <span className="text-sm font-black text-red-500">-{formatCurrency(results.irrf)}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between md:justify-end gap-10 items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Descontos</span>
                        <span className="text-sm font-black text-slate-300">-{formatCurrency(results.totalDeductions)}</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Prorata de {results.proratedGross === results.gross ? "12/12" : `${monthsWorked}/12`} meses</span>
                          <div className="text-lg font-black text-white">{formatCurrency(results.proratedGross)}</div>
                      </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">FGTS Total (Est.)</span>
                          <div className="text-lg font-black text-white">{formatCurrency(results.proratedGross * 0.08)}</div>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {!results && (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Aguardando Dados</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Insira seu salário e tempo trabalhado para projetar o seu 13º.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
