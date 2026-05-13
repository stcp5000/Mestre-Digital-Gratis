import React, { useState, useEffect } from "react";
import { Copy, Check, Trash2, RefreshCw, FlipVertical, ArrowLeftRight, Repeat } from "lucide-react";

export default function TextInverterTool() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"reverse" | "words" | "upside" | "mirror">("reverse");
  const [copied, setCopied] = useState(false);

  const flipMap: Record<string, string> = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
    'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
    'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    'A': '∀', 'B': 'B', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ',
    'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '⊥',
    'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
    ',': "'", '.': '˙', '?': '¿', '!': '¡', '"': '„', "'": ',', '(': ')', ')': '(', '[': ']', ']': '[',
    '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾'
  };

  const transform = () => {
    if (!text) {
      setResult("");
      return;
    }

    let transformed = "";
    switch (mode) {
      case "reverse":
        transformed = text.split("").reverse().join("");
        break;
      case "words":
        transformed = text.split(/\s+/).reverse().join(" ");
        break;
      case "upside":
        transformed = text
          .split("")
          .map(char => flipMap[char] || char)
          .reverse()
          .join("");
        break;
      case "mirror":
        // Mirroring is essentially reverse but often implies visual symmetry
        // Here we just use the reverse logic as it's the standard for "espelhar"
        transformed = text.split("").reverse().join("");
        break;
    }
    setResult(transformed);
  };

  useEffect(() => {
    transform();
  }, [text, mode]);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modes = [
    { id: "reverse", label: "Inverter Letras", icon: Repeat },
    { id: "words", label: "Inverter Palavras", icon: ArrowLeftRight },
    { id: "upside", label: "De Cabeça para Baixo", icon: FlipVertical },
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Manipulação Criativa
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Inversor de Texto</h2>
        <p className="mt-4 text-slate-400">Inverta letras, ordene palavras de trás para frente ou deixe seu texto de cabeça para baixo para redes sociais e brincadeiras.</p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`flex items-center justify-center gap-3 py-4 rounded-xl border transition-all ${mode === m.id ? "bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-[#0A0A0A] border-white/10 text-slate-400 hover:border-emerald-500/50"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
           <div className="relative">
              <label className="absolute -top-3 left-6 px-2 bg-[#050505] text-[9px] font-black uppercase tracking-widest text-slate-500">Texto Original</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[250px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-white focus:border-emerald-500 outline-none leading-relaxed transition-all placeholder:text-slate-800"
                placeholder="Digite o texto aqui..."
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

           <div className="relative">
              <label className="absolute -top-3 left-6 px-2 bg-[#050505] text-[9px] font-black uppercase tracking-widest text-emerald-500">Resultado Invertido</label>
              <div className="w-full min-h-[250px] rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-8 text-slate-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
                {result || <span className="text-slate-800 italic">O resultado aparecerá aqui...</span>}
              </div>
              <div className="absolute top-4 right-4 cursor-pointer" onClick={copyToClipboard}>
                 {result && (
                    <div className={`p-2 rounded-lg transition-all ${copied ? "bg-emerald-500 text-black" : "text-slate-600 hover:text-emerald-500"}`}>
                       {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </div>
                 )}
              </div>
           </div>
        </div>

        <div className="flex justify-center pt-2">
           <button
             onClick={copyToClipboard}
             disabled={!result}
             className="flex items-center gap-3 rounded-2xl bg-white px-12 py-5 text-sm font-black text-black transition-all hover:bg-emerald-500 active:scale-95 shadow-2xl disabled:opacity-50"
           >
             {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
             {copied ? "COPIADO COM SUCESSO!" : "COPIAR RESULTADO"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Dica de Uso</h4>
            <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold">
               Use a opção "De Cabeça para Baixo" para criar nicks personalizados ou destacar sua bio nas redes sociais.
            </p>
         </div>
         <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Curiosidade</h4>
            <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold">
               Textos invertidos são frequentemente usados em desafios de leitura e em contextos de codificação simples.
            </p>
         </div>
      </div>
    </div>
  );
}
