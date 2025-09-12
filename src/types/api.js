/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Успешность запроса
 * @property {string} [message] - Сообщение ответа
 * @property {Object} [data] - Данные ответа
 */

/**
 * @typedef {Object} RequestOtpRequest
 * @property {string} phone_number - Номер телефона в формате E.164
 */

/**
 * @typedef {Object} RequestOtpResponse
 * @property {boolean} success - Успешность запроса
 * @property {string} message - Сообщение о результате
 */

/**
 * @typedef {Object} VerifyOtpRequest
 * @property {string} phone_number - Номер телефона в формате E.164
 * @property {string} code - OTP код
 */

/**
 * @typedef {Object} VerifyOtpResponse
 * @property {boolean} success - Успешность запроса
 * @property {string} user_id - ID пользователя
 * @property {string} name - Имя пользователя
 * @property {string} phone_number - Номер телефона
 * @property {number} bonus_balance - Баланс бонусов
 * @property {string} referral_code - Реферальный код
 * @property {string} token - JWT токен для авторизации
 * @property {string} session_id - ID сессии для авторизации
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} phone_number - Номер телефона
 * @property {string} full_name - Полное имя пользователя
 * @property {string} email - Email адрес
 * @property {string} birth_date - Дата рождения (YYYY-MM-DD)
 * @property {number} id - ID пользователя
 * @property {number} balance - Баланс пользователя
 * @property {string} created_at - Дата создания
 * @property {string} updated_at - Дата обновления
 */

/**
 * @typedef {Object} UpdateUserProfileRequest
 * @property {string} phone_number - Номер телефона
 * @property {string} full_name - Полное имя пользователя
 * @property {string} email - Email адрес
 * @property {string} birth_date - Дата рождения (YYYY-MM-DD)
 */

/**
 * @typedef {Object} UpdateUserProfileResponse
 * @property {boolean} success - Успешность запроса
 * @property {UserProfile} user - Обновленные данные пользователя
 */

/**
 * @typedef {Object} Raffle
 * @property {number} id - ID лотереи
 * @property {string} title - Название лотереи
 * @property {string} description - Описание лотереи
 * @property {number} prize_amount - Сумма приза
 * @property {string} video_url - URL видео
 * @property {boolean} is_active - Активна ли лотерея
 * @property {string} end_date - Дата окончания
 */

/**
 * @typedef {Object} GetRafflesResponse
 * @property {Raffle[]} raffles - Массив лотерей
 */

/**
 * @typedef {Object} Card
 * @property {number} id - ID карты
 * @property {string} card_number - Номер карты (маскированный)
 * @property {string} card_type - Тип карты (visa, mastercard, etc.)
 * @property {string} created_at - Дата создания
 * @property {string} updated_at - Дата обновления
 */

/**
 * @typedef {Object} AddCardRequest
 * @property {string} card_number - Номер карты
 */

/**
 * @typedef {Object} AddCardResponse
 * @property {boolean} success - Успешность запроса
 * @property {Card} card - Добавленная карта
 */

/**
 * @typedef {Object} GetCardsResponse
 * @property {Card[]} cards - Массив карт
 */

/**
 * @typedef {Object} InviteStats
 * @property {number} invited - Количество приглашенных пользователей
 * @property {number} active - Количество активных приглашенных пользователей
 * @property {number} waiting_amount - Сумма ожидающих выплат
 * @property {number} profit - Общая прибыль от рефералов
 */

/**
 * @typedef {Object} OrderRequest
 * @property {string} full_name - Полное имя заказчика
 * @property {string} company_name - Название компании
 * @property {string} job_title - Должность
 * @property {string} phone_number - Номер телефона
 * @property {string} email - Email адрес
 */

/**
 * @typedef {Object} OrderResponse
 * @property {boolean} success - Успешность запроса
 * @property {string} message - Сообщение о результате
 * @property {number} [order_id] - ID заказа
 */

/**
 * @typedef {Object} PaymentRequest
 * @property {string} card_number - Номер карты
 * @property {number} amount - Сумма для вывода
 */

/**
 * @typedef {Object} PaymentResponse
 * @property {boolean} success - Успешность запроса
 * @property {string} message - Сообщение о результате
 * @property {number} [payment_id] - ID платежа
 * @property {string} [status] - Статус платежа
 */

/**
 * @typedef {Object} ApiError
 * @property {string} error - Код ошибки
 * @property {string} message - Сообщение об ошибке
 */

/**
 * @typedef {Object} User
 * @property {string} id - ID пользователя
 * @property {string} full_name - Полное имя пользователя
 * @property {string} phone_number - Номер телефона
 * @property {string} email - Email адрес
 * @property {string} birth_date - Дата рождения
 * @property {number} balance - Баланс пользователя
 * @property {string} created_at - Дата создания
 * @property {string} updated_at - Дата обновления
 * @property {string} [token] - JWT токен
 */

/**
 * @typedef {Object} TallyWebhookPayload
 * @property {string} eventId - ID события
 * @property {string} eventType - Тип события (formResponse)
 * @property {string} createdAt - Дата создания
 * @property {Object} payload - Данные ответа
 * @property {string} payload.responseId - ID ответа
 * @property {string} payload.submissionId - ID отправки
 * @property {string} payload.respondentId - ID респондента
 * @property {string} payload.formId - ID формы
 * @property {string} payload.formName - Название формы
 * @property {Object} payload.answers - Ответы на вопросы
 * @property {string} payload.createdAt - Дата создания ответа
 */

/**
 * @typedef {Object} TallyAnswer
 * @property {string} fieldId - ID поля
 * @property {string} fieldRef - Ссылка на поле
 * @property {string} type - Тип поля
 * @property {string} label - Метка поля
 * @property {string|string[]} value - Значение ответа
 */

/**
 * @typedef {Object} SurveyResponse
 * @property {string} id - ID ответа
 * @property {string} formId - ID формы Tally
 * @property {string} formName - Название формы
 * @property {string} language - Язык опроса (ru/uz)
 * @property {Object} answers - Ответы на вопросы
 * @property {string} createdAt - Дата создания
 * @property {string} userId - ID пользователя (если привязан)
 */

/**
 * @typedef {Object} ProcessSurveyResponse
 * @property {boolean} success - Успешность обработки
 * @property {string} message - Сообщение о результате
 * @property {number} [prizeAmount] - Сумма приза
 * @property {boolean} [isLotteryParticipant] - Участие в лотерее
 * @property {string} [lotteryId] - ID лотереи
 */

/**
 * @typedef {Object} TallyForm
 * @property {string} id - ID формы
 * @property {string} title - Название формы
 * @property {string} description - Описание формы
 * @property {string} status - Статус формы (published, draft, etc.)
 * @property {string} createdAt - Дата создания
 * @property {string} updatedAt - Дата обновления
 * @property {string} url - URL формы
 * @property {number} responseCount - Количество ответов
 */

/**
 * @typedef {Object} TallyFormResponse
 * @property {string} id - ID ответа
 * @property {string} formId - ID формы
 * @property {string} submissionId - ID отправки
 * @property {string} respondentId - ID респондента
 * @property {Object} answers - Ответы на вопросы
 * @property {string} createdAt - Дата создания ответа
 * @property {string} updatedAt - Дата обновления ответа
 */

/**
 * @typedef {Object} TallySyncRequest
 * @property {string} formId - ID формы для синхронизации
 * @property {string} [action] - Действие синхронизации (sync, refresh, etc.)
 */

/**
 * @typedef {Object} TallySyncResponse
 * @property {boolean} success - Успешность синхронизации
 * @property {string} message - Сообщение о результате
 * @property {number} [syncedResponses] - Количество синхронизированных ответов
 * @property {string} [lastSyncAt] - Время последней синхронизации
 */

export const API_ENDPOINTS = {
  REQUEST_OTP: '/auth/request-otp',
  VERIFY_OTP: '/auth/verify-otp',
  GET_USER_PROFILE: '/users/me',
  UPDATE_USER_PROFILE: '/users/me',
  GET_RAFFLES: '/raffles/',
  GET_CARDS: '/payments/cards',
  ADD_CARD: '/payments/cards',
  GET_INVITE_STATS: '/referrals/stats',
  CREATE_ORDER: '/order',
  CREATE_PAYMENT: '/payments/take_off',
  // Tally webhook endpoints
  TALLY_WEBHOOK: '/webhooks/tilda',
  GET_SURVEY_RESPONSES: '/surveys/responses',
  PROCESS_SURVEY_RESPONSE: '/surveys/process',
  // Новые Tally API endpoints через сервер
  TALLY_FORMS: '/tally/tally/forms',
  TALLY_FORM_BY_ID: '/tally/tally/forms',
  TALLY_FORM_RESPONSES: '/tally/tally/forms',
  TALLY_SYNC: '/tally/tally/sync',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  INVALID_PHONE: 'Invalid phone number format.',
  INVALID_OTP: 'Invalid OTP code.',
  OTP_EXPIRED: 'OTP code has expired.',
  TOO_MANY_ATTEMPTS: 'Too many attempts. Please try again later.',
  SERVER_ERROR: 'Server error. Please try again later.',
};
