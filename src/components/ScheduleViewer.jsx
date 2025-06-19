import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ScheduleViewer.css';

const days = [
  { name: 'Понеділок', color: 'border-l-blue-500', emoji: '📘' },
  { name: 'Вівторок', color: 'border-l-green-500', emoji: '📗' },
  { name: 'Середа', color: 'border-l-yellow-500', emoji: '📙' },
  { name: 'Четвер', color: 'border-l-purple-500', emoji: '📕' },
  { name: "П'ятниця", color: 'border-l-red-500', emoji: '📔' }
];

const ScheduleViewer = () => {
  const { selectedClass, week } = useAppContext();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getDayLessons = (dayNum) =>
    schedule
      .filter((s) => s.day === dayNum)
      .sort((a, b) => a.lessonNum - b.lessonNum);

  if (!selectedClass) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Виберіть клас</h3>
        <p className="text-gray-500">Оберіть клас зі списку зліва для перегляду розкладу</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📖 Розклад для класу {selectedClass.name}
        </h2>
        <p className="text-gray-600">📅 Тиждень {week}</p>
      </div>

      <div className="grid gap-6">
        {days.map((day, idx) => {
          const dayLessons = getDayLessons(idx + 1);
          
          return (
            <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{day.emoji}</span>
                  {day.name}
                </h3>
              </div>
              
              <div className="p-6">
                {dayLessons.length > 0 ? (
                  <div className="space-y-4">
                    {dayLessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className={`border-l-4 ${day.color} bg-gray-50 rounded-r-xl p-4 hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">🕐</span>
                              <span className="font-semibold text-gray-700">
                                Урок {lesson.lessonNum}
                              </span>
                            </div>
                            
                            <h4 className="text-lg font-bold text-gray-800 mb-2">
                              {lesson.subject}
                            </h4>
                            
                            {lesson.room && (
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <span className="text-lg">📍</span>
                                <span>Кабінет: {lesson.room}</span>
                              </div>
                            )}
                            
                            {lesson.groupCount > 1 && lesson.groups.length > 0 && (
                              <div className="flex items-start gap-2 text-gray-600">
                                <span className="text-lg">👥</span>
                                <div>
                                  <span className="font-medium">Групи:</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {lesson.groups.map((group, idx) => (
                                      <span 
                                        key={idx}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
                                      >
                                        {group}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">😴</div>
                    <p>Немає уроків</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleViewer;