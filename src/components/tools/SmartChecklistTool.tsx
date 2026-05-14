import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Download, 
  Share2, 
  Zap, 
  Star, 
  Plane, 
  Search, 
  ShoppingCart, 
  Rocket,
  Check,
  MoreVertical,
  GripVertical,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  X,
  Edit2,
  Bell,
  FileText,
  FileSpreadsheet,
  FileCode
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

// --- Types & Themes ---

type ChecklistTheme = "classic" | "fun" | "cyber" | "minimal";
type NicheType = "custom" | "seo" | "travel" | "grocery" | "startup";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: boolean;
  duration?: string;
  dueDate?: string;
  notified?: boolean;
}

const NICHES: Record<NicheType, { name: string; icon: any; items: { text: string; duration: string }[] }> = {
  custom: { 
    name: "Personalizado", 
    icon: CheckSquare, 
    items: [] 
  },
  seo: { 
    name: "SEO On-Page", 
    icon: Search, 
    items: [
      { text: "Palavra-chave no título (H1)", duration: "5 min" },
      { text: "Meta Description atrativa", duration: "10 min" },
      { text: "URLs amigáveis e curtas", duration: "5 min" },
      { text: "Atributo ALT em todas as imagens", duration: "15 min" },
      { text: "Links internos para outras páginas", duration: "10 min" },
      { text: "Otimização de velocidade (Web Vitals)", duration: "1 hora" },
      { text: "Responsividade mobile testada", duration: "20 min" }
    ] 
  },
  travel: { 
    name: "Viagem Internacional", 
    icon: Plane, 
    items: [
      { text: "Passaporte e Vistos válidos", duration: "30 min" },
      { text: "Seguro viagem contratado", duration: "1 hora" },
      { text: "Reserva de hotel confirmada", duration: "20 min" },
      { text: "Remédios de uso contínuo", duration: "15 min" },
      { text: "Adaptador de tomada universal", duration: "5 min" },
      { text: "Câmbio de moeda realizado", duration: "40 min" },
      { text: "Check-in do voo feito", duration: "10 min" }
    ] 
  },
  grocery: { 
    name: "Compras Saudáveis", 
    icon: ShoppingCart, 
    items: [
      { text: "Frutas da estação", duration: "10 min" },
      { text: "Vegetais folhosos escuros", duration: "5 min" },
      { text: "Proteínas magras", duration: "10 min" },
      { text: "Grãos integrais", duration: "5 min" },
      { text: "Ovos e laticínios", duration: "5 min" },
      { text: "Castanhas e sementes", duration: "10 min" },
      { text: "Água mineral", duration: "2 min" }
    ] 
  },
  startup: { 
    name: "Lançamento de Produto", 
    icon: Rocket, 
    items: [
      { text: "Landing Page finalizada", duration: "4 horas" },
      { text: "Pixel de rastreio configurado", duration: "20 min" },
      { text: "E-mails de automação prontos", duration: "2 horas" },
      { text: "Depoimentos e prova social", duration: "1 hora" },
      { text: "Suporte ao cliente avisado", duration: "30 min" },
      { text: "Ads (Meta/Google) ativos", duration: "1 hora" },
      { text: "Escalabilidade do servidor testada", duration: "2 horas" }
    ] 
  }
};

const themeConfigs: Record<ChecklistTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  itemBg: string;
  text: string;
  button: string;
}> = {
  classic: {
    name: "Profissional",
    bg: "bg-[#0A0A0A]",
    border: "border-white/10",
    accent: "text-white",
    itemBg: "bg-white/5",
    text: "text-slate-400",
    button: "bg-indigo-600 text-white"
  },
  fun: {
    name: "Divertido",
    bg: "bg-yellow-400",
    border: "border-black/20",
    accent: "text-black",
    itemBg: "bg-white",
    text: "text-black/60",
    button: "bg-black text-white"
  },
  cyber: {
    name: "Cyberpunk",
    bg: "bg-[#020202]",
    border: "border-cyan-500/30",
    accent: "text-cyan-400",
    itemBg: "bg-cyan-500/5",
    text: "text-cyan-500/60",
    button: "bg-cyan-500 text-black"
  },
  minimal: {
    name: "Zen",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    itemBg: "bg-white",
    text: "text-slate-500",
    button: "bg-slate-900 text-white"
  }
};

export default function SmartChecklistTool() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [niche, setNiche] = useState<NicheType>("custom");
  const [theme, setTheme] = useState<ChecklistTheme>("classic");
  const [inputValue, setInputValue] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("Meu Checklist");

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentTheme = themeConfigs[theme];

  // Sound Player
  const playAlert = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  // Reminders Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setItems(prev => {
        let changed = false;
        const next = prev.map(item => {
          if (item.dueDate && !item.completed && !item.notified) {
            const due = new Date(item.dueDate);
            if (due <= now) {
              changed = true;
              playAlert();
              return { ...item, notified: true };
            }
          }
          return item;
        });
        return changed ? next : prev;
      });
    }, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const applyNiche = (type: NicheType) => {
    setNiche(type);
    setTitle(NICHES[type].name);
    const newItems = NICHES[type].items.map(i => ({
      id: Math.random().toString(36).substr(2, 9),
      text: i.text,
      duration: i.duration,
      completed: false,
      priority: false
    }));
    setItems(newItems);
  };

  const getAISuggestions = async () => {
    if (!inputValue.trim()) return;
    const topic = inputValue.trim();
    setIsSuggesting(true);
    setNiche("custom");
    setTitle(topic);
    try {
      const res = await fetch("/api/checklist/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.suggestions) {
        const newItems: ChecklistItem[] = data.suggestions.map((s: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          text: s.text,
          duration: s.duration,
          completed: false,
          priority: false
        }));
        // Replace previous list as requested: "cada novo tema o check list anterior deve ser apagado"
        setItems(newItems);
        setInputValue("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputValue.trim(),
      completed: false,
      priority: false
    };
    setItems([newItem, ...items]);
    setInputValue("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.completed));
  };

  // --- Export Logic ---

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    items.forEach((item, index) => {
      const status = item.completed ? "[X]" : "[ ]";
      const duration = item.duration ? ` (${item.duration})` : "";
      const date = item.dueDate ? ` - Termina em: ${new Date(item.dueDate).toLocaleString()}` : "";
      doc.text(`${status} ${item.text}${duration}${date}`, 20, 40 + (index * 10));
    });
    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  const exportExcel = () => {
    const data = items.map(i => ({
      Status: i.completed ? "Concluído" : "Pendente",
      Tarefa: i.text,
      Duração: i.duration || "",
      Data_Entrega: i.dueDate || ""
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Checklist");
    XLSX.writeFile(wb, `${title.replace(/\s+/g, "_")}.xlsx`);
  };

  const exportWord = () => {
    let content = `<html><body><h1>${title}</h1><ul>`;
    items.forEach(i => {
      content += `<li><b>${i.completed ? "[X]" : "[ ]"}</b> ${i.text} ${i.duration ? `(${i.duration})` : ""}</li>`;
    });
    content += "</ul></body></html>";
    const blob = new Blob([content], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}.doc`;
    link.click();
  };

  const progress = items.length > 0 ? (items.filter(i => i.completed).length / items.length) * 100 : 0;

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-widest rounded border border-indigo-500/20 uppercase mb-4">
          Produtividade & Organização AI
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Checklist Turbo</h2>
        <p className="mt-4 text-slate-400">Sugestões inteligentes com AI, lembretes sonoros e prazos. Defina seu tema e deixe a IA sugerir os passos ideais.</p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
           {(Object.keys(themeConfigs) as ChecklistTheme[]).map((t) => (
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

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setSoundEnabled(!soundEnabled)}
             className={`p-3 rounded-xl border transition-all ${
               soundEnabled 
               ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" 
               : "bg-white/5 border-white/10 text-slate-500"
             }`}
             title={soundEnabled ? "Alertas Sonoros Ativos" : "Alertas Sonoros Mudos"}
           >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
           </button>
           <button 
             onClick={clearCompleted}
             className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all font-mono"
           >
             <RotateCcw className="h-3 w-3" />
             Limpar Concluídos
           </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main List Management */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
           <div className={`p-8 rounded-[3rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} min-h-[600px] flex flex-col shadow-2xl relative overflow-hidden`}>
              
              {/* Export Floating Actions */}
              <div className="absolute top-8 right-8 flex gap-2">
                 <button onClick={exportPDF} title="PDF" className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-white/10 transition-all">
                    <FileText className="h-5 w-5" />
                 </button>
                 <button onClick={exportWord} title="Word" className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-blue-500 hover:bg-white/10 transition-all">
                    <FileCode className="h-5 w-5" />
                 </button>
                 <button onClick={exportExcel} title="Excel" className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-emerald-500 hover:bg-white/10 transition-all">
                    <FileSpreadsheet className="h-5 w-5" />
                 </button>
              </div>

              {/* Progress Summary */}
              <div className="mb-10 space-y-4">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <h3 className={`text-2xl font-black uppercase tracking-tighter ${currentTheme.accent}`}>{title}</h3>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text}`}>
                          {items.filter(i => i.completed).length} de {items.length} tarefas concluídas
                       </p>
                    </div>
                    <div className="text-right">
                       <span className={`text-4xl font-black tracking-tighter ${currentTheme.accent}`}>{Math.round(progress)}%</span>
                    </div>
                 </div>
                 <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      key="progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]`}
                    />
                 </div>
              </div>

              {/* Input Form with AI Suggestion */}
              <div className="space-y-4 mb-10">
                <div className="relative group">
                   <input 
                     type="text" 
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder="Ex: Treino de Academia, Viagem para Paris, SEO..."
                     className={`w-full py-5 pl-7 pr-32 rounded-3xl border outline-none transition-all text-sm font-medium ${
                       theme === 'minimal' 
                       ? 'bg-slate-100 border-slate-200 text-slate-900 focus:border-indigo-500' 
                       : 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-indigo-500'
                     }`}
                     onKeyDown={(e) => e.key === "Enter" && addItem()}
                   />
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <button 
                         onClick={getAISuggestions}
                         disabled={isSuggesting || !inputValue.trim()}
                         className={`h-11 px-4 flex items-center gap-2 ${currentTheme.button} rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-xl`}
                       >
                         {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                         <span className="text-[10px] font-black uppercase tracking-widest">Sugerir</span>
                       </button>
                       <button 
                         onClick={addItem}
                         className="h-11 w-11 flex items-center justify-center bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                       >
                          <Plus className="h-6 w-6" />
                       </button>
                   </div>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ml-4 transition-colors ${currentTheme.text}`}>
                  {isSuggesting ? "IA está gerando seu checklist..." : "💡 Dica: Digite um tema e clique em 'Sugerir' para gerar tarefas automáticas."}
                </p>
              </div>

              {/* List Items */}
              <div className="flex-1 space-y-4">
                 <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex flex-col gap-3 p-5 rounded-3xl border transition-all relative group ${
                          item.completed 
                          ? 'opacity-40 grayscale bg-black/20' 
                          : `${currentTheme.itemBg} ${currentTheme.border} hover:border-indigo-500/30`
                        }`}
                      >
                         <div className="flex items-center gap-4">
                            <button 
                              onClick={() => toggleItem(item.id)}
                              className={`h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                                item.completed 
                                ? 'bg-indigo-500 border-indigo-500 text-black shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                                : 'border-white/10 hover:border-indigo-500 hover:bg-indigo-500/5'
                              }`}
                            >
                               {item.completed && <Check className="h-4 w-4 stroke-[4]" />}
                            </button>
                            
                            {editingId === item.id ? (
                               <input 
                                 autoFocus
                                 className="flex-1 bg-transparent border-b border-indigo-500 text-sm font-bold text-white outline-none py-1"
                                 value={item.text}
                                 onChange={(e) => updateItem(item.id, { text: e.target.value })}
                                 onBlur={() => setEditingId(null)}
                                 onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                               />
                            ) : (
                               <span 
                                 className={`flex-1 text-sm font-bold tracking-tight transition-all ${item.completed ? 'line-through text-slate-500' : currentTheme.accent}`}
                                 onClick={() => setEditingId(item.id)}
                               >
                                  {item.text}
                               </span>
                            )}

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => setEditingId(item.id)}
                                 className="p-2 text-slate-500 hover:text-white"
                               >
                                  <Edit2 className="h-4 w-4" />
                               </button>
                               <button 
                                 onClick={() => deleteItem(item.id)}
                                 className="p-2 text-slate-500 hover:text-rose-500"
                               >
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                         </div>

                         {/* Task Details Row */}
                         {!item.completed && (
                           <div className="flex flex-wrap gap-4 items-center ml-11">
                               <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                  <Clock className="h-3 w-3 text-indigo-400" />
                                  <input 
                                    className="bg-transparent text-[10px] font-black uppercase text-slate-300 w-16 outline-none"
                                    placeholder="Tempo"
                                    value={item.duration || ""}
                                    onChange={(e) => updateItem(item.id, { duration: e.target.value })}
                                  />
                               </div>
                               <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                  <Calendar className="h-3 w-3 text-emerald-400" />
                                  <input 
                                    type="datetime-local"
                                    className="bg-transparent text-[10px] font-black text-slate-300 outline-none w-32"
                                    value={item.dueDate || ""}
                                    onChange={(e) => updateItem(item.id, { dueDate: e.target.value, notified: false })}
                                  />
                               </div>
                               {item.dueDate && (
                                 <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase transition-colors ${item.notified ? 'text-rose-500' : 'text-slate-500'}`}>
                                    <Bell className={`h-3 w-3 ${item.notified ? 'animate-bounce' : ''}`} />
                                    {item.notified ? "Vencido!" : "Lembrete Ativo"}
                                 </div>
                               )}
                           </div>
                         )}
                      </motion.div>
                    ))}
                 </AnimatePresence>

                 {items.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                      <CheckSquare className="h-24 w-24 mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest font-mono">Nada para fazer aqui</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           {/* AI / Presets Card */}
           <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-700 ${theme === 'fun' ? 'bg-white' : 'bg-[#0A0A0A]'} ${currentTheme.border} space-y-8`}>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Modelos Nichados</span>
                 </div>
              </div>
              
              <div className="grid gap-4">
                 {(Object.keys(NICHES) as NicheType[]).map((key) => {
                   const n = NICHES[key];
                   return (
                     <button 
                       key={key}
                       onClick={() => applyNiche(key)}
                       className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all text-left group ${
                         niche === key 
                         ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
                       }`}
                     >
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${niche === key ? 'bg-indigo-500 text-black shadow-lg shadow-indigo-500/20' : 'bg-white/5'}`}>
                           <n.icon className="h-6 w-6" />
                        </div>
                        <div>
                           <span className="text-[12px] font-black uppercase tracking-widest transition-colors">{n.name}</span>
                           <p className="text-[9px] font-bold opacity-60 uppercase mt-0.5">{n.items.length || "Vazio"} tarefas base</p>
                        </div>
                     </button>
                   );
                 })}
              </div>
           </div>

           {/* Stats / SEO Card */}
           <div className="p-8 rounded-[3rem] bg-indigo-600 border border-indigo-400/50 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Rocket className="h-32 w-32 rotate-12" />
              </div>
              
              <div className="flex items-center gap-2 text-white">
                 <Bell className="h-4 w-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Extensão e Exportação</span>
              </div>
              <div className="space-y-4 relative z-10">
                <p className="text-white text-sm font-bold leading-tight">
                  Exporte seu checklist agora mesmo para PDF, Word ou Excel clicando nos ícones superiores.
                </p>
                <div className="flex gap-2">
                   <div className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black text-white">EXCEL READY</div>
                   <div className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black text-white">DOCX SUPPORT</div>
                </div>
                <p className="text-white/80 text-[11px] font-medium leading-relaxed">
                  Perfeito para levar suas tarefas offline ou compartilhar com sua equipe em formatos universais.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
