import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import surveyDebugger from '../utils/surveyDebugger';

const SurveyDiagnostics = () => {
  const { language } = useLanguage();
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const results = await surveyDebugger.diagnoseSurveyIssues();
      setDiagnostics(results);
    } catch (error) {
      console.error('Ошибка при диагностике:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCompletedSurveys = () => {
    if (window.confirm('Вы уверены, что хотите очистить все пройденные опросы? Это действие нельзя отменить.')) {
      surveyDebugger.resetSurveyState();
      runDiagnostics();
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  if (!diagnostics) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded-lg mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
      </div>
    );
  }

  const texts = {
    ru: {
      title: 'Диагностика опросов',
      runDiagnostics: 'Запустить диагностику',
      clearSurveys: 'Очистить пройденные опросы',
      showDetails: 'Показать детали',
      hideDetails: 'Скрыть детали',
      localStorage: 'Локальное хранилище',
      surveyGroups: 'Группы опросов',
      apiStatus: 'Статус API',
      recommendations: 'Рекомендации',
      completedSurveys: 'Пройденные опросы',
      hasAuthToken: 'Есть токен авторизации',
      hasSessionId: 'Есть ID сессии',
      hasUser: 'Есть данные пользователя',
      apiAvailable: 'API доступен',
      noSurveys: 'Нет пройденных опросов',
      noGroups: 'Нет групп опросов',
      noRecommendations: 'Нет рекомендаций'
    },
    uz: {
      title: 'So\'rovnomalar diagnostikasi',
      runDiagnostics: 'Diagnostikani ishga tushirish',
      clearSurveys: 'O\'tilgan so\'rovnomalarni tozalash',
      showDetails: 'Tafsilotlarni ko\'rsatish',
      hideDetails: 'Tafsilotlarni yashirish',
      localStorage: 'Mahalliy saqlash',
      surveyGroups: 'So\'rovnoma guruhlari',
      apiStatus: 'API holati',
      recommendations: 'Tavsiyalar',
      completedSurveys: 'O\'tilgan so\'rovnomalar',
      hasAuthToken: 'Autentifikatsiya tokeni mavjud',
      hasSessionId: 'Sessiya ID mavjud',
      hasUser: 'Foydalanuvchi ma\'lumotlari mavjud',
      apiAvailable: 'API mavjud',
      noSurveys: 'O\'tilgan so\'rovnomalar yo\'q',
      noGroups: 'So\'rovnoma guruhlari yo\'q',
      noRecommendations: 'Tavsiyalar yo\'q'
    }
  };

  const t = texts[language] || texts.ru;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{t.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '...' : t.runDiagnostics}
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            {showDetails ? t.hideDetails : t.showDetails}
          </button>
        </div>
      </div>

      {/* Краткая сводка */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 font-medium">{t.localStorage}</div>
          <div className="text-xs text-green-500">
            {diagnostics.localStorage.hasAuthToken ? '✅' : '❌'} {t.hasAuthToken}
          </div>
          <div className="text-xs text-green-500">
            {diagnostics.localStorage.hasSessionId ? '✅' : '❌'} {t.hasSessionId}
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">{t.apiStatus}</div>
          <div className="text-xs text-blue-500">
            {diagnostics.apiStatus.apiAvailable ? '✅' : '❌'} {t.apiAvailable}
          </div>
        </div>
      </div>

      {/* Рекомендации */}
      {diagnostics.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t.recommendations}</h4>
          <div className="space-y-2">
            {diagnostics.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm ${
                  rec.type === 'error' ? 'bg-red-50 text-red-700' :
                  rec.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                <div className="font-medium">{rec.message}</div>
                <div className="text-xs mt-1">{rec.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Детальная информация */}
      {showDetails && (
        <div className="space-y-4">
          {/* Пройденные опросы */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t.completedSurveys}</h4>
            {diagnostics.localStorage.completedSurveys.length > 0 ? (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">
                  {diagnostics.localStorage.completedSurveys.join(', ')}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">{t.noSurveys}</div>
            )}
          </div>

          {/* Группы опросов */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t.surveyGroups}</h4>
            {Object.keys(diagnostics.surveyGroups).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(diagnostics.surveyGroups).map(([groupId, group]) => (
                  <div key={groupId} className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">{group.name}</div>
                    <div className="text-xs text-gray-500">
                      Опросы: {group.surveys.join(', ')}
                    </div>
                    {group.completed.length > 0 && (
                      <div className="text-xs text-green-600">
                        Пройдены: {group.completed.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">{t.noGroups}</div>
            )}
          </div>
        </div>
      )}

      {/* Кнопка очистки */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={clearCompletedSurveys}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
        >
          {t.clearSurveys}
        </button>
      </div>
    </div>
  );
};

export default SurveyDiagnostics;
