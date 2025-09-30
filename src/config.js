export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.prosurvey.uz/api',
  
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  REQUEST_TIMEOUT: 5000,
  
  MAX_OTP_RETRIES: 3,
  
  OTP_RETRY_INTERVAL: 60,
  
  TALLY: {
    FORM_IDS: {
      ru: '3xqyg9',
      uz: '3xqyg9',
    },
    WEBHOOK_URL: import.meta.env.VITE_TALLY_WEBHOOK_URL || 'https://api.prosurvey.uz/api/webhooks/tilda',
    WEBHOOK_SECRET: import.meta.env.VITE_TALLY_WEBHOOK_SECRET || '',
    SERVER_API: {
      ENABLED: import.meta.env.VITE_TALLY_SERVER_API_ENABLED !== 'false',
      TIMEOUT: parseInt(import.meta.env.VITE_TALLY_SERVER_API_TIMEOUT) || 8000,
      RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_TALLY_SERVER_API_RETRY_ATTEMPTS) || 3,
    },
  },
};

export default config;
