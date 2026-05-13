import { useState, useEffect, lazy, Suspense } from "react";
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
  RefreshCw,
  Search,
  ExternalLink,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Lazy loaded tool components ---
const QRCodeTool = lazy(() => import("./components/tools/QRCodeTool"));
const HashtagsTool = lazy(() => import("./components/tools/HashtagsTool"));
const CalculatorTool = lazy(() => import("./components/tools/CalculatorTool"));
const TextTool = lazy(() => import("./components/tools/TextTool"));
const ColorTool = lazy(() => import("./components/tools/ColorTool"));
const ChecklistTool = lazy(() => import("./components/tools/ChecklistTool"));
const HoursTool = lazy(() => import("./components/tools/HoursTool"));
const WhatsAppTool = lazy(() => import("./components/tools/WhatsAppTool"));
const JSONTool = lazy(() => import("./components/tools/JSONTool"));
const PomodoroTool = lazy(() => import("./components/tools/PomodoroTool"));
const UnitTool = lazy(() => import("./components/tools/UnitTool"));
const DatesTool = lazy(() => import("./components/tools/DatesTool"));
const LoremIpsumTool = lazy(() => import("./components/tools/LoremIpsumTool"));

// --- Types ---
type ToolId = "qrcode" | "hashtags" | "calc" | "text" | "colors" | "checklist" | "hours" | "whatsapp" | "json" | "pomodoro" | "unit" | "dates" | "lorem";

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
  { id: "lorem", name: "Lorem Ipsum", description: "Gerador de preenchimento", icon: Type, color: "bg-emerald-500" },
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
    toolIds: ["text", "lorem"]
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
  const LoadingPlaceholder = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
      <span className="text-xs font-black uppercase tracking-widest text-slate-500">Carregando Ferramenta...</span>
    </div>
  );

  return (
    <Suspense fallback={<LoadingPlaceholder />}>
      {(() => {
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
          case "lorem": return <LoremIpsumTool />;
          default: return null;
        }
      })()}
    </Suspense>
  );
}
