
import React, { useEffect } from 'react';
import { AppState, NotionTask, AppView } from '../types';
import { QUOTES } from '../constants';
import ClockWidget from './ClockWidget';
import CalendarWidget from './CalendarWidget';

interface DashboardProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  setView: (view: AppView) => void;
}

const WHEEL_COLORS = [
  '#f16b63', '#f89c52', '#ebbf3e', '#53cc7a', '#39c29f', '#34bcd2', 
  '#5892f3', '#7b80f2', '#9c76f2', '#bc6cf2', '#d66bf2', '#f26bb0'
];

const Dashboard: React.FC<DashboardProps> = ({ state, updateState, setView }) => {
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const toggleTask = (id: string) => {
    const newTasks = state.tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateState({ tasks: newTasks });
  };

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
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

  const addTask = () => {
    const text = prompt("Nova tarefa:");
    if (text) {
      updateState({ tasks: [...state.tasks, { id: Date.now().toString(), text, completed: false }] });
    }
  };

  useEffect(() => {
    const lines = state.planning.diario.split('\n');
    const extractedTasksTexts = lines
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))
      .map(line => line.substring(1).trim())
      .filter(text => text.length > 0);

    const existingTaskTexts = new Set(state.tasks.map(t => t.text));
    const newTasksToAdd: NotionTask[] = [];

    extractedTasksTexts.forEach(text => {
      if (!existingTaskTexts.has(text)) {
        newTasksToAdd.push({
          id: `sync-${Date.now()}-${Math.random()}`,
          text,
          completed: false
        });
      }
    });

    if (newTasksToAdd.length > 0) {
      updateState({ tasks: [...state.tasks, ...newTasksToAdd] });
    }
  }, [state.planning.diario]);

  const activeTasks = state.tasks.filter(t => !t.completed).slice(0, 5);
  const upcomingMeetings = state.meetings.slice(0, 3);

  const handleInputResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  const size = 200;
  const center = size / 2;
  const maxRadius = 75;
  const getCoordinates = (angleInDegrees: number, radius: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: center + radius * Math.cos(angleInRadians),
      y: center + radius * Math.sin(angleInRadians),
    };
  };

  const mobileNavItems = [
    { id: AppView.TASKS_HUB, label: 'Tarefas' },
    { id: AppView.HEALTH_DIARY, label: 'Saúde' },
    { id: AppView.SELF_CARE, label: 'Cuidado' },
    { id: AppView.FAMILY_HUB, label: 'Família' },
    { id: AppView.FINANCE_PERSONAL, label: 'Fin. Pessoal' },
    { id: AppView.FINANCE_BUSINESS, label: 'Fin. Empresa' },
    { id: AppView.FINANCE_CONSOLIDATED, label: 'Consolidado' },
    { id: AppView.BUSINESS_HUB, label: 'Equipe' },
    { id: AppView.MARKETING_HUB, label: 'Marketing' },
    { id: AppView.CRM_HUB, label: 'Clientes' },
    { id: AppView.PLANNER_HUB, label: 'Reuniões' },
    { id: AppView.SETTINGS, label: 'Ajustes' },
  ];

  const totalHabitsCompleted = state.habits.reduce((acc, h) => acc + h.days.filter(d => d).length, 0);

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <div className="w-full h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-sm border border-black/5 relative mb-8">
        <img 
          src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Ffa68414b-c972-478f-8f7e-402d5ea3d09f%2F63eadfe2-e54d-4f64-80f2-ca010e987777%2FCapa_para_facebook_fotogrfico_modular_claro_(3).png?table=block&id=14858176-dc40-8020-878f-cde2c1152ac0&spaceId=fa68414b-c972-478f-8f7e-402d5ea3d09f&width=2000" 
          alt="Capa Chayil" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      <header className="border-b-2 border-black pb-8">
        <h1 className="text-3xl md:text-5xl font-black mb-4 serif leading-tight tracking-tight text-[#1a1a1a]">O seu Sucesso depende da sua Disciplina</h1>
        <p className="text-lg md:text-2xl text-gray-500 italic serif mb-4">
          Bem-vinda, <strong className="text-black">{state.userName || 'Chayil'}</strong>.
        </p>
        <div className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm italic text-gray-600 text-sm serif leading-relaxed">
          "{quote}"
        </div>
      </header>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-8 items-start">
        <div className="w-full md:col-span-1 space-y-6">
          <div className="h-[180px]">
            <ClockWidget />
          </div>
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
            <h3 className="text-[10px] font-bold tracking-widest uppercase mb-3 text-[#e2b089]">FOCO PRINCIPAL</h3>
            <textarea 
              value={state.focoHoje}
              onChange={(e) => updateState({ focoHoje: e.target.value })}
              onInput={handleInputResize}
              className="w-full bg-transparent border-none focus:ring-0 text-base italic text-gray-700 font-medium leading-relaxed resize-none p-0 overflow-hidden outline-none"
              style={{ minHeight: '140px' }}
              placeholder="Minha meta absoluta..."
            />
          </section>
        </div>

        <div className="w-full md:col-span-2 space-y-6">
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col overflow-hidden">
            <div className="bg-[#e2b089] px-6 py-4 flex justify-between items-center">
              <h3 className="text-white text-[10px] font-black tracking-[0.2em] uppercase serif">Tarefas do Dia</h3>
              <button onClick={addTask} className="text-white text-[9px] font-bold uppercase tracking-widest hover:underline opacity-80">+ Nova</button>
            </div>
            <div className="p-8 space-y-4">
              {activeTasks.length > 0 ? activeTasks.map(task => (
                <div key={task.id} className="flex items-center group bg-gray-50/50 p-4 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-[#e2b089]/20 transition-all">
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${task.completed ? 'bg-[#e2b089] border-[#e2b089]' : 'border-gray-200 hover:border-[#e2b089]'}`}
                  >
                    {task.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`ml-4 text-base font-medium transition-all ${task.completed ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                    {task.text}
                  </span>
                </div>
              )) : <p className="text-center py-4 text-xs text-gray-400 italic">Sem tarefas para agora.</p>}
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col overflow-hidden">
            <div className="bg-black px-6 py-4 flex justify-between items-center">
              <h3 className="text-white text-[10px] font-black tracking-[0.2em] uppercase serif">Agenda & Lembretes</h3>
              <button onClick={() => setView(AppView.PLANNER_HUB)} className="text-[#e2b089] text-[9px] font-bold uppercase tracking-widest hover:underline">Ver tudo</button>
            </div>
            <div className="p-6 space-y-3">
              {upcomingMeetings.length > 0 ? upcomingMeetings.map(meet => (
                <div key={meet.id} className="flex items-center gap-4 p-3 border-l-4 border-[#e2b089] bg-gray-50 rounded-r-xl">
                  <div className="text-center min-w-[50px]">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{meet.time}</p>
                    <p className="text-sm font-black">{meet.date.split('/')[0]}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{meet.title}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center py-4 text-xs text-gray-400 italic">Nenhum compromisso imediato.</p>
              )}
            </div>
          </section>
        </div>

        <div className="w-full md:col-span-1 space-y-6">
          <CalendarWidget />
          <section className="bg-[#1a1a1a] text-white p-6 rounded-3xl shadow-xl flex flex-col min-h-[220px]">
            <h3 className="text-[10px] font-bold tracking-widest uppercase mb-4 text-[#e2b089]">Afirmação Diária</h3>
            <div className="flex-1 flex items-center justify-center p-2">
               <p className="text-lg italic serif leading-relaxed text-center text-white">
                 "{state.dailyAffirmation}"
               </p>
            </div>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t-2 border-black/10">
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5 flex flex-col items-center relative">
          <h4 className="text-[10px] font-bold uppercase mb-6 tracking-widest text-center border-b border-[#e2b089]/30 pb-3 w-full text-gray-400">EQUILÍBRIO CHAYIL</h4>
          <div className="w-full flex justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
              {[2, 4, 6, 8, 10].map(r => (
                <circle key={r} cx={center} cy={center} r={(r/10)*maxRadius} fill="none" stroke="#f3f4f6" strokeWidth="1" />
              ))}
              {state.wheel.map((cat, idx) => {
                const startAngle = idx * (360 / state.wheel.length);
                const endAngle = (idx + 1) * (360 / state.wheel.length);
                const scoreRadius = (cat.score / 10) * maxRadius;
                const p1 = getCoordinates(startAngle, scoreRadius);
                const p2 = getCoordinates(endAngle, scoreRadius);
                return (
                  <path
                    key={idx}
                    d={`M ${center} ${center} L ${p1.x} ${p1.y} A ${scoreRadius} ${scoreRadius} 0 0 1 ${p2.x} ${p2.y} Z`}
                    fill={WHEEL_COLORS[idx % WHEEL_COLORS.length]}
                    fillOpacity="0.8"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>
          </div>
          <button onClick={() => setView(AppView.WHEEL_OF_LIFE)} className="text-[10px] font-bold uppercase text-[#e2b089] hover:underline mt-4 tracking-widest">ABRIR RODA DA VIDA</button>
        </section>

        <section className="bg-white/40 p-8 rounded-[2rem] border-2 border-dashed border-black/10 flex flex-col">
          <h3 className="text-[10px] font-bold tracking-widest uppercase mb-4 border-b border-black/5 pb-3 text-gray-500">INSIGHTS DA JORNADA</h3>
          <textarea 
            value={state.ideas}
            onChange={(e) => updateState({ ideas: e.target.value })}
            onInput={handleInputResize}
            className="w-full flex-1 bg-transparent border-none focus:ring-0 text-base leading-relaxed resize-none p-0 italic serif text-gray-600 overflow-hidden outline-none"
            style={{ minHeight: '200px' }}
            placeholder="Minhas descobertas de hoje..."
          />
        </section>
      </div>

      <section className="md:hidden pt-10 border-t-2 border-black/5 space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-center text-[#e2b089]">Hábitos Saudáveis</h3>
        
        {/* Tabela de Hábitos Mobile Ajustada */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-black/5 overflow-hidden">
          <div className="divide-y divide-black/5">
            {state.habits.slice(0, 12).map((habit, hIdx) => (
              <div key={habit.id} className="px-5 py-4 flex flex-col gap-3 hover:bg-gray-50/50 transition-colors">
                {/* Nome do hábito acima */}
                <div className="text-[11px] font-bold serif italic text-gray-700">{habit.name}</div>
                
                {/* Cabeçalho de dias compacto acima dos botões (apenas no primeiro item) */}
                {hIdx === 0 && (
                  <div className="grid grid-cols-7 gap-1.5 mb-0.5">
                    {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                      <div key={i} className="text-[8px] font-black uppercase text-[#e2b089] text-center">{d}</div>
                    ))}
                  </div>
                )}

                {/* Grid de 7 colunas para os dias da semana */}
                <div className="grid grid-cols-7 gap-1.5">
                  {habit.days.map((checked, i) => (
                    <button 
                      key={i} 
                      onClick={() => toggleHabitDay(habit.id, i)}
                      className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center ${checked ? 'bg-[#e2b089] border-[#e2b089] text-white shadow-sm' : 'border-black/5 bg-gray-50'}`}
                    >
                      {checked && <span className="text-[10px] font-black">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards de Stats e Reflexão - Estilo Imagem Mobile */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#1a1a1a] p-6 rounded-[2rem] text-white flex flex-col justify-center shadow-lg">
            <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-[#e2b089] mb-4">Total da Semana</h4>
            <div className="flex items-end gap-3">
              <p className="text-5xl font-black serif leading-none">{totalHabitsCompleted}</p>
              <p className="text-[8px] text-gray-500 uppercase tracking-widest font-black mb-1">Ações Concluídas</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
            <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-[#e2b089] mb-3">Reflexão sobre Disciplina</h4>
            <p className="text-xs text-gray-600 italic serif leading-relaxed">
              "A constância é a mãe da excelência. Cada marcação neste rastreador é um voto de confiança na mulher que você está se tornando."
            </p>
          </div>
        </div>
      </section>

      <section className="md:hidden pt-10 border-t-2 border-black/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-center text-gray-400">Painel de Acesso Chayil</h3>
        <div className="grid grid-cols-3 gap-3">
          {mobileNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="bg-[#e2b089] p-4 rounded-3xl border border-black/5 shadow-sm flex items-center justify-center active:scale-95 transition-all min-h-[60px]"
            >
              <span className="text-[11px] font-bold uppercase text-white text-center leading-tight tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="text-center py-12 opacity-30 text-[10px] font-bold tracking-[0.4em] uppercase">
        CHAYIL LUXURY PLANNER © 2026
      </footer>
    </div>
  );
};

export default Dashboard;
