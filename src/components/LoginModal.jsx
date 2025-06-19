import { useState } from 'react';
import axios from 'axios';
import '../styles/LoginModal.css';

const LoginModal = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Заповніть всі поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:4000/api/admin/login', {
        username,
        password,
      });
      
      if (res.data.success) {
        onSuccess();
      } else {
        setError('Невірні дані для входу');
      }
    } catch (err) {
      setError('Помилка зєднання з сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Хедер */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">🔐 Вхід для редагування</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors text-2xl"
            >
              ❌
            </button>
          </div>
          <p className="text-blue-100 mt-2">Введіть дані для доступу до адмін-панелі</p>
        </div>

        {/* Контент */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Логін
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Введіть логін"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Пароль
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Введіть пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Скасувати
            </button>
            <button 
              onClick={handleLogin} 
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '⏳ Вхід...' : '✅ Увійти'}
            </button>
          </div>

          {/* Підказка */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              💡 За замовчуванням: логін <code className="bg-gray-200 px-1 rounded">admin</code>, пароль <code className="bg-gray-200 px-1 rounded">12345</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;