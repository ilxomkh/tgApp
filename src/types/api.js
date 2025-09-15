/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} [message]
 * @property {Object} [data]
 */

/**
 * @typedef {Object} RequestOtpRequest
 * @property {string} phone_number
 */

/**
 * @typedef {Object} RequestOtpResponse
 * @property {boolean} success
 * @property {string} message
 */

/**
 * @typedef {Object} VerifyOtpRequest
 * @property {string} phone_number
 * @property {string} code
 */

/**
 * @typedef {Object} VerifyOtpResponse
 * @property {boolean} success
 * @property {string} user_id
 * @property {string} name
 * @property {string} phone_number
 * @property {number} bonus_balance
 * @property {string} referral_code
 * @property {string} token
 * @property {string} session_id
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} phone_number
 * @property {string} full_name
 * @property {string} email
 * @property {string} birth_date
 * @property {number} id
 * @property {number} balance
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} UpdateUserProfileRequest
 * @property {string} phone_number
 * @property {string} full_name
 * @property {string} email
 * @property {string} birth_date
 */

/**
 * @typedef {Object} UpdateUserProfileResponse
 * @property {boolean} success
 * @property {UserProfile} user
 */

/**
 * @typedef {Object} Raffle
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} prize_amount
 * @property {string} video_url
 * @property {boolean} is_active
 * @property {string} end_date
 */

/**
 * @typedef {Object} GetRafflesResponse
 * @property {Raffle[]} raffles
 */

/**
 * @typedef {Object} Card
 * @property {number} id
 * @property {string} card_number
 * @property {string} card_type
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AddCardRequest
 * @property {string} card_number
 */

/**
 * @typedef {Object} AddCardResponse
 * @property {boolean} success
 * @property {Card} card
 */

/**
 * @typedef {Object} GetCardsResponse
 * @property {Card[]} cards
 */

/**
 * @typedef {Object} InviteStats
 * @property {number} invited
 * @property {number} active
 * @property {number} waiting_amount
 * @property {number} profit
 */

/**
 * @typedef {Object} OrderRequest
 * @property {string} full_name
 * @property {string} company_name
 * @property {string} job_title
 * @property {string} phone_number
 * @property {string} email
 */

/**
 * @typedef {Object} OrderResponse
 * @property {boolean} success
 * @property {string} message
 * @property {number} [order_id]
 */

/**
 * @typedef {Object} PaymentRequest
 * @property {string} card_number
 * @property {number} amount
 */

/**
 * @typedef {Object} PaymentResponse
 * @property {boolean} success
 * @property {string} message
 * @property {number} [payment_id]
 * @property {string} [status]
 */

/**
 * @typedef {Object} ApiError
 * @property {string} error
 * @property {string} message
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} full_name
 * @property {string} phone_number
 * @property {string} email
 * @property {string} birth_date
 * @property {number} balance
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [token]
 */

/**
 * @typedef {Object} TallyWebhookPayload
 * @property {string} eventId
 * @property {string} eventType
 * @property {string} createdAt
 * @property {Object} payload
 * @property {string} payload.responseId
 * @property {string} payload.submissionId
 * @property {string} payload.respondentId
 * @property {string} payload.formId
 * @property {string} payload.formName
 * @property {Object} payload.answers
 * @property {string} payload.createdAt
 */

/**
 * @typedef {Object} TallyAnswer
 * @property {string} fieldId
 * @property {string} fieldRef
 * @property {string} type
 * @property {string} label
 * @property {string|string[]} value
 */

/**
 * @typedef {Object} SurveyResponse
 * @property {string} id
 * @property {string} formId
 * @property {string} formName
 * @property {string} language
 * @property {Object} answers
 * @property {string} createdAt
 * @property {string} userId
 */

/**
 * @typedef {Object} ProcessSurveyResponse
 * @property {boolean} success
 * @property {string} message
 * @property {number} [prizeAmount]
 * @property {boolean} [isLotteryParticipant]
 * @property {string} [lotteryId]
 */

/**
 * @typedef {Object} TallyForm
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} url
 * @property {number} responseCount
 */

/**
 * @typedef {Object} TallyFormResponse
 * @property {string} id
 * @property {string} formId
 * @property {string} submissionId
 * @property {string} respondentId
 * @property {Object} answers
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} TallySyncRequest
 * @property {string} formId
 * @property {string} [action]
 */

/**
 * @typedef {Object} TallySyncResponse
 * @property {boolean} success
 * @property {string} message
 * @property {number} [syncedResponses]
 * @property {string} [lastSyncAt]
 */

/**
 * @typedef {Object} TallyFormApiResponse
 * @property {string} id
 * @property {string} name
 * @property {boolean} isNameModifiedByUser
 * @property {string} workspaceId
 * @property {string} organizationId
 * @property {string} status
 * @property {boolean} hasDraftBlocks
 * @property {number} numberOfSubmissions
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} index
 * @property {boolean} isClosed
 */

/**
 * @typedef {Object} GetTallyFormsResponse
 * @property {TallyFormApiResponse[]} items
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {boolean} hasMore
 */

/**
 * @typedef {Object} TallyQuestion
 * @property {string} id
 * @property {string} text
 * @property {string} type
 * @property {boolean} required
 * @property {string[]} [options]
 */

/**
 * @typedef {Object} TallyFormDetails
 * @property {string} formId
 * @property {string} title
 * @property {TallyQuestion[]} questions
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
  TALLY_WEBHOOK: '/webhooks/tilda',
  GET_SURVEY_RESPONSES: '/surveys/responses',
  PROCESS_SURVEY_RESPONSE: '/surveys/process',
  TALLY_FORMS: '/tally/forms',
  TALLY_FORM_BY_ID: '/tally/forms',
  TALLY_FORM_RESPONSES: '/tally/tally/forms',
  TALLY_SYNC: '/tally/tally/sync',
  TALLY_FORM_SUBMIT: '/tally/forms',
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
