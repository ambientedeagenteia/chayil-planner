
import React, { useState } from 'react';
import { AppState, NotionTask } from '../types';

interface TasksHubProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

type Recurrence = 'diario' | 'semanal' | 'quinzenal' | 'mensal' | 'bimestral' | 'semestral' | 'anual';

const recurrenceLabels: Record<Recurrence, string> = {
  diario: 'Diário',
  semanal: 'Semanal',
  quinzenal: 'Quinzenal',
  mensal: 'Mensal',
  bimestral: 'Bimestral',
  semestral: 'Semestral',
  anual: 'Anual'
};

const recurrenceColors: Record<Recurrence, string> = {
  diario: 'bg-blue-50 text-blue-600 border-blue-100',
  semanal: 'bg-purple-50 text-purple-600 border-purple-100',
  quinzenal: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  mensal: 'bg-rose-50 text-rose-600 border-rose-100',
  bimestral: 'bg-orange-50 text-orange-600 border-orange-100',
  semestral: 'bg-teal-50 text-teal-600 border-teal-100',
  anual: 'bg-amber-50 text-amber-600 border-amber-100'
};

const TasksHub: React.FC<TasksHubProps> = ({ state, updateState }) => {
  const [filter, setFilter] = useState<Recurrence | 'todos'>('todos');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskRecurrence, setNewTaskRecurrence] = useState<Recurrence>('diario');

  const filteredTasks = filter === 'todos' 
    ? state.tasks 
    : state.tasks.filter(t => t.recurrence === filter);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: NotionTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      recurrence: newTaskRecurrence
    };
    updateState({ tasks: [...state.tasks, newTask] });
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    updateState({
      tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    });
  };

  const updateTaskRecurrence = (id: string, newRec: Recurrence) => {
    updateState({
      tasks: state.tasks.map(t => t.id === id ? { ...t, recurrence: newRec } : t)
    });
  };

  const deleteTask = (id: string) => {
    updateState({
      tasks: state.tasks.filter(t => t.id !== id)
    });
  };

  const completedCount = filteredTasks.filter(t => t.completed).length;
  const progress = filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="border-b-2 border-black pb-8">
        <h2 className="text-5xl md:text-6xl serif font-black text-[#1a1a1a] tracking-tight">Central de Tarefas</h2>
        <p className="text-gray-500 text-xl mt-3 serif italic">Gestão rítmica e intencional dos seus compromissos.</p>
      </header>

      {/* Filtros de Visualização */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('todos')}
          className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
            filter === 'todos' ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-black/5 hover:text-black'
          }`}
        >
          Ver Tudo
        </button>
        {(Object.keys(recurrenceLabels) as Recurrence[]).map((rec) => (
          <button
            key={rec}
            onClick={() => setFilter(rec)}
            className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
              filter === rec ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-black/5 hover:text-black'
            }`}
          >
            {recurrenceLabels[rec]}
          </button>
        ))}
      </div>

      {/* Form de Adição Unificado */}
      <form onSubmit={addTask} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="O que precisa ser feito?"
          className="flex-1 w-full bg-gray-50/50 border-black/10 border rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none serif italic"
        />
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={newTaskRecurrence}
            onChange={(e) => setNewTaskRecurrence(e.target.value as Recurrence)}
            className="bg-gray-50 border-black/10 border rounded-2xl px-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-[#D4AF37]"
          >
            {(Object.keys(recurrenceLabels) as Recurrence[]).map(r => (
              <option key={r} value={r}>{recurrenceLabels[r]}</option>
            ))}
          </select>
          <button 
            type="submit"
            className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#e2b089] transition-all shadow-md whitespace-nowrap"
          >
            Agendar
          </button>
        </div>
      </form>

      {/* Lista de Tarefas Dinâmica */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-black/5 overflow-hidden">
        <div className="bg-[#e2b089] px-8 py-4 flex justify-between items-center">
          <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
            Lista de Execução ({filteredTasks.length})
          </h3>
          {filter !== 'todos' && (
            <span className="text-white/80 text-[9px] font-bold uppercase tracking-widest italic">
              Filtrado por: {recurrenceLabels[filter as Recurrence]}
            </span>
          )}
        </div>
        
        <div className="divide-y divide-black/5">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="px-8 py-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 min-w-[1.5rem] rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed ? 'bg-[#e2b089] border-[#e2b089]' : 'border-black/10 hover:border-[#e2b089]'
                    }`}
                  >
                    {task.completed && <span className="text-white text-xs">✓</span>}
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-base font-medium serif italic transition-all ${
                      task.completed ? 'line-through text-gray-300' : 'text-gray-700'
                    }`}>
                      {task.text}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Etiqueta de Recorrência (clicável para mudar) */}
                  <select
                    value={task.recurrence || 'diario'}
                    onChange={(e) => updateTaskRecurrence(task.id, e.target.value as Recurrence)}
                    className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all cursor-pointer appearance-none text-center ${
                      recurrenceColors[task.recurrence as Recurrence || 'diario']
                    }`}
                    style={{ minWidth: '90px' }}
                  >
                    {(Object.keys(recurrenceLabels) as Recurrence[]).map(r => (
                      <option key={r} value={r}>{recurrenceLabels[r]}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-[9px] font-black uppercase text-red-300 hover:text-red-500 tracking-widest transition-all p-2"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-gray-300 italic text-sm serif">
              Sua lista de tarefas está limpa. Que tal planejar algo novo?
            </div>
          )}
        </div>
      </div>

      {/* Indicador de Progresso Dinâmico */}
      <div className="bg-[#1a1a1a] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e2b089] opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e2b089] mb-2">Monitor de Consistência</h4>
            <p className="text-sm text-gray-400 serif italic max-w-md">
              {filter === 'todos' 
                ? "Você concluiu " + completedCount + " de todas as suas tarefas planejadas."
                : "Seu progresso nas tarefas " + recurrenceLabels[filter as Recurrence] + " está em " + progress + "%."}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64" cy="64" r="54"
                  fill="none" stroke="currentColor" strokeWidth="8"
                  className="text-[#e2b089]"
                  strokeDasharray={339.29}
                  strokeDashoffset={339.29 - (339.29 * progress) / 100}
                />
              </svg>
              <span className="absolute text-3xl font-black serif text-[#e2b089]">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksHub;
