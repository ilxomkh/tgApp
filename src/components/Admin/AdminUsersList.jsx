import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import UserAvatar from './UserAvatar';
import AdminNavigation from './AdminNavigation';
import AdminHeader from './AdminHeader';
import { formatDate, formatPhoneNumber, getLanguageInfo, getDeviceInfo, getUserInitials } from '../../utils/adminUtils.jsx';

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
      
      if (response && response.users) {
        setUsers(response.users);
        setPagination({
          page: response.page || page,
          limit: response.limit || pagination.limit,
          total: response.total || 0
        });
      } else {
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
      <div className="min-h-screen bg-[#F4F4FF] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#7C65FF]/30 border-t-[#7C65FF] rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-sm">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F4FF] flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-gray-900">Не удалось загрузить пользователей</h2>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">{error}</p>
          </div>
          <button
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white text-sm rounded-lg hover:from-[#4A2FE8] hover:to-[#6B4FFF] transition-all duration-200 active:scale-95"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4FF]">
      <AdminHeader 
        title={pagination.total.toLocaleString()}
        subtitle="всего пользователей"
      />

      <AdminNavigation />

      <div className="mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_28px_rgba(40,40,80,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Пользователь
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                    Контакты
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                    Устройство
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Баланс
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Регистрация
                  </th>
                  <th className="text-right px-3 sm:px-6 py-3 sm:py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
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
                      className={`border-b border-gray-50 hover:bg-[#7C65FF]/5 cursor-pointer transition-all duration-200 ${
                        index === users.length - 1 ? 'border-b-0' : ''
                      }`}
                      onClick={() => handleUserClick(user.id)}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <UserAvatar user={user} size="md" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate text-sm sm:text-base">
                              {user.full_name || 'Без имени'}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">ID: {user.id}</div>
                            <div className="sm:hidden mt-1">
                              <div className="text-xs text-gray-900 font-mono">
                                {formatPhoneNumber(user.phone_number)}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {user.email || '—'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 font-mono">
                            {formatPhoneNumber(user.phone_number)}
                          </div>
                            <div className="text-sm text-gray-600 truncate max-w-48">
                              {user.email || '—'}
                            </div>
                          <div className="flex items-center gap-2">
                            <div className="text-gray-600">{langInfo.icon}</div>
                            <span className="text-xs text-gray-600 font-medium">
                              {langInfo.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-3">
                          <div className="text-gray-600">{deviceInfo.icon}</div>
                          <div>
                            <div className="text-sm text-gray-900">{deviceInfo.name}</div>
                            <div className="text-xs text-gray-600">{user.operator || '—'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {user.balance?.toLocaleString() || '0'} сум
                        </div>
                      </td>

                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-900">
                          {formatDate(user.created_at)}
                        </div>
                      </td>

                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(user.id);
                          }}
                          className="text-[#7C65FF] hover:text-[#5538F9] text-xs sm:text-sm font-medium transition-colors"
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

          {totalPages > 1 && (
            <div className="border-t border-gray-100 px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                  Показано{' '}
                  <span className="font-medium text-gray-900">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>
                  —
                  <span className="font-medium text-gray-900">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  {' '}из{' '}
                  <span className="font-medium text-gray-900">
                    {pagination.total.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#7C65FF] hover:bg-[#7C65FF]/5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600"
                  >
                    ← Назад
                  </button>

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
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white'
                                : 'text-gray-600 hover:text-[#7C65FF] hover:bg-[#7C65FF]/5'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#7C65FF] hover:bg-[#7C65FF]/5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600"
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