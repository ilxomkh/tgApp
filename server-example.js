/**
 * Пример серверного кода для обработки Tally webhook
 * Этот код должен быть размещен на вашем сервере
 */

const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware для парсинга JSON
app.use(express.json());

// Конфигурация
const config = {
  TALLY_WEBHOOK_SECRET: process.env.TALLY_WEBHOOK_SECRET || '',
  // API базовый URL
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8010/api',
};

/**
 * Верификация подписи webhook от Tally
 */
function verifyTallySignature(signature, payload) {
  if (!config.TALLY_WEBHOOK_SECRET) {
    return true; // Пропускаем верификацию если секрет не настроен
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.TALLY_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Обработка входящего webhook от Tally
 */
app.post('/api/webhook/tally', async (req, res) => {
  try {
    const signature = req.headers['x-tally-signature'];
    const webhookData = req.body;

    // Верифицируем подпись
    if (!verifyTallySignature(signature, webhookData)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Проверяем тип события
    if (webhookData.eventType !== 'formResponse') {
      return res.status(200).json({ message: 'Event ignored' });
    }

    const { payload } = webhookData;

    // Определяем язык на основе названия формы
    let language = 'ru';
    if (payload.formName && payload.formName.includes('Uz')) {
      language = 'uz';
    }

    // Обрабатываем ответы
    const processedAnswers = processAnswers(payload.answers);

    // Создаем объект с данными опроса
    const surveyData = {
      id: payload.responseId,
      formId: payload.formId,
      formName: payload.formName,
      language,
      answers: processedAnswers,
      createdAt: payload.createdAt,
      respondentId: payload.respondentId,
      submissionId: payload.submissionId,
    };

    // Сохраняем данные в базу данных
    await saveSurveyResponse(surveyData);

    // Обрабатываем ответ для начисления бонусов
    const result = await processSurveyForRewards(surveyData);

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: result
    });

  } catch (error) {
    console.error('Error processing Tally webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * Обработка ответов на вопросы
 */
function processAnswers(answers) {
  const processed = {};

  if (!answers || typeof answers !== 'object') {
    return processed;
  }

  Object.keys(answers).forEach(fieldId => {
    const answer = answers[fieldId];
    
    if (answer && answer.value !== undefined) {
      processed[fieldId] = {
        value: answer.value,
        type: getQuestionType(fieldId),
        label: answer.label || fieldId,
      };
    }
  });

  return processed;
}

/**
 * Определение типа вопроса по ID поля
 */
function getQuestionType(fieldId) {
  const fieldTypeMap = {
    'id': 'text',
    'gender': 'choice',
    'age': 'number',
  };

  return fieldTypeMap[fieldId] || 'text';
}

/**
 * Сохранение ответа на опрос в базу данных
 */
async function saveSurveyResponse(surveyData) {
  // Здесь должна быть логика сохранения в базу данных
  // Например, MongoDB, PostgreSQL и т.д.
  
  console.log('Saving survey response:', surveyData);
  
  // Пример с MongoDB:
  /*
  const SurveyResponse = require('./models/SurveyResponse');
  const response = new SurveyResponse(surveyData);
  await response.save();
  */
}

/**
 * Обработка опроса для начисления бонусов
 */
async function processSurveyForRewards(surveyData) {
  const { language, answers } = surveyData;
  
  // Логика начисления бонусов в зависимости от ответов
  let prizeAmount = 0;
  let isLotteryParticipant = false;
  let lotteryId = null;

  // Пример логики начисления
  if (answers.gender && answers.age) {
    // Базовый бонус за заполнение
    prizeAmount = 20000;

    // Дополнительные бонусы в зависимости от возраста
    const age = parseInt(answers.age.value);
    if (age >= 18 && age <= 25) {
      prizeAmount += 5000; // Дополнительный бонус для молодежи
    }

    // Участие в лотерее
    if (age >= 18) {
      isLotteryParticipant = true;
      lotteryId = `lottery_${Date.now()}`;
    }
  }

  // Сохраняем информацию о наградах
  const rewardData = {
    surveyId: surveyData.id,
    userId: surveyData.respondentId,
    prizeAmount,
    isLotteryParticipant,
    lotteryId,
    language,
    createdAt: new Date().toISOString(),
  };

  await saveRewardData(rewardData);

  return {
    success: true,
    message: language === 'ru' 
      ? `Вам начислено ${prizeAmount} сум${isLotteryParticipant ? ', вы участвуете в лотерее' : ''}`
      : `Sizga ${prizeAmount} so\'m hisoblandi${isLotteryParticipant ? ', lotereyada ishtirok etasiz' : ''}`,
    prizeAmount,
    isLotteryParticipant,
    lotteryId,
  };
}

/**
 * Сохранение данных о наградах
 */
async function saveRewardData(rewardData) {
  // Здесь должна быть логика сохранения данных о наградах
  console.log('Saving reward data:', rewardData);
  
  // Пример с MongoDB:
  /*
  const Reward = require('./models/Reward');
  const reward = new Reward(rewardData);
  await reward.save();
  */
}

/**
 * Получение статистики ответов на опросы
 */
app.get('/api/surveys/responses', async (req, res) => {
  try {
    const { language = 'ru' } = req.query;

    // Получаем статистику из базы данных
    const stats = await getSurveyStats(language);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error getting survey stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * Получение статистики опросов из базы данных
 */
async function getSurveyStats(language) {
  // Здесь должна быть логика получения статистики из базы данных
  
  // Пример возвращаемых данных:
  return {
    totalResponses: 150,
    todayResponses: 12,
    averageAge: 28.5,
    genderDistribution: {
      male: 45,
      female: 55
    },
    language,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Обработка ответа на опрос (для фронтенда)
 */
app.post('/api/surveys/process', async (req, res) => {
  try {
    const { surveyId, language, answers, submittedAt } = req.body;

    // Создаем объект с данными опроса
    const surveyData = {
      id: `manual_${Date.now()}`,
      formId: surveyId,
      formName: language === 'ru' ? 'Registration Pro Survey Ru' : 'Registration Pro Survey Uz',
      language,
      answers,
      createdAt: submittedAt,
      respondentId: 'manual_submission',
      submissionId: `manual_${Date.now()}`,
    };

    // Сохраняем данные
    await saveSurveyResponse(surveyData);

    // Обрабатываем для наград
    const result = await processSurveyForRewards(surveyData);

    res.status(200).json(result);

  } catch (error) {
    console.error('Error processing survey response:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
