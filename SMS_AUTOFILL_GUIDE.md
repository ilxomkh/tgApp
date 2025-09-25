# SMS Autofill Guide

## Обзор

Этот документ описывает реализацию SMS Autofill (автоматического заполнения SMS-кодов) в приложении Pro Survey. Функция позволяет пользователям автоматически получать и заполнять SMS-коды подтверждения без необходимости ручного ввода.

## Как это работает

### 1. WebOTP API (Современные браузеры)

Для современных браузеров используется WebOTP API, который позволяет:
- Автоматически получать SMS-коды
- Заполнять поля ввода без участия пользователя
- Автоматически отправлять код на проверку

### 2. Fallback для старых браузеров

Для браузеров без поддержки WebOTP API используется fallback механизм:
- Скрытое поле с правильными атрибутами
- Обработка событий `input` и `change`
- Автоматическое заполнение видимых полей

## Технические детали

### Ключевые атрибуты

```html
<input
  type="text"
  name="otp"
  autoComplete="one-time-code"
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength="6"
  autoCapitalize="off"
  autoCorrect="off"
  spellCheck="false"
/>
```

### WebOTP API

```javascript
if ("OTPCredential" in window) {
  navigator.credentials.get({
    otp: { transport: ["sms"] },
    signal: ac.signal,
  }).then((otp) => {
    if (otp && otp.code) {
      // Обработка полученного кода
    }
  });
}
```

### Fallback механизм

```javascript
const hiddenInput = document.querySelector('input[name="otp"]');
if (hiddenInput) {
  hiddenInput.addEventListener('input', handleInput);
}
```

## Поддерживаемые браузеры

### Полная поддержка (WebOTP API)
- Chrome 84+ (Android)
- Edge 84+ (Android)
- Samsung Internet 13.0+

### Частичная поддержка (Fallback)
- Safari (iOS)
- Firefox
- Старые версии Chrome

## Требования для SMS

Для правильной работы SMS autofill, SMS должно содержать:
- Код подтверждения
- Домен приложения (например, "prosurvey.com")
- Формат: "Ваш код: 123456 для prosurvey.com"

## Отладка

### Консольные логи
- `WebOTP code received:` - код получен через WebOTP API
- `Fallback autofill detected:` - код получен через fallback
- `OTP Autofill detected:` - код получен через отдельные поля

### Проверка поддержки
```javascript
if ("OTPCredential" in window) {
  console.log("WebOTP API поддерживается");
} else {
  console.log("Используется fallback механизм");
}
```

## Возможные проблемы

### 1. SMS не содержит домен
**Решение:** Убедитесь, что SMS содержит домен приложения

### 2. Неправильный формат SMS
**Решение:** Проверьте формат SMS на соответствие требованиям браузера

### 3. Браузер не поддерживает WebOTP
**Решение:** Fallback механизм автоматически активируется

### 4. Проблемы с HTTPS
**Решение:** WebOTP API работает только по HTTPS

## Тестирование

### Локальное тестирование
1. Используйте ngrok или подобный сервис для HTTPS
2. Отправьте тестовое SMS с правильным форматом
3. Проверьте консольные логи

### Продакшн тестирование
1. Убедитесь, что домен указан в SMS
2. Проверьте работу на разных устройствах
3. Протестируйте различные браузеры

## Будущие улучшения

- Поддержка дополнительных форматов SMS
- Улучшенная обработка ошибок
- Аналитика использования SMS autofill
- Поддержка других типов OTP (email, push)

## Связанные файлы

- `src/components/AuthScreen.jsx` - основная реализация
- `index.html` - мета-теги для мобильных браузеров
- `src/utils/validation.js` - валидация OTP кодов
