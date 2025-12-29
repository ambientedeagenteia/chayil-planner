
import React, { useState } from 'react';
import { getBusinessAdvice } from '../services/geminiService';

const AICoach: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askCoach = async () => {
    if (!input) return;
    setLoading(true);
    const advice = await getBusinessAdvice(input);
    setResponse(advice);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Seu Coach Digital</h2>
        <p className="text-gray-500 italic">"Pense em mim como sua parceira de estratégia disponível 24/7."</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-black/5 relative">
        <div className="absolute -top-4 -left-4 bg-black text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">
          Inteligência Artificial
        </div>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: Estou com dificuldade de fechar vendas no Instagram. O que eu deveria mudar na minha abordagem?"
          className="w-full h-40 border-none focus:ring-0 text-gray-700 text-lg placeholder-gray-300 resize-none bg-transparent serif italic outline-none"
        ></textarea>

        <div className="flex justify-end mt-4">
          <button 
            onClick={askCoach}
            disabled={loading}
            className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#D4AF37] transition-all disabled:opacity-50 shadow-lg active:scale-95"
          >
            {loading ? 'Consultando as Estrelas...' : 'Pedir Conselho Estratégico'}
          </button>
        </div>
      </div>

      {response && (
        <div className="bg-white p-8 rounded-3xl shadow-md border-l-8 border-black animate-fade-in">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center serif italic">
             Resposta da Coach:
          </h3>
          <div className="text-gray-700 leading-relaxed space-y-4 text-sm serif">
            {response.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <button 
            onClick={() => setResponse(null)}
            className="mt-6 text-[9px] text-gray-400 hover:text-black uppercase font-black tracking-widest"
          >
            Limpar Conversa
          </button>
        </div>
      )}
    </div>
  );
};

export default AICoach;
