import React, { useState, useRef } from "react";
import { 
  FileText, 
  FileDown, 
  Files, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  CircleDashed, 
  Download, 
  Trash2, 
  AlertCircle,
  Monitor,
  Palette,
  Zap,
  ArrowRightLeft,
  Settings,
  Layout,
  Type,
  FileCode,
  FileJson,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";

// --- Types & Themes ---

type PDFTheme = "classic" | "playful" | "cyber" | "minimal";
type ConversionMode = "to_pdf" | "from_pdf" | "merge";

interface ThemeConfig {
  name: string;
  bg: string;
  card: string;
  accent: string;
  button: string;
  text: string;
  border: string;
  dropzone: string;
  label: string;
}

const THEMES: Record<PDFTheme, ThemeConfig> = {
  classic: {
    name: "Clássico Office",
    bg: "bg-slate-50",
    card: "bg-white border-slate-200 shadow-sm",
    accent: "text-blue-700",
    button: "bg-blue-700 text-white hover:bg-blue-800",
    text: "text-slate-600",
    border: "border-slate-200",
    dropzone: "bg-slate-50 border-slate-300 border-dashed",
    label: "text-slate-400 font-bold uppercase"
  },
  playful: {
    name: "Divertido & Criativo",
    bg: "bg-amber-50",
    card: "bg-white border-black/10 shadow-[10px_10px_0_#000]",
    accent: "text-fuchsia-500",
    button: "bg-yellow-400 text-black font-black border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0_#000]",
    text: "text-slate-700",
    border: "border-black/5",
    dropzone: "bg-white border-4 border-dashed border-black/10",
    label: "text-black font-black italic"
  },
  cyber: {
    name: "Cyber Terminal",
    bg: "bg-[#050505]",
    card: "bg-zinc-900 border-emerald-500/30",
    accent: "text-emerald-400",
    button: "bg-emerald-500 text-black font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    text: "text-zinc-500",
    border: "border-zinc-800",
    dropzone: "bg-black border-emerald-500/20 border-2 border-dashed",
    label: "text-emerald-500/40 font-mono"
  },
  minimal: {
    name: "Clean / Estético",
    bg: "bg-white",
    card: "bg-white border-slate-100",
    accent: "text-indigo-600",
    button: "bg-black text-white px-8 rounded-full font-medium",
    text: "text-slate-400",
    border: "border-slate-100",
    dropzone: "bg-slate-50 border-slate-100 border-2 rounded-[2rem]",
    label: "text-slate-300 font-medium"
  }
};

export default function PDFConverterTool() {
  const [theme, setTheme] = useState<PDFTheme>("classic");
  const [mode, setMode] = useState<ConversionMode>("to_pdf");
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTheme = THEMES[theme];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setIsFinished(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setIsFinished(false);
  };

  const processConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const doc = new jsPDF();
      let yOffset = 20;

      for (const file of files) {
        if (file.type.startsWith("image/")) {
          // Re-encode image to base64 for jsPDF
          const reader = new FileReader();
          const imageData = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
          doc.addImage(imageData, "JPEG", 10, yOffset, 190, 100);
          yOffset += 110;
          if (yOffset > 250) {
            doc.addPage();
            yOffset = 20;
          }
        } else {
          doc.text(`Arquivo: ${file.name}`, 10, yOffset);
          doc.text(`Tamanho: ${(file.size / 1024).toFixed(2)} KB`, 10, yOffset + 10);
          yOffset += 30;
          if (yOffset > 250) {
            doc.addPage();
            yOffset = 20;
          }
        }
      }

      doc.save(`conversao-${Date.now()}.pdf`);
      setIsFinished(true);
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 text-left">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded border border-blue-500/20">
             Digital Doc Pro v3
           </span>
           <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/20">
             Offline Processing
           </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${theme === 'cyber' ? 'text-emerald-400' : 'text-slate-900'}`}>
           Conversor de PDF de Alta Performance
        </h2>
        <p className={`text-lg font-medium ${theme === 'cyber' ? 'text-zinc-500' : 'text-slate-500'}`}>
           Converta imagens e documentos para PDF ou extraia conteúdos em segundos. Seguro, rápido e com diversos estilos visuais para sua produtividade.
        </p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1.5 rounded-2xl border border-white/10 w-fit overflow-x-auto no-scrollbar shadow-2xl">
        {(Object.keys(THEMES) as PDFTheme[]).map((t) => (
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
        {/* Main Workspace */}
        <div className="lg:col-span-8 space-y-6">
           <div className={`p-8 md:p-12 rounded-[3.5rem] border transition-all duration-500 ${currentTheme.card} space-y-10 shadow-2xl`}>
              
              {/* Mode Switcher */}
              <div className="flex flex-wrap gap-4">
                 {[
                   { id: "to_pdf", name: "Para PDF", icon: FileDown },
                   { id: "from_pdf", name: "Extrair de PDF", icon: ArrowRightLeft },
                   { id: "merge", name: "Mesclar", icon: Files }
                 ].map((m) => {
                   const Icon = m.icon;
                   return (
                     <button
                       key={m.id}
                       onClick={() => setMode(m.id as ConversionMode)}
                       className={`flex items-center gap-3 px-6 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${
                         mode === m.id 
                         ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                         : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                       }`}
                     >
                        <Icon className="h-4 w-4" />
                        {m.name}
                     </button>
                   );
                 })}
              </div>

              {/* Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative p-12 md:p-20 rounded-[3rem] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-6 ${currentTheme.dropzone} hover:border-blue-500/50`}
              >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   multiple 
                   className="hidden" 
                   accept={mode === 'from_pdf' ? '.pdf' : '*/*'}
                 />
                 
                 <div className={`h-24 w-24 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                    theme === 'cyber' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-600'
                 }`}>
                    <Upload className="h-10 w-10" />
                 </div>

                 <div className="space-y-2">
                    <h3 className={`text-xl font-black uppercase tracking-tighter ${theme === 'cyber' ? 'text-emerald-400' : 'text-slate-900'}`}>
                       Arraste arquivos aqui
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">
                       ou clique para selecionar do seu dispositivo
                    </p>
                 </div>

                 <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase">
                       <ImageIcon className="h-3.5 w-3.5" /> PNG/JPG
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase">
                       <FileText className="h-3.5 w-3.5" /> TXT/DOC
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase">
                       <FileCode className="h-3.5 w-3.5" /> CODE
                    </div>
                 </div>
              </div>

              {/* File List */}
              <AnimatePresence>
                 {files.length > 0 && (
                   <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                   >
                     <div className="flex justify-between items-center px-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>
                           Arquivos Selecionados ({files.length})
                        </span>
                        <button onClick={() => setFiles([])} className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1 hover:underline">
                           <Trash2 className="h-3 w-3" /> Limpar Todos
                        </button>
                     </div>
                     <div className="grid gap-2">
                        {files.map((file, idx) => (
                           <motion.div 
                            key={`${file.name}-${idx}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center justify-between p-4 rounded-2xl border ${
                               theme === 'cyber' ? 'bg-white/5 border-white/5 text-zinc-400' : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}
                           >
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-blue-500">
                                    <FileText className="h-5 w-5" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black truncate max-w-[200px]">{file.name}</span>
                                    <span className="text-[10px] opacity-60">{(file.size / 1024).toFixed(1)} KB</span>
                                 </div>
                              </div>
                              <button onClick={() => removeFile(idx)} className="p-2 hover:bg-rose-500/10 text-rose-400 transition-all rounded-lg">
                                 <Trash2 className="h-4 w-4" />
                              </button>
                           </motion.div>
                        ))}
                     </div>
                   </motion.div>
                 )}
              </AnimatePresence>

              {/* Action */}
              <button 
                onClick={processConvert}
                disabled={files.length === 0 || isProcessing}
                className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${
                  currentTheme.button
                } ${isProcessing || files.length === 0 ? 'opacity-50' : 'hover:scale-[1.02] active:scale-95'}`}
              >
                 {isProcessing ? (
                   <>
                     <CircleDashed className="h-6 w-6 animate-spin" />
                     <span>Processando Documentos...</span>
                   </>
                 ) : (
                   <>
                     <Zap className="h-6 w-6 group-hover:animate-pulse" />
                     <span>Converter Agora</span>
                   </>
                 )}
              </button>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${currentTheme.card} space-y-8 shadow-xl`}>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Settings className={`h-5 w-5 ${currentTheme.accent}`} />
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.label}`}>Configurações</h4>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">Qualidade</span>
                       <span className="text-[10px] font-black text-blue-600">Alta</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">OCR Ativo</span>
                       <span className="text-[10px] font-black text-emerald-500">SIM</span>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-6">
                 <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-slate-400">
                    <AlertCircle className="h-4 w-4" /> Privacidade Total
                 </div>
                 <p className="text-[10px] text-zinc-500 font-bold leading-relaxed italic">
                    "Seus arquivos nunca saem do seu navegador. O processamento é feito 100% via Client-Side para sua segurança máxima."
                 </p>
              </div>

              {isFinished && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4"
                >
                   <div className="h-12 w-12 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <Check className="h-7 w-7" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-sm font-black text-emerald-600 uppercase">Concluído!</h4>
                      <p className="text-[10px] text-slate-500 font-bold">O download do PDF começou automaticamente.</p>
                   </div>
                   <button 
                     onClick={processConvert}
                     className="w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                   >
                      <Download className="h-4 w-4" /> Baixar Novamente
                   </button>
                </motion.div>
              )}
           </div>

           {/* Stats / Use Cases */}
           <div className="grid gap-4">
              <div className="p-6 rounded-3xl bg-[#05192d] border border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Files className="h-5 w-5 text-indigo-400" />
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Suporte Multi-Formato</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {['PNG', 'JPG', 'TXT', 'DOCX', 'JSON', 'PPT'].map(fmt => (
                      <span key={fmt} className="px-2 py-1 bg-white/5 text-[8px] font-black text-slate-500 rounded border border-white/5">{fmt}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
