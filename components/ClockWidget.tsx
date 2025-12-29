
import React, { useState, useEffect } from 'react';

const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const dayName = time.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-black/5 shadow-sm w-full h-full">
      <div className="text-7xl md:text-6xl font-bold text-[#e2b089] tracking-tight tabular-nums leading-none">
        {hours}<span>:</span>{minutes}
      </div>
      <div className="mt-4 md:mt-2">
        <p className="text-[10px] md:text-[9px] font-bold tracking-[0.2em] text-[#e2b089] uppercase">
          {dayName}
        </p>
      </div>
    </div>
  );
};

export default ClockWidget;
