import React, { useState, useMemo, useRef } from "react";
import { 
  MessageCircle, 
  Copy, 
  Download, 
  ExternalLink, 
  Smartphone, 
  Check, 
  AlertCircle,
  Share2,
  QrCode,
  Layout,
  Type
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";

export default function WhatsAppTool() {
  const [num, setNum] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Formatar número para exibição
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("55") && value.length > 2) {
      // Já tem o DDI do Brasil
    } else if (value.length > 0 && !value.startsWith("55")) {
      // Adiciona o DDI se não tiver (assumindo Brasil como padrão para conveniência, mas aceita tudo)
    }
    setNum(value);
  };

  const whatsappUrl = useMemo(() => {
    if (!num) return "";
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }, [num, msg]);

  const isValid = useMemo(() => {
    return num.length >= 10;
  }, [num]);

  const copyToClipboard = () => {
    if (!whatsappUrl) return;
    navigator.clipboard.writeText(whatsappUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 900, 900);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `qrcode-whatsapp-${num}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const PRESETS = [
    "Olá! Tenho interesse no produto.",
    "Gostaria de agendar uma visita.",
    "Pode me enviar a tabela de preços?",
    "Quero falar com um atendente."
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Comunicação e Vendas
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase">Link Direto WhatsApp</h2>
        <p className="mt-4 text-slate-400">Transforme cliques em conversas. Gere links curtos e QR Codes para facilitar o contato dos seus clientes.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                <span>Número de Telefone</span>
                <span className="text-emerald-500 lowercase font-bold tracking-normal italic flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Inclua DDI + DDD (Ex: 5511...)
                </span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                  <Smartphone className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={num}
                  onChange={handlePhoneChange}
                  className="w-full bg-[#111] border border-white/5 rounded-2xl py-5 px-14 outline-none focus:border-emerald-500 transition-all font-black text-2xl text-white tracking-tighter"
                  placeholder="5511999999999"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                <span>Mensagem Automática</span>
                <span className="text-slate-600">{msg.length}/140</span>
              </label>
              <div className="relative">
                 <div className="absolute left-4 top-5 text-slate-600">
                    <MessageCircle className="h-5 w-5" />
                 </div>
                 <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    maxLength={140}
                    className="w-full bg-[#111] border border-white/5 rounded-2xl py-5 px-14 h-32 outline-none focus:border-emerald-500 transition-all text-white font-medium resize-none"
                    placeholder="Olá, vim através do link..."
                 />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                 {PRESETS.map((p, i) => (
                    <button 
                      key={i} 
                      onClick={() => setMsg(p)}
                      className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-emerald-500/30 transition-all"
                    >
                       {p}
                    </button>
                 ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                    disabled={!isValid}
                    onClick={() => window.open(whatsappUrl, '_blank')}
                    className="flex-1 py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-30"
                >
                    <ExternalLink className="h-4 w-4" />
                    Testar Link
                </button>
                <button 
                    disabled={!isValid}
                    onClick={copyToClipboard}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all ${
                        copied ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"
                    } disabled:opacity-30`}
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copiado!" : "Copiar Link"}
                </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-5 space-y-6">
           {/* WhatsApp Chat Preview */}
           <div className="bg-[#0b141a] rounded-[2rem] p-6 shadow-2xl relative border-8 border-slate-900 min-h-[300px] flex flex-col">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-4">
                 <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <UserIcon />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-white mb-0.5">{num ? `+${num}` : "Seu Cliente"}</div>
                    <div className="text-[10px] text-emerald-500">visto por último hoje</div>
                 </div>
              </div>

              <div className="flex-1 space-y-4 py-4 flex flex-col justify-end">
                 {msg ? (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[80%] shadow-lg relative"
                    >
                       <p className="text-xs leading-relaxed">{msg}</p>
                       <span className="text-[8px] opacity-60 float-right mt-1 ml-4">12:34 ✓✓</span>
                    </motion.div>
                 ) : (
                    <div className="h-12 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-[10px] text-slate-600 uppercase font-black tracking-widest">
                       Aguardando mensagem...
                    </div>
                 )}
              </div>
           </div>

           {/* QR Code Container */}
           <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl">
              <div className="flex items-center gap-2 text-white w-full border-b border-white/5 pb-4">
                 <QrCode className="h-4 w-4 text-emerald-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Acesso Rápido via QR</span>
              </div>
              
              <div ref={qrRef} className={`p-4 bg-white rounded-2xl transition-all duration-700 ${isValid ? 'opacity-100 scale-100' : 'opacity-10 blur-sm scale-95'}`}>
                 <QRCodeSVG 
                    value={whatsappUrl || "https://wa.me/"} 
                    size={160}
                    level="H"
                    includeMargin
                 />
              </div>

              <button 
                disabled={!isValid}
                onClick={downloadQR}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-30"
              >
                 <Download className="h-3 w-3" />
                 Baixar QR Code PNG
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
    )
}
