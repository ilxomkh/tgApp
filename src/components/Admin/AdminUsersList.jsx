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
    <div className="min-h-screen">
      <AdminHeader 
        title={pagination.total.toLocaleString()}
        subtitle="всего пользователей"
      />

      <AdminNavigation />

      <div className="mx-auto px-6 sm:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#7C65FF]/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C65FF]/3 via-transparent to-[#5538F9]/2"></div>
          
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7C65FF]/10 bg-gradient-to-r from-[#7C65FF]/5 to-[#5538F9]/5">
                  <th className="text-left px-3 sm:px-6 py-4 sm:py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#7C65FF]"></div>
                      Пользователь
                    </div>
                  </th>
                  <th className="text-left px-3 sm:px-6 py-4 sm:py-5 text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#5538F9]"></div>
                      Контакты
                    </div>
                  </th>
                  <th className="text-left px-3 sm:px-6 py-4 sm:py-5 text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Устройство
                    </div>
                  </th>
                  <th className="text-left px-3 sm:px-6 py-4 sm:py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Баланс
                    </div>
                  </th>
                  <th className="text-left px-3 sm:px-6 py-4 sm:py-5 text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Регистрация
                    </div>
                  </th>
                  <th className="text-right px-3 sm:px-6 py-4 sm:py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                      className={`border-b border-gray-50 cursor-pointer transition-all duration-200 ${
                        index === users.length - 1 ? 'border-b-0' : ''
                      }`}
                      onClick={() => handleUserClick(user.id)}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <UserAvatar user={user} size="md" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-sm sm:text-base">
                              {user.full_name ? 
                                (user.full_name.length > 20 ? 
                                  user.full_name.substring(0, 20) + '...' : 
                                  user.full_name
                                ) : 
                                'Без имени'
                              }
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
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#7C65FF] to-[#5538F9] rounded-xl transition-all duration-200"
                        >
                          <span>Подробнее</span>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-gray-100/60 bg-gradient-to-r from-gray-50/50 to-blue-50/30 px-3 sm:px-6 py-4 sm:py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/50">
                  Показано{' '}
                  <span className="font-bold text-indigo-600">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>
                  —
                  <span className="font-bold text-indigo-600">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  {' '}из{' '}
                  <span className="font-bold text-purple-600">
                    {pagination.total.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 order-1 sm:order-2">
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