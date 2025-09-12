# Tally API Integration через сервер

Этот документ описывает интеграцию с Tally API через серверный прокси, что позволяет избежать ошибок 401 при прямом обращении к Tally с логином и паролем.

## Доступные API Endpoints

Сервер предоставляет следующие endpoints для работы с Tally:

- `GET /api/tally/tally/forms` - Получение списка всех форм
- `GET /api/tally/tally/forms/{form_id}` - Получение конкретной формы по ID (реальный ID Tally, например '3xqyg9')
- `GET /api/tally/tally/forms/{form_id}/responses` - Получение ответов на форму
- `POST /api/tally/tally/sync` - Синхронизация данных с Tally

**Важно:** `{form_id}` должен быть реальным ID формы Tally (например, '3xqyg9'), а не внутренним ID приложения (например, 'registration').

## Использование

### 1. Через хуки React

```javascript
import { useSurvey } from '../hooks/useSurvey.js';
import { useApi } from '../hooks/useApi.js';

const MyComponent = () => {
  const { 
    getAvailableSurveys, 
    getSurvey, 
    getFormResponses, 
    syncTallyData,
    loading, 
    error 
  } = useSurvey();

  const { 
    getTallyForms, 
    getTallyFormById, 
    getTallyFormResponses, 
    syncTallyData: syncData 
  } = useApi();

  // Получение списка опросов
  const handleGetSurveys = async () => {
    const surveys = await getAvailableSurveys();
    console.log('Доступные опросы:', surveys);
  };

  // Получение конкретного опроса
  const handleGetSurvey = async (surveyId) => {
    const survey = await getSurvey(surveyId);
    console.log('Данные опроса:', survey);
  };

  // Получение ответов на форму
  const handleGetResponses = async (formId) => {
    const responses = await getFormResponses(formId);
    console.log('Ответы на форму:', responses);
  };

  // Синхронизация данных
  const handleSyncData = async (formId) => {
    const result = await syncTallyData(formId);
    console.log('Результат синхронизации:', result);
  };
};
```

### 2. Прямое использование API

```javascript
import api from '../services/api.js';

// Получение всех форм
const formsResult = await api.getTallyForms();
if (formsResult.success) {
  console.log('Формы:', formsResult.data);
}

// Получение конкретной формы по реальному ID Tally
const formResult = await api.getTallyFormById('3xqyg9'); // реальный ID формы Tally
if (formResult.success) {
  console.log('Форма:', formResult.data);
}

// Получение ответов на форму
const responsesResult = await api.getTallyFormResponses('3xqyg9');
if (responsesResult.success) {
  console.log('Ответы:', responsesResult.data);
}

// Синхронизация данных
const syncResult = await api.syncTallyData({
  formId: '3xqyg9', // реальный ID формы Tally
  action: 'sync'
});
if (syncResult.success) {
  console.log('Синхронизация:', syncResult.data);
}
```

### 3. Использование сервиса TallyApiService

```javascript
import tallyApiService from '../services/tallyApi.js';

// Получение доступных форм с fallback
const forms = await tallyApiService.getAvailableForms('ru');

// Получение конкретной формы
const form = await tallyApiService.getFormById('form_id');

// Получение ответов
const responses = await tallyApiService.getFormResponses('form_id');

// Синхронизация
const syncResult = await tallyApiService.syncData('form_id', 'sync');

// Проверка доступности серверного API
const isAvailable = await tallyApiService.isServerApiAvailable();
```

## Конфигурация

### Переменные окружения

Добавьте следующие переменные в ваш `.env` файл:

```env
# Включить/выключить серверный API (по умолчанию включен)
VITE_TALLY_SERVER_API_ENABLED=true

# Таймаут для запросов к серверному API (в миллисекундах)
VITE_TALLY_SERVER_API_TIMEOUT=15000

# Количество попыток при ошибках
VITE_TALLY_SERVER_API_RETRY_ATTEMPTS=3
```

### Конфигурация в коде

```javascript
// config.js
export const config = {
  TALLY: {
    SERVER_API: {
      ENABLED: import.meta.env.VITE_TALLY_SERVER_API_ENABLED !== 'false',
      TIMEOUT: parseInt(import.meta.env.VITE_TALLY_SERVER_API_TIMEOUT) || 15000,
      RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_TALLY_SERVER_API_RETRY_ATTEMPTS) || 3,
    },
  },
};
```

## ⚠️ Важные замечания

### Различие между ID форм

1. **Внутренние ID** (например, 'registration') - используются в приложении для идентификации типов опросов
2. **Реальные ID Tally** (например, '3xqyg9') - используются в API endpoints

### Правильное использование

```javascript
// ❌ НЕПРАВИЛЬНО - использование внутреннего ID в API
const form = await api.getTallyFormById('registration'); // Ошибка 500!

// ✅ ПРАВИЛЬНО - использование реального ID Tally в API
const form = await api.getTallyFormById('3xqyg9'); // Работает!

// ✅ ПРАВИЛЬНО - использование внутреннего ID в хуках
const survey = await getSurvey('registration'); // Работает через fallback!
```

### Получение реальных ID форм

```javascript
// Сначала получаем все формы с сервера
const formsResult = await api.getTallyForms();
if (formsResult.success) {
  const forms = formsResult.data;
  forms.forEach(form => {
    console.log(`Форма: ${form.title}, ID: ${form.id}`);
    // Используйте form.id для дальнейших API вызовов
  });
}
```

## Fallback механизм

Система автоматически переключается на локальную конфигурацию, если:

1. Серверный API отключен в конфигурации
2. Серверный API недоступен
3. Произошла ошибка при обращении к серверному API

В этом случае используются формы из локальной конфигурации:

```javascript
// config.js
TALLY: {
  FORM_IDS: {
    ru: '3xqyg9',
    uz: '3xqyg9',
  },
}
```

## Типы данных

### TallyForm

```javascript
{
  id: string,           // ID формы
  title: string,        // Название формы
  description: string,  // Описание формы
  status: string,       // Статус формы (published, draft, etc.)
  createdAt: string,   // Дата создания
  updatedAt: string,   // Дата обновления
  url: string,         // URL формы
  responseCount: number // Количество ответов
}
```

### TallyFormResponse

```javascript
{
  id: string,           // ID ответа
  formId: string,        // ID формы
  submissionId: string,  // ID отправки
  respondentId: string, // ID респондента
  answers: Object,      // Ответы на вопросы
  createdAt: string,    // Дата создания ответа
  updatedAt: string     // Дата обновления ответа
}
```

### TallySyncRequest

```javascript
{
  formId: string,        // ID формы для синхронизации
  action?: string        // Действие синхронизации (sync, refresh, etc.)
}
```

## Обработка ошибок

Все методы включают обработку ошибок и возвращают понятные сообщения:

```javascript
try {
  const surveys = await getAvailableSurveys();
  // Успешное получение данных
} catch (error) {
  console.error('Ошибка при получении опросов:', error.message);
  // Обработка ошибки
}
```

## Примеры использования

См. файл `src/examples/tallyApiExample.js` для полных примеров использования всех методов.

## Миграция с прямого обращения к Tally

Если у вас есть код, который напрямую обращается к Tally API, замените его на использование новых методов:

### Было:
```javascript
// Прямое обращение к Tally (может вызывать 401 ошибки)
const response = await fetch('https://api.tally.so/forms', {
  headers: {
    'Authorization': `Bearer ${tallyApiKey}`
  }
});
```

### Стало:
```javascript
// Использование серверного API
const forms = await api.getTallyForms();
```

Это обеспечивает:
- Отсутствие ошибок 401
- Централизованное управление API ключами на сервере
- Fallback механизм при недоступности сервера
- Единообразную обработку ошибок
