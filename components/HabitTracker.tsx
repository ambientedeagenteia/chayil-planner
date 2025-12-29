
import React from 'react';
import { AppState, Habit } from '../types';

interface HabitTrackerProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ state, updateState }) => {
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const toggleDay = (habitId: string, dayIndex: number) => {
    const newHabits = state.habits.map(h => {
      if (h.id === habitId) {
        const newDays = [...h.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...h, days: newDays };
      }
      return h;
    });
    updateState({ habits: newHabits });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="border-b-2 border-black pb-8">
        <h2 className="text-5xl md:text-6xl serif font-black text-[#1a1a1a] tracking-tight">Rastreador de Hábitos</h2>
        <p className="text-gray-500 text-xl mt-3 serif italic">"Sua disciplina é o seu maior ativo estratégico."</p>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-black/5 overflow-hidden">
        <div className="bg-[#e2b089] px-8 py-6">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Hábito Virtuoso</span>
            </div>
            <div className="col-span-7 grid grid-cols-7 gap-1 text-center">
              {weekDays.map(day => (
                <span key={day} className="text-white text-[10px] font-black uppercase tracking-widest">{day}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-black/5">
          {state.habits.map((habit) => (
            <div key={habit.id} className="px-8 py-6 grid grid-cols-12 gap-4 items-center hover:bg-gray-50/50 transition-colors">
              <div className="col-span-5">
                <p className="text-sm font-bold text-gray-800 serif italic">{habit.name}</p>
              </div>
              <div className="col-span-7 grid grid-cols-7 gap-1">
                {habit.days.map((checked, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleDay(habit.id, idx)}
                    className={`h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                      checked 
                        ? 'bg-[#e2b089] border-[#e2b089] text-white shadow-md' 
                        : 'border-black/5 bg-gray-50/50 hover:border-[#e2b089]/30 text-transparent'
                    }`}
                  >
                    {checked && <span className="text-[10px] font-black">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        <div className="bg-[#1a1a1a] p-8 rounded-3xl text-white">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e2b089] mb-4">Total da Semana</h4>
          <p className="text-4xl font-black serif">
            {state.habits.reduce((acc, h) => acc + h.days.filter(d => d).length, 0)}
          </p>
          <p className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest font-bold">Ações Concluídas</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e2b089] mb-4">Reflexão sobre Disciplina</h4>
          <p className="text-sm text-gray-600 italic serif leading-relaxed">
            "A constância é a mãe da excelência. Cada marcação neste rastreador é um voto de confiança na mulher que você está se tornando."
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
