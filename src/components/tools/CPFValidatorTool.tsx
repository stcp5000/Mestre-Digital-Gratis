import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  RefreshCcw, 
  MapPin, 
  Info,
  Trash2,
  FileText,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const REGIONS: { [key: string]: string } = {
  "1": "DF, GO, MT, MS e TO",
  "2": "AC, AM, AP, PA, RO e RR",
  "3": "CE, MA e PI",
  "4": "AL, PB, PE e RN",
  "5": "BA e SE",
  "6": "MG",
  "7": "ES e RJ",
  "8": "SP",
  "9": "PR e SC",
  "0": "RS"
};

const validateCPF = (cpf: string) => {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1+$/.test(clean)) return false;

  let sum = 0;
  for (let i = 1; i <= 9; i++) sum += parseInt(clean.substring(i - 1, i)) * (11 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(clean.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(clean.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(clean.substring(10, 11))) return false;

  return true;
};

const generateCPF = () => {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  
  let d1 = n.reduce((acc, curr, i) => acc + (curr * (10 - i)), 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  n.push(d1);

  let d2 = n.reduce((acc, curr, i) => acc + (curr * (11 - i)), 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  n.push(d2);

  return n.join("");
};

const formatCPF = (cpf: string) => {
  const clean = cpf.replace(/\D/g, "");
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export default function CPFValidatorTool() {
  const [inputValue, setInputValue] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [view, setView] = useState<"single" | "bulk">("single");
  const [copied, setCopied] = useState(false);

  const cleanCpf = inputValue.replace(/\D/g, "");
  const isValid = useMemo(() => validateCPF(cleanCpf), [cleanCpf]);
  const regionCode = cleanCpf.length >= 9 ? cleanCpf[8] : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSingleChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 11);
    setInputValue(clean);
  };

  const bulkResults = useMemo(() => {
    if (!bulkInput) return [];
    const lines = bulkInput.split(/[\n,;]/);
    return lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const clean = line.replace(/\D/g, "");
        return {
          original: line,
          clean,
          valid: validateCPF(clean)
        };
      });
  }, [bulkInput]);

  const generateNew = () => {
    setInputValue(generateCPF());
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-widest rounded border border-blue-500/20 uppercase mb-4">
          Segurança & Verificação
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Validador de CPF</h2>
        <p className="mt-4 text-slate-400">Valide, gere e processe CPFs em massa com verificação de dígitos e região de emissão.</p>
      </div>

      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setView("single")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "single" ? "bg-blue-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Validação Única
        </button>
        <button 
          onClick={() => setView("bulk")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "bulk" ? "bg-blue-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <FileText className="h-4 w-4" />
          Procesamento em Massa
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {view === "single" ? (
          <>
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
              <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck className="h-64 w-64" />
                 </div>

                 <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Número do CPF</label>
                      <div className="relative group/input">
                        <input
                          type="text"
                          value={inputValue ? formatCPF(inputValue) : ""}
                          onChange={(e) => handleSingleChange(e.target.value)}
                          className={`w-full bg-[#111] border rounded-2xl py-6 px-8 outline-none transition-all font-black text-4xl tracking-tighter ${
                            inputValue.length === 11 
                            ? (isValid ? 'border-emerald-500 text-emerald-500' : 'border-rose-500 text-rose-500') 
                            : 'border-white/5 text-white focus:border-blue-500'
                          }`}
                          placeholder="000.000.000-00"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                           <button onClick={generateNew} className="p-3 rounded-xl bg-white/5 hover:bg-blue-500/10 text-slate-500 hover:text-blue-500 transition-all active:rotate-180 duration-500">
                              <RefreshCcw className="h-5 w-5" />
                           </button>
                           <button onClick={() => copyToClipboard(inputValue)} className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500 transition-all">
                              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                           </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className={`p-6 rounded-2xl border transition-all ${inputValue.length === 11 ? (isValid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500') : 'bg-white/5 border-white/5 text-slate-600'}`}>
                          <div className="text-[10px] font-black uppercase tracking-widest mb-1">Status de Validez</div>
                          <div className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                             {inputValue.length < 11 ? (
                                <>Aguardando...</>
                             ) : isValid ? (
                                <><ShieldCheck className="h-5 w-5" /> CPF Válido</>
                             ) : (
                                <><ShieldAlert className="h-5 w-5" /> CPF Inválido</>
                             )}
                          </div>
                       </div>

                       <div className={`p-6 rounded-2xl border transition-all ${isValid && regionCode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                          <div className="text-[10px] font-black uppercase tracking-widest mb-1">Origem (Fiscal)</div>
                          <div className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                             {isValid && regionCode ? (
                                <><MapPin className="h-5 w-5" /> Região {regionCode}</>
                             ) : (
                                <>N/A</>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {isValid && regionCode && (
                <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-6 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <Info className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Estados de Origem</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase leading-relaxed">
                      Este CPF foi emitido em: <span className="text-blue-400">{REGIONS[regionCode]}</span>. O 9º dígito identifica a região fiscal.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
               <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center gap-2 text-white">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Dicas Pro</span>
                  </div>
                  <div className="space-y-4">
                     <div className="bg-white/5 p-4 rounded-xl">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Formatação</div>
                        <p className="text-xs text-white">O sistema aceita entradas com pontos e traços, limpando automaticamente para a validação matemática.</p>
                     </div>
                     <div className="bg-white/5 p-4 rounded-xl">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Segurança</div>
                        <p className="text-xs text-white">Nunca armazene CPFs em texto plano em seus sistemas. Utilize hashing ou criptografia para dados sensíveis.</p>
                     </div>
                  </div>
               </div>
            </div>
          </>
        ) : (
          /* Bulk Mode */
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <label>Cole múltiplos CPFs (um por linha ou separados por vírgula)</label>
                    <button onClick={() => setBulkInput("")} className="text-rose-500 hover:text-rose-400 flex items-center gap-1 transition-colors">
                       <Trash2 className="h-3 w-3" /> Limpar Lista
                    </button>
                  </div>
                  <textarea 
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    className="w-full bg-[#111] border border-white/5 rounded-2xl p-6 h-48 outline-none focus:border-blue-500 transition-all text-white font-mono text-sm resize-none"
                    placeholder={"444.444.444-44\n555.555.555-55, 66666666666"}
                  />
               </div>

               {bulkResults.length > 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                       <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Processado</div>
                          <div className="text-xl font-black text-white">{bulkResults.length}</div>
                       </div>
                       <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                          <div className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">CPFs Válidos</div>
                          <div className="text-xl font-black text-emerald-500">{bulkResults.filter(r => r.valid).length}</div>
                       </div>
                       <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
                          <div className="text-[8px] font-black text-rose-500/50 uppercase tracking-widest mb-1">CPFs Inválidos</div>
                          <div className="text-xl font-black text-rose-500">{bulkResults.filter(r => !r.valid).length}</div>
                       </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/5">
                      <table className="w-full text-left text-[11px]">
                         <thead className="bg-white/5 text-slate-500 uppercase font-black tracking-widest">
                            <tr>
                               <th className="px-6 py-4">Entrada Bruta</th>
                               <th className="px-6 py-4">CPF Limpo</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {bulkResults.map((res, i) => (
                               <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4 text-slate-500">{res.original}</td>
                                  <td className="px-6 py-4 text-white font-mono">{res.clean.length > 0 ? formatCPF(res.clean) : "---"}</td>
                                  <td className="px-6 py-4">
                                     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${res.valid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {res.valid ? <ShieldCheck className="h-2 w-2" /> : <ShieldAlert className="h-2 w-2" />}
                                        {res.valid ? "Válido" : "Inválido"}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <button 
                                        onClick={() => copyToClipboard(res.clean)}
                                        className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-blue-500"
                                     >
                                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                     </button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={() => copyToClipboard(JSON.stringify(bulkResults, null, 2))}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                        >
                            <RefreshCcw className="h-3 w-3" /> Copiar Resultados (JSON)
                        </button>
                        <button 
                            onClick={() => copyToClipboard(bulkResults.map(r => `${r.clean};${r.valid ? 'Valido' : 'Invalido'}`).join('\n'))}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
                        >
                            <FileText className="h-3 w-3" /> Copiar para Excel (CSV)
                        </button>
                    </div>
                  </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
