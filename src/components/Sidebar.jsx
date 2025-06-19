import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [classes, setClasses] = useState([]);
  const [expandedGrades, setExpandedGrades] = useState({});
  const { selectedClass, setSelectedClass } = useAppContext();

  useEffect(() => {
    axios.get('http://localhost:4000/api/classes').then(res => setClasses(res.data));
  }, []);

  const groupByGrade = (list) => {
    return list.reduce((acc, cls) => {
      acc[cls.grade] = acc[cls.grade] || [];
      acc[cls.grade].push(cls);
      return acc;
    }, {});
  };

  const toggleGrade = (grade) => {
    setExpandedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };

  const grouped = groupByGrade(classes);
  const sortedGrades = Object.keys(grouped).sort((a, b) => b - a); // 11, 10, 9...

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">
        📚 Класи
      </h2>
      
      {sortedGrades.map((grade) => (
        <div key={grade} className="grade-container">
          <div 
            onClick={() => toggleGrade(grade)}
            className="grade-header"
          >
            <span className="grade-title">{grade} клас</span>
            <span className={`grade-arrow ${expandedGrades[grade] ? 'expanded' : ''}`}>
              {expandedGrades[grade] ? '🔽' : '▶️'}
            </span>
          </div>
          
          {expandedGrades[grade] && (
            <div className="classes-list">
              {grouped[grade].map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`class-item ${selectedClass?.id === cls.id ? 'active' : ''}`}
                >
                  <span>{cls.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {sortedGrades.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p>Класи не знайдено</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;