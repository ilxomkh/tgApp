import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import UserSources from './UserSources';
import UserStats from './UserStats';
import UserReferrals from './UserReferrals';
import UserBalance from './UserBalance';
import { LinkIcon, BarChartIcon, UsersGroupIcon, UserIcon, DollarSignIcon, ArrowLeftIcon } from '../Main/icons';
import UserAvatar from './UserAvatar';
import { formatDate, formatPhoneNumber, getLanguageInfo, getDeviceInfo, getUserInitials } from '../../utils/adminUtils.jsx';
import PRO from '../../assets/Pro.svg';

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await adminApi.getUserById(userId);
      setUser(userData);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.message || 'Ошибка загрузки данных пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);


  const UserIconCustom = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm7 10v-1a6 6 0 0 0-6-6H11a6 6 0 0 0-6 6v1"/>
    </svg>
  );

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: <UserIconCustom /> },
    { id: 'sources', name: 'Источники', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'stats', name: 'Статистика', icon: <BarChartIcon className="w-4 h-4" /> },
    { id: 'referrals', name: 'Рефералы', icon: <UsersGroupIcon className="w-4 h-4" /> },
    { id: 'balance', name: 'Баланс', icon: <DollarSignIcon className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4FF] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#7C65FF]/30 border-t-[#7C65FF] rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-sm">Загрузка...</p>
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
            <h2 className="text-xl font-medium text-gray-900">Не удалось загрузить данные</h2>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">{error}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchUser}
              className="px-4 py-2 bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white text-sm rounded-lg hover:from-[#4A2FE8] hover:to-[#6B4FFF] transition-all duration-200 active:scale-95"
            >
              Повторить
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F4FF] flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-gray-400 text-2xl">👤</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-gray-900">Пользователь не найден</h2>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white text-sm rounded-lg hover:from-[#4A2FE8] hover:to-[#6B4FFF] transition-all duration-200 active:scale-95"
          >
            Назад к списку
          </button>
        </div>
      </div>
    );
  }

  const langInfo = getLanguageInfo(user.language);
  const deviceInfo = getDeviceInfo(user.device_info);

  return (
    <div className="min-h-screen bg-[#F4F4FF]">
      <div className="bg-gradient-to-b from-[#5538F9] to-[#7C65FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-6 gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 text-white hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm font-medium order-1 sm:order-1"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Назад
            </button>
            <img src={PRO} alt="" className="w-48 sm:w-60 order-2 sm:order-2" />
            <div className="text-center sm:text-right text-white order-3 sm:order-3">
              <div className="text-xl sm:text-2xl font-semibold">{user?.id || '—'}</div>
              <div className="text-xs sm:text-sm opacity-90">ID пользователя</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_28px_rgba(40,40,80,0.08)] mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <UserAvatar user={user} size="lg" />
              </div>
              
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{user.full_name || 'Без имени'}</h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xl">{langInfo.icon}</span>
                    <span className="px-2 py-1 bg-[#7C65FF]/10 text-[#7C65FF] text-xs rounded-md">
                      {langInfo.name}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">ID: {user.id}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Телефон</p>
                    <p className="text-sm text-gray-900 break-all">{formatPhoneNumber(user.phone_number)}</p>
                    <p className="text-xs text-gray-600">{user.operator || '—'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm text-gray-900 break-all">{user.email || '—'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Баланс</p>
                    <p className="text-sm text-gray-900 font-medium">{user.balance?.toLocaleString() || '0'} сум</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Устройство</p>
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600">{deviceInfo.icon}</div>
                      <span className="text-sm text-gray-900">{deviceInfo.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Регистрация</p>
                    <p className="text-sm text-gray-900">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_28px_rgba(40,40,80,0.08)]">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto px-4 sm:px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-4 border-b-2 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#7C65FF] text-[#7C65FF]'
                      : 'border-transparent text-gray-600 hover:text-[#7C65FF] hover:border-[#7C65FF]/30'
                  }`}
                >
                  <div className={`${activeTab === tab.id ? 'text-[#7C65FF]' : 'text-gray-600'}`}>
                    {tab.icon}
                  </div>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Дата рождения</p>
                    <p className="text-base sm:text-lg text-gray-900">{user.birth_date ? formatDate(user.birth_date) : '—'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Telegram ID</p>
                    <p className="text-base sm:text-lg text-gray-900 font-mono break-all">{user.telegram_id || '—'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Браузер</p>
                    <p className="text-base sm:text-lg text-gray-900">{user.device_info?.browser || '—'}</p>
                  </div>
                </div>

                {user.device_info && (
                  <div className="p-4 sm:p-6 bg-[#7C65FF]/5 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Детали устройства</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">Операционная система</p>
                        <p className="text-sm text-gray-900">{user.device_info.os || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">Версия ОС</p>
                        <p className="text-sm text-gray-900">{user.device_info.os_version || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">Устройство</p>
                        <p className="text-sm text-gray-900">{user.device_info.device || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">Модель</p>
                        <p className="text-sm text-gray-900">{user.device_info.model || '—'}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {activeTab === 'sources' && <UserSources userId={userId} />}
            {activeTab === 'stats' && <UserStats userId={userId} />}
            {activeTab === 'referrals' && <UserReferrals userId={userId} />}
            {activeTab === 'balance' && <UserBalance userId={userId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;