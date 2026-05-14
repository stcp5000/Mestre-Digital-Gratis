import React, { useState } from "react";
import { 
  Zap, 
  Target, 
  MousePointer2, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCcw, 
  ShoppingCart, 
  Users, 
  Share2, 
  Rocket, 
  Award,
  CircleDashed,
  Search,
  Layout,
  MessageSquare,
  Globe,
  Star,
  Triangle,
  Monitor,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Theme Definitions ---

type CTATheme = "neon" | "executive" | "minimal" | "impact";
type CTANiche = "ecommerce" | "leads" | "content" | "scarcity";

interface NicheConfig {
  name: string;
  icon: any;
  description: string;
  focus: string;
}

const NICHES: Record<CTANiche, NicheConfig> = {
  ecommerce: {
    name: "E-commerce & Vendas",
    icon: ShoppingCart,
    description: "Focado em conversão direta, checkouts e promoções.",
    focus: "Urgência, benefício imediato e clareza de preço."
  },
  leads: {
    name: "Captura de Leads",
    icon: Users,
    description: "Ideal para landing pages, formulários e newsletters.",
    focus: "Valor gratuito, curiosidade e facilidade de cadastro."
  },
  content: {
    name: "Conteúdo & Social",
    icon: Share2,
    description: "Para blogs, YouTube e redes sociais.",
    focus: "Engajamento, continuidade e conexão emocional."
  },
  scarcity: {
    name: "Escassez & Eventos",
    icon: Award,
    description: "Webinars, lançamentos e ofertas por tempo limitado.",
    focus: "FOMO (medo de ficar de fora), exclusividade e contagem regressiva."
  }
};

const THEMES: Record<CTATheme, {
  name: string;
  bg: string;
  card: string;
  accent: string;
  button: string;
  text: string;
  border: string;
  label: string;
}> = {
  neon: {
    name: "Brutal Neon",
    bg: "bg-[#0b0b0b]",
    card: "bg-white/5 backdrop-blur-xl border-fuchsia-500/30",
    accent: "text-fuchsia-400 font-black italic",
    button: "bg-fuchsia-500 text-black shadow-[0_0_20px_rgba(217,70,239,0.3)]",
    text: "text-white/90",
    border: "border-fuchsia-500/20",
    label: "text-fuchsia-400"
  },
  executive: {
    name: "Corporativo",
    bg: "bg-[#e4e3e0]",
    card: "bg-white border-slate-900/10 shadow-xl",
    accent: "text-slate-900 font-serif italic",
    button: "bg-slate-900 text-white",
    text: "text-slate-600",
    border: "border-slate-200",
    label: "text-slate-400"
  },
  minimal: {
    name: "Clean Utilitário",
    bg: "bg-slate-50",
    card: "bg-white border-slate-200 shadow-sm",
    accent: "text-blue-600 font-semibold",
    button: "bg-blue-600 text-white",
    text: "text-slate-500",
    border: "border-slate-200",
    label: "text-slate-400"
  },
  impact: {
    name: "Editorial Hero",
    bg: "bg-[#050505]",
    card: "bg-zinc-900 border-white/10",
    accent: "text-orange-500 font-black",
    button: "bg-orange-500 text-black font-black uppercase tracking-tighter",
    text: "text-zinc-400",
    border: "border-zinc-800",
    label: "text-zinc-500"
  }
};

export default function CTAGeneratorTool() {
  const [theme, setTheme] = useState<CTATheme>("neon");
  const [niche, setNiche] = useState<CTANiche>("ecommerce");
  const [context, setContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ cta: string; type: string; why: string }[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const currentTheme = THEMES[theme];

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setIsGenerating(true);
    setResults([]);
    
    try {
      const response = await fetch("/api/cta/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          context, 
          niche: NICHES[niche].name,
          focus: NICHES[niche].focus,
          tone: theme
        })
      });
      const data = await response.json();
      if (data.ctas) {
        setResults(data.ctas);
      }
    } catch (error) {
      console.error("CTA Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-12 text-left">
      {/* Header & SEO Optimized Info */}
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded border border-indigo-500/20">
             Conversão & Copywriting AI
           </span>
           <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/20">
             SEO Ready
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'executive' ? 'text-slate-900' : 'text-white'}`}>
           Gerador de CTA (Call to Action) Poderosos
        </h2>
        <p className={`text-lg font-medium ${theme === 'executive' ? 'text-slate-600' : 'text-slate-400'}`}>
           Crie gatilhos mentais e chamadas irresistíveis com IA. Otimize sua conversão para anúncios, landing pages e redes sociais com nichos especializados.
        </p>
      </div>

      {/* Theme Switcher Overlay */}
      <div className="flex bg-[#05192d] p-1.5 rounded-2xl border border-white/10 w-fit overflow-x-auto no-scrollbar shadow-2xl">
        {(Object.keys(THEMES) as CTATheme[]).map((t) => (
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
        {/* Input Interface */}
        <div className="lg:col-span-5 space-y-6">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${currentTheme.card} space-y-8`}>
              
              {/* Niche Selector */}
              <div className="space-y-3">
                 <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>
                    Escolha o Nicho de Conversão
                 </label>
                 <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(NICHES) as CTANiche[]).map((key) => {
                      const n = NICHES[key];
                      const Icon = n.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setNiche(key)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                            niche === key 
                            ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                            : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                          }`}
                        >
                           <Icon className="h-5 w-5" />
                           <span className="text-[9px] font-black uppercase tracking-wider text-center">{n.name}</span>
                        </button>
                      );
                    })}
                 </div>
              </div>

              {/* Context Input */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>
                       Sobre o que é seu produto/serviço?
                    </label>
                    <Lightbulb className="h-4 w-4 text-indigo-500" />
                 </div>
                 <textarea 
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Ex: Venda de curso de marketing digital para iniciantes, oferta de 40% de desconto exclusiva..."
                    className={`w-full bg-white/5 border-2 outline-none p-5 rounded-2xl text-sm transition-all h-36 resize-none ${
                        theme === 'executive' || theme === 'minimal' ? 'text-slate-900 border-slate-200 focus:border-slate-900' : 'text-white border-white/5 focus:border-indigo-500'
                    }`}
                 />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !context.trim()}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${
                  currentTheme.button
                } ${isGenerating ? 'opacity-50' : 'hover:scale-[1.02] active:scale-95'}`}
              >
                 {isGenerating ? (
                   <>
                     <CircleDashed className="h-5 w-5 animate-spin" />
                     <span>Arquitetando Copy...</span>
                   </>
                 ) : (
                   <>
                     <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                     <span>Gerar CTAs de Elite</span>
                   </>
                 )}
              </button>
           </div>

           {/* Conversion Tip */}
           <div className={`p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-3`}>
              <div className="flex items-center gap-3">
                 <Award className="h-5 w-5 text-indigo-400" />
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Segredo de Conversão</h4>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                "{NICHES[niche].focus}. Um bom CTA deve ser um comando de ação que o cérebro não precisa pensar para processar."
              </p>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-7 space-y-6">
           <div className={`p-8 md:p-12 rounded-[3.5rem] border shadow-2xl transition-all duration-700 min-h-[600px] flex flex-col ${
             theme === 'executive' || theme === 'minimal' ? 'bg-white' : 'bg-[#05192d]'
           } ${currentTheme.border} relative overflow-hidden`}>
              
              <div className="flex items-center justify-between mb-8">
                 <div className="flex gap-2">
                    <MousePointer2 className="h-5 w-5 text-indigo-500" />
                    <h3 className={`text-[12px] font-black uppercase tracking-[0.2em] ${theme === 'executive' ? 'text-slate-900' : 'text-white'}`}>Sugestões de Alta Performance</h3>
                 </div>
                 <div className="hidden sm:flex items-center gap-2 text-slate-500">
                    <Zap className="h-3 w-3" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter">AI Analysis Active</span>
                 </div>
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
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`group p-6 rounded-3xl border transition-all hover:scale-[1.01] ${
                          theme === 'executive' || theme === 'minimal' ? 'bg-slate-50 border-slate-100 hover:border-indigo-500/50' : 'bg-white/5 border-white/5 hover:border-fuchsia-500/50'
                        }`}
                       >
                          <div className="flex justify-between items-start mb-4">
                             <div className="space-y-1">
                                <span className={`text-xl md:text-2xl font-black tracking-tight leading-tight block ${
                                    theme === 'executive' || theme === 'minimal' ? 'text-slate-900' : 'text-white'
                                }`}>{item.cta}</span>
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{item.type}</span>
                             </div>
                             <button 
                               onClick={() => copyToClipboard(item.cta)}
                               className={`p-2 rounded-xl transition-all ${
                                 theme === 'executive' || theme === 'minimal' ? 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20' : 'bg-white/10 text-white hover:bg-white/20'
                               }`}
                             >
                                {copied === item.cta ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                             </button>
                          </div>
                          <div className="pt-4 border-t border-indigo-500/10">
                             <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                               <strong className="text-indigo-400">Poder de Conversão:</strong> {item.why}
                             </p>
                          </div>
                       </motion.div>
                     ))}
                   </motion.div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                      <div className={`h-24 w-24 rounded-full border-2 flex items-center justify-center animate-pulse ${
                          theme === 'executive' || theme === 'minimal' ? 'border-slate-100 text-slate-200' : 'border-white/5 text-slate-700'
                      }`}>
                         <Target className="h-10 w-10" />
                      </div>
                      <div className="max-w-[280px] space-y-2">
                         <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'executive' ? 'text-slate-900' : 'text-white'}`}>Pronto para decolar?</h4>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Insira o contexto do seu produto e veja a IA gerar chamadas que convertem visitantes em clientes fiéis.
                         </p>
                      </div>
                   </div>
                 )}
              </AnimatePresence>
           </div>

           {/* Stats / Proof (Static Mock for visual polish) */}
           <div className="grid grid-cols-3 gap-4">
              {[
                  { label: "Taxa de Cliques", value: "+24%", color: "text-emerald-400" },
                  { label: "Engajamento", value: "3.2x", color: "text-indigo-400" },
                  { label: "Custo por Lead", value: "-15%", color: "text-fuchsia-400" }
              ].map((stat, i) => (
                  <div key={i} className={`p-5 rounded-3xl border border-white/5 bg-[#05192d] text-center space-y-1`}>
                     <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
                     <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
