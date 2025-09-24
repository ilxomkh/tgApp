import React, { useState } from 'react';
import { 
  getAllSurveyGroups,
  getSurveyGroupsStats,
  markGroupAsCompleted,
  unmarkGroupAsCompleted,
  getSurveyGroup,
  shouldHideSurveyDueToGroup
} from '../utils/surveyGroups.js';
import { 
  getCompletedSurveys, 
  markSurveyAsCompleted, 
  isSurveyCompleted, 
  unmarkSurveyAsCompleted, 
  clearCompletedSurveys,
  getCompletedSurveysStats 
} from '../utils/completedSurveys';

/**
 * Тестовый компонент для проверки группировки опросов
 */
const SurveyGroupsTest = () => {
  const [stats, setStats] = useState(getSurveyGroupsStats());
  const [completedStats, setCompletedStats] = useState(getCompletedSurveysStats());

  const refreshStats = () => {
    setStats(getSurveyGroupsStats());
    setCompletedStats(getCompletedSurveysStats());
  };

  const handleMarkGroupCompleted = (groupId) => {
    markGroupAsCompleted(groupId);
    refreshStats();
  };

  const handleUnmarkGroupCompleted = (groupId) => {
    unmarkGroupAsCompleted(groupId);
    refreshStats();
  };

  const handleMarkSurveyCompleted = (surveyId) => {
    markSurveyAsCompleted(surveyId);
    refreshStats();
  };

  const handleUnmarkSurveyCompleted = (surveyId) => {
    unmarkSurveyAsCompleted(surveyId);
    refreshStats();
  };

  const handleClearAll = () => {
    clearCompletedSurveys();
    refreshStats();
  };

  const testSurveyGroup = (surveyId) => {
    const groupId = getSurveyGroup(surveyId);
    const shouldHide = shouldHideSurveyDueToGroup(surveyId);
    
    console.log(`🧪 Тест группировки для опроса ${surveyId}:`);
    console.log(`  - Группа: ${groupId || 'не в группе'}`);
    console.log(`  - Должен быть скрыт: ${shouldHide}`);
    
    return { groupId, shouldHide };
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-4">🧪 Тест группировки опросов</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Статистика групп:</h4>
          {Object.entries(stats).map(([groupId, groupStats]) => (
            <div key={groupId} className="p-2 bg-white rounded border mb-2">
              <p><strong>Группа:</strong> {groupStats.name}</p>
              <p><strong>Опросы:</strong> {groupStats.surveys.join(', ')}</p>
              <p><strong>Пройдено:</strong> {groupStats.completed} из {groupStats.total}</p>
              <p><strong>Статус:</strong> {groupStats.isCompleted ? 'Пройдена' : 'Не пройдена'}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleMarkGroupCompleted(groupId)}
                  className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Отметить группу как пройденную
                </button>
                <button
                  onClick={() => handleUnmarkGroupCompleted(groupId)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Убрать группу из пройденных
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-medium mb-2">Тест конкретных опросов:</h4>
          <div className="space-y-2">
            {['3xqyg9', 'wbp8L6'].map(surveyId => {
              const { groupId, shouldHide } = testSurveyGroup(surveyId);
              const isCompleted = isSurveyCompleted(surveyId);
              
              return (
                <div key={surveyId} className="p-2 bg-white rounded border">
                  <p><strong>Опрос:</strong> {surveyId}</p>
                  <p><strong>Группа:</strong> {groupId || 'не в группе'}</p>
                  <p><strong>Пройден:</strong> {isCompleted ? 'Да' : 'Нет'}</p>
                  <p><strong>Должен быть скрыт:</strong> {shouldHide ? 'Да' : 'Нет'}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleMarkSurveyCompleted(surveyId)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Отметить как пройденный
                    </button>
                    <button
                      onClick={() => handleUnmarkSurveyCompleted(surveyId)}
                      className="px-2 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                    >
                      Убрать из пройденных
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Общие действия:</h4>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Очистить все пройденные опросы
            </button>
            <button
              onClick={refreshStats}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Обновить статистику
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Как тестировать:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Отметьте опрос 3xqyg9 (русский) как пройденный</li>
            <li>Проверьте, что опрос wbp8L6 (узбекский) теперь должен быть скрыт</li>
            <li>Или наоборот - отметьте wbp8L6 и проверьте скрытие 3xqyg9</li>
            <li>Используйте "Отметить группу как пройденную" для тестирования всей группы сразу</li>
            <li>Проверьте консоль браузера для подробных логов</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SurveyGroupsTest;
