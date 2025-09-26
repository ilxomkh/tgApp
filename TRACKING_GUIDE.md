# Руководство по трекингу действий пользователей

## Обзор

Система трекинга позволяет отслеживать действия пользователей в приложении и отправлять их на бекенд для анализа. Все данные автоматически попадают в базу данных через API endpoint `/track/action`.

## Архитектура

### 1. API Endpoint
- **URL**: `/track/action`
- **Метод**: POST
- **Параметры**:
  ```json
  {
    "action_name": "string",
    "context": {
      "additionalProp1": {}
    }
  }
  ```

### 2. Сервис трекинга (`trackingService.js`)
Основной сервис для отправки данных на сервер:
- Очередь действий для оптимизации запросов
- Автоматические повторные попытки при ошибках
- Очистка чувствительных данных
- Контекстная информация (URL, user agent, timestamp)

### 3. React хуки (`useTracking.js`)
Хуки для удобного использования в компонентах:
- `useTracking()` - основной хук с автоматическим трекингом страниц
- `useButtonTracking()` - трекинг кликов по кнопкам
- `useModalTracking()` - трекинг модальных окон
- `useFormTracking()` - трекинг форм
- `useErrorTracking()` - трекинг ошибок

## Использование

### Базовое использование

```jsx
import { useTracking } from '../hooks/useTracking';

function MyComponent() {
  const { trackAction, trackButtonClick } = useTracking();

  const handleClick = () => {
    trackButtonClick('submit_button', 'profile_page', {
      form_type: 'profile_edit'
    });
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

### Автоматический трекинг страниц

```jsx
import { useTracking } from '../hooks/useTracking';

function MyPage() {
  // Автоматически трекает просмотры страниц и время на странице
  useTracking({
    trackPageViews: true,
    trackTimeOnPage: true,
    pageName: 'profile_page'
  });

  return <div>My Page Content</div>;
}
```

### Трекинг модальных окон

```jsx
import { useModalTracking } from '../hooks/useTracking';

function MyModal({ isOpen, onClose }) {
  const { handleOpen, handleClose } = useModalTracking('settings_modal');

  useEffect(() => {
    if (isOpen) {
      handleOpen({ source: 'profile_button' });
    }
  }, [isOpen, handleOpen]);

  const onCloseClick = () => {
    handleClose('button');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseClick}>
      Modal Content
    </Modal>
  );
}
```

### Трекинг форм

```jsx
import { useFormTracking } from '../hooks/useTracking';

function MyForm() {
  const trackFormSubmit = useFormTracking('contact_form');

  const handleSubmit = async (formData) => {
    try {
      await submitForm(formData);
      trackFormSubmit(formData, true); // success = true
    } catch (error) {
      trackFormSubmit(formData, false); // success = false
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Отслеживаемые действия

### Аутентификация
- `auth_otp_request` - запрос OTP кода
- `auth_otp_request_success` - успешный запрос OTP
- `auth_otp_request_error` - ошибка запроса OTP
- `auth_login_attempt` - попытка входа
- `auth_login_success` - успешный вход
- `auth_login_error` - ошибка входа
- `auth_logout` - выход из системы

### Профиль пользователя
- `profile_update_attempt` - попытка обновления профиля
- `profile_update_success` - успешное обновление
- `profile_update_error` - ошибка обновления

### Опросы
- `survey_start` - начало опроса
- `survey_complete_attempt` - попытка завершения
- `survey_complete_success` - успешное завершение
- `survey_complete_error` - ошибка завершения
- `survey_exit_attempt` - попытка выхода
- `survey_exit_confirm` - подтверждение выхода
- `survey_exit_cancel` - отмена выхода
- `question_next` - переход к следующему вопросу
- `question_previous` - возврат к предыдущему вопросу

### Реферальная программа
- `share_attempt` - попытка поделиться
- `share_success` - успешное деление
- `share_error` - ошибка деления
- `copy_attempt` - попытка копирования
- `copy_success` - успешное копирование
- `copy_error` - ошибка копирования
- `how_it_works_click` - клик по "Как это работает"

### Навигация
- `page_view` - просмотр страницы
- `page_navigation` - переход между страницами
- `time_on_page` - время на странице

### Модальные окна
- `modal_open` - открытие модального окна
- `modal_close` - закрытие модального окна

### Кнопки
- `button_click` - клик по кнопке

### Ошибки
- `error_occurred` - произошла ошибка

### Telegram WebApp
- `telegram_webapp_init` - инициализация WebApp
- `telegram_back_button_click` - клик по кнопке "Назад"

## Контекстные данные

Каждое действие автоматически включает:
- `timestamp` - время действия
- `user_agent` - информация о браузере
- `url` - текущий URL
- `referrer` - источник перехода

Дополнительные данные зависят от типа действия.

## Безопасность

- Номера телефонов маскируются (остаются только последние 4 цифры)
- Пароли и токены исключаются из контекста
- Номера карт исключаются из контекста

## Настройка

### Включение/выключение трекинга

```jsx
import trackingService from '../services/trackingService';

// Выключить трекинг
trackingService.setEnabled(false);

// Включить трекинг
trackingService.setEnabled(true);
```

### Очистка очереди

```jsx
// Очистить очередь неотправленных действий
trackingService.clearQueue();

// Получить количество действий в очереди
const queueLength = trackingService.getQueueLength();
```

## Мониторинг

Для отладки можно отслеживать:
- Количество действий в очереди
- Ошибки отправки
- Время обработки запросов
- Статус аутентификации

```jsx
// В консоли браузера
console.log('Queue length:', trackingService.getQueueLength());
console.log('Tracking status:', trackingService.getStatus());
```

### Статус трекинга

Метод `getStatus()` возвращает объект с информацией о состоянии трекинга:

```jsx
{
  enabled: true,           // включен ли трекинг
  authenticated: true,     // аутентифицирован ли пользователь
  queueLength: 0,          // количество действий в очереди
  isProcessing: false,     // обрабатывается ли очередь
  hasUser: true,           // есть ли данные пользователя
  hasSessionId: true,      // есть ли session_id
  hasToken: true           // есть ли токен авторизации
}
```

## Интеграция с бекендом

Бекенд должен обрабатывать endpoint `/track/action` и сохранять данные в базу:

```python
@router.post("/action", status_code=status.HTTP_202_ACCEPTED)
async def track_user_action(
    action_data: UserActionSchema,
    current_user: User = Depends(get_current_user_from_session),
):
    log_user_action.delay(
        user_id=current_user.id,
        action_name=action_data.action_name,
        context=action_data.context
    )
    return {"status": "action accepted"}
```

## Примеры использования в компонентах

### Трекинг в существующих компонентах

1. **App.jsx** - автоматический трекинг навигации и инициализации
2. **AuthContext.jsx** - трекинг аутентификации
3. **InviteTab.jsx** - трекинг реферальных действий
4. **SurveyModal.jsx** - трекинг опросов

### Добавление трекинга в новый компонент

```jsx
import { useTracking } from '../hooks/useTracking';

function NewComponent() {
  const { trackButtonClick, trackAction } = useTracking();

  const handleSpecialAction = () => {
    trackAction('special_action', {
      component: 'NewComponent',
      action_type: 'user_interaction'
    });
  };

  return (
    <button onClick={handleSpecialAction}>
      Special Action
    </button>
  );
}
```

## Лучшие практики

1. **Используйте осмысленные названия действий** - `button_click` лучше чем `click`
2. **Добавляйте контекст** - где произошло действие, что за компонент
3. **Не трекайте слишком часто** - избегайте трекинга каждого движения мыши
4. **Группируйте связанные действия** - используйте префиксы (`survey_`, `auth_`, `profile_`)
5. **Тестируйте трекинг** - проверяйте, что данные доходят до бекенда
6. **Мониторьте производительность** - очередь помогает, но следите за размером

## Отладка

Для отладки трекинга:

1. Откройте DevTools → Network
2. Найдите запросы к `/track/action`
3. Проверьте статус ответа (должен быть 202)
4. Проверьте данные в теле запроса

### Проверка статуса трекинга

```jsx
// Проверить статус трекинга
console.log('Tracking status:', trackingService.getStatus());

// Проверить аутентификацию
const user = localStorage.getItem('user');
const sessionId = localStorage.getItem('session_id');
const token = localStorage.getItem('auth_token');

console.log('Auth status:', {
  hasUser: !!user,
  hasSessionId: !!sessionId,
  hasToken: !!token
});
```

### Временное логирование для отладки

```jsx
// Временное логирование для отладки
const originalTrack = trackingService.track;
trackingService.track = function(actionName, context) {
  console.log('Tracking:', actionName, context);
  return originalTrack.call(this, actionName, context);
};
```

### Решение проблем

**Ошибка 422 Unprocessable Entity:**
- Проверьте наличие `x-session-id` в заголовках запроса
- Убедитесь, что пользователь аутентифицирован
- Проверьте формат данных в теле запроса

**Трекинг не работает:**
- Проверьте `trackingService.getStatus()`
- Убедитесь, что `enabled: true` и `authenticated: true`
- Проверьте консоль на наличие ошибок
