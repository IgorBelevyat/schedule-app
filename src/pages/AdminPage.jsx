import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [grade, setGrade] = useState(11);
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [notification, setNotification] = useState('');

  const [lessonData, setLessonData] = useState({
    week: 1,
    day: 1,
    lessonNum: 1,
    subject: '',
    room: '',
    groupCount: 1,
    groups: '',
  });

  // Завантажити класи
  const fetchClasses = () => {
    axios.get('http://localhost:4000/api/classes').then(res => setClasses(res.data));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Показати сповіщення
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  // Додати клас
  const handleAddClass = () => {
    if (!name) {
      showNotification('Введіть назву класу', 'error');
      return;
    }
    
    axios
      .post('http://localhost:4000/api/admin/class', { grade: Number(grade), name })
      .then(() => {
        setName('');
        fetchClasses();
        showNotification('✅ Клас успішно додано!');
      })
      .catch(() => {
        showNotification('❌ Помилка при додаванні класу', 'error');
      });
  };

  // Додати розклад
  const handleAddSchedule = () => {
    if (!selectedClass) {
      showNotification('Виберіть клас', 'error');
      return;
    }
    
    if (!lessonData.subject) {
      showNotification('Введіть назву предмета', 'error');
      return;
    }

    const groups = lessonData.groups.split(',').map(g => g.trim()).filter(g => g);
    
    axios.post('http://localhost:4000/api/admin/schedule', {
      ...lessonData,
      groupCount: Number(lessonData.groupCount),
      groups: groups,
      classId: selectedClass.id,
    }).then(() => {
      setLessonData({ 
        ...lessonData, 
        subject: '', 
        room: '', 
        groups: '' 
      });
      showNotification('✅ Урок успішно додано!');
    }).catch(() => {
      showNotification('❌ Помилка при додаванні уроку', 'error');
    });
  };

  const days = [
    { value: 1, label: 'Понеділок' },
    { value: 2, label: 'Вівторок' },
    { value: 3, label: 'Середа' },
    { value: 4, label: 'Четвер' },
    { value: 5, label: "П'ятниця" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Сповіщення */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="container mx-auto p-6">
        {/* Хедер */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-lg"
              >
                <span>⬅️</span>
                <span>Повернутися</span>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-3xl font-bold text-gray-800">⚙️ Адмін-панель</h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Додати клас */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <span className="text-2xl">🏫</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Додати клас</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Клас (номер)
                </label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(g => (
                    <option key={g} value={g}>{g} клас</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Назва класу
                </label>
                <input
                  type="text"
                  placeholder="Наприклад: 11А, 11Б..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleAddClass}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors"
              >
                <span className="text-xl">➕</span>
                Додати клас
              </button>
            </div>
          </div>

          {/* Вибір класу для розкладу */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <span className="text-2xl">📅</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Виберіть клас</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Клас для редагування розкладу
              </label>
              <select
                onChange={(e) => {
                  const classId = e.target.value;
                  setSelectedClass(classes.find(c => c.id === Number(classId)) || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Оберіть клас --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.grade} клас - {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedClass && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-700 font-medium">
                  ✅ Обрано: {selectedClass.grade} клас - {selectedClass.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Додати урок */}
        {selectedClass && (
          <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-xl">
                <span className="text-2xl">🕐</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Додати урок для {selectedClass.name}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тиждень
                </label>
                <select
                  value={lessonData.week}
                  onChange={(e) => setLessonData({ ...lessonData, week: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1-й тиждень</option>
                  <option value={2}>2-й тиждень</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  День тижня
                </label>
                <select
                  value={lessonData.day}
                  onChange={(e) => setLessonData({ ...lessonData, day: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {days.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер уроку
                </label>
                <select
                  value={lessonData.lessonNum}
                  onChange={(e) => setLessonData({ ...lessonData, lessonNum: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} урок</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📚 Предмет *
                </label>
                <input
                  type="text"
                  placeholder="Наприклад: Математика"
                  value={lessonData.subject}
                  onChange={(e) => setLessonData({ ...lessonData, subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Кабінет
                </label>
                <input
                  type="text"
                  placeholder="Наприклад: 2-205"
                  value={lessonData.room}
                  onChange={(e) => setLessonData({ ...lessonData, room: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👥 Кількість груп
                </label>
                <select
                  value={lessonData.groupCount}
                  onChange={(e) => setLessonData({ ...lessonData, groupCount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 група (весь клас)</option>
                  <option value={2}>2 групи</option>
                  <option value={3}>3 групи</option>
                </select>
              </div>

              {lessonData.groupCount > 1 && (
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏢 Кабінети груп (через кому)
                  </label>
                  <input
                    type="text"
                    placeholder="Наприклад: 1-411, 2-203, 1-116"
                    value={lessonData.groups}
                    onChange={(e) => setLessonData({ ...lessonData, groups: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Вкажіть кабінети для кожної групи через кому
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleAddSchedule}
              className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span className="text-xl">💾</span>
              Додати урок
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;