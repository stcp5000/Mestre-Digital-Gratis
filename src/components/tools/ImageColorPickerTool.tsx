import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  Plus, 
  Upload, 
  Copy, 
  Check, 
  Info, 
  Image as ImageIcon,
  Palette,
  Pipette,
  Zap,
  Trash2,
  RefreshCcw,
  Layout,
  MousePointer2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type PickerTheme = "classic" | "fun" | "cyber" | "minimal";

const themeConfigs: Record<PickerTheme, {
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
    name: "Cyber",
    bg: "bg-[#020202]",
    border: "border-cyan-500/30",
    accent: "text-cyan-400",
    card: "bg-cyan-500/5"
  },
  fun: {
    name: "Criativo",
    bg: "bg-rose-500",
    border: "border-black/20",
    accent: "text-black",
    card: "bg-white"
  },
  minimal: {
    name: "Minimal",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white"
  }
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export default function ImageColorPickerTool() {
  const [image, setImage] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<string>("#FFFFFF");
  const [palette, setPalette] = useState<string[]>([]);
  const [theme, setTheme] = useState<PickerTheme>("classic");
  const [copied, setCopied] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const extractPalette = useCallback(() => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sample points for palette (denser 10x10 grid)
    const extracted: string[] = [];
    const samplesX = 10;
    const samplesY = 10;
    const stepX = Math.floor(canvas.width / (samplesX + 1));
    const stepY = Math.floor(canvas.height / (samplesY + 1));

    for (let i = 1; i <= samplesX; i++) {
      for (let j = 1; j <= samplesY; j++) {
        if (extracted.length >= 8) break;
        const x = i * stepX;
        const y = j * stepY;
        const data = ctx.getImageData(x, y, 1, 1).data;
        // Ignore very transparent or almost purely white/black if we have other options
        const hex = rgbToHex(data[0], data[1], data[2]);
        if (!extracted.includes(hex)) {
          extracted.push(hex);
        }
      }
    }
    setPalette(extracted);
  }, []);

  useEffect(() => {
    if (image && imgRef.current) {
      const img = imgRef.current;
      
      const processImage = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          // Ensure we have natural dimensions
          if (img.naturalWidth === 0) return;
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx?.drawImage(img, 0, 0);
          extractPalette();
        }
      };

      if (img.complete) {
        processImage();
      } else {
        img.onload = processImage;
      }
    }
  }, [image, extractPalette]);

  const pickColor = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const data = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(data[0], data[1], data[2]);
    setPickedColor(hex);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentTheme = themeConfigs[theme];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black tracking-widest rounded border border-rose-500/20 uppercase mb-4">
          Design & Criatividade
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Extrator de Cores de Imagem</h2>
        <p className="mt-4 text-slate-400">Capture a alma de suas fotos e artes. Crie paletas profissionais e extraia códigos HEX/RGB instantaneamente para seus projetos.</p>
      </div>

      {/* Theme Bar */}
      <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as PickerTheme[]).map((t) => (
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

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Workspace */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
           <div className={`relative p-8 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} min-h-[500px] flex flex-col items-center justify-center group overflow-hidden`}>
              
              {/* Theme Decorative Elements */}
              {theme === 'fun' && (
                <div className="absolute inset-0 pointer-events-none opacity-20">
                   <div className="absolute -top-10 -left-10 w-40 h-40 border-[20px] border-black rounded-full" />
                   <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-black rounded-sm rotate-45" />
                </div>
              )}

              <AnimatePresence mode="wait">
                 {!image ? (
                   <motion.div 
                     key="upload"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="text-center space-y-6"
                   >
                      <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500 group-hover:scale-110 group-hover:bg-rose-500/10 group-hover:text-rose-500 transition-all duration-500">
                         <Upload className="h-10 w-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Arraste uma Imagem</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ou clique para selecionar um arquivo</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="canvas"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="relative w-full h-full flex flex-col items-center gap-8"
                   >
                      <div className="relative group/canvas max-w-full">
                         <img 
                           ref={imgRef}
                           src={image} 
                           alt="Upload preview" 
                           onClick={pickColor}
                           className="max-h-[500px] rounded-2xl cursor-crosshair border border-white/10 shadow-2xl"
                         />
                         <canvas ref={canvasRef} className="hidden" />
                      </div>

                      <div className="flex gap-4">
                         <button 
                           onClick={() => setImage(null)}
                           className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                         >
                            <Trash2 className="h-4 w-4" />
                            Trocar Imagem
                         </button>
                         <button 
                           onClick={extractPalette}
                           className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all"
                         >
                            <RefreshCcw className="h-4 w-4" />
                            Refazer Paleta
                         </button>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* Tools Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           {/* Picked Color Card */}
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} space-y-8`}>
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
                    <MousePointer2 className="h-5 w-5" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Cor Selecionada</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Clique na imagem para extrair</p>
                 </div>
              </div>

              <div 
                className="h-32 w-full rounded-3xl shadow-inner border border-white/10 relative overflow-hidden flex items-end p-6"
                style={{ backgroundColor: pickedColor }}
              >
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                 <div className="relative z-10 flex w-full justify-between items-center">
                    <span className="text-2xl font-black text-white drop-shadow-md uppercase tracking-tighter tabular-nums">{pickedColor}</span>
                    <button 
                      onClick={() => copyToClipboard(pickedColor)}
                      className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:scale-110 active:scale-90 transition-all"
                    >
                       {copied === pickedColor ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                 </div>
              </div>
           </div>

           {/* Extracted Palette */}
           <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <div className="flex items-center gap-2">
                 <Palette className="h-4 w-4 text-rose-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Paleta Sugerida</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {palette.length > 0 ? (
                  palette.map((color, i) => (
                    <button 
                      key={i}
                      onClick={() => setPickedColor(color)}
                      className="group relative h-20 rounded-2xl border border-white/5 overflow-hidden transition-all hover:scale-105"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                      <div className="absolute bottom-2 left-2 text-[8px] font-black text-white uppercase drop-shadow-md bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {color}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 py-10 text-center space-y-4">
                     <ImageIcon className="h-8 w-8 text-slate-700 mx-auto opacity-20" />
                     <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Gere cores a partir de fotos</p>
                  </div>
                )}
              </div>
           </div>

           {/* SEO Info */}
           <div className="p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                 <Info className="h-4 w-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Sobre a Ferramenta</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Este extrator utiliza o canvas do navegador para processar suas imagens localmente, garantindo total privacidade. Ideal para criar moodboards e paletas de cores a partir de fotografias reais e artes digitais.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
