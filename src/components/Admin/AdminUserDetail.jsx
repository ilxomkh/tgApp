import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import UserSources from './UserSources';
import UserStats from './UserStats';
import UserReferrals from './UserReferrals';
import UserBalance from './UserBalance';
import { LinkIcon, BarChartIcon, UsersGroupIcon, UserIcon, WalletIcon, ArrowLeftIcon } from '../Main/icons';
import { formatDate, formatPhoneNumber, getLanguageInfo, getDeviceInfo, getUserInitials } from '../../utils/adminUtils.jsx';

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


  const tabs = [
    { id: 'overview', name: 'Обзор', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'sources', name: 'Источники', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'stats', name: 'Статистика', icon: <BarChartIcon className="w-4 h-4" /> },
    { id: 'referrals', name: 'Рефералы', icon: <UsersGroupIcon className="w-4 h-4" /> },
    { id: 'balance', name: 'Баланс', icon: <WalletIcon className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 text-sm">Загрузка...</p>
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
            <h2 className="text-xl font-medium text-slate-900">Не удалось загрузить данные</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">{error}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchUser}
              className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
            >
              Повторить
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition-colors"
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-slate-400 text-2xl">👤</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-slate-900">Пользователь не найден</h2>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Вернуться в приложение
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm"
              >
                ← Назад к списку
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 mb-8">
          <div className="p-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-medium text-xl">
                    {getUserInitials(user.full_name)}
                  </span>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-slate-900">{user.full_name || 'Без имени'}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{langInfo.icon}</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      {langInfo.name}
                    </span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-4">ID: {user.id}</p>
                
                {/* Key Info Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Телефон</p>
                    <p className="text-sm text-slate-900">{formatPhoneNumber(user.phone_number)}</p>
                    <p className="text-xs text-slate-500">{user.operator || '—'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Email</p>
                    <p className="text-sm text-slate-900">{user.email || '—'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Баланс</p>
                    <p className="text-sm text-slate-900 font-medium">{user.balance?.toLocaleString() || '0'} сум</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Устройство</p>
                    <div className="flex items-center gap-2">
                      <div className="text-slate-600">{deviceInfo.icon}</div>
                      <span className="text-sm text-slate-900">{deviceInfo.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Регистрация</p>
                    <p className="text-sm text-slate-900">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200">
            <nav className="flex px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-slate-600">{tab.icon}</div>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Additional Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Дата рождения</p>
                    <p className="text-lg text-slate-900">{user.birth_date ? formatDate(user.birth_date) : '—'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Telegram ID</p>
                    <p className="text-lg text-slate-900 font-mono">{user.telegram_id || '—'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Браузер</p>
                    <p className="text-lg text-slate-900">{user.device_info?.browser || '—'}</p>
                  </div>
                </div>

                {/* Device Details */}
                {user.device_info && (
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Детали устройства</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500">Операционная система</p>
                        <p className="text-sm text-slate-900">{user.device_info.os || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500">Версия ОС</p>
                        <p className="text-sm text-slate-900">{user.device_info.os_version || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500">Устройство</p>
                        <p className="text-sm text-slate-900">{user.device_info.device || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500">Модель</p>
                        <p className="text-sm text-slate-900">{user.device_info.model || '—'}</p>
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