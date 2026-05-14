import React, { useState, useMemo, useEffect } from "react";
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Utensils, 
  Beef, 
  Apple, 
  Candy, 
  Search, 
  Filter, 
  ChevronRight, 
  LayoutGrid, 
  Wallet,
  Info,
  Package,
  TrendingDown,
  TrendingUp,
  Store,
  ChefHat
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types & Themes ---

type ShoppingTheme = "classic" | "playful" | "cyber" | "minimal";
type ShoppingNiche = "mercadosemanal" | "churrasco" | "dietafitness" | "festainfantil";

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  estimatedPrice: number;
  quantity: number;
}

interface NicheConfig {
  name: string;
  icon: any;
  defaultItems: { category: string; name: string }[];
  description: string;
}

const NICHES: Record<ShoppingNiche, NicheConfig> = {
  mercadosemanal: {
    name: "Mercado Semanal",
    icon: Store,
    description: "Itens essenciais para a reposição da despensa da família.",
    defaultItems: [
      { category: "Hortifruti", name: "Arroz" },
      { category: "Hortifruti", name: "Feijão" },
      { category: "Laticínios", name: "Leite" },
      { category: "Limpeza", name: "Detergente" }
    ]
  },
  churrasco: {
    name: "Churrasco com Amigos",
    icon: Beef,
    description: "Carnes, acompanhamentos e bebidas para o final de semana.",
    defaultItems: [
      { category: "Carnes", name: "Picanha" },
      { category: "Acompanhamentos", name: "Pão de Alho" },
      { category: "Bebidas", name: "Cerveja" },
      { category: "Limpeza", name: "Carvão" }
    ]
  },
  dietafitness: {
    name: "Dieta & Performance",
    icon: Apple,
    description: "Foco em macros, proteínas e refeições limpas.",
    defaultItems: [
      { category: "Proteínas", name: "Peito de Frango" },
      { category: "Carboidratos", name: "Batata Doce" },
      { category: "Complementos", name: "Ovos" },
      { category: "Suplementos", name: "Whey Protein" }
    ]
  },
  festainfantil: {
    name: "Festa Infantil",
    icon: Candy,
    description: "Doces, salgados e decorações para um dia especial.",
    defaultItems: [
      { category: "Alimentos", name: "Salgadinhos" },
      { category: "Doces", name: "Brigadeiro" },
      { category: "Bebidas", name: "Refrigerante" },
      { category: "Decoração", name: "Balões" }
    ]
  }
};

const themeConfigs: Record<ShoppingTheme, {
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
    name: "Mercado Tradicional",
    bg: "bg-[#0A1F35]",
    border: "border-white/10",
    accent: "text-white",
    card: "bg-white/5",
    button: "bg-emerald-500 text-black",
    text: "text-slate-400",
    checkbox: "text-emerald-400"
  },
  playful: {
    name: "Pop/Divertido",
    bg: "bg-amber-400",
    border: "border-black/20 shadow-[8px_8px_0_#000]",
    accent: "text-black",
    card: "bg-white border-black/10",
    button: "bg-black text-white",
    text: "text-black/60",
    checkbox: "text-black"
  },
  cyber: {
    name: "Cyber-Store",
    bg: "bg-[#020202]",
    border: "border-indigo-500/30",
    accent: "text-indigo-400",
    card: "bg-indigo-500/5",
    button: "bg-indigo-500 text-black",
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

export default function SmartShoppingListTool() {
  const [niche, setNiche] = useState<ShoppingNiche>("mercadosemanal");
  const [theme, setTheme] = useState<ShoppingTheme>("classic");
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Diversos");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const currentTheme = themeConfigs[theme];

  // Initialize with niche defaults
  useEffect(() => {
    const defaultItems: ShoppingItem[] = NICHES[niche].defaultItems.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      name: item.name,
      category: item.category,
      completed: false,
      estimatedPrice: 0,
      quantity: 1
    }));
    setItems(defaultItems);
  }, [niche]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      category: newItemCategory,
      completed: false,
      estimatedPrice: 0,
      quantity: 1
    };
    setItems(prev => [...prev, newItem]);
    setNewItemName("");
  };

  const updatePrice = (id: string, price: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, estimatedPrice: price } : item));
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, qty) } : item));
  };

  const generateWithAI = async () => {
    setIsLoadingAI(true);
    try {
      const response = await fetch("/api/shopping-list/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: NICHES[niche].name + " - " + NICHES[niche].description 
        })
      });
      const data = await response.json();
      if (data.suggestions) {
        const aiItems: ShoppingItem[] = data.suggestions.map((s: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: s.name,
          category: s.category || "Sugerido",
          completed: false,
          estimatedPrice: 0,
          quantity: 1
        }));
        setItems(prev => [...prev, ...aiItems]);
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const stats = useMemo(() => {
    const totalItems = items.length;
    const completedItems = items.filter(i => i.completed).length;
    const percent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    const totalPrice = items.reduce((acc, curr) => acc + (curr.estimatedPrice * curr.quantity), 0);
    
    const categoriesSet = new Set(items.map(i => i.category));
    const byCategory = Array.from(categoriesSet).map(cat => ({
      name: cat,
      items: items.filter(i => i.category === cat)
    }));

    return { totalItems, completedItems, percent, totalPrice, byCategory };
  }, [items]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className={`inline-block px-2 py-0.5 ${theme === 'playful' ? 'bg-black/10 text-black border-black/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'} text-[10px] font-black tracking-widest rounded border uppercase mb-4`}>
          Smart Grocery Protocol
        </span>
        <h2 className={`text-4xl font-extrabold tracking-tighter uppercase leading-none ${theme === 'playful' ? 'text-black' : theme === 'minimal' ? 'text-slate-900' : 'text-white'}`}>Lista de Compras Inteligente</h2>
        <p className={`mt-4 ${theme === 'minimal' ? 'text-slate-500' : 'text-slate-400'}`}>Crie listas de compras otimizadas para cada ocasião. Use nossa IA para sugerir itens essenciais, monitore seu orçamento e economize tempo no supermercado.</p>
      </div>

      {/* Theme Switcher */}
      <div className="flex bg-[#05192d] p-1 rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
         {(Object.keys(themeConfigs) as ShoppingTheme[]).map((t) => (
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
        {/* Left Panel: Config & Summary */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${currentTheme.bg} ${currentTheme.border} shadow-2xl space-y-8`}>
              
              <div className="grid grid-cols-2 gap-3">
                 {(Object.keys(NICHES) as ShoppingNiche[]).map((key) => {
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

              {/* Add Item Area */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adicionar Item</h4>
                 <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Ex: Pão Integral..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 text-sm transition-all ${theme === 'minimal' || theme === 'playful' ? 'text-black placeholder-black/30' : 'text-white'}`}
                      onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                    <div className="flex gap-2">
                       <select 
                         value={newItemCategory}
                         onChange={(e) => setNewItemCategory(e.target.value)}
                         className={`flex-1 bg-white/5 border border-white/10 p-2 rounded-xl text-[10px] font-black uppercase outline-none focus:border-emerald-500 ${theme === 'minimal' || theme === 'playful' ? 'text-black border-black/10' : 'text-slate-400'}`}
                       >
                          <option value="Diversos">Diversos</option>
                          <option value="Hortifruti">Hortifruti</option>
                          <option value="Frios">Frios</option>
                          <option value="Limpeza">Limpeza</option>
                          <option value="Bebidas">Bebidas</option>
                          <option value="Padaria">Padaria</option>
                       </select>
                       <button 
                         onClick={addItem}
                         className="h-10 w-10 flex items-center justify-center bg-emerald-500 text-[#0A1F35] rounded-xl hover:scale-105 transition-all"
                       >
                          <Plus className="h-5 w-5" />
                       </button>
                    </div>
                 </div>
              </div>

              {/* AI Trigger */}
              <button 
                onClick={generateWithAI}
                disabled={isLoadingAI}
                className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${
                  isLoadingAI 
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 cursor-not-allowed' 
                  : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:shadow-xl'
                }`}
              >
                 <Sparkles className={`h-4 w-4 ${isLoadingAI ? 'animate-pulse' : ''}`} />
                 {isLoadingAI ? "Consultando IA..." : "Sugerir Itens com IA"}
              </button>

              <div className="h-px bg-white/5 w-full" />

              {/* Financial Summary */}
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Estimado</h3>
                       <span className={`text-4xl font-black ${currentTheme.accent}`}>{formatCurrency(stats.totalPrice)}</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                    <span>Itens na Lista</span>
                    <span className={currentTheme.accent}>{stats.totalItems} unidades</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Panel: Item List */}
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
                           <Package className="h-4 w-4" />
                        </div>
                        <h4 className={`text-lg font-black tracking-tight ${theme === 'minimal' || theme === 'playful' ? 'text-black' : 'text-white'}`}>{cat.name}</h4>
                        <span className="ml-auto text-[10px] font-black text-slate-500 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                           {cat.items.filter(i => i.completed).length}/{cat.items.length} Finalizados
                        </span>
                     </div>

                     <div className="space-y-3">
                        {cat.items.map((item) => (
                          <div 
                            key={item.id}
                            className={`group flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                              item.completed 
                              ? 'bg-emerald-500/5 border-emerald-500/10 opacity-70' 
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                          >
                             <button 
                               onClick={() => toggleItem(item.id)}
                               className={`transition-colors h-6 w-6 flex items-center justify-center rounded-xl border-2 ${
                                 item.completed 
                                 ? 'bg-emerald-500 border-emerald-500 text-black' 
                                 : 'border-white/10 hover:border-emerald-500'
                               }`}
                             >
                                {item.completed ? <CheckCircle2 className="h-3 w-3" /> : null}
                             </button>

                             <div className="flex-1 min-w-0">
                                <span className={`text-sm font-black transition-all block truncate ${
                                  item.completed 
                                  ? 'line-through text-slate-500' 
                                  : theme === 'minimal' || theme === 'playful' ? 'text-black' : 'text-slate-200'
                                }`}>
                                   {item.name}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                   <input 
                                     type="number"
                                     value={item.quantity}
                                     onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                     className="w-10 bg-white/5 border-none text-[10px] font-black text-slate-500 outline-none"
                                   />
                                   <span className="text-[10px] text-slate-500 font-bold uppercase">x {formatCurrency(item.estimatedPrice)}</span>
                                </div>
                             </div>

                             <div className="flex items-center gap-3">
                                <input 
                                  type="number" 
                                  placeholder="R$ 0,00"
                                  value={item.estimatedPrice || ""}
                                  onChange={(e) => updatePrice(item.id, Number(e.target.value))}
                                  className={`w-20 bg-transparent border-b border-white/10 text-right text-xs font-black outline-none focus:border-emerald-500 transition-all ${theme === 'minimal' || theme === 'playful' ? 'text-black border-black/10' : 'text-white'}`}
                                />
                                <button 
                                  onClick={() => deleteItem(item.id)}
                                  className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                >
                                   <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                ))}
             </div>
           </AnimatePresence>

           {/* Health/Saving Tip */}
           <div className={`p-8 rounded-[2.5rem] bg-amber-400/10 border border-amber-400/20 flex gap-6 items-center`}>
              <div className="h-14 w-14 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-600 shrink-0">
                 <Utensils className="h-7 w-7" />
              </div>
              <div>
                 <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Smart Buy Insight</h4>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                    Com base no seu perfil ({NICHES[niche].name}), recomendamos priorizar itens sazonais (Hortifruti) para reduzir o total estimado em até 15%. Verifique o estoque da despensa antes de sair.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
