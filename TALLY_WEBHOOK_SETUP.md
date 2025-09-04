# Настройка Tally Webhook

## Обзор

Этот документ описывает процесс настройки интеграции с Tally.so для получения данных опросов через webhook.

## Шаги настройки

### 1. Настройка сервера

1. Разместите код из `server-example.js` на вашем сервере
2. Установите необходимые зависимости:
   ```bash
   npm install express crypto
   ```

3. Настройте переменные окружения:
   ```bash
   export TALLY_WEBHOOK_SECRET="your-secret-key"
   export API_BASE_URL="https://your-domain.com/api"
   export PORT=3000
   ```

### 2. Настройка Tally Webhook

1. Войдите в [Tally Dashboard](https://tally.so/dashboard)
2. Перейдите к форме "Registration Pro Survey Ru" или "Registration Pro Survey Uz"
3. Нажмите "Settings" в левой панели
4. Найдите раздел "Integrations" или "Webhooks"
5. Добавьте новый webhook со следующими параметрами:
   - **URL**: `https://your-domain.com/api/webhook/tally`
   - **Events**: `formResponse`
   - **Secret** (опционально): `your-secret-key`

### 3. Настройка фронтенда

1. Обновите переменные окружения в `.env`:
   ```bash
   VITE_API_BASE_URL=https://your-domain.com/api
   VITE_TALLY_WEBHOOK_URL=https://your-domain.com/api/webhook/tally
   VITE_TALLY_WEBHOOK_SECRET=your-secret-key
   ```

2. Убедитесь, что ID форм настроены правильно в `config.js`:
   ```javascript
   FORM_IDS: {
     ru: '3xqyg9', // Registration Pro Survey Ru
     uz: '3xqyg9', // Registration Pro Survey Uz
   }
   ```

## Структура данных

### Входящий webhook от Tally

```json
{
  "eventId": "evt_123456789",
  "eventType": "formResponse",
  "createdAt": "2024-01-15T10:30:00Z",
  "payload": {
    "responseId": "resp_123456789",
    "submissionId": "sub_123456789",
    "respondentId": "resp_123456789",
    "formId": "3xqyg9",
    "formName": "Registration Pro Survey Ru",
    "answers": {
      "id": {
        "value": "user123",
        "label": "id"
      },
      "gender": {
        "value": "male",
        "label": "Укажите свой пол"
      },
      "age": {
        "value": "25",
        "label": "Сколько вам лет?"
      }
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Обработанные данные

```json
{
  "id": "resp_123456789",
  "formId": "3xqyg9",
  "formName": "Registration Pro Survey Ru",
  "language": "ru",
  "answers": {
    "id": {
      "value": "user123",
      "type": "text",
      "label": "id"
    },
    "gender": {
      "value": "male",
      "type": "choice",
      "label": "Укажите свой пол"
    },
    "age": {
      "value": "25",
      "type": "number",
      "label": "Сколько вам лет?"
    }
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "respondentId": "resp_123456789",
  "submissionId": "sub_123456789"
}
```

## Логика начисления бонусов

### Базовые правила

1. **Базовый бонус**: 20,000 сум за заполнение всех обязательных полей
2. **Дополнительный бонус**: +5,000 сум для пользователей 18-25 лет
3. **Участие в лотерее**: Автоматически для пользователей старше 18 лет

### Примеры

- **Пользователь 25 лет, мужчина**: 25,000 сум + участие в лотерее
- **Пользователь 30 лет, женщина**: 20,000 сум + участие в лотерее
- **Пользователь 16 лет**: 0 сум (недостаточный возраст)

## Тестирование

### 1. Тест webhook

Отправьте тестовый запрос на ваш webhook endpoint:

```bash
curl -X POST https://your-domain.com/api/webhook/tally \
  -H "Content-Type: application/json" \
  -H "x-tally-signature: test-signature" \
  -d '{
    "eventId": "test_123",
    "eventType": "formResponse",
    "createdAt": "2024-01-15T10:30:00Z",
    "payload": {
      "responseId": "test_resp_123",
      "submissionId": "test_sub_123",
      "respondentId": "test_resp_123",
      "formId": "3xqyg9",
      "formName": "Registration Pro Survey Ru",
      "answers": {
        "id": {"value": "test123", "label": "id"},
        "gender": {"value": "male", "label": "Укажите свой пол"},
        "age": {"value": "25", "label": "Сколько вам лет?"}
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }'
```

### 2. Тест фронтенда

1. Откройте приложение
2. Переключитесь на нужный язык
3. Откройте опрос
4. Заполните форму в Tally
5. Проверьте, что данные получены на сервере

## Мониторинг

### Логи

Сервер логирует все входящие webhook запросы:

```javascript
console.log('Saving survey response:', surveyData);
console.log('Saving reward data:', rewardData);
```

### Статистика

Получите статистику опросов:

```bash
curl "https://your-domain.com/api/surveys/responses?language=ru"
```

## Безопасность

1. **Верификация подписи**: Проверяйте подпись от Tally
2. **HTTPS**: Используйте только HTTPS для webhook
3. **Rate Limiting**: Добавьте ограничения на количество запросов
4. **Валидация данных**: Проверяйте структуру входящих данных

## Устранение неполадок

### Webhook не получает данные

1. Проверьте URL webhook в настройках Tally
2. Убедитесь, что сервер доступен из интернета
3. Проверьте логи сервера

### Ошибки верификации

1. Проверьте секретный ключ
2. Убедитесь, что алгоритм подписи правильный

### Данные не сохраняются

1. Проверьте подключение к базе данных
2. Убедитесь, что модели данных настроены правильно

## Поддержка

При возникновении проблем:

1. Проверьте логи сервера
2. Убедитесь, что все настройки корректны
3. Протестируйте webhook с помощью curl
4. Обратитесь к документации Tally API
