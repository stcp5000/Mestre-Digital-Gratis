import React, { useState, useMemo, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Heart, 
  PartyPopper, 
  Briefcase, 
  Baby, 
  Calendar, 
  Plus, 
  Trash2, 
  Clock, 
  Users, 
  MapPin, 
  Utensils, 
  Camera, 
  Music, 
  Gift, 
  Info,
  ChevronRight,
  TrendingUp,
  Award,
  CircleCheck,
  LayoutGrid,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type EventTheme = "classic" | "romantic" | "professional" | "minimal";
type EventNiche = "wedding" | "birthday" | "corporate" | "babyshower";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

interface NicheConfig {
  name: string;
  icon: any;
  defaultTasks: { category: string; tasks: string[] }[];
  description: string;
}

const NICHES: Record<EventNiche, NicheConfig> = {
  wedding: {
    name: "Casamento Real",
    icon: Heart,
    description: "Organização completa do grande dia, do buffet ao vestido.",
    defaultTasks: [
      { category: "Planejamento", tasks: ["Definir orçamento total", "Escolher data e local", "Contratar assessoria"] },
      { category: "Convidados", tasks: ["Fazer lista de convidados", "Enviar Save the Date", "Escolher padrinhos"] },
      { category: "Serviços", tasks: ["Contratar fotógrafo", "Escolher Buffet", "Contratar DJ/Banda"] },
      { category: "Look", tasks: ["Escolher vestido/terno", "Fazer prova de maquiagem", "Escolher alianças"] }
    ]
  },
  birthday: {
    name: "Aniversário / Festa",
    icon: PartyPopper,
    description: "Tudo para uma comemoração inesquecível entre amigos e família.",
    defaultTasks: [
      { category: "Essenciais", tasks: ["Definir tema da festa", "Reservar espaço", "Fazer lista de presença"] },
      { category: "Comida & Bebida", tasks: ["Encomendar bolo", "Comprar descartáveis", "Definir cardápio de bebidas"] },
      { category: "Diversão", tasks: ["Contratar recreação", "Montar playlist", "Preparar lembrancinhas"] }
    ]
  },
  corporate: {
    name: "Evento Corporativo",
    icon: Briefcase,
    description: "Foco em logística, networking e profissionalismo.",
    defaultTasks: [
      { category: "Logística", tasks: ["Verificar Wi-Fi do local", "Organizar credenciamento", "Contratar Coffee Break"] },
      { category: "Conteúdo", tasks: ["Confirmar palestrantes", "Preparar apresentações", "Imprimir material de apoio"] },
      { category: "Marketing", tasks: ["Enviar convites digitais", "Preparar brindes", "Contratar sonorização"] }
    ]
  },
  babyshower: {
    name: "Chá de Bebê",
    icon: Baby,
    description: "Cuidado e carinho em cada detalhe para a chegada do novo membro.",
    defaultTasks: [
      { category: "Preparativos", tasks: ["Definir lista de presentes", "Fazer convite temático", "Escolher nome da criança"] },
      { category: "Festa", tasks: ["Decorar com balões", "Organizar brincadeiras", "Encomendar docinhos"] }
    ]
  }
};

const themeConfigs: Record<EventTheme, {
  name: string;
  bg: string;
  border: string;
  accent: string;
  card: string;
  button: string;
  text: string;
  checkbox: string;
}> = {
  classic: {
    name: "Executivo",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-emerald-500 text-[#0A1F35]",
    text: "text-slate-400",
    checkbox: "text-emerald-400"
  },
  romantic: {
    name: "Romântico/Doce",
    bg: "bg-[#FFF5F7]",
    border: "border-rose-200 shadow-[0_4px_20px_rgba(244,63,94,0.05)]",
    accent: "text-rose-900",
    card: "bg-white border-rose-100",
    button: "bg-rose-500 text-white",
    text: "text-rose-400",
    checkbox: "text-rose-500"
  },
  professional: {
    name: "Tech/Moderno",
    bg: "bg-[#020202]",
    border: "border-indigo-500/30",
    accent: "text-indigo-400",
    card: "bg-indigo-500/5",
    button: "bg-indigo-500 text-black shadow-[0_0_15px_rgba(99,102,241,0.3)]",
    text: "text-indigo-500/40",
    checkbox: "text-indigo-400"
  },
  minimal: {
    name: "Minimalista",
    bg: "bg-[#F8FAFC]",
    border: "border-slate-200",
    accent: "text-slate-900",
    card: "bg-white shadow-sm border-slate-100",
    button: "bg-slate-900 text-white",
    text: "text-slate-500",
    checkbox: "text-slate-900"
  }
};

export default function EventChecklistTool() {
  const [niche, setNiche] = useState<EventNiche>("wedding");
  const [theme, setTheme] = useState<EventTheme>("classic");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Geral");

  const currentTheme = themeConfigs[theme];

  // Initialize tasks when niche changes
  useEffect(() => {
    const defaultTasks: Task[] = NICHES[niche].defaultTasks.flatMap(group => 
      group.tasks.map(text => ({
        id: Math.random().toString(36).substr(2, 9),
        text,
        completed: false,
        category: group.category
      }))
    );
    setTasks(defaultTasks);
  }, [niche]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTaskText,
      completed: false,
      category: newTaskCategory
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskText("");
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    
    // Group by category
    const categoriesSet = new Set(tasks.map(t => t.category));
    const byCategory = Array.from(categoriesSet).map(cat => ({
      name: cat,
      tasks: tasks.filter(t => t.category === cat)
    }));

    return { total, completed, percent, byCategory };
  }, [tasks]);

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className={`inline-block px-2 py-0.5 ${theme === 'romantic' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'} text-[10px] font-black tracking-widest rounded border uppercase mb-4`}>
          Event Planning Protocol
        </span>
        <h2 className={`text-4xl font-extrabold tracking-tighter uppercase leading-none ${theme === 'romantic' ? 'text-rose-900' : theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Checklist Inteligente de Eventos</h2>
        <p className={`mt-4 ${theme === 'minimal' ? 'text-slate-500' : 'text-slate-400'}`}>Organize seu casamento, festa ou evento corporativo com precisão milimétrica. Acompanhe cada etapa, categorize tarefas e garanta que nada seja esquecido no grande dia.</p>
      </div>

      {/* Theme Selection */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as EventTheme[]).map((t) => (
           <button
             key={t}
             onClick={() => setTheme(t)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
               theme === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-emerald-400"
             }`}
           >
             {themeConfigs[t].name}
           </button>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sidebar & Config */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-8`}>
              
              <div className="grid grid-cols-2 gap-3">
                 {(Object.keys(NICHES) as EventNiche[]).map((key) => {
                   const n = NICHES[key];
                   const Icon = n.icon;
                   return (
                     <button
                       key={key}
                       onClick={() => setNiche(key)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                         niche === key 
                         ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                         : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{n.name}</span>
                     </button>
                   );
                 })}
              </div>

              {/* Add Task Form */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nova Tarefa</h4>
                 <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Ex: Contratar flores..."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 text-sm transition-all ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}
                      onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    />
                    <div className="flex gap-2">
                       <select 
                         value={newTaskCategory}
                         onChange={(e) => setNewTaskCategory(e.target.value)}
                         className={`flex-1 bg-white/5 border border-white/10 p-2 rounded-xl text-[10px] font-black uppercase outline-none focus:border-emerald-500 ${theme === 'minimal' ? 'text-slate-900 border-slate-200' : 'text-slate-400'}`}
                       >
                          <option value="Geral">Geral</option>
                          <option value="Logística">Logística</option>
                          <option value="Serviços">Serviços</option>
                          <option value="Look">Look</option>
                          <option value="Convidados">Convidados</option>
                       </select>
                       <button 
                         onClick={addTask}
                         className="h-10 w-10 flex items-center justify-center bg-emerald-500 text-[#0A1F35] rounded-xl hover:scale-105 transition-all"
                       >
                          <Plus className="h-5 w-5" />
                       </button>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/5 w-full" />

              {/* Progress Summary */}
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progresso Total</h3>
                       <span className={`text-4xl font-black ${currentTheme.accent}`}>{stats.percent.toFixed(0)}%</span>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black text-slate-500 uppercase block">{stats.completed} / {stats.total}</span>
                       <span className="text-[8px] font-black text-emerald-500 uppercase">Tarefas Finalizadas</span>
                    </div>
                 </div>
                 <div className="h-3 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                    <motion.div 
                      layout
                      animate={{ width: `${stats.percent}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Categories & Tasks */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
           <AnimatePresence mode="wait">
             <div className="grid gap-8">
                {stats.byCategory.map((cat, groupIdx) => (
                  <motion.div 
                    key={cat.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: groupIdx * 0.1 }}
                    className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${currentTheme.card} ${currentTheme.border}`}
                  >
                     <div className="flex items-center gap-3 mb-6">
                        <div className={`h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-500`}>
                           <LayoutGrid className="h-4 w-4" />
                        </div>
                        <h4 className={`text-lg font-black tracking-tight ${theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>{cat.name}</h4>
                        <span className="ml-auto text-[10px] font-black text-slate-500 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                           {cat.tasks.filter(t => t.completed).length}/{cat.tasks.length}
                        </span>
                     </div>

                     <div className="space-y-3">
                        {cat.tasks.map((task) => (
                          <div 
                            key={task.id}
                            className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                              task.completed 
                              ? 'bg-emerald-500/5 border-emerald-500/10 opacity-60' 
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                          >
                             <button 
                               onClick={() => toggleTask(task.id)}
                               className={`transition-colors h-6 w-6 flex items-center justify-center rounded-lg border-2 ${
                                 task.completed 
                                 ? 'bg-emerald-500 border-emerald-500 text-[#0A1F35]' 
                                 : 'border-white/10 hover:border-emerald-500'
                               }`}
                             >
                                {task.completed ? <CheckCircle2 className="h-4 w-4" /> : null}
                             </button>

                             <span className={`flex-1 text-sm font-medium transition-all ${
                               task.completed 
                               ? 'line-through text-slate-500' 
                               : theme === 'minimal' ? 'text-slate-800' : 'text-slate-200'
                             }`}>
                                {task.text}
                             </span>

                             <button 
                               onClick={() => deleteTask(task.id)}
                               className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                             >
                                <Trash2 className="h-4 w-4" />
                             </button>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                ))}
             </div>
           </AnimatePresence>

           {/* Tip Card */}
           <div className={`p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 flex gap-6 items-center`}>
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                 <Calendar className="h-7 w-7" />
              </div>
              <div>
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Dica da Organização</h4>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                    Para eventos de grande porte ({NICHES[niche].name}), recomendamos priorizar as tarefas marcadas com 'Logística' com pelo menos 6 meses de antecedência para garantir as melhores datas e fornecedores.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
