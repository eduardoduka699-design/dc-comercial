import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function DatePicker({ selectedDate, onSelectDate, onClear, isDarkMode = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Initial view year and month
  const initialDate = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Sync view month/year when selectedDate changes externally
  useEffect(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-').map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        setViewYear(parts[0]);
        setViewMonth(parts[1] - 1);
      }
    }
  }, [selectedDate]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const formatYMD = (year, month, day) => {
    const m = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const handleSelectDay = (day) => {
    const dateStr = formatYMD(viewYear, viewMonth + 1, day);
    onSelectDate(dateStr);
    setIsOpen(false);
  };

  const handleSelectToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    const dateStr = formatYMD(today.getFullYear(), today.getMonth() + 1, today.getDate());
    onSelectDate(dateStr);
    setIsOpen(false);
  };

  const handleSelectYesterday = (e) => {
    e.stopPropagation();
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const dateStr = formatYMD(yest.getFullYear(), yest.getMonth() + 1, yest.getDate());
    onSelectDate(dateStr);
    setIsOpen(false);
  };

  // Calendar calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const isToday = (day) => {
    const now = new Date();
    return now.getFullYear() === viewYear && now.getMonth() === viewMonth && now.getDate() === day;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const parts = selectedDate.split('-').map(Number);
    return parts[0] === viewYear && parts[1] === (viewMonth + 1) && parts[2] === day;
  };

  const formatButtonDisplay = () => {
    if (!selectedDate) return null;
    const parts = selectedDate.split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[2])) {
      const d = String(parts[2]).padStart(2, '0');
      const m = String(parts[1]).padStart(2, '0');
      return `${d}/${m}/${parts[0]}`;
    }
    return selectedDate;
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors border select-none ${
          selectedDate
            ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/40 shadow-sm'
            : isDarkMode
              ? 'text-white/70 hover:text-white hover:bg-white/5 border-transparent'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent'
        }`}
        title="Clique para abrir o calendário e selecionar um dia específico"
      >
        <CalendarIcon size={14} className={selectedDate ? 'text-brand-blue' : isDarkMode ? 'text-white/50' : 'text-gray-400'} />
        <span>{formatButtonDisplay() || 'Selecionar dia'}</span>
        
        {selectedDate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-0.5 rounded-full hover:bg-brand-blue/20 text-brand-blue transition-colors ml-0.5"
            title="Limpar data selecionada"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Calendar Dropdown Popover */}
      {isOpen && (
        <div 
          className={`absolute left-0 mt-2 z-50 w-72 rounded-2xl shadow-2xl border p-4 animate-in fade-in zoom-in-95 duration-150 ${
            isDarkMode 
              ? 'bg-[#151515] border-white/10 text-white shadow-black/80' 
              : 'bg-white border-gray-200 text-gray-900 shadow-gray-400/30'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Month & Year Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Mês anterior"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="text-sm font-bold tracking-wide">
              {MONTH_NAMES[viewMonth]} <span className="opacity-60 font-medium">{viewYear}</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Próximo mês"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAY_NAMES.map((name, i) => (
              <div 
                key={i} 
                className={`text-[10px] font-bold uppercase tracking-wider py-1 ${
                  i === 0 || i === 6 
                    ? isDarkMode ? 'text-red-400/60' : 'text-red-500/70' 
                    : isDarkMode ? 'text-white/30' : 'text-gray-400'
                }`}
              >
                {name}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Trailing days of previous month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const prevDay = daysInPrevMonth - firstDayOfWeek + i + 1;
              return (
                <div 
                  key={`prev-${i}`} 
                  className={`h-8 flex items-center justify-center text-xs opacity-20 select-none ${
                    isDarkMode ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {prevDay}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 mx-auto rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                    selected
                      ? 'bg-brand-blue text-white font-bold shadow-md shadow-brand-blue/30 scale-105'
                      : today
                        ? isDarkMode
                          ? 'border border-brand-blue text-brand-blue font-bold hover:bg-brand-blue/20'
                          : 'border border-brand-blue text-brand-blue font-bold hover:bg-brand-blue/10'
                        : isDarkMode
                          ? 'hover:bg-white/10 text-white/90 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-800'
                  }`}
                  title={`${day} de ${MONTH_NAMES[viewMonth]} de ${viewYear}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className={`mt-3 pt-3 border-t flex items-center justify-between gap-1 text-[11px] ${
            isDarkMode ? 'border-white/10' : 'border-gray-200'
          }`}>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleSelectToday}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={handleSelectYesterday}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Ontem
              </button>
            </div>

            {selectedDate && (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
