// Конфигурация приложения
export const config = {
  // API базовый URL - можно переопределить через переменные окружения
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010/api',
  
  // Режим отладки
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Таймауты для запросов
  REQUEST_TIMEOUT: 10000, // 10 секунд
  
  // Максимальное количество попыток повторной отправки OTP
  MAX_OTP_RETRIES: 3,
  
  // Интервал между попытками отправки OTP (в секундах)
  OTP_RETRY_INTERVAL: 60,
  
  // Tally конфигурация
  TALLY: {
    // ID форм для разных языков
    FORM_IDS: {
      ru: '3xqyg9', // Registration Pro Survey Ru
      uz: '3xqyg9', // Registration Pro Survey Uz (используем тот же ID, но с разными языками)
    },
    // Webhook URL для получения данных от Tally
    WEBHOOK_URL: import.meta.env.VITE_TALLY_WEBHOOK_URL || 'http://localhost/api/webhook/tally',
    // Секретный ключ для верификации webhook (если используется)
    WEBHOOK_SECRET: import.meta.env.VITE_TALLY_WEBHOOK_SECRET || '',
  },
};

export default config;
