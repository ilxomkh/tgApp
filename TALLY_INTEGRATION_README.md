# Интеграция с Tally Forms

## Обзор

Этот документ описывает интеграцию приложения с Tally Forms для сбора данных через опросы.

## Настройка окружения

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# API Configuration
VITE_API_BASE_URL=http://10.2.50.27:8010/api

# Debug Mode
VITE_DEBUG_MODE=false

# Tally Webhook Configuration
VITE_TALLY_WEBHOOK_URL=http://10.2.50.27:8010/api/webhook/tally
VITE_TALLY_WEBHOOK_SECRET=your-secret-key
```

### Конфигурация сервера

В файле `server-example.js`:

```javascript
const config = {
  TALLY_WEBHOOK_SECRET: process.env.TALLY_WEBHOOK_SECRET || '',
  API_BASE_URL: process.env.API_BASE_URL || 'http://10.2.50.27:8010/api',
};
```

## Быстрый старт

### 1. Настройка сервера

1. Скопируйте код из `server-example.js` на ваш сервер
2. Установите зависимости:
   ```bash
   npm install express crypto
   ```
3. Создайте файл `.env` на основе `env.example`
4. Запустите сервер:
   ```bash
   node server-example.js
   ```

### 2. Настройка Tally

1. Войдите в [Tally Dashboard](https://tally.so/dashboard)
2. Перейдите к форме "Registration Pro Survey Ru" (ID: 3xqyg9)
3. В настройках добавьте webhook:
   - URL: `https://your-domain.com/api/webhook/tally`
   - Events: `formResponse`
   - Secret: `your-secret-key`

### 3. Настройка фронтенда

1. Скопируйте `env.example` в `.env`
2. Обновите переменные окружения
3. Запустите приложение:
   ```bash
   npm run dev
   ```

## Структура проекта

```
tg-app/
├── src/
│   ├── services/
│   │   ├── api.js              # Основной API сервис
│   │   └── tallyWebhook.js      # Сервис для работы с Tally
│   ├── hooks/
│   │   └── useSurvey.js         # Хук для работы с опросами
│   ├── components/
│   │   ├── TallySurvey.jsx      # Компонент Tally формы
│   │   └── Main/
│   │       └── SurveyModal.jsx  # Модальное окно опросов
│   ├── types/
│   │   └── api.js               # Типы данных
│   └── config.js                # Конфигурация
├── server-example.js            # Пример серверного кода
├── TALLY_WEBHOOK_SETUP.md       # Детальная документация
└── env.example                  # Пример переменных окружения
```

## Основные компоненты

### TallyWebhookService

Сервис для обработки webhook от Tally:

```javascript
import tallyWebhookService from '../services/tallyWebhook.js';

// Получить URL формы для языка
const formUrl = tallyWebhookService.getFormUrl('ru');

// Обработать webhook данные
const processedData = tallyWebhookService.processWebhook(webhookData);
```

### TallySurvey

Компонент для отображения Tally формы:

```javascript
import TallySurvey from '../components/TallySurvey.jsx';

<TallySurvey
  surveyId="intro"
  onComplete={(result) => console.log(result)}
  onClose={() => setModalOpen(false)}
/>
```

### useSurvey

Хук для работы с опросами:

```javascript
import { useSurvey } from '../hooks/useSurvey.js';

const { getSurvey, submitSurvey, loading, error } = useSurvey();

// Получить опрос
const survey = await getSurvey('intro');

// Отправить ответы
const result = await submitSurvey('intro', answers);
```

## Конфигурация

### Переменные окружения

```bash
# API
VITE_API_BASE_URL=http://10.2.50.27:8010/api

# Tally
VITE_TALLY_WEBHOOK_URL=http://10.2.50.27:8010/api/webhook/tally
VITE_TALLY_WEBHOOK_SECRET=your-secret-key

# Сервер
TALLY_WEBHOOK_SECRET=your-secret-key
API_BASE_URL=http://10.2.50.27:8010/api
PORT=3000
```

### ID форм

В `config.js` настроены ID форм для разных языков:

```javascript
TALLY: {
  FORM_IDS: {
    ru: '3xqyg9', // Registration Pro Survey Ru
    uz: '3xqyg9', // Registration Pro Survey Uz
  },
}
```

## Логика начисления бонусов

### Правила

1. **Базовый бонус**: 20,000 сум за заполнение всех полей
2. **Дополнительный бонус**: +5,000 сум для пользователей 18-25 лет
3. **Лотерея**: Автоматическое участие для пользователей старше 18 лет

### Примеры

- 25 лет, мужчина: 25,000 сум + лотерея
- 30 лет, женщина: 20,000 сум + лотерея
- 16 лет: 0 сум (недостаточный возраст)

## API Endpoints

### Webhook

```
POST /api/webhook/tally
```

Обрабатывает входящие webhook от Tally.

### Статистика

```
GET /api/surveys/responses?language=ru
```

Возвращает статистику ответов на опросы.

### Обработка ответов

```
POST /api/surveys/process
```

Обрабатывает ответы на опросы от фронтенда.

## Тестирование

### Тест webhook

```bash
curl -X POST https://your-domain.com/api/webhook/tally \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "formResponse",
    "payload": {
      "formId": "3xqyg9",
      "answers": {
        "gender": {"value": "male"},
        "age": {"value": "25"}
      }
    }
  }'
```

### Тест статистики

```bash
curl "https://your-domain.com/api/surveys/responses?language=ru"
```

## Безопасность

1. **Верификация подписи**: Проверка подписи от Tally
2. **HTTPS**: Обязательное использование HTTPS
3. **Валидация**: Проверка структуры данных
4. **Rate Limiting**: Ограничение количества запросов

## Устранение неполадок

### Webhook не работает

1. Проверьте URL в настройках Tally
2. Убедитесь, что сервер доступен
3. Проверьте логи сервера

### Ошибки верификации

1. Проверьте секретный ключ
2. Убедитесь в правильности алгоритма подписи

### Данные не сохраняются

1. Проверьте подключение к БД
2. Убедитесь в правильности моделей

## Поддержка

При проблемах:

1. Проверьте логи сервера
2. Убедитесь в корректности настроек
3. Протестируйте webhook
4. Обратитесь к документации Tally API
