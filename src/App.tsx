import { useState, useEffect } from "react";
import { 
  QrCode, 
  Hash, 
  Calculator, 
  Type, 
  Palette, 
  CheckSquare, 
  Info,
  Menu,
  X,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  Download,
  Search,
  ExternalLink,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

// --- Types ---
type ToolId = "qrcode" | "hashtags" | "calc" | "text" | "colors" | "checklist" | "hours" | "whatsapp" | "json" | "pomodoro" | "unit" | "dates";

interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: any;
  color: string;
}

const TOOLS: Tool[] = [
  { id: "qrcode", name: "QR Code", description: "Gerador de códigos QR", icon: QrCode, color: "bg-emerald-500" },
  { id: "hashtags", name: "Hashtags", description: "IA para hashtags virais", icon: Hash, color: "bg-emerald-500" },
  { id: "calc", name: "Financeiro", description: "ROI, CPC e Performance", icon: Calculator, color: "bg-emerald-500" },
  { id: "text", name: "Texto", description: "Contagem e transformação", icon: Type, color: "bg-emerald-500" },
  { id: "colors", name: "Paletas", description: "Cores e Harmonias", icon: Palette, color: "bg-emerald-500" },
  { id: "checklist", name: "Checklist", description: "Gestão de tarefas", icon: CheckSquare, color: "bg-emerald-500" },
  { id: "hours", name: "Horas", description: "Jornada de trabalho", icon: Clock, color: "bg-emerald-500" },
  { id: "whatsapp", name: "WhatsApp", description: "Link direto p/ Whats", icon: ExternalLink, color: "bg-emerald-500" },
  { id: "json", name: "JSON", description: "Formatador e Validador", icon: Search, color: "bg-emerald-500" },
  { id: "pomodoro", name: "Pomodoro", description: "Foco e Produtividade", icon: Clock, color: "bg-emerald-500" },
  { id: "unit", name: "Unidades", description: "Conversor universal", icon: RefreshCw, color: "bg-emerald-500" },
  { id: "dates", name: "Datas", description: "Cálculo entre dias", icon: Info, color: "bg-emerald-500" },
];

const SEGMENTS = [
  {
    title: "Produtividade",
    description: "Organize sua rotina e maximize seu tempo.",
    toolIds: ["hours", "checklist", "pomodoro"]
  },
  {
    title: "Financeiro",
    description: "Controle de investimentos e métricas de performance.",
    toolIds: ["calc"]
  },
  {
    title: "Social e Marketing",
    description: "Gere visibilidade e conexões rápidas.",
    toolIds: ["qrcode", "hashtags", "whatsapp"]
  },
  {
    title: "Texto e Escrita",
    description: "Ferramentas para redação e copywriting.",
    toolIds: ["text"]
  },
  {
    title: "Técnico e Dev",
    description: "Utilitários essenciais para desenvolvedores.",
    toolIds: ["json"]
  },
  {
    title: "Web Design e Imagem",
    description: "Crie identidades visuais impactantes.",
    toolIds: ["colors"]
  },
  {
    title: "Utilidades",
    description: "Conversores e cálculos gerais do dia a dia.",
    toolIds: ["unit"]
  },
  {
    title: "Planejamento",
    description: "Ferramentas para cronogramas e prazos.",
    toolIds: ["dates"]
  }
];

function LogoIcon() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden">
      <svg viewBox="0 0 100 100" className="w-10 h-10 fill-none">
        {/* Main M Shape - Dark Navy */}
        <path d="M20 80 V25 L50 65 L80 25 V80" stroke="#05192d" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" />
        {/* Green Arrow/Checkmark Detail from logo */}
        <path d="M42 60 L52 75 L85 30" stroke="#10b981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        {/* Pixels/Squares from logo - simplified */}
        <rect x="10" y="45" width="6" height="6" fill="#05192d" opacity="0.6" />
        <rect x="5" y="55" width="4" height="4" fill="#05192d" opacity="0.4" />
        <rect x="15" y="65" width="5" height="5" fill="#10b981" opacity="0.8" />
      </svg>
    </div>
  );
}
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- Main App Component ---
export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const resetNav = () => {
    setActiveTool(null);
    setActiveSegment(null);
  };

  return (
    <div className="min-h-screen bg-[#05192d] font-sans text-white selection-green">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05192d]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div 
              onClick={resetNav}
              className="group flex cursor-pointer items-center gap-3"
            >
              <div className="flex items-center gap-3">
                 <LogoIcon />
                <div className="flex flex-col leading-none">
                  <h1 className="text-xl font-black tracking-tighter text-white">
                    MESTRE
                  </h1>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-emerald-500 uppercase">Digital Grátis</span>
                </div>
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex text-sm">
            {SEGMENTS.slice(0, 5).map((segment, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveSegment(idx);
                  setActiveTool(null);
                }}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  activeSegment === idx && !activeTool ? "text-emerald-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {segment.title}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button 
              className="rounded-full bg-emerald-500 px-6 py-2 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-green-400 active:scale-95"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 z-[70] w-72 bg-[#0A0A0A] p-6 shadow-2xl border-r border-white/10 md:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-white/5">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => { resetNav(); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${!activeTool && !activeSegment ? 'bg-white/5 text-emerald-400' : 'text-slate-400'}`}
                >
                  <Search className="h-5 w-5" />
                  <span className="font-bold">Início</span>
                </button>
                <div className="pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-600 px-3">Categorias</div>
                {SEGMENTS.map((segment, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSegment(idx);
                      setActiveTool(null);
                      setSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                      activeSegment === idx && !activeTool ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-white/5 text-slate-400"
                    }`}
                  >
                    <span className="font-medium">{segment.title}</span>
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!activeTool && activeSegment === null ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="text-center md:text-left max-w-4xl py-10">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-[0.2em] rounded border border-emerald-500/20 uppercase mb-6"
                >
                  100% GRATUITAS • RÁPIDAS • PRÁTICAS
                </motion.span>
                <h2 className="text-6xl font-extrabold tracking-tighter text-white sm:text-8xl leading-[0.85]">
                  MESTRE DIGITAL <br /><span className="text-emerald-500 tracking-tighter uppercase italic text-shadow-glow">GRÁTIS.</span>
                </h2>
                <p className="mt-8 max-w-xl text-xl text-slate-400 leading-relaxed font-medium mx-auto md:mx-0">
                  Soluções digitais inteligentes para facilitar sua rotina. <br />
                  <span className="text-white/40">Escolha um segmento para começar.</span>
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-12">
                {SEGMENTS.map((segment, sIdx) => (
                  <motion.div 
                    key={sIdx} 
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => setActiveSegment(sIdx)}
                    className="group relative cursor-pointer rounded-[2rem] border border-white/5 bg-[#0a1e31] p-8 transition-all hover:border-emerald-500/50 hover:bg-[#0f2a45] shadow-xl"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                       {/* Contextual Icon based on segment */}
                       {sIdx === 0 && <Clock className="h-7 w-7" />}
                       {sIdx === 1 && <Calculator className="h-7 w-7" />}
                       {sIdx === 2 && <Hash className="h-7 w-7" />}
                       {sIdx === 3 && <Type className="h-7 w-7" />}
                       {sIdx === 4 && <Search className="h-7 w-7" />}
                       {sIdx === 5 && <Palette className="h-7 w-7" />}
                       {sIdx === 6 && <RefreshCw className="h-7 w-7" />}
                       {sIdx === 7 && <Info className="h-7 w-7" />}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40">{(sIdx + 1).toString().padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase text-white leading-tight">{segment.title}</h3>
                    <p className="mt-3 text-slate-500 text-sm font-medium leading-relaxed">{segment.description}</p>
                    <div className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver Ferramentas <ChevronRight className="ml-1 h-3 w-3" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : !activeTool && activeSegment !== null ? (
            <motion.div
              key="segment-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <button 
                onClick={() => setActiveSegment(null)}
                className="flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors"
              >
                <ChevronRight className="mr-1 h-4 w-4 rotate-180" /> Voltar ao Início
              </button>

              <div className="max-w-4xl">
                 <div className="flex items-center gap-4 mb-4">
                    <span className="h-1 w-12 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Ferramentas de {SEGMENTS[activeSegment].title}</span>
                 </div>
                 <h2 className="text-5xl font-black tracking-tighter text-white uppercase">{SEGMENTS[activeSegment].title}</h2>
                 <p className="mt-4 text-slate-400 text-lg font-medium">{SEGMENTS[activeSegment].description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SEGMENTS[activeSegment].toolIds.map((toolId) => {
                  const tool = TOOLS.find(t => t.id === toolId);
                  if (!tool) return null;
                  return (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setActiveTool(tool.id as ToolId)}
                      className="group/tool cursor-pointer rounded-3xl border border-white/5 bg-[#0a1e31] p-8 transition-all hover:border-emerald-500/50 hover:bg-[#0f2a45]"
                    >
                      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover/tool:bg-emerald-500 group-hover/tool:text-[#05192d] transition-all">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-white tracking-tight">{tool.name}</h4>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed font-medium">{tool.description}</p>
                      <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-0 group-hover/tool:opacity-100 transition-opacity">
                         Abrir <ChevronRight className="ml-1 h-3 w-3" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tool-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto"
            >
              <button 
                onClick={() => setActiveTool(null)}
                className="mb-8 flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors"
              >
                <ChevronRight className="mr-1 h-4 w-4 rotate-180" /> Voltar para a Categoria
              </button>

              <div className="rounded-3xl border border-white/5 bg-[#14283b] p-6 sm:p-12 shadow-2xl relative overflow-hidden min-h-[400px]">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   {activeTool && (() => {
                     const tool = TOOLS.find(t => t.id === activeTool);
                     return tool ? <tool.icon className="h-48 w-48" /> : null;
                   })()}
                </div>
                <div className="relative z-10">
                  <ToolRenderer id={activeTool as ToolId} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto border-t border-white/5 bg-[#05192d] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-emerald-500 rounded-sm flex items-center justify-center font-bold text-black text-xs">M</div>
              <span className="text-sm font-bold tracking-tight">MESTRE DIGITAL GRÁTIS</span>
            </div>
            <p className="text-xs font-medium text-slate-500">
              © 2026 Mestre Digital. Agilidade e eficiência quando você precisa.
            </p>
            <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-emerald-400 transition-colors">Termos</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Tool Router ---
function ToolRenderer({ id }: { id: ToolId }) {
  switch (id) {
    case "qrcode": return <QRCodeTool />;
    case "hashtags": return <HashtagsTool />;
    case "calc": return <CalculatorTool />;
    case "text": return <TextTool />;
    case "colors": return <ColorTool />;
    case "checklist": return <ChecklistTool />;
    case "hours": return <HoursTool />;
    case "whatsapp": return <WhatsAppTool />;
    case "json": return <JSONTool />;
    case "pomodoro": return <PomodoroTool />;
    case "unit": return <UnitTool />;
    case "dates": return <DatesTool />;
    default: return null;
  }
}

// --- Specific Tools ---

function DatesTool() {
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);

  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Planejamento e Prazos
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Cálculo de Datas</h2>
        <p className="mt-4 text-slate-400 leading-relaxed">Calcule a diferença exata de dias entre duas datas para seus cronogramas.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Data Inicial</label>
            <input 
              type="date" 
              value={date1} 
              onChange={(e) => setDate1(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Data Final</label>
            <input 
              type="date" 
              value={date2} 
              onChange={(e) => setDate2(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl bg-emerald-500 p-10 text-center text-black shadow-xl">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Diferença Total</span>
          <div className="mt-2 text-7xl font-black tracking-tighter">{diffDays}</div>
          <p className="mt-2 font-bold uppercase tracking-widest">Dias</p>
        </div>
      </div>
    </div>
  );
}

function UnitTool() {
  const [val, setVal] = useState(1);
  const [type, setType] = useState<"km-mi" | "kg-lb" | "c-f" | "m-ft" | "l-gal">("km-mi");

  const convert = () => {
    if (type === "km-mi") return (val * 0.621371).toFixed(2) + " mi";
    if (type === "kg-lb") return (val * 2.20462).toFixed(2) + " lb";
    if (type === "c-f") return (val * 9/5 + 32).toFixed(2) + " °F";
    if (type === "m-ft") return (val * 3.28084).toFixed(2) + " ft";
    if (type === "l-gal") return (val * 0.264172).toFixed(2) + " gal";
    return "";
  };

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Utilidades Gerais
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Conversor Universal</h2>
        <p className="mt-4 text-slate-400 leading-relaxed">Converta rapidamente unidades de medida fundamentais para seus projetos e viagens.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tipo de Conversão</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none appearance-none cursor-pointer"
            >
              <option value="km-mi">Kilômetros p/ Milhas</option>
              <option value="kg-lb">Quilos p/ Libras</option>
              <option value="c-f">Celsius p/ Fahrenheit</option>
              <option value="m-ft">Metros p/ Pés</option>
              <option value="l-gal">Litros p/ Galões</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Valor de Entrada</label>
            <input 
              type="number" 
              value={val} 
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center text-black shadow-xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resultado</span>
          <div className="mt-2 text-6xl font-black tracking-tighter">{convert()}</div>
        </div>
      </div>
    </div>
  );
}

function PomodoroTool() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const format = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Foco Máximo
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Timer Pomodoro</h2>
        <p className="mt-4 text-slate-400 leading-relaxed">Aumente sua produtividade usando a técnica de blocos de foco de 25 minutos.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-[40px] bg-[#0A0A0A] p-12 ring-2 ring-emerald-500/20 shadow-2xl">
        <div className="text-[120px] font-black tracking-tighter text-white font-mono leading-none">
          {format(seconds)}
        </div>
        <div className="mt-12 flex gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-12 py-4 rounded-full font-black tracking-widest text-xs uppercase transition-all ${isActive ? "bg-white text-black" : "bg-emerald-500 text-black hover:bg-emerald-400"}`}
          >
            {isActive ? "Pausar" : "Iniciar Foco"}
          </button>
          <button 
            onClick={() => { setSeconds(25 * 60); setIsActive(false); }}
            className="px-8 py-4 rounded-full border border-white/10 text-white font-black tracking-widest text-xs uppercase hover:bg-white/5"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function JSONTool() {
  const [input, setInput] = useState('{"exemplo": "valor", "lista": [1, 2, 3]}');
  const [error, setError] = useState("");

  const format = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj, null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Desenvolvimento
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Formatador JSON</h2>
        <p className="mt-4 text-slate-400">Embeleze e valide seus objetos JSON instantaneamente.</p>
      </div>

      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-80 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 text-emerald-400 font-mono text-sm focus:border-emerald-500 outline-none"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button 
          onClick={format}
          className="w-full sm:w-auto px-12 py-4 bg-white text-black font-black tracking-widest text-xs uppercase rounded-xl hover:bg-emerald-500 transition-colors"
        >
          Formatar JSON
        </button>
        {error && <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Erro: {error}</span>}
      </div>
    </div>
  );
}

function WhatsAppTool() {
  const [num, setNum] = useState("");
  const [msg, setMsg] = useState("");

  const generate = () => {
    const cleanNum = num.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Vendas e Social
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Link WhatsApp</h2>
        <p className="mt-4 text-slate-400">Crie links diretos para conversas no WhatsApp com mensagens personalizadas.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Número (com DDD e DDI)</label>
            <input 
              type="text" 
              value={num} 
              onChange={(e) => setNum(e.target.value)}
              placeholder="Ex: 5511999999999"
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mensagem Inicial</label>
            <textarea 
              value={msg} 
              onChange={(e) => setMsg(e.target.value)}
              className="w-full h-32 rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
              placeholder="Olá, gostaria de saber mais..."
            />
          </div>
          <button 
            onClick={generate}
            className="w-full px-12 py-4 bg-emerald-500 text-black font-black tracking-widest text-xs uppercase rounded-xl hover:bg-emerald-400 transition-colors"
          >
            Gerar e Abrir Link
          </button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl bg-[#0A0A0A] p-10 ring-1 ring-white/10 text-center">
           <ExternalLink className="h-16 w-16 text-emerald-500 mb-6" />
           <p className="text-sm text-slate-400 font-medium">O link será aberto em uma nova aba direto no WhatsApp Web ou App.</p>
        </div>
      </div>
    </div>
  );
}

function HoursTool() {
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("18:00");
  const [breakTime, setBreakTime] = useState("01:00");
  const [hourlyRate, setHourlyRate] = useState(0);

  const calculateTotalMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const startMin = calculateTotalMinutes(start);
  const endMin = calculateTotalMinutes(end);
  const breakMin = calculateTotalMinutes(breakTime);

  let diff = endMin - startMin - breakMin;
  if (diff < 0) diff = 0;

  const totalHours = Math.floor(diff / 60);
  const totalMinutes = diff % 60;
  const earnings = (diff / 60) * hourlyRate;

  return (
    <div className="space-y-12 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Produtividade Profissional
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Calculadora de Horas</h2>
        <p className="mt-4 text-slate-400">Calcule sua jornada de trabalho diária e estime seus ganhos de forma simples.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Início</label>
              <input 
                type="time" 
                value={start} 
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fim</label>
              <input 
                type="time" 
                value={end} 
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Intervalo (Horas:Minutos)</label>
            <input 
              type="time" 
              value={breakTime} 
              onChange={(e) => setBreakTime(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Valor da Hora (Opcional - R$)</label>
            <input 
              type="number" 
              value={hourlyRate || ""} 
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              placeholder="Ex: 50.00"
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-3xl bg-emerald-500 p-8 text-center text-black shadow-lg shadow-emerald-500/20">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Trabalhado</span>
            <div className="mt-2 text-5xl font-black tracking-tighter">
              {totalHours}h {totalMinutes}m
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-50">Líquido (Sem intervalo)</p>
          </div>
          
          {hourlyRate > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-3xl bg-white p-8 text-center text-black shadow-xl"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ganhos Estimados</span>
              <div className="mt-2 text-5xl font-black tracking-tighter">
                R$ {earnings.toFixed(2)}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function QRCodeTool() {
  const [text, setText] = useState("https://seusite.com");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.querySelector("#qr-code-svg") as SVGGraphicsElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      a.click();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#ffffff', '#000000']
      });
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="grid gap-16 md:grid-cols-2">
      <div className="space-y-8">
        <div>
          <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
            Utilidade Instantânea
          </span>
          <h2 className="text-4xl font-extrabold text-white tracking-tighter">Gerador de QR Code</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">Converta links e textos em códigos QR de alta definição para suas campanhas e redes sociais.</p>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Conteúdo do QR Code</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none min-h-[140px] transition-all"
            placeholder="Digite sua URL ou mensagem aqui..."
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] py-4 text-sm font-bold text-white transition-all hover:bg-white/5 active:scale-95"
          >
            {copied ? <Check className="h-5 w-5 text-cyan-400" /> : <Copy className="h-5 w-5" />}
            {copied ? "COPIADO!" : "COPIAR LINK"}
          </button>
          <button 
            onClick={downloadQR}
            className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-white py-4 text-sm font-black text-black transition-all hover:bg-cyan-400 active:scale-95"
          >
            <Download className="h-5 w-5" /> BAIXAR PNG
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-[#0A0A0A] p-10 ring-1 ring-white/10">
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]">
          <QRCodeSVG id="qr-code-svg" value={text} size={280} className="h-full w-full" />
        </div>
        <div className="mt-8 flex items-center gap-2 text-slate-500">
           <Info className="h-4 w-4" />
           <p className="text-xs font-bold tracking-widest uppercase">Scaneie para testar</p>
        </div>
      </div>
    </div>
  );
}

function HashtagsTool() {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      const list = data.hashtags.split(/\s+/).filter((h: string) => h.startsWith("#"));
      setHashtags(list);
      confetti({ 
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#ffffff']
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.join(" "));
    toast();
  };

  const toast = () => {
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Inteligência Artificial
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Gerador de Hashtags</h2>
        <p className="mt-4 text-slate-400 leading-relaxed">Descubra as hashtags virais para o seu nicho e aumente seu alcance organicamente.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row p-2 rounded-2xl bg-[#0A0A0A] ring-1 ring-white/10">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          className="flex-1 rounded-xl bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-600"
          placeholder="Ex: Marketing Digital, DropShipping..."
        />
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-xl bg-cyan-500 px-8 py-4 font-black text-black transition-all hover:bg-cyan-400 disabled:opacity-50 active:scale-95"
        >
          {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : "GERAR AGORA"}
        </button>
      </div>

      {hashtags.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Resultados Otimizados</h3>
            <button onClick={copyAll} className="text-xs font-black text-cyan-400 hover:text-white transition-colors">
              {copiedIdx === -1 ? "COPIADO!" : "COPIAR TODAS"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  navigator.clipboard.writeText(tag);
                  setCopiedIdx(idx);
                  setTimeout(() => setCopiedIdx(null), 1000);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  copiedIdx === idx ? "bg-cyan-500 text-black" : "bg-[#0A0A0A] text-slate-400 border border-white/5 hover:border-cyan-500/50 hover:text-cyan-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function CalculatorTool() {
  const [calcType, setCalcType] = useState<"roi" | "cpc">("roi");

  return (
    <div className="space-y-10">
      <div>
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Financeiro e Performance
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Calculadoras Digitais</h2>
        <div className="mt-8 flex border-b border-white/5">
          <button 
            onClick={() => setCalcType("roi")}
            className={`border-b-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${calcType === "roi" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-500"}`}
          >
            ROI
          </button>
          <button 
            onClick={() => setCalcType("cpc")}
            className={`border-b-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${calcType === "cpc" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-500"}`}
          >
            CPC
          </button>
        </div>
      </div>

      <div className="max-w-xl">
        {calcType === "roi" ? <ROICalculator /> : <CPCCalculator />}
      </div>
    </div>
  );
}

function ROICalculator() {
  const [investment, setInvestment] = useState(1000);
  const [revenue, setRevenue] = useState(2500);

  const roi = ((revenue - investment) / investment) * 100;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Investimento (R$)</label>
          <input 
            type="number" 
            value={investment} 
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-cyan-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Receita (R$)</label>
          <input 
            type="number" 
            value={revenue} 
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-cyan-500 outline-none"
          />
        </div>
      </div>
      <div className="rounded-3xl bg-cyan-500 p-10 text-center shadow-xl shadow-cyan-500/20">
        <span className="text-[10px] font-black text-black/50 uppercase tracking-widest">Retorno sobre Investimento</span>
        <div className="mt-2 text-6xl font-black text-black tracking-tighter">{roi.toFixed(2)}%</div>
      </div>
    </div>
  );
}

function CPCCalculator() {
  const [cost, setCost] = useState(500);
  const [clicks, setClicks] = useState(250);

  const cpc = cost / clicks;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Custo Total (R$)</label>
          <input 
            type="number" 
            value={cost} 
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-cyan-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Nº de Cliques</label>
          <input 
            type="number" 
            value={clicks} 
            onChange={(e) => setClicks(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-cyan-500 outline-none"
          />
        </div>
      </div>
      <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">
        <span className="text-[10px] font-black text-black/50 uppercase tracking-widest">Custo por Clique</span>
        <div className="mt-2 text-6xl font-black text-black tracking-tighter">R$ {cpc.toFixed(2)}</div>
      </div>
    </div>
  );
}

function TextTool() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const capitalize = () => setText(text.split(". ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(". "));

  return (
    <div className="space-y-10">
      <div>
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Redação e Copywriting
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Manipulação de Texto</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Palavras", value: words },
          { label: "Caracteres", value: chars },
          { label: "Estimativa Leitura", value: `${Math.ceil(words / 200)} min` },
          { label: "Nível Densidade", value: words > 500 ? "Alta" : "Ok" }
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 text-center">
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[350px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-white focus:border-cyan-500 outline-none leading-relaxed transition-all"
        placeholder="Cole seu conteúdo estratégico aqui..."
      />
      
      <div className="flex flex-wrap gap-3">
        <button onClick={toUpper} className="px-8 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors">MAIÚSCULAS</button>
        <button onClick={toLower} className="px-8 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors">minúsculas</button>
        <button onClick={capitalize} className="px-8 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors">Sentença Capital.</button>
      </div>
    </div>
  );
}

function ColorTool() {
  const genColor = () => "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  const [colors, setColors] = useState(["#06b6d4", "#0891b2", "#164e63", "#0E7490", "#155E75"]);

  const refresh = () => {
    setColors(colors.map(() => genColor()));
    confetti({ 
      scalar: 0.7, 
      particleCount: 50,
      colors: ['#06b6d4', '#ffffff']
    });
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
            Design e Identidade
          </span>
          <h2 className="text-4xl font-extrabold text-white tracking-tighter">Gerador de Paletas</h2>
          <p className="mt-4 text-slate-400">Harmonias perfeitas para interfaces modernas e minimalistas.</p>
        </div>
        <button 
          onClick={refresh}
          className="flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-black text-black text-xs uppercase tracking-widest transition-all hover:bg-cyan-400 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" /> Nova Paleta
        </button>
      </div>

      <div className="flex flex-col sm:flex-row h-[400px] w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
        {colors.map((c, i) => (
          <div 
            key={i} 
            style={{ backgroundColor: c }}
            className="group relative flex flex-1 flex-col items-center justify-end pb-10 text-white transition-all hover:flex-[1.8]"
          >
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mb-4">
               <span className="text-xs font-black tracking-widest uppercase">{c}</span>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(c);
                confetti({
                  origin: { x: (i + 0.5) / colors.length, y: 0.8 },
                  particleCount: 20,
                  spread: 30,
                  colors: [c]
                });
              }}
              className="rounded-full bg-white text-black p-4 opacity-0 transition-all transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 shadow-xl"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistTool() {
  const [items, setItems] = useState<{id: number, text: string, done: boolean}[]>(() => {
    const saved = localStorage.getItem("checklist-v1");
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Lançamento de Produto Digital", done: false },
      { id: 2, text: "Otimização de Checkout", done: true },
      { id: 3, text: "Escala de Tráfego Pago", done: false }
    ];
  });
  const [newText, setNewText] = useState("");

  useEffect(() => {
    localStorage.setItem("checklist-v1", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newText.trim()) return;
    setItems([...items, { id: Date.now(), text: newText, done: false }]);
    setNewText("");
  };

  const toggle = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
    if (!items.find(i => i.id === id)?.done) {
       confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#06b6d4'] });
    }
  };

  const remove = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-12">
      <div>
        <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
          Organização e Foco
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Checklist de Projetos</h2>
      </div>

      <div className="flex gap-2 p-2 rounded-2xl bg-[#0A0A0A] ring-1 ring-white/10">
        <input 
          type="text" 
          value={newText} 
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="flex-1 bg-transparent p-4 text-white focus:outline-none"
          placeholder="Qual a próxima meta estratégica?"
        />
        <button onClick={addItem} className="rounded-xl bg-white px-8 py-2 font-black text-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors">ADICIONAR</button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`flex items-center gap-6 rounded-2xl p-6 transition-all border border-white/5 ${item.done ? "bg-[#0A0A0A] opacity-40" : "bg-[#1a1a1a] shadow-xl"}`}
          >
            <button 
              onClick={() => toggle(item.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all ${item.done ? "bg-cyan-500 border-cyan-500" : "border-white/10"}`}
            >
              {item.done && <Check className="h-5 w-5 text-black" />}
            </button>
            <span className={`flex-1 font-bold tracking-tight text-lg ${item.done ? "line-through text-slate-500" : "text-white"}`}>
              {item.text}
            </span>
            <button onClick={() => remove(item.id)} className="text-slate-700 hover:text-red-500 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
