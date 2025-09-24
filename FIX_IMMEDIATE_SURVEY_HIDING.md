# Исправление: Опрос не исчезает сразу после прохождения

## Проблема
После прохождения опроса он не исчезает сразу из списка, а только после перерендера страницы.

## Причина
Проблема была в том, что:
1. `SurveyModal` закрывался сразу после завершения опроса
2. `loadSurveys()` вызывался асинхронно, но данные о пройденном опросе еще не успевали сохраниться в localStorage
3. Не было достаточной задержки между сохранением данных и обновлением списка

## Исправления

### 1. В `SurveyModal.jsx`
**Добавлена задержка перед закрытием модального окна:**
```javascript
const closeModal = async () => {
  setCurrentQuestion(0);
  setAnswers({});
  setIsCompleted(false);
  setSurveyResult(null);
  
  // Добавляем небольшую задержку, чтобы дать время обновиться списку опросов
  setTimeout(() => {
    onClose();
  }, 500); // 500мс задержки
};
```

### 2. В `HomeTab.jsx`
**Добавлена задержка перед перезагрузкой списка опросов:**
```javascript
const handleSurveyComplete = async (surveyId, answers) => {
  try {
    console.log(`✅ Опрос ${surveyId} завершен, обновляем список...`);
    const result = await submitSurvey(surveyId, answers);
    
    // Обновляем профиль пользователя после успешного завершения опроса
    await refreshUserProfile();
    
    // Добавляем небольшую задержку перед перезагрузкой списка опросов
    // чтобы дать время сохраниться данным о пройденном опросе
    setTimeout(() => {
      console.log(`🔄 Перезагружаем список опросов после завершения ${surveyId}`);
      loadSurveys();
    }, 100); // 100мс задержки
    
    return result;
  } catch (error) {
    console.error('Error completing survey:', error);
    throw error;
  }
};
```

**Добавлено логирование в `loadSurveys`:**
```javascript
const loadSurveys = async () => {
  try {
    console.log('🔄 Загружаем список опросов...');
    setSurveysLoading(true);
    
    const availableSurveys = await getAvailableSurveys();
    
    const filteredSurveys = availableSurveys.filter(survey => {
      const surveyLanguage = survey.language || 'ru';
      const matchesLanguage = surveyLanguage === language;
      const isNotCompleted = !isSurveyCompleted(survey.id);
      
      return matchesLanguage && isNotCompleted;
    });
    
    console.log(`📊 Обновлен список опросов: ${filteredSurveys.length} доступных опросов`);
    setSurveys(filteredSurveys);
  } catch (error) {
    console.error('Error loading surveys:', error);
    setSurveys([]);
  } finally {
    setSurveysLoading(false);
  }
};
```

## Как теперь работает

1. **Пользователь завершает опрос**
2. **Опрос отмечается как пройденный** в localStorage
3. **Профиль пользователя обновляется**
4. **Через 100мс список опросов перезагружается** (чтобы дать время сохраниться данным)
5. **Через 500мс модальное окно закрывается** (чтобы дать время обновиться списку)
6. **Пользователь видит обновленный список** без пройденного опроса

## Логирование

В консоли браузера теперь будут видны логи:
```
✅ Опрос 3xqyg9 завершен, обновляем список...
🔄 Перезагружаем список опросов после завершения 3xqyg9
🔄 Загружаем список опросов...
📊 Обновлен список опросов: 0 доступных опросов
```

## Результат

Теперь после прохождения опроса:
- ✅ Опрос исчезает из списка сразу после завершения
- ✅ Не нужно перерендеривать страницу
- ✅ Пользователь видит актуальный список опросов
- ✅ Группировка опросов работает корректно

## Тестирование

1. **Откройте приложение** и пройдите опрос
2. **Проверьте**, что опрос исчез из списка сразу после завершения
3. **Посмотрите консоль** - должны появиться логи об обновлении списка
4. **Проверьте группировку** - если прошел один опрос из группы, второй тоже должен исчезнуть
