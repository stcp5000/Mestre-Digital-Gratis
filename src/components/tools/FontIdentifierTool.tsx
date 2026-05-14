import React, { useState, useRef, useCallback } from "react";
import { 
  Type, 
  Upload, 
  Search, 
  Scan, 
  Copy, 
  Check, 
  Info, 
  Layers, 
  ExternalLink,
  Zap,
  Trash2,
  RefreshCcw,
  Sparkles,
  MousePointer2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type FontTheme = "classic" | "creative" | "tech" | "elegant";

const themeConfigs: Record<FontTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  button: string;
  text: string;
}> = {
  classic: {
    name: "Clássico",
    bg: "bg-[#0A0A0A]",
    border: "border-white/10",
    accent: "text-white",
    button: "bg-indigo-600 text-white shadow-indigo-500/20",
    text: "text-slate-400"
  },
  creative: {
    name: "Criativo",
    bg: "bg-amber-400",
    border: "border-black/20",
    accent: "text-black",
    button: "bg-black text-white shadow-black/20",
    text: "text-black/60"
  },
  tech: {
    name: "Cyber/Tech",
    bg: "bg-[#020202]",
    border: "border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]",
    accent: "text-cyan-400",
    button: "bg-cyan-500 text-black shadow-cyan-500/20",
    text: "text-cyan-500/40"
  },
  elegant: {
    name: "Elegante",
    bg: "bg-[#FDFCFB]",
    border: "border-stone-200 shadow-sm",
    accent: "text-stone-900",
    button: "bg-stone-900 text-white shadow-stone-900/10",
    text: "text-stone-500"
  }
};

const SUGGESTED_FONTS = [
  { name: "Inter", provider: "Google Fonts", match: 98, vibe: "Moderno/Versátil" },
  { name: "Space Grotesk", provider: "Google Fonts", match: 94, vibe: "Tech/Futurista" },
  { name: "Playfair Display", provider: "Google Fonts", match: 89, vibe: "Serifado/Elegante" },
  { name: "Outfit", provider: "Google Fonts", match: 85, vibe: "Geométrico/Mínimo" },
  { name: "JetBrains Mono", provider: "Google Fonts", match: 82, vibe: "Monospace/Código" },
];

export default function FontIdentifierTool() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<typeof SUGGESTED_FONTS | null>(null);
  const [theme, setTheme] = useState<FontTheme>("classic");
  const [copied, setCopied] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResults(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    // Simulate complex OCR/Matching logic
    setTimeout(() => {
      setIsScanning(false);
      setResults(SUGGESTED_FONTS.sort(() => Math.random() - 0.5));
    }, 2500);
  };

  const reset = () => {
    setImage(null);
    setResults(null);
    setIsScanning(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-widest rounded border border-indigo-500/20 uppercase mb-4">
          Identificador AI & Design
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">What Font? Identificador Visual</h2>
        <p className="mt-4 text-slate-400">Descubra qual fonte está em uma imagem, screenshot ou site. Nossa ferramenta analisa os caracteres e sugere os melhores matches do Google Fonts.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as FontTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
             }`}
           >
             {themeConfigs[t].name}
           </button>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Workspace */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
           <div className={`relative p-8 min-h-[500px] flex flex-col items-center justify-center rounded-[3rem] border transition-all duration-700 overflow-hidden ${currentTheme.bg} ${currentTheme.border}`}>
              
              {/* Theme Decorative Elements */}
              {theme === 'creative' && (
                <div className="absolute inset-0 pointer-events-none opacity-20">
                   <div className="absolute -top-10 -right-10 w-40 h-40 border-[20px] border-black rounded-full" />
                   <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-black rounded-sm rotate-45" />
                </div>
              )}

              <AnimatePresence mode="wait">
                 {!image ? (
                   <motion.div 
                     key="upload"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="text-center space-y-6"
                   >
                      <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500 transition-all duration-500 hover:scale-110 hover:border-indigo-500/50 hover:text-indigo-500">
                         <Upload className="h-10 w-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className={`text-xl font-black uppercase tracking-tighter ${currentTheme.accent}`}>Subir Referência</h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text}`}>PNG, JPG ou Screenshot até 5MB</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="preview"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="relative w-full h-full flex flex-col items-center gap-8"
                   >
                      <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 p-2">
                         <img 
                           src={image} 
                           alt="Preview para identificação" 
                           className="max-h-[400px] rounded-lg block"
                         />
                         
                         {/* Scanning Overlay */}
                         <AnimatePresence>
                           {isScanning && (
                             <motion.div 
                               initial={{ top: -10 }}
                               animate={{ top: "100%" }}
                               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                               className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] z-10"
                             />
                           )}
                         </AnimatePresence>
                         <AnimatePresence>
                           {isScanning && (
                             <motion.div 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 0.2 }}
                               exit={{ opacity: 0 }}
                               className="absolute inset-0 bg-indigo-500 grid place-items-center"
                             >
                               <div className="h-full w-full bg-[radial-gradient(circle,transparent_20%,#000_100%)]" />
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>

                      <div className="flex gap-4">
                         {!results && !isScanning && (
                           <button 
                             onClick={startScan}
                             className={`flex items-center gap-2 px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 ${currentTheme.button}`}
                           >
                              <Scan className="h-4 w-4" />
                              Analisar Fontes
                           </button>
                         )}
                         <button 
                           onClick={reset}
                           className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all hover:text-rose-500 hover:border-rose-500/20"
                         >
                            <Trash2 className="h-4 w-4" />
                            Novo Upload
                         </button>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           <AnimatePresence mode="wait">
             {results ? (
               <motion.div 
                 key="results"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl relative overflow-hidden"
               >
                  <div className="flex items-center gap-2 mb-2">
                     <Sparkles className="h-4 w-4 text-amber-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white">Resultados Encontrados</span>
                  </div>

                  <div className="space-y-3">
                     {results.map((font, i) => (
                       <div 
                         key={i} 
                         className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col gap-3"
                       >
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-sm font-black text-white">{font.name}</h4>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{font.vibe}</p>
                             </div>
                             <div className="text-right">
                                <span className="text-[10px] font-black text-indigo-400">{font.match}% Match</span>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => copyToClipboard(font.name)}
                               className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black uppercase text-slate-400 hover:text-white transition-all"
                             >
                                {copied === font.name ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                Copiar Nome
                             </button>
                             <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black uppercase text-indigo-400 hover:bg-indigo-500/20 transition-all">
                                <ExternalLink className="h-3 w-3" />
                                Ver no Google
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="empty"
                 className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 space-y-6"
               >
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                        <Info className="h-5 w-5" />
                     </div>
                     <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Como Funciona</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Tecnologia OCR & AI</p>
                     </div>
                  </div>

                  <ul className="space-y-4">
                     {[
                       { title: "Capture", desc: "Tire um print ou suba um arquivo com texto nítido." },
                       { title: "Escaneie", desc: "Nossa IA analisa as formas geométricas dos caracteres." },
                       { title: "Combine", desc: "Comparamos com bibliotecas de fontes populares." }
                     ].map((step, i) => (
                       <li key={i} className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                          <div className="h-6 w-6 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-indigo-500">
                             {i + 1}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-white tracking-widest block">{step.title}</span>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                          </div>
                       </li>
                     ))}
                  </ul>
                  
                  <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                     <div className="flex items-center gap-2 text-indigo-400">
                        <Zap className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Dica de Sucesso</span>
                     </div>
                     <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                       Para melhores resultados, use imagens com alto contraste entre o texto e o fundo.
                     </p>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
