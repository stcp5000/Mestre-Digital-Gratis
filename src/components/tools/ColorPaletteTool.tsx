import React, { useState, useMemo, useCallback } from "react";
import { 
  Palette, 
  Eye, 
  RotateCcw, 
  Copy, 
  Check, 
  Info, 
  Lock, 
  Unlock, 
  Zap,
  Download,
  Share2,
  Brush,
  Grid,
  Moon,
  Sun
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Logic & Types ---

type ColorBlindType = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";
type PaletteTheme = "classic" | "cyber" | "fun" | "minimal";

interface Color {
  hex: string;
  locked: boolean;
}

const themeConfigs: Record<PaletteTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
}> = {
  classic: {
    name: "Clássico",
    bg: "bg-[#0A0A0A]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5"
  },
  cyber: {
    name: "Night City",
    bg: "bg-[#020202]",
    border: "border-pink-500/30",
    accent: "text-pink-500",
    card: "bg-pink-500/5"
  },
  fun: {
    name: "Pop Art",
    bg: "bg-yellow-400",
    border: "border-black/20",
    accent: "text-black",
    card: "bg-white"
  },
  minimal: {
    name: "Zen",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-indigo-600",
    card: "bg-white"
  }
};

const generateRandomHex = () => {
  const chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Simulation matrix logic (simplified)
const simulateColor = (hex: string, type: ColorBlindType): string => {
  if (type === "none") return hex;
  
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  let nr, ng, nb;

  switch (type) {
    case "protanopia":
      nr = 0.567 * r + 0.433 * g + 0.0 * b;
      ng = 0.558 * r + 0.442 * g + 0.0 * b;
      nb = 0.0 * r + 0.242 * g + 0.758 * b;
      break;
    case "deuteranopia":
      nr = 0.625 * r + 0.375 * g + 0.0 * b;
      ng = 0.7 * r + 0.3 * g + 0.0 * b;
      nb = 0.0 * r + 0.3 * g + 0.7 * b;
      break;
    case "tritanopia":
      nr = 0.95 * r + 0.05 * g + 0.0 * b;
      ng = 0.0 * r + 0.433 * g + 0.567 * b;
      nb = 0.0 * r + 0.475 * g + 0.525 * b;
      break;
    case "achromatopsia":
      const v = 0.299 * r + 0.587 * g + 0.114 * b;
      nr = ng = nb = v;
      break;
    default:
      return hex;
  }

  const toHex = (c: number) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, "0");
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`.toUpperCase();
};

export default function ColorPaletteTool() {
  const [colors, setColors] = useState<Color[]>([
    { hex: "#FF6B6B", locked: false },
    { hex: "#4ECDC4", locked: false },
    { hex: "#FFE66D", locked: false },
    { hex: "#1A535C", locked: false },
    { hex: "#F7FFF7", locked: false },
  ]);
  const [visionType, setVisionType] = useState<ColorBlindType>("none");
  const [theme, setTheme] = useState<PaletteTheme>("classic");
  const [copied, setCopied] = useState<string | null>(null);

  const generateNewPalette = useCallback(() => {
    setColors(prev => prev.map(c => c.locked ? c : { ...c, hex: generateRandomHex() }));
  }, []);

  const toggleLock = (index: number) => {
    setColors(prev => prev.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
  };

  const updateColor = (index: number, hex: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return;
    setColors(prev => prev.map((c, i) => i === index ? { ...c, hex: hex.toUpperCase() } : c));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-2xl">
        <span className="inline-block px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] font-black tracking-widest rounded border border-violet-500/20 uppercase mb-4">
          Criação & Acessibilidade
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Paletas Inteligentes</h2>
        <p className="mt-4 text-slate-400">Gere esquemas de cores harmônicos e teste instantaneamente como pessoas com diferentes tipos de daltonismo enxergam seu design.</p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
           {(Object.keys(themeConfigs) as PaletteTheme[]).map((t) => (
             <button
               key={t}
               onClick={() => setTheme(t)}
               className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
               }`}
             >
               {themeConfigs[t].name}
             </button>
           ))}
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={generateNewPalette}
             className="flex items-center gap-2 px-6 py-3 bg-violet-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-500/20"
           >
             <Zap className="h-4 w-4" />
             Gerar Nova
           </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Palette View */}
        <div className="lg:col-span-12 xl:col-span-9 space-y-8">
           <div className={`grid grid-cols-1 sm:grid-cols-5 gap-2 h-[400px] sm:h-[500px] rounded-[3rem] overflow-hidden border ${currentTheme.border} p-2 transition-all duration-700 ${currentTheme.bg}`}>
              {colors.map((color, idx) => (
                <ColorSlot 
                  key={idx} 
                  color={color} 
                  visionType={visionType}
                  onToggleLock={() => toggleLock(idx)}
                  onUpdate={(hex) => updateColor(idx, hex)}
                  onCopy={() => copyToClipboard(color.hex)}
                  isCopied={copied === color.hex}
                  theme={theme}
                />
              ))}
           </div>

           {/* Vision Simulator Selection */}
           <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-violet-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Simulador de Daltonismo</span>
                 </div>
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Selecione o filtro de visualização</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                 {[
                   { id: "none", label: "Normal", desc: "Visão Padrão" },
                   { id: "protanopia", label: "Protanopia", desc: "Sem Vermelho" },
                   { id: "deuteranopia", label: "Deuteranopia", desc: "Sem Verde" },
                   { id: "tritanopia", label: "Tritanopia", desc: "Sem Azul" },
                   { id: "achromatopsia", label: "Acromático", desc: "Tons de Cinza" },
                 ].map((v) => (
                   <button
                     key={v.id}
                     onClick={() => setVisionType(v.id as ColorBlindType)}
                     className={`p-4 rounded-2xl border transition-all text-left group ${
                       visionType === v.id 
                       ? "bg-violet-500/10 border-violet-500 text-violet-400" 
                       : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20"
                     }`}
                   >
                     <p className="text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-white transition-colors">{v.label}</p>
                     <p className="text-[9px] font-bold opacity-60 truncate">{v.desc}</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Info & Tools Sidebar */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-6">
           <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Palette className="h-48 w-48" />
              </div>
              
              <div className="relative z-10 space-y-6">
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Dicas Rápidas</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Como tirar proveito</p>
                 </div>

                 <ul className="space-y-4">
                    {[
                      { icon: Lock, text: "Trave cores que você gostou antes de gerar novas." },
                      { icon: Grid, text: "Clique no código HEX para editar manualmente." },
                      { icon: Eye, text: "Use o simulador para garantir inclusão digital." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                         <item.icon className="h-3 w-3 text-violet-500 shrink-0 mt-1" />
                         <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.text}</p>
                      </li>
                    ))}
                 </ul>

                 <div className="pt-6 border-t border-white/5">
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[9.5px] font-black uppercase tracking-widest text-slate-400 hover:text-white">
                       <Download className="h-4 w-4" /> Exportar Paleta
                    </button>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-violet-500/5 border border-violet-500/10 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-violet-400">
                 <Info className="h-4 w-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Importância</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Aproximadamente 8% dos homens e 0,5% das mulheres possuem algum tipo de deficiência na percepção de cores. Projetar com acessibilidade em mente não é apenas ético, é estratégico.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function ColorSlot({ color, visionType, onToggleLock, onUpdate, onCopy, isCopied, theme }: any) {
  const simulatedHex = simulateColor(color.hex, visionType);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div 
      layout
      className="relative flex flex-col items-center justify-end h-full w-full p-6 group transition-all duration-700"
      style={{ backgroundColor: simulatedHex }}
    >
       {/* Background for Fun Theme Text Legibility */}
       {theme === 'fun' && (
         <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
       )}

       <div className="relative z-10 flex flex-col items-center gap-4 w-full">
          <button 
            onClick={onToggleLock}
            className={`p-3 rounded-full backdrop-blur-md border transition-all duration-500 ${
              color.locked 
              ? 'bg-white text-black border-white' 
              : 'bg-black/10 text-white border-white/20 opacity-0 group-hover:opacity-100'
            }`}
          >
            {color.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>

          <div className="w-full text-center space-y-1">
             {isEditing ? (
               <input 
                 autoFocus
                 defaultValue={color.hex}
                 onBlur={(e) => {
                   onUpdate(e.target.value);
                   setIsEditing(false);
                 }}
                 onKeyDown={(e: any) => e.key === 'Enter' && e.currentTarget.blur()}
                 className="w-full bg-white/20 backdrop-blur-lg border border-white/40 rounded-lg py-1 px-2 text-sm font-black text-white text-center outline-none uppercase"
               />
             ) : (
               <button 
                 onClick={() => setIsEditing(true)}
                 className="text-lg font-black text-white tracking-tighter uppercase drop-shadow-lg"
               >
                 {color.hex}
               </button>
             )}
             {visionType !== 'none' && (
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{simulatedHex}</p>
             )}
          </div>

          <button 
            onClick={onCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
          >
            {isCopied ? <><Check className="h-3 w-3" /> Copiado</> : <><Copy className="h-3 w-3" /> Copiar</>}
          </button>
       </div>
       
       <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
