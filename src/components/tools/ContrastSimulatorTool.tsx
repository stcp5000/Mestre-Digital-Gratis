import React, { useState, useMemo } from "react";
import { 
  Palette, 
  Eye, 
  RefreshCcw, 
  Copy, 
  Check, 
  Info, 
  ShieldCheck, 
  ShieldAlert, 
  Sun, 
  Moon,
  Zap,
  Type,
  Layout,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Logic ---

const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const calculateContrastRatio = (lum1: number, lum2: number) => {
  const bright = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);
  return (bright + 0.05) / (dark + 0.05);
};

// --- Themes ---

type ContrastTheme = "classic" | "light" | "cyber" | "fun" | "minimal";

const themeConfigs: Record<ContrastTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  text: string;
}> = {
  classic: {
    name: "Clássico",
    bg: "bg-[#0A0A0A]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    text: "text-slate-400"
  },
  light: {
    name: "Light",
    bg: "bg-white",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-slate-50",
    text: "text-slate-600"
  },
  cyber: {
    name: "Cyberpunk",
    bg: "bg-[#020202]",
    border: "border-yellow-500/30",
    accent: "text-yellow-500",
    card: "bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.05)]",
    text: "text-yellow-500/60"
  },
  fun: {
    name: "Pop",
    bg: "bg-indigo-600",
    border: "border-black/20",
    accent: "text-black",
    card: "bg-white/90",
    text: "text-black/60"
  },
  minimal: {
    name: "Minimalista",
    bg: "bg-[#05192d]",
    border: "border-white/5",
    accent: "text-emerald-400",
    card: "bg-white/5",
    text: "text-slate-400"
  }
};

const COLOR_PRESETS = [
  { fg: "#FFFFFF", bg: "#000000", name: "Alto Contraste" },
  { fg: "#1E293B", bg: "#F8FAFC", name: "Fio de Seda" },
  { fg: "#0F172A", bg: "#38BDF8", name: "Céu Noturno" },
  { fg: "#FDE047", bg: "#1C1917", name: "Abelha" },
  { fg: "#FFFFFF", bg: "#10B981", name: "Natureza" },
];

export default function ContrastSimulatorTool() {
  const [fg, setFg] = useState("#FFFFFF");
  const [bg, setBg] = useState("#0F172A");
  const [theme, setTheme] = useState<ContrastTheme>("classic");
  const [copied, setCopied] = useState<string | null>(null);

  const contrastRatio = useMemo(() => {
    const rgb1 = hexToRgb(fg);
    const rgb2 = hexToRgb(bg);
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    return calculateContrastRatio(lum1, lum2);
  }, [fg, bg]);

  const scores = {
    normalAA: contrastRatio >= 4.5,
    normalAAA: contrastRatio >= 7,
    largeAA: contrastRatio >= 3,
    largeAAA: contrastRatio >= 4.5,
  };

  const swapColors = () => {
    const temp = fg;
    setFg(bg);
    setBg(temp);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-widest rounded border border-indigo-500/20 uppercase mb-4">
          Design & Acessibilidade
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Simulador de Contraste</h2>
        <p className="mt-4 text-slate-400">Verifique a legibilidade do seu design em tempo real. Garanta que seu conteúdo seja acessível e confortável para todos os usuários.</p>
      </div>

      {/* Theme Bar */}
      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit">
        {(Object.keys(themeConfigs) as ContrastTheme[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
            }`}
          >
            {themeConfigs[t].name}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Color Selection & Stats */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className={`${currentTheme.bg} ${currentTheme.border} border p-8 rounded-[2.5rem] shadow-2xl space-y-8 transition-all duration-700`}>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text} transition-colors`}>Cor do Texto</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={fg} 
                      onChange={(e) => setFg(e.target.value.toUpperCase())}
                      className={`h-12 w-12 rounded-xl bg-transparent border ${theme === 'light' ? 'border-slate-200' : 'border-white/10'} cursor-pointer`}
                    />
                    <div className="relative flex-1 group/input">
                      <input 
                        type="text" 
                        value={fg} 
                        onChange={(e) => setFg(e.target.value.toUpperCase())}
                        className={`w-full ${theme === 'light' ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-white/5 text-white border-white/5'} border rounded-xl py-3 px-4 font-mono text-xs uppercase outline-none focus:border-indigo-500 transition-colors`}
                      />
                      <button 
                        onClick={() => copyToClipboard(fg, 'fg')}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${theme === 'light' ? 'text-slate-400 hover:text-indigo-600' : 'text-slate-600 hover:text-white'} transition-colors`}
                      >
                        {copied === 'fg' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text} transition-colors`}>Cor de Fundo</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={bg} 
                      onChange={(e) => setBg(e.target.value.toUpperCase())}
                      className={`h-12 w-12 rounded-xl bg-transparent border ${theme === 'light' ? 'border-slate-200' : 'border-white/10'} cursor-pointer`}
                    />
                    <div className="relative flex-1 group/input">
                      <input 
                        type="text" 
                        value={bg} 
                        onChange={(e) => setBg(e.target.value.toUpperCase())}
                        className={`w-full ${theme === 'light' ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-white/5 text-white border-white/5'} border rounded-xl py-3 px-4 font-mono text-xs uppercase outline-none focus:border-indigo-500 transition-colors`}
                      />
                      <button 
                        onClick={() => copyToClipboard(bg, 'bg')}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${theme === 'light' ? 'text-slate-400 hover:text-indigo-600' : 'text-slate-600 hover:text-white'} transition-colors`}
                      >
                        {copied === 'bg' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>
             </div>

             <div className="flex gap-4">
                <button 
                    onClick={swapColors}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-white/5 border-white/5 hover:bg-white/10'} border transition-all group`}
                >
                    <RefreshCcw className="h-4 w-4 text-indigo-500 group-hover:rotate-180 transition-transform duration-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>Inverter</span>
                </button>
                <button 
                    onClick={() => {
                        const random = COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)];
                        setFg(random.fg);
                        setBg(random.bg);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl ${theme === 'light' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'} border transition-all group`}
                >
                    <Zap className="h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Aleatório</span>
                </button>
             </div>

             <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text}`}>Taxa de Contraste</span>
                  <div className={`text-6xl font-black tracking-tighter ${currentTheme.accent} transition-colors`}>
                    {contrastRatio.toFixed(2)}:1
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <ScoreCard label="Texto Normal" aa={scores.normalAA} aaa={scores.normalAAA} light={theme === 'light'} />
                   <ScoreCard label="Texto Grande" aa={scores.largeAA} aaa={scores.largeAAA} light={theme === 'light'} />
                </div>
             </div>
          </div>

          <div className={`${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0A0A0A] border-white/5'} p-8 rounded-[2.5rem] border space-y-6 transition-colors`}>
             <div className="flex items-center gap-2 text-indigo-500">
                <Info className="h-4 w-4" />
                <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Sugestões de Uso</span>
             </div>
             <div className="grid grid-cols-2 gap-2">
                {COLOR_PRESETS.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => { setFg(p.fg); setBg(p.bg); }}
                    className={`p-2 rounded-xl border ${theme === 'light' ? 'bg-white border-slate-200 hover:border-indigo-500' : 'bg-white/5 border-white/5 hover:border-white/20'} transition-all text-left flex items-center gap-2 group`}
                  >
                    <div className="flex shrink-0">
                       <div className="h-4 w-4 rounded-l-md" style={{ backgroundColor: p.bg }} />
                       <div className="h-4 w-4 rounded-r-md" style={{ backgroundColor: p.fg }} />
                    </div>
                    <span className={`text-[9px] font-bold uppercase truncate ${theme === 'light' ? 'text-slate-600' : 'text-slate-500'}`}>{p.name}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div 
             className={`h-full min-h-[600px] rounded-[3rem] p-12 transition-all duration-700 shadow-inner relative flex flex-col gap-12 overflow-hidden border w-full`}
             style={{ backgroundColor: bg, color: fg, borderColor: `${fg}20` }}
           >
              {/* Fun/Cyber elements */}
              {theme === 'fun' && (
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="absolute -top-10 -right-10 w-40 h-40 border-[20px] border-current rounded-full" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-current rounded-3xl rotate-12" />
                </div>
              )}

              <div className="space-y-4 relative z-10">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pré-visualização</span>
                 <h3 className="text-4xl sm:text-6xl font-black tracking-tighter leading-tight">
                   O design acessível é um bom design.
                 </h3>
                 <p className="text-lg font-medium max-w-lg leading-relaxed opacity-80">
                   Este é um exemplo de como o texto flui no seu esquema de cores selecionado. O contraste adequado não ajuda apenas pessoas com deficiência visual, mas torna a leitura mais confortável para todos, especialmente em telas móveis ou sob luz solar intensa.
                 </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Elementos de UI</span>
                    <div className="flex flex-wrap gap-4">
                       <button className="px-6 py-3 rounded-full border border-current font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                         Botão Outlined
                       </button>
                       <button 
                         className="px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                         style={{ backgroundColor: fg, color: bg }}
                       >
                         Botão Solid
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Componentes</span>
                    <div className="p-6 rounded-3xl border border-current bg-current bg-opacity-5 space-y-3">
                       <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">Alerta Importante</span>
                       </div>
                       <p className="text-xs opacity-70">Verifique sempre as cores em diferentes monitores.</p>
                    </div>
                 </div>
              </div>

              {/* Bottom Decoration */}
              <div className="mt-auto flex justify-between items-end opacity-20 relative z-10">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-1 bg-current" />)}
                  </div>
                  <Type className="h-12 w-12" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, aa, aaa, light }: { label: string; aa: boolean; aaa: boolean; light?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border ${light ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'} space-y-3 transition-colors`}>
      <span className={`text-[9px] font-black uppercase tracking-widest ${light ? 'text-slate-400' : 'text-slate-500'} block`}>{label}</span>
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold ${light ? 'text-slate-700' : 'text-white'} uppercase`}>Passa em AA</span>
            {aa ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : <ShieldAlert className="h-4 w-4 text-rose-500" />}
         </div>
         <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold ${light ? 'text-slate-700' : 'text-white'} uppercase`}>Passa em AAA</span>
            {aaa ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : <ShieldAlert className="h-4 w-4 text-rose-500" />}
         </div>
      </div>
    </div>
  );
}
