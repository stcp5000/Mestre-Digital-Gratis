import React, { useState, useMemo, useRef } from "react";
import Barcode from "react-barcode";
import { 
  Barcode as BarcodeIcon, 
  Download, 
  Settings, 
  Info, 
  Check, 
  AlertCircle,
  Maximize2,
  Minimize2,
  Trash2,
  Type
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type BarcodeFormat = "CODE128" | "CODE39" | "EAN13" | "EAN8" | "UPC" | "ITF14" | "pharmacode";

interface FormatInfo {
  id: BarcodeFormat;
  label: string;
  placeholder: string;
  maxLength?: number;
  regex: RegExp;
  description: string;
}

const FORMATS: FormatInfo[] = [
  { 
    id: "CODE128", 
    label: "Code 128", 
    placeholder: "Qualquer texto ou número", 
    regex: /^[\x00-\x7F]+$/,
    description: "Versátil, alta densidade, suporta todos os caracteres ASCII."
  },
  { 
    id: "CODE39", 
    label: "Code 39", 
    placeholder: "LETRAS E NUMEROS", 
    regex: /^[0-9A-Z\-\.\ \$\/\+\%]+$/,
    description: "Alfanumérico. Usado em inventários e logística industrial."
  },
  { 
    id: "EAN13", 
    label: "EAN-13", 
    placeholder: "123456789012", 
    maxLength: 13,
    regex: /^\d{12,13}$/,
    description: "Padrão europeu de varejo. Requer 12 ou 13 dígitos."
  },
  { 
    id: "EAN8", 
    label: "EAN-8", 
    placeholder: "1234567", 
    maxLength: 8,
    regex: /^\d{7,8}$/,
    description: "Variação compacta para embalagens pequenas."
  },
  { 
    id: "UPC", 
    label: "UPC-A", 
    placeholder: "12345678901", 
    maxLength: 12,
    regex: /^\d{11,12}$/,
    description: "Padrão norte-americano para varejo (12 dígitos)."
  },
  { 
    id: "ITF14", 
    label: "ITF-14", 
    placeholder: "1234567890123", 
    maxLength: 14,
    regex: /^\d{13,14}$/,
    description: "Interleaved 2 of 5. Usado em caixas master de papelão."
  },
  { 
    id: "pharmacode", 
    label: "Pharmacode", 
    placeholder: "12345", 
    regex: /^\d+$/,
    description: "Usado na indústria farmacêutica para controle de embalagens."
  },
];

export default function BarcodeTool() {
  const [value, setValue] = useState("MESTREDIGITAL");
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [showText, setShowText] = useState(true);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [margin, setMargin] = useState(10);
  const [background, setBackground] = useState("#ffffff");
  const [lineColor, setLineColor] = useState("#000000");

  const barcodeRef = useRef<HTMLDivElement>(null);

  const activeFormat = FORMATS.find(f => f.id === format)!;

  const isValid = useMemo(() => {
    return activeFormat.regex.test(value);
  }, [value, activeFormat]);

  const downloadBarcode = () => {
    if (!barcodeRef.current) return;
    const svg = barcodeRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width * 2; // High res
    canvas.height = svgSize.height * 2;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `barcode-${value}.${format}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-widest rounded border border-blue-500/20 uppercase mb-4">
          Gerador de Ativos
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Código de Barras Profissional</h2>
        <p className="mt-4 text-slate-400">Gere códigos de barras em múltiplos formatos industriais e comerciais para etiquetas e produtos.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Editor Area */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                Conteúdo do Código
                {!isValid && value !== "" && (
                  <span className="text-rose-500 flex items-center gap-1 font-bold lowercase tracking-normal">
                    <AlertCircle className="h-3 w-3" /> Formato inválido
                  </span>
                )}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-500">
                  <Type className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  maxLength={activeFormat.maxLength}
                  className="w-full bg-[#111] border border-white/5 rounded-2xl py-6 px-14 outline-none focus:border-blue-500 transition-all font-black text-2xl text-white tracking-tighter"
                  placeholder={activeFormat.placeholder}
                />
                {isValid && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                    <Check className="h-6 w-6" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
               {FORMATS.map(f => (
                 <button 
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                    format === f.id 
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                    : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                  }`}
                 >
                   {f.label}
                 </button>
               ))}
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-2 text-white">
                    <Settings className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Configuração Estética</span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                                <span>Largura Barras ({width})</span>
                                <span className="text-blue-500">{width}px</span>
                            </div>
                            <input 
                                type="range" min="1" max="4" step="1" 
                                value={width} onChange={(e) => setWidth(parseInt(e.target.value))}
                                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                                <span>Altura ({height})</span>
                                <span className="text-blue-500">{height}px</span>
                            </div>
                            <input 
                                type="range" min="20" max="250" step="10" 
                                value={height} onChange={(e) => setHeight(parseInt(e.target.value))}
                                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                             <input 
                                type="checkbox" 
                                checked={showText} 
                                onChange={(e) => setShowText(e.target.checked)}
                                className="hidden"
                             />
                             <div className={`h-6 w-11 rounded-full relative transition-colors duration-300 ${showText ? 'bg-blue-500' : 'bg-slate-800'}`}>
                                <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 ${showText ? 'translate-x-5' : ''}`} />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Exibir código legível</span>
                        </label>
                        
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 block">Cor Barras</span>
                                <div className="flex gap-2">
                                    <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="h-8 w-8 rounded-lg bg-transparent border-0 cursor-pointer" />
                                    <input type="text" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 text-[10px] text-white font-mono uppercase" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 block">Fundo</span>
                                <div className="flex gap-2">
                                    <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-8 w-8 rounded-lg bg-transparent border-0 cursor-pointer" />
                                    <input type="text" value={background} onChange={(e) => setBackground(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 text-[10px] text-white font-mono uppercase" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className="bg-white rounded-[2rem] p-4 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative group overflow-hidden border-8 border-slate-900">
              {isValid ? (
                <div ref={barcodeRef} className="p-10 bg-white rounded-xl transition-all group-hover:scale-105 duration-700">
                    <Barcode 
                        value={value}
                        format={format}
                        displayValue={showText}
                        width={width}
                        height={height}
                        margin={margin}
                        background={background}
                        lineColor={lineColor}
                    />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-slate-300">
                    <AlertCircle className="h-16 w-16 text-rose-500/20" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dados inválidos para {activeFormat.label}</p>
                </div>
              )}
              
              <div className="absolute bottom-6 left-6 right-6">
                <button 
                    onClick={downloadBarcode}
                    disabled={!isValid}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black active:scale-95 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Download className="h-4 w-4 text-blue-500" />
                    Baixar PNG HD
                </button>
              </div>
           </div>

           <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                 <Info className="h-4 w-4" />
                 <h5 className="text-[10px] font-black uppercase tracking-widest">Sobre {activeFormat.label}</h5>
              </div>
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase">
                {activeFormat.description}
              </p>
              <div className="pt-2 border-t border-white/5">
                <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Padrão Técnico</div>
                <div className="text-[10px] font-black text-white uppercase">{format} Standard Optimization</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
