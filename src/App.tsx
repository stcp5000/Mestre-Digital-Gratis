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
  Lightbulb,
  MousePointer2,
  Eraser,
  MessageSquare,
  PlayCircle,
  BarChart3,
  FileText,
  FileDown
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
const CTAGeneratorTool = lazy(() => import("./components/tools/CTAGeneratorTool"));
const TextCleanerTool = lazy(() => import("./components/tools/TextCleanerTool"));
const PostCaptionGeneratorTool = lazy(() => import("./components/tools/PostCaptionGeneratorTool"));
const TitleGeneratorTool = lazy(() => import("./components/tools/TitleGeneratorTool"));
const LongTailKeywordTool = lazy(() => import("./components/tools/LongTailKeywordTool"));
const HeadlineAnalyzerTool = lazy(() => import("./components/tools/HeadlineAnalyzerTool"));
const DescriptionCreatorTool = lazy(() => import("./components/tools/DescriptionCreatorTool"));
const HookGeneratorTool = lazy(() => import("./components/tools/HookGeneratorTool"));
const PDFConverterTool = lazy(() => import("./components/tools/PDFConverterTool"));

// --- Types ---
type ToolId = "qrcode" | "hashtags" | "calc" | "text" | "colors" | "checklist" | "hours" | "whatsapp" | "json" | "pomodoro" | "unit" | "dates" | "lorem" | "case" | "password" | "accents" | "spelling" | "inverter" | "html" | "sort" | "words" | "percent" | "interest" | "netsalary" | "inss" | "thirteenth" | "vacation" | "overtime" | "currency" | "bmi" | "idealweight" | "menstrual" | "pregnancy" | "dogage" | "catage" | "temperature" | "roman" | "energyvolume" | "barcode" | "mockdata" | "instagrambio" | "cpf" | "cnpj" | "creditcard" | "boleto" | "worldclock" | "stopwatch" | "timer" | "contrast" | "palette" | "imagecolor" | "font" | "smart-checklist" | "loan" | "discount" | "profit-margin" | "selling-price" | "commission" | "emergency-fund" | "daily-calories" | "water-consumption" | "running-pace" | "event-checklist" | "smart-shopping-list" | "color-converter" | "brand-name-generator" | "cta-generator" | "text-cleaner" | "post-caption-generator" | "title-generator" | "long-tail-keyword" | "headline-analyzer" | "description-creator" | "hook-generator" | "pdf-converter";

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
  { id: "cta-generator", name: "Gerador de CTA (Call to Action): Conversão e Copywriting com IA", description: "Crie chamadas para ação irresistíveis para anúncios, landing pages e redes sociais. Gere CTAs de alta conversão com nichos específicos e múltiplos designs profissionais.", icon: MousePointer2, color: "bg-rose-500" },
  { id: "text-cleaner", name: "Limpador de Texto Online: Remover Espaços, Quebras e Caracteres", description: "Limpe seu texto instantaneamente. Remova espaços extras, linhas vazias, emojis e caracteres especiais. Otimize parágrafos com múltiplos designs dinâmicos.", icon: Eraser, color: "bg-blue-600" },
  { id: "post-caption-generator", name: "Gerador de Legendas para Posts: Social Media e Viral com IA", description: "Sugira legendas criativas por nicho e objetivo para Instagram, TikTok e mais. Otimize seu engajamento com CTAs e designs personalizados pela IA.", icon: MessageSquare, color: "bg-pink-600" },
  { id: "hook-generator", name: "Gerador de Hooks para Redes Sociais: Viral e Retenção com IA", description: "Crie ganchos irresistíveis para Reels, Shorts e TikTok. Prenda a atenção nos primeiros segundos com estratégias de psicologia e múltiplos designs exclusivos.", icon: Flame, color: "bg-orange-600" },
  { id: "description-creator", name: "Criador de Descrição de Vídeos, Posts e Produtos: SEO com IA", description: "Crie descrições completas e otimizadas para YouTube, Instagram e E-commerce. Gere textos persuasivos com palavras-chave, timestamps e designs exclusivos.", icon: FileText, color: "bg-amber-600" },
  { id: "headline-analyzer", name: "Analisador de Headline: SEO, Copywriting e Impacto com IA", description: "Analise a força da sua headline para vendas, blogs e anúncios. Descubra o poder emocional, legibilidade e métricas de SEO com designs exclusivos.", icon: BarChart3, color: "bg-indigo-600" },
  { id: "long-tail-keyword", name: "Gerador de Palavras-Chave Long Tail: SEO e Tráfego com IA", description: "Encontre palavras-chave de cauda longa com baixa concorrência e alta conversão. Otimize seu SEO com termos específicos, intenção de busca e métricas reais.", icon: Search, color: "bg-emerald-600" },
  { id: "title-generator", name: "Gerador de Títulos para YouTube e Blog: SEO e Viralidade com IA", description: "Crie títulos impossíveis de não clicar e otimizados para SEO. Gerador de títulos com palavras-chave, estratégias de CTR e múltiplos designs divertidos e clássicos.", icon: PlayCircle, color: "bg-red-600" },
  { id: "pdf-converter", name: "Conversor de PDF Online: PDF para Imagem, Texto e Vice-Versa", description: "Converta arquivos PDF para diversos formatos ou crie documentos PDF a partir de imagens e textos. Ferramenta rápida, segura e com designs exclusivos.", icon: FileDown, color: "bg-blue-600" },
].map(tool => ({ ...tool, slug: slugify(tool.name) } as Tool));


const SEGMENTS = [
  {
    title: "Produtividade",
    description: "Organize sua rotina e maximize seu tempo.",
    toolIds: ["hours", "checklist", "smart-checklist", "event-checklist", "pdf-converter", "smart-shopping-list", "pomodoro", "worldclock", "stopwatch", "timer"],
    color: "brand-primary"
  },
  {
    title: "Financeiro",
    description: "Controle de investimentos e métricas de performance.",
    toolIds: ["calc", "percent", "discount", "profit-margin", "selling-price", "commission", "emergency-fund", "interest", "loan", "netsalary", "inss", "thirteenth", "vacation", "overtime", "currency", "creditcard", "boleto"],
    color: "brand-primary"
  },
  {
    title: "Social e Marketing",
    description: "Gere visibilidade e conexões rápidas.",
    toolIds: ["qrcode", "barcode", "instagrambio", "hashtags", "cta-generator", "post-caption-generator", "title-generator", "headline-analyzer", "description-creator", "hook-generator", "long-tail-keyword", "brand-name-generator", "whatsapp"],
    color: "brand-primary"
  },
  {
    title: "Texto e Escrita",
    description: "Ferramentas para redação e copywriting.",
    toolIds: ["text", "lorem", "text-cleaner", "case", "accents", "spelling", "inverter", "html", "sort", "words"],
    color: "brand-primary"
  },
  {
    title: "Técnico e Dev",
    description: "Utilitários essenciais para desenvolvedores.",
    toolIds: ["json", "mockdata", "cnpj"],
    color: "brand-primary"
  },
  {
    title: "Web Design e Imagem",
    description: "Crie identidades visuais impactantes.",
    toolIds: ["colors", "contrast", "palette", "imagecolor", "font", "color-converter"],
    color: "brand-primary"
  },
  {
    title: "Utilidades",
    description: "Conversores e cálculos gerais do dia a dia.",
    toolIds: ["unit", "password", "roman", "energyvolume", "cpf", "cnpj", "creditcard", "boleto", "contrast"],
    color: "brand-primary"
  },
  {
    title: "Planejamento",
    description: "Ferramentas para cronogramas e prazos.",
    toolIds: ["dates"],
    color: "brand-primary"
  },
  {
    title: "Saúde",
    description: "Monitore seu bem-estar e indicadores físicos.",
    toolIds: ["bmi", "idealweight", "daily-calories", "water-consumption", "running-pace", "menstrual", "pregnancy", "dogage", "catage", "temperature"],
    color: "brand-primary"
  }
].map(s => ({ ...s, slug: slugify(s.title) }));


function LogoIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-white rounded-full shadow-soft ring-1 ring-black/5 overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] fill-none">
        {/* Main Circle Outline - Gradient feel */}
        <path d="M50 5 A45 45 0 1 1 49.99 5" stroke="#05192d" strokeWidth="2" strokeDasharray="140 100" strokeLinecap="round" />
        
        {/* The "M" Shape */}
        <path d="M25 75 V35 L50 65 L75 35 V75" stroke="#05192d" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
        
        {/* Checkmark Arrow Detail */}
        <path d="M45 60 L55 75 L85 35" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Pixel/Tech elements */}
        <rect x="15" y="45" width="5" height="5" fill="#05192d" />
        <rect x="10" y="55" width="4" height="4" fill="#05192d" opacity="0.6" />
        <rect x="20" y="60" width="4" height="4" fill="#10b981" />
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
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text selection-brand">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-soft border-b border-brand-border">
        <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-brand-muted hover:bg-brand-highlight rounded-lg md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link 
              to="/"
              className="flex items-center gap-3 group"
            >
              <LogoIcon className="w-12 h-12 transition-transform group-hover:scale-105" />
              <h1 className="text-xl font-bold tracking-tight text-brand-text font-display">
                Mestre Digital Grátis
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md mx-6 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
              <input 
                type="text" 
                placeholder="Buscar ferramentas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full h-10 pl-10 pr-4 bg-brand-highlight border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />

              <AnimatePresence>
                {showSearchResults && searchQuery.trim() && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowSearchResults(false)}
                      className="fixed inset-0 z-40 bg-transparent"
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-brand-border rounded-2xl shadow-xl overflow-hidden"
                    >
                      {filteredTools.length > 0 ? (
                        <div className="p-2">
                          {filteredTools.map(tool => (
                            <Link
                              key={tool.id}
                              to={`/ferramenta/${tool.slug}`}
                              onClick={() => {
                                setSearchQuery("");
                                setShowSearchResults(false);
                              }}
                              className="flex items-center gap-3 p-3 hover:bg-brand-highlight rounded-xl transition-colors group"
                            >
                              <div className={`w-10 h-10 ${tool.color} text-white rounded-lg flex items-center justify-center shrink-0`}>
                                <tool.icon className="h-5 w-5" />
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="text-sm font-bold truncate">{tool.name}</h4>
                                <p className="text-[10px] text-brand-muted truncate">{tool.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-brand-muted text-sm">
                          Nenhuma ferramenta encontrada.
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            <a href="#ferramentas" className="text-[15px] font-medium text-brand-muted hover:text-brand-primary transition-colors">Ferramentas</a>
            <a href="#categorias" className="text-[15px] font-medium text-brand-muted hover:text-brand-primary transition-colors">Categorias</a>
            <a href="#como-usar" className="text-[15px] font-medium text-brand-muted hover:text-brand-primary transition-colors">Como usar</a>
            <a 
              href="https://www.instagram.com/mestreferramentasdigitaisfree/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[15px] font-medium text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-2"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </nav>

          <div className="flex items-center gap-4">
             {/* Botão removido a pedido do usuário */}
          </div>
        </div>
      </header>

      {/* Sidebar Mobile */}
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="mx-auto max-w-[1200px] px-5 py-24 md:px-10 md:py-32">
        <Routes>
          <Route path="/" element={<HomeView searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowSearchResults={setShowSearchResults} filteredTools={filteredTools} />} />
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
            className="fixed inset-y-0 left-0 z-[70] w-72 bg-white p-6 shadow-2xl border-r border-brand-border md:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogoIcon className="w-10 h-10" />
                <h2 className="text-sm font-bold tracking-tight font-display">Mestre Digital</h2>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-brand-highlight text-brand-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors text-brand-muted hover:bg-brand-highlight hover:text-brand-primary"
              >
                <Search className="h-5 w-5" />
                <span className="font-bold">Início</span>
              </Link>
              <div className="pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-brand-muted/70 px-3">Categorias</div>
              {SEGMENTS.map((segment, idx) => (
                <Link
                  key={idx}
                  to={`/categoria/${segment.slug}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors text-brand-muted hover:bg-brand-highlight hover:text-brand-primary"
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

function HomeView({ 
  searchQuery, 
  setSearchQuery, 
  setShowSearchResults,
  filteredTools 
}: { 
  searchQuery: string; 
  setSearchQuery: (s: string) => void;
  setShowSearchResults: (b: boolean) => void;
  filteredTools: Tool[];
}) {
  const [heroSearchFocused, setHeroSearchFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-32"
    >
      {/* ABOVE THE FOLD / HERO */}
      <section className="grid gap-16 lg:grid-cols-2 lg:items-center min-h-[600px] pt-8 md:pt-16">
        {/* Lado Esquerdo: Texto */}
        <div className="space-y-12">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 bg-brand-highlight text-brand-primary text-sm font-bold rounded-full">
              Ferramentas digitais 100% gratuitas
            </span>
            <h1 className="text-[30px] md:text-[44px] lg:text-[48px] font-bold text-brand-text leading-[1.15] tracking-tight font-display max-w-[600px]">
              As melhores ferramentas digitais grátis para criar, organizar e divulgar online
            </h1>
            <p className="text-base md:text-[18px] lg:text-[20px] text-brand-muted leading-relaxed max-w-[520px]">
              Descubra ferramentas gratuitas para produtividade, marketing, escrita e design em um só lugar, sem pagar mensalidades caras.
            </p>
          </div>

          <div className="relative max-w-[520px] z-20">
            <div className={`relative flex items-center bg-white border-2 rounded-[2rem] p-2 transition-all shadow-soft ${heroSearchFocused ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-xl' : 'border-brand-border'}`}>
              <Search className={`ml-4 h-6 w-6 ${heroSearchFocused ? 'text-brand-primary' : 'text-brand-muted'}`} />
              <input 
                type="text"
                placeholder="Qual ferramenta você precisa hoje?"
                value={searchQuery}
                onFocus={() => {
                  setHeroSearchFocused(true);
                  setShowSearchResults(true);
                }}
                onBlur={() => setTimeout(() => setHeroSearchFocused(false), 200)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                className="flex-1 px-4 py-3 bg-transparent outline-none text-lg font-medium placeholder:text-zinc-400 placeholder:font-normal"
              />
              <button className="hidden sm:block px-8 h-12 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-hover transition-colors shadow-soft">
                Buscar
              </button>
            </div>

            <AnimatePresence>
              {heroSearchFocused && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white border border-brand-border rounded-[2rem] shadow-2xl overflow-hidden z-30"
                >
                  {filteredTools.length > 0 ? (
                    <div className="p-3">
                       {filteredTools.map(tool => (
                         <Link
                           key={tool.id}
                           to={`/ferramenta/${tool.slug}`}
                           onClick={() => {
                             setSearchQuery("");
                             setShowSearchResults(false);
                           }}
                           className="flex items-center gap-4 p-4 hover:bg-brand-highlight rounded-2xl transition-colors group"
                         >
                            <div className={`w-12 h-12 ${tool.color} text-white rounded-xl flex items-center justify-center shrink-0 shadow-soft`}>
                               <tool.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                               <h4 className="text-[15px] font-bold text-brand-text">{tool.name}</h4>
                               <p className="text-xs text-brand-muted leading-tight mt-0.5">{tool.description}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                         </Link>
                       ))}
                       <div className="p-3 pt-1 border-t border-brand-border mt-2">
                          <p className="text-[10px] text-center font-bold text-brand-muted uppercase tracking-widest">Pressione enter para ver mais resultados</p>
                       </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-brand-muted space-y-3">
                       <Search className="h-10 w-10 mx-auto opacity-20" />
                       <p className="font-bold">Ops! Nenhuma ferramenta encontrada.</p>
                       <p className="text-sm">Tente buscar por palavras-chave como "GPT", "SEO" ou "PDF".</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <a 
              href="#ferramentas"
              className="w-full sm:w-auto px-10 py-4 bg-brand-primary text-white text-[16px] font-semibold rounded-2xl hover:bg-brand-hover hover:-translate-y-0.5 hover:shadow-lg transition-all text-center flex items-center justify-center cursor-pointer h-[52px] shadow-soft"
            >
              Ver ferramentas grátis
            </a>
            <a 
              href="#categorias"
              className="w-full sm:w-auto px-10 py-4 bg-white text-brand-muted text-[16px] font-semibold rounded-2xl border border-brand-border hover:bg-brand-highlight hover:text-brand-primary transition-all text-center cursor-pointer h-[52px] shadow-soft"
            >
              Explorar categorias
            </a>
          </div>

          <p className="text-sm text-brand-muted italic">
            Ideal para criadores de conteúdo, iniciantes, freelancers e pequenos empreendedores.
          </p>
        </div>

        {/* Lado Direito: Visual Cards */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[
              { label: "Produtividade", icon: Zap, color: "text-[#0F766E]", bg: "bg-[#0F766E]/10", border: 'hover:border-[#0F766E]/40', slug: 'produtividade' },
              { label: "Social e Marketing", icon: TrendingUp, color: "text-[#F97316]", bg: "bg-[#F97316]/10", border: 'hover:border-[#F97316]/40', slug: 'social-e-marketing' },
              { label: "Texto e Escrita", icon: Type, color: "text-[#7C3AED]", bg: "bg-[#7C3AED]/10", border: 'hover:border-[#7C3AED]/40', slug: 'texto-e-escrita' },
              { label: "Design e Imagem", icon: Palette, color: "text-[#2563EB]", bg: "bg-[#2563EB]/10", border: 'hover:border-[#2563EB]/40', slug: 'web-design-e-imagem' }
            ].map((card, i) => (
              <Link
                key={i}
                to={`/categoria/${card.slug}`}
                className={`bg-white p-8 rounded-[1.5rem] border border-brand-border shadow-card flex flex-col items-center text-center gap-4 transition-all hover:shadow-xl hover:-translate-y-1 group ${card.border}`}
              >
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <card.icon className="h-7 w-7" />
                </div>
                <span className="text-[15px] font-bold text-brand-text leading-tight">{card.label}</span>
              </Link>
            ))}
          </div>
          {/* Background Decorative Element */}
          <div className="absolute -z-10 -inset-6 bg-brand-highlight rounded-[4rem] blur-3xl opacity-30" />
        </div>
      </section>

      {/* Prova Rápida */}
      <div className="text-center space-y-8 py-12 border-y border-brand-border">
        <p className="text-brand-muted font-medium max-w-2xl mx-auto text-lg">
          Ferramentas úteis para quem quer economizar, produzir melhor e encontrar opções grátis de verdade.
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
           {["Produtividade", "Marketing", "Escrita", "Design"].map(cat => (
             <span key={cat} className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-muted/50">{cat}</span>
           ))}
        </div>
      </div>

      {/* Seção de Categorias */}
      <div id="categorias" className="space-y-16 scroll-mt-24">
        <div className="text-center space-y-4">
           <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display">Navegue por categorias</h2>
           <p className="text-brand-muted max-w-2xl mx-auto text-lg">Encontre a coleção perfeita de utilitários para cada momento do seu dia.</p>
        </div>
        <div id="ferramentas" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-24">
          {SEGMENTS.map((segment, sIdx) => {
            const getColorClasses = () => {
              switch(segment.title) {
                case "Produtividade": return "hover:border-[#0F766E]/40 group-hover:text-[#0F766E] hover:shadow-[#0F766E]/5";
                case "Social e Marketing": return "hover:border-[#F97316]/40 group-hover:text-[#F97316] hover:shadow-[#F97316]/5";
                case "Texto e Escrita": return "hover:border-[#7C3AED]/40 group-hover:text-[#7C3AED] hover:shadow-[#7C3AED]/5";
                case "Web Design e Imagem": return "hover:border-[#2563EB]/40 group-hover:text-[#2563EB] hover:shadow-[#2563EB]/5";
                default: return "hover:border-brand-primary/40 group-hover:text-brand-primary";
              }
            };

            return (
              <Link 
                key={sIdx} 
                to={`/categoria/${segment.slug}`}
                className={`bg-white border border-brand-border p-10 rounded-[2.5rem] transition-all shadow-soft hover:shadow-xl hover:-translate-y-1 group block relative overflow-hidden ${getColorClasses()}`}
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{segment.title}</h3>
                  <p className="text-brand-muted text-base mb-10 leading-relaxed h-[4.5rem] overflow-hidden">{segment.description}</p>
                  <div className="text-[15px] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Ver ferramentas <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
                {/* Visual accent */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] -translate-y-8 translate-x-8 transition-transform group-hover:scale-110">
                   <Zap className="w-full h-full" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Como Funciona */}
      <section id="como-usar" className="bg-white border border-brand-border rounded-[3rem] p-12 md:p-20 text-center space-y-20 scroll-mt-24 shadow-soft">
        <div className="space-y-6">
           <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-text font-display">Simples, rápido e útil</h2>
           <p className="text-brand-muted text-lg max-w-2xl mx-auto">Tudo foi pensado para que você encontre e use o que precisa em poucos segundos.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 lg:gap-20 relative">
           {[
             { step: "01", title: "Escolha o tema", desc: "Selecione uma categoria ou use a busca para encontrar a ferramenta ideal para seu momento." },
             { step: "02", title: "Entenda o uso", desc: "Cada utilitário possui explicações claras e objetivas sobre como ele ajuda você no dia a dia." },
             { step: "03", title: "Use sem limites", desc: "Sem contas, sem assinaturas e sem taxas. Acesso direto e 100% gratuito para sempre." }
           ].map((item, i) => (
             <div key={i} className="space-y-6 relative group">
                <div className="flex items-center justify-center">
                  <div className="text-[64px] font-black text-brand-highlight transition-colors group-hover:text-brand-primary/10 font-display leading-none">
                    {item.step}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-brand-text tracking-tight">{item.title}</h4>
                  <p className="text-brand-muted text-base leading-relaxed">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </section>
    </motion.div>
  );
}

function CategoryView() {
  const { categorySlug } = useParams();
  const segment = SEGMENTS.find(s => s.slug === categorySlug);

  if (!segment) return <div className="text-center py-20 text-brand-muted">Categoria não encontrada.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <Link 
        to="/"
        className="inline-flex items-center text-sm font-bold text-brand-muted hover:text-brand-primary transition-colors gap-2"
      >
        <ChevronRight className="h-4 w-4 rotate-180" /> Voltar ao Início
      </Link>

      <div className="space-y-4">
         <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-brand-highlight text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
               {segment.title}
            </span>
         </div>
         <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-brand-text font-display">{segment.title}</h2>
         <p className="max-w-2xl text-brand-muted text-xl leading-relaxed">{segment.description}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {segment.toolIds.map((toolId) => {
          const tool = TOOLS.find(t => t.id === toolId);
          if (!tool) return null;
          return (
            <Link
              key={tool.id}
              to={`/ferramenta/${tool.slug}`}
              className="group bg-white border border-brand-border p-8 rounded-[2.5rem] transition-all shadow-soft hover:shadow-card hover:border-brand-primary block relative overflow-hidden"
            >
              <div className="mb-6 h-16 w-16 bg-brand-highlight text-brand-primary flex items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                <tool.icon className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold text-brand-text group-hover:text-brand-primary transition-colors font-display tracking-tight">{tool.name}</h4>
              <p className="mt-3 text-brand-muted leading-relaxed">{tool.description}</p>
              <div className="mt-8 flex items-center text-[15px] font-bold text-brand-primary gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                 Acessar Agora <ChevronRight className="h-5 w-5" />
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

  if (!tool) return <div className="text-center py-20 text-brand-muted">Ferramenta não encontrada.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      <button 
        onClick={() => window.history.back()}
        className="mb-8 flex items-center text-sm font-bold text-brand-muted hover:text-brand-primary transition-colors gap-2"
      >
        <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
      </button>

      <div className="bg-white rounded-[2.5rem] border border-brand-border p-6 sm:p-12 shadow-card relative overflow-hidden min-h-[500px]">
        {/* Background Icon Detail */}
        <tool.icon className="absolute top-10 right-10 h-64 w-64 text-brand-highlight opacity-20 -rotate-12 pointer-events-none" />
        
        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
             <div className="h-16 w-16 bg-brand-highlight text-brand-primary flex items-center justify-center rounded-2xl shadow-soft">
                <tool.icon className="h-8 w-8" />
             </div>
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-text font-display">{tool.name}</h2>
             <p className="text-brand-muted max-w-2xl text-lg leading-relaxed">{tool.description}</p>
          </div>
          
          <div className="pt-12 border-t border-brand-border">
            <ToolRenderer id={tool.id as ToolId} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-brand-border py-16">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <LogoIcon className="w-12 h-12" />
              <h3 className="text-lg font-bold">Mestre Digital Grátis</h3>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              Sua fonte definitiva de ferramentas digitais 100% gratuitas para impulsionar seu trabalho e criatividade.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/mestreferramentasdigitaisfree/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-brand-highlight text-brand-primary rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-soft"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Navegação</h4>
            <ul className="space-y-4 text-sm text-brand-muted">
              <li><a href="#ferramentas" className="hover:text-brand-primary transition-colors">Ferramentas</a></li>
              <li><a href="#categorias" className="hover:text-brand-primary transition-colors">Categorias</a></li>
              <li><a href="#como-usar" className="hover:text-brand-primary transition-colors">Como usar</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Comunidade</h4>
            <ul className="space-y-4 text-sm text-brand-muted">
              <li><a href="https://www.instagram.com/mestreferramentasdigitaisfree/" className="hover:text-brand-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Sugira uma ferramenta</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Jurídico</h4>
            <ul className="space-y-4 text-sm text-brand-muted">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Privacidade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-brand-muted">
          <p>© 2026 Mestre Digital Grátis. Todos os direitos reservados.</p>
          <p>Feito com ❤️ para criadores e empreendedores.</p>
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
          case "cta-generator": return <CTAGeneratorTool />;
          case "text-cleaner": return <TextCleanerTool />;
          case "post-caption-generator": return <PostCaptionGeneratorTool />;
          case "title-generator": return <TitleGeneratorTool />;
          case "long-tail-keyword": return <LongTailKeywordTool />;
          case "headline-analyzer": return <HeadlineAnalyzerTool />;
          case "description-creator": return <DescriptionCreatorTool />;
          case "hook-generator": return <HookGeneratorTool />;
          case "pdf-converter": return <PDFConverterTool />;
          default: return null;
        }
      })()}
    </Suspense>
  );
}
