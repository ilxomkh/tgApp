# Исправление: Опрос исчезает сразу без рефреша

## Проблема
Опрос все еще исчезает только после рефреша страницы, а не сразу после прохождения.

## Решение
Изменен подход с асинхронного обновления на немедленное обновление локального состояния.

## Что было изменено

### 1. В `HomeTab.jsx`

**Добавлена функция `removeSurveyFromList`:**
```javascript
const removeSurveyFromList = (surveyId) => {
  setSurveys(prevSurveys => {
    // Получаем группу опроса
    const groupId = getSurveyGroup(surveyId);
    let surveysToRemove = [surveyId];
    
    if (groupId) {
      // Если опрос в группе, убираем все опросы из группы
      const surveysInGroup = getSurveysInGroup(groupId);
      surveysToRemove = surveysInGroup;
      console.log(`📝 Убираем всю группу ${groupId}: ${surveysInGroup.join(', ')}`);
    }
    
    const updatedSurveys = prevSurveys.filter(survey => !surveysToRemove.includes(survey.id));
    console.log(`📊 Сразу обновлен список: ${updatedSurveys.length} опросов (убрали: ${surveysToRemove.join(', ')})`);
    return updatedSurveys;
  });
};
```

**Обновлен `handleSurveyComplete`:**
```javascript
const handleSurveyComplete = async (surveyId, answers) => {
  try {
    console.log(`✅ Опрос ${surveyId} завершен, сразу обновляем список...`);
    
    // Сразу обновляем локальное состояние - убираем пройденный опрос и всю группу
    removeSurveyFromList(surveyId);
    
    // Затем выполняем API запросы в фоне
    const result = await submitSurvey(surveyId, answers);
    
    // Обновляем профиль пользователя после успешного завершения опроса
    await refreshUserProfile();
    
    return result;
  } catch (error) {
    console.error('Error completing survey:', error);
    throw error;
  }
};
```

**Обновлен `handleSurveyStart`:**
```javascript
const handleSurveyStart = async (surveyId) => {
  try {
    const survey = await getSurvey(surveyId);
    openSurveyModal(survey);
  } catch (error) {
    console.error('Error loading survey:', error);
    
    // Если опрос уже пройден, сразу убираем его из списка
    if (error.message && error.message.includes('Вы уже прошли этот опрос')) {
      console.log(`📝 Опрос ${surveyId} уже пройден, сразу убираем из списка`);
      removeSurveyFromList(surveyId);
    }
  }
};
```

### 2. В `SurveyModal.jsx`

**Убрана задержка при закрытии:**
```javascript
const closeModal = () => {
  setCurrentQuestion(0);
  setAnswers({});
  setIsCompleted(false);
  setSurveyResult(null);
  
  // Закрываем модальное окно сразу, так как список уже обновлен
  onClose();
};
```

## Как теперь работает

### При прохождении опроса:
1. **Пользователь завершает опрос** → список сразу обновляется (убирается опрос и вся группа)
2. **API запросы выполняются в фоне** → не блокируют UI
3. **Модальное окно закрывается сразу** → пользователь видит обновленный список

### При получении ошибки 400:
1. **Пользователь нажимает на опрос** → получает ошибку 400
2. **Список сразу обновляется** → опрос и вся группа исчезают
3. **Никаких задержек** → мгновенное обновление

## Логирование

В консоли браузера будут видны логи:
```
✅ Опрос 3xqyg9 завершен, сразу обновляем список...
📝 Убираем всю группу registration: 3xqyg9, wbp8L6
📊 Сразу обновлен список: 0 опросов (убрали: 3xqyg9, wbp8L6)
```

## Преимущества нового подхода

1. **Мгновенное обновление** - опрос исчезает сразу без задержек
2. **Учет группировки** - если пройден один опрос из группы, все остальные тоже исчезают
3. **Неблокирующий UI** - API запросы выполняются в фоне
4. **Надежность** - не зависит от скорости API ответов

## Результат

Теперь после прохождения опроса:
- ✅ Опрос исчезает **мгновенно** без рефреша
- ✅ Группировка работает **сразу**
- ✅ Никаких задержек или ожиданий
- ✅ Плавный пользовательский опыт
