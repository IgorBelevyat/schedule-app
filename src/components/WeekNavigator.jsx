import { useAppContext } from '../context/AppContext';
import { useState, useEffect } from 'react';
import '../styles/WeekNavigator.css';

const WeekNavigator = () => {
  const { week, setWeek } = useAppContext();
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    // Припускаємо, що 1 вересня 2025 - понеділок (початок навчального року)
    const schoolYearStart = new Date(2025, 8, 1); // 1 вересня 2025
    const weekOffset = (week - 1) * 7;
    const monday = new Date(schoolYearStart);
    monday.setDate(schoolYearStart.getDate() + weekOffset);
    
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const format = (d) => d.toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
    
    setDateRange(`${format(monday)} – ${format(friday)}`);
  }, [week]);

  return (
    <div className="week-navigator">
      <div className="week-controls">
        <button 
          onClick={() => setWeek(week === 1 ? 2 : 1)} 
          className="week-button"
        >
          ⬅️
        </button>
        
        <div className="week-info">
          <div className="week-badge">
            <span className="week-badge-icon">📅</span>
            <span>Тиждень {week}</span>
          </div>
          <h2 className="date-range">{dateRange}</h2>
        </div>
        
        <button 
          onClick={() => setWeek(week === 1 ? 2 : 1)} 
          className="week-button"
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default WeekNavigator;