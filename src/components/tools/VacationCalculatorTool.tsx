import React, { useState, useMemo } from "react";
import { 
  Palmtree, 
  Banknote, 
  Users, 
  MinusCircle, 
  PlusCircle, 
  Info,
  Calendar,
  Sun,
  Umbrella,
  CreditCard
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

const ToggleField = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-xl border flex items-center justify-between transition-all group ${
      active 
        ? "bg-emerald-500/10 border-emerald-500/20" 
        : "bg-white/5 border-white/5 hover:border-white/10"
    }`}
  >
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-emerald-400" : "text-slate-500"}`}>
      {label}
    </span>
    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
      active ? "border-emerald-500 bg-emerald-500" : "border-slate-700"
    }`}>
      {active && <div className="h-2 w-2 bg-black rounded-full" />}
    </div>
  </button>
);

export default function VacationCalculatorTool() {
  const [grossSalary, setGrossSalary] = useState("3500");
  const [vacationDays, setVacationDays] = useState("30");
  const [dependents, setDependents] = useState("0");
  const [sellVacation, setSellVacation] = useState(false);
  const [advanceThirteenth, setAdvanceThirteenth] = useState(false);

  const results = useMemo(() => {
    const gross = parseFloat(grossSalary.replace(",", ".")) || 0;
    const days = Math.min(30, Math.max(1, parseInt(vacationDays) || 0));
    const depCount = parseInt(dependents) || 0;

    if (gross <= 0) return null;

    // Normal vacation pay (prorated by days)
    const vacationPay = (gross / 30) * days;
    const constitutionalBonus = vacationPay / 3;
    
    // Selling 1/3 (10 days if vacation is 30)
    // Abono pecuniário = (salary / 30) * 10
    // Bonus on abono = abono / 3
    let pecuniaryAbono = 0;
    let pecuniaryBonus = 0;
    
    if (sellVacation) {
        // Typically selling 10 days
        const soldDays = 10;
        pecuniaryAbono = (gross / 30) * soldDays;
        pecuniaryBonus = pecuniaryAbono / 3;
    }

    const totalTaxable = vacationPay + constitutionalBonus;

    // INSS 2024
    let inss = 0;
    const inssTiers = [
      { max: 1412, rate: 0.075 },
      { max: 2666.68, rate: 0.09 },
      { max: 4000.03, rate: 0.12 },
      { max: 7786.02, rate: 0.14 },
    ];

    let remainingInss = totalTaxable > 7786.02 ? 7786.02 : totalTaxable;
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
    const baseIRRF = totalTaxable - inss - dependentDeduction;
    
    let irrfProgressive = 0;
    if (baseIRRF > 2259.20) {
      if (baseIRRF <= 2826.65) irrfProgressive = baseIRRF * 0.075 - 169.44;
      else if (baseIRRF <= 3751.05) irrfProgressive = baseIRRF * 0.15 - 381.44;
      else if (baseIRRF <= 4664.68) irrfProgressive = baseIRRF * 0.225 - 662.77;
      else irrfProgressive = baseIRRF * 0.275 - 896.00;
    }
    irrfProgressive = Math.max(0, irrfProgressive);

    const baseSimplified = totalTaxable - 564.80;
    let irrfSimplified = 0;
    if (baseSimplified > 2259.20) {
        if (baseSimplified <= 2826.65) irrfSimplified = baseSimplified * 0.075 - 169.44;
        else if (baseSimplified <= 3751.05) irrfSimplified = baseSimplified * 0.15 - 381.44;
        else if (baseSimplified <= 4664.68) irrfSimplified = baseSimplified * 0.225 - 662.77;
        else irrfSimplified = baseSimplified * 0.275 - 896.00;
    }
    irrfSimplified = Math.max(0, irrfSimplified);

    const irrf = Math.min(irrfProgressive, irrfSimplified);

    const netVacation = totalTaxable - inss - irrf;
    const thirteenthAdvanceVal = advanceThirteenth ? gross / 2 : 0;
    
    const finalNetResult = netVacation + pecuniaryAbono + pecuniaryBonus + thirteenthAdvanceVal;

    return {
      gross,
      vacationPay,
      constitutionalBonus,
      inss,
      irrf,
      pecuniaryAbono,
      pecuniaryBonus,
      thirteenthAdvanceVal,
      finalNetResult,
      totalDeductions: inss + irrf
    };
  }, [grossSalary, vacationDays, dependents, sellVacation, advanceThirteenth]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Cálculos Trabalhistas
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Calculadora de Férias</h2>
        <p className="mt-4 text-slate-400">Simule o valor total que você receberá ao sair de férias, incluindo terço constitucional e descontos.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="grid gap-4 bg-[#0A0A0A]/50 p-6 rounded-3xl border border-white/5 shadow-xl">
            <InputField 
                label="Salário Bruto" 
                value={grossSalary} 
                onChange={(v: string) => setGrossSalary(v.replace(/[^0-9,.]/g, ""))} 
                icon={Banknote} 
                prefix="R$" 
            />
            
            <InputField 
                label="Dias de Férias" 
                value={vacationDays} 
                onChange={(v: string) => setVacationDays(v.replace(/\D/g, ""))} 
                icon={Calendar} 
                type="number"
                min="1"
                max="30"
            />

            <InputField 
                label="Dependentes" 
                value={dependents} 
                onChange={(v: string) => setDependents(v.replace(/\D/g, ""))} 
                icon={Users} 
                type="number"
            />

            <div className="grid gap-3 pt-2">
                <ToggleField 
                    label="Vender 10 dias (Abono)" 
                    active={sellVacation} 
                    onClick={() => setSellVacation(!sellVacation)} 
                />
                <ToggleField 
                    label="Adiantar 1ª parc. 13º" 
                    active={advanceThirteenth} 
                    onClick={() => setAdvanceThirteenth(!advanceThirteenth)} 
                />
            </div>
            
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                    O pagamento das férias deve ser feito até 2 dias antes do início do período de descanso.
                </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          {results && (
            <div className="grid gap-6">
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                    <Sun className="h-32 w-32" />
                 </div>
                 
                 <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Valor Líquido a Receber</span>
                    <div className="text-6xl font-black text-emerald-500 tracking-tighter mb-8">
                        {formatCurrency(results.finalNetResult)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Proventos</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Valor das Férias</span>
                                    <span className="text-sm font-black text-white">{formatCurrency(results.vacationPay)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">1/3 Constitucional</span>
                                    <span className="text-sm font-black text-white">{formatCurrency(results.constitutionalBonus)}</span>
                                </div>
                                {results.pecuniaryAbono > 0 && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-emerald-500 uppercase">Abono Pecuniário</span>
                                            <span className="text-sm font-black text-emerald-400">{formatCurrency(results.pecuniaryAbono)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-emerald-500 uppercase">1/3 S/ Abono</span>
                                            <span className="text-sm font-black text-emerald-400">{formatCurrency(results.pecuniaryBonus)}</span>
                                        </div>
                                    </>
                                )}
                                {results.thirteenthAdvanceVal > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-blue-500 uppercase">1ª Parc. 13º Salário</span>
                                        <span className="text-sm font-black text-blue-400">{formatCurrency(results.thirteenthAdvanceVal)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Descontos</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">INSS Previdência</span>
                                    <span className="text-sm font-black text-amber-500">-{formatCurrency(results.inss)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Imposto de Renda</span>
                                    <span className="text-sm font-black text-red-500">-{formatCurrency(results.irrf)}</span>
                                </div>
                                <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Total Descontos</span>
                                    <span className="text-sm font-black text-slate-200">-{formatCurrency(results.totalDeductions)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                 <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Umbrella className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest uppercase">Período de Descanso</span>
                        <div className="text-lg font-black text-white">{vacationDays} Dias</div>
                    </div>
                 </div>
                 <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest uppercase">FGTS sobre Férias</span>
                        <div className="text-lg font-black text-white">{formatCurrency((results.vacationPay + results.constitutionalBonus) * 0.08)}</div>
                    </div>
                 </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                 <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Palmtree className="h-4 w-4 text-emerald-500" />
                 </div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">
                    Lembre-se: Como você recebe o salário antecipadamente, o seu próximo contracheque após as férias virá apenas com os dias trabalhados no mês do retorno. Organize suas finanças!
                 </p>
              </div>
            </div>
          )}

          {!results && (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="max-w-xs space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                   <Palmtree className="h-8 w-8" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Aguardando Valores</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Informe seu salário e dias de férias para calcular o recibo.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
