// Примеры использования API для тестирования
import api from '../services/api';

/**
 * Пример отправки OTP кода
 */
export const exampleRequestOtp = async () => {
  try {
    console.log('Отправка OTP кода...');
    const result = await api.requestOtp('+998414736544');
    console.log('Успешно отправлен OTP:', result);
    return result;
  } catch (error) {
    console.error('Ошибка отправки OTP:', error.message);
    throw error;
  }
};

/**
 * Пример проверки OTP кода
 */
export const exampleVerifyOtp = async () => {
  try {
    console.log('Проверка OTP кода...');
    const result = await api.verifyOtp('+998414736544', '123456');
    console.log('Успешно проверен OTP:', result);
    return result;
  } catch (error) {
    console.error('Ошибка проверки OTP:', error.message);
    throw error;
  }
};

/**
 * Пример полного процесса аутентификации
 */
export const exampleFullAuth = async () => {
  try {
    // Шаг 1: Отправка OTP
    console.log('=== Шаг 1: Отправка OTP ===');
    await exampleRequestOtp();
    
    // Шаг 2: Проверка OTP (симулируем ввод кода)
    console.log('=== Шаг 2: Проверка OTP ===');
    const userData = await exampleVerifyOtp();
    
    console.log('=== Аутентификация завершена ===');
    console.log('Данные пользователя:', userData);
    
    return userData;
  } catch (error) {
    console.error('Ошибка в процессе аутентификации:', error.message);
    throw error;
  }
};

/**
 * Пример получения профиля пользователя
 */
export const exampleGetUserProfile = async () => {
  try {
    console.log('Получение профиля пользователя...');
    const result = await api.getUserProfile();
    console.log('Профиль пользователя:', result);
    return result;
  } catch (error) {
    console.error('Ошибка получения профиля:', error.message);
    throw error;
  }
};

/**
 * Пример обновления профиля пользователя
 */
export const exampleUpdateUserProfile = async () => {
  try {
    console.log('Обновление профиля пользователя...');
    const updateData = {
      phone_number: '+998344777518',
      full_name: 'Иван Иванов',
      email: 'ivan@example.com',
      birth_date: '1990-01-01'
    };
    
    const result = await api.updateUserProfile(updateData);
    console.log('Профиль обновлен:', result);
    return result;
  } catch (error) {
    console.error('Ошибка обновления профиля:', error.message);
    throw error;
  }
};

/**
 * Пример получения списка лотерей
 */
export const exampleGetRaffles = async () => {
  try {
    console.log('Получение списка лотерей...');
    const result = await api.getRaffles();
    console.log('Лотереи загружены:', result);
    return result;
  } catch (error) {
    console.error('Ошибка получения лотерей:', error.message);
    throw error;
  }
};

/**
 * Пример полного цикла работы с профилем
 */
export const exampleProfileWorkflow = async () => {
  try {
    console.log('=== Полный цикл работы с профилем ===');
    
    // 1. Получение профиля
    console.log('1. Получение профиля...');
    const profile = await api.getUserProfile();
    console.log('Профиль получен:', profile);
    
    // 2. Обновление профиля
    console.log('2. Обновление профиля...');
    const updateData = {
      phone_number: '+998344777518',
      full_name: 'Иван Иванов',
      email: 'ivan@example.com',
      birth_date: '1990-01-01'
    };
    
    const updatedProfile = await api.updateUserProfile(updateData);
    console.log('Профиль обновлен:', updatedProfile);
    
    // 3. Повторное получение для проверки
    console.log('3. Повторное получение профиля...');
    const refreshedProfile = await api.getUserProfile();
    console.log('Обновленный профиль:', refreshedProfile);
    
    return refreshedProfile;
  } catch (error) {
    console.error('Ошибка в цикле работы с профилем:', error.message);
    throw error;
  }
};

/**
 * Пример работы с картами
 */
export const exampleCardsWorkflow = async () => {
  try {
    console.log('=== Полный цикл работы с картами ===');
    
    // 1. Получение списка карт
    console.log('1. Получение списка карт...');
    const cards = await api.getCards();
    console.log('Карты получены:', cards);
    
    // 2. Добавление новой карты
    console.log('2. Добавление новой карты...');
    const testCardNumber = '4111111111111111'; // Тестовый номер Visa
    const newCard = await api.addCard(testCardNumber);
    console.log('Карта добавлена:', newCard);
    
    // 3. Повторное получение списка карт
    console.log('3. Повторное получение списка карт...');
    const updatedCards = await api.getCards();
    console.log('Обновленный список карт:', updatedCards);
    
    return updatedCards;
  } catch (error) {
    console.error('Ошибка в цикле работы с картами:', error.message);
    throw error;
  }
};

/**
 * Пример получения статистики приглашений
 */
export const exampleGetInviteStats = async () => {
  try {
    console.log('=== Получение статистики приглашений ===');
    
    const stats = await api.getInviteStats();
    console.log('Статистика приглашений:', stats);
    
    // Выводим детальную информацию
    console.log('Детали статистики:');
    console.log('- Приглашенных пользователей:', stats.invited);
    console.log('- Активных пользователей:', stats.active);
    console.log('- Сумма в ожидании:', stats.waiting_amount, 'сум');
    console.log('- Общая прибыль:', stats.profit, 'сум');
    
    return stats;
  } catch (error) {
    console.error('Ошибка получения статистики приглашений:', error.message);
    throw error;
  }
};

/**
 * Пример создания заказа опроса
 */
export const exampleCreateOrder = async () => {
  try {
    console.log('=== Создание заказа опроса ===');
    
    const orderData = {
      full_name: 'Иван Иванов',
      company_name: 'ООО Тестовая Компания',
      job_title: 'Менеджер по маркетингу',
      phone_number: '+998901234567',
      email: 'ivan@example.com'
    };
    
    console.log('Данные заказа:', orderData);
    
    const result = await api.createOrder(orderData);
    console.log('Заказ создан:', result);
    
    return result;
  } catch (error) {
    console.error('Ошибка создания заказа:', error.message);
    throw error;
  }
};

/**
 * Пример создания платежа (вывод на карту)
 */
export const exampleCreatePayment = async () => {
  try {
    console.log('=== Создание платежа (вывод на карту) ===');
    
    const paymentData = {
      card_number: '8600123412345678',
      amount: 50000
    };
    
    console.log('Данные платежа:', paymentData);
    
    const result = await api.createPayment(paymentData);
    console.log('Платеж создан:', result);
    
    return result;
  } catch (error) {
    console.error('Ошибка создания платежа:', error.message);
    throw error;
  }
};

/**
 * Пример обработки различных ошибок
 */
export const exampleErrorHandling = async () => {
  const testCases = [
    {
      name: 'Неверный номер телефона',
      phone: '+998000000000',
      code: '123456'
    },
    {
      name: 'Неверный OTP код',
      phone: '+998414736544',
      code: '000000'
    },
    {
      name: 'Пустой номер телефона',
      phone: '',
      code: '123456'
    },
    {
      name: 'Неверный email',
      email: 'invalid-email',
      full_name: 'Test User',
      birth_date: '1990-01-01'
    },
    {
      name: 'Неверная дата рождения',
      email: 'test@example.com',
      full_name: 'Test User',
      birth_date: '2025-01-01'
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n=== Тест: ${testCase.name} ===`);
    try {
      if (testCase.phone) {
        await api.requestOtp(testCase.phone);
      }
      if (testCase.code) {
        await api.verifyOtp(testCase.phone, testCase.code);
      }
      if (testCase.email) {
        await api.updateUserProfile(testCase);
      }
    } catch (error) {
      console.log(`Ожидаемая ошибка: ${error.message}`);
    }
  }
};

// Экспорт для использования в консоли браузера
if (typeof window !== 'undefined') {
  window.apiExamples = {
    requestOtp: exampleRequestOtp,
    verifyOtp: exampleVerifyOtp,
    fullAuth: exampleFullAuth,
    getUserProfile: exampleGetUserProfile,
    updateUserProfile: exampleUpdateUserProfile,
    getRaffles: exampleGetRaffles,
    profileWorkflow: exampleProfileWorkflow,
    cardsWorkflow: exampleCardsWorkflow,
    getInviteStats: exampleGetInviteStats,
    createOrder: exampleCreateOrder,
    createPayment: exampleCreatePayment,
    errorHandling: exampleErrorHandling
  };
}
