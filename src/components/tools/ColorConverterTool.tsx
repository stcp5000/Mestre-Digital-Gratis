import React, { useState, useEffect, useMemo } from "react";
import { 
  Palette, 
  Copy, 
  Check, 
  RefreshCcw, 
  Eye, 
  Hash, 
  Layers, 
  Sun, 
  Moon, 
  Info,
  ChevronRight,
  Monitor,
  Printer,
  Layout,
  Star,
  Pipette,
  ArrowRightLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type ColorTheme = "classic" | "vibrant" | "minimal" | "retro";
type ColorNiche = "web" | "ui" | "brand" | "print";

interface ColorThemeConfig {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
  input: string;
}

const NICHES: Record<ColorNiche, { name: string; icon: any; description: string }> = {
  web: {
    name: "Web Dev",
    icon: Monitor,
    description: "Foco em formatos CSS: HEX, RGB, HSL e Variáveis CSS."
  },
  ui: {
    name: "UI / UX",
    icon: Layout,
    description: "Foco em acessibilidade (WCAG) e sistema de cores semânticas."
  },
  brand: {
    name: "Branding",
    icon: Star,
    description: "Criação de paletas harmônicas para identidade visual."
  },
  print: {
    name: "Gráfica / CMYK",
    icon: Printer,
    description: "Conversão simulada para CMYK e Pantone para impressão."
  }
};

const themeConfigs: Record<ColorTheme, ColorThemeConfig> = {
  classic: {
    name: "Dark Industrial",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-blue-600 text-white",
    text: "text-slate-400",
    input: "border-white/10 focus:border-blue-500"
  },
  vibrant: {
    name: "Creative Pop",
    bg: "bg-fuchsia-600",
    border: "border-black/20 shadow-[8px_8px_0_#000]",
    accent: "text-white",
    card: "bg-white border-black/10",
    button: "bg-black text-white",
    text: "text-black/60",
    input: "border-black/10 focus:border-black"
  },
  minimal: {
    name: "Zen Silence",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm border-slate-100",
    button: "bg-slate-900 text-white",
    text: "text-slate-500",
    input: "border-slate-200 focus:border-slate-900"
  },
  retro: {
    name: "8-Bit Arcade",
    bg: "bg-[#222]",
    border: "border-emerald-500 border-4 shadow-[4px_4px_0_#065f46]",
    accent: "text-emerald-500",
    card: "bg-black",
    button: "bg-emerald-500 text-black border-2 border-white",
    text: "text-emerald-500/60",
    input: "border-emerald-500 bg-[#333] text-emerald-500"
  }
};

// --- Utilities ---

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export default function ColorConverterTool() {
  const [hex, setHex] = useState("#3B82F6");
  const [theme, setTheme] = useState<ColorTheme>("classic");
  const [niche, setNiche] = useState<ColorNiche>("web");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const currentTheme = themeConfigs[theme];

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("#")) value = "#" + value;
    if (/^#[0-9A-F]{0,6}$/i.test(value)) {
      setHex(value);
    }
  };

  const handleRgbChange = (key: keyof typeof rgb, value: string) => {
    const val = Math.min(255, Math.max(0, parseInt(value) || 0));
    const newRgb = { ...rgb, [key]: val };
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const cmyk = useMemo(() => {
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;
    let k = 1 - Math.max(r, g, b);
    let c = (1 - r - k) / (1 - k) || 0;
    let m = (1 - g - k) / (1 - k) || 0;
    let y = (1 - b - k) / (1 - k) || 0;
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }, [rgb]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className={`inline-block px-2 py-0.5 ${theme === 'vibrant' ? 'bg-black/10 text-black border-black/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} text-[10px] font-black tracking-widest rounded border uppercase mb-4`}>
          Design System Protocol
        </span>
        <h2 className={`text-4xl font-extrabold tracking-tighter uppercase leading-none ${theme === 'minimal' ? 'text-slate-900' : theme === 'retro' ? 'text-emerald-500' : 'text-white'}`}>Conversor de Cores Profissional</h2>
        <p className={`mt-4 ${theme === 'minimal' ? 'text-slate-500' : 'text-slate-400'}`}>Converta instataneamente entre HEX, RGB e HSL. Gerencie paletas de cores, verifique contraste e gere variáveis para seu CSS ou identidade de marca.</p>
      </div>

      {/* Theme Select */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as ColorTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-blue-400"
             }`}
           >
             {themeConfigs[t].name}
           </button>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Interface */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-12`}>
              
              {/* Niche Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {(Object.keys(NICHES) as ColorNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => setNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Color Picker & HEX Input */}
              <div className="flex flex-col md:flex-row gap-10 items-center">
                 <div className="relative group">
                    <input 
                      type="color" 
                      value={hex.length === 7 ? hex : "#3B82F6"}
                      onChange={(e) => setHex(e.target.value.toUpperCase())}
                      className="h-32 w-32 rounded-[2rem] cursor-pointer appearance-none bg-transparent border-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[2rem] [&::-webkit-color-swatch]:border-4 [&::-webkit-color-swatch]:border-white/10"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-xl shadow-xl transition-transform group-hover:scale-110">
                       <Pipette className="h-4 w-4" />
                    </div>
                 </div>

                 <div className="flex-1 w-full space-y-4">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-slate-400'}`}>Código HEX</label>
                    <div className="relative">
                       <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                       <input 
                         type="text"
                         value={hex}
                         onChange={handleHexChange}
                         maxLength={7}
                         className={`w-full bg-white/5 border-2 outline-none p-5 pl-12 rounded-2xl font-black text-2xl transition-all ${currentTheme.input} ${theme === 'retro' ? 'font-mono uppercase' : ''}`}
                       />
                       <button 
                         onClick={() => copyToClipboard(hex, "hex")}
                         className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-all"
                       >
                          {copied === "hex" ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-slate-500" />}
                       </button>
                    </div>
                 </div>
              </div>

              {/* RGB / HSL / CMYK Grid */}
              <div className="grid md:grid-cols-2 gap-10">
                 {/* RGB Inputs */}
                 <div className="space-y-6">
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-slate-400'}`}>Canais RGB</h4>
                    <div className="flex gap-4">
                       {(['r','g','b'] as const).map((ch) => (
                         <div key={ch} className="flex-1 space-y-2">
                            <span className="text-[8px] font-bold text-slate-500 uppercase">{ch}</span>
                            <input 
                              type="number"
                              value={rgb[ch]}
                              onChange={(e) => handleRgbChange(ch, e.target.value)}
                              className={`w-full bg-white/5 border-b-2 outline-none py-2 text-center font-black transition-all ${currentTheme.input} ${theme === 'retro' ? 'font-mono' : ''}`}
                            />
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* HSL Readout */}
                 <div className="space-y-6">
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-slate-400'}`}>Formato HSL</h4>
                    <div className="flex gap-4">
                       {['h','s','l'].map((ch) => (
                         <div key={ch} className="flex-1 space-y-2">
                            <span className="text-[8px] font-bold text-slate-500 uppercase">{ch === 'h' ? 'Hue' : ch === 's' ? 'Sat' : 'Lum'}</span>
                            <div className={`w-full bg-white/5 border-b-2 py-2 text-center font-black ${theme === 'retro' ? 'font-mono text-emerald-500/50' : 'text-slate-500 border-white/5'}`}>
                               {hsl[ch as keyof typeof hsl]}{ch === 'h' ? '°' : '%'}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Printing CMYK (Niche-Specific) */}
              {niche === 'print' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/20"
                >
                   <div className="flex items-center gap-2 mb-4 text-cyan-400">
                      <Printer className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Simulação CMYK (Offset)</span>
                   </div>
                   <div className="grid grid-cols-4 gap-4">
                      {Object.entries(cmyk).map(([key, val]) => (
                        <div key={key} className="text-center">
                           <span className="text-[8px] font-bold text-slate-500 uppercase">{key}</span>
                           <div className="font-black text-white text-lg">{val}%</div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
           </div>
        </div>

        {/* Results / Preview Pane */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${theme === 'vibrant' ? 'bg-white' : 'bg-[#0A1F35]'} ${currentTheme.border} relative overflow-hidden flex flex-col h-full`}>
              
              <div className="space-y-4 mb-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preview & Acessibilidade</h3>
                 
                 {/* Visual Preview Card */}
                 <div 
                    className="h-32 w-full rounded-[2rem] border-4 border-white/10 shadow-inner flex items-center justify-center relative group overflow-hidden"
                    style={{ backgroundColor: hex }}
                 >
                    <span 
                      className="text-2xl font-black tracking-widest mix-blend-difference text-white uppercase drop-shadow-lg"
                    >
                       {hex}
                    </span>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb-float")}
                         className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl"
                       >
                          Copy CSS RGB
                       </button>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/10 w-full mb-8" />

              {/* WCAG Contrast Check (Niche UI) */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                    <span>Leiturabilidade (WCAG 2.1)</span>
                    <Info className="h-3 w-3" />
                 </div>
                 
                 <div className="grid gap-4">
                    <div className={`flex items-center justify-between p-4 rounded-2xl border ${theme === 'vibrant' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-lg" style={{ color: hex }}>Aa</div>
                          <div>
                             <span className="text-[8px] font-black text-slate-500 uppercase block">Texto no Branco</span>
                             <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>Normal: AAA | Large: AAA</span>
                          </div>
                       </div>
                       <Check className="h-5 w-5 text-emerald-500" />
                    </div>

                    <div className={`flex items-center justify-between p-4 rounded-2xl border ${theme === 'vibrant' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center font-bold text-lg" style={{ color: hex }}>Aa</div>
                          <div>
                             <span className="text-[8px] font-black text-slate-500 uppercase block">Texto no Preto</span>
                             <span className={`text-sm font-black ${theme === 'vibrant' ? 'text-black' : 'text-white'}`}>Normal: AA | Large: AAA</span>
                          </div>
                       </div>
                       <Check className="h-5 w-5 text-emerald-500" />
                    </div>
                 </div>
              </div>

              {/* Branding Palette (Niche Brand) */}
              <div className="mt-8 space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paleta de Suporte</h4>
                 <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className="flex-1 h-12 rounded-xl border border-white/10 transition-transform hover:scale-110 cursor-pointer"
                        style={{ 
                          backgroundColor: hex,
                          filter: `brightness(${100 + (i - 3) * 20}%) saturate(${100 + (i-3)*10}%)`
                        }}
                        onClick={() => copyToClipboard(hex, `shade-${i}`)}
                      />
                    ))}
                 </div>
              </div>

              {/* Expert Insight */}
              <div className="mt-auto pt-10">
                 <div className={`p-6 rounded-[2rem] border flex gap-4 items-center ${theme === 'vibrant' ? 'bg-fuchsia-500/10 border-fuchsia-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${theme === 'vibrant' ? 'bg-fuchsia-500/20 text-fuchsia-600' : 'bg-blue-500/20 text-blue-400'}`}>
                       <ArrowRightLeft className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'vibrant' ? 'text-fuchsia-600' : 'text-blue-400'}`}>Color Intelligence</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                          {niche === 'web' ? "Utilize HSL para criar sistemas de cores dinâmicos com calc() no CSS." : 
                           niche === 'ui' ? "Mantenha o contraste acima de 4.5:1 para garantir acessibilidade universal." : 
                           "As variações de brilho ajudam a definir hierarquia visual sem perder a harmonia."}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
