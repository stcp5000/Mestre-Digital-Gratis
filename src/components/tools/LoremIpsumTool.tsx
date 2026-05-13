import React, { useState, useEffect } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumTool() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [includeHTML, setIncludeHTML] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = () => {
    const length = Math.floor(Math.random() * 10) + 5;
    const words = Array.from({ length }, generateWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ") + ".";
  };

  const generateParagraph = () => {
    const length = Math.floor(Math.random() * 5) + 3;
    return Array.from({ length }, generateSentence).join(" ");
  };

  const generate = () => {
    let result = "";
    if (type === "paragraphs") {
      const paras = Array.from({ length: count }, generateParagraph);
      result = includeHTML ? paras.map(p => `<p>${p}</p>`).join("\n") : paras.join("\n\n");
    } else if (type === "sentences") {
      result = Array.from({ length: count }, generateSentence).join(" ");
    } else {
      result = Array.from({ length: count }, generateWord).join(" ");
      result = result.charAt(0).toUpperCase() + result.slice(1) + ".";
    }
    setGeneratedText(result);
  };

  useEffect(() => {
    generate();
  }, [count, type, includeHTML]);

  const copy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Conteúdo Estratégico
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Gerador Lorem Ipsum</h2>
        <p className="mt-4 text-slate-400">Gere textos de preenchimento profissionais para seus layouts, sites e protótipos.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Unidade</label>
            <div className="grid grid-cols-3 gap-2">
              {(["paragraphs", "sentences", "words"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all ${type === t ? "bg-emerald-500 border-emerald-500 text-black px-0" : "bg-[#0A0A0A] border-white/10 text-slate-400 hover:border-emerald-500/50"}`}
                >
                  {t === "paragraphs" ? "Parágrafos" : t === "sentences" ? "Frases" : "Palavras"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Quantidade</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIncludeHTML(!includeHTML)}>
            <div className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${includeHTML ? "bg-emerald-500 border-emerald-500" : "border-white/10"}`}>
               {includeHTML && <Check className="h-4 w-4 text-black" />}
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">Incluir Tags HTML &lt;p&gt;</span>
          </div>

          <div className="pt-4">
            <button
              onClick={copy}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white py-4 text-sm font-black text-black transition-all hover:bg-emerald-500 active:scale-95 shadow-xl"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copied ? "COPIADO!" : "COPIAR TUDO"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
           <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 min-h-[300px] max-h-[500px] overflow-y-auto">
              <div className="absolute top-4 right-4">
                 <button onClick={generate} className="p-2 text-slate-600 hover:text-emerald-500 transition-colors">
                    <RefreshCw className="h-5 w-5" />
                 </button>
              </div>
              <div className="font-serif text-slate-300 leading-relaxed whitespace-pre-wrap">
                 {generatedText}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
