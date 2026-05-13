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
  Clock,
  Shield,
  Sparkles,
  Repeat,
  Code,
  SortAsc,
  Percent,
  TrendingUp,
  Banknote,
  Calendar,
  Palmtree,
  Globe,
  Heart,
  Scale,
  Flower2,
  Baby,
  Dog,
  Cat,
  Instagram,
  Thermometer,
  Scroll,
  Zap,
  Barcode as BarcodeIcon,
  Users
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
const CaseConverterTool = lazy(() => import("./components/tools/CaseConverterTool"));
const PasswordTool = lazy(() => import("./components/tools/PasswordTool"));
const AccentRemoverTool = lazy(() => import("./components/tools/AccentRemoverTool"));
const SpellCheckerTool = lazy(() => import("./components/tools/SpellCheckerTool"));
const TextInverterTool = lazy(() => import("./components/tools/TextInverterTool"));
const HtmlConverterTool = lazy(() => import("./components/tools/HtmlConverterTool"));
const AlphabeticalSorterTool = lazy(() => import("./components/tools/AlphabeticalSorterTool"));
const NumberToWordsTool = lazy(() => import("./components/tools/NumberToWordsTool"));
const PercentageCalculatorTool = lazy(() => import("./components/tools/PercentageCalculatorTool"));
const InterestCalculatorTool = lazy(() => import("./components/tools/InterestCalculatorTool"));
const NetSalaryCalculatorTool = lazy(() => import("./components/tools/NetSalaryCalculatorTool"));
const InssCalculatorTool = lazy(() => import("./components/tools/InssCalculatorTool"));
const ThirteenthSalaryCalculatorTool = lazy(() => import("./components/tools/ThirteenthSalaryCalculatorTool"));
const VacationCalculatorTool = lazy(() => import("./components/tools/VacationCalculatorTool"));
const OvertimeCalculatorTool = lazy(() => import("./components/tools/OvertimeCalculatorTool"));
const CurrencyConverterTool = lazy(() => import("./components/tools/CurrencyConverterTool"));
const BmiCalculatorTool = lazy(() => import("./components/tools/BmiCalculatorTool"));
const IdealWeightCalculatorTool = lazy(() => import("./components/tools/IdealWeightCalculatorTool"));
const MenstrualCycleTool = lazy(() => import("./components/tools/MenstrualCycleTool"));
const PregnancyCalculatorTool = lazy(() => import("./components/tools/PregnancyCalculatorTool"));
const DogAgeCalculatorTool = lazy(() => import("./components/tools/DogAgeCalculatorTool"));
const CatAgeCalculatorTool = lazy(() => import("./components/tools/CatAgeCalculatorTool"));
const TemperatureConverterTool = lazy(() => import("./components/tools/TemperatureConverterTool"));
const RomanNumeralsTool = lazy(() => import("./components/tools/RomanNumeralsTool"));
const EnergyVolumeConverterTool = lazy(() => import("./components/tools/EnergyVolumeConverterTool"));
const BarcodeTool = lazy(() => import("./components/tools/BarcodeTool"));
const MockDataTool = lazy(() => import("./components/tools/MockDataTool"));
const InstagramBioTool = lazy(() => import("./components/tools/InstagramBioTool"));
const CPFValidatorTool = lazy(() => import("./components/tools/CPFValidatorTool"));

// --- Types ---
type ToolId = "qrcode" | "hashtags" | "calc" | "text" | "colors" | "checklist" | "hours" | "whatsapp" | "json" | "pomodoro" | "unit" | "dates" | "lorem" | "case" | "password" | "accents" | "spelling" | "inverter" | "html" | "sort" | "words" | "percent" | "interest" | "netsalary" | "inss" | "thirteenth" | "vacation" | "overtime" | "currency" | "bmi" | "idealweight" | "menstrual" | "pregnancy" | "dogage" | "catage" | "temperature" | "roman" | "energyvolume" | "barcode" | "mockdata" | "instagrambio" | "cpf";

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
  { id: "text", name: "Contador de Texto e Caracteres", description: "Contagem e transformação", icon: Type, color: "bg-emerald-500" },
  { id: "colors", name: "Paletas", description: "Cores e Harmonias", icon: Palette, color: "bg-emerald-500" },
  { id: "checklist", name: "Checklist", description: "Gestão de tarefas", icon: CheckSquare, color: "bg-emerald-500" },
  { id: "hours", name: "Horas", description: "Jornada de trabalho", icon: Clock, color: "bg-emerald-500" },
  { id: "whatsapp", name: "WhatsApp", description: "Link direto p/ Whats", icon: ExternalLink, color: "bg-emerald-500" },
  { id: "json", name: "JSON", description: "Formatador e Validador", icon: Search, color: "bg-emerald-500" },
  { id: "pomodoro", name: "Pomodoro", description: "Foco e Produtividade", icon: Clock, color: "bg-emerald-500" },
  { id: "unit", name: "Unidades", description: "Conversor universal", icon: RefreshCw, color: "bg-emerald-500" },
  { id: "dates", name: "Datas", description: "Cálculo entre dias", icon: Info, color: "bg-emerald-500" },
  { id: "lorem", name: "Lorem Ipsum", description: "Gerador de preenchimento", icon: Type, color: "bg-emerald-500" },
  { id: "case", name: "Conversor de Letras", description: "Maiúsculas e minúsculas", icon: Type, color: "bg-emerald-500" },
  { id: "password", name: "Gerador de Senha", description: "Segurança avançada", icon: Shield, color: "bg-emerald-500" },
  { id: "accents", name: "Removedor de Acentos", description: "Limpeza de caracteres", icon: Type, color: "bg-emerald-500" },
  { id: "spelling", name: "Corretor IA", description: "Ortografia e Gramática", icon: Sparkles, color: "bg-emerald-500" },
  { id: "inverter", name: "Inversor de Texto", description: "Inverter letras e palavras", icon: Repeat, color: "bg-emerald-500" },
  { id: "html", name: "Conversor HTML", description: "Entidades e Tags HTML", icon: Code, color: "bg-emerald-500" },
  { id: "sort", name: "Ordenador Alfabético", description: "Organizar listas e nomes", icon: SortAsc, color: "bg-emerald-500" },
  { id: "words", name: "Número Extenso", description: "Escrever valores e moedas", icon: Hash, color: "bg-emerald-500" },
  { id: "percent", name: "Porcentagem", description: "Cálculos e variações", icon: Percent, color: "bg-emerald-500" },
  { id: "interest", name: "Juros Simples/Comp.", description: "Projeções Financeiras", icon: TrendingUp, color: "bg-emerald-500" },
  { id: "netsalary", name: "Salário Líquido", description: "Cálculo de CLT e Descontos", icon: Banknote, color: "bg-emerald-500" },
  { id: "inss", name: "INSS 2024/2025", description: "Contribuição e Alíquotas", icon: Shield, color: "bg-emerald-500" },
  { id: "thirteenth", name: "Décimo Terceiro", description: "Cálculo de 13º Salário", icon: Calendar, color: "bg-emerald-500" },
  { id: "vacation", name: "Cálculo de Férias", description: "Recibo e Terço Const.", icon: Palmtree, color: "bg-emerald-500" },
  { id: "overtime", name: "Horas Extras", description: "Cálculo de Adicionais", icon: Clock, color: "bg-emerald-500" },
  { id: "currency", name: "Conversor de Moedas", description: "Câmbio em tempo real", icon: Globe, color: "bg-emerald-500" },
  { id: "bmi", name: "Cálculo de IMC", description: "Saúde e Peso Ideal", icon: Heart, color: "bg-rose-500" },
  { id: "idealweight", name: "Peso Ideal Médio", description: "Metas de saúde e fórmulas", icon: Scale, color: "bg-rose-500" },
  { id: "menstrual", name: "Ciclo Menstrual", description: "Calendário e Fertilidade", icon: Flower2, color: "bg-rose-500" },
  { id: "pregnancy", name: "Calculadora Gestacional", description: "Idade e Milestones", icon: Baby, color: "bg-rose-500" },
  { id: "dogage", name: "Idade Humana (Pet)", description: "Cálculo por porte e idade", icon: Dog, color: "bg-rose-500" },
  { id: "catage", name: "Idade Humana (Gato)", description: "Projeção de anos felinos", icon: Cat, color: "bg-rose-500" },
  { id: "temperature", name: "Temperatura", description: "Conversores e Sensação Térmica", icon: Thermometer, color: "bg-orange-500" },
  { id: "roman", name: "Números Romanos", description: "Decimal p/ Romano e vice-versa", icon: Scroll, color: "bg-amber-500" },
  { id: "energyvolume", name: "Energia & Volume", description: "Conversões técnicas e físicas", icon: Zap, color: "bg-indigo-500" },
  { id: "barcode", name: "Código de Barras", description: "Gerador multi-formato", icon: BarcodeIcon, color: "bg-blue-500" },
  { id: "mockdata", name: "Dados Fictícios", description: "Massa de teste e perfis", icon: Users, color: "bg-blue-500" },
  { id: "instagrambio", name: "Bios Instagram", description: "Ideias e fontes especiais", icon: Instagram, color: "bg-pink-500" },
  { id: "cpf", name: "Validador de CPF", description: "Verificação e região fiscal", icon: Shield, color: "bg-blue-500" },
];

const SEGMENTS = [
  {
    title: "Produtividade",
    description: "Organize sua rotina e maximize seu tempo.",
    toolIds: ["hours", "checklist", "pomodoro"],
    color: "cyan-500"
  },
  {
    title: "Financeiro",
    description: "Controle de investimentos e métricas de performance.",
    toolIds: ["calc", "percent", "interest", "netsalary", "inss", "thirteenth", "vacation", "overtime", "currency"],
    color: "emerald-500"
  },
  {
    title: "Social e Marketing",
    description: "Gere visibilidade e conexões rápidas.",
    toolIds: ["qrcode", "barcode", "instagrambio", "hashtags", "whatsapp"],
    color: "pink-500"
  },
  {
    title: "Texto e Escrita",
    description: "Ferramentas para redação e copywriting.",
    toolIds: ["text", "lorem", "case", "accents", "spelling", "inverter", "html", "sort", "words"],
    color: "amber-500"
  },
  {
    title: "Técnico e Dev",
    description: "Utilitários essenciais para desenvolvedores.",
    toolIds: ["json", "mockdata"],
    color: "indigo-500"
  },
  {
    title: "Web Design e Imagem",
    description: "Crie identidades visuais impactantes.",
    toolIds: ["colors"],
    color: "violet-500"
  },
  {
    title: "Utilidades",
    description: "Conversores e cálculos gerais do dia a dia.",
    toolIds: ["unit", "password", "roman", "energyvolume", "cpf"],
    color: "blue-500"
  },
  {
    title: "Planejamento",
    description: "Ferramentas para cronogramas e prazos.",
    toolIds: ["dates"],
    color: "orange-500"
  },
  {
    title: "Saúde",
    description: "Monitore seu bem-estar e indicadores físicos.",
    toolIds: ["bmi", "idealweight", "menstrual", "pregnancy", "dogage", "catage", "temperature"],
    color: "rose-500"
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
                  activeSegment === idx && !activeTool ? "" : "text-slate-400 hover:text-white"
                }`}
                style={activeSegment === idx && !activeTool ? { color: `var(--color-${segment.color})` } : {}}
              >
                {segment.title}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a 
              href="https://www.instagram.com/mestreferramentasdigitaisfree/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex rounded-full bg-white/5 p-2 text-slate-400 hover:bg-emerald-500 hover:text-black transition-all"
              title="Siga-nos no Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
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
                      activeSegment === idx && !activeTool ? "" : "hover:bg-white/5 text-slate-400"
                    }`}
                    style={activeSegment === idx && !activeTool ? { 
                      backgroundColor: `color-mix(in srgb, var(--color-${segment.color}) 10%, transparent)`,
                      color: `var(--color-${segment.color})` 
                    } : {}}
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
                {SEGMENTS.map((segment, sIdx) => {
                  return (
                    <motion.div 
                      key={sIdx} 
                      whileHover={{ y: -10, scale: 1.02 }}
                      onClick={() => setActiveSegment(sIdx)}
                      className="group relative cursor-pointer rounded-[2rem] border border-white/5 p-8 transition-all shadow-xl hover:shadow-2xl"
                      style={{ 
                         backgroundColor: `color-mix(in srgb, var(--color-${segment.color}) 3%, #05192d)`
                      }}
                    >
                      {/* Using unique hover border color based on segment color */}
                      <div 
                        className="absolute inset-0 rounded-[2rem] border border-transparent group-hover:border-current transition-colors pointer-events-none opacity-50" 
                        style={{ color: `var(--color-${segment.color})` }}
                      />
                      
                      <div 
                        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:bg-current group-hover:text-black"
                        style={{ 
                          backgroundColor: `color-mix(in srgb, var(--color-${segment.color}) 10%, transparent)`,
                          color: `var(--color-${segment.color})`
                        }}
                      >
                         {/* Contextual Icon based on segment */}
                         {sIdx === 0 && <Clock className="h-7 w-7" />}
                         {sIdx === 1 && <Calculator className="h-7 w-7" />}
                         {sIdx === 2 && <Hash className="h-7 w-7" />}
                         {sIdx === 3 && <Type className="h-7 w-7" />}
                         {sIdx === 4 && <Search className="h-7 w-7" />}
                         {sIdx === 5 && <Palette className="h-7 w-7" />}
                         {sIdx === 6 && <RefreshCw className="h-7 w-7" />}
                         {sIdx === 7 && <Info className="h-7 w-7" />}
                         {sIdx === 8 && <Heart className="h-7 w-7" />}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                         <span 
                           className="text-[10px] font-black uppercase tracking-widest opacity-40"
                           style={{ color: `var(--color-${segment.color})` }}
                         >
                            {(sIdx + 1).toString().padStart(2, '0')}
                         </span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter uppercase text-white leading-tight">{segment.title}</h3>
                      <p className="mt-3 text-slate-500 text-sm font-medium leading-relaxed">{segment.description}</p>
                      <div 
                        className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: `var(--color-${segment.color})` }}
                      >
                          Ver Ferramentas <ChevronRight className="ml-1 h-3 w-3" />
                      </div>
                    </motion.div>
                  );
                })}
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
                    <span 
                      className="h-1 w-12 rounded-full" 
                      style={{ backgroundColor: `var(--color-${SEGMENTS[activeSegment].color})` }}
                    />
                    <span 
                      className="text-xs font-black uppercase tracking-[0.3em]"
                      style={{ color: `var(--color-${SEGMENTS[activeSegment].color})` }}
                    >
                      Ferramentas de {SEGMENTS[activeSegment].title}
                    </span>
                 </div>
                 <h2 className="text-5xl font-black tracking-tighter text-white uppercase">{SEGMENTS[activeSegment].title}</h2>
                 <p className="mt-4 text-slate-400 text-lg font-medium">{SEGMENTS[activeSegment].description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SEGMENTS[activeSegment].toolIds.map((toolId) => {
                  const tool = TOOLS.find(t => t.id === toolId);
                  if (!tool) return null;
                  const segmentColor = SEGMENTS[activeSegment].color;
                  return (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setActiveTool(tool.id as ToolId)}
                      className="group/tool cursor-pointer rounded-3xl border border-white/5 p-8 transition-all shadow-lg hover:shadow-2xl"
                      style={{ 
                        borderColor: `color-mix(in srgb, var(--color-${segmentColor}) 20%, transparent)`,
                        backgroundColor: `color-mix(in srgb, var(--color-${segmentColor}) 3%, #05192d)`
                      } as any}
                    >
                      <div 
                        className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover/tool:bg-current group-hover/tool:text-[#05192d]"
                        style={{ 
                          backgroundColor: `color-mix(in srgb, var(--color-${segmentColor}) 10%, transparent)`,
                          color: `var(--color-${segmentColor})`
                        }}
                      >
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-white tracking-tight">{tool.name}</h4>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed font-medium">{tool.description}</p>
                      <div 
                        className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/tool:opacity-100 transition-opacity"
                        style={{ color: `var(--color-${segmentColor})` }}
                      >
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
            <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest items-center">
              <a 
                href="https://www.instagram.com/mestreferramentasdigitaisfree/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Termos</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacidade</a>
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
          case "case": return <CaseConverterTool />;
          case "password": return <PasswordTool />;
          case "accents": return <AccentRemoverTool />;
          case "spelling": return <SpellCheckerTool />;
          case "inverter": return <TextInverterTool />;
          case "html": return <HtmlConverterTool />;
          case "sort": return <AlphabeticalSorterTool />;
          case "words": return <NumberToWordsTool />;
          case "percent": return <PercentageCalculatorTool />;
          case "interest": return <InterestCalculatorTool />;
          case "netsalary": return <NetSalaryCalculatorTool />;
          case "inss": return <InssCalculatorTool />;
          case "thirteenth": return <ThirteenthSalaryCalculatorTool />;
          case "vacation": return <VacationCalculatorTool />;
          case "overtime": return <OvertimeCalculatorTool />;
          case "currency": return <CurrencyConverterTool />;
          case "bmi": return <BmiCalculatorTool />;
          case "idealweight": return <IdealWeightCalculatorTool />;
          case "menstrual": return <MenstrualCycleTool />;
          case "pregnancy": return <PregnancyCalculatorTool />;
          case "dogage": return <DogAgeCalculatorTool />;
          case "catage": return <CatAgeCalculatorTool />;
          case "temperature": return <TemperatureConverterTool />;
          case "roman": return <RomanNumeralsTool />;
          case "energyvolume": return <EnergyVolumeConverterTool />;
          case "barcode": return <BarcodeTool />;
          case "mockdata": return <MockDataTool />;
          case "instagrambio": return <InstagramBioTool />;
          case "cpf": return <CPFValidatorTool />;
          default: return null;
        }
      })()}
    </Suspense>
  );
}
