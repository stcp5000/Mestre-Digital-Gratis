import React, { useState, useEffect } from "react";
import { Copy, Check, Trash2, Code, Braces, FileCode, Eraser, AlignLeft } from "lucide-react";

export default function HtmlConverterTool() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const encodeEntities = (str: string) => {
    return str.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);
  };

  const decodeEntities = (str: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  const cleanTags = (str: string) => {
    return str.replace(/<[^>]*>?/gm, '');
  };

  const textToHtml = (str: string) => {
    return str
      .split('\n')
      .map(line => line.trim() ? `<p>${line.trim()}</p>` : '')
      .filter(Boolean)
      .join('\n');
  };

  const minifyHtml = (str: string) => {
    return str
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  };

  const handleAction = (action: "encode" | "decode" | "clean" | "to-html" | "minify") => {
    if (!text) return;
    let output = "";
    switch (action) {
      case "encode": output = encodeEntities(text); break;
      case "decode": output = decodeEntities(text); break;
      case "clean": output = cleanTags(text); break;
      case "to-html": output = textToHtml(text); break;
      case "minify": output = minifyHtml(text); break;
    }
    setResult(output);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Web e Codificação
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Conversor HTML</h2>
        <p className="mt-4 text-slate-400">Converta textos para entidades HTML, limpe tags indesejadas ou minifique seu código de forma rápida.</p>
      </div>

      <div className="grid gap-6">
        <div className="relative">
          <label className="absolute -top-3 left-6 px-2 bg-[#050505] text-[9px] font-black uppercase tracking-widest text-slate-500">Entrada de Dados</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[200px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-white focus:border-emerald-500 outline-none leading-relaxed transition-all placeholder:text-slate-800"
            placeholder="Cole seu texto ou código HTML aqui..."
          />
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setText("")}
              className="p-2 text-slate-600 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => handleAction("to-html")}
            className="flex flex-col items-center gap-2 py-4 rounded-xl bg-[#1a1a1a] border border-white/5 text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all font-bold text-[9px] uppercase tracking-widest"
          >
            <AlignLeft className="h-4 w-4 text-emerald-500" /> Texto para HTML
          </button>
          <button
            onClick={() => handleAction("encode")}
            className="flex flex-col items-center gap-2 py-4 rounded-xl bg-[#1a1a1a] border border-white/5 text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all font-bold text-[9px] uppercase tracking-widest"
          >
            <Code className="h-4 w-4 text-emerald-500" /> Encode Entidades
          </button>
          <button
            onClick={() => handleAction("decode")}
            className="flex flex-col items-center gap-2 py-4 rounded-xl bg-[#1a1a1a] border border-white/5 text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all font-bold text-[9px] uppercase tracking-widest"
          >
            <FileCode className="h-4 w-4 text-emerald-500" /> Decode Entidades
          </button>
          <button
            onClick={() => handleAction("clean")}
            className="flex flex-col items-center gap-2 py-4 rounded-xl bg-[#1a1a1a] border border-white/5 text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all font-bold text-[9px] uppercase tracking-widest"
          >
            <Eraser className="h-4 w-4 text-emerald-500" /> Limpar Tags
          </button>
          <button
            onClick={() => handleAction("minify")}
            className="flex flex-col items-center gap-2 py-4 rounded-xl bg-[#1a1a1a] border border-white/5 text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all font-bold text-[9px] uppercase tracking-widest"
          >
            <Braces className="h-4 w-4 text-emerald-500" /> Minificar HTML
          </button>
        </div>

        <div className="relative">
          <label className="absolute -top-3 left-6 px-2 bg-[#050505] text-[9px] font-black uppercase tracking-widest text-emerald-500">Resultado Gerado</label>
          <div className="w-full min-h-[200px] rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-8 text-slate-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
            {result || <span className="text-slate-800 italic">O resultado aparecerá aqui...</span>}
          </div>
          {result && (
            <div className="absolute top-4 right-4">
              <button
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-all ${copied ? "bg-emerald-500 text-black" : "text-slate-600 hover:text-emerald-500"}`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-2">
           <button
             onClick={copyToClipboard}
             disabled={!result}
             className="flex items-center gap-3 rounded-2xl bg-white px-12 py-5 text-sm font-black text-black transition-all hover:bg-emerald-500 active:scale-95 shadow-2xl disabled:opacity-50"
           >
             {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
             {copied ? "COPIAR RESULTADO" : "COPIAR PARA O CLIPE"}
           </button>
        </div>
      </div>
    </div>
  );
}
