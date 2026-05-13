import React, { useState, useMemo, useCallback } from "react";
import { 
  User, 
  Fingerprint, 
  Mail, 
  Phone, 
  MapPin, 
  RefreshCcw, 
  Copy, 
  Check, 
  FileJson, 
  Users, 
  ShieldCheck,
  Building2,
  Calendar,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Data Generators ---

const FIRST_NAMES = ["Gabriel", "Julia", "Lucas", "Mariana", "Pedro", "Beatriz", "Thiago", "Larissa", "Rafael", "Camila", "Bruno", "Fernanda", "Mateus", "Isabela", "Gustavo", "Leticia", "Rodrigo", "Amanda", "Diego", "Paula"];
const LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa"];
const CITIES = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Salvador", "Fortaleza", "Brasília", "Recife", "Manaus"];
const STATES = ["SP", "RJ", "MG", "PR", "RS", "BA", "CE", "DF", "PE", "AM"];
const DOMAINS = ["gmail.com", "outlook.com", "yahoo.com.br", "bol.com.br", "uol.com.br", "icloud.com"];
const COMPANIES = ["Inovação Tech", "Soluções Digitais", "Global Logística", "Brasil Varejo", "Conecta Corp", "Alpha Sistemas"];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const generateCPF = (formatted = true) => {
  const n = Array.from({length: 9}, () => Math.floor(Math.random() * 10));
  
  let d1 = n.reduce((acc, curr, i) => acc + (curr * (10 - i)), 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  n.push(d1);

  let d2 = n.reduce((acc, curr, i) => acc + (curr * (11 - i)), 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  n.push(d2);

  const res = n.join('');
  return formatted ? res.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : res;
};

const generateCNPJ = (formatted = true) => {
  const n = Array.from({length: 8}, () => Math.floor(Math.random() * 10));
  n.push(0, 0, 0, 1); // 0001
  
  const weight1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d1 = n.reduce((acc, curr, i) => acc + (curr * weight1[i]), 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  n.push(d1);

  const weight2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d2 = n.reduce((acc, curr, i) => acc + (curr * weight2[i]), 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  n.push(d2);

  const res = n.join('');
  return formatted ? res.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : res;
};

const generatePhone = () => {
  const ddd = Math.floor(Math.random() * 89) + 11;
  const part1 = "9" + Math.floor(Math.random() * 8999 + 1000);
  const part2 = Math.floor(Math.random() * 8999 + 1000);
  return `(${ddd}) ${part1}-${part2}`;
};

const createPerson = () => {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const d = Math.floor(Math.random() * 28) + 1;
  const m = Math.floor(Math.random() * 12) + 1;
  const y = Math.floor(Math.random() * 40) + 1970;
  
  return {
    nome: name,
    email: `${firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.${lastName.toLowerCase()}@${pick(DOMAINS)}`,
    cpf: generateCPF(),
    celular: generatePhone(),
    nascimento: `${d < 10 ? '0'+d : d}/${m < 10 ? '0'+m : m}/${y}`,
    endereco: {
      rua: `Av. ${pick(LAST_NAMES)}, ${Math.floor(Math.random() * 999)}`,
      cidade: pick(CITIES),
      estado: pick(STATES),
      cep: `${Math.floor(Math.random() * 89999 + 10000)}-${Math.floor(Math.random() * 899 + 100)}`
    },
    empresa: pick(COMPANIES)
  };
};

export default function MockDataTool() {
  const [person, setPerson] = useState(createPerson());
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [view, setView] = useState<"single" | "bulk">("single");
  const [copied, setCopied] = useState<string | null>(null);

  const refreshSingle = useCallback(() => {
    setPerson(createPerson());
  }, []);

  const refreshBulk = useCallback(() => {
    const data = Array.from({ length: bulkCount }, () => createPerson());
    setBulkData(data);
  }, [bulkCount]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-widest rounded border border-blue-500/20 uppercase mb-4">
          Desenvolvimento & Testes
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Gerador de Dados Fictícios</h2>
        <p className="mt-4 text-slate-400">Gere identidades completas, documentos válidos e listas de dados para testes de sistemas.</p>
      </div>

      {/* View Switcher */}
      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setView("single")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "single" ? "bg-blue-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <User className="h-4 w-4" />
          Perfil Único
        </button>
        <button 
          onClick={() => { setView("bulk"); if (bulkData.length === 0) refreshBulk(); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "bulk" ? "bg-blue-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" />
          Geração em Massa
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {view === "single" ? (
          <>
            {/* Single Profile Details */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
              <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                     <Fingerprint className="h-64 w-64" />
                  </div>

                  <div className="relative z-10 space-y-8">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                           <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <User className="h-8 w-8" />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome Completo</div>
                              <div className="text-2xl font-black text-white tracking-tighter">{person.nome}</div>
                           </div>
                        </div>
                        <button 
                          onClick={refreshSingle}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/20 text-blue-500 transition-all active:rotate-180 duration-500"
                        >
                          <RefreshCcw className="h-5 w-5" />
                        </button>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                        <DataField label="CPF" value={person.cpf} icon={Fingerprint} onCopy={() => copyToClipboard(person.cpf, 'cpf')} isCopied={copied === 'cpf'} />
                        <DataField label="E-mail" value={person.email} icon={Mail} onCopy={() => copyToClipboard(person.email, 'email')} isCopied={copied === 'email'} />
                        <DataField label="Celular" value={person.celular} icon={Phone} onCopy={() => copyToClipboard(person.celular, 'tel')} isCopied={copied === 'tel'} />
                        <DataField label="Nascimento" value={person.nascimento} icon={Calendar} onCopy={() => copyToClipboard(person.nascimento, 'birth')} isCopied={copied === 'birth'} />
                     </div>

                     <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                           <MapPin className="h-4 w-4 text-blue-500" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Endereço Residencial</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl space-y-1">
                           <div className="text-white font-bold">{person.endereco.rua}</div>
                           <div className="text-xs text-slate-400">{person.endereco.cidade}, {person.endereco.estado} • {person.endereco.cep}</div>
                        </div>
                     </div>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <QuickAction label="Gerar Novo CNPJ" icon={Building2} onClick={() => copyToClipboard(generateCNPJ(), 'cnpj-quick')} status={copied === 'cnpj-quick'} />
                 <QuickAction label="Gerar Novo CPF" icon={ShieldCheck} onClick={() => copyToClipboard(generateCPF(), 'cpf-quick')} status={copied === 'cpf-quick'} />
              </div>
            </div>

            {/* JSON Output */}
            <div className="lg:col-span-12 xl:col-span-5">
               <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden h-full flex flex-col shadow-2xl">
                  <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Estrutura JSON</span>
                     </div>
                     <button 
                        onClick={() => copyToClipboard(JSON.stringify(person, null, 2), 'json')}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-blue-500 transition-all"
                     >
                        {copied === 'json' ? <Check className="h-4 w-4 bg-emerald-500 text-black rounded" /> : <Copy className="h-4 w-4" />}
                     </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto flex-1">
                     <pre className="text-blue-400">
                        {JSON.stringify(person, null, 2)}
                     </pre>
                  </div>
               </div>
            </div>
          </>
        ) : (
          /* Bulk Mode */
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
               <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
                  <div className="space-y-4 w-full sm:w-64">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quantidade de Registros (1-100)</label>
                    <input 
                       type="number" 
                       value={bulkCount}
                       onChange={(e) => setBulkCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                       className="w-full bg-[#111] border border-white/5 rounded-xl py-4 px-6 outline-none focus:border-blue-500 transition-all font-black text-xl text-white"
                    />
                  </div>
                  <button 
                     onClick={refreshBulk}
                     className="w-full sm:w-auto h-[60px] px-10 bg-blue-500 text-black rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-400 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                     <RefreshCcw className="h-4 w-4" />
                     Gerar Lista em Massa
                  </button>
               </div>

               <div className="overflow-x-auto rounded-2xl border border-white/5">
                  <table className="w-full text-left text-[11px]">
                     <thead className="bg-white/5 text-slate-500 uppercase font-black tracking-widest">
                        <tr>
                           <th className="px-6 py-4">Nome</th>
                           <th className="px-6 py-4">CPF</th>
                           <th className="px-6 py-4">E-mail</th>
                           <th className="px-6 py-4">Celular</th>
                           <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {bulkData.map((item, i) => (
                           <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 text-white font-bold">{item.nome}</td>
                              <td className="px-6 py-4 text-slate-400 font-mono">{item.cpf}</td>
                              <td className="px-6 py-4 text-slate-400">{item.email}</td>
                              <td className="px-6 py-4 text-slate-400">{item.celular}</td>
                              <td className="px-6 py-4 text-right">
                                 <button 
                                    onClick={() => copyToClipboard(JSON.stringify(item), `copy-${i}`)}
                                    className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-blue-500"
                                 >
                                    {copied === `copy-${i}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(bulkData, null, 2), 'bulk-json')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                  >
                    <FileJson className="h-3 w-3" /> {copied === 'bulk-json' ? "Copiado!" : "Copiar tudo (JSON)"}
                  </button>
                  <button 
                     onClick={() => copyToClipboard(bulkData.map(p => `${p.nome};${p.email};${p.cpf}`).join('\n'), 'bulk-csv')}
                     className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
                   >
                     <Globe className="h-3 w-3" /> {copied === 'bulk-csv' ? "Copiado!" : "Copiar tudo (CSV)"}
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DataField({ label, value, icon: Icon, onCopy, isCopied }: any) {
   return (
      <div className="space-y-2 group/field">
         <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-1.5 opacity-40">
               <Icon className="h-3 w-3" />
               <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <button onClick={onCopy} className="opacity-0 group-hover/field:opacity-100 transition-all">
               {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-slate-600 hover:text-blue-500" />}
            </button>
         </div>
         <div className="text-sm font-bold text-white bg-white/5 px-4 py-3 rounded-xl border border-white/5 truncate">
            {value}
         </div>
      </div>
   );
}

function QuickAction({ label, icon: Icon, onClick, status }: any) {
   return (
      <button 
         onClick={onClick}
         className="flex items-center gap-4 p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-blue-500/30 transition-all group"
      >
         <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
            <Icon className="h-5 w-5" />
         </div>
         <div className="text-left">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
            <div className="text-[9px] font-black text-blue-500/50 uppercase">{status ? "Copiado para Área de Transferência" : "Clique para Gerar e Copiar"}</div>
         </div>
      </button>
   );
}
