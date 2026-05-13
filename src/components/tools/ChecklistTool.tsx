import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Check, X, Download } from "lucide-react";

export default function ChecklistTool() {
  const [items, setItems] = useState<{id: number, text: string, done: boolean}[]>(() => {
    const saved = localStorage.getItem("checklist-v1");
    // Use the default items if nothing is saved or if parsing fails
    try {
      return saved ? JSON.parse(saved) : [
        { id: 1, text: "Lançamento de Produto Digital", done: false },
        { id: 2, text: "Otimização de Checkout", done: true },
        { id: 3, text: "Escala de Tráfego Pago", done: false }
      ];
    } catch (e) {
      return [
        { id: 1, text: "Lançamento de Produto Digital", done: false },
        { id: 2, text: "Otimização de Checkout", done: true },
        { id: 3, text: "Escala de Tráfego Pago", done: false }
      ];
    }
  });
  const [newText, setNewText] = useState("");

  useEffect(() => {
    localStorage.setItem("checklist-v1", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newText.trim()) return;
    setItems([...items, { id: Date.now(), text: newText, done: false }]);
    setNewText("");
  };

  const toggle = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
    if (!items.find(i => i.id === id)?.done) {
       confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#06b6d4'] });
    }
  };

  const remove = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const exportToTxt = () => {
    const listTitle = "CHECKLIST - MESTRE DIGITAL\n" + "=".repeat(26) + "\n\n";
    const content = items
      .map(item => `${item.done ? "[X]" : "[ ]"} ${item.text}`)
      .join("\n");
    
    const blob = new Blob([listTitle + content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "checklist-mestre-digital.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest rounded border border-cyan-500/20 uppercase mb-4">
            Organização e Foco
          </span>
          <h2 className="text-4xl font-extrabold text-white tracking-tighter">Checklist de Projetos</h2>
        </div>
        <button 
          onClick={exportToTxt}
          className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <Download className="h-4 w-4" /> Exportar .TXT
        </button>
      </div>

      <div className="flex gap-2 p-2 rounded-2xl bg-[#0A0A0A] ring-1 ring-white/10">
        <input 
          type="text" 
          value={newText} 
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="flex-1 bg-transparent p-4 text-white focus:outline-none"
          placeholder="Qual a próxima meta estratégica?"
        />
        <button onClick={addItem} className="rounded-xl bg-white px-8 py-2 font-black text-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors">ADICIONAR</button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`flex items-center gap-6 rounded-2xl p-6 transition-all border border-white/5 ${item.done ? "bg-[#0A0A0A] opacity-40" : "bg-[#1a1a1a] shadow-xl"}`}
          >
            <button 
              onClick={() => toggle(item.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all ${item.done ? "bg-cyan-500 border-cyan-500" : "border-white/10"}`}
            >
              {item.done && <Check className="h-5 w-5 text-black" />}
            </button>
            <span className={`flex-1 font-bold tracking-tight text-lg ${item.done ? "line-through text-slate-500" : "text-white"}`}>
              {item.text}
            </span>
            <button onClick={() => remove(item.id)} className="text-slate-700 hover:text-red-500 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
