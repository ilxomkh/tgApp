# API Документация для Админки

## Базовые настройки

**Base URL:** `https://api.prosurvey.uz/api`  
**Content-Type:** `application/json`  
**Accept:** `application/json`

### Аутентификация
Все запросы к админке требуют:
- `Authorization: Bearer {token}` (из localStorage)
- `x-session-id: {session_id}` (из localStorage)

---

## 1. Получение списка пользователей

### Endpoint
```
GET /admin/users/?page={page}&limit={limit}
```

### Параметры запроса
- `page` (int, optional): номер страницы (по умолчанию 1)
- `limit` (int, optional): количество пользователей на странице (по умолчанию 20)

### Формат ответа
```json
{
  "users": [
    {
      "id": "123",
      "full_name": "Иван Иванов",
      "phone_number": "+998901234567",
      "email": "ivan@example.com",
      "birth_date": "1990-01-01",
      "language": "ru",
      "device_type": "iOS",
      "mobile_operator": "Ucell",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "telegram_id": "123456789",
      "referral_source": "telegram",
      "entry_point_initial": "app",
      "entry_points_used": ["app", "web", "bot"]
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1500
}
```

### Поля пользователя
- `id` (string): уникальный ID пользователя
- `full_name` (string): полное имя
- `phone_number` (string): номер телефона в формате +998XXXXXXXXX
- `email` (string|null): email адрес
- `birth_date` (string|null): дата рождения в формате YYYY-MM-DD
- `language` (string): язык интерфейса (ru, uz, en)
- `device_type` (string): тип устройства (iOS, Android, Desktop, Web)
- `mobile_operator` (string|null): мобильный оператор
- `created_at` (string): дата регистрации в ISO формате
- `updated_at` (string): дата последнего обновления в ISO формате
- `telegram_id` (string|null): Telegram ID пользователя
- `referral_source` (string|null): источник привлечения
- `entry_point_initial` (string|null): начальная точка входа
- `entry_points_used` (array): массив использованных точек входа

---

## 2. Получение детальной информации о пользователе

### Endpoint
```
GET /admin/users/{userId}
```

### Параметры запроса
- `userId` (string): ID пользователя

### Формат ответа
```json
{
  "id": "123",
  "full_name": "Иван Иванов",
  "phone_number": "+998901234567",
  "email": "ivan@example.com",
  "birth_date": "1990-01-01",
  "language": "ru",
  "device_type": "iOS",
  "mobile_operator": "Ucell",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "telegram_id": "123456789",
  "referral_source": "telegram",
  "entry_point_initial": "app",
  "entry_points_used": ["app", "web", "bot"]
}
```

---

## 3. Получение источников пользователя

### Endpoint
```
GET /admin/users/{userId}/sources
```

### Параметры запроса
- `userId` (string): ID пользователя

### Формат ответа
```json
{
  "referral_source": "telegram",
  "entry_point_initial": "app",
  "social_link": "https://t.me/channel",
  "entry_points_used": ["app", "web", "bot"]
}
```

### Поля ответа
- `referral_source` (string|null): источник привлечения пользователя
- `entry_point_initial` (string|null): начальная точка входа
- `social_link` (string|null): социальная ссылка
- `entry_points_used` (array): массив всех использованных точек входа

---

## 4. Получение статистики пользователя

### Endpoint
```
GET /admin/users/{userId}/stats
```

### Параметры запроса
- `userId` (string): ID пользователя

### Формат ответа
```json
{
  "current_balance": 50000,
  "total_earned": 150000,
  "total_withdrawn": 100000
}
```

### Поля ответа
- `current_balance` (number): текущий баланс в суммах
- `total_earned` (number): общий заработок в суммах
- `total_withdrawn` (number): общая сумма выводов в суммах

---

## 5. Получение реферальной информации пользователя

### Endpoint
```
GET /admin/users/{userId}/referrals
```

### Параметры запроса
- `userId` (string): ID пользователя

### Формат ответа
```json
{
  "referral_id": "ABC123",
  "referral_income_total": 25000,
  "referral_income_pending": 5000,
  "referrals_active_count": 5,
  "referrals_pending_count": 2
}
```

### Поля ответа
- `referral_id` (string): реферальный код пользователя
- `referral_income_total` (number): общий доход от рефералов в суммах
- `referral_income_pending` (number): ожидающий доход от рефералов в суммах
- `referrals_active_count` (number): количество активных рефералов
- `referrals_pending_count` (number): количество ожидающих рефералов

---

## Коды ошибок

### HTTP статусы
- `200` - Успешный запрос
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Пользователь не найден
- `500` - Внутренняя ошибка сервера

### Формат ошибки
```json
{
  "error": "User not found",
  "message": "Пользователь с указанным ID не найден"
}
```

---

## Примеры использования

### Получение первой страницы пользователей
```javascript
const response = await fetch('/admin/users/?page=1&limit=20', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_token',
    'x-session-id': 'your_session_id',
    'Content-Type': 'application/json'
  }
});
```

### Получение детальной информации о пользователе
```javascript
const response = await fetch('/admin/users/123', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_token',
    'x-session-id': 'your_session_id',
    'Content-Type': 'application/json'
  }
});
```

---

## Примечания

1. **Пагинация**: Все списки поддерживают пагинацию через параметры `page` и `limit`
2. **Валюты**: Все денежные суммы указаны в узбекских сумах (UZS)
3. **Даты**: Все даты в формате ISO 8601 (UTC)
4. **Телефоны**: Номера телефонов в международном формате +998XXXXXXXXX
5. **Языки**: Поддерживаемые языки: ru, uz, en
6. **Устройства**: Поддерживаемые типы: iOS, Android, Desktop, Web
