
import React, { useState } from 'react';
import { AppState, WheelCategory, WheelEntry } from '../types';

interface WheelOfLifeProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const WHEEL_COLORS = [
  '#f16b63', // Carreira
  '#f89c52', // Finanças
  '#ebbf3e', // Saúde
  '#53cc7a', // Família
  '#39c29f', // Amor
  '#34bcd2', // Vida Social
  '#5892f3', // Crescimento
  '#7b80f2', // Recreação
  '#9c76f2', // Ambiente
  '#bc6cf2', // Contribuição
  '#d66bf2', // Espiritualidade
  '#f26bb0'  // Saúde Mental
];

const WheelOfLife: React.FC<WheelOfLifeProps> = ({ state, updateState }) => {
  const [currentWheel, setCurrentWheel] = useState<WheelCategory[]>(state.wheel);
  const [saved, setSaved] = useState(false);

  const handleScoreChange = (index: number, score: number) => {
    const newWheel = [...currentWheel];
    newWheel[index].score = score;
    setCurrentWheel(newWheel);
    setSaved(false);
  };

  const saveWheel = () => {
    const newEntry: WheelEntry = {
      date: new Date().toISOString(),
      categories: [...currentWheel]
    };
    updateState({
      wheel: currentWheel,
      wheelHistory: [newEntry, ...(state.wheelHistory || [])]
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const size = 1000;
  const center = size / 2;
  const maxRadius = 350; 
  const labelRadius = 375; 

  const getCoordinates = (angleInDegrees: number, radius: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: center + radius * Math.cos(angleInRadians),
      y: center + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20 max-w-7xl mx-auto px-4">
      <header className="border-b-2 border-black pb-8">
        <h2 className="text-5xl md:text-6xl serif font-black text-[#1a1a1a] tracking-tight text-center">Roda da Vida</h2>
        <p className="text-gray-500 text-xl mt-3 serif italic text-center">A clareza é o primeiro passo para a transformação.</p>
      </header>

      <div className="flex flex-col gap-12 items-center">
        
        {/* 1. Gráfico Visual Principal (Destaque Superior) */}
        <section className="w-full bg-white rounded-[3.5rem] shadow-2xl border border-black/5 p-4 md:p-12 flex flex-col items-center justify-center relative min-h-[600px] md:min-h-[900px] overflow-visible">
          <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[950px] h-auto overflow-visible">
            
            {/* Círculos de Grid */}
            {[2, 4, 6, 8, 10].map((r) => (
              <circle 
                key={r} cx={center} cy={center} r={(r / 10) * maxRadius}
                fill="none" stroke={r === 10 ? "#444" : "#eee"} 
                strokeWidth={r === 10 ? "1.5" : "1"}
                strokeDasharray={r === 10 ? "0" : "5 5"}
              />
            ))}

            {/* Numeração */}
            {[2, 4, 6, 8, 10].map((r) => (
              <text 
                key={`num-${r}`} 
                x={center} 
                y={center - (r / 10) * maxRadius - 8} 
                textAnchor="middle" 
                fontSize="16" 
                className="font-bold fill-gray-300 select-none"
              >
                {r}
              </text>
            ))}

            {/* Divisórias */}
            {currentWheel.map((_, idx) => {
              const angle = idx * (360 / currentWheel.length);
              const p = getCoordinates(angle, maxRadius);
              return <line key={`line-${idx}`} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#ddd" strokeWidth="1" />;
            })}

            {/* Fatias de Pontuação */}
            {currentWheel.map((cat, idx) => {
              const startAngle = idx * (360 / currentWheel.length);
              const endAngle = (idx + 1) * (360 / currentWheel.length);
              const scoreRadius = (cat.score / 10) * maxRadius;
              const p1 = getCoordinates(startAngle, scoreRadius);
              const p2 = getCoordinates(endAngle, scoreRadius);
              return (
                <path
                  key={`fill-${idx}`}
                  d={`M ${center} ${center} L ${p1.x} ${p1.y} A ${scoreRadius} ${scoreRadius} 0 0 1 ${p2.x} ${p2.y} Z`}
                  fill={WHEEL_COLORS[idx % WHEEL_COLORS.length]}
                  fillOpacity="0.85" stroke="#fff" strokeWidth="2"
                  className="transition-all duration-700 ease-out hover:fill-opacity-100"
                />
              );
            })}

            {/* Rótulos Tangenciais */}
            {currentWheel.map((cat, idx) => {
              const angle = (idx + 0.5) * (360 / currentWheel.length);
              const p = getCoordinates(angle, labelRadius);
              const isBottomHalf = angle > 90 && angle < 270;
              const rotation = isBottomHalf ? angle + 180 : angle;

              return (
                <text
                  key={`label-${idx}`}
                  x={p.x} y={p.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  className="font-black fill-[#222] uppercase tracking-tighter select-none"
                  transform={`rotate(${rotation}, ${p.x}, ${p.y})`}
                  style={{ filter: 'drop-shadow(0px 0px 2px rgba(255,255,255,0.8))' }}
                >
                  {cat.name}
                </text>
              );
            })}
          </svg>
          
          <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.8em] text-gray-200 pointer-events-none">
            CHAYIL EXECUTIVE ASSESSMENT
          </div>
        </section>

        {/* 2. Quadro de Calibração (Ajustes na parte inferior) */}
        <section className="w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-black/5 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-black/5 pb-8">
            <div className="text-center md:text-left">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#e2b089]">Quadro de Calibração</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium">Arraste os sliders para atualizar sua realidade atual.</p>
            </div>
            <button 
              onClick={() => {
                const reset = currentWheel.map(c => ({ ...c, score: 5 }));
                setCurrentWheel(reset);
              }}
              className="px-6 py-2 border border-black/10 rounded-full text-[9px] font-black uppercase text-gray-400 hover:text-black hover:border-black transition-all tracking-[0.2em]"
            >
              Resetar tudo para 5
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {currentWheel.map((cat, idx) => (
              <div key={cat.name} className="space-y-3 group">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">{cat.name}</label>
                  <span className="text-lg font-black leading-none" style={{ color: WHEEL_COLORS[idx % WHEEL_COLORS.length] }}>{cat.score}</span>
                </div>
                <div className="relative flex items-center">
                  <input 
                    type="range" min="1" max="10" value={cat.score} 
                    onChange={(e) => handleScoreChange(idx, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#e2b089]"
                    style={{ 
                        backgroundImage: `linear-gradient(to right, ${WHEEL_COLORS[idx % WHEEL_COLORS.length]} 0%, ${WHEEL_COLORS[idx % WHEEL_COLORS.length]} ${(cat.score - 1) * 11}%, transparent ${(cat.score - 1) * 11}%)`,
                        backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex justify-center">
            <button 
              onClick={saveWheel}
              className={`min-w-[300px] p-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-xl active:scale-95 ${
                saved ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-[#e2b089] hover:shadow-[#e2b089]/20'
              }`}
            >
              {saved ? '✓ Avaliação Salva com Sucesso' : 'Salvar Calibração Chayil'}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default WheelOfLife;
