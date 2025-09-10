# Настройка API

## Обзор

Этот документ описывает настройку и использование API для Telegram приложения.

## Структура API

### Базовый URL
```
http://10.2.50.27:8010/api
```

### Эндпоинты

#### Аутентификация
- `POST /auth/request-otp` - Запрос OTP кода
- `POST /auth/verify-otp` - Проверка OTP кода

#### Пользователи
- `GET /users/me` - Получение профиля пользователя
- `PUT /users/me` - Обновление профиля пользователя

#### Лотереи
- `GET /raffles/` - Получение списка лотерей

#### Карты
- `GET /cards/` - Получение списка карт пользователя
- `POST /cards/` - Добавление новой карты

#### Приглашения
- `GET /referrals/stats` - Получение статистики приглашений

#### Опросы
- `POST /orders/` - Создание заказа опроса
- `POST /payments/` - Создание платежа
- `POST /webhook/tally` - Webhook для Tally форм
- `GET /surveys/responses` - Получение статистики опросов
- `POST /surveys/process` - Обработка ответа на опрос

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

### Конфигурация в коде

В файле `src/config.js`:

```javascript
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://10.2.50.27:8010/api',
  // ... остальные настройки
};
```

## Примеры запросов

### Запрос OTP кода
```bash
curl -X POST http://10.2.50.27:8010/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+998901234567"}'
```

### Проверка OTP кода
```bash
curl -X POST http://10.2.50.27:8010/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+998901234567", "code": "123456"}'
```

### Получение профиля пользователя
```bash
curl -X GET http://10.2.50.27:8010/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Обновление профиля пользователя
```bash
curl -X PUT http://10.2.50.27:8010/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Имя", "last_name": "Фамилия"}'
```

### Получение списка лотерей
```bash
curl -X GET http://10.2.50.27:8010/api/raffles/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Настройка

### 1. Создайте файл .env в корне проекта:
```env
VITE_API_BASE_URL=http://10.2.50.27:8010/api
VITE_DEBUG_MODE=true
```

### 2. Обновите конфигурацию в src/config.js:
```javascript
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://10.2.50.27:8010/api',
  // ... другие настройки
};
```

### 3. Убедитесь, что ваш API сервер:
- Поддерживает CORS для домена вашего приложения
- Возвращает правильные HTTP статус коды
- Обрабатывает ошибки и возвращает понятные сообщения

## Обработка ошибок

API возвращает ошибки в следующем формате:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Безопасность

- Все запросы должны использовать HTTPS
- OTP коды должны иметь ограниченное время жизни
- Рекомендуется ограничить количество попыток отправки OTP
- Используйте rate limiting для предотвращения злоупотреблений

## Тестирование

Для тестирования API можно использовать:
- Postman
- curl
- Thunder Client (VS Code extension)

### Пример curl запросов:

```bash
# Отправка OTP
curl -X POST http://10.2.50.27:8010/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+998414736544"}'

# Проверка OTP
curl -X POST http://10.2.50.27:8010/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+998414736544", "code": "123456"}'

# Получение профиля пользователя
curl -X GET http://10.2.50.27:8010/api/users/me \
  -H "Authorization: Bearer <your-token>"

# Обновление профиля пользователя
curl -X PUT http://10.2.50.27:8010/api/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "phone_number": "+998344777518",
    "full_name": "Иван Иванов",
    "email": "user@example.com",
    "birth_date": "1990-01-01"
  }'

# Получение списка лотерей
curl -X GET http://10.2.50.27:8010/api/raffles/ \
  -H "Authorization: Bearer <your-token>"
