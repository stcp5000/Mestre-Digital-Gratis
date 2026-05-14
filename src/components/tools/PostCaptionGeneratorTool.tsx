import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCcw, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  MessageSquare,
  Zap,
  Target,
  Smile,
  Globe,
  Award,
  Hash,
  Share2,
  Rocket,
  CircleDashed,
  Lightbulb,
  Heart,
  TrendingUp,
  ShoppingCart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type CaptionTheme = "pop" | "corporate" | "minimal" | "vibes";

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
  resultCard: string;
}

const THEMES: Record<CaptionTheme, ThemeConfig> = {
  pop: {
    name: "Criativo Pop",
    bg: "bg-[#FF3B30]/5",
    card: "bg-white border-black/10 shadow-[4px_4px_20px_rgba(255,59,48,0.1)]",
    accent: "text-[#FF3B30]",
    button: "bg-[#FF3B30] text-white hover:shadow-[0_0_15px_rgba(255,59,48,0.4)] hover:scale-105",
    text: "text-slate-600",
    border: "border-[#FF3B30]/20",
    input: "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#FF3B30]",
    label: "text-[#FF3B30] font-black",
    resultCard: "bg-[#FF3B30]/5 border-slate-100"
  },
  corporate: {
    name: "Classic Executivo",
    bg: "bg-slate-50",
    card: "bg-white border-slate-200 shadow-sm",
    accent: "text-indigo-900",
    button: "bg-indigo-900 text-white hover:bg-slate-800",
    text: "text-slate-600",
    border: "border-slate-200",
    input: "bg-white border-slate-200 text-slate-800 focus:border-indigo-600",
    label: "text-slate-500 font-bold",
    resultCard: "bg-slate-50 border-slate-100"
  },
  minimal: {
    name: "Clean Zen",
    bg: "bg-white",
    card: "bg-white border-slate-100",
    accent: "text-emerald-600",
    button: "bg-black text-white px-8 rounded-full",
    text: "text-slate-500",
    border: "border-slate-100",
    input: "bg-slate-50/50 border-slate-100 text-slate-700 focus:border-emerald-200",
    label: "text-slate-400 font-medium",
    resultCard: "bg-white border-slate-50"
  },
  vibes: {
    name: "Dark Impact",
    bg: "bg-[#050505]",
    card: "bg-zinc-900 border-white/5 shadow-2xl",
    accent: "text-fuchsia-500",
    button: "bg-fuchsia-600 text-white font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(192,38,211,0.4)]",
    text: "text-white/60",
    border: "border-white/5",
    input: "bg-black border-white/5 text-white focus:border-fuchsia-500",
    label: "text-fuchsia-400 capitalize italic",
    resultCard: "bg-white/5 border-white/5"
  }
};

const NICHES = [
  { id: "fashion", name: "Moda & Estilo", icon: Heart },
  { id: "tech", name: "Tech & Digital", icon: Cpu },
  { id: "food", name: "Gastronomia", icon: Utensils },
  { id: "fitness", name: "Fitness & Saúde", icon: Flame },
  { id: "education", name: "Educação", icon: Lightbulb },
  { id: "travel", name: "Viagem", icon: Globe },
  { id: "real-estate", name: "Imobiliário", icon: Building2 },
  { id: "marketing", name: "Marketing", icon: TrendingUp }
];

const OBJECTIVES = [
  { id: "engagement", name: "Engajamento", focus: "Comentários e Curtidas" },
  { id: "sales", name: "Vendas", focus: "Conversão e Cliques" },
  { id: "inspiration", name: "Inspiração", focus: "Compartilhamentos" },
  { id: "information", name: "Informativo", focus: "Salvamentos" }
];

import { Cpu, Utensils, Flame, Building2 } from "lucide-react";

export default function PostCaptionGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("marketing");
  const [objective, setObjective] = useState("engagement");
  const [theme, setTheme] = useState<CaptionTheme>("pop");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const currentTheme = THEMES[theme];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setResults([]);
    try {
      const response = await fetch("/api/caption/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic, 
          niche: NICHES.find(n => n.id === niche)?.name, 
          objective: OBJECTIVES.find(o => o.id === objective)?.name,
          tone: currentTheme.name
        })
      });
      const data = await response.json();
      if (data.captions) {
        setResults(data.captions);
      }
    } catch (error) {
      console.error("Caption generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12 text-left">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded border border-rose-500/20">
             Social Media AI
           </span>
           <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/20">
             Viral Ready
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'vibes' ? 'text-white' : 'text-slate-900'}`}>
           Gerador de Legendas para Posts
        </h2>
        <p className={`text-lg font-medium ${theme === 'vibes' ? 'text-zinc-500' : 'text-slate-500'}`}>
           Crie legendas que conectam e convertem. Personalize o nicho, o objetivo e o design para combinar com a identidade da sua marca.
        </p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1.5 rounded-2xl border border-white/10 w-fit overflow-x-auto no-scrollbar shadow-2xl">
        {(Object.keys(THEMES) as CaptionTheme[]).map((t) => (
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
           <div className={`p-8 rounded-[3rem] border transition-all duration-500 ${currentTheme.card} space-y-8 shadow-xl`}>
              
              {/* Niche Selector */}
              <div className="space-y-3">
                 <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>
                    Nicho do Conteúdo
                 </label>
                 <div className="grid grid-cols-2 gap-2">
                    {NICHES.map((n) => {
                      const Icon = n.icon;
                      return (
                        <button
                          key={n.id}
                          onClick={() => setNiche(n.id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                            niche === n.id 
                            ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-600' 
                            : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                           <Icon className="h-4 w-4 shrink-0" />
                           <span className="text-[10px] font-bold uppercase tracking-tight truncate">{n.name}</span>
                        </button>
                      );
                    })}
                 </div>
              </div>

              {/* Objective Selector */}
              <div className="space-y-3">
                 <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>
                    Objetivo do Post
                 </label>
                 <div className="grid grid-cols-2 gap-2">
                    {OBJECTIVES.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setObjective(o.id)}
                        className={`p-3 rounded-2xl border transition-all text-center ${
                          objective === o.id 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600' 
                          : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                         <div className="text-[10px] font-bold uppercase">{o.name}</div>
                         <div className="text-[8px] opacity-60 uppercase">{o.focus}</div>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-3">
                 <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>
                    Sobre o que é o post?
                 </label>
                 <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Novo lançamento de curso de yoga para iniciantes focado em flexibilidade..."
                    className={`w-full h-32 p-5 rounded-3xl border outline-none resize-none transition-all text-sm leading-relaxed ${currentTheme.input}`}
                 />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                  currentTheme.button
                } ${isGenerating ? 'opacity-50' : 'active:scale-95'}`}
              >
                 {isGenerating ? (
                   <>
                     <CircleDashed className="h-5 w-5 animate-spin" />
                     <span>Sincronizando Feed...</span>
                   </>
                 ) : (
                   <>
                     <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                     <span>Gerar Legendas Virais</span>
                   </>
                 )}
              </button>
           </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7 space-y-6">
           <div className={`p-8 md:p-12 rounded-[3.5rem] border shadow-2xl transition-all duration-700 min-h-[600px] flex flex-col ${
             theme === 'vibes' ? 'bg-zinc-950' : 'bg-white'
           } ${currentTheme.border}`}>
              
              <div className="flex items-center justify-between mb-10">
                 <div className="flex gap-3 items-center">
                    <MessageSquare className={`h-6 w-6 ${currentTheme.accent}`} />
                    <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme === 'vibes' ? 'text-white' : 'text-slate-900'}`}>Legendas Geradas</h3>
                 </div>
                 <div className="hidden sm:flex gap-4">
                    <Instagram className="h-4 w-4 text-slate-300" />
                    <Linkedin className="h-4 w-4 text-slate-300" />
                    <Twitter className="h-4 w-4 text-slate-300" />
                 </div>
              </div>

              <AnimatePresence mode="wait">
                 {results.length > 0 ? (
                   <motion.div 
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                   >
                     {results.map((item, idx) => (
                       <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.01] group ${currentTheme.resultCard}`}
                       >
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full animate-pulse ${theme === 'pop' ? 'bg-[#FF3B30]' : 'bg-emerald-500'}`} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opçao {idx + 1}</span>
                             </div>
                             <button 
                               onClick={() => copyToClipboard(item.body + "\n\n" + item.hashtags.join(" "), idx)}
                               className={`p-2 rounded-xl transition-all ${
                                 copiedId === idx ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                               }`}
                             >
                                {copiedId === idx ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                             </button>
                          </div>
                          
                          <div className={`text-sm leading-relaxed mb-6 whitespace-pre-wrap ${theme === 'vibes' ? 'text-white/80' : 'text-slate-700 font-medium'}`}>
                             {item.body}
                          </div>

                          <div className="space-y-3 pt-6 border-t border-slate-100">
                             <div className="flex items-center gap-2">
                                <Hash className="h-3.5 w-3.5 text-indigo-500" />
                                <div className="flex flex-wrap gap-2">
                                   {item.hashtags.map((tag: string, i: number) => (
                                     <span key={i} className="text-[10px] font-bold text-indigo-600/70">{tag}</span>
                                   ))}
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <Target className="h-3.5 w-3.5 text-rose-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CTA Sugerido:</span>
                                <span className="text-[10px] font-black text-slate-800 uppercase">{item.cta}</span>
                             </div>
                          </div>
                       </motion.div>
                     ))}
                   </motion.div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                      <div className={`h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center ${theme === 'vibes' ? 'border-white/10 text-white/10' : 'border-slate-100 text-slate-200'}`}>
                         <Share2 className="h-10 w-10" />
                      </div>
                      <div className="max-w-[280px] space-y-2">
                         <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'vibes' ? 'text-white' : 'text-slate-900'}`}>Pronto para viralizar?</h4>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Defina o tópico do seu post e deixe a IA criar legendas que engajam e vendem em segundos.
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
