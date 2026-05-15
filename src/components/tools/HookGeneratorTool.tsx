import { useState } from "react";
import { 
  Flame, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  CircleDashed,
  Youtube, 
  Instagram, 
  Music,
  Target,
  Sparkles,
  MousePointer2,
  Eye,
  Trophy,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type HookTheme = "divertido" | "classico" | "viral" | "profissional";
type PlatformType = "tiktok" | "instagram" | "youtube" | "facebook";
type FormatType = "reels" | "shorts" | "video_longo" | "post_estatico" | "carrossel";

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

const THEMES: Record<HookTheme, ThemeConfig> = {
  divertido: {
    name: "Divertido / Criativo",
    bg: "bg-emerald-50",
    card: "bg-white border-emerald-200 shadow-xl",
    accent: "text-emerald-600",
    button: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_4px_0_#059669]",
    text: "text-slate-600",
    border: "border-emerald-100",
    input: "bg-emerald-50/50 border-emerald-200 text-slate-800 focus:border-emerald-400",
    label: "text-emerald-600 font-black uppercase italic"
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
    card: "bg-white/5 border-orange-500/30 backdrop-blur-xl",
    accent: "text-orange-400 font-extrabold",
    button: "bg-orange-500 text-black font-black uppercase tracking-widest hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.3)]",
    text: "text-orange-200/60",
    border: "border-orange-500/20",
    input: "bg-black border-orange-500/20 text-orange-400 focus:border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]",
    label: "text-orange-500 font-black uppercase tracking-widest"
  },
  profissional: {
    name: "Profissional / SEO",
    bg: "bg-orange-50",
    card: "bg-white border-orange-200 shadow-md",
    accent: "text-orange-700",
    button: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20",
    text: "text-slate-600",
    border: "border-orange-100",
    input: "bg-white border-orange-200 text-slate-900 focus:border-orange-600",
    label: "text-orange-600 font-bold uppercase tracking-tight"
  }
};

const PLATFORMS: Record<PlatformType, { name: string; icon: any; color: string }> = {
  tiktok: { name: "TikTok", icon: Music, color: "text-cyan-400" },
  instagram: { name: "Instagram", icon: Instagram, color: "text-pink-500" },
  youtube: { name: "YouTube", icon: Youtube, color: "text-red-500" },
  facebook: { name: "Facebook", icon: Users, color: "text-blue-600" }
};

const FORMATS: Record<FormatType, string> = {
  reels: "Reels / TikTok",
  shorts: "YouTube Shorts",
  video_longo: "Vídeo Longo",
  post_estatico: "Post Estático",
  carrossel: "Carrossel de Conteúdo"
};

interface HookData {
  text: string;
  trigger: string;
  visual: string;
  score: number;
}

interface HookResult {
  hooks: HookData[];
}

export default function HookGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("instagram");
  const [format, setFormat] = useState<FormatType>("reels");
  const [theme, setTheme] = useState<HookTheme>("profissional");
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<HookResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentTheme = THEMES[theme];

  const handleCreate = async () => {
    if (!topic.trim() || isCreating) return;
    setIsCreating(true);
    try {
      const response = await fetch("/api/hooks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic, 
          platform: PLATFORMS[platform].name, 
          format: FORMATS[format],
          tone: currentTheme.name 
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error generating hooks:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `GERADOR DE HOOKS - MESTRE DIGITAL\n
Assunto: ${topic}
Plataforma: ${PLATFORMS[platform].name}
Formato: ${FORMATS[format]}

GANCHOS GERADOS:
${result.hooks.map((h, i) => `
HOOK #${i + 1}:
Texto: ${h.text}
Gatilho: ${h.trigger}
Visual: ${h.visual}
Retenção: ${h.score}/100
-------------------`).join("\n")}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hooks-${platform}-${Date.now()}.txt`;
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
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'viral' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
              <Flame className="h-6 w-6" />
           </div>
           <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'viral' ? 'text-orange-500' : 'text-orange-600'}`}>
              Viral Retention Authority
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>
           Gerador de Hooks para Redes Sociais e Viralidade com IA
        </h2>
        <p className={`text-lg font-medium ${theme === 'viral' ? 'text-orange-200/40' : 'text-slate-500'}`}>
           Capture a atenção do seu público nos primeiros 3 segundos. Gere ganchos cinematográficos e psicológicos para Reels, Shorts, TikTok e muito mais.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-12">
        {/* Input Pane */}
        <div className="lg:col-span-5 space-y-8">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${currentTheme.card} ${currentTheme.border}`}>
              
              {/* Theme Selector */}
              <div className="mb-10">
                <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Visual Style</label>
                <div className="grid grid-cols-2 gap-2">
                   {(Object.keys(THEMES) as HookTheme[]).map((t) => (
                     <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          theme === t 
                          ? (t === 'viral' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-slate-900 text-white') 
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
                <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Rede Social</label>
                <div className="grid grid-cols-4 gap-3">
                   {(Object.keys(PLATFORMS) as PlatformType[]).map((key) => {
                     const p = PLATFORMS[key];
                     const Icon = p.icon;
                     return (
                       <button 
                          key={key}
                          onClick={() => setPlatform(key)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                            platform === key 
                            ? 'bg-orange-500/10 border-orange-500/50 text-orange-600 shadow-inner' 
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

              {/* Format Selector */}
              <div className="mb-10">
                <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Formato do Conteúdo</label>
                <select 
                   value={format}
                   onChange={(e) => setFormat(e.target.value as FormatType)}
                   className={`w-full h-14 px-6 rounded-2xl border-2 outline-none transition-all font-bold appearance-none ${currentTheme.input}`}
                >
                   {Object.entries(FORMATS).map(([val, label]) => (
                     <option key={val} value={val}>{label}</option>
                   ))}
                </select>
              </div>

              {/* Topic Input */}
              <div className="mb-8">
                 <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Assunto do Vídeo / Post</label>
                 <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Como economizar dinheiro viajando..."
                    className={`w-full min-h-[100px] p-6 rounded-2xl border-2 outline-none transition-all font-bold resize-none ${currentTheme.input}`}
                 />
              </div>

              <button 
                onClick={handleCreate}
                disabled={isCreating || !topic.trim()}
                className={`w-full h-18 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale ${currentTheme.button}`}
              >
                 {isCreating ? (
                   <>
                     <CircleDashed className="h-5 w-5 animate-spin" />
                     <span>Hackeando Atenção...</span>
                   </>
                 ) : (
                   <>
                     <Zap className="h-5 w-5" />
                     <span>Gerar Hooks Virais</span>
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
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <h3 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>Ganchos Irresistíveis</h3>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-2">
                             <Target className="h-3 w-3 text-orange-500" /> Gatilhos Mentais de Alta Precisão
                          </p>
                       </div>
                       <button 
                          onClick={handleDownload}
                          className={`p-4 rounded-2xl transition-all ${theme === 'viral' ? 'bg-white/5 border-white/5 text-orange-400' : 'bg-slate-50 text-slate-600'} hover:scale-105`}
                       >
                          <Download className="h-5 w-5" />
                       </button>
                    </div>

                    <div className="space-y-6">
                       {result.hooks.map((hook, idx) => (
                         <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-[2rem] border relative group transition-all hover:scale-[1.02] ${
                              theme === 'viral' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                            }`}
                         >
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-3">
                                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                                    theme === 'viral' ? 'bg-orange-500 text-black' : 'bg-slate-900 text-white'
                                  }`}>
                                     {idx + 1}
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                     {hook.trigger}
                                  </span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">
                                     {hook.score}% Score
                                  </span>
                                  <button 
                                     onClick={() => handleCopy(hook.text, idx)}
                                     className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/5"
                                  >
                                     {copiedIndex === idx ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-zinc-400" />}
                                  </button>
                               </div>
                            </div>
                            
                            <p className={`text-lg font-black leading-tight mb-4 ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>
                               "{hook.text}"
                            </p>

                            <div className={`p-4 rounded-xl flex items-center gap-3 ${theme === 'viral' ? 'bg-black/40 border border-white/5' : 'bg-white border border-slate-200'}`}>
                               <Eye className="h-4 w-4 text-orange-500 shrink-0" />
                               <p className="text-[10px] font-bold text-zinc-500 italic leading-relaxed">
                                  Sugestão Visual: {hook.visual}
                               </p>
                            </div>
                         </motion.div>
                       ))}
                    </div>

                    <div className={`p-8 rounded-[2.5rem] border ${theme === 'viral' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                       <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${currentTheme.accent} flex items-center gap-2`}>
                          <Sparkles className="h-4 w-4" /> Dica de Mestre do Algoritmo
                       </h4>
                       <p className={`text-xs font-bold leading-relaxed ${theme === 'viral' ? 'text-orange-200/60' : 'text-slate-600'}`}>
                          Os primeiros 3 segundos decidem se o seu vídeo será assistido ou ignorado. Use estes hooks combinados com cortes rápidos ou legendas dinâmicas no centro da tela para maximizar a retenção.
                       </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                     <div className={`h-32 w-32 rounded-full border-2 border-dashed flex items-center justify-center animate-pulse ${
                       theme === 'viral' ? 'border-white/10 text-white/10' : 'border-slate-100 text-slate-200'
                     }`}>
                        <Flame className="h-12 w-12" />
                     </div>
                     <div className="space-y-3 max-w-sm">
                        <h4 className={`text-xl font-black uppercase tracking-widest ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>A Ciência da Retenção</h4>
                        <p className="text-sm text-zinc-500 font-bold leading-relaxed px-4">
                           Defina o assunto e a plataforma à esquerda. Nossa IA vai criar ganchos psicológicos que forçam o scroll a parar imediatamente.
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
