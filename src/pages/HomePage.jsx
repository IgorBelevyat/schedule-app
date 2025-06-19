import { useState, useEffect } from 'react';
import axios from 'axios';
import LoginModal from '../components/LoginModal';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedGrade, setSelectedGrade] = useState(11);
  const [selectedClass, setSelectedClass] = useState(null);
  const [week, setWeek] = useState(1);
  const [expandedGrades, setExpandedGrades] = useState({ 11: true });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [idleTimeout, setIdleTimeout] = useState(null);
  
  // Дані з бази
  const [classes, setClasses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const grades = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  
  const days = [
    { name: 'Понеділок', color: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' },
    { name: 'Вівторок', color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
    { name: 'Середа', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    { name: 'Четвер', color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
    { name: "П'ятниця", color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
  ];

  // Завантаження класів
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/classes');
        setClasses(response.data);
        
        // Автоматично вибрати перший клас 11 класу
        const class11 = response.data.find(cls => cls.grade === 11);
        if (class11 && !selectedClass) {
          setSelectedClass(class11);
        }
      } catch (error) {
        console.error('Помилка завантаження класів:', error);
      }
    };

    fetchClasses();
  }, []);

  // Завантаження розкладу
  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      axios
        .get(`http://localhost:4000/api/schedule?classId=${selectedClass.id}&week=${week}`)
        .then((res) => {
          setSchedule(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedClass, week]);

  // Оновлення часу кожну секунду
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Автоматичне повернення на головну через 3 хвилини бездіяльності
  useEffect(() => {
    const resetTimeout = () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      setIdleTimeout(setTimeout(() => {
        const class11 = classes.find(cls => cls.grade === 11);
        if (class11) {
          setSelectedGrade(11);
          setSelectedClass(class11);
          setExpandedGrades({ 11: true });
        }
      }, 180000)); // 3 хвилини
    };

    resetTimeout();
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimeout, true));

    return () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      events.forEach(event => document.removeEventListener(event, resetTimeout, true));
    };
  }, [idleTimeout, classes]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('uk-UA', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleGrade = (grade) => {
    setExpandedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };

  const selectClass = (classObj) => {
    setSelectedGrade(classObj.grade);
    setSelectedClass(classObj);
  };

  // Групування класів за паралелями
  const getClassesByGrade = (grade) => {
    return classes.filter(cls => cls.grade === grade);
  };

  const getCurrentLesson = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const lessonTimes = [
      { start: 8 * 60 + 30, end: 9 * 60 + 15, lesson: 1 },
      { start: 9 * 60 + 25, end: 10 * 60 + 10, lesson: 2 },
      { start: 10 * 60 + 30, end: 11 * 60 + 15, lesson: 3 },
      { start: 11 * 60 + 25, end: 12 * 60 + 10, lesson: 4 },
      { start: 12 * 60 + 20, end: 13 * 60 + 5, lesson: 5 },
      { start: 13 * 60 + 25, end: 14 * 60 + 10, lesson: 6 },
      { start: 14 * 60 + 20, end: 15 * 60 + 5, lesson: 7 },
      { start: 15 * 60 + 15, end: 16 * 60 + 0, lesson: 8 },
    ];

    return lessonTimes.find(time => currentTime >= time.start && currentTime <= time.end);
  };

  const getDayLessons = (dayNum) =>
    schedule
      .filter((s) => s.day === dayNum)
      .sort((a, b) => a.lessonNum - b.lessonNum);

  const currentLesson = getCurrentLesson();

  const handleSuccessLogin = () => {
    setShowAdminLogin(false);
    navigate('/admin');
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #581c87 100%)',
    display: 'flex'
  };

  const sidebarStyle = {
    width: '384px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflowY: 'auto'
  };

  const sidebarHeaderStyle = {
    padding: '24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white'
  };

  const mainContentStyle = {
    flex: 1,
    padding: '24px',
    overflowY: 'auto'
  };

  const headerStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    marginBottom: '24px'
  };

  const scheduleGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px'
  };

  const dayCardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar з класами */}
      <div style={sidebarStyle}>
        {/* Header сайдбару */}
        <div style={sidebarHeaderStyle}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            📚 Класи
          </h2>
          <p style={{ color: 'rgba(191, 219, 254, 1)', marginTop: '8px', margin: 0 }}>
            Оберіть клас для перегляду розкладу
          </p>
        </div>

        {/* Список класів */}
        <div style={{ padding: '16px' }}>
          {grades.map((grade) => {
            const gradeClasses = getClassesByGrade(grade);
            if (gradeClasses.length === 0) return null;

            return (
              <div key={grade} style={{ 
                background: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                overflow: 'hidden',
                border: '2px solid #f3f4f6',
                marginBottom: '12px'
              }}>
                <button
                  onClick={() => toggleGrade(grade)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #dbeafe 0%, #ddd6fe 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)';
                  }}
                >
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                    {grade} клас
                  </span>
                  <span style={{ fontSize: '24px', color: expandedGrades[grade] ? '#3b82f6' : '#6b7280' }}>
                    {expandedGrades[grade] ? '🔽' : '▶️'}
                  </span>
                </button>
                
                {expandedGrades[grade] && (
                  <div style={{ padding: '12px', background: '#f9fafb' }}>
                    {gradeClasses.map((classObj) => (
                      <button
                        key={classObj.id}
                        onClick={() => selectClass(classObj)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          marginBottom: '8px',
                          textAlign: 'left',
                          borderRadius: '12px',
                          border: selectedClass?.id === classObj.id ? 'none' : '2px solid transparent',
                          background: selectedClass?.id === classObj.id 
                            ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
                            : 'white',
                          color: selectedClass?.id === classObj.id ? 'white' : '#1f2937',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: selectedClass?.id === classObj.id ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: selectedClass?.id === classObj.id 
                            ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedClass?.id !== classObj.id) {
                            e.target.style.background = '#dbeafe';
                            e.target.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedClass?.id !== classObj.id) {
                            e.target.style.background = 'white';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {classObj.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Основний контент */}
      <div style={mainContentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', margin: 0 }}>
                📖 Розклад класу {selectedClass ? selectedClass.name : ''}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', fontSize: '18px', color: '#4b5563', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📅</span>
                  <span style={{ fontWeight: '600' }}>{formatDate(currentTime)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🕐</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{formatTime(currentTime)}</span>
                </div>
              </div>
              {currentLesson && (
                <div style={{ 
                  marginTop: '12px', 
                  background: '#dcfce7', 
                  color: '#166534', 
                  padding: '8px 16px', 
                  borderRadius: '12px', 
                  display: 'inline-block' 
                }}>
                  <span style={{ fontWeight: 'bold' }}>
                    🔔 Зараз {currentLesson.lesson}-й урок
                  </span>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '16px', padding: '4px' }}>
                <button
                  onClick={() => setWeek(1)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: week === 1 ? '#3b82f6' : 'transparent',
                    color: week === 1 ? 'white' : '#4b5563',
                    boxShadow: week === 1 ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  Тиждень 1
                </button>
                <button
                  onClick={() => setWeek(2)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: week === 2 ? '#3b82f6' : 'transparent',
                    color: week === 2 ? 'white' : '#4b5563',
                    boxShadow: week === 2 ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  Тиждень 2
                </button>
              </div>
              
              <button
                onClick={() => setShowAdminLogin(true)}
                style={{
                  background: '#374151',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#1f2937';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#374151';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #dbeafe',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : selectedClass ? (
          <div style={scheduleGridStyle}>
            {days.map((day, dayIndex) => {
              const dayLessons = getDayLessons(dayIndex + 1);
              
              return (
                <div key={day.name} style={dayCardStyle}>
                  <div style={{
                    padding: '16px',
                    color: 'white',
                    textAlign: 'center',
                    background: day.color
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{day.name}</h3>
                  </div>
                  
                  <div style={{ padding: '16px', minHeight: '600px' }}>
                    {dayLessons.length > 0 ? (
                      dayLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          style={{
                            padding: '12px',
                            borderRadius: '16px',
                            marginBottom: '12px',
                            border: '2px solid',
                            borderColor: currentLesson?.lesson === lesson.lessonNum && dayIndex === new Date().getDay() - 1
                              ? '#22c55e' : '#e5e7eb',
                            background: currentLesson?.lesson === lesson.lessonNum && dayIndex === new Date().getDay() - 1
                              ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                              : '#f9fafb',
                            transition: 'all 0.3s ease',
                            animation: currentLesson?.lesson === lesson.lessonNum && dayIndex === new Date().getDay() - 1
                              ? 'pulse 2s infinite' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: '#1e40af',
                              background: '#dbeafe',
                              padding: '4px 8px',
                              borderRadius: '8px'
                            }}>
                              Урок {lesson.lessonNum}
                            </span>
                            {currentLesson?.lesson === lesson.lessonNum && dayIndex === new Date().getDay() - 1 && (
                              <span style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#15803d',
                                background: '#dcfce7',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                animation: 'bounce 1s infinite'
                              }}>
                                Зараз
                              </span>
                            )}
                          </div>
                          
                          <h4 style={{ 
                            fontWeight: 'bold', 
                            fontSize: '16px', 
                            color: '#1f2937', 
                            marginBottom: '8px',
                            margin: '0 0 8px 0'
                          }}>
                            {lesson.subject}
                          </h4>
                          
                          {lesson.groupCount > 1 && lesson.groups.length > 0 ? (
                            <div>
                              <p style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563', margin: '0 0 4px 0' }}>
                                Групи:
                              </p>
                              <div>
                                {lesson.groups.map((group, idx) => (
                                  <div key={idx} style={{
                                    fontSize: '12px',
                                    background: '#dbeafe',
                                    color: '#1e40af',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    marginBottom: '4px',
                                    display: 'inline-block',
                                    marginRight: '4px'
                                  }}>
                                    {group}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : lesson.room ? (
                            <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>
                              📍 Кабінет: <span style={{ fontWeight: '600' }}>{lesson.room}</span>
                            </p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>😴</div>
                        <p style={{ margin: 0 }}>Немає уроків</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#4b5563', marginBottom: '8px', margin: '0 0 8px 0' }}>
              Виберіть клас
            </h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Оберіть клас зі списку зліва для перегляду розкладу
            </p>
          </div>
        )}
      </div>

      {/* Модалка логіну */}
      {showAdminLogin && (
        <LoginModal 
          onClose={() => setShowAdminLogin(false)} 
          onSuccess={handleSuccessLogin} 
        />
      )}

      {/* Додаємо CSS анімації */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;