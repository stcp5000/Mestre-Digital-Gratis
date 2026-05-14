import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  RefreshCcw, 
  Building2, 
  Info,
  Trash2,
  FileText,
  AlertCircle,
  Search,
  Activity,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CNPJData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  data_inicio_atividade: string;
  cnae_fiscal_descricao: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  capital_social: number;
}

const validateCNPJ = (cnpj: string) => {
  const clean = cnpj.replace(/\D/g, "");
  if (clean.length !== 14) return false;
  if (/^(\d)\1+$/.test(clean)) return false;

  const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0, n = 0; i < 2; i++) {
    n = 0;
    for (let j = 0; j < 12 + i; j++) n += parseInt(clean[j]) * b[j + (1 - i)];
    n = 11 - (n % 11);
    if (n >= 10) n = 0;
    if (n !== parseInt(clean[12 + i])) return false;
  }

  return true;
};

const generateCNPJ = () => {
  const n = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
  n.push(0, 0, 0, 1); // Standard branch 0001
  
  const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0, m = 0; i < 2; i++) {
    m = 0;
    for (let j = 0; j < 12 + i; j++) m += n[j] * b[j + (1 - i)];
    m = 11 - (m % 11);
    if (m >= 10) m = 0;
    n.push(m);
  }

  return n.join("");
};

const formatCNPJ = (cnpj: string) => {
  const clean = cnpj.replace(/\D/g, "");
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

export default function CNPJValidatorTool() {
  const [inputValue, setInputValue] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [view, setView] = useState<"single" | "bulk">("single");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cnpjData, setCnpjData] = useState<CNPJData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanCnpj = inputValue.replace(/\D/g, "");
  const isValid = useMemo(() => validateCNPJ(cleanCnpj), [cleanCnpj]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSingleChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 14);
    setInputValue(clean);
    setCnpjData(null);
    setError(null);
  };

  const fetchCnpjInfo = async () => {
    if (!isValid || cleanCnpj.length !== 14) return;
    
    setLoading(true);
    setError(null);
    setCnpjData(null);
    
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      if (!response.ok) throw new Error("CNPJ não encontrado ou erro na consulta.");
      const data = await response.json();
      setCnpjData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          valid: validateCNPJ(clean)
        };
      });
  }, [bulkInput]);

  const generateNew = () => {
    setInputValue(generateCNPJ());
    setCnpjData(null);
    setError(null);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-widest rounded border border-blue-500/20 uppercase mb-4">
          Empresarial & Fiscal
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Validador & Consulta CNPJ</h2>
        <p className="mt-4 text-slate-400">Verifique a validade matemática de CNPJs, gere novos números ou consulte dados oficiais em tempo real.</p>
      </div>

      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setView("single")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "single" ? "bg-blue-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Individual
        </button>
        <button 
          onClick={() => setView("bulk")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "bulk" ? "bg-blue-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <FileText className="h-4 w-4" />
          Lote
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {view === "single" ? (
          <>
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
              <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Building2 className="h-64 w-64" />
                 </div>

                 <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Número do CNPJ</label>
                      <div className="relative group/input">
                        <input
                          type="text"
                          value={inputValue ? formatCNPJ(inputValue) : ""}
                          onChange={(e) => handleSingleChange(e.target.value)}
                          className={`w-full bg-[#111] border rounded-2xl py-6 px-8 outline-none transition-all font-black text-4xl tracking-tighter ${
                            inputValue.length === 14 
                            ? (isValid ? 'border-emerald-500 text-emerald-500' : 'border-rose-500 text-rose-500') 
                            : 'border-white/5 text-white focus:border-blue-500'
                          }`}
                          placeholder="00.000.000/0001-00"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className={`p-6 rounded-2xl border transition-all ${inputValue.length === 14 ? (isValid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500') : 'bg-white/5 border-white/5 text-slate-600'}`}>
                          <div className="text-[10px] font-black uppercase tracking-widest mb-1">Status Matemático</div>
                          <div className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                             {inputValue.length < 14 ? (
                                <>Aguardando...</>
                             ) : isValid ? (
                                <><ShieldCheck className="h-5 w-5" /> Válido</>
                             ) : (
                                <><ShieldAlert className="h-5 w-5" /> Inválido</>
                             )}
                          </div>
                       </div>

                       <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col justify-center">
                          <button 
                            disabled={!isValid || loading}
                            onClick={fetchCnpjInfo}
                            className={`w-full py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                              isValid && !loading ? 'bg-blue-500 text-black hover:scale-105 active:scale-95' : 'bg-white/5 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            Consultar Dados Reais
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* API Result Display */}
              <AnimatePresence mode="wait">
                {cnpjData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 space-y-8"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Informações da Empresa</span>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-tight">{cnpjData.razao_social}</h3>
                        {cnpjData.nome_fantasia && <p className="text-slate-400 font-bold uppercase text-xs">{cnpjData.nome_fantasia}</p>}
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${cnpjData.situacao_cadastral === 'ATIVA' ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'}`}>
                        {cnpjData.situacao_cadastral}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Início de Atividade</p>
                          <p className="text-white font-bold">{new Date(cnpjData.data_inicio_atividade).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capital Social</p>
                          <p className="text-white font-bold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cnpjData.capital_social)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 md:col-span-2">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Localização</p>
                          <p className="text-white font-medium text-sm leading-relaxed">
                            {cnpjData.logradouro}, {cnpjData.numero} - {cnpjData.bairro}<br />
                            {cnpjData.municipio}, {cnpjData.uf} - {cnpjData.cep}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 md:col-span-2">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Atividade Principal</p>
                          <p className="text-slate-400 font-medium text-xs leading-relaxed uppercase">{cnpjData.cnae_fiscal_descricao}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-4"
                  >
                    <ShieldAlert className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
               <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center gap-2 text-white">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Consulta via BrasilAPI</span>
                  </div>
                  <div className="space-y-4">
                     <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        A consulta em tempo real permite obter dados cadastrais oficiais sem precisar do captcha da Receita Federal.
                     </p>
                     <div className="bg-white/5 p-4 rounded-xl">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Privacidade</div>
                        <p className="text-xs text-white">Nenhum dado é armazenado em nossos servidores. As consultas são feitas diretamente à base pública.</p>
                     </div>
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <label>Cole múltiplos CNPJs (um por linha ou separados por vírgula)</label>
                    <button onClick={() => setBulkInput("")} className="text-rose-500 hover:text-rose-400 flex items-center gap-1 transition-colors">
                       <Trash2 className="h-3 w-3" /> Limpar Lista
                    </button>
                  </div>
                  <textarea 
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    className="w-full bg-[#111] border border-white/5 rounded-2xl p-6 h-48 outline-none focus:border-blue-500 transition-all text-white font-mono text-sm resize-none"
                    placeholder={"00.000.000/0001-00\n11.111.111/0001-11\n22222222000122"}
                  />
               </div>

               {bulkResults.length > 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                       <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</div>
                          <div className="text-xl font-black text-white">{bulkResults.length}</div>
                       </div>
                       <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                          <div className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">Válidos</div>
                          <div className="text-xl font-black text-emerald-500">{bulkResults.filter(r => r.valid).length}</div>
                       </div>
                       <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
                          <div className="text-[8px] font-black text-rose-500/50 uppercase tracking-widest mb-1">Inválidos</div>
                          <div className="text-xl font-black text-rose-500">{bulkResults.filter(r => !r.valid).length}</div>
                       </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/5">
                      <table className="w-full text-left text-[11px]">
                         <thead className="bg-white/5 text-slate-500 uppercase font-black tracking-widest">
                            <tr>
                               <th className="px-6 py-4">Entrada</th>
                               <th className="px-6 py-4">CNPJ Formatado</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {bulkResults.map((res, i) => (
                               <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4 text-slate-500">{res.original}</td>
                                  <td className="px-6 py-4 text-white font-mono">{res.clean.length === 14 ? formatCNPJ(res.clean) : "---"}</td>
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
