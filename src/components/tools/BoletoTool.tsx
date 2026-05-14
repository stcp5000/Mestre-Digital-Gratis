import React, { useState, useMemo } from "react";
import { 
  Barcode, 
  Search, 
  RefreshCcw, 
  Copy, 
  Check, 
  Info, 
  Calculator, 
  Calendar,
  DollarSign,
  Building2,
  Trash2,
  AlertCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Logic ---

const decodeBoleto = (codigo: string) => {
  const clean = codigo.replace(/\D/g, "");
  
  // Basic validation - check length (Typical bank slip is 47 or 48 digits)
  // Conventional (Títulos): 47 digits
  // Collection (Convênios/Tributes): 48 digits
  if (clean.length !== 47 && clean.length !== 44) return null;

  let info = {
    tipo: "Título Bancário",
    banco: "Desconhecido",
    vencimento: "Indefinido",
    valor: 0,
    codigoBarras: "",
    valido: false
  };

  if (clean.length === 47) {
    // Bank code is first 3 digits
    const bankCode = clean.substring(0, 3);
    info.banco = getBankName(bankCode);

    // Expiration date factor (digits 34-37 of the 44-digit bar code, but in 47-digit line they are elsewhere)
    // Linha Digitável 47 structure:
    // AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
    // K = check digit
    // UUUU = factor
    // VVVVVVVVVV = value
    const factor = parseInt(clean.substring(33, 37));
    const valueStr = clean.substring(37);
    info.valor = parseInt(valueStr) / 100;

    if (factor > 0) {
      const baseDate = new Date("1997-10-07T12:00:00");
      const dueDate = new Date(baseDate);
      dueDate.setDate(baseDate.getDate() + factor);
      info.vencimento = dueDate.toLocaleDateString("pt-BR");
    }

    info.valido = true; // Simplified validation for UI
  }

  return info;
};

const getBankName = (code: string) => {
  const banks: Record<string, string> = {
    "001": "Banco do Brasil",
    "033": "Santander",
    "104": "Caixa Econômica Federal",
    "237": "Bradesco",
    "341": "Itaú",
    "422": "Safra",
    "745": "Citibank",
    "748": "Sicredi",
    "756": "Sicoob",
    "077": "Inter",
    "260": "Nubank",
    "655": "Neon",
    "212": "Original",
    "041": "Banrisul",
    "070": "BRB",
  };
  return banks[code] || `Banco ${code}`;
};

export default function BoletoTool() {
  const [inputValue, setInputValue] = useState("");
  const [view, setView] = useState<"decoder" | "calc">("decoder");
  const [copied, setCopied] = useState(false);

  const decoded = useMemo(() => decodeBoleto(inputValue), [inputValue]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black tracking-widest rounded border border-amber-500/20 uppercase mb-4">
          Financeiro & Pagamentos
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Ferramenta de Boletos</h2>
        <p className="mt-4 text-slate-400">Valide linhas digitáveis, decodifique informações de vencimento e valor, e verifique bancos emissores.</p>
      </div>

      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setView("decoder")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "decoder" ? "bg-amber-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <Barcode className="h-4 w-4" />
          Decodificador
        </button>
        <button 
          onClick={() => setView("calc")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === "calc" ? "bg-amber-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
          }`}
        >
          <Calculator className="h-4 w-4" />
          Simulador de Juros
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {view === "decoder" ? (
          <>
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
              <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Barcode className="h-64 w-64" />
                 </div>

                 <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Linha Digitável / Código de Barras</label>
                      <div className="relative group/input">
                        <textarea
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value.replace(/[^\d. ]/g, ""))}
                          className="w-full bg-[#111] border border-white/5 rounded-2xl py-6 px-8 outline-none transition-all font-mono text-sm h-32 focus:border-amber-500/50 text-white resize-none"
                          placeholder="00190.00009 03164.633005 00000.000001 1 95000000012345"
                        />
                        <div className="absolute right-6 bottom-6 flex gap-2">
                           <button onClick={() => setInputValue("")} className="p-3 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all">
                              <Trash2 className="h-5 w-5" />
                           </button>
                           <button onClick={() => copyToClipboard(inputValue)} className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500 transition-all">
                              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                           </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {decoded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="h-3 w-3 text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Instituição Emissora</span>
                              </div>
                              <div className="text-lg font-black text-white">{decoded.banco}</div>
                           </div>

                           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-3 w-3 text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Data de Vencimento</span>
                              </div>
                              <div className="text-lg font-black text-white">{decoded.vencimento}</div>
                           </div>

                           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl sm:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-3 w-3 text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Valor do Documento</span>
                              </div>
                              <div className="text-3xl font-black text-white">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(decoded.valor)}
                              </div>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!decoded && inputValue.length > 0 && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Código com formato inválido</span>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
               <div className="bg-white/5 border border-white/5 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center gap-2 text-white">
                      <Info className="h-4 w-4 text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sobre a Linha Digitável</span>
                  </div>
                  <div className="space-y-4">
                     <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        A linha digitável é a representação numérica do código de barras. No caso de títulos bancários convencionais, ela possui 47 dígitos.
                     </p>
                     <div className="bg-white/5 p-4 rounded-xl">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Dica</div>
                        <p className="text-xs text-white">Esta validação é puramente baseada na estrutura do código. Não confirma se o boleto já foi pago ou se foi registrado no sistema bancário.</p>
                     </div>
                  </div>
               </div>

               <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">Segurança em Boletos</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Sempre confira os dados do beneficiário no ato do pagamento.</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Boletos adulterados costumam mudar o código do banco nos primeiros dígitos da linha digitável. Verifique se o logo do banco corresponde ao código exibido aqui.
                  </p>
               </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-12">
            <BoletoCalculator decoded={decoded} />
          </div>
        )}
      </div>
    </div>
  );
}

function BoletoCalculator({ decoded }: { decoded: any }) {
  const [valorOriginal, setValorOriginal] = useState(decoded?.valor || 0);
  const [multa, setMulta] = useState(2); // %
  const [juros, setJuros] = useState(0.033); // % por dia (default ~1% ao mês)
  const [diasAtraso, setDiasAtraso] = useState(0);

  const calculo = useMemo(() => {
    const valorMulta = valorOriginal * (multa / 100);
    const valorJuros = valorOriginal * (juros / 100) * diasAtraso;
    const total = valorOriginal + valorMulta + valorJuros;

    return {
      valorMulta,
      valorJuros,
      total
    };
  }, [valorOriginal, multa, juros, diasAtraso]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 space-y-8">
        <div className="grid gap-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Valor Original (R$)</label>
            <input 
              type="number"
              value={valorOriginal}
              onChange={(e) => setValorOriginal(Number(e.target.value))}
              className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-amber-500/50 text-white font-black text-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Multa (%)</label>
              <input 
                type="number"
                value={multa}
                onChange={(e) => setMulta(Number(e.target.value))}
                className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-amber-500/50 text-white font-black"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Juros/Dia (%)</label>
              <input 
                type="number"
                step="0.001"
                value={juros}
                onChange={(e) => setJuros(Number(e.target.value))}
                className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-amber-500/50 text-white font-black"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Dias em Atraso</label>
            <input 
              type="number"
              value={diasAtraso}
              onChange={(e) => setDiasAtraso(Number(e.target.value))}
              className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-amber-500/50 text-white font-black text-xl"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-500 p-8 rounded-3xl shadow-amber-500/20 shadow-xl text-black space-y-6">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Novo Valor Total</div>
          <div className="text-5xl font-black tracking-tighter">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculo.total)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-black/10">
            <div>
              <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Total Multa</div>
              <div className="text-lg font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculo.valorMulta)}</div>
            </div>
            <div>
              <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Total Juros</div>
              <div className="text-lg font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculo.valorJuros)}</div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl border border-white/5 bg-white/5 space-y-4">
           <div className="flex items-center gap-2 text-amber-500">
             <Info className="h-4 w-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">Base do Cálculo</span>
           </div>
           <p className="text-xs text-slate-500 font-medium leading-relaxed">
             A multa por atraso geralmente é limitada a 2% para consumo (CDC). Os juros costumam ser de 1% ao mês (0,033% ao dia) mais a correção, a menos que especificado de outra forma no documento.
           </p>
        </div>
      </div>
    </div>
  );
}
