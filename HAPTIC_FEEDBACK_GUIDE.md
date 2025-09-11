# Haptic Feedback Guide

Этот документ описывает, как использовать haptic feedback в Telegram WebApp.

## Обзор

Haptic feedback добавляет тактильную обратную связь при взаимодействии пользователя с интерфейсом. Это улучшает пользовательский опыт, особенно на мобильных устройствах.

## Доступные типы вибрации

### Impact (Удар)
- **light** - Легкая вибрация для обычных кнопок
- **medium** - Средняя вибрация для важных действий
- **heavy** - Сильная вибрация для критических действий

### Notification (Уведомления)
- **success** - Вибрация при успешном действии
- **error** - Вибрация при ошибке
- **warning** - Вибрация при предупреждении

### Selection
- **selection** - Вибрация при выборе элемента (например, в навигации)

## Использование

### Базовое использование

```javascript
import { useHapticClick } from '../utils/hapticFeedback';

const MyComponent = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  const hapticOnClick = useHapticClick(handleClick, 'medium');

  return (
    <button onClick={hapticOnClick}>
      Click me!
    </button>
  );
};
```

### Прямое использование функций

```javascript
import { lightImpact, notificationSuccess } from '../utils/hapticFeedback';

const handleSuccess = () => {
  notificationSuccess(); // Вибрация успеха
  // Ваша логика
};
```

## Рекомендации по использованию

### Типы кнопок и соответствующие вибрации

1. **Обычные кнопки** - `light`
   - Кнопки навигации
   - Вторичные действия
   - Переключатели

2. **Важные кнопки** - `medium`
   - Основные CTA кнопки
   - Кнопки отправки форм
   - Действия подтверждения

3. **Критические кнопки** - `heavy`
   - Удаление данных
   - Критические действия
   - Экстренные кнопки

4. **Навигация** - `selection`
   - Переключение табов
   - Выбор элементов списка
   - Переключение между экранами

5. **Уведомления**
   - `success` - при успешных операциях
   - `error` - при ошибках
   - `warning` - при предупреждениях

## Уже обновленные компоненты

Следующие компоненты уже обновлены с haptic feedback:

- `Main/ui.jsx` - CTAButton, SoftButton
- `Main/tabs/ProfileTab/parts/ActionButton.jsx` - ActionButton
- `Main/SurveyCard.jsx` - SurveyCard
- `Main/tabs/ProfileTab/parts/RowButton.jsx` - RowButton
- `TallySurvey.jsx` - кнопка закрытия
- `SMSTestComponent.jsx` - все тестовые кнопки
- `Main/BottomNav.jsx` - навигация
- `LanguageSelector.jsx` - выбор языка
- `AuthScreen.jsx` - основные кнопки авторизации
- `Onboarding.jsx` - кнопки онбординга
- `WelcomeScreen.jsx` - кнопка выбора языка

## Тестирование

Для тестирования haptic feedback используйте компонент `HapticTestComponent.jsx`:

```javascript
import HapticTestComponent from './components/HapticTestComponent';

// Добавьте в ваш компонент для тестирования
<HapticTestComponent />
```

## Совместимость

- Работает только в Telegram WebApp
- Автоматически проверяет доступность API
- Graceful degradation - если API недоступен, ошибки не возникают

## Технические детали

### Проверка доступности

```javascript
const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && 
         window.Telegram && 
         window.Telegram.WebApp && 
         window.Telegram.WebApp.HapticFeedback;
};
```

### Обработка ошибок

Все функции haptic feedback обернуты в try-catch блоки для предотвращения ошибок при недоступности API.

## Добавление haptic feedback к новым компонентам

1. Импортируйте `useHapticClick`:
```javascript
import { useHapticClick } from '../utils/hapticFeedback';
```

2. Создайте haptic обработчик:
```javascript
const hapticOnClick = useHapticClick(originalOnClick, 'light');
```

3. Используйте в кнопке:
```javascript
<button onClick={hapticOnClick}>
  Button Text
</button>
```

## Примеры использования в разных сценариях

### Форма с валидацией
```javascript
const handleSubmit = () => {
  if (isValid) {
    notificationSuccess();
    submitForm();
  } else {
    notificationError();
  }
};
```

### Навигация
```javascript
const handleTabChange = (tabId) => {
  selectionChanged();
  setActiveTab(tabId);
};
```

### Удаление с подтверждением
```javascript
const handleDelete = () => {
  heavyImpact();
  showConfirmDialog();
};
```

