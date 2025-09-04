# Telegram App

## Описание

Telegram приложение для проведения опросов и лотерей с интеграцией Tally Forms.

## Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Настройка окружения

Создайте файл `.env` на основе `env.example`:

```bash
cp env.example .env
```

Отредактируйте `.env` файл:

```env
# API Configuration
VITE_API_BASE_URL=http://10.2.50.27:8010/api

# Debug Mode
VITE_DEBUG_MODE=false

# Tally Webhook Configuration
VITE_TALLY_WEBHOOK_URL=http://10.2.50.27:8010/api/webhook/tally
VITE_TALLY_WEBHOOK_SECRET=your-secret-key
```

## 🚀 Возможности

- ✅ Аутентификация через SMS OTP
- ✅ Поддержка узбекских номеров телефонов
- ✅ Валидация данных на клиенте
- ✅ Обработка ошибок API
- ✅ Мультиязычность (русский/узбекский)
- ✅ Адаптивный дизайн
- ✅ Интеграция с Telegram WebApp

## 📋 Требования

- Node.js 18+
- npm или yarn
- Доступ к API серверу

## 🛠 Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd tg-app

# Установка зависимостей
npm install

# Создание файла конфигурации
cp .env.example .env
```

## ⚙️ Настройка

### 1. Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# API Configuration
VITE_API_BASE_URL=http://10.2.50.27:8010/api

# Development settings
VITE_DEBUG_MODE=true

# Optional: Custom timeout
VITE_REQUEST_TIMEOUT=10000
```

### 2. API Endpoints

Приложение использует следующие API endpoints:

#### Отправка OTP
```
POST /api/auth/request-otp
Content-Type: application/json

{
  "phone_number": "+998414736544"
}
```

#### Проверка OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone_number": "+998414736544",
  "code": "123456"
}
```

#### Получение профиля пользователя
```
GET /api/users/me
Authorization: Bearer <token>
```

#### Обновление профиля пользователя
```
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone_number": "+998344777518",
  "full_name": "Иван Иванов",
  "email": "user@example.com",
  "birth_date": "1990-01-01"
}
```

#### Получение списка лотерей
```
GET /api/raffles/
Authorization: Bearer <token>
```

## 🚀 Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр
npm run preview

# Линтинг
npm run lint
```

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── AuthScreen.jsx   # Экран аутентификации
│   └── Main/           # Основные экраны
├── contexts/           # React контексты
│   ├── AuthContext.jsx # Контекст аутентификации
│   └── LanguageContext.jsx
├── services/           # API сервисы
│   └── api.js         # Основной API клиент
├── utils/              # Утилиты
│   └── validation.js  # Валидация данных
├── constants/          # Константы
│   └── messages.js    # Сообщения об ошибках
├── types/              # Типы данных
│   └── api.js         # API типы
├── hooks/              # React хуки
│   └── useApi.js      # Хук для работы с API
└── config.js          # Конфигурация приложения
```

## 🔧 API Интеграция

### Основные функции

```javascript
import api from './services/api';

// Отправка OTP
const result = await api.requestOtp('+998414736544');

// Проверка OTP
const userData = await api.verifyOtp('+998414736544', '123456');

// Получение профиля пользователя
const profile = await api.getUserProfile();

// Обновление профиля пользователя
const updatedProfile = await api.updateUserProfile({
  phone_number: '+998344777518',
  full_name: 'Иван Иванов',
  email: 'user@example.com',
  birth_date: '1990-01-01'
});

// Получение списка лотерей
const raffles = await api.getRaffles();

// Полный цикл работы с профилем
const profileWorkflow = await apiExamples.profileWorkflow();

// Полный цикл работы с картами
const cardsWorkflow = await apiExamples.cardsWorkflow();

// Получение статистики приглашений
const inviteStats = await apiExamples.getInviteStats();

// Создание заказа опроса
const order = await apiExamples.createOrder();

// Создание платежа (вывод на карту)
const payment = await apiExamples.createPayment();

### Обработка ошибок

```javascript
try {
  const result = await api.requestOtp(phoneNumber);
} catch (error) {
  console.error('API Error:', error.message);
  // Ошибка автоматически переводится на нужный язык
}
```

### Валидация

```javascript
import { isValidUzbekPhone, isValidOtp } from './utils/validation';

// Проверка номера телефона
if (!isValidUzbekPhone('+998414736544')) {
  // Показать ошибку
}

// Проверка OTP кода
if (!isValidOtp('123456')) {
  // Показать ошибку
}
```

## 🌐 Мультиязычность

Приложение поддерживает русский и узбекский языки:

```javascript
import { getMessage } from './constants/messages';

// Получение сообщения на нужном языке
const message = getMessage('INVALID_PHONE', 'uz'); // узбекский
const message = getMessage('INVALID_PHONE', 'ru'); // русский
```

## 🧪 Тестирование

### Запуск тестов

```bash
npm test
```

### Тестирование API

```javascript
// В консоли браузера
import('./src/examples/api-examples.js').then(module => {
  // Тест отправки OTP
  module.exampleRequestOtp();
  
  // Тест полной аутентификации
  module.exampleFullAuth();
});
```

## 📱 Telegram WebApp

Приложение интегрировано с Telegram WebApp API:

- Автоматическая настройка цветов
- Поддержка safe-area
- Адаптация под мобильные устройства

## 🔒 Безопасность

- ✅ Валидация данных на клиенте
- ✅ HTTPS только в продакшене
- ✅ Безопасное хранение токенов
- ✅ Rate limiting на API
- ✅ Обработка ошибок без утечки данных

## 🚀 Развертывание

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

Создайте `netlify.toml`:

```toml
[build]
  publish = "dist"
  command = "npm run build"
```

### GitHub Pages

Обновите `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## 📚 Документация

- [API Setup](./API_SETUP.md) - Настройка API
- [Deployment](./DEPLOYMENT.md) - Инструкции по развертыванию

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера на ошибки
2. Убедитесь что API сервер доступен
3. Проверьте настройки CORS на сервере
4. Проверьте переменные окружения

## 📄 Лицензия

MIT License

## 🔄 Обновления

### v1.0.0
- ✅ Базовая аутентификация через OTP
- ✅ Интеграция с Telegram WebApp
- ✅ Мультиязычность
- ✅ Валидация данных
- ✅ Обработка ошибок
