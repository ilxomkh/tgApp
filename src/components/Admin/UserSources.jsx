import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { LinkIcon, BarChartIcon, MapPinIcon, TrendingUpIcon, GlobeIcon, AppleIcon, AndroidIcon, LaptopIcon, UsersGroupIcon } from '../Main/icons';

const UserSources = ({ userId }) => {
  const [sources, setSources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const sourcesData = await adminApi.getUserSources(userId);
      setSources(sourcesData);
    } catch (err) {
      console.error('Error fetching user sources:', err);
      setError(err.message || 'Ошибка загрузки источников пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [userId]);

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  const getSourceTypeIcon = (source) => {
    const lowerSource = source?.toLowerCase() || '';
    if (lowerSource.includes('telegram')) return <AppleIcon className="w-5 h-5" />;
    if (lowerSource.includes('instagram')) return <BarChartIcon className="w-5 h-5" />;
    if (lowerSource.includes('youtube')) return <BarChartIcon className="w-5 h-5" />;
    if (lowerSource.includes('facebook')) return <UsersGroupIcon className="w-5 h-5" />;
    if (lowerSource.includes('google')) return <GlobeIcon className="w-5 h-5" />;
    if (lowerSource.includes('direct')) return <GlobeIcon className="w-5 h-5" />;
    if (lowerSource.includes('referral')) return <UsersGroupIcon className="w-5 h-5" />;
    return <BarChartIcon className="w-5 h-5" />;
  };

  const getEntryPointIcon = (point) => {
    const lowerPoint = point?.toLowerCase() || '';
    if (lowerPoint.includes('app')) return <AppleIcon className="w-4 h-4" />;
    if (lowerPoint.includes('web')) return <GlobeIcon className="w-4 h-4" />;
    if (lowerPoint.includes('bot')) return <AndroidIcon className="w-4 h-4" />;
    if (lowerPoint.includes('link')) return <LinkIcon className="w-4 h-4" />;
    if (lowerPoint.includes('qr')) return <BarChartIcon className="w-4 h-4" />;
    return <MapPinIcon className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          <span className="text-slate-500 text-sm">Загрузка источников...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-500 text-2xl">⚠️</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-slate-900">Не удалось загрузить источники</h3>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
        <button
          onClick={fetchSources}
          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
        >
          Повторить
        </button>
      </div>
    );
  }

  if (!sources) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <LinkIcon className="w-8 h-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-slate-900">Данные не найдены</h3>
          <p className="text-slate-500 text-sm">Информация об источниках отсутствует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-xl">{getSourceTypeIcon(sources.referral_source)}</span>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Источник привлечения</h3>
              <p className="text-sm text-slate-500">откуда пришел пользователь</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-lg font-medium text-slate-900">{sources.referral_source}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-emerald-600 text-xl">{getEntryPointIcon(sources.entry_point_initial)}</span>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Точка входа</h3>
              <p className="text-sm text-slate-500">первое взаимодействие</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-lg font-medium text-slate-900">{sources.entry_point_initial}</div>
          </div>
        </div>
      </div>

      {sources.social_link && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Социальная ссылка</h3>
              <p className="text-sm text-slate-500">источник в социальных сетях</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <a
              href={sources.social_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors group"
            >
              <span className="text-sm font-mono bg-white px-3 py-1 rounded-lg border border-slate-200 group-hover:border-slate-300 transition-colors">
                {formatUrl(sources.social_link)}
              </span>
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors">↗</span>
            </a>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <TrendingUpIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">Использованные точки входа</h3>
            <p className="text-sm text-slate-500">все способы взаимодействия</p>
          </div>
        </div>

        {sources.entry_points_used && sources.entry_points_used.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sources.entry_points_used.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                  <span className="text-sm">{getEntryPointIcon(point)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{point}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPinIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-sm text-slate-500">Данные о точках входа отсутствуют</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {sources.entry_points_used?.length || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">точек входа</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {sources.social_link ? '1' : '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">соц. ссылок</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {sources.referral_source ? '✓' : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1">источник</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {sources.entry_point_initial ? '✓' : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1">первый вход</div>
        </div>
      </div>
    </div>
  );
};

export default UserSources;