import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import { formatDate, formatPhoneNumber, getLanguageInfo, getDeviceInfo, getUserInitials } from '../../utils/adminUtils.jsx';
import { ArrowLeftIcon } from '../Main/icons';

const AdminUsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getUsers(page, pagination.limit);
      
      // Проверяем структуру ответа API
      if (response && response.users) {
        setUsers(response.users);
        setPagination({
          page: response.page || page,
          limit: response.limit || pagination.limit,
          total: response.total || 0
        });
      } else {
        // Если API возвращает массив напрямую
        setUsers(Array.isArray(response) ? response : []);
        setPagination({
          page: page,
          limit: pagination.limit,
          total: Array.isArray(response) ? response.length : 0
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Ошибка загрузки пользователей');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== pagination.page) {
      fetchUsers(newPage);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };


  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 text-sm">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-slate-900">Не удалось загрузить пользователей</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">{error}</p>
          </div>
          <button
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Вернуться в приложение
              </button>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-slate-900">Пользователи</h1>
                <p className="text-slate-500">Управление пользователями системы</p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="text-2xl font-semibold text-slate-900">{pagination.total.toLocaleString()}</div>
              <div className="text-sm text-slate-500">всего пользователей</div>
            </div>
          </div>
        </div>
      </div>


      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Пользователь
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Контакты
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Устройство
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Баланс
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Регистрация
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const langInfo = getLanguageInfo(user.language);
                  const deviceInfo = getDeviceInfo(user.device_info);
                  
                  return (
                    <tr 
                      key={user.id} 
                      className={`border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${
                        index === users.length - 1 ? 'border-b-0' : ''
                      }`}
                      onClick={() => handleUserClick(user.id)}
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium text-sm">
                              {getUserInitials(user.full_name)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-900 truncate">
                              {user.full_name || 'Без имени'}
                            </div>
                            <div className="text-sm text-slate-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contacts */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-slate-900 font-mono">
                            {formatPhoneNumber(user.phone_number)}
                          </div>
                            <div className="text-sm text-slate-500 truncate max-w-48">
                              {user.email || '—'}
                            </div>
                          <div className="flex items-center gap-2">
                            <div className="text-slate-600">{langInfo.icon}</div>
                            <span className="text-xs text-slate-500 font-medium">
                              {langInfo.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Device */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-slate-600">{deviceInfo.icon}</div>
                          <div>
                            <div className="text-sm text-slate-900">{deviceInfo.name}</div>
                            <div className="text-xs text-slate-500">{user.operator || '—'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Balance */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 font-medium">
                          {user.balance?.toLocaleString() || '0'} сум
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {formatDate(user.created_at)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(user.id);
                          }}
                          className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                        >
                          Подробнее →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Results Info */}
                <div className="text-sm text-slate-500">
                  Показано{' '}
                  <span className="font-medium text-slate-900">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>
                  —
                  <span className="font-medium text-slate-900">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  {' '}из{' '}
                  <span className="font-medium text-slate-900">
                    {pagination.total.toLocaleString()}
                  </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-600"
                  >
                    ← Назад
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-2">
                    {(() => {
                      const getPageNumbers = () => {
                        const delta = 2;
                        const range = [];
                        const rangeWithDots = [];

                        for (let i = Math.max(2, pagination.page - delta); 
                             i <= Math.min(totalPages - 1, pagination.page + delta); 
                             i++) {
                          range.push(i);
                        }

                        if (pagination.page - delta > 2) {
                          rangeWithDots.push(1, '...');
                        } else {
                          rangeWithDots.push(1);
                        }

                        rangeWithDots.push(...range);

                        if (pagination.page + delta < totalPages - 1) {
                          rangeWithDots.push('...', totalPages);
                        } else if (totalPages > 1) {
                          rangeWithDots.push(totalPages);
                        }

                        return rangeWithDots;
                      };

                      return getPageNumbers().map((pageNum, idx) => {
                        if (pageNum === '...') {
                          return (
                            <span key={`dots-${idx}`} className="px-2 text-slate-400">
                              …
                            </span>
                          );
                        }

                        const isActive = pageNum === pagination.page;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-600"
                  >
                    Вперед →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersList;