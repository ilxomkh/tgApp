# Интеграция с API /api/tally/forms

## Что было сделано

1. **Обновлен API endpoint** в `src/types/api.js`:
   - Изменен `TALLY_FORMS` с `/tally/tally/forms` на `/tally/forms` (исправлено дублирование `/api`)

2. **Добавлены новые типы** для API ответа:
   - `TallyFormApiResponse` - структура формы с сервера
   - `GetTallyFormsResponse` - структура ответа API

3. **Обновлен `tallyApiService`** в `src/services/tallyApi.js`:
   - Метод `getForms()` теперь корректно обрабатывает ответ API
   - Метод `getAvailableForms()` поддерживает фильтрацию по языку
   - Добавлена поддержка `prizeInfo` с сервера
   - Добавлен метод `getFormDetails()` для получения детальной информации о форме

4. **Создан тестовый компонент** `TallyFormsTest.jsx`:
   - Проверка доступности API
   - Загрузка форм с обработкой и напрямую
   - Загрузка детальной информации о форме с вопросами
   - Отображение всех вопросов с вариантами ответов
   - Отладочная информация

## Как использовать

### 1. Тестирование через браузер
Перейдите по адресу: `http://localhost:5173/test-tally` (после авторизации)

### 2. Использование в коде
```javascript
import tallyApiService from '../services/tallyApi.js';

// Получение всех форм
const forms = await tallyApiService.getForms();

// Получение форм для конкретного языка
const formsForLanguage = await tallyApiService.getAvailableForms('ru');

// Получение детальной информации о форме
const formDetails = await tallyApiService.getFormDetails('3xqyg9');

// Проверка доступности API
const isAvailable = await tallyApiService.isServerApiAvailable();
```

## Реальная структура JSON ответа от API

```json
{
  "items": [
    {
      "id": "3xqyg9",
      "name": "Registration Pro Survey Ru",
      "isNameModifiedByUser": true,
      "workspaceId": "3qbZL5",
      "organizationId": "w59dJd",
      "status": "PUBLISHED",
      "hasDraftBlocks": false,
      "numberOfSubmissions": 0,
      "createdAt": "2025-08-18T07:20:34.000Z",
      "updatedAt": "2025-08-26T12:32:44.000Z",
      "index": 0,
      "isClosed": false
    },
    {
      "id": "wbp8L6",
      "name": "Registration Pro Survey Uz",
      "isNameModifiedByUser": true,
      "workspaceId": "3qbZL5",
      "organizationId": "w59dJd",
      "status": "PUBLISHED",
      "hasDraftBlocks": false,
      "numberOfSubmissions": 0,
      "createdAt": "2025-08-18T10:41:25.000Z",
      "updatedAt": "2025-08-26T12:29:45.000Z",
      "index": 1,
      "isClosed": false
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 2,
  "hasMore": false
}
```

## Структура ответа для детальной информации о форме

```json
{
  "formId": "3xqyg9",
  "title": "Registration Pro Survey Ru",
  "questions": [
    {
      "id": "q1",
      "text": "Укажите свой пол",
      "type": "choice",
      "required": true,
      "options": [
        "Мужчина",
        "Женщина"
      ]
    },
    {
      "id": "q2",
      "text": "Сколько вам лет?",
      "type": "number",
      "required": true
    }
  ]
}
```

## Fallback механизм

Если API недоступен или возвращает ошибку, система автоматически использует локальную конфигурацию из `config.js`:

```javascript
TALLY: {
  FORM_IDS: {
    ru: '3xqyg9',
    uz: '3xqyg9',
  }
}
```

## Настройки

В `config.js` можно управлять поведением:

```javascript
TALLY: {
  SERVER_API: {
    ENABLED: true, // Включить/выключить серверный API
    TIMEOUT: 15000, // Таймаут запросов
    RETRY_ATTEMPTS: 3, // Количество попыток
  }
}
```

## Отладка

1. Откройте консоль браузера для просмотра логов
2. Используйте тестовый компонент `/test-tally` для проверки
3. Проверьте Network tab в DevTools для анализа запросов

## Интеграция завершена ✅

API `/api/tally/forms` успешно подключен и готов к использованию!
