import { useState } from "react";
import { 
  Search, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  BarChart3, 
  Globe, 
  Youtube, 
  ShoppingCart, 
  CircleDashed,
  TrendingUp,
  Target,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type KeywordTheme = "divertido" | "classico" | "viral" | "profissional";
type SearchPlatform = "google" | "youtube" | "amazon" | "pinterest";

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

const THEMES: Record<KeywordTheme, ThemeConfig> = {
  divertido: {
    name: "Divertido / Criativo",
    bg: "bg-orange-50",
    card: "bg-white border-orange-200 shadow-xl",
    accent: "text-orange-600",
    button: "bg-orange-500 text-white hover:bg-orange-600 shadow-[0_4px_0_#c2410c]",
    text: "text-slate-600",
    border: "border-orange-100",
    input: "bg-orange-50/50 border-orange-200 text-slate-800 focus:border-orange-400",
    label: "text-orange-600 font-black uppercase italic"
  },
  classico: {
    name: "Clássico / Elegante",
    bg: "bg-stone-50",
    card: "bg-white border-stone-200 shadow-sm",
    accent: "text-stone-900",
    button: "bg-stone-900 text-white hover:bg-stone-800",
    text: "text-stone-600",
    border: "border-stone-200",
    input: "bg-white border-stone-200 text-stone-900 focus:border-stone-400",
    label: "text-stone-400 font-serif italic"
  },
  viral: {
    name: "Viral / Impactante",
    bg: "bg-[#050b1a]",
    card: "bg-white/5 border-cyan-500/30 backdrop-blur-xl",
    accent: "text-cyan-400 font-extrabold",
    button: "bg-cyan-500 text-black font-black uppercase tracking-widest hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    text: "text-cyan-200/60",
    border: "border-cyan-500/20",
    input: "bg-black border-cyan-500/20 text-cyan-400 focus:border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
    label: "text-cyan-500 font-black uppercase tracking-widest"
  },
  profissional: {
    name: "Profissional / SEO",
    bg: "bg-emerald-50",
    card: "bg-white border-emerald-200 shadow-md",
    accent: "text-emerald-700",
    button: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20",
    text: "text-slate-600",
    border: "border-emerald-100",
    input: "bg-white border-emerald-200 text-slate-900 focus:border-emerald-600",
    label: "text-emerald-600 font-bold uppercase tracking-tight"
  }
};

const PLATFORMS: Record<SearchPlatform, { name: string; icon: any; color: string }> = {
  google: { name: "Google SEO", icon: Globe, color: "text-blue-500" },
  youtube: { name: "YouTube", icon: Youtube, color: "text-red-500" },
  amazon: { name: "Amazon / E-com", icon: ShoppingCart, color: "text-orange-500" },
  pinterest: { name: "Pinterest", icon: Target, color: "text-rose-500" }
};

interface KeywordResult {
  keyword: string;
  intent: string;
  difficulty: number;
  benefit: string;
}

export default function LongTailKeywordTool() {
  const [seed, setSeed] = useState("");
  const [platform, setPlatform] = useState<SearchPlatform>("google");
  const [theme, setTheme] = useState<KeywordTheme>("profissional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentTheme = THEMES[theme];

  const handleGenerate = async () => {
    if (!seed.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/keywords/long-tail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed, platform, tone: currentTheme.name })
      });
      const data = await response.json();
      if (data.keywords) {
        setResults(data.keywords);
      }
    } catch (error) {
      console.error("Error generating keywords:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = () => {
    if (results.length === 0) return;
    const content = results.map(r => `${r.keyword}\n[Intenção: ${r.intent}]\n[Dificuldade: ${r.difficulty}/100]\nBenefício: ${r.benefit}\n---\n`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keywords-longtail-mestre-digital-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 p-4 md:p-10 ${currentTheme.bg}`}>
      {/* Header/SEO Section */}
      <div className="max-w-6xl mx-auto mb-16 space-y-6">
        <div className="flex items-center gap-3">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'viral' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-100 text-emerald-600'}`}>
              <Search className="h-6 w-6" />
           </div>
           <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'viral' ? 'text-cyan-500' : 'text-emerald-600'}`}>
              SEO Keyword Master
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>
           Gerador de Palavras-Chave Long Tail com IA
        </h2>
        <p className={`text-lg font-medium ${theme === 'viral' ? 'text-cyan-200/40' : 'text-slate-500'}`}>
           Encontre nichos lucrativos e domine as buscas focando em termos específicos de alta conversão. Otimize seu tráfego orgânico com inteligência real.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-12">
        {/* Controls Pane */}
        <div className="lg:col-span-5 space-y-8">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${currentTheme.card} ${currentTheme.border}`}>
              
              {/* Theme Selector */}
              <div className="mb-10">
                <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Visual Style</label>
                <div className="grid grid-cols-2 gap-2">
                   {(Object.keys(THEMES) as KeywordTheme[]).map((t) => (
                     <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          theme === t 
                          ? (t === 'viral' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-white') 
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                     >
                       {THEMES[t].name}
                     </button>
                   ))}
                </div>
              </div>

              {/* Seed Keyword */}
              <div className="mb-8">
                 <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Palavra Semente / Tópico</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      placeholder="Ex: Marketing Digital para Iniciantes"
                      className={`w-full h-16 px-6 pr-14 rounded-2xl border-2 outline-none transition-all font-bold ${currentTheme.input}`}
                    />
                    <Search className={`absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 ${currentTheme.accent} opacity-50`} />
                 </div>
              </div>

              {/* Platform Selector */}
              <div className="mb-10">
                <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Plataforma Alvo</label>
                <div className="grid grid-cols-4 gap-3">
                   {(Object.keys(PLATFORMS) as SearchPlatform[]).map((key) => {
                     const p = PLATFORMS[key];
                     const Icon = p.icon;
                     return (
                       <button 
                          key={key}
                          onClick={() => setPlatform(key)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                            platform === key 
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-500 shadow-inner' 
                            : theme === 'viral' ? 'bg-white/10 border-white/5 text-zinc-400 hover:bg-white/20' : 'bg-slate-50 border-slate-100 text-zinc-400 hover:bg-slate-100'
                          }`}
                        >
                           <Icon className={`h-6 w-6 ${platform === key ? p.color : 'text-zinc-500'}`} />
                           <span className="text-[8px] font-black uppercase tracking-tighter">{p.name}</span>
                        </button>
                     );
                   })}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !seed.trim()}
                className={`w-full h-18 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale ${currentTheme.button}`}
              >
                 {isGenerating ? (
                   <>
                     <CircleDashed className="h-5 w-5 animate-spin" />
                     <span>Analizando Buscas...</span>
                   </>
                 ) : (
                   <>
                     <Zap className="h-5 w-5" />
                     <span>Gerar Caudas Longas</span>
                   </>
                 )}
              </button>
           </div>

           {/* Metrics Helper */}
           <div className={`p-8 rounded-[2.5rem] border ${theme === 'viral' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'} ${currentTheme.border}`}>
              <h4 className={`text-xs font-black uppercase tracking-widest mb-6 ${currentTheme.accent}`}>Entenda as Métricas</h4>
              <div className="space-y-4">
                 {[
                   { label: "Search Intent", desc: "Por que o usuário pesquisa isso? Informativo é topo de funil, Transacional é venda." },
                   { label: "KD (Keyword Difficulty)", desc: "Dificuldade de 0 a 100 para chegar na primeira página organicamente." },
                   { label: "Caudas Longas", desc: "Termos com 3+ palavras. Menos tráfego total, mas conversão 3x maior." }
                 ].map((m, i) => (
                   <div key={i} className="flex gap-4">
                      <div className={`h-2 w-2 rounded-full mt-1.5 ${currentTheme.accent} opacity-50 flex-shrink-0`} />
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-tighter ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>{m.label}</p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{m.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-7 space-y-6">
           <div className={`p-8 md:p-12 rounded-[3.5rem] border shadow-2xl transition-all duration-700 min-h-[600px] flex flex-col ${
             theme === 'viral' ? 'bg-[#050b1a]' : 'bg-white'
           } ${currentTheme.border}`}>
              
              <div className="flex items-center justify-between mb-10">
                 <div className="flex gap-6">
                    <button className="text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 border-blue-500 text-blue-500">Sugestões Long Tail</button>
                    <button className="text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 border-transparent text-zinc-500 hover:text-zinc-900">Métricas SEO</button>
                 </div>
                 {results.length > 0 && (
                   <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all"
                   >
                     <Download className="h-3.5 w-3.5" />
                     Exportar Lista
                   </button>
                 )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[700px] custom-scrollbar">
                 <AnimatePresence mode="popLayout">
                   {results.length > 0 ? (
                     results.map((item, idx) => (
                       <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-6 rounded-3xl border transition-all hover:border-emerald-500 shadow-sm group relative overflow-hidden ${
                          theme === 'viral' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                        }`}
                       >
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                                  item.difficulty < 30 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                  item.difficulty < 60 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                  'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                }`}>
                                   KD: {item.difficulty}
                                </div>
                                <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                                  theme === 'viral' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                   {item.intent}
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => handleCopy(item.keyword, idx)}
                                  className={`p-2 rounded-lg transition-all ${theme === 'viral' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-slate-100 shadow-sm'}`}
                                >
                                   {copiedIndex === idx ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className={`h-4 w-4 ${currentTheme.accent}`} />}
                                </button>
                             </div>
                          </div>

                          <h3 className={`text-xl font-black tracking-tight leading-tight mb-4 ${
                            theme === 'viral' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {item.keyword}
                          </h3>

                          <div className={`pt-4 border-t ${theme === 'viral' ? 'border-white/5' : 'border-slate-100'}`}>
                             <p className="text-[10px] text-zinc-500 font-bold leading-relaxed flex items-center gap-2">
                                <BarChart3 className="h-3 w-3 text-emerald-500" />
                                <span className="opacity-60">Insight:</span>
                                <span className={currentTheme.accent}>{item.benefit}</span>
                             </p>
                          </div>
                          
                          {/* Visual Accent */}
                          <div className={`absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500 ${results ? 'w-1/3 group-hover:w-full' : 'w-0'}`} />
                       </motion.div>
                     ))
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                        <div className={`h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center animate-pulse ${
                          theme === 'viral' ? 'border-white/10 text-white/10' : 'border-slate-100 text-slate-200'
                        }`}>
                           <Target className="h-10 w-10" />
                        </div>
                        <div className="space-y-2 max-w-xs">
                           <h4 className={`text-md font-black uppercase tracking-widest ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>Keywords que Rankeam</h4>
                           <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                              Insira um tema principal para descobrir as perguntas e frases específicas que seus clientes estão buscando agora.
                           </p>
                        </div>
                     </div>
                   )}
                 </AnimatePresence>
              </div>
           </div>

           {/* SEO Content Tip */}
           <div className={`p-8 rounded-[3rem] border ${theme === 'viral' ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <h5 className={`text-sm font-black uppercase tracking-tight ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>Dica Pro: Intenção vs Volume</h5>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                       Não se engane pelo baixo volume das caudas longas. Elas representam 70% das buscas totais na web e convertem muito mais porque o usuário já sabe exatamente o que quer. 
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
