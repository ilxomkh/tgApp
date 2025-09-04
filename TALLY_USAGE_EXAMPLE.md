# Пример использования Tally интеграции

## Как это работает

### 1. Загрузка опросов

При открытии главной страницы приложение автоматически загружает доступные опросы из Tally:

```javascript
// В HomeTab.jsx
useEffect(() => {
  const loadSurveys = async () => {
    const availableSurveys = await getAvailableSurveys();
    setSurveys(availableSurveys);
  };
  loadSurveys();
}, [getAvailableSurveys]);
```

### 2. Отображение опросов

Опросы отображаются в виде карточек с информацией о призах:

```javascript
// Каждый опрос содержит:
{
  id: 'registration',
  title: 'Тема: Регистрация', // или 'Mavzu: Ro\'yxatdan o\'tish'
  type: 'tally',
  formUrl: 'https://tally.so/forms/3xqyg9',
  language: 'ru', // или 'uz'
  displayInfo: {
    lines: [
      'Сумма приза: 20000 сум',
      'Участие в розыгрыше на 3000000 сум'
    ]
  }
}
```

### 3. Открытие опроса

При нажатии на "Пройти опрос" открывается Tally форма в iframe:

```javascript
// В SurveyModal.jsx
if (survey?.type === 'tally') {
  return (
    <TallySurvey
      surveyId={survey.id}
      onComplete={(result) => {
        // Обработка завершения опроса
      }}
      onClose={onClose}
    />
  );
}
```

### 4. Получение данных через webhook

Когда пользователь заполняет форму в Tally, данные отправляются на ваш сервер:

```javascript
// В server-example.js
app.post('/api/webhook/tally', async (req, res) => {
  const webhookData = req.body;
  
  // Обработка данных
  const surveyData = {
    id: webhookData.payload.responseId,
    formId: webhookData.payload.formId,
    language: determineLanguage(webhookData.payload.formName),
    answers: processAnswers(webhookData.payload.answers),
    createdAt: webhookData.payload.createdAt
  };
  
  // Начисление бонусов
  const result = await processSurveyForRewards(surveyData);
  
  res.json({ success: true, data: result });
});
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
    }
  }
}
```

### Обработанные данные

```json
{
  "id": "resp_123456789",
  "formId": "3xqyg9",
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
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Логика начисления бонусов

### Правила

1. **Базовый бонус**: 20,000 сум за заполнение всех полей
2. **Дополнительный бонус**: +5,000 сум для пользователей 18-25 лет
3. **Лотерея**: Автоматическое участие для пользователей старше 18 лет

### Примеры

```javascript
// Пользователь 25 лет, мужчина
const result = {
  success: true,
  message: "Вам начислено 25000 сум, вы участвуете в лотерее",
  prizeAmount: 25000,
  isLotteryParticipant: true,
  lotteryId: "lottery_1705312200000"
};

// Пользователь 30 лет, женщина
const result = {
  success: true,
  message: "Вам начислено 20000 сум, вы участвуете в лотерее",
  prizeAmount: 20000,
  isLotteryParticipant: true,
  lotteryId: "lottery_1705312200001"
};

// Пользователь 16 лет
const result = {
  success: true,
  message: "Спасибо за участие!",
  prizeAmount: 0,
  isLotteryParticipant: false
};
```

## Многоязычность

### Определение языка

Язык определяется автоматически на основе названия формы:

```javascript
function determineLanguage(formName) {
  if (formName && formName.includes('Uz')) {
    return 'uz';
  }
  return 'ru'; // по умолчанию
}
```

### Переводы

```javascript
// Русский
{
  title: 'Тема: Регистрация',
  lines: [
    'Сумма приза: 20000 сум',
    'Участие в розыгрыше на 3000000 сум'
  ]
}

// Узбекский
{
  title: 'Mavzu: Ro\'yxatdan o\'tish',
  lines: [
    'Yutuq summasi: 20000 so\'m',
    '3000000 so\'m lotereyaga qo\'shilish'
  ]
}
```

## Добавление новых опросов

### 1. Создайте форму в Tally

1. Войдите в [Tally Dashboard](https://tally.so/dashboard)
2. Создайте новую форму
3. Скопируйте ID формы

### 2. Добавьте форму в конфигурацию

```javascript
// В tallyWebhookService.js
getAvailableForms(language = 'ru') {
  const forms = [
    {
      id: 'registration',
      formId: this.formIds[language] || this.formIds.ru,
      title: language === 'ru' ? 'Тема: Регистрация' : 'Mavzu: Ro\'yxatdan o\'tish',
      type: 'registration',
      prizeInfo: {
        basePrize: 20000,
        additionalPrize: 5000,
        lotteryAmount: 3000000,
        lotteryEligible: true
      }
    },
    // Добавьте новый опрос
    {
      id: 'feedback',
      formId: 'your-new-form-id',
      title: language === 'ru' ? 'Тема: Обратная связь' : 'Mavzu: Fikr-mulohaza',
      type: 'feedback',
      prizeInfo: {
        basePrize: 15000,
        additionalPrize: 0,
        lotteryAmount: 1000000,
        lotteryEligible: false
      }
    }
  ];

  return forms;
}
```

### 3. Настройте webhook

Добавьте webhook для новой формы в настройках Tally:

- URL: `https://your-domain.com/api/webhook/tally`
- Events: `formResponse`

## Тестирование

### Тест webhook

```bash
curl -X POST https://your-domain.com/api/webhook/tally \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "formResponse",
    "payload": {
      "formId": "3xqyg9",
      "formName": "Registration Pro Survey Ru",
      "answers": {
        "gender": {"value": "male"},
        "age": {"value": "25"}
      }
    }
  }'
```

### Тест фронтенда

1. Откройте приложение
2. Переключитесь на нужный язык
3. Нажмите "Пройти опрос"
4. Заполните форму в Tally
5. Проверьте, что данные получены на сервере

## Мониторинг

### Логи

Сервер логирует все операции:

```javascript
console.log('Saving survey response:', surveyData);
console.log('Saving reward data:', rewardData);
console.log('Processing survey for rewards:', result);
```

### Статистика

Получите статистику опросов:

```bash
curl "https://your-domain.com/api/surveys/responses?language=ru"
```

Ответ:
```json
{
  "success": true,
  "data": {
    "totalResponses": 150,
    "todayResponses": 12,
    "averageAge": 28.5,
    "genderDistribution": {
      "male": 45,
      "female": 55
    },
    "language": "ru",
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```
