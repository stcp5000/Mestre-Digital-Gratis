import React, { useState, useEffect, useMemo } from "react";
import { 
  RefreshCw, 
  ArrowRightLeft, 
  Search, 
  TrendingUp, 
  Globe, 
  Info,
  DollarSign,
  Euro,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const POPULAR_CURRENCIES = ["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"];

export default function CurrencyConverterTool() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const data = await response.json();
        if (data.result === "success") {
          setRates(data.rates);
          setError(null);
        } else {
          throw new Error("Falha ao buscar cotações.");
        }
      } catch (err) {
        setError("Não foi possível carregar as cotações em tempo real.");
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, [fromCurrency]);

  const convertedAmount = useMemo(() => {
    const num = parseFloat(amount.replace(",", ".")) || 0;
    const rate = rates[toCurrency] || 1;
    return num * rate;
  }, [amount, toCurrency, rates]);

  const currencyList = useMemo(() => {
    return Object.keys(rates).filter(c => 
      c.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort();
  }, [rates, searchQuery]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Mercado Global
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Conversor de Moedas</h2>
        <p className="mt-4 text-slate-400">Câmbio comercial em tempo real para mais de 150 moedas globais.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Converter Section */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Globe className="h-64 w-64" />
             </div>

             <div className="relative z-10 grid gap-8">
                {/* Amount Input */}
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Valor para converter</label>
                   <input 
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9,.]/g, ""))}
                      className="w-full bg-black border border-white/10 rounded-2xl py-6 px-6 text-4xl font-black text-white outline-none focus:border-emerald-500 transition-all tracking-tighter"
                      placeholder="0,00"
                   />
                </div>

                <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                   {/* From Currency */}
                   <div className="relative">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">De</label>
                      <button 
                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between text-white font-bold hover:bg-white/10 transition-all uppercase"
                      >
                        <span className="flex items-center gap-2">
                           <span className="text-emerald-500 font-black tracking-widest">{fromCurrency}</span>
                        </span>
                        <RefreshCw className={`h-4 w-4 text-slate-600 transition-transform ${loading ? "animate-spin" : ""}`} />
                      </button>
                      
                      <AnimatePresence>
                        {showFromDropdown && (
                           <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute z-50 top-full mt-2 w-full max-h-[300px] overflow-y-auto bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl p-2"
                           >
                              <div className="sticky top-0 bg-[#0F172A] pb-2 mb-2 border-b border-white/5">
                                 <input 
                                    autoFocus
                                    placeholder="Buscar moeda..."
                                    className="w-full bg-black/50 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-emerald-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                 />
                              </div>
                              <div className="grid gap-1">
                                 {currencyList.map(c => (
                                    <button 
                                       key={c}
                                        onClick={() => { setFromCurrency(c); setShowFromDropdown(false); setSearchQuery(""); }}
                                       className="text-left p-3 rounded-lg hover:bg-white/5 text-[10px] font-bold text-slate-300 uppercase hover:text-white transition-colors"
                                    >
                                       {c}
                                    </button>
                                 ))}
                              </div>
                           </motion.div>
                        )}
                      </AnimatePresence>
                   </div>

                   {/* Swap Button */}
                   <button 
                      onClick={handleSwap}
                      className="mt-6 h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                   >
                      <ArrowRightLeft className="h-5 w-5" />
                   </button>

                   {/* To Currency */}
                   <div className="relative">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Para</label>
                      <button 
                        onClick={() => setShowToDropdown(!showToDropdown)}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between text-white font-bold hover:bg-white/10 transition-all uppercase"
                      >
                        <span className="flex items-center gap-2">
                           <span className="text-blue-400 font-black tracking-widest">{toCurrency}</span>
                        </span>
                        <Coins className="h-4 w-4 text-slate-600" />
                      </button>

                      <AnimatePresence>
                        {showToDropdown && (
                           <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute z-50 top-full mt-2 w-full max-h-[300px] overflow-y-auto bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl p-2"
                           >
                              <div className="sticky top-0 bg-[#0F172A] pb-2 mb-2 border-b border-white/5">
                                 <input 
                                    autoFocus
                                    placeholder="Buscar moeda..."
                                    className="w-full bg-black/50 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-emerald-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                 />
                              </div>
                              <div className="grid gap-1">
                                 {currencyList.map(c => (
                                    <button 
                                       key={c}
                                        onClick={() => { setToCurrency(c); setShowToDropdown(false); setSearchQuery(""); }}
                                       className="text-left p-3 rounded-lg hover:bg-white/5 text-[10px] font-bold text-slate-300 uppercase hover:text-white transition-colors"
                                    >
                                       {c}
                                    </button>
                                 ))}
                              </div>
                           </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>

                <div className="bg-emerald-500/5 rounded-3xl p-8 border border-emerald-500/10 text-center md:text-left transition-all">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Resultado da Conversão</span>
                   <div className="text-6xl font-black text-white tracking-tighter">
                      {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      <span className="ml-2 text-2xl text-blue-400">{toCurrency}</span>
                   </div>
                   <div className="mt-4 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase">
                      <span className="flex items-center gap-1">
                         <TrendingUp className="h-3 w-3 text-emerald-500" />
                         Taxa: 1 {fromCurrency} = {rates[toCurrency]?.toFixed(4)} {toCurrency}
                      </span>
                      <span className="text-slate-800">|</span>
                      <span>Atualizado em tempo real</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 space-y-6">
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-4">Atalhos Populares</h4>
                 <div className="grid grid-cols-2 gap-3">
                    {POPULAR_CURRENCIES.map(c => (
                       <button 
                          key={c}
                          onClick={() => {
                             if (c === fromCurrency) handleSwap();
                             else setToCurrency(c);
                          }}
                          className={`p-3 rounded-xl border font-black text-xs transition-all ${
                             toCurrency === c 
                                ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)]" 
                                : "bg-white/5 text-slate-400 border-white/5 hover:border-white/20 active:scale-95"
                          }`}
                       >
                          {c}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                 <div className="flex items-center gap-2 text-blue-400">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Aviso Importante</span>
                 </div>
                 <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                    As taxas exibidas são baseadas no câmbio comercial e podem variar significativamente de taxas turísticas ou de casas de câmbio físicas.
                 </p>
              </div>

              {error && (
                 <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-400 uppercase text-center">
                    {error}
                 </div>
              )}
           </div>

           <div className="grid grid-cols-1 gap-4">
              <div className="p-6 rounded-3xl border border-white/5 bg-[#0A0A0A] flex items-center gap-4 group hover:border-emerald-500/20 transition-all">
                 <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <DollarSign className="h-6 w-6" />
                 </div>
                 <div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Taxa Reversa</span>
                    <div className="text-lg font-black text-white">
                       1 {toCurrency} = {(1 / (rates[toCurrency] || 1)).toFixed(4)} {fromCurrency}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
