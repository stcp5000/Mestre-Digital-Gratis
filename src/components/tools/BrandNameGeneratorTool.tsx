import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Lightbulb, 
  Zap, 
  Target, 
  Globe, 
  Search, 
  Copy, 
  Check, 
  RefreshCcw, 
  Rocket, 
  Palette, 
  Code, 
  Coffee, 
  Briefcase,
  Star,
  ChevronRight,
  Monitor,
  Layout,
  MousePointer2,
  Share2,
  ShieldCheck,
  CircleDashed,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type NameTheme = "minimal" | "vibrant" | "cyber" | "classic";
type NameNiche = "tech" | "creative" | "wellness" | "consulting";

interface NicheConfig {
  name: string;
  icon: any;
  tone: string;
  description: string;
}

const NICHES: Record<NameNiche, NicheConfig> = {
  tech: {
    name: "SaaS / Tech",
    icon: Code,
    tone: "Moderno, curto e escalável. Frequentemente usa sufixos como .io ou .ai.",
    description: "Nomes futuristas e tecnológicos para startups de software."
  },
  creative: {
    name: "Artes / Estúdio",
    icon: Palette,
    tone: "Abstrato, visual e memorável. Focado em identidade artística.",
    description: "Expandir os limites com nomes únicos e cheios de personalidade."
  },
  wellness: {
    name: "Saúde / Lifestyle",
    icon: Coffee,
    tone: "Suave, orgânico e acolhedor. Transmite paz e equilíbrio.",
    description: "Nomes que evocam calma e bem-estar para marcas de vida saudável."
  },
  consulting: {
    name: "B2B / Consultoria",
    icon: Briefcase,
    tone: "Sólido, institucional e confiável. Focado em autoridade.",
    description: "Nomes que transmitem segurança e seriedade para prestação de serviços."
  }
};

const themeConfigs: Record<NameTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
  input: string;
}> = {
  minimal: {
    name: "Scandinavo",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm border-slate-100",
    button: "bg-slate-900 text-white",
    text: "text-slate-500",
    input: "border-slate-200 focus:border-slate-900"
  },
  vibrant: {
    name: "Pop Culture",
    bg: "bg-yellow-400",
    border: "border-black/20 shadow-[8px_8px_0_#111]",
    accent: "text-black",
    card: "bg-white border-black/10",
    button: "bg-black text-white",
    text: "text-black/60",
    input: "border-black/10 focus:border-black"
  },
  cyber: {
    name: "Neural-Dark",
    bg: "bg-[#020202]",
    border: "border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.1)]",
    accent: "text-fuchsia-400",
    card: "bg-fuchsia-500/5",
    button: "bg-fuchsia-500 text-black shadow-fuchsia-500/20",
    text: "text-fuchsia-500/40",
    input: "border-fuchsia-500/20 focus:border-fuchsia-500"
  },
  classic: {
    name: "Wall Street",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-indigo-600 text-white",
    text: "text-slate-400",
    input: "border-white/10 focus:border-blue-500"
  }
};

export default function BrandNameGeneratorTool() {
  const [keywords, setKeywords] = useState("");
  const [niche, setNiche] = useState<NameNiche>("tech");
  const [theme, setTheme] = useState<NameTheme>("minimal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ name: string; tagline: string; type: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"names" | "tips">("names");
  const [copied, setCopied] = useState<string | null>(null);

  const currentTheme = themeConfigs[theme];

  const generateNames = async () => {
    if (!keywords.trim()) return;
    setIsGenerating(true);
    setResults([]);
    
    try {
      const response = await fetch("/api/brand-names/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, niche: NICHES[niche].name, tone: NICHES[niche].tone })
      });
      const data = await response.json();
      if (data.names) {
        setResults(data.names);
        setActiveTab("names");
      }
    } catch (error) {
      console.error("Naming error:", error);
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
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className={`inline-block px-2 py-0.5 ${theme === 'vibrant' ? 'bg-black/10 text-black border-black/20' : 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'} text-[10px] font-black tracking-widest rounded border uppercase mb-4`}>
          Nomenclatura Neural & Branding
        </span>
        <h2 className={`text-4xl font-extrabold tracking-tighter uppercase leading-none ${theme === 'minimal' ? 'text-slate-900' : theme === 'cyber' ? 'text-fuchsia-400' : 'text-white'}`}>Gerador de Nomes para Marcas com IA</h2>
        <p className={`mt-4 ${theme === 'minimal' ? 'text-slate-500' : 'text-slate-400'}`}>Use inteligência artificial para brainstorming de nomes criativos, memoráveis e disponíveis. Escolha seu nicho de mercado e gere identidades que ressoam com seu público-alvo.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as NameTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-fuchsia-400"
             }`}
           >
             {themeConfigs[t].name}
           </button>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Interface */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-8`}>
              
              {/* Niche Selector */}
              <div className="grid grid-cols-2 gap-3">
                 {(Object.keys(NICHES) as NameNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => setNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-fuchsia-500/10 border-fuchsia-500/50 text-fuchsia-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Keyword Input */}
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-slate-400'}`}>Palavras-chave ou Conceito</label>
                    <Lightbulb className="h-4 w-4 text-fuchsia-500" />
                 </div>
                 <textarea 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Ex: café orgânico sustentável tecnologia urbana..."
                    className={`w-full bg-white/5 border-2 outline-none p-5 rounded-2xl text-sm transition-all h-32 resize-none ${currentTheme.input} ${theme === 'minimal' || theme === 'vibrant' ? 'text-black placeholder-black/30' : 'text-white'}`}
                 />
              </div>

              {/* Generate Button */}
              <button 
                onClick={generateNames}
                disabled={isGenerating || !keywords.trim()}
                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${
                  currentTheme.button
                } ${isGenerating ? 'opacity-50' : 'hover:scale-[1.02] active:scale-95'}`}
              >
                 {isGenerating ? (
                   <>
                     <CircleDashed className="h-5 w-5 animate-spin" />
                     <span>Arquitetando Nomes...</span>
                   </>
                 ) : (
                   <>
                     <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                     <span>Explodir Brainstorming</span>
                   </>
                 )}
              </button>
           </div>

           {/* Brand Tip Card */}
           <div className={`p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 flex gap-6 items-center`}>
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                 <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Dica de Registro</h4>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                    Um bom nome de marca ({NICHES[niche].name}) deve ser fácil de soletrar, passar no teste do telefone e ser legível em pequenas escalas (como um favicon).
                 </p>
              </div>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-8 md:p-12 rounded-[3.5rem] border shadow-2xl transition-all duration-700 min-h-[600px] flex flex-col ${theme === 'vibrant' ? 'bg-white' : 'bg-[#0A1F35]'} ${currentTheme.border} relative overflow-hidden`}>
              
              <div className="flex items-center justify-between mb-10">
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveTab("names")}
                      className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'names' ? 'border-fuchsia-500 text-fuchsia-500' : 'border-transparent text-slate-500'}`}
                    >Candidatos</button>
                    <button 
                      onClick={() => setActiveTab("tips")}
                      className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'tips' ? 'border-fuchsia-500 text-fuchsia-500' : 'border-transparent text-slate-500'}`}
                    >Estratégia</button>
                 </div>
                 <div className="flex items-center gap-2 text-slate-500">
                    <Globe className="h-3 w-3" />
                    <span className="text-[8px] font-bold uppercase">Cloud Synced Results</span>
                 </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "names" ? (
                  <motion.div 
                    key="names"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {results.length > 0 ? results.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`group p-6 rounded-3xl border transition-all hover:border-fuchsia-500/50 ${theme === 'vibrant' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}
                      >
                         <div className="flex justify-between items-start mb-4">
                            <span className={`text-2xl font-black tracking-tight ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>{item.name}</span>
                            <button 
                              onClick={() => copyToClipboard(item.name)}
                              className="p-2 opacity-0 group-hover:opacity-100 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                            >
                               {copied === item.name ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                         </div>
                         <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">{item.tagline}</p>
                         <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                            <span className="text-[8px] font-black text-fuchsia-500 uppercase px-2 py-0.5 bg-fuchsia-500/10 rounded">{item.type}</span>
                            <div className="ml-auto flex gap-1">
                               <Globe className="h-3 w-3 text-slate-600" />
                               <Share2 className="h-3 w-3 text-slate-600" />
                            </div>
                         </div>
                      </motion.div>
                    )) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center space-y-4">
                         <div className="h-20 w-20 rounded-full border-2 border-white/5 flex items-center justify-center animate-pulse">
                            <Crown className="h-10 w-10 text-slate-700" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Sua Próxima Grande Marca Começa Aqui</h4>
                            <p className="text-xs text-slate-600">Insira palavras-chave e clique em 'Explodir Brainstorming' para ver a mágica.</p>
                         </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="tips"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="space-y-8"
                  >
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-fuchsia-500 uppercase tracking-widest flex items-center gap-2">
                              <Star className="h-4 w-4" /> Checklist de Naming
                           </h4>
                           <ul className="space-y-3">
                              {[
                                "Disponibilidade de domínio (.com / .com.br)",
                                "Ausência de conotações negativas em outros idiomas",
                                "Facilidade de pronúncia para comando de voz (Siri/Alexa)",
                                "Disponibilidade de @ nas redes sociais"
                              ].map((tip, i) => (
                                <li key={i} className="flex gap-3 text-[10px] text-slate-500 font-medium">
                                   <ChevronRight className="h-3 w-3 text-fuchsia-500 shrink-0" />
                                   {tip}
                                </li>
                              ))}
                           </ul>
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-fuchsia-500 uppercase tracking-widest flex items-center gap-2">
                              <Target className="h-4 w-4" /> Psicologia de Marca
                           </h4>
                           <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                              O nicho <strong>{NICHES[niche].name}</strong> pede nomes que passem {NICHES[niche].tone.toLowerCase()}. Evite usar nomes descritivos demais; busque algo que crie uma 'âncora emocional' no usuário.
                           </p>
                        </div>
                     </div>

                     <div className={`p-8 rounded-[2rem] ${theme === 'vibrant' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'} border`}>
                        <h4 className="text-sm font-black text-white italic mb-4">"Um nome não é apenas uma palavra, é a promessa de uma experiência."</h4>
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-indigo-500" />
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">Equipe de Branding</span>
                              <span className="text-[8px] text-slate-500 font-bold uppercase">AI Expert Lab</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
