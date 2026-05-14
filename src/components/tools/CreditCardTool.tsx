import React, { useState, useMemo, useEffect } from "react";
import { 
  CreditCard, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  RefreshCcw, 
  FileText, 
  Trash2, 
  Info,
  Layers,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Logic ---

const getCardBrand = (number: string) => {
  const clean = number.replace(/\D/g, "");
  if (!clean) return "unknown";

  const brands: Record<string, RegExp> = {
    visa: /^4/,
    mastercard: /^(5[1-5]|2[2-7])/,
    amex: /^3[47]/,
    diners: /^3(?:0[0-5]|[68])/,
    discover: /^6(?:011|5)/,
    jcb: /^(?:2131|1800|35)/,
    hypercard: /^(606282|637095|637568|637599|637609|637612)/,
    elo: /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|90(00|01|02|03|04|05|06|07|08|09))|627780|63(6297|6368)|650(0(3(1|2|3|5|6|7|8|9)|4([0-9])|5(0|1))|4(0[5-9]|3[0-9]|8[5-9]|9[0-9])|5(0[0-9]|1[0-9]|2[0-9]|3[0-8]|4[1-9]|5[0-9]|7[0-9]|8[0-9]|9[0-8])|7(0[0-9]|1[0-9]|2[0-7])|9(0[1-9]|1[0-9]|2[0-8]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-8])))/,
    unionpay: /^62/,
  };

  for (const [brand, regex] of Object.entries(brands)) {
    if (regex.test(clean)) return brand;
  }
  return "unknown";
};

const validateLuhn = (number: string) => {
  const clean = number.replace(/\D/g, "");
  if (clean.length < 13) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const generateCard = (brand: string = 'visa') => {
  const prefixes: Record<string, string[]> = {
    visa: ['4539', '4556', '4916', '4532', '4485'],
    mastercard: ['51', '52', '53', '54', '55', '2221', '2229'],
    amex: ['34', '37'],
    discover: ['6011'],
  };

  const selectedPrefix = prefixes[brand] || prefixes.visa;
  const prefix = selectedPrefix[Math.floor(Math.random() * selectedPrefix.length)];
  let number = prefix;
  const length = brand === 'amex' ? 15 : 16;

  while (number.length < length - 1) {
    number += Math.floor(Math.random() * 10).toString();
  }

  // Calculate check digit
  for (let i = 0; i <= 9; i++) {
    if (validateLuhn(number + i)) {
      number += i;
      break;
    }
  }

  return number;
};

const formatCardNumber = (number: string) => {
  const clean = number.replace(/\D/g, "");
  const brand = getCardBrand(clean);
  
  if (brand === 'amex') {
    return clean.replace(/^(\d{4})(\d{6})(\d{5})$/, "$1 $2 $3").trim();
  }
  return clean.replace(/(\d{4})/g, "$1 ").trim();
};

export default function CreditCardTool() {
  const [cardNumber, setCardNumber] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [bulkInput, setBulkInput] = useState("");
  const [view, setView] = useState<"single" | "bulk">("single");
  const [copied, setCopied] = useState(false);

  const brand = useMemo(() => getCardBrand(cardNumber), [cardNumber]);
  const isValid = useMemo(() => validateLuhn(cardNumber), [cardNumber]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    setCardNumber(clean);
  };

  const generateNew = (brandName: string) => {
    setCardNumber(generateCard(brandName));
    setIsFlipped(false);
  };

  const bulkResults = useMemo(() => {
    if (!bulkInput) return [];
    return bulkInput.split(/[\n,;]/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const clean = line.replace(/\D/g, "");
        return {
          original: line,
          clean,
          brand: getCardBrand(clean),
          valid: validateLuhn(clean)
        };
      });
  }, [bulkInput]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-widest rounded border border-indigo-500/20 uppercase mb-4">
          Financeiro & Segurança
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Validador de Cartão</h2>
        <p className="mt-4 text-slate-400">Verifique a validade de cartões (Luhn), identifique a bandeira e gere números para testes.</p>
      </div>

      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setView("single")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "single" ? "bg-indigo-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Individual
        </button>
        <button 
          onClick={() => setView("bulk")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "bulk" ? "bg-indigo-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <Layers className="h-4 w-4" />
          Em Massa
        </button>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        {view === "single" ? (
          <>
            <div className="lg:col-span-12 xl:col-span-6 space-y-8">
              {/* Card Visualization */}
              <div 
                className="relative h-64 w-full cursor-pointer perspective-1000 group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div 
                  className="relative h-full w-full transition-all duration-700 preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Front */}
                  <div className={`absolute inset-0 backface-hidden rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10 transition-colors duration-500 ${
                    brand === 'visa' ? 'bg-gradient-to-br from-[#1a1a1a] to-[#2563eb]' :
                    brand === 'mastercard' ? 'bg-gradient-to-br from-[#1a1a1a] to-[#ea580c]' :
                    brand === 'amex' ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0d9488]' :
                    'bg-[#1a1a1a]'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30 overflow-hidden">
                        <div className="w-4 h-full border-r border-yellow-500/20" />
                        <div className="w-4 h-full border-r border-yellow-500/20" />
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-1">Bandeira</span>
                         <span className="text-xl font-black italic uppercase tracking-tighter text-white">
                           {brand !== "unknown" ? brand : "---"}
                         </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-2xl font-black tracking-[0.2em] text-white flex justify-between h-8 items-center font-mono">
                         {cardNumber.length > 0 ? (
                           showNumbers ? formatCardNumber(cardNumber).padEnd(brand === 'amex' ? 17 : 19, " ") : 
                           formatCardNumber(cardNumber.replace(/\d/g, "*"))
                         ) : "•••• •••• •••• ••••"}
                      </div>
                      <div className="flex justify-between items-end">
                         <div className="space-y-1">
                            <span className="text-[8px] font-bold uppercase tracking-widest opacity-40 block">Portador</span>
                            <span className="text-xs font-bold uppercase tracking-widest">USER TEST</span>
                         </div>
                         <div className="space-y-1 text-right">
                            <span className="text-[8px] font-bold uppercase tracking-widest opacity-40 block">Validade</span>
                            <span className="text-xs font-bold font-mono">12/28</span>
                         </div>
                      </div>
                    </div>

                    {/* Subtle Texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rounded-[2.5rem] bg-[#111] p-0 flex flex-col justify-start rotateY-180 overflow-hidden border border-white/10 shadow-2xl">
                    <div className="mt-10 h-14 bg-black/80 w-full" />
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 grow bg-white shadow-inner flex items-center justify-end px-4">
                          <span className="text-black italic font-mono font-bold">123</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">CVV</span>
                      </div>
                      <p className="text-[8px] text-slate-500 leading-relaxed max-w-[200px]">
                        Este cartão é fictício e gerado apenas para fins de teste de software. Não possui valor financeiro e não deve ser utilizado em transações reais.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 space-y-8 relative overflow-hidden">
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Número do Cartão</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowNumbers(!showNumbers)} 
                          className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-colors"
                        >
                          {showNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                   </div>
                   <div className="relative group/input">
                    <input
                      type="text"
                      value={formatCardNumber(cardNumber)}
                      onChange={(e) => handleCardChange(e.target.value)}
                      className={`w-full bg-[#111] border rounded-2xl py-5 px-6 outline-none transition-all font-black text-2xl tracking-tighter ${
                        cardNumber.length >= 13 
                        ? (isValid ? 'border-emerald-500 text-emerald-500' : 'border-rose-500 text-rose-500') 
                        : 'border-white/5 text-white focus:border-indigo-500'
                      }`}
                      placeholder="0000 0000 0000 0000"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                        <button onClick={() => setCardNumber("")} className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-600 hover:text-rose-500 transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => copyToClipboard(cardNumber)} className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/10 text-slate-600 hover:text-emerald-500 transition-all">
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                    </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {['visa', 'mastercard', 'amex', 'discover'].map((b) => (
                      <button 
                        key={b}
                        onClick={() => generateNew(b)}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
                      >
                         <Zap className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                         <span className="text-[8px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{b}</span>
                      </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-12 xl:col-span-6 space-y-6">
               <div className="grid gap-6 sm:grid-cols-2">
                  <div className={`p-8 rounded-[2.5rem] border transition-all ${cardNumber.length >= 13 ? (isValid ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/5 border-rose-500/20 text-rose-500') : 'bg-white/5 border-white/5 text-slate-600'}`}>
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Status de Validação</div>
                      <div className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                         {cardNumber.length < 13 ? (
                           <><ShieldAlert className="h-6 w-6 opacity-20" /> Pendente</>
                         ) : isValid ? (
                           <><ShieldCheck className="h-6 w-6" /> Válido (Luhn)</>
                         ) : (
                           <><ShieldAlert className="h-6 w-6" /> Inválido</>
                         )}
                      </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 text-white">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">Bandeira Detectada</div>
                      <div className="text-2xl font-black uppercase tracking-tighter">
                         {brand !== "unknown" ? brand : "Indefinida"}
                      </div>
                  </div>
               </div>

               <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center gap-2 text-indigo-400">
                      <Info className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Como funciona o Algoritmo de Luhn?</span>
                  </div>
                  <div className="space-y-4">
                     <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Também conhecido como algoritmo "módulo 10", é uma fórmula de checksum simples usada para validar números de identificação, como cartões de crédito.
                     </p>
                     <ul className="space-y-3">
                        <li className="flex gap-3 text-xs">
                           <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black shrink-0">01</span>
                           <span className="text-slate-400 font-medium">Dobram-se os dígitos de posições ímpares (da direita para a esquerda).</span>
                        </li>
                        <li className="flex gap-3 text-xs">
                           <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black shrink-0">02</span>
                           <span className="text-slate-400 font-medium">Soma-se os dígitos individuais dos resultados.</span>
                        </li>
                        <li className="flex gap-3 text-xs">
                           <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black shrink-0">03</span>
                           <span className="text-slate-400 font-medium">Se a soma total for múltipla de 10, o número é válido.</span>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <label>Insira múltiplos números (um por linha)</label>
                    <button onClick={() => setBulkInput("")} className="text-rose-500 hover:text-rose-400 flex items-center gap-1 transition-colors">
                       <Trash2 className="h-3 w-3" /> Limpar Tudo
                    </button>
                  </div>
                  <textarea 
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    className="w-full bg-[#111] border border-white/5 rounded-3xl p-6 h-48 outline-none focus:border-indigo-500 transition-all text-white font-mono text-sm resize-none"
                    placeholder={"4539 0000 0000 0000\n5100 0000 0000 0000"}
                  />
               </div>

               {bulkResults.length > 0 && (
                  <div className="space-y-6">
                    <div className="overflow-x-auto rounded-3xl border border-white/5">
                      <table className="w-full text-left text-[11px]">
                         <thead className="bg-white/5 text-slate-500 uppercase font-black tracking-widest">
                            <tr>
                               <th className="px-6 py-4">Entrada</th>
                               <th className="px-6 py-4">Bandeira</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {bulkResults.map((res, i) => (
                               <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4 font-mono text-white tracking-widest">
                                    {formatCardNumber(res.clean)}
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className="text-[9px] font-black uppercase text-indigo-400">{res.brand}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${res.valid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {res.valid ? <Check className="h-2 w-2" /> : <ShieldAlert className="h-2 w-2" />}
                                        {res.valid ? "Válido" : "Inválido"}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <button 
                                        onClick={() => copyToClipboard(res.clean)}
                                        className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-indigo-400"
                                     >
                                        <Copy className="h-3 w-3" />
                                     </button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                    </div>
                  </div>
               )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotateY-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
