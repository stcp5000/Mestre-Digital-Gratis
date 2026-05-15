import { useState } from "react";
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  CircleDashed,
  Youtube, 
  Instagram, 
  ShoppingBag,
  Target,
  Sparkles,
  MousePointer2,
  Tags,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type DescriptionTheme = "divertido" | "classico" | "viral" | "profissional";
type PlatformType = "youtube" | "instagram" | "produto";

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

const THEMES: Record<DescriptionTheme, ThemeConfig> = {
  divertido: {
    name: "Divertido / Criativo",
    bg: "bg-purple-50",
    card: "bg-white border-purple-200 shadow-xl",
    accent: "text-purple-600",
    button: "bg-purple-500 text-white hover:bg-purple-600 shadow-[0_4px_0_#7e22ce]",
    text: "text-slate-600",
    border: "border-purple-100",
    input: "bg-purple-50/50 border-purple-200 text-slate-800 focus:border-purple-400",
    label: "text-purple-600 font-black uppercase italic"
  },
  classico: {
    name: "Clássico / Elegante",
    bg: "bg-slate-50",
    card: "bg-white border-slate-200 shadow-sm",
    accent: "text-slate-900",
    button: "bg-slate-900 text-white hover:bg-slate-800",
    text: "text-slate-600",
    border: "border-slate-200",
    input: "bg-white border-slate-200 text-slate-900 focus:border-slate-400",
    label: "text-slate-400 font-serif italic"
  },
  viral: {
    name: "Viral / Impactante",
    bg: "bg-[#09090b]",
    card: "bg-white/5 border-amber-500/30 backdrop-blur-xl",
    accent: "text-amber-400 font-extrabold",
    button: "bg-amber-500 text-black font-black uppercase tracking-widest hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    text: "text-amber-200/60",
    border: "border-amber-500/20",
    input: "bg-black border-amber-500/20 text-amber-400 focus:border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
    label: "text-amber-500 font-black uppercase tracking-widest"
  },
  profissional: {
    name: "Profissional / SEO",
    bg: "bg-amber-50",
    card: "bg-white border-amber-200 shadow-md",
    accent: "text-amber-700",
    button: "bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-600/20",
    text: "text-slate-600",
    border: "border-amber-100",
    input: "bg-white border-amber-200 text-slate-900 focus:border-amber-600",
    label: "text-amber-600 font-bold uppercase tracking-tight"
  }
};

const PLATFORMS: Record<PlatformType, { name: string; icon: any; color: string }> = {
  youtube: { name: "YouTube", icon: Youtube, color: "text-red-500" },
  instagram: { name: "Instagram", icon: Instagram, color: "text-pink-500" },
  produto: { name: "Produto / E-com", icon: ShoppingBag, color: "text-blue-500" }
};

interface DescriptionResult {
  description: string;
  seoScore: number;
  keywords_used: string[];
  short_teaser: string;
}

export default function DescriptionCreatorTool() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("youtube");
  const [theme, setTheme] = useState<DescriptionTheme>("profissional");
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<DescriptionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const currentTheme = THEMES[theme];

  const handleCreate = async () => {
    if (!title.trim() || isCreating) return;
    setIsCreating(true);
    try {
      const response = await fetch("/api/description/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, details, platform, tone: currentTheme.name })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error creating description:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `DESCRIÇÃO GERADA - MESTRE DIGITAL\n
Plataforma: ${platform.toUpperCase()}
Item: ${title}

TEASER / META DESCRIPTION:
${result.short_teaser}

DESCRIÇÃO COMPLETA:
${result.description}

PALAVRAS-CHAVE SEO:
${result.keywords_used.join(", ")}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `descricao-${platform}-${Date.now()}.txt`;
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
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'viral' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <FileText className="h-6 w-6" />
           </div>
           <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'viral' ? 'text-amber-500' : 'text-amber-600'}`}>
              Content Authority
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>
           Criador de Descrições para Vídeos, Posts e Produtos com IA
        </h2>
        <p className={`text-lg font-medium ${theme === 'viral' ? 'text-amber-200/40' : 'text-slate-500'}`}>
           Gere descrições mestre otimizadas para SEO que convertem views em clientes. Perfeito para YouTube Creators, Influencers e E-commerces.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-12">
        {/* Input Pane */}
        <div className="lg:col-span-5 space-y-8">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${currentTheme.card} ${currentTheme.border}`}>
              
              {/* Theme Selector */}
              <div className="mb-10">
                <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Estilo Visual</label>
                <div className="grid grid-cols-2 gap-2">
                   {(Object.keys(THEMES) as DescriptionTheme[]).map((t) => (
                     <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          theme === t 
                          ? (t === 'viral' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-slate-900 text-white') 
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                     >
                       {THEMES[t].name}
                     </button>
                   ))}
                </div>
              </div>

              {/* Platform Selector */}
              <div className="mb-10">
                <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Plataforma Destino</label>
                <div className="grid grid-cols-3 gap-3">
                   {(Object.keys(PLATFORMS) as PlatformType[]).map((key) => {
                     const p = PLATFORMS[key];
                     const Icon = p.icon;
                     return (
                       <button 
                          key={key}
                          onClick={() => setPlatform(key)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                            platform === key 
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 shadow-inner' 
                            : theme === 'viral' ? 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10' : 'bg-slate-50 border-slate-100 text-zinc-400 hover:bg-slate-100'
                          }`}
                        >
                           <Icon className={`h-6 w-6 ${platform === key ? p.color : 'text-zinc-500'}`} />
                           <span className="text-[8px] font-black uppercase tracking-tighter">{p.name}</span>
                        </button>
                     );
                   })}
                </div>
              </div>

              {/* Title Input */}
              <div className="mb-8">
                 <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Título do Vídeo ou Nome do Produto</label>
                 <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Como crescer no Instagram 2024"
                    className={`w-full h-14 px-6 rounded-2xl border-2 outline-none transition-all font-bold ${currentTheme.input}`}
                 />
              </div>

              {/* Details Input */}
              <div className="mb-8">
                 <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Pontos Chave / Benefícios (Opcional)</label>
                 <textarea 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Insira características, links ou pontos importantes..."
                    className={`w-full min-h-[120px] p-6 rounded-2xl border-2 outline-none transition-all font-bold resize-none ${currentTheme.input}`}
                 />
              </div>

              <button 
                onClick={handleCreate}
                disabled={isCreating || !title.trim()}
                className={`w-full h-18 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale ${currentTheme.button}`}
              >
                 {isCreating ? (
                   <>
                     <CircleDashed className="h-5 w-5 animate-spin" />
                     <span>Arquitetando Texto...</span>
                   </>
                 ) : (
                   <>
                     <Sparkles className="h-5 w-5" />
                     <span>Criar Descrição SEO</span>
                   </>
                 )}
              </button>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-7 space-y-6">
           <div className={`p-8 md:p-12 rounded-[3.5rem] border shadow-2xl transition-all duration-700 min-h-[600px] flex flex-col relative overflow-hidden ${
             theme === 'viral' ? 'bg-[#09090b]' : 'bg-white'
           } ${currentTheme.border}`}>
              
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8 h-full"
                  >
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <h3 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>Sua Descrição Mestre</h3>
                          <div className="flex items-center gap-2">
                             <div className="flex -space-x-1">
                                {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />)}
                             </div>
                             <span className="text-[10px] text-zinc-500 font-bold uppercase">Rankeamento SEO Nível {result.seoScore}%</span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={handleCopy}
                            className={`p-3 rounded-xl transition-all ${theme === 'viral' ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}
                          >
                             {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-zinc-400" />}
                          </button>
                          <button 
                            onClick={handleDownload}
                            className={`p-3 rounded-xl transition-all ${theme === 'viral' ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}
                          >
                             <Download className="h-5 w-5 text-zinc-400" />
                          </button>
                       </div>
                    </div>

                    {/* SEO Teaser */}
                    <div className={`p-6 rounded-3xl border border-dashed ${theme === 'viral' ? 'bg-white/5 border-white/10' : 'bg-amber-50/50 border-amber-200'}`}>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                          <Target className="h-3 w-3" /> Meta Teaser / Preview
                       </h4>
                       <p className={`text-sm italic font-medium leading-relaxed ${theme === 'viral' ? 'text-amber-200/60' : 'text-slate-600'}`}>
                          "{result.short_teaser}"
                       </p>
                    </div>

                    {/* Main Description */}
                    <div className={`flex-1 min-h-[300px] p-8 rounded-[2.5rem] border overflow-y-auto custom-scrollbar ${
                      theme === 'viral' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-100'
                    }`}>
                       <pre className={`whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed ${theme === 'viral' ? 'text-white/80' : 'text-slate-700'}`}>
                          {result.description}
                       </pre>
                    </div>

                    {/* Tags / Keywords */}
                    <div className="flex flex-wrap gap-2">
                       {result.keywords_used.map(tag => (
                         <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                            <Tags className="h-3 w-3" /> #{tag}
                         </span>
                       ))}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                          <MousePointer2 className="h-3 w-3 text-amber-500" /> Gatilhos de CTR Aplicados
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                          <Clock className="h-3 w-3 text-amber-500" /> Oitimizado para Algoritmo
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                     <div className={`h-32 w-32 rounded-full border-2 border-dashed flex items-center justify-center animate-pulse ${
                       theme === 'viral' ? 'border-white/10 text-white/10' : 'border-slate-100 text-slate-200'
                     }`}>
                        <FileText className="h-12 w-12" />
                     </div>
                     <div className="space-y-3 max-w-sm">
                        <h4 className={`text-xl font-black uppercase tracking-widest ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>Descrições que Vendem</h4>
                        <p className="text-sm text-zinc-500 font-bold leading-relaxed px-4">
                           Insira os dados à esquerda e deixe a IA redigir cada parágrafo com as melhores técnicas de SEO e copywriting do mercado.
                        </p>
                     </div>
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
