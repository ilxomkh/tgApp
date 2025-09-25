import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { BarChartIcon, ClockIcon, CheckIcon, TrendingUpIcon, BookIcon } from '../Main/icons';
import { formatDate } from '../../utils/adminUtils.jsx';

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await adminApi.getUserStats(userId);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err.message || 'Ошибка загрузки статистики пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const formatTime = (timeString) => {
    if (!timeString) return '—';
    return timeString;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          <span className="text-slate-500 text-sm">Загрузка статистики...</span>
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
          <h3 className="font-medium text-slate-900">Не удалось загрузить статистику</h3>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
        >
          Повторить
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <BarChartIcon className="w-8 h-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-slate-900">Данные не найдены</h3>
          <p className="text-slate-500 text-sm">Статистика пользователя отсутствует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Опросов пройдено</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-slate-900">
              {stats.surveys_completed || 0}
            </div>
            <div className="text-sm text-slate-500">за все время</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Среднее время</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-slate-900">
              {formatTime(stats.avg_survey_time)}
            </div>
            <div className="text-sm text-slate-500">на один опрос</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BookIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Последний опрос</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-slate-900">
              {formatDate(stats.last_survey_time)}
            </div>
            <div className="text-sm text-slate-500">
              {stats.last_survey_time ? 'дата прохождения' : 'не проходил'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUpIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Уровень активности</h4>
              <p className="text-sm text-slate-500">участие в опросах</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-slate-900">
              {stats.surveys_completed > 10 ? 'Высокий' : 
               stats.surveys_completed > 5 ? 'Средний' : 
               stats.surveys_completed > 0 ? 'Низкий' : 'Нет активности'}
            </div>
            <div className="text-sm text-slate-500">
              {stats.surveys_completed} опросов пройдено
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BarChartIcon className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Эффективность</h4>
              <p className="text-sm text-slate-500">скорость прохождения</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-slate-900">
              {stats.avg_survey_time ? 
                (stats.avg_survey_time.includes('m') && parseInt(stats.avg_survey_time) < 5 ? 'Быстро' :
                 stats.avg_survey_time.includes('m') && parseInt(stats.avg_survey_time) < 10 ? 'Средне' : 'Медленно') : 
                'Нет данных'}
            </div>
            <div className="text-sm text-slate-500">
              {formatTime(stats.avg_survey_time)} в среднем
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h4 className="font-medium text-slate-900 mb-6">Активность пользователя</h4>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Пройденные опросы</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{stats.surveys_completed || 0}</div>
                <div className="text-xs text-slate-500">опроса</div>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min((stats.surveys_completed || 0) * 10, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Скорость прохождения</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{formatTime(stats.avg_survey_time)}</div>
                <div className="text-xs text-slate-500">среднее время</div>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${stats.avg_survey_time && stats.avg_survey_time.includes('m') ? 
                    Math.max(0, 100 - (parseInt(stats.avg_survey_time) * 10)) : 50}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Последняя активность:</span>
            <span className="text-sm font-medium text-slate-900">
              {stats.last_survey_time ? formatDate(stats.last_survey_time) : 'Нет данных'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {stats.surveys_completed || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">опросов пройдено</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {stats.avg_survey_time ? stats.avg_survey_time.split(' ')[0] : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1">мин. в среднем</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {stats.last_survey_time ? 'Да' : 'Нет'}
          </div>
          <div className="text-xs text-slate-500 mt-1">есть активность</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {stats.user_id || '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1">ID пользователя</div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;