
import React, { useState } from 'react';

const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();
  const today = new Date();

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = startDay(currentDate.getFullYear(), currentDate.getMonth());
    
    // Ajustado para início na Segunda (D=0, S=1, ..., S=6)
    // No JS GetDay(): 0=Dom, 1=Seg...
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    // Preenchimento do mês anterior
    for (let i = 0; i < offset; i++) {
      days.push(<div key={`empty-${i}`} className="h-6 flex items-center justify-center text-gray-200 text-[10px]"></div>);
    }

    // Dias do mês atual
    for (let i = 1; i <= totalDays; i++) {
      const isToday = today.getDate() === i && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
      days.push(
        <div key={i} className="h-7 flex items-center justify-center relative group cursor-default">
          <span className={`text-[10px] font-bold z-10 transition-all ${isToday ? 'text-white' : 'text-gray-600 group-hover:text-black'}`}>
            {i}
          </span>
          {isToday && (
            <div className="absolute w-6 h-6 bg-[#e2b089] rounded-lg shadow-sm z-0"></div>
          )}
          {!isToday && (
             <div className="absolute w-5 h-5 bg-black/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-black/5 w-full flex flex-col transition-all">
      <div className="bg-[#e2b089] px-4 py-2 flex justify-between items-center">
        <button onClick={handlePrevMonth} className="text-white hover:scale-125 transition-transform">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="text-white text-[9px] font-black tracking-[0.2em] uppercase serif">{monthName} {year}</h3>
        <button onClick={handleNextMonth} className="text-white hover:scale-125 transition-transform">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="p-2 grid grid-cols-7 gap-0.5">
        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(day => (
          <div key={day} className="h-5 flex items-center justify-center text-[8px] font-black text-[#e2b089]/60 tracking-widest">{day}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarWidget;
