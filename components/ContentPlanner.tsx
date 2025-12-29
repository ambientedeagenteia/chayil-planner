
import React, { useState } from 'react';
// Removed non-existent ContentIdea type import as it is not exported from '../types'
import { generateContentIdeas } from '../services/geminiService';

const ContentPlanner: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [ideas, setIdeas] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!niche) return;
    setLoading(true);
    const result = await generateContentIdeas(niche);
    setIdeas(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Planejador de Conteúdo 📱</h2>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand">
        <h3 className="text-lg font-bold text-brand mb-4">Gerador de Ideias com IA</h3>
        <p className="text-gray-500 mb-6 text-sm">Digite seu nicho e deixe a Gemini criar ganchos de conteúdo estratégicos para você.</p>
        
        <div className="flex gap-4">
          <input 
            type="text" 
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Ex: Moda Sustentável, Consultoria Financeira..." 
            className="flex-1 border-brand border rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-brand text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
          >
            {loading ? 'Pensando...' : 'Gerar Ideias'}
          </button>
        </div>

        {ideas && (
          <div className="mt-8 p-6 bg-soft-rose rounded-xl border border-brand/30 animate-fade-in">
            <h4 className="font-bold text-brand mb-4 flex items-center gap-2">
              <span>💡</span> Ideias Geradas
            </h4>
            <div className="prose prose-sm text-gray-700 whitespace-pre-line">
              {ideas}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand text-center">
          <span className="text-4xl">📸</span>
          <h4 className="mt-2 font-bold text-gray-700">Instagram</h4>
          <p className="text-xs text-gray-400">Posts, Reels, Stories</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand text-center">
          <span className="text-4xl">🎬</span>
          <h4 className="mt-2 font-bold text-gray-700">TikTok</h4>
          <p className="text-xs text-gray-400">Trends e Entretenimento</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand text-center">
          <span className="text-4xl">💼</span>
          <h4 className="mt-2 font-bold text-gray-700">LinkedIn</h4>
          <p className="text-xs text-gray-400">Autoridade e Networking</p>
        </div>
      </div>
    </div>
  );
};

export default ContentPlanner;
