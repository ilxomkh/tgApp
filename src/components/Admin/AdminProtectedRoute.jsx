import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { useState, useEffect } from 'react';
import { BanIcon, ArrowLeftIcon } from '../Main/icons';
import { useNavigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { getUserProfile } = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result = await getUserProfile();
        if (result.success) {
          // Проверяем, является ли пользователь администратором
          setIsAuthorized(result.data?.phone_number === "+998998514993");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, getUserProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BanIcon className="w-16 h-16 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600 mb-4">
            У вас нет прав доступа к админ панели
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto mb-6">
            <p className="text-sm text-red-700">
              Админ панель доступна только для авторизованных администраторов
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium mx-auto"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Вернуться в приложение
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
