import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { 
  QrCode, 
  Hash, 
  Calculator, 
  Brush,
  Type, 
  Palette, 
  Image as ImageIcon,
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
  DollarSign,
  Tag,
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
  Users,
  Building2,
  CreditCard,
  Timer,
  UserCheck,
  ShieldCheck,
  Flame,
  Utensils,
  Droplets,
  Trophy,
  CircleCheck,
  ShoppingCart,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link } from "react-router-dom";

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
const CNPJValidatorTool = lazy(() => import("./components/tools/CNPJValidatorTool"));
const CreditCardTool = lazy(() => import("./components/tools/CreditCardTool"));
const BoletoTool = lazy(() => import("./components/tools/BoletoTool"));
const WorldClockTool = lazy(() => import("./components/tools/WorldClockTool"));
const StopwatchTool = lazy(() => import("./components/tools/StopwatchTool"));
const TimerTool = lazy(() => import("./components/tools/TimerTool"));
const ContrastSimulatorTool = lazy(() => import("./components/tools/ContrastSimulatorTool"));
const ColorPaletteTool = lazy(() => import("./components/tools/ColorPaletteTool"));
const ImageColorPickerTool = lazy(() => import("./components/tools/ImageColorPickerTool"));
const FontIdentifierTool = lazy(() => import("./components/tools/FontIdentifierTool"));
const SmartChecklistTool = lazy(() => import("./components/tools/SmartChecklistTool"));
const LoanCalculatorTool = lazy(() => import("./components/tools/LoanCalculatorTool"));
const DiscountCalculatorTool = lazy(() => import("./components/tools/DiscountCalculatorTool"));
const ProfitMarginCalculatorTool = lazy(() => import("./components/tools/ProfitMarginCalculatorTool"));
const SellingPriceCalculatorTool = lazy(() => import("./components/tools/SellingPriceCalculatorTool"));
const CommissionCalculatorTool = lazy(() => import("./components/tools/CommissionCalculatorTool"));
const EmergencyFundSimulatorTool = lazy(() => import("./components/tools/EmergencyFundSimulatorTool"));
const CalorieCalculatorTool = lazy(() => import("./components/tools/CalorieCalculatorTool"));
const WaterConsumptionCalculatorTool = lazy(() => import("./components/tools/WaterConsumptionCalculatorTool"));
const RunningPaceCalculatorTool = lazy(() => import("./components/tools/RunningPaceCalculatorTool"));
const EventChecklistTool = lazy(() => import("./components/tools/EventChecklistTool"));
const SmartShoppingListTool = lazy(() => import("./components/tools/SmartShoppingListTool"));
const ColorConverterTool = lazy(() => import("./components/tools/ColorConverterTool"));
const BrandNameGeneratorTool = lazy(() => import("./components/tools/BrandNameGeneratorTool"));

// --- Types ---
type ToolId = "qrcode" | "hashtags" | "calc" | "text" | "colors" | "checklist" | "hours" | "whatsapp" | "json" | "pomodoro" | "unit" | "dates" | "lorem" | "case" | "password" | "accents" | "spelling" | "inverter" | "html" | "sort" | "words" | "percent" | "interest" | "netsalary" | "inss" | "thirteenth" | "vacation" | "overtime" | "currency" | "bmi" | "idealweight" | "menstrual" | "pregnancy" | "dogage" | "catage" | "temperature" | "roman" | "energyvolume" | "barcode" | "mockdata" | "instagrambio" | "cpf" | "cnpj" | "creditcard" | "boleto" | "worldclock" | "stopwatch" | "timer" | "contrast" | "palette" | "imagecolor" | "font" | "smart-checklist" | "loan" | "discount" | "profit-margin" | "selling-price" | "commission" | "emergency-fund" | "daily-calories" | "water-consumption" | "running-pace" | "event-checklist" | "smart-shopping-list" | "color-converter" | "brand-name-generator";

interface Tool {
  id: ToolId;
  name: string;
  slug: string;
  description: string;
  icon: any;
  color: string;
}

const slugify = (text: string) => 
  text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const TOOLS: Tool[] = [
  { id: "qrcode", name: "Gerador de QR Code Online", description: "Crie códigos QR gratuitos para links, Wi-Fi, WhatsApp e muito mais rapidamente.", icon: QrCode, color: "bg-emerald-500" },
  { id: "hashtags", name: "Gerador de Hashtags com IA", description: "Encontre as hashtags mais virais para Instagram, TikTok e redes sociais usando inteligência artificial.", icon: Hash, color: "bg-emerald-500" },
  { id: "calc", name: "Calculadora de Marketing e ROI", description: "Calcule métricas essenciais como ROI, CPC, CTR e performance de campanhas digitais.", icon: Calculator, color: "bg-emerald-500" },
  { id: "text", name: "Contador de Caracteres e Palavras", description: "Ferramenta online para contagem de texto, caracteres e análise de densidade de palavras.", icon: Type, color: "bg-emerald-500" },
  { id: "colors", name: "Gerador de Paleta de Cores", description: "Crie harmonias, extraia cores de imagens e gere paletas modernas para web design.", icon: Palette, color: "bg-emerald-500" },
  { id: "checklist", name: "Checklist Online e Gestão", description: "Organize suas tarefas diárias com uma lista de afazeres simples e eficiente.", icon: CheckSquare, color: "bg-emerald-500" },
  { id: "hours", name: "Calculadora de Horas Trabalhadas", description: "Calcule sua jornada, somando e subtraindo horas de trabalho de forma automática.", icon: Clock, color: "bg-emerald-500" },
  { id: "whatsapp", name: "Gerador de Link de WhatsApp", description: "Crie links diretos para seu número do WhatsApp com mensagem personalizada grátis.", icon: ExternalLink, color: "bg-emerald-500" },
  { id: "json", name: "Formatador e Validador de JSON", description: "Ferramenta para formatar, validar e indentar códigos JSON para desenvolvedores.", icon: Search, color: "bg-emerald-500" },
  { id: "pomodoro", name: "Timer Pomodoro Online", description: "Aumente sua produtividade usando a técnica Pomodoro para foco e gestão de tempo.", icon: Clock, color: "bg-emerald-500" },
  { id: "unit", name: "Conversor de Unidades Universal", description: "Conversão de medidas de comprimento, massa, temperatura e volume em um só lugar.", icon: RefreshCw, color: "bg-emerald-500" },
  { id: "dates", name: "Calculadora de Intervalo entre Datas", description: "Saiba quantos dias, meses ou anos existem entre duas datas específicas.", icon: Info, color: "bg-emerald-500" },
  { id: "lorem", name: "Gerador de Lorem Ipsum Online", description: "Gere textos de marcação (placeholder) para layouts e designs com personalização.", icon: Type, color: "bg-emerald-500" },
  { id: "case", name: "Conversor de Letras (Maiúsculas/Minúsculas)", description: "Mude textos para maiúsculas, minúsculas ou título capitalizado instantaneamente.", icon: Type, color: "bg-emerald-500" },
  { id: "password", name: "Gerador de Senha Segura", description: "Crie senhas fortes e aleatórias para proteger suas contas e redes sociais.", icon: Shield, color: "bg-emerald-500" },
  { id: "accents", name: "Removedor de Acentos Online", description: "Limpe acentuação e caracteres especiais de textos para sistemas e códigos.", icon: Type, color: "bg-emerald-500" },
  { id: "spelling", name: "Corretor Ortográfico com IA", description: "Verifique e corrija gramática e ortografia de textos em português com auxílio de IA.", icon: Sparkles, color: "bg-emerald-500" },
  { id: "inverter", name: "Inversor de Texto e Palavras", description: "Inverta a ordem das letras ou das palavras de qualquer frase online.", icon: Repeat, color: "bg-emerald-500" },
  { id: "html", name: "Conversor de Entidades HTML", description: "Codifique ou decodifique caracteres especiais e tags HTML de forma simples.", icon: Code, color: "bg-emerald-500" },
  { id: "sort", name: "Ordenador de Listas Alfabético", description: "Coloque listas de nomes, produtos ou tarefas em ordem alfabética automaticamente.", icon: SortAsc, color: "bg-emerald-500" },
  { id: "words", name: "Conversor de Número para Extenso", description: "Transforme valores numéricos em palavras, ideal para cheques e documentos.", icon: Hash, color: "bg-emerald-500" },
  { id: "percent", name: "Calculadora de Porcentagem", description: "Calcule descontos, aumentos e variações percentuais de forma fácil e rápida.", icon: Percent, color: "bg-emerald-500" },
  { id: "interest", name: "Calculadora de Juros Simples e Compostos", description: "Simule rendimentos financeiros e projeções de juros para investimentos.", icon: TrendingUp, color: "bg-emerald-500" },
  { id: "netsalary", name: "Calculadora de Salário Líquido CLT", description: "Simule seu salário líquido após descontos de INSS, IRRF e benefícios.", icon: Banknote, color: "bg-emerald-500" },
  { id: "inss", name: "Calculadora de INSS 2024/2025", description: "Veja quanto será descontado da sua folha de pagamento para a previdência social.", icon: Shield, color: "bg-emerald-500" },
  { id: "thirteenth", name: "Calculadora de Décimo Terceiro Salário", description: "Saiba o valor das parcelas do seu 13º salário com base no tempo trabalhado.", icon: Calendar, color: "bg-emerald-500" },
  { id: "vacation", name: "Calculadora de Férias e 1/3 Constitucional", description: "Calcule o valor bruto e líquido das suas férias com o terço constitucional.", icon: Palmtree, color: "bg-emerald-500" },
  { id: "overtime", name: "Calculadora de Horas Extras Online", description: "Contabilize quanto você deve receber por horas adicionais trabalhadas no mês.", icon: Clock, color: "bg-emerald-500" },
  { id: "currency", name: "Conversor de Moedas e Câmbio", description: "Câmbio comercial de Dólar, Euro e outras moedas em tempo real para o Real.", icon: Globe, color: "bg-emerald-500" },
  { id: "bmi", name: "Calculadora de IMC Grátis", description: "Calcule seu Índice de Massa Corporal e saiba se você está no seu peso ideal.", icon: Heart, color: "bg-rose-500" },
  { id: "idealweight", name: "Simulador de Peso Ideal Online", description: "Descubra qual a faixa de peso saudável recomendada para sua altura e idade.", icon: Scale, color: "bg-rose-500" },
  { id: "menstrual", name: "Calendário do Ciclo Menstrual", description: "Acompanhe seu ciclo, preveja menstruação e saiba seus dias férteis e ovulação.", icon: Flower2, color: "bg-rose-500" },
  { id: "pregnancy", name: "Calculadora de Gravidez e Gestação", description: "Calcule a idade gestacional e a data provável do parto (DPP) com precisão.", icon: Baby, color: "bg-rose-500" },
  { id: "dogage", name: "Calculadora de Idade Canina (Cachorro)", description: "Converta os anos do seu cão em idade humana de acordo com o porte e raça.", icon: Dog, color: "bg-rose-500" },
  { id: "catage", name: "Calculadora de Idade Felina (Gato)", description: "Saiba quantos 'anos humanos' o seu gato tem com base na idade real dele.", icon: Cat, color: "bg-rose-500" },
  { id: "temperature", name: "Conversor de Temperatura Online", description: "Transforme Celsius em Fahrenheit ou Kelvin e vice-versa instantaneamente.", icon: Thermometer, color: "bg-orange-500" },
  { id: "roman", name: "Conversor de Números Romanos", description: "Transforme algarismos decimais em romanos e aprenda a numeração antiga.", icon: Scroll, color: "bg-amber-500" },
  { id: "energyvolume", name: "Conversor de Energia e Volume", description: "Conversões técnicas de unidades físicas para engenharia e uso doméstico.", icon: Zap, color: "bg-indigo-500" },
  { id: "barcode", name: "Gerador de Código de Barras Online", description: "Crie códigos de barras em diversos formatos para produtos e etiquetas grátis.", icon: BarcodeIcon, color: "bg-blue-500" },
  { id: "mockdata", name: "Gerador de Dados para Testes (Fakes)", description: "Crie massa de dados fictícios, nomes, e-mails e perfis para desenvolvimento.", icon: Users, color: "bg-blue-500" },
  { id: "instagrambio", name: "Gerador de Bios para Instagram", description: "Crie biografias criativas e use fontes especiais para destacar seu perfil.", icon: Instagram, color: "bg-pink-500" },
  { id: "cpf", name: "Validador de CPF e Origem Fiscal", description: "Verifique se um CPF é válido e descubra o estado de origem da emissão.", icon: Shield, color: "bg-blue-500" },
  { id: "cnpj", name: "Validador de CNPJ Grátis", description: "Validação matemática de CNPJ, gerador para testes e processamento em lote.", icon: Building2, color: "bg-blue-500" },
  { id: "creditcard", name: "Validador de Cartão de Crédito", description: "Verifique a validade (Luhn), bandeira e gere números de cartão para testes.", icon: CreditCard, color: "bg-blue-500" },
  { id: "boleto", name: "Decodificador e Validador de Boleto", description: "Consulte data de vencimento, valor e banco de boletos bancários online.", icon: BarcodeIcon, color: "bg-amber-500" },
  { id: "worldclock", name: "Relógio Mundial Digital", description: "Acompanhe fusos horários globais, horários de verão e diferenças de tempo.", icon: Globe, color: "bg-indigo-500" },
  { id: "stopwatch", name: "Cronômetro de Alta Precisão", description: "Cronometre seu tempo com designs clássicos, divertidos e cyber, salvando voltas.", icon: Timer, color: "bg-cyan-500" },
  { id: "timer", name: "Timer Regressivo Personalizável", description: "Programe alertas, foque em tarefas e escolha entre temas divertidos e clássicos.", icon: Clock, color: "bg-cyan-500" },
  { id: "contrast", name: "Simulador de Contraste WCAG", description: "Verifique a acessibilidade das cores do seu site com testes AA e AAA em tempo real.", icon: Palette, color: "bg-indigo-500" },
  { id: "palette", name: "Paletas com Simulador de Daltonismo", description: "Gere harmonia de cores e visualize como diferentes tipos de daltonismo afetam seu design.", icon: Brush, color: "bg-violet-500" },
  { id: "imagecolor", name: "Extrator de Cores de Imagem: Crie Paletas de Fotos", description: "Envie sua imagem e extraia cores instantaneamente. Descubra códigos HEX, RGB e crie paletas profissionais a partir de fotos e artes.", icon: ImageIcon, color: "bg-rose-500" },
  { id: "font", name: "Identificador de Fontes em Imagens: What Font?", description: "Descubra qual fonte está em uma imagem ou screenshot. Identificação visual de tipografias e sugestão de fontes similares gratuitas.", icon: Search, color: "bg-indigo-500" },
  { id: "smart-checklist", name: "Checklist Inteligente: Gerador de Listas Nichadas", description: "Crie checklists personalizados para SEO, Viagens, Compras e Startups. Organize tarefas com designs exclusivos e modelos otimizados.", icon: CheckSquare, color: "bg-emerald-500" },
  { id: "loan", name: "Calculadora de Parcelas de Empréstimo: Versões Nichadas", description: "Simule financiamentos de imóveis, veículos e pessoal. Calcule parcelas, taxas de juros e o custo total com designs profissionais e divertidos.", icon: DollarSign, color: "bg-emerald-500" },
  { id: "discount", name: "Calculadora de Desconto Online: Varejo e Liquidação", description: "Calcule descontos porcentuais, cupons acumulativos e economia real. Versões para e-commerce e varejo físico com design personalizável.", icon: Tag, color: "bg-rose-500" },
  { id: "profit-margin", name: "Calculadora de Margem de Lucro: Markup e Lucro Líquido", description: "Calcule margem operacional, markup e lucro líquido para varejo, SaaS e indústria. Tome decisões de precificação baseadas em dados reais.", icon: TrendingUp, color: "bg-emerald-500" },
  { id: "selling-price", name: "Calculadora de Preço de Venda: Mark-up e Lucro Ideal", description: "Calcule o preço de venda perfeito para produtos e serviços. Inclui taxas de marketplace, impostos e margem de lucro com designs nichados.", icon: Calculator, color: "bg-emerald-500" },
  { id: "commission", name: "Calculadora de Comissão de Vendas: Afiliados e Corretores", description: "Calcule rapidamente comissões de vendas, corretagem imobiliária e programas de afiliados. Defina bônus, metas e divisões com designs exclusivos.", icon: UserCheck, color: "bg-emerald-500" },
  { id: "emergency-fund", name: "Simulador de Reserva de Emergência: Segurança Financeira", description: "Calcule quanto você precisa para sua reserva de emergência com base em seu perfil (CLT, Autônomo, Família). Simulador completo com tempo estimado e metas.", icon: ShieldCheck, color: "bg-emerald-500" },
  { id: "daily-calories", name: "Calculadora de Calorias Diárias: TDEE e Macronutrientes", description: "Calcule suas necessidades calóricas diárias para emagrecer, manter ou ganhar massa. Descubra seu TDEE e divisão de macros por objetivo com designs exclusivos.", icon: Flame, color: "bg-rose-500" },
  { id: "water-consumption", name: "Calculadora de Consumo de Água: Meta Diária e Hidratação", description: "Calcule a quantidade ideal de água para beber por dia com base no seu peso, nível de atividade e clima. Use designs exclusivos para saúde e performance.", icon: Droplets, color: "bg-rose-500" },
  { id: "running-pace", name: "Calculadora de Ritmo de Corrida: Pace e Projeção de Prova", description: "Calcule seu pace (min/km), tempo total e preveja resultados para 5k, 10k e maratona. Simulador completo com versões para iniciantes e atletas de elite.", icon: Trophy, color: "bg-rose-500" },
  { id: "event-checklist", name: "Checklist de Casamento e Eventos: Planejamento Completo", description: "Organize seu casamento, aniversário ou evento corporativo com um checklist inteligente. Gerencie tarefas por categorias com designs românticos, clássicos ou tech.", icon: CircleCheck, color: "bg-indigo-500" },
  { id: "smart-shopping-list", name: "Lista de Compras Inteligente com IA: Despensa e Mercado", description: "Crie listas de compras otimizadas com sugestões da IA para mercado, churrasco ou dieta. Controle gastos e categorias com designs exclusivos e divertidos.", icon: ShoppingCart, color: "bg-indigo-500" },
  { id: "color-converter", name: "Conversor HEX / RGB / HSL: Design e Web Development", description: "Converta cores instantaneamente entre HEX, RGB e HSL. Gere paletas, verifique contraste e CMYK para print com designs web, UI e retrô.", icon: Palette, color: "bg-blue-500" },
  { id: "brand-name-generator", name: "Gerador de Nomes para Marcas: Branding e Naming com IA", description: "Encontre o nome perfeito para sua empresa, startup ou canal. Gerador de nomes criativos com IA, nichos específicos (Tech, Creative, Wellness) e designs personalizáveis.", icon: Lightbulb, color: "bg-indigo-500" },
].map(tool => ({ ...tool, slug: slugify(tool.name) } as Tool));


const SEGMENTS = [
  {
    title: "Produtividade",
    description: "Organize sua rotina e maximize seu tempo.",
    toolIds: ["hours", "checklist", "smart-checklist", "event-checklist", "smart-shopping-list", "brand-name-generator", "pomodoro", "worldclock", "stopwatch", "timer"],
    color: "cyan-500"
  },
  {
    title: "Financeiro",
    description: "Controle de investimentos e métricas de performance.",
    toolIds: ["calc", "percent", "discount", "profit-margin", "selling-price", "commission", "emergency-fund", "interest", "loan", "netsalary", "inss", "thirteenth", "vacation", "overtime", "currency", "creditcard", "boleto"],
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
    toolIds: ["json", "mockdata", "cnpj"],
    color: "indigo-500"
  },
  {
    title: "Web Design e Imagem",
    description: "Crie identidades visuais impactantes.",
    toolIds: ["colors", "contrast", "palette", "imagecolor", "font", "color-converter"],
    color: "violet-500"
  },
  {
    title: "Utilidades",
    description: "Conversores e cálculos gerais do dia a dia.",
    toolIds: ["unit", "password", "roman", "energyvolume", "cpf", "cnpj", "creditcard", "boleto", "contrast"],
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
    toolIds: ["bmi", "idealweight", "daily-calories", "water-consumption", "running-pace", "menstrual", "pregnancy", "dogage", "catage", "temperature"],
    color: "rose-500"
  }
].map(s => ({ ...s, slug: slugify(s.title) }));


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
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);
  }, [searchQuery]);

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
            <Link 
              to="/"
              className="group flex cursor-pointer items-center gap-3 shrink-0"
            >
              <div className="flex items-center gap-3">
                 <LogoIcon />
                <div className="hidden sm:flex flex-col leading-none">
                  <h1 className="text-xl font-black tracking-tighter text-white">
                    MESTRE
                  </h1>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-emerald-500 uppercase">Digital Grátis</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mx-4 flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-all"
                placeholder="Buscar ferramenta..."
              />
            </div>

            <AnimatePresence>
              {showSearchResults && searchQuery.trim() && (
                <>
                  <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setShowSearchResults(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-full bg-[#0A1A2F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2"
                  >
                    {filteredTools.length > 0 ? (
                      <div className="space-y-1">
                        {filteredTools.map((tool) => (
                          <Link
                            key={tool.id}
                            to={`/ferramenta/${tool.slug}`}
                            onClick={() => {
                              setShowSearchResults(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                          >
                            <div className={`p-2 rounded-lg ${tool.color} bg-opacity-10 text-white shrink-0`}>
                              <tool.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-xs font-bold text-white truncate">{tool.name}</h4>
                               <p className="text-[10px] text-slate-500 truncate">{tool.description}</p>
                            </div>
                            <ChevronRight className="h-3 w-3 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase">Nenhuma ferramenta encontrada</p>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <nav className="hidden items-center gap-8 lg:flex text-sm">
            {SEGMENTS.slice(0, 5).map((segment, idx) => (
              <Link
                key={idx}
                to={`/categoria/${segment.slug}`}
                className="text-[10px] font-black uppercase tracking-widest transition-colors text-slate-400 hover:text-white"
              >
                {segment.title}
              </Link>
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
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/categoria/:categorySlug" element={<CategoryView />} />
          <Route path="/ferramenta/:toolSlug" element={<ToolView />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function Sidebar({ isSidebarOpen, setSidebarOpen }: { isSidebarOpen: boolean, setSidebarOpen: (o: boolean) => void }) {
  return (
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
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors text-slate-400 hover:bg-white/5"
              >
                <Search className="h-5 w-5" />
                <span className="font-bold">Início</span>
              </Link>
              <div className="pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-600 px-3">Categorias</div>
              {SEGMENTS.map((segment, idx) => (
                <Link
                  key={idx}
                  to={`/categoria/${segment.slug}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <span className="font-medium">{segment.title}</span>
                </Link>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function HomeView() {
  return (
    <motion.div
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
        <h1 className="text-6xl font-extrabold tracking-tighter text-white sm:text-8xl leading-[0.85]">
          MESTRE DIGITAL <br /><span className="text-emerald-500 tracking-tighter uppercase italic text-shadow-glow">GRÁTIS.</span>
        </h1>
        <p className="mt-8 max-w-xl text-xl text-slate-400 leading-relaxed font-medium mx-auto md:mx-0">
          O melhor hub de ferramentas digitais online e gratuitas. Rapidez, privacidade e eficiência para sua rotina de trabalho, estudos e saúde. <br />
          <span className="text-white/40">Selecione uma categoria abaixo para acessar nossos utilitários.</span>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-12">
        {SEGMENTS.map((segment, sIdx) => {
          return (
            <Link 
              key={sIdx} 
              to={`/categoria/${segment.slug}`}
              className="group relative cursor-pointer rounded-[2rem] border border-white/10 p-8 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] block overflow-hidden"
              style={{ 
                 backgroundColor: `color-mix(in srgb, var(--color-${segment.color}) 8%, #0A1F35)`
              }}
            >
              {/* Decorative Glow */}
              <div 
                className="absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: `var(--color-${segment.color})` }}
              />

              {/* Border emphasis */}
              <div 
                className="absolute inset-0 rounded-[2rem] border border-transparent group-hover:border-white/20 transition-colors pointer-events-none" 
              />
              
              <div 
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] shadow-lg"
                style={{ 
                  backgroundColor: `var(--color-${segment.color})`,
                  color: '#05192d'
                }}
              >
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
                   className="text-[10px] font-black uppercase tracking-widest opacity-60"
                   style={{ color: `var(--color-${segment.color})` }}
                 >
                    {(sIdx + 1).toString().padStart(2, '0')}
                 </span>
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase text-white leading-tight group-hover:text-emerald-400 transition-colors">{segment.title}</h3>
              <p className="mt-3 text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-300 transition-colors">{segment.description}</p>
              <div 
                className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all"
                style={{ color: `var(--color-${segment.color})` }}
              >
                  Explorar Agora <ChevronRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

function CategoryView() {
  const { categorySlug } = useParams();
  const segment = SEGMENTS.find(s => s.slug === categorySlug);

  if (!segment) return <div className="text-center py-20 text-slate-400">Categoria não encontrada.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <Link 
        to="/"
        className="flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors w-fit"
      >
        <ChevronRight className="mr-1 h-4 w-4 rotate-180" /> Voltar ao Início
      </Link>

      <div className="max-w-4xl">
         <div className="flex items-center gap-4 mb-4">
            <span 
              className="h-1 w-12 rounded-full" 
              style={{ backgroundColor: `var(--color-${segment.color})` }}
            />
            <span 
              className="text-xs font-black uppercase tracking-[0.3em]"
              style={{ color: `var(--color-${segment.color})` }}
            >
              Ferramentas de {segment.title}
            </span>
         </div>
         <h2 className="text-5xl font-black tracking-tighter text-white uppercase">{segment.title}</h2>
         <p className="mt-4 text-slate-400 text-lg font-medium">{segment.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {segment.toolIds.map((toolId) => {
          const tool = TOOLS.find(t => t.id === toolId);
          if (!tool) return null;
          return (
            <Link
              key={tool.id}
              to={`/ferramenta/${tool.slug}`}
              className="group/tool cursor-pointer rounded-3xl border border-white/10 p-8 transition-all shadow-lg hover:shadow-2xl hover:scale-[1.02] block relative overflow-hidden"
              style={{ 
                backgroundColor: `color-mix(in srgb, var(--color-${segment.color}) 8%, #0A1F35)`
              } as any}
            >
              {/* Decorative Glow */}
              <div 
                className="absolute -right-2 -top-2 h-16 w-16 rounded-full blur-2xl opacity-10 group-hover/tool:opacity-30 transition-opacity"
                style={{ backgroundColor: `var(--color-${segment.color})` }}
              />

              <div 
                className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover/tool:scale-110 shadow-lg"
                style={{ 
                  backgroundColor: `var(--color-${segment.color})`,
                  color: '#05192d'
                }}
              >
                <tool.icon className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-white tracking-tight group-hover/tool:text-emerald-400 transition-colors">{tool.name}</h4>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed font-medium">{tool.description}</p>
              <div 
                className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest translate-y-1 opacity-0 group-hover/tool:translate-y-0 group-hover/tool:opacity-100 transition-all"
                style={{ color: `var(--color-${segment.color})` }}
              >
                 Acessar Ferramenta <ChevronRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

function ToolView() {
  const { toolSlug } = useParams();
  const tool = TOOLS.find(t => t.slug === toolSlug);

  if (!tool) return <div className="text-center py-20 text-slate-400">Ferramenta não encontrada.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-5xl mx-auto"
    >
      <button 
        onClick={() => window.history.back()}
        className="mb-8 flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors"
      >
        <ChevronRight className="mr-1 h-4 w-4 rotate-180" /> Voltar
      </button>

      <div className="rounded-[2.5rem] border border-white/10 bg-[#0A1F35] p-6 sm:p-12 shadow-2xl relative overflow-hidden min-h-[400px]">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
           <tool.icon className="h-64 w-64" />
        </div>
        <div className="relative z-10">
          <ToolRenderer id={tool.id as ToolId} />
        </div>
      </div>
    </motion.div>
  );
}

function Footer() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visitor-count")
      .then(res => res.json())
      .then(data => setVisitorCount(data.count))
      .catch(err => console.error("Error fetching visitor count:", err));
  }, []);

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#05192d] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-emerald-500 rounded-sm flex items-center justify-center font-bold text-black text-xs">M</div>
              <span className="text-sm font-bold tracking-tight">MESTRE DIGITAL GRÁTIS</span>
            </div>
            {visitorCount !== null && (
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <Users className="h-3 w-3 text-emerald-500" />
                <span>Visitantes: <span className="text-emerald-400">{visitorCount.toLocaleString()}</span></span>
              </div>
            )}
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
          case "cnpj": return <CNPJValidatorTool />;
          case "creditcard": return <CreditCardTool />;
          case "boleto": return <BoletoTool />;
          case "worldclock": return <WorldClockTool />;
          case "stopwatch": return <StopwatchTool />;
          case "timer": return <TimerTool />;
          case "contrast": return <ContrastSimulatorTool />;
          case "palette": return <ColorPaletteTool />;
          case "imagecolor": return <ImageColorPickerTool />;
          case "font": return <FontIdentifierTool />;
          case "smart-checklist": return <SmartChecklistTool />;
          case "loan": return <LoanCalculatorTool />;
          case "discount": return <DiscountCalculatorTool />;
          case "profit-margin": return <ProfitMarginCalculatorTool />;
          case "selling-price": return <SellingPriceCalculatorTool />;
          case "commission": return <CommissionCalculatorTool />;
          case "emergency-fund": return <EmergencyFundSimulatorTool />;
          case "daily-calories": return <CalorieCalculatorTool />;
          case "water-consumption": return <WaterConsumptionCalculatorTool />;
          case "running-pace": return <RunningPaceCalculatorTool />;
          case "event-checklist": return <EventChecklistTool />;
          case "smart-shopping-list": return <SmartShoppingListTool />;
          case "color-converter": return <ColorConverterTool />;
          case "brand-name-generator": return <BrandNameGeneratorTool />;
          default: return null;
        }
      })()}
    </Suspense>
  );
}
