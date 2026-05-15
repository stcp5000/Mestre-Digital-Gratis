import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Youtube, 
  FileText, 
  TrendingUp, 
  Zap, 
  Target, 
  Search, 
  ArrowRight, 
  Monitor, 
  Globe, 
  Share2, 
  Rocket, 
  Lightbulb, 
  CircleDashed,
  PlayCircle,
  Newspaper,
  Terminal,
  Palette,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type TitleTheme = "divertido" | "classico" | "viral" | "profissional";
type TitlePlatform = "youtube" | "blog" | "general";

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
}

const THEMES: Record<TitleTheme, ThemeConfig> = {
  divertido: {
    name: "Divertido / Casual",
    bg: "bg-yellow-50",
    card: "bg-white border-yellow-200 shadow-xl",
    accent: "text-orange-500",
    button: "bg-yellow-400 text-black hover:bg-yellow-500 shadow-[0_4px_0_#ca8a04]",
    text: "text-slate-600",
    border: "border-yellow-100",
    input: "bg-yellow-50/50 border-yellow-200 text-slate-800 focus:border-yellow-400",
    label: "text-yellow-600 font-black uppercase italic"
  },
  classico: {
    name: "Clássico / Elegante",
    bg: "bg-slate-50",
    card: "bg-white border-slate-200 shadow-sm",
    accent: "text-slate-900",
    button: "bg-slate-900 text-white hover:bg-slate-800",
    text: "text-slate-500",
    border: "border-slate-200",
    input: "bg-white border-slate-200 text-slate-900 focus:border-slate-400",
    label: "text-slate-400 font-serif italic"
  },
  viral: {
    name: "Viral / Impactante",
    bg: "bg-[#0b0515]",
    card: "bg-white/5 border-fuchsia-500/30 backdrop-blur-xl",
    accent: "text-fuchsia-400 font-extrabold",
    button: "bg-fuchsia-500 text-black font-black uppercase tracking-widest hover:scale-105 shadow-[0_0_20px_rgba(217,70,239,0.3)]",
    text: "text-fuchsia-200/60",
    border: "border-fuchsia-500/20",
    input: "bg-black border-fuchsia-500/20 text-fuchsia-400 focus:border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.1)]",
    label: "text-fuchsia-500/50 font-black tracking-[0.2em]"
  },
  profissional: {
    name: "Profissional / SEO",
    bg: "bg-blue-50",
    card: "bg-white border-blue-200 shadow-md",
    accent: "text-blue-700",
    button: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20",
    text: "text-slate-600",
    border: "border-blue-100",
    input: "bg-white border-blue-200 text-slate-900 focus:border-blue-600",
    label: "text-blue-600 font-bold uppercase tracking-tight"
  }
};

const PLATFORMS: Record<TitlePlatform, { name: string; icon: any; color: string }> = {
  youtube: { name: "YouTube", icon: Youtube, color: "text-red-500" },
  blog: { name: "Blog / SEO", icon: FileText, color: "text-blue-500" },
  general: { name: "Redes Sociais", icon: Globe, color: "text-emerald-500" }
};

export default function TitleGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<TitlePlatform>("youtube");
  const [theme, setTheme] = useState<TitleTheme>("viral");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ title: string; strategy: string; score: number; tags?: string[] }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentTheme = THEMES[theme];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setResults([]);
    try {
      const response = await fetch("/api/titles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic, 
          platform: PLATFORMS[platform].name,
          style: currentTheme.name
        })
      });
      const data = await response.json();
      if (data.titles) {
        setResults(data.titles);
      }
    } catch (error) {
      console.error("Title generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = () => {
    if (results.length === 0) return;
    const content = results.map(r => `${r.title}\n[CTR Score: ${r.score}%]\nEstratégia: ${r.strategy}\nTags: ${r.tags?.join(", ") || ""}\n---\n`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `titulos-mestre-digital-${platform}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 text-left">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded border border-red-500/20">
             Creator Tools AI
           </span>
           <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded border border-blue-500/20">
             CTR Booster
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>
           Gerador de Títulos Virais para YouTube e Blog
        </h2>
        <p className={`text-lg font-medium ${theme === 'viral' ? 'text-zinc-500' : 'text-slate-500'}`}>
           Aumente o CTR do seu conteúdo com títulos otimizados para busca e curiosidade. Escolha seu nicho e deixe a IA dominar o algoritmo.
        </p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1.5 rounded-2xl border border-white/10 w-fit overflow-x-auto no-scrollbar shadow-2xl">
        {(Object.keys(THEMES) as TitleTheme[]).map((t) => (
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
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border transition-all duration-500 shadow-2xl ${currentTheme.card} space-y-8`}>
              
              {/* Platform Selector */}
              <div className="space-y-4">
                 <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>Plataforma de Lançamento</label>
                 <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(PLATFORMS) as TitlePlatform[]).map((key) => {
                      const p = PLATFORMS[key];
                      const Icon = p.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setPlatform(key)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                            platform === key 
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-500 shadow-inner' 
                            : theme === 'viral' ? 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10' : 'bg-slate-50 border-slate-100 text-zinc-400 hover:bg-slate-100'
                          }`}
                        >
                           <Icon className={`h-6 w-6 ${platform === key ? p.color : 'text-zinc-500'}`} />
                           <span className="text-[9px] font-black uppercase tracking-widest">{p.name}</span>
                        </button>
                      );
                    })}
                 </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-4">
                 <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>Qual o assunto do seu vídeo/artigo?</label>
                 <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Como ganhar dinheiro com marketing digital em 2024..."
                    className={`w-full h-36 p-6 rounded-[2rem] border-2 outline-none transition-all resize-none shadow-inner leading-relaxed ${currentTheme.input}`}
                 />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                  currentTheme.button
                } ${isGenerating ? 'opacity-50' : 'hover:scale-[1.02] active:scale-95'}`}
              >
                 {isGenerating ? (
                   <>
                     <CircleDashed className="h-5 w-5 animate-spin" />
                     <span>Otimizando SEO...</span>
                   </>
                 ) : (
                   <>
                     <TrendingUp className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     <span>Gerar Títulos com SEO</span>
                   </>
                 )}
              </button>
           </div>

           {/* Conversion Card */}
           <div className={`p-6 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/5 space-y-4`}>
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Target className="h-6 w-6" />
                 </div>
                 <h4 className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Growth Hack Dica</h4>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed italic">
                 "Títulos para {PLATFORMS[platform].name} performam melhor quando combinam uma dor específica com um benefício imediato ou um elemento de mistério."
              </p>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-7 space-y-6">
           <div className={`p-8 md:p-12 rounded-[3.5rem] border shadow-2xl transition-all duration-700 min-h-[600px] flex flex-col ${
             theme === 'viral' ? 'bg-[#0f0f0f]' : 'bg-white'
           } ${currentTheme.border}`}>
              
              <div className="flex items-center justify-between mb-10">
                 <div className="flex gap-4">
                    <button className="text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 border-blue-500 text-blue-500">Potencial Viral</button>
                    <button className="text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 border-transparent text-zinc-500 hover:text-zinc-900">Métricas SEO</button>
                 </div>
                 {results.length > 0 && (
                   <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all"
                   >
                     <Download className="h-3.5 w-3.5" />
                     Download Lista
                   </button>
                 )}
              </div>

              <AnimatePresence mode="wait">
                 {results.length > 0 ? (
                   <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                   >
                     {results.map((item, idx) => (
                       <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-6 rounded-3xl border transition-all hover:border-blue-500 shadow-sm group relative overflow-hidden ${
                          theme === 'viral' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                        }`}
                       >
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded text-[10px] font-black text-white ${
                                  item.score > 85 ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}>
                                   {item.score}% CTR
                                </div>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest tracking-tighter">Opção {idx + 1}</span>
                             </div>
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => copyToClipboard(item.title, idx)}
                                  className={`p-2 rounded-xl transition-all ${
                                    copiedIndex === idx ? 'bg-emerald-500 text-white' : 'bg-white/10 text-zinc-400 hover:bg-white/20'
                                  }`}
                                >
                                   {copiedIndex === idx ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </button>
                             </div>
                          </div>

                          <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-tight mb-4 ${
                            theme === 'viral' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {item.title}
                          </h3>

                          <div className={`pt-4 border-t border-white/5 space-y-3`}>
                             <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase flex items-center gap-2">
                                <Zap className="h-3 w-3 text-amber-500" />
                                <span className="opacity-60">SEO Strategy:</span>
                                <span className={currentTheme.accent}>{item.strategy}</span>
                             </p>
                             {item.tags && (
                               <div className="flex flex-wrap gap-2">
                                 {item.tags.map(tag => (
                                   <span key={tag} className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded border border-blue-500/20">
                                     #{tag}
                                   </span>
                                 ))}
                               </div>
                             )}
                          </div>
                          
                          {/* Visual Accent */}
                          <div className={`absolute bottom-0 right-0 h-1 rounded-full w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-transparent via-blue-500 to-transparent`} />
                       </motion.div>
                     ))}
                   </motion.div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                      <div className={`h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center animate-pulse ${
                        theme === 'viral' ? 'border-white/10 text-white/10' : 'border-slate-100 text-slate-200'
                      }`}>
                         <PlayCircle className="h-10 w-10" />
                      </div>
                      <div className="max-w-[300px] space-y-2">
                         <h4 className={`text-md font-black uppercase tracking-widest ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>Títulos que Dominam o Algoritmo</h4>
                         <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                            Defina o tema do seu conteúdo e veja a IA criar combinações explosivas de palavras para disparar seus cliques.
                         </p>
                      </div>
                   </div>
                 )}
              </AnimatePresence>
           </div>

           {/* SEO Badges Foot */}
           <div className="flex flex-wrap gap-4 items-center justify-center pt-8 opacity-40 grayscale">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <Globe className="h-4 w-4" /> SEO Index Optimized
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <Target className="h-4 w-4" /> CTR Prediction v4.2
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <Rocket className="h-4 w-4" /> Viral Growth Engine
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
