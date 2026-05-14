import React, { useState, useEffect, useMemo } from "react";
import { 
  Clock, 
  Globe, 
  Plus, 
  Trash2, 
  Moon, 
  Sun, 
  Calendar,
  Search,
  MapPin,
  MoveHorizontal,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Timezone {
  id: string;
  name: string;
  tz: string;
  country: string;
}

const DEFAULT_TIMEZONES: Timezone[] = [
  { id: "1", name: "Londres", tz: "Europe/London", country: "Reino Unido" },
  { id: "2", name: "Nova York", tz: "America/New_York", country: "EUA" },
  { id: "3", name: "Tóquio", tz: "Asia/Tokyo", country: "Japão" },
  { id: "4", name: "São Paulo", tz: "America/Sao_Paulo", country: "Brasil" },
];

const ALL_TIMEZONES = [
  { name: "Los Angeles", tz: "America/Los_Angeles", country: "EUA" },
  { name: "Cidade do México", tz: "America/Mexico_City", country: "México" },
  { name: "Buenos Aires", tz: "America/Argentina/Buenos_Aires", country: "Argentina" },
  { name: "Paris", tz: "Europe/Paris", country: "França" },
  { name: "Dubai", tz: "Asia/Dubai", country: "EAU" },
  { name: "Hong Kong", tz: "Asia/Hong_Kong", country: "China" },
  { name: "Sydney", tz: "Australia/Sydney", country: "Austrália" },
  { name: "Berlim", tz: "Europe/Berlin", country: "Alemanha" },
  { name: "Moscou", tz: "Europe/Moscow", country: "Rússia" },
  { name: "Nova Deli", tz: "Asia/Kolkata", country: "Índia" },
  { name: "Singapura", tz: "Asia/Singapore", country: "Singapura" },
  { name: "Lisboa", tz: "Europe/Lisbon", country: "Portugal" },
  { name: "Roma", tz: "Europe/Rome", country: "Itália" },
];

export default function WorldClockTool() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTz, setSelectedTz] = useState<Timezone[]>(DEFAULT_TIMEZONES);
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTz = useMemo(() => {
    if (!search) return ALL_TIMEZONES.slice(0, 5);
    return ALL_TIMEZONES.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.country.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5);
  }, [search]);

  const addTimezone = (tz: typeof ALL_TIMEZONES[0]) => {
    if (selectedTz.find(t => t.tz === tz.tz)) return;
    setSelectedTz([...selectedTz, { ...tz, id: Math.random().toString() }]);
    setSearch("");
    setIsSearchOpen(false);
  };

  const removeTimezone = (id: string) => {
    setSelectedTz(selectedTz.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-widest rounded border border-indigo-500/20 uppercase mb-4">
          Tempo & Produtividade
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Relógio Mundial</h2>
        <p className="mt-4 text-slate-400">Acompanhe horários de diferentes cidades, visualize diferenças de fuso e ciclos de dia/noite em tempo real.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Clock List */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          <div className="flex justify-between items-center bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                   <Clock className="h-5 w-5" />
                </div>
                <div>
                   <h3 className="text-xs font-black text-white uppercase tracking-widest">Suas Cidades</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">{selectedTz.length} Localidades Ativas</p>
                </div>
             </div>
             
             <div className="relative">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 px-6 py-3"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Cidade
                </button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-72 bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden"
                    >
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input 
                          autoFocus
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-indigo-500/50"
                          placeholder="Buscar cidade..."
                        />
                      </div>
                      <div className="space-y-1">
                        {filteredTz.map((tz, i) => (
                          <button 
                            key={i}
                            onClick={() => addTimezone(tz)}
                            className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors group flex items-center justify-between"
                          >
                            <div>
                               <p className="text-xs font-bold text-white uppercase">{tz.name}</p>
                               <p className="text-[9px] text-slate-500 font-bold uppercase">{tz.country}</p>
                            </div>
                            <ChevronRight className="h-3 w-3 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
             {selectedTz.map((tz) => (
                <ClockCard 
                  key={tz.id} 
                  timezone={tz} 
                  currentTime={currentTime} 
                  onRemove={() => removeTimezone(tz.id)}
                />
             ))}
          </div>
        </div>

        {/* Info & Settings Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
           <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Globe className="h-48 w-48" />
              </div>
              
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400">
                       <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Seu Local</span>
                       <span className="text-white font-black uppercase text-sm">{Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()?.replace('_', ' ')}</span>
                    </div>
                 </div>

                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="text-5xl font-black text-white tracking-tighter tabular-nums">
                       {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                       <span className="text-lg opacity-20 ml-2">{currentTime.toLocaleTimeString('pt-BR', { second: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                       <Calendar className="h-3 w-3" />
                       <span className="text-[9px] font-black uppercase tracking-widest">{currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-amber-500">
                       <Info className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white">Curiosidade</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      O UTC (Tempo Universal Coordenado) é o padrão de tempo mundial. Diferente do GMT, ele não muda para o horário de verão.
                    </p>
                 </div>
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <MoveHorizontal className="h-4 w-4" />
                 </div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Diferença de Fuso</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium capitalize">
                Compare o horário das cidades com o seu local para agendar reuniões e chamadas globais sem confusão.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function ClockCard({ timezone, currentTime, onRemove }: { timezone: Timezone; currentTime: Date; onRemove: () => void }) {
  const localTimeStr = currentTime.toLocaleTimeString('pt-BR', { timeZone: timezone.tz, hour: '2-digit', minute: '2-digit', hour12: false });
  const localDateStr = currentTime.toLocaleDateString('pt-BR', { timeZone: timezone.tz, weekday: 'short', day: '2-digit', month: 'short' });
  
  const hour = parseInt(localTimeStr.split(':')[0]);
  const isNight = hour >= 18 || hour < 6;

  // Calculate offset difference
  const localDate = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone.tz }));
  const systemDate = new Date(currentTime.toLocaleString('en-US'));
  const diffHours = Math.round((localDate.getTime() - systemDate.getTime()) / (1000 * 60 * 60));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 rounded-[2.5rem] border group transition-all duration-500 ${
        isNight 
        ? 'bg-[#0A0A0B] border-indigo-500/10 shadow-2xl shadow-indigo-500/5' 
        : 'bg-[#111] border-white/5 shadow-xl'
      }`}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase">{timezone.name}</h3>
            {isNight ? <Moon className="h-3 w-3 text-indigo-400" /> : <Sun className="h-3 w-3 text-amber-500" />}
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{timezone.country}</p>
        </div>
        <button 
          onClick={onRemove}
          className="p-2 rounded-lg bg-white/5 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{localTimeStr}</span>
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{localDateStr}</span>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
              diffHours > 0 ? 'bg-emerald-500/10 text-emerald-500' : 
              diffHours < 0 ? 'bg-amber-500/10 text-amber-500' : 
              'bg-white/5 text-slate-500'
            }`}>
              {diffHours === 0 ? 'Mesmo fuso' : `${diffHours > 0 ? '+' : ''}${diffHours}h relativo`}
            </div>
         </div>
         <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
            {timezone.tz.replace('_', ' ')}
         </div>
      </div>

      {/* Background Glow */}
      <div className={`absolute -right-12 -bottom-12 h-40 w-40 rounded-full blur-[80px] pointer-events-none transition-all duration-700 opacity-20 ${
        isNight ? 'bg-indigo-600/30' : 'bg-transparent'
      }`} />
    </motion.div>
  );
}
