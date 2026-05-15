import { useState } from "react";
import { 
  BarChart3, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  CircleDashed,
  Brain,
  Eye,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  FileText,
  MousePointer2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type HeadlineTheme = "divertido" | "classico" | "viral" | "profissional";

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

const THEMES: Record<HeadlineTheme, ThemeConfig> = {
  divertido: {
    name: "Divertido / Criativo",
    bg: "bg-pink-50",
    card: "bg-white border-pink-200 shadow-xl",
    accent: "text-pink-600",
    button: "bg-pink-500 text-white hover:bg-pink-600 shadow-[0_4px_0_#be185d]",
    text: "text-slate-600",
    border: "border-pink-100",
    input: "bg-pink-50/50 border-pink-200 text-slate-800 focus:border-pink-400",
    label: "text-pink-600 font-black uppercase italic"
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
    bg: "bg-[#0c0a09]",
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
    bg: "bg-indigo-50",
    card: "bg-white border-indigo-200 shadow-md",
    accent: "text-indigo-700",
    button: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20",
    text: "text-slate-600",
    border: "border-indigo-100",
    input: "bg-white border-indigo-200 text-slate-900 focus:border-indigo-600",
    label: "text-indigo-600 font-bold uppercase tracking-tight"
  }
};

interface AnalysisResult {
  score: number;
  readability: string;
  emotionalPower: number;
  strengths: string[];
  weaknesses: string[];
  powerWords: string[];
  suggestions: string[];
  seoAnalysis: string;
}

export default function HeadlineAnalyzerTool() {
  const [headline, setHeadline] = useState("");
  const [goal, setGoal] = useState("Engajamento Geral");
  const [theme, setTheme] = useState<HeadlineTheme>("profissional");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const currentTheme = THEMES[theme];

  const handleAnalyze = async () => {
    if (!headline.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/headline/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, goal, tone: currentTheme.name })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing headline:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `ANÁLISE DE HEADLINE - MESTRE DIGITAL\n
Headline: ${headline}
Score: ${result.score}/100
Legibilidade: ${result.readability}
Poder Emocional: ${result.emotionalPower}%

PONTOS FORTES:
${result.strengths.map(s => `- ${s}`).join("\n")}

PONTOS DE MELHORIA:
${result.weaknesses.map(w => `- ${w}`).join("\n")}

PALAVRAS PODEROSAS:
${result.powerWords.join(", ")}

SUGESTÕES ALTERNATIVAS:
${result.suggestions.map(s => `- ${s}`).join("\n")}

ANÁLISE SEO:
${result.seoAnalysis}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analise-headline-${Date.now()}.txt`;
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
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'viral' ? 'bg-orange-500/20 text-orange-400' : 'bg-indigo-100 text-indigo-600'}`}>
              <BarChart3 className="h-6 w-6" />
           </div>
           <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'viral' ? 'text-orange-500' : 'text-indigo-600'}`}>
              Headline Authority
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>
           Analisador de Headline e Copywriting com IA
        </h2>
        <p className={`text-lg font-medium ${theme === 'viral' ? 'text-orange-200/40' : 'text-slate-500'}`}>
           Descubra se o seu título tem o que é preciso para converter. Analise o poder emocional, a legibilidade e receba sugestões automáticas de SEO.
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
                   {(Object.keys(THEMES) as HeadlineTheme[]).map((t) => (
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

              {/* Goal Selector */}
              <div className="mb-8">
                 <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Objetivo da Headline</label>
                 <select 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className={`w-full h-14 px-6 rounded-2xl border-2 outline-none transition-all font-bold appearance-none ${currentTheme.input}`}
                 >
                    <option>Venda Direta / Landing Page</option>
                    <option>Artigo de Blog / SEO</option>
                    <option>Vídeo no YouTube / Viral</option>
                    <option>Redes Sociais / Engajamento</option>
                    <option>Assunto de E-mail / Taxa de Abertura</option>
                 </select>
              </div>

              {/* Headline Input */}
              <div className="mb-8">
                 <label className={`block text-[10px] mb-4 ${currentTheme.label}`}>Sua Headline</label>
                 <textarea 
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Escreva seu título aqui..."
                    className={`w-full min-h-[120px] p-6 rounded-2xl border-2 outline-none transition-all font-bold resize-none ${currentTheme.input}`}
                 />
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !headline.trim()}
                className={`w-full h-18 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale ${currentTheme.button}`}
              >
                 {isAnalyzing ? (
                   <>
                     <CircleDashed className="h-5 w-5 animate-spin" />
                     <span>Processando Mente...</span>
                   </>
                 ) : (
                   <>
                     <Brain className="h-5 w-5" />
                     <span>Analisar Headline</span>
                   </>
                 )}
              </button>
           </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-7 space-y-6">
           <div className={`p-8 md:p-12 rounded-[3.5rem] border shadow-2xl transition-all duration-700 min-h-[600px] flex flex-col relative overflow-hidden ${
             theme === 'viral' ? 'bg-[#0c0a09]' : 'bg-white'
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
                          <h3 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>Score de Performance</h3>
                          <p className="text-xs text-zinc-500 font-bold uppercase">Baseado em Psicologia de Copy</p>
                       </div>
                       <div className="text-right">
                          <span className={`text-6xl font-black ${result.score > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>{result.score}</span>
                          <span className="text-zinc-500 font-bold text-xl ml-1">/100</span>
                       </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className={`p-6 rounded-3xl border ${theme === 'viral' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center gap-3 mb-2">
                             <Eye className="h-4 w-4 text-blue-500" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Legibilidade</span>
                          </div>
                          <p className={`text-xl font-black ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>{result.readability}</p>
                       </div>
                       <div className={`p-6 rounded-3xl border ${theme === 'viral' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center gap-3 mb-2">
                             <Zap className="h-4 w-4 text-amber-500" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Poder Emocional</span>
                          </div>
                          <p className={`text-xl font-black ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>{result.emotionalPower}%</p>
                       </div>
                    </div>

                    {/* Strengths / Weaknesses */}
                    <div className="grid gap-6 md:grid-cols-2">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                             <CheckCircle2 className="h-3 w-3" /> Pontos Fortes
                          </h4>
                          <ul className="space-y-3">
                             {result.strengths.map((s, i) => (
                               <li key={i} className="text-xs text-zinc-500 font-medium leading-relaxed bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                                  {s}
                               </li>
                             ))}
                          </ul>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                             <AlertCircle className="h-3 w-3" /> A Melhorar
                          </h4>
                          <ul className="space-y-3">
                             {result.weaknesses.map((w, i) => (
                               <li key={i} className="text-xs text-zinc-500 font-medium leading-relaxed bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                                  {w}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    {/* Suggestions */}
                    <div className={`p-8 rounded-[2.5rem] border ${theme === 'viral' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                       <h4 className={`text-xs font-black uppercase tracking-widest mb-6 ${currentTheme.accent} flex items-center gap-2`}>
                          <Lightbulb className="h-4 w-4" /> Sugestões de SEO e Melhoria
                       </h4>
                       <div className="space-y-4">
                          {result.suggestions.map((s, i) => (
                            <div key={i} className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] flex items-center justify-between gap-4 ${
                              theme === 'viral' ? 'bg-black/40 border-white/10' : 'bg-white border-indigo-100'
                            }`}>
                               <p className={`text-sm font-bold leading-tight ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>{s}</p>
                               <button 
                                  onClick={() => navigator.clipboard.writeText(s)}
                                  className="p-2 mr-2 rounded-lg hover:bg-slate-100 hidden sm:block"
                               >
                                  <Copy className="h-4 w-4 text-zinc-400" />
                               </button>
                            </div>
                          ))}
                       </div>
                       <div className="mt-8 pt-6 border-t border-indigo-500/10">
                          <p className="text-[11px] text-zinc-500 font-bold leading-relaxed flex items-center gap-2 italic">
                             <Zap className="h-3 w-3 text-amber-500" />
                             SEO Analysis: {result.seoAnalysis}
                          </p>
                       </div>
                    </div>

                    <button 
                      onClick={handleDownload}
                      className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
                    >
                       <Download className="h-5 w-5" />
                       Baixar Análise em TXT
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                     <div className={`h-32 w-32 rounded-full border-2 border-dashed flex items-center justify-center animate-pulse ${
                       theme === 'viral' ? 'border-white/10 text-white/10' : 'border-slate-100 text-slate-200'
                     }`}>
                        <MousePointer2 className="h-12 w-12" />
                     </div>
                     <div className="space-y-3 max-w-sm">
                        <h4 className={`text-xl font-black uppercase tracking-widest ${theme === 'viral' ? 'text-white' : 'text-slate-900'}`}>A Ciência por trás dos Cliques</h4>
                        <p className="text-sm text-zinc-500 font-bold leading-relaxed px-4">
                           Cole seu título à esquerda e nossa IA analisará centenas de variáveis psicológicas para garantir que sua audiência não consiga ignorar seu conteúdo.
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
