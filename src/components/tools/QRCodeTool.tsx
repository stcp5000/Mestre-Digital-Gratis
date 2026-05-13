import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import { Copy, Check, Download, Info } from "lucide-react";

export default function QRCodeTool() {
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
