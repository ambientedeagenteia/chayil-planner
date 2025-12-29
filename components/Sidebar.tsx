
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'INÍCIO' },
    { id: AppView.TASKS_HUB, label: 'CENTRAL DE TAREFAS' },
    { id: AppView.HEALTH_DIARY, label: 'DIÁRIO DA SAÚDE' },
    { id: AppView.SELF_CARE, label: 'AUTO CUIDADO' },
    { id: AppView.FAMILY_HUB, label: 'FAMÍLIA' },
    { id: AppView.WHEEL_OF_LIFE, label: 'RODA DA VIDA' },
    { id: AppView.HABIT_TRACKER, label: 'HÁBITOS' },
    { id: AppView.FINANCE_PERSONAL, label: 'FINANCEIRO PESSOAL' },
    { id: AppView.FINANCE_BUSINESS, label: 'FINANCEIRO EMPRESA' },
    { id: AppView.FINANCE_CONSOLIDATED, label: 'FINANCEIRO CONSOLIDADO' },
    { id: AppView.BUSINESS_HUB, label: 'GESTÃO DE EQUIPE' },
    { id: AppView.MARKETING_HUB, label: 'PLANEJAMENTO' },
    { id: AppView.CRM_HUB, label: 'CLIENTES' },
    { id: AppView.PLANNER_HUB, label: 'REUNIÕES' },
    { id: AppView.SETTINGS, label: 'CONFIGURAÇÕES' },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-[#fbe3d1] h-screen border-r border-black/5 flex-col fixed left-0 top-0 z-40 overflow-y-auto custom-scrollbar">
      <div className="p-8 text-center shrink-0">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-1">Planner</p>
        <h1 className="text-4xl font-normal text-black serif no-select flex justify-center items-end leading-none">
          Chay<span className="relative inline-block leading-none">ı<span className="absolute top-[2px] left-[1px] w-3 h-3 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4),2px_2px_4px_rgba(0,0,0,0.2)]" style={{ background: 'radial-gradient(circle at 35% 35%, #FFF9E3 0%, #D4AF37 40%, #8B6B10 100%)' }}></span></span>l
        </h1>
        <p className="text-[9px] tracking-[0.05em] text-gray-500 uppercase mt-4 font-semibold no-select">Para a Mulher Decidida a Prosperar</p>
      </div>
      
      <nav className="flex-1 px-3 space-y-1 mb-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
              currentView === item.id 
                ? 'bg-black text-white shadow-md' 
                : 'text-gray-600 hover:bg-black/5'
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
