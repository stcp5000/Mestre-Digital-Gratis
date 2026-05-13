import React, { useState } from "react";
import { Copy, Check, Trash2, Eraser, Link as LinkIcon, FileText } from "lucide-react";

export default function AccentRemoverTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const slugify = (str: string) => {
    return removeAccents(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const cleanEncoding = (str: string) => {
    // Attempt to fix common UTF-8 vs ISO-8859-1 double encoding issues
    // This is a basic map of common corruption patterns
    const map: Record<string, string> = {
      "Ã¡": "á", "Ã©": "é", "Ã­": "í", "Ã³": "ó", "Ãº": "ú",
      "Ã ": "à", "Ã¢": "â", "Ãª": "ê", "Ã´": "ô", "Ã£": "ã",
      "Ãµ": "õ", "Ã§": "ç", "Ã": "Á", "Ã": "É", "Ã": "Í",
      "Ã": "Ó", "Ã": "Ú", "Ã": "À", "Ã": "Â", "Ã": "Ê",
      "Ã": "Ô", "Ã": "Ã", "Ã": "Õ", "Ã": "Ç"
    };
    let result = str;
    Object.keys(map).forEach(key => {
      result = result.replace(new RegExp(key, 'g'), map[key]);
    });
    return result;
  };

  const handleAction = (action: "remove" | "slug" | "clean") => {
    if (action === "remove") setText(removeAccents(text));
    if (action === "slug") setText(slugify(text));
    if (action === "clean") setText(cleanEncoding(text));
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Limpeza e Padronização
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Removedor de Acentos</h2>
        <p className="mt-4 text-slate-400">Limpe seus textos removendo acentuações, corrigindo erros de codificação ou gerando slugs amigáveis para URLs.</p>
      </div>

      <div className="grid gap-6">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-white focus:border-emerald-500 outline-none leading-relaxed transition-all placeholder:text-slate-700"
            placeholder="Cole seu texto com acentos ou caracteres corrompidos aqui..."
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setText("")}
              className="p-2 text-slate-600 hover:text-red-500 transition-colors"
              title="Limpar"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleAction("remove")}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-xs uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            <Eraser className="h-4 w-4 text-emerald-500" /> Remover Acentos
          </button>
          <button
            onClick={() => handleAction("slug")}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-xs uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            <LinkIcon className="h-4 w-4 text-emerald-500" /> Gerar Slug URL
          </button>
          <button
            onClick={() => handleAction("clean")}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#1a1a1a] border border-white/5 text-white font-bold text-xs uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
          >
            <FileText className="h-4 w-4 text-emerald-500" /> Corrigir Codificação
          </button>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={copyToClipboard}
            disabled={!text}
            className={`flex items-center gap-3 rounded-2xl bg-white px-12 py-5 text-sm font-black text-black transition-all hover:bg-emerald-500 active:scale-95 shadow-2xl disabled:opacity-50`}
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? "COPIADO!" : "COPIAR RESULTADO"}
          </button>
        </div>
      </div>
      
      <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-6">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Quando usar?</h4>
        <ul className="text-xs text-slate-500 space-y-2 uppercase font-bold tracking-tight">
          <li>• Limpar legendas ou arquivos de texto com caracteres estranhos (Ex: Ã¡).</li>
          <li>• Converter títulos em URLs amigáveis para SEO.</li>
          <li>• Padronizar dados para sistemas que não aceitam acentuação brasileira.</li>
        </ul>
      </div>
    </div>
  );
}
