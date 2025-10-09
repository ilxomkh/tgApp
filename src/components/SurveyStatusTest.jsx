import React, { useState } from 'react';
import tallyApiService from '../services/tallyApi.js';
import { 
  getCompletedSurveys, 
  markSurveyAsCompleted, 
  isSurveyCompleted, 
  unmarkSurveyAsCompleted, 
  clearCompletedSurveys,
  getCompletedSurveysStats 
} from '../utils/completedSurveys';


const SurveyStatusTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [testFormId, setTestFormId] = useState('wbp8L6');

  const testSurveyStatus = async () => {
    setIsLoading(true);
    try {      
      const isCompleted = await tallyApiService.checkSurveyStatus(testFormId);
      
      setTestResults({
        formId: testFormId,
        isCompleted,
        timestamp: new Date().toISOString()
      });      
    } catch (error) {
      setTestResults({
        formId: testFormId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testAvailableForms = async () => {
    setIsLoading(true);
    try {
      
      const forms = await tallyApiService.getAvailableForms('uz');
      
      setTestResults({
        availableForms: forms,
        count: forms.length,
        timestamp: new Date().toISOString()
      });
      
      forms.forEach(form => {});
    } catch (error) {
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = getCompletedSurveysStats();

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-4">🧪 Тест новой логики скрытия опросов</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Статистика пройденных опросов:</h4>
          <p>Всего пройденных: <strong>{stats.total}</strong></p>
          <p>Список: {stats.surveys.length > 0 ? stats.surveys.join(', ') : 'Нет пройденных опросов'}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Тест статуса опроса:</h4>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={testFormId}
              onChange={(e) => setTestFormId(e.target.value)}
              className="px-3 py-1 border rounded"
              placeholder="ID опроса"
            />
            <button
              onClick={testSurveyStatus}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Проверить статус
            </button>
          </div>
          
          {testResults.formId && (
            <div className="p-2 bg-white rounded border">
              <p><strong>Опрос:</strong> {testResults.formId}</p>
              <p><strong>Статус:</strong> {testResults.isCompleted ? 'Пройден' : 'Доступен'}</p>
              {testResults.error && <p><strong>Ошибка:</strong> {testResults.error}</p>}
              <p><strong>Время:</strong> {testResults.timestamp}</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">Тест получения доступных опросов:</h4>
          <button
            onClick={testAvailableForms}
            disabled={isLoading}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Получить доступные опросы
          </button>
          
          {testResults.availableForms && (
            <div className="p-2 bg-white rounded border mt-2">
              <p><strong>Количество:</strong> {testResults.count}</p>
              <div className="max-h-40 overflow-y-auto">
                {testResults.availableForms.map(form => (
                  <div key={form.id} className="text-sm border-b py-1">
                    <strong>{form.id}:</strong> {form.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => markSurveyAsCompleted(testFormId)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Отметить как пройденный
          </button>
          <button
            onClick={() => unmarkSurveyAsCompleted(testFormId)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Убрать из пройденных
          </button>
          <button
            onClick={clearCompletedSurveys}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Очистить все
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Инструкции:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Введите ID опроса (например, wbp8L6) и нажмите "Проверить статус"</li>
            <li>Нажмите "Получить доступные опросы" чтобы увидеть, какие опросы показываются</li>
            <li>Если опрос возвращает 400, он должен исчезнуть из списка</li>
            <li>Проверьте консоль браузера для подробных логов</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SurveyStatusTest;
