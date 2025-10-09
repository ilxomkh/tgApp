import api from '../services/api';

export const exampleRequestOtp = async () => {
  try {
    const result = await api.requestOtp('+998414736544');
    return result;
  } catch (error) {
    throw error;
  }
};
export const exampleVerifyOtp = async () => {
  try {
    const result = await api.verifyOtp('+998414736544', '123456');
    return result;
  } catch (error) {
    throw error;
  }
};


export const exampleFullAuth = async () => {
  try {
    await exampleRequestOtp();
    const userData = await exampleVerifyOtp();
    
    
    return userData;
  } catch (error) {
    throw error;
  }
};


export const exampleGetUserProfile = async () => {
  try {
    const result = await api.getUserProfile();
    return result;
  } catch (error) {
    throw error;
  }
};

export const exampleUpdateUserProfile = async () => {
  try {
    const updateData = {
      phone_number: '+998344777518',
      full_name: 'Иван Иванов',
      email: 'ivan@example.com',
      birth_date: '1990-01-01'
    };
    
    const result = await api.updateUserProfile(updateData);
    return result;
  } catch (error) {
    throw error;
  }
};

export const exampleGetRaffles = async () => {
  try {
    const result = await api.getRaffles();
    return result;
  } catch (error) {
    throw error;
  }
};


export const exampleProfileWorkflow = async () => {
  try {
    
    const profile = await api.getUserProfile();
    
    const updateData = {
      phone_number: '+998344777518',
      full_name: 'Иван Иванов',
      email: 'ivan@example.com',
      birth_date: '1990-01-01'
    };
    
    const updatedProfile = await api.updateUserProfile(updateData);
    
    
    const refreshedProfile = await api.getUserProfile();
    
    return refreshedProfile;
  } catch (error) {
    throw error;
  }
};


export const exampleCardsWorkflow = async () => {
  try {
    
    
    const cards = await api.getCards();
    
    
    const testCardNumber = '4111111111111111';
    const newCard = await api.addCard(testCardNumber);
    
    
    const updatedCards = await api.getCards();
    
    return updatedCards;
  } catch (error) {
    throw error;
  }
};


export const exampleGetInviteStats = async () => {
  try {
    
    const stats = await api.getInviteStats();
    
    
    return stats;
  } catch (error) {
    throw error;
  }
};


export const exampleCreateOrder = async () => {
  try {
    
    const orderData = {
      full_name: 'Иван Иванов',
      company_name: 'ООО Тестовая Компания',
      job_title: 'Менеджер по маркетингу',
      phone_number: '+998901234567',
      email: 'ivan@example.com'
    };
    
    
    const result = await api.createOrder(orderData);
    
    return result;
  } catch (error) {
    throw error;
  }
};


export const exampleCreatePayment = async () => {
  try {
    
    const paymentData = {
      card_number: '8600123412345678',
      amount: 50000
    };
    
    
    const result = await api.createPayment(paymentData);
    
    return result;
  } catch (error) {
    throw error;
  }
};


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
    }
  }
};

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
