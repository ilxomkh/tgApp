# Инструкция по использованию Tally API через сервер

## Что было сделано

1. **Добавлены новые API endpoints** в `src/types/api.js`:
   - `TALLY_FORMS: '/tally/tally/forms'`
   - `TALLY_FORM_BY_ID: '/tally/tally/forms'`
   - `TALLY_FORM_RESPONSES: '/tally/tally/forms'`
   - `TALLY_SYNC: '/tally/tally/sync'`

2. **Обновлен API сервис** (`src/services/api.js`):
   - Добавлены методы для работы с Tally через сервер
   - Все запросы используют авторизацию через токены

3. **Создан новый сервис** (`src/services/tallyApi.js`):
   - Централизованная работа с Tally API
   - Автоматический fallback на локальную конфигурацию
   - Проверка доступности серверного API

4. **Обновлены хуки**:
   - `useApi.js` - добавлены методы для Tally API
   - `useSurvey.js` - интегрирован с новым сервисом

5. **Обновлена конфигурация** (`src/config.js`):
   - Добавлены настройки для серверного API
   - Возможность включения/выключения через переменные окружения

## ⚠️ Важно: Различие между ID форм

### Внутренние ID vs Реальные ID Tally

1. **Внутренние ID** (например, 'registration') - используются в приложении
2. **Реальные ID Tally** (например, '3xqyg9') - используются в API endpoints

### Правильное использование

```javascript
// ✅ ПРАВИЛЬНО - получение всех форм
const formsResult = await api.getTallyForms();
if (formsResult.success) {
  formsResult.data.forEach(form => {
    console.log(`Форма: ${form.title}, Реальный ID: ${form.id}`);
  });
}

// ✅ ПРАВИЛЬНО - получение формы по реальному ID
const formResult = await api.getTallyFormById('3xqyg9'); // реальный ID Tally

// ✅ ПРАВИЛЬНО - использование внутреннего ID в хуках
const survey = await getSurvey('registration'); // работает через fallback

// ❌ НЕПРАВИЛЬНО - использование внутреннего ID в API
const form = await api.getTallyFormById('registration'); // ошибка 500!
```

## Как использовать

### 1. Получение списка опросов

```javascript
import { useSurvey } from '../hooks/useSurvey.js';

const MyComponent = () => {
  const { getAvailableSurveys, loading, error } = useSurvey();

  const handleGetSurveys = async () => {
    try {
      const surveys = await getAvailableSurveys();
      console.log('Доступные опросы:', surveys);
    } catch (error) {
      console.error('Ошибка:', error.message);
    }
  };

  return (
    <button onClick={handleGetSurveys} disabled={loading}>
      {loading ? 'Загрузка...' : 'Получить опросы'}
    </button>
  );
};
```

### 2. Получение конкретной формы

```javascript
const { getSurvey } = useSurvey();

const survey = await getSurvey('form_id');
console.log('Данные формы:', survey);
```

### 3. Получение ответов на форму

```javascript
const { getFormResponses } = useSurvey();

const responses = await getFormResponses('form_id');
console.log('Ответы:', responses);
```

### 4. Синхронизация данных

```javascript
const { syncTallyData } = useSurvey();

const result = await syncTallyData('form_id');
console.log('Результат синхронизации:', result);
```

## Переменные окружения

Добавьте в `.env` файл:

```env
# Включить серверный API (по умолчанию включен)
VITE_TALLY_SERVER_API_ENABLED=true

# Таймаут для запросов (в миллисекундах)
VITE_TALLY_SERVER_API_TIMEOUT=15000

# Количество попыток при ошибках
VITE_TALLY_SERVER_API_RETRY_ATTEMPTS=3
```

## Тестирование

Для тестирования работы API используйте компонент `TallyApiTest`:

```javascript
import TallyApiTest from '../components/TallyApiTest.jsx';

// В вашем приложении
<TallyApiTest />
```

## Fallback механизм

Если серверный API недоступен, система автоматически переключится на локальную конфигурацию из `config.js`:

```javascript
TALLY: {
  FORM_IDS: {
    ru: '3xqyg9',
    uz: '3xqyg9',
  },
}
```

## Преимущества

1. **Нет ошибок 401** - все запросы идут через ваш сервер с API ключами
2. **Централизованное управление** - API ключи хранятся на сервере
3. **Fallback механизм** - работает даже при недоступности сервера
4. **Единообразная обработка ошибок** - все ошибки обрабатываются одинаково
5. **Легкая миграция** - существующий код продолжает работать

## Миграция существующего кода

Замените прямые обращения к Tally API:

```javascript
// Было (может вызывать 401):
const response = await fetch('https://api.tally.so/forms', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});

// Стало:
const formsResult = await api.getTallyForms();
if (formsResult.success) {
  const forms = formsResult.data;
  // Используйте forms[0].id для дальнейших API вызовов
}
```

## Решение проблемы с ошибкой 500

Если вы получаете ошибку 500 при обращении к `/api/tally/tally/forms/registration`, это означает, что вы используете внутренний ID вместо реального ID Tally.

### Правильный workflow:

1. **Сначала получите все формы:**
```javascript
const formsResult = await api.getTallyForms();
if (formsResult.success) {
  const forms = formsResult.data;
  console.log('Доступные формы:', forms);
}
```

2. **Используйте реальный ID для API вызовов:**
```javascript
// Используйте реальный ID из полученного списка
const formResult = await api.getTallyFormById('3xqyg9'); // реальный ID
```

3. **Для совместимости используйте хуки:**
```javascript
// Хуки автоматически обрабатывают маппинг ID
const survey = await getSurvey('registration'); // работает через fallback
```

Теперь все опросники будут приходить через сервер, что исключает ошибки 401 и 500!
