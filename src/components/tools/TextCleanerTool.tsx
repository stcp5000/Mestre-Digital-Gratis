import React, { useState, useCallback } from "react";
import { 
  Eraser, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCcw, 
  Scissors, 
  Space, 
  Wind, 
  Zap, 
  FileText, 
  Hash, 
  Sparkles,
  Search,
  Type,
  Code,
  Languages,
  Monitor,
  Ghost,
  Cpu,
  Terminal,
  Brush
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type CleanerTheme = "pro" | "pop" | "cyber" | "zen";

interface ThemeConfig {
  name: string;
  bg: string;
  card: string;
  accent: string;
  button: string;
  text: string;
  border: string;
  input: string;
  label: string;
  optionButton: string;
}

const THEMES: Record<CleanerTheme, ThemeConfig> = {
  pro: {
    name: "Profissional",
    bg: "bg-slate-50",
    card: "bg-white border-slate-200 shadow-sm",
    accent: "text-blue-600",
    button: "bg-blue-600 text-white hover:bg-blue-700",
    text: "text-slate-600",
    border: "border-slate-200",
    input: "bg-white border-slate-200 text-slate-900 focus:border-blue-500",
    label: "text-slate-400",
    optionButton: "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm"
  },
  pop: {
    name: "Pop Culture",
    bg: "bg-yellow-400",
    card: "bg-white border-black/20 shadow-[8px_8px_0_#000]",
    accent: "text-emerald-500",
    button: "bg-black text-white hover:scale-[1.02] active:scale-95",
    text: "text-black/60",
    border: "border-black/10",
    input: "bg-white border-black/20 text-black placeholder-black/30 focus:border-black",
    label: "text-black font-black",
    optionButton: "bg-white border-2 border-black text-black hover:bg-yellow-400 shadow-[4px_4px_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
  },
  cyber: {
    name: "Terminal Cyber",
    bg: "bg-[#020202]",
    card: "bg-zinc-900 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
    accent: "text-emerald-400",
    button: "bg-emerald-500 text-black font-bold uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    text: "text-zinc-500",
    border: "border-zinc-800",
    input: "bg-black border-emerald-500/20 text-emerald-400 font-mono focus:border-emerald-500",
    label: "text-zinc-600",
    optionButton: "bg-emerald-500/5 border-emerald-500/20 text-emerald-500/70 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
  },
  zen: {
    name: "Minimal Zen",
    bg: "bg-[#FAFAFA]",
    card: "bg-white border-slate-100",
    accent: "text-indigo-900",
    button: "bg-indigo-900 text-white shadow-sm",
    text: "text-slate-500",
    border: "border-slate-100",
    input: "bg-slate-50 border-slate-100 text-slate-800 focus:border-indigo-200",
    label: "text-slate-400",
    optionButton: "bg-slate-50 border-slate-100 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-900 shadow-sm"
  }
};

export default function TextCleanerTool() {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState<CleanerTheme>("pro");
  const [copied, setCopied] = useState(false);

  const currentTheme = THEMES[theme];

  const cleanText = useCallback((action: string) => {
    let newText = text;
    switch (action) {
      case "trim":
        newText = text.trim();
        break;
      case "extra-spaces":
        newText = text.replace(/\s+/g, ' ').trim();
        break;
      case "extra-lines":
        newText = text.replace(/\n\s*\n/g, '\n').trim();
        break;
      case "remove-all-lines":
        newText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        break;
      case "special-chars":
        // Remove characters that are not letters, numbers, spaces or common punctuation
        newText = text.replace(/[^\w\sà-úÀ-Ú,.!?;:@#%&*()\-+=]/gi, '');
        break;
      case "emojis":
        newText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        break;
      case "numbers":
        newText = text.replace(/[0-9]/g, '');
        break;
      case "letters":
        newText = text.replace(/[a-zA-Zà-úÀ-Ú]/g, '');
        break;
      case "normalize":
        newText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        break;
      default:
        break;
    }
    setText(newText);
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setText("");
  };

  return (
    <div className="space-y-12 text-left">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded border border-blue-500/20">
             Utils de Texto v2.0
           </span>
           <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/20">
             SEO Otimizado
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'cyber' ? 'text-emerald-400' : theme === 'pop' ? 'text-black' : 'text-slate-900'}`}>
           Limpador de Texto Inteligente
        </h2>
        <p className={`text-lg font-medium ${theme === 'cyber' ? 'text-zinc-500' : 'text-slate-500'}`}>
           Remova espaços extras, quebras de linha e caracteres indesejados instantaneamente. Formate seus parágrafos para posts, códigos ou documentos com um clique.
        </p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1.5 rounded-2xl border border-white/10 w-fit overflow-x-auto no-scrollbar shadow-2xl">
        {(Object.keys(THEMES) as CleanerTheme[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
            }`}
          >
            {THEMES[t].name}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-6">
           <div className={`p-8 rounded-[3rem] border transition-all duration-500 ${currentTheme.card} space-y-6`}>
              
              <div className="flex justify-between items-center px-4">
                 <div className="flex items-center gap-3">
                    <FileText className={`h-5 w-5 ${currentTheme.accent}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.label}`}>Seu Conteúdo</span>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={clearAll}
                      className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-all"
                      title="Limpar tudo"
                    >
                       <Trash2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-md group ${
                        copied 
                        ? 'bg-emerald-500 text-black' 
                        : theme === 'pop' 
                        ? 'bg-black text-white hover:bg-zinc-800' 
                        : theme === 'cyber'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                       {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />}
                       {copied ? 'Copiado!' : 'Copiar Texto'}
                    </button>
                 </div>
              </div>

              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Cole seu texto aqui para começar a limpeza..."
                className={`w-full h-[400px] p-8 rounded-[2rem] border-2 outline-none resize-none transition-all text-sm leading-relaxed ${currentTheme.input}`}
              />

              <div className="flex flex-wrap gap-4 px-4 text-[10px] font-black text-slate-400 uppercase">
                 <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> {text.length} Caracteres</span>
                 <span className="flex items-center gap-1"><Languages className="h-3 w-3" /> {text.trim() === "" ? 0 : text.trim().split(/\s+/).length} Palavras</span>
                 <span className="flex items-center gap-1"><Code className="h-3 w-3" /> {text.split('\n').length} Linhas</span>
              </div>
           </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-4 space-y-6">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${currentTheme.card} space-y-8 shadow-xl`}>
              
              <div className="space-y-4">
                 <h4 className={`text-[10px] font-black uppercase tracking-[0.15em] ${currentTheme.label}`}>Limpeza de Espaços</h4>
                 <div className="grid gap-3">
                    <button onClick={() => cleanText("trim")} className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black uppercase transition-all text-left shadow-sm ${currentTheme.optionButton}`}>
                       <Scissors className="h-4 w-4 shrink-0" /> Remover Espaços Bordas
                    </button>
                    <button onClick={() => cleanText("extra-spaces")} className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black uppercase transition-all text-left shadow-sm ${currentTheme.optionButton}`}>
                       <Space className="h-4 w-4 shrink-0" /> Remover Espaços Duplos
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className={`text-[10px] font-black uppercase tracking-[0.15em] ${currentTheme.label}`}>Quebras de Linha</h4>
                 <div className="grid gap-3">
                    <button onClick={() => cleanText("extra-lines")} className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black uppercase transition-all text-left shadow-sm ${currentTheme.optionButton}`}>
                       <Wind className="h-4 w-4 shrink-0" /> Limpar Linhas Extras
                    </button>
                    <button onClick={() => cleanText("remove-all-lines")} className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black uppercase transition-all text-left shadow-sm ${currentTheme.optionButton}`}>
                       <RefreshCcw className="h-4 w-4 shrink-0" /> Unificar Linhas
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className={`text-[10px] font-black uppercase tracking-[0.15em] ${currentTheme.label}`}>Filtragem Avançada</h4>
                 <div className="grid gap-3">
                    <button onClick={() => cleanText("special-chars")} className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black uppercase transition-all text-left shadow-sm ${currentTheme.optionButton}`}>
                       <Zap className="h-4 w-4 shrink-0" /> Apenas Texto/Números
                    </button>
                    <button onClick={() => cleanText("emojis")} className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black uppercase transition-all text-left shadow-sm ${currentTheme.optionButton}`}>
                       <Ghost className="h-4 w-4 shrink-0" /> Remover Emojis
                    </button>
                    <button onClick={() => cleanText("normalize")} className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black uppercase transition-all text-left shadow-sm ${currentTheme.optionButton}`}>
                       <Languages className="h-4 w-4 shrink-0" /> Remover Acentos
                    </button>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <div className={`p-5 rounded-3xl flex gap-4 items-center ${theme === 'cyber' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-blue-500/5 border-blue-500/10'}`}>
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${theme === 'cyber' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 text-blue-600'}`}>
                       <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                       <h4 className={`text-[9px] font-black uppercase tracking-widest ${theme === 'cyber' ? 'text-emerald-400' : 'text-blue-600'}`}>Dica de Produtividade</h4>
                       <p className="text-[9px] text-slate-500 font-medium leading-relaxed mt-1 leading-tight">
                          Use o modo 'Unificar Linhas' para transformar listas em parágrafos contínuos, ideais para legendas de redes sociais.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Quick Stats Overlay */}
           {theme === 'cyber' && (
             <div className="p-6 rounded-3xl bg-black border border-emerald-500/20 font-mono text-[10px] text-emerald-500/60 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                   <span>SYS_STATUS:</span>
                   <span className="text-emerald-400">OPTIMIZED</span>
                </div>
                <div className="flex justify-between items-center">
                   <span>DATA_LOAD:</span>
                   <span>{text.length} bytes</span>
                </div>
                <div className="h-1 bg-emerald-500/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="h-full bg-emerald-500"
                   />
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
