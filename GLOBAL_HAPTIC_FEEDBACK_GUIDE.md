# Глобальный Haptic Feedback - Руководство

## Обзор

В приложении реализована глобальная система haptic feedback, которая автоматически добавляет вибрацию ко всем интерактивным элементам при нажатии.

## Что работает автоматически

### ✅ Автоматически покрывается вибрацией:
- Все `<button>` элементы
- Элементы с `role="button"`
- Элементы с классами `.clickable` или атрибутом `data-clickable`
- Ссылки `<a href>`
- Элементы с атрибутом `onclick`

### ❌ Исключены из вибрации:
- Элементы с классом `.no-haptic`
- Элементы с атрибутом `data-no-haptic`
- Поля ввода: `input[type="text"]`, `input[type="email"]`, `input[type="password"]`
- Текстовые области: `textarea`
- Выпадающие списки: `select`

## Настройка

Глобальный haptic feedback инициализируется в `App.jsx` с настройками:

```javascript
const cleanupHaptic = initGlobalHapticFeedback({
  feedbackType: 'light', // Тип вибрации по умолчанию
  excludeSelectors: [
    '.no-haptic', 
    '[data-no-haptic]',
    'input[type="text"]',
    'input[type="email"]', 
    'input[type="password"]',
    'textarea',
    'select'
  ],
  includeSelectors: [
    'button', 
    '[role="button"]', 
    '.clickable', 
    '[data-clickable]',
    'a[href]',
    '[onclick]'
  ]
});
```

## Использование

### Для отключения вибрации на конкретном элементе:

```jsx
// Вариант 1: через класс
<button className="no-haptic">Кнопка без вибрации</button>

// Вариант 2: через атрибут
<button data-no-haptic>Кнопка без вибрации</button>
```

### Для добавления вибрации к нестандартным элементам:

```jsx
// Вариант 1: через класс
<div className="clickable" onClick={handleClick}>
  Кликабельный элемент
</div>

// Вариант 2: через атрибут
<div data-clickable onClick={handleClick}>
  Кликабельный элемент
</div>

// Вариант 3: через role
<div role="button" onClick={handleClick}>
  Элемент как кнопка
</div>
```

## Ручное управление

Если нужно использовать специфичные типы вибрации, используйте существующие функции:

```javascript
import { 
  lightImpact, 
  mediumImpact, 
  heavyImpact,
  notificationSuccess,
  notificationError,
  notificationWarning,
  selectionChanged,
  useHapticClick 
} from './utils/hapticFeedback';

// Прямой вызов
const handleClick = () => {
  lightImpact(); // Легкая вибрация
  // ваш код...
};

// Через хук
const hapticOnClick = useHapticClick(handleClick, 'medium');
```

## Типы вибрации

- `light` - Легкая вибрация (по умолчанию)
- `medium` - Средняя вибрация
- `heavy` - Сильная вибрация
- `success` - Вибрация успеха
- `error` - Вибрация ошибки
- `warning` - Вибрация предупреждения
- `selection` - Вибрация выбора

## Совместимость

- Работает только в Telegram WebApp
- Автоматически проверяет доступность API
- Безопасно обрабатывает ошибки
- Не влияет на производительность

## Отладка

Для тестирования haptic feedback используйте компонент `HapticTestComponent`:

```jsx
import HapticTestComponent from './components/HapticTestComponent';

// В любом месте приложения
<HapticTestComponent />
```

## Примечания

- Глобальный обработчик использует `capture: true` для раннего перехвата событий
- Система автоматически очищается при размонтировании приложения
- Существующие компоненты с `useHapticClick` продолжают работать как прежде
- Новая система дополняет, а не заменяет существующую функциональность
