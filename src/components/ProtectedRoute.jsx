import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    // Проверяем localStorage напрямую для быстрого перенаправления
    const sessionId = localStorage.getItem('session_id');
    const user = localStorage.getItem('user');
    
    // Если нет session_id или user в localStorage, сразу перенаправляем на /auth
    if (!sessionId || !user) {
      console.log('No session_id or user found in localStorage, redirecting to /auth');
      navigate('/auth', { replace: true });
      return;
    }
    
    // Если AuthContext еще инициализируется, ждем
    if (isInitializing) {
      return;
    }
    
    // Если после инициализации пользователь не авторизован, перенаправляем
    if (!isAuthenticated) {
      console.log('User not authenticated after initialization, redirecting to /auth');
      navigate('/auth', { replace: true });
    }
  }, [navigate, isAuthenticated, isInitializing]);

  // Показываем загрузку во время инициализации
  if (isInitializing) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C65FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, не показываем контент
  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
