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
    <div className="min-h-screen bg-[#F8F9FD]">
      <AdminHeader 
        title={pagination.total.toLocaleString()}
        subtitle="всего пользователей"
      />

      <AdminNavigation />

      <div className="max-w-[100%] mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto p-6">
            <div className="space-y-3">
              <div className="grid grid-cols-[80px_1fr_150px_200px_120px_100px_150px_60px] gap-4 px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <div>ID</div>
                <div>Пользователь</div>
                <div className="hidden sm:block">Телефон</div>
                <div className="hidden lg:block">Email</div>
                <div>Баланс</div>
                <div className="hidden md:block">Язык</div>
                <div className="hidden xl:block">Дата регистрации</div>
                <div></div>
              </div>

              {users.map((user, index) => {
                const langInfo = getLanguageInfo(user.language);
                const deviceInfo = getDeviceInfo(user.device_info);
                
                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="grid grid-cols-[80px_1fr_150px_200px_120px_100px_150px_60px] gap-4 px-6 py-4 bg-gray-50/50 hover:bg-blue-50/60 rounded-xl transition-colors duration-150 cursor-pointer items-center"
                  >
                    <div className="text-sm text-gray-700 font-medium">
                      {user.id}
                    </div>
                    
                    <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                      <UserAvatar user={user} size="sm" className="flex-shrink-0" />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-gray-900 truncate overflow-hidden text-ellipsis whitespace-nowrap">
                          {user.full_name || 'Без имени'}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden mt-0.5 truncate">
                          {formatPhoneNumber(user.phone_number)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 font-mono hidden sm:block overflow-hidden text-ellipsis whitespace-nowrap">
                      {formatPhoneNumber(user.phone_number)}
                    </div>

                    <div className="text-sm text-gray-700 hidden lg:block overflow-hidden text-ellipsis whitespace-nowrap">
                      {user.email || '—'}
                    </div>

                    <div className="text-sm text-gray-900 font-semibold">
                      {user.balance?.toLocaleString() || '0'}
                    </div>

                    <div className="hidden md:flex items-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
                        <span>{langInfo.icon}</span>
                        <span>{langInfo.name}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 hidden xl:block">
                      {formatDate(user.created_at)}
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user.id);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-blue-600 hover:bg-white transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-gray-100 bg-white px-6 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">
                    Показано {(pagination.page - 1) * pagination.limit + 1}–
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  <span className="text-gray-400">из</span>
                  <span className="font-semibold text-gray-900">{pagination.total.toLocaleString()}</span>
                  <span className="hidden sm:inline text-gray-500">пользователей</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                    title="Первая страница"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                    title="Предыдущая страница"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {(() => {
                      const getPageNumbers = () => {
                        const delta = 1;
                        const range = [];
                        let l;

                        for (let i = 1; i <= totalPages; i++) {
                          if (i === 1 || i === totalPages || (i >= pagination.page - delta && i <= pagination.page + delta)) {
                            if (l) {
                              if (i - l === 2) {
                                range.push(l + 1);
                              } else if (i - l !== 1) {
                                range.push('...');
                              }
                            }
                            range.push(i);
                            l = i;
                          }
                        }

                        return range;
                      };

                      return getPageNumbers().map((pageNum, idx) => {
                        if (pageNum === '...') {
                          return (
                            <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm">
                              ...
                            </span>
                          );
                        }

                        const isActive = pageNum === pagination.page;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full transition-all duration-200 ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                    title="Следующая страница"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={pagination.page === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                    title="Последняя страница"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 hidden lg:inline">Страница:</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={pagination.page}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          handlePageChange(page);
                        }
                      }}
                      className="w-16 px-3 py-1.5 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <span className="text-gray-400">из</span>
                  <span className="font-medium text-gray-700">{totalPages}</span>
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