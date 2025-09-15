import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    const sessionId = localStorage.getItem('session_id');
    const user = localStorage.getItem('user');
    
    if (!sessionId || !user) {
      navigate('/auth', { replace: true });
      return;
    }
    
    if (isInitializing) {
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [navigate, isAuthenticated, isInitializing]);

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

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
