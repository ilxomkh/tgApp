import React, { useState, useEffect } from 'react';
import { useSurvey } from '../hooks/useSurvey.js';
import { useApi } from '../hooks/useApi.js';
import tallyApiService from '../services/tallyApi.js';

/**
 * Тестовый компонент для проверки работы Tally API через сервер
 */
const TallyApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  
  const { 
    getAvailableSurveys, 
    getSurvey, 
    getFormResponses, 
    syncTallyData,
    loading: surveyLoading, 
    error: surveyError 
  } = useSurvey();

  const { 
    getTallyForms, 
    getTallyFormById, 
    getTallyFormResponses, 
    syncTallyData: syncData,
    loading: apiLoading, 
    error: apiError 
  } = useApi();

  const runAllTests = async () => {
    setIsRunning(true);
    const results = {};

    try {

      // Тест 1: Проверка доступности серверного API
      try {
        const isAvailable = await tallyApiService.isServerApiAvailable();
        results.apiAvailability = {
          success: true,
          message: `Серверный API ${isAvailable ? 'доступен' : 'недоступен'}`,
          data: { isAvailable }
        };
      } catch (error) {
        results.apiAvailability = {
          success: false,
          message: 'Ошибка при проверке доступности API',
          error: error.message
        };
      }

      // Тест 2: Получение списка форм через useSurvey
      try {
        const surveys = await getAvailableSurveys();
        results.surveysViaHook = {
          success: true,
          message: `Получено ${surveys.length} опросов`,
          data: surveys
        };
      } catch (error) {
        results.surveysViaHook = {
          success: false,
          message: 'Ошибка при получении опросов через useSurvey',
          error: error.message
        };
      }

      // Тест 3: Получение списка форм через useApi
      try {
        const formsResult = await getTallyForms();
        results.formsViaApi = {
          success: formsResult.success,
          message: formsResult.success 
            ? `Получено ${formsResult.data?.length || 0} форм` 
            : formsResult.error,
          data: formsResult.data
        };
      } catch (error) {
        results.formsViaApi = {
          success: false,
          message: 'Ошибка при получении форм через useApi',
          error: error.message
        };
      }

      // Тест 4: Получение конкретной формы (если есть формы)
      if (testResults.surveysViaHook?.success && testResults.surveysViaHook.data?.length > 0) {
        const firstSurvey = testResults.surveysViaHook.data[0];
        try {
          const survey = await getSurvey(firstSurvey.id);
          results.specificSurvey = {
            success: true,
            message: `Получена форма: ${survey.title}`,
            data: survey
          };
        } catch (error) {
          results.specificSurvey = {
            success: false,
            message: 'Ошибка при получении конкретной формы',
            error: error.message
          };
        }
      } else {
        try {
          const survey = await getSurvey('registration');
          results.specificSurvey = {
            success: true,
            message: `Получена форма: ${survey.title}`,
            data: survey
          };
        } catch (error) {
          results.specificSurvey = {
            success: false,
            message: 'Ошибка при получении формы по ID из конфигурации',
            error: error.message
          };
        }
      }

      // Тест 5: Прямое использование tallyApiService
      try {
        const forms = await tallyApiService.getAvailableForms('ru');
        results.directService = {
          success: true,
          message: `Получено ${forms.length} форм через сервис`,
          data: forms
        };
      } catch (error) {
        results.directService = {
          success: false,
          message: 'Ошибка при использовании tallyApiService',
          error: error.message
        };  
      }

    } catch (error) {
      console.error('Критическая ошибка при тестировании:', error);
      results.criticalError = {
        success: false,
        message: 'Критическая ошибка при тестировании',
        error: error.message
      };
    } finally {
      setIsRunning(false);
    }

    setTestResults(results);
  };

  const clearResults = () => {
    setTestResults({});
  };

  const renderTestResult = (testName, result) => {
    if (!result) return null;

    return (
      <div key={testName} className={`p-3 rounded mb-2 ${
        result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
      }`}>
        <div className="font-semibold">
          {result.success ? '✓' : '✗'} {testName}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {result.message}
        </div>
        {result.error && (
          <div className="text-sm text-red-600 mt-1">
            Ошибка: {result.error}
          </div>
        )}
        {result.data && (
          <details className="mt-2">
            <summary className="text-sm text-blue-600 cursor-pointer">
              Показать данные
            </summary>
            <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Тестирование Tally API через сервер</h1>
      
      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning || surveyLoading || apiLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mr-3"
        >
          {isRunning ? 'Тестирование...' : 'Запустить тесты'}
        </button>
        
        <button
          onClick={clearResults}
          disabled={isRunning}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Очистить результаты
        </button>
      </div>

      {(surveyLoading || apiLoading) && (
        <div className="bg-blue-100 border border-blue-300 p-3 rounded mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Загрузка...
          </div>
        </div>
      )}

      {(surveyError || apiError) && (
        <div className="bg-red-100 border border-red-300 p-3 rounded mb-4">
          <div className="font-semibold text-red-800">Ошибки:</div>
          {surveyError && <div className="text-red-600">useSurvey: {surveyError}</div>}
          {apiError && <div className="text-red-600">useApi: {apiError}</div>}
        </div>
      )}

      <div className="space-y-2">
        {renderTestResult('Доступность серверного API', testResults.apiAvailability)}
        {renderTestResult('Получение опросов через useSurvey', testResults.surveysViaHook)}
        {renderTestResult('Получение форм через useApi', testResults.formsViaApi)}
        {renderTestResult('Получение конкретной формы', testResults.specificSurvey)}
        {renderTestResult('Прямое использование сервиса', testResults.directService)}
        {renderTestResult('Критическая ошибка', testResults.criticalError)}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Сводка результатов:</h3>
          <div className="text-sm">
            <div>Всего тестов: {Object.keys(testResults).length}</div>
            <div>Успешных: {Object.values(testResults).filter(r => r.success).length}</div>
            <div>Неудачных: {Object.values(testResults).filter(r => !r.success).length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TallyApiTest;
