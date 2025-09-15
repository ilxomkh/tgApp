import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import tallyApiService from '../services/tallyApi.js';

const TallyFormsTest = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formDetails, setFormDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown');
  const { language } = useLanguage();

  const checkApiStatus = async () => {
    try {
      const isAvailable = await tallyApiService.isServerApiAvailable();
      setApiStatus(isAvailable ? 'available' : 'unavailable');
    } catch (err) {
      setApiStatus('error');
      console.error('API status check failed:', err);
    }
  };

  const loadForms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const availableForms = await tallyApiService.getAvailableForms(language);
      setForms(availableForms);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFormsDirectly = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const directForms = await tallyApiService.getForms();
      setForms(directForms);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load forms directly:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFormDetails = async (formId) => {
    setLoading(true);
    setError(null);
    
    try {
      const details = await tallyApiService.getFormDetails(formId);
      setFormDetails(details);
      setSelectedForm(formId);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load form details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'available': return 'text-green-600';
      case 'unavailable': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'available': return 'API доступен';
      case 'unavailable': return 'API недоступен';
      case 'error': return 'Ошибка проверки API';
      default: return 'Проверка...';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Тест интеграции с API /api/tally/forms</h2>
      
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Статус API:</span>
          <span className={`font-bold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Текущий язык: {language}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={loadForms}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : 'Загрузить формы (с обработкой)'}
        </button>
        
        <button
          onClick={loadFormsDirectly}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : 'Загрузить напрямую'}
        </button>
        
        <button
          onClick={checkApiStatus}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Проверить API
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Загруженные формы ({forms.length}):</h3>
        
        {forms.length === 0 && !loading && (
          <div className="text-gray-500 italic">
            Формы не загружены. Нажмите кнопку выше для загрузки.
          </div>
        )}
        
        {forms.map((form, index) => (
          <div key={form.id || index} className="p-3 border border-gray-200 rounded-lg">
            <div className="font-medium text-lg">{form.title}</div>
            <div className="text-sm text-gray-600 mb-2">{form.description}</div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>ID:</strong> {form.id}</div>
              <div><strong>Form ID:</strong> {form.formId}</div>
              <div><strong>Язык:</strong> {form.language}</div>
              <div><strong>Тип:</strong> {form.type}</div>
            </div>
            
            {form.serverInfo && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <strong>Информация с сервера:</strong>
                <div className="text-sm">
                  <div>Статус: {form.serverInfo.status}</div>
                  <div>Ответов: {form.serverInfo.numberOfSubmissions}</div>
                  <div>Закрыта: {form.serverInfo.isClosed ? 'Да' : 'Нет'}</div>
                  <div>Создана: {new Date(form.serverInfo.createdAt).toLocaleDateString()}</div>
                  <div>Обновлена: {new Date(form.serverInfo.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            )}

            <div className="mt-2">
              <button
                onClick={() => loadFormDetails(form.id)}
                disabled={loading}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 disabled:opacity-50"
              >
                {loading && selectedForm === form.id ? 'Загрузка...' : 'Загрузить детали'}
              </button>
            </div>
            
            {form.url && (
              <div className="mt-2">
                <strong>URL:</strong> 
                <a 
                  href={form.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {form.url}
                </a>
              </div>
            )}
            
            {form.prizeInfo && (
              <div className="mt-2 p-2 bg-yellow-50 rounded">
                <strong>Информация о призах:</strong>
                <div className="text-sm">
                  <div>Базовый приз: 12 000 сум</div>
                  <div>Дополнительный приз: 12 000 сум</div>
                  <div>Лотерея: 3 000 000 сум</div>
                  <div>Участие в лотерее: Да</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {formDetails && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">
            Детали формы: {formDetails.title}
          </h3>
          
          <div className="mb-3 text-sm text-green-700">
            <div><strong>ID формы:</strong> {formDetails.formId}</div>
            <div><strong>Всего вопросов:</strong> {formDetails.totalQuestions}</div>
            <div><strong>Обязательных вопросов:</strong> {formDetails.requiredQuestions}</div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-green-800">Вопросы:</h4>
            {formDetails.questions.map((question, index) => (
              <div key={question.id} className="p-3 bg-white rounded border">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-sm text-gray-600">#{index + 1}</span>
                  <div className="flex-1">
                    <div className="font-medium">{question.text}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                        {question.type}
                      </span>
                      {question.required && (
                        <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded">
                          Обязательный
                        </span>
                      )}
                    </div>
                    {question.options && question.options.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm text-gray-600 mb-1">Варианты ответов:</div>
                        <div className="grid grid-cols-1 gap-1">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="text-sm text-gray-700 pl-2">
                              • {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer font-medium">Отладочная информация</summary>
        <div className="mt-2 p-3 bg-gray-100 rounded text-sm">
          <div><strong>API Base URL:</strong> {tallyApiService.apiBaseUrl}</div>
          <div><strong>Server API Enabled:</strong> {config.TALLY.SERVER_API.ENABLED ? 'Да' : 'Нет'}</div>
          <div><strong>Fallback Form IDs:</strong> {JSON.stringify(config.TALLY.FORM_IDS)}</div>
        </div>
      </details>
    </div>
  );
};

export default TallyFormsTest;
