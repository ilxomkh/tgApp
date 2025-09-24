import React, { useState } from 'react';
import { 
  getCompletedSurveys, 
  markSurveyAsCompleted, 
  isSurveyCompleted, 
  unmarkSurveyAsCompleted, 
  clearCompletedSurveys,
  getCompletedSurveysStats 
} from '../utils/completedSurveys';

/**
 * Тестовый компонент для проверки функциональности отслеживания пройденных опросов
 * Можно использовать в режиме разработки для тестирования
 */
const CompletedSurveysTest = () => {
  const [stats, setStats] = useState(getCompletedSurveysStats());
  const [testSurveyId, setTestSurveyId] = useState('test-survey-123');

  const refreshStats = () => {
    setStats(getCompletedSurveysStats());
  };

  const handleMarkCompleted = () => {
    markSurveyAsCompleted(testSurveyId);
    refreshStats();
  };

  const handleUnmarkCompleted = () => {
    unmarkSurveyAsCompleted(testSurveyId);
    refreshStats();
  };

  const handleClearAll = () => {
    clearCompletedSurveys();
    refreshStats();
  };

  const isTestSurveyCompleted = isSurveyCompleted(testSurveyId);

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-4">🧪 Тест отслеживания пройденных опросов</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Статистика:</h4>
          <p>Всего пройденных опросов: <strong>{stats.total}</strong></p>
          <p>Список: {stats.surveys.length > 0 ? stats.surveys.join(', ') : 'Нет пройденных опросов'}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Тестовый опрос:</h4>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={testSurveyId}
              onChange={(e) => setTestSurveyId(e.target.value)}
              className="px-3 py-1 border rounded"
              placeholder="ID опроса"
            />
            <span className={`px-2 py-1 rounded text-sm ${
              isTestSurveyCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isTestSurveyCompleted ? 'Пройден' : 'Не пройден'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleMarkCompleted}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Отметить как пройденный
            </button>
            <button
              onClick={handleUnmarkCompleted}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Убрать из пройденных
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={handleClearAll}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Очистить все пройденные опросы
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Как использовать:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Введите ID опроса и нажмите "Отметить как пройденный"</li>
            <li>Проверьте, что опрос исчез из списка доступных опросов</li>
            <li>Используйте "Убрать из пройденных" для тестирования повторного показа</li>
            <li>Используйте "Очистить все" для сброса состояния</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CompletedSurveysTest;
