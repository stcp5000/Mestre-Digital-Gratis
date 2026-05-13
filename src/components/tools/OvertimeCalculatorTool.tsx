import React, { useState, useMemo } from "react";
import { 
  Clock, 
  Banknote, 
  PlusCircle, 
  Info,
  Calendar,
  Zap,
  Moon,
  ArrowRight
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

export default function OvertimeCalculatorTool() {
  const [grossSalary, setGrossSalary] = useState("3500");
  const [monthlyHours, setMonthlyHours] = useState("220");
  const [overtimeQuantity, setOvertimeQuantity] = useState("10");
  const [overtimePercentage, setOvertimePercentage] = useState("50");
  const [nightShiftHours, setNightShiftHours] = useState("0");
  const [workingDays, setWorkingDays] = useState("22"); // For DSR calculation
  const [restDays, setRestDays] = useState("4"); // Sundays + Holidays for DSR

  const results = useMemo(() => {
    const gross = parseFloat(grossSalary.replace(",", ".")) || 0;
    const hours = parseFloat(monthlyHours) || 220;
    const otQty = parseFloat(overtimeQuantity) || 0;
    const otPerc = parseFloat(overtimePercentage) || 0;
    const nsHours = parseFloat(nightShiftHours) || 0;
    const wDays = parseFloat(workingDays) || 22;
    const rDays = parseFloat(restDays) || 4;

    if (gross <= 0 || hours <= 0) return null;

    const hourlyRate = gross / hours;
    
    // Night shift additional (20% usually)
    const nsRate = hourlyRate * 1.2 * 0.2; // The additional part only
    const totalNightShift = nsHours * nsRate;

    // Overtime
    const otRate = hourlyRate * (1 + (otPerc / 100));
    const totalOvertime = otQty * otRate;

    // DSR (Descanso Semanal Remunerado)
    // Formula: (Total Extras / Working Days) * Rest Days
    const dsr = wDays > 0 ? ((totalOvertime + totalNightShift) / wDays) * rDays : 0;

    const totalGrossExtras = totalOvertime + totalNightShift + dsr;

    return {
      hourlyRate,
      otRate,
      totalOvertime,
      totalNightShift,
      dsr,
      totalGrossExtras,
      wDays,
      rDays
    };
  }, [grossSalary, monthlyHours, overtimeQuantity, overtimePercentage, nightShiftHours, workingDays, restDays]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Cálculos Trabalhistas
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Calculadora de Horas Extras</h2>
        <p className="mt-4 text-slate-400">Calcule o valor das suas horas extras, adicional noturno e o reflexo no DSR.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="grid gap-4 bg-[#0A0A0A]/50 p-6 rounded-3xl border border-white/5 shadow-xl">
            <InputField 
                label="Salário Bruto" 
                value={grossSalary} 
                onChange={(v: string) => setGrossSalary(v.replace(/[^0-9,.]/g, ""))} 
                icon={Banknote} 
                prefix="R$" 
            />
            
            <div className="grid grid-cols-2 gap-4">
                <InputField 
                    label="Horas Mensais" 
                    value={monthlyHours} 
                    onChange={(v: string) => setMonthlyHours(v.replace(/\D/g, ""))} 
                    icon={Clock} 
                    type="number"
                />
                <InputField 
                    label="Qtd. Horas Extras" 
                    value={overtimeQuantity} 
                    onChange={(v: string) => setOvertimeQuantity(v.replace(/[^0-9,.]/g, ""))} 
                    icon={PlusCircle} 
                    type="number"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField 
                    label="% Hora Extra" 
                    value={overtimePercentage} 
                    onChange={(v: string) => setOvertimePercentage(v.replace(/\D/g, ""))} 
                    icon={Zap} 
                    type="number"
                />
                <InputField 
                    label="Horas Noturnas" 
                    value={nightShiftHours} 
                    onChange={(v: string) => setNightShiftHours(v.replace(/[^0-9,.]/g, ""))} 
                    icon={Moon} 
                    type="number"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField 
                    label="Dias Úteis (DSR)" 
                    value={workingDays} 
                    onChange={(v: string) => setWorkingDays(v.replace(/\D/g, ""))} 
                    icon={Calendar} 
                    type="number"
                />
                <InputField 
                    label="D. de Descanso" 
                    value={restDays} 
                    onChange={(v: string) => setRestDays(v.replace(/\D/g, ""))} 
                    icon={Calendar} 
                    type="number"
                />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            {results && (
                <div className="grid gap-6">
                    <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <Clock className="h-48 w-48" />
                        </div>
                        
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Total Extra Bruto</span>
                            <div className="text-6xl font-black text-emerald-500 tracking-tighter mb-8">
                                {formatCurrency(results.totalGrossExtras)}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Valores Unitários</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Hora Normal</span>
                                            <span className="text-sm font-black text-white">{formatCurrency(results.hourlyRate)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Hora Extra ({overtimePercentage}%)</span>
                                            <span className="text-sm font-black text-white">{formatCurrency(results.otRate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Composição do Total</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Extras</span>
                                            <span className="text-sm font-black text-white">{formatCurrency(results.totalOvertime)}</span>
                                        </div>
                                        {results.totalNightShift > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Adic. Noturno</span>
                                                <span className="text-sm font-black text-white">{formatCurrency(results.totalNightShift)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-emerald-500 uppercase">Reflexo DSR</span>
                                            <span className="text-sm font-black text-emerald-400">{formatCurrency(results.dsr)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Info className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">
                            O cálculo do DSR considera a proporção entre os dias de descanso (domingos e feriados) e os dias úteis do mês trabalhado.
                        </p>
                    </div>
                </div>
            )}

            {!results && (
                <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
                    <div className="max-w-xs space-y-4">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 text-slate-700">
                            <Clock className="h-8 w-8" />
                        </div>
                        <h3 className="text-white font-black uppercase text-sm tracking-widest">Aguardando Dados</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Insira sua jornada e o salário bruto para calcular suas horas extras.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
