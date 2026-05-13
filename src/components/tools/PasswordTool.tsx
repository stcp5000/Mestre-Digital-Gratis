import React, { useState, useEffect, useCallback } from "react";
import { Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export default function PasswordTool() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = "";
    let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lowercase = "abcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (options.excludeSimilar) {
      uppercase = uppercase.replace(/[OIL]/g, "");
      lowercase = lowercase.replace(/[l]/g, "");
      numbers = numbers.replace(/[01]/g, "");
    }

    if (options.uppercase) charset += uppercase;
    if (options.lowercase) charset += lowercase;
    if (options.numbers) charset += numbers;
    if (options.symbols) charset += symbols;

    if (charset === "") {
      setPassword("");
      return;
    }

    let generated = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += charset.charAt(array[i] % charset.length);
    }
    setPassword(generated);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateStrength = () => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 8) score++;
    if (password.length > 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = calculateStrength();

  return (
    <div className="space-y-10 text-left">
      <div className="max-w-xl">
        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest rounded border border-emerald-500/20 uppercase mb-4">
          Segurança Cibernética
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Gerador de Senhas Fortes</h2>
        <p className="mt-4 text-slate-400">Crie senhas seguras e aleatórias para proteger suas contas digitais contra acessos não autorizados.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Comprimento: {length}</label>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { id: "uppercase", label: "Incluir Maiúsculas (A-Z)" },
              { id: "lowercase", label: "Incluir Minúsculas (a-z)" },
              { id: "numbers", label: "Incluir Números (0-9)" },
              { id: "symbols", label: "Incluir Símbolos (!@#$)" },
              { id: "excludeSimilar", label: "Evitar caracteres similares (i, l, 1, L, o, 0, O)" },
            ].map((opt) => (
              <div 
                key={opt.id}
                onClick={() => setOptions({ ...options, [opt.id]: !options[opt.id as keyof typeof options] })}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${options[opt.id as keyof typeof options] ? "bg-emerald-500 border-emerald-500" : "border-white/10"}`}>
                  {options[opt.id as keyof typeof options] && <Check className="h-3 w-3 text-black" />}
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <div className="w-full min-h-[80px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 text-emerald-400 font-mono text-xl break-all flex items-center justify-center text-center">
              {password || <span className="text-slate-700 italic">Selecione uma opção</span>}
            </div>
            <div className="absolute top-2 right-2">
               <button onClick={generatePassword} className="p-2 text-slate-600 hover:text-emerald-500 transition-colors">
                  <RefreshCw className="h-4 w-4" />
               </button>
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Força da Senha</span>
                <span className={`${strength <= 2 ? 'text-red-500' : strength <= 4 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                   {strength <= 2 ? 'Fraca' : strength <= 4 ? 'Média' : 'Muito Forte'}
                </span>
             </div>
             <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all ${i <= strength ? (strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-yellow-500' : 'bg-emerald-500') : 'bg-white/5'}`}
                  />
                ))}
             </div>
          </div>

          <button
            onClick={copyToClipboard}
            disabled={!password}
            className={`w-full flex items-center justify-center gap-3 rounded-xl py-4 text-sm font-black transition-all active:scale-95 shadow-xl ${copied ? "bg-emerald-500 text-black px-0" : "bg-white text-black hover:bg-emerald-500 disabled:opacity-50"}`}
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? "COPIADO COM SUCESSO!" : "COPIAR SENHA"}
          </button>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3 text-left">
             <div className="mt-1">
                {strength <= 3 ? <ShieldAlert className="h-4 w-4 text-yellow-500" /> : <ShieldCheck className="h-4 w-4 text-emerald-500" />}
             </div>
             <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest">
                Dica: Nunca reutilize senhas em diferentes sites. Use um gerenciador de senhas para armazenar suas credenciais com segurança.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
