import React, { useState, useMemo, useEffect } from "react";
import { 
  Instagram, 
  Copy, 
  Check, 
  Sparkles, 
  Type, 
  Smile, 
  Hash, 
  Layout, 
  Info,
  RefreshCcw,
  Camera,
  Heart,
  Grid,
  Bookmark,
  Target,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const BIO_TEMPLATES: { [key: string]: string[] } = {
  profesional: [
    "🚀 Ajudando marcas a escalar no digital\n📍 São Paulo, SP\n👇 Comece aqui",
    "💼 Especialista em Marketing Digital\n📈 +100 clientes satisfeitos\n📩 Direct para orçamentos",
    "Founder da @SuaEmpresa\nConsultoria & Estratégia\n✨ Transformando ideias em lucro",
  ],
  criativo: [
    "🎨 Criando arte no caos do cotidiano\n✨ Acredito na magia dos pequenos detalhes\n☕ Movido a café e design",
    "A vida é curta demais para bios chatas 🌈\n📸 Explorando o mundo uma foto por vez\n✨ Sonhadora profissional",
    "Capturando a essência através das lentes 📸\n🌌 Amante das estrelas e do mar\n✨ Vibes & Versos",
  ],
  minimalista: [
    "Just being me.\n✨ 📍 RJ",
    "God is good.\n🙏 🕯️",
    "Less is more.\n🌿 ✨",
  ],
  engracado: [
    "Minha vida é 90% café e 10% esquecer onde deixei o celular ☕",
    "Criança profissional com anos de experiência em fingir ser adulto 🤡",
    "Eu não sou preguiçoso, estou em modo de economia de energia 🔋",
  ]
};

const FANCY_FONTS = [
  { name: "Normal", transform: (t: string) => t },
  { name: "Serif", transform: (t: string) => t.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97);
    return c;
  })},
  { name: "Script", transform: (t: string) => t.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D49C + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4B6 + code - 97);
    return c;
  })},
  { name: "Monospace", transform: (t: string) => t.replace(/[a-zA-Z0-9]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97);
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + code - 48);
    return c;
  })},
  { name: "Double Struck", transform: (t: string) => t.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D552 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + code - 65 + 32);
    return c;
  })},
];

export default function InstagramBioTool() {
  const [bio, setBio] = useState("✨ Criando novas histórias\n📍 São Paulo\n👇 Saiba mais");
  const [category, setCategory] = useState("profesional");
  const [copied, setCopied] = useState(false);
  const [activeFont, setActiveFont] = useState(0);

  // Smart Fields
  const [role, setRole] = useState("");
  const [deliverable, setDeliverable] = useState("");

  const characterCount = bio.length;
  const isOverLimit = characterCount > 150;

  const transformedBio = useMemo(() => {
    return FANCY_FONTS[activeFont].transform(bio);
  }, [bio, activeFont]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transformedBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const randomizeBio = () => {
    const options = BIO_TEMPLATES[category];
    const random = options[Math.floor(Math.random() * options.length)];
    setBio(random);
  };

  const generateSmartBio = () => {
    if (!role && !deliverable) return;
    
    const r = role || "Especialista";
    const d = deliverable || "Soluções Incríveis";

    const templates = [
      `🚀 Especialista em ${r}\n✨ Te ajudo com ${d}\n📩 Direct para orçamentos`,
      `💼 ${r}\n📈 Focado em entregar ${d}\n📍 São Paulo, SP`,
      `✨ Transformando ${d} através de ${r}\n🚀 Vamos escalar juntos\n👇 Saiba mais`,
      `${r} | Criatividade & Valor\n🎯 Foco em ${d}\n✨ ✨ ✨`
    ];

    const random = templates[Math.floor(Math.random() * templates.length)];
    setBio(random);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-pink-500/10 text-pink-500 text-[10px] font-black tracking-widest rounded border border-pink-500/20 uppercase mb-4">
          Marketing & Social
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Editor de Bios Instagram</h2>
        <p className="mt-4 text-slate-400">Gere ideias criativas, conte caracteres e use fontes especiais para destacar seu perfil.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Editor Area */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          {/* Smart Generator & Configuration */}
          <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-pink-500/10 shadow-2xl space-y-8">
            {/* 1. As Perguntas */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-pink-500 mb-2">
                   <Sparkles className="h-4 w-4" />
                   <h5 className="text-[10px] font-black uppercase tracking-widest">Configuração Inicial</h5>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Briefcase className="h-3 w-3" /> O que você faz?
                      </label>
                      <input 
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Ex: Designer, Social Media"
                          className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500 transition-all font-medium"
                      />
                  </div>
                  <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Target className="h-3 w-3" /> O que entrega?
                      </label>
                      <input 
                          type="text"
                          value={deliverable}
                          onChange={(e) => setDeliverable(e.target.value)}
                          placeholder="Ex: Resultados, Identidade"
                          className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500 transition-all font-medium"
                      />
                  </div>
              </div>
            </div>

            {/* 2. Estilos de Fontes */}
            <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-white">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">2. Estilos de Fontes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {FANCY_FONTS.map((f, i) => (
                        <button 
                            key={f.name}
                            onClick={() => setActiveFont(i)}
                            className={`px-4 py-2 rounded-xl border text-[10px] font-bold transition-all ${activeFont === i ? 'bg-pink-500/10 border-pink-500/30 text-pink-500' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                        >
                            {f.transform(f.name)}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Temas Sugeridos */}
            <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-white">
                    <Layout className="h-4 w-4 text-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">3. Temas sugeridos</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                     {Object.keys(BIO_TEMPLATES).map(cat => (
                         <button 
                            key={cat}
                            onClick={() => { setCategory(cat); randomizeBio(); }}
                            className={`px-3 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                         >
                            {cat}
                         </button>
                     ))}
                </div>
            </div>

            {/* 4. Emojis Populares */}
            <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-pink-500">
                    <Smile className="h-4 w-4" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest">4. Emojis Populares</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                    {["✨", "🚀", "📍", "💼", "📸", "☕", "👇", "🔥", "🌈", "🎨", "🌿", "📈", "📩", " Founder", "Consultoria"].map(e => (
                        <button 
                            key={e} 
                            onClick={() => setBio(prev => prev + e)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-sm"
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            {/* 5. Sugerir Bio Personalizada */}
            <div className="pt-6 border-t border-white/5">
                <button 
                    onClick={generateSmartBio}
                    disabled={!role && !deliverable}
                    className="w-full py-5 bg-pink-500 text-white rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-pink-500/20 hover:bg-pink-400 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    <RefreshCcw className="h-5 w-5 group-active:rotate-180 transition-transform duration-500" />
                    Sugerir Bio Personalizada
                </button>
            </div>
          </div>

          {/* 6. Resultado */}
          <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Instagram className="h-64 w-64" />
             </div>

             <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Type className="h-3 w-3" /> 6. Resultado Final
                    </label>
                    <div className={`text-[10px] font-black flex items-center gap-2 ${isOverLimit ? 'text-rose-500' : 'text-slate-500'}`}>
                        {characterCount}/150 {isOverLimit && <span className="uppercase text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Limite Excedido</span>}
                    </div>
                </div>

                <div className="relative group">
                    <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={`w-full bg-[#111] border rounded-2xl p-6 h-48 outline-none transition-all text-white font-medium resize-none text-lg ${isOverLimit ? 'border-rose-500/50' : 'border-white/5 focus:border-pink-500'}`}
                        placeholder="Escreva sua bio aqui..."
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                       <button 
                        onClick={randomizeBio}
                        title="Gerar Idéia Aleatória"
                        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-pink-500/30 text-slate-400 hover:text-pink-500 transition-all active:scale-95"
                       >
                          <RefreshCcw className="h-4 w-4" />
                       </button>
                       <button 
                        onClick={copyToClipboard}
                        className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all active:scale-95 ${copied ? 'bg-emerald-500 text-black' : 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 hover:bg-pink-400'}`}
                       >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? 'Copiado!' : 'Copiar Bio'}
                       </button>
                    </div>
                </div>
             </div>
          </div>


          <div className="bg-pink-500/5 border border-pink-500/10 p-6 rounded-3xl flex gap-6 items-center">
            <div className="h-12 w-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
               <Info className="h-6 w-6" />
            </div>
            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Dica de Estratégia</h4>
               <p className="text-slate-500 text-[10px] font-bold uppercase leading-relaxed">
                  Use quebras de linha para tornar a bio escaneável. Uma boa bio tem: Quem você é + O que você faz + Call to Action (Chamada para ação).
               </p>
            </div>
          </div>
        </div>

        {/* Preview Area (Instagram Mockup) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl flex flex-col h-[500px] border-8 border-slate-900 relative overflow-hidden group">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                 <div className="w-10" />
                 <div className="text-[10px] font-bold text-black uppercase tracking-widest">seu_perfil</div>
                 <Instagram className="h-5 w-5 text-black" />
              </div>

              <div className="py-6 flex gap-6 items-center">
                 <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                    <div className="h-full w-full rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-400">
                        <Camera className="h-8 w-8" />
                    </div>
                 </div>
                 <div className="flex-1 flex justify-between px-2">
                    <div className="text-center font-bold"><div className="text-black">128</div><div className="text-[8px] text-slate-400 uppercase">Posts</div></div>
                    <div className="text-center font-bold"><div className="text-black">5.2k</div><div className="text-[8px] text-slate-400 uppercase">Seguidores</div></div>
                    <div className="text-center font-bold"><div className="text-black">432</div><div className="text-[8px] text-slate-400 uppercase">Seguindo</div></div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <div className="text-[11px] font-bold text-black">Seu Nome</div>
                    <div className="text-[11px] text-slate-400">Criador de conteúdo ou nicho</div>
                 </div>
                 
                 <div className={`text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap ${isOverLimit ? 'text-rose-500/50' : ''}`}>
                    {transformedBio}
                 </div>

                 <div className="flex gap-2">
                    <button className="flex-1 h-8 bg-slate-100 rounded-md text-[10px] font-bold text-black">Editar Perfil</button>
                    <button className="flex-1 h-8 bg-slate-100 rounded-md text-[10px] font-bold text-black">Compartilhar</button>
                 </div>
              </div>

              <div className="mt-8 flex justify-between border-t border-slate-100 py-3">
                 <Grid className="h-5 w-5 text-slate-400" />
                 <Bookmark className="h-5 w-5 text-slate-400" />
                 <Heart className="h-5 w-5 text-slate-400" />
              </div>

              <div className="flex-1 grid grid-cols-3 gap-1 overflow-hidden">
                 {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-100 animate-pulse" />
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
