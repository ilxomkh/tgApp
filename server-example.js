const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

const config = {
  TALLY_WEBHOOK_SECRET: process.env.TALLY_WEBHOOK_SECRET || '',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.prosurvey.uz/api',
};

function verifyTallySignature(signature, payload) {
  if (!config.TALLY_WEBHOOK_SECRET) {
    return true;
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

app.post('/api/webhooks/tilda', async (req, res) => {
  try {
    const signature = req.headers['x-tally-signature'];
    const webhookData = req.body;

    if (!verifyTallySignature(signature, webhookData)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    if (webhookData.eventType !== 'formResponse') {
      return res.status(200).json({ message: 'Event ignored' });
    }

    const { payload } = webhookData;

    let language = 'ru';
    if (payload.formName && payload.formName.includes('Uz')) {
      language = 'uz';
    }

    const processedAnswers = processAnswers(payload.answers);

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

    await saveSurveyResponse(surveyData);

    const result = await processSurveyForRewards(surveyData);

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: result
    });

  } catch (error) {
    console.error('Error processing Tilda webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

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

function getQuestionType(fieldId) {
  const fieldTypeMap = {
    'id': 'text',
    'gender': 'choice',
    'age': 'number',
  };

  return fieldTypeMap[fieldId] || 'text';
}

async function saveSurveyResponse(surveyData) {}

async function processSurveyForRewards(surveyData) {
  const { language, answers } = surveyData;
  
  let prizeAmount = 0;
  let isLotteryParticipant = false;
  let lotteryId = null;

  if (answers.gender && answers.age) {
    prizeAmount = 20000;

    const age = parseInt(answers.age.value);
    if (age >= 18 && age <= 25) {
      prizeAmount += 5000;
    }

    if (age >= 18) {
      isLotteryParticipant = true;
      lotteryId = `lottery_${Date.now()}`;
    }
  }

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

async function saveRewardData(rewardData) {}

app.get('/api/surveys/responses', async (req, res) => {
  try {
    const { language = 'ru' } = req.query;

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

async function getSurveyStats(language) {
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

app.post('/api/surveys/process', async (req, res) => {
  try {
    const { surveyId, language, answers, submittedAt } = req.body;

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

    await saveSurveyResponse(surveyData);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});

module.exports = app;
