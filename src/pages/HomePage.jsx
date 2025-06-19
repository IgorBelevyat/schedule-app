import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import WeekNavigator from '../components/WeekNavigator';
import ScheduleViewer from '../components/ScheduleViewer';
import '../styles/HomePage.css';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleSuccessLogin = () => {
    setShowLogin(false);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="flex h-screen">
        {/* Кнопка входу */}
        <button
          onClick={() => setShowLogin(true)}
          className="absolute top-6 right-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-4 py-3 rounded-xl shadow-lg transition-all hover:shadow-xl"
          title="Вхід у режим редагування"
        >
          <span className="text-xl">⚙️</span>
          <span className="hidden sm:inline">Редагування</span>
        </button>

        {/* Sidebar */}
        <Sidebar />
        
        {/* Основний контент */}
        <div className="flex-1 p-6 overflow-y-auto">
          <WeekNavigator />
          <ScheduleViewer />
        </div>

        {/* Модалка логіну */}
        {showLogin && (
          <LoginModal 
            onClose={() => setShowLogin(false)} 
            onSuccess={handleSuccessLogin} 
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;