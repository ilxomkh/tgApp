// Тесты для API функций
import { 
  isValidUzbekPhone, 
  isValidOtp, 
  formatPhoneE164,
  isValidEmail,
  isValidBirthDate,
  isValidFullName
} from '../utils/validation';
import api from '../services/api';

// Мокаем fetch для тестирования
global.fetch = jest.fn();

describe('API Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Validation Tests', () => {
    test('should validate correct Uzbek phone numbers', () => {
      const validPhones = [
        '+998414736544',
        '+998901234567',
        '+998971234567',
        '+998991234567'
      ];
      
      validPhones.forEach(phone => {
        expect(isValidUzbekPhone(phone)).toBe(true);
      });
    });

    test('should reject invalid Uzbek phone numbers', () => {
      const invalidPhones = [
        '+998000000000', // Несуществующий оператор
        '+998123456789', // Неправильный формат
        '+1234567890',   // Не узбекский номер
        '998414736544',  // Без +
        '+99841473654'   // Неполный номер
      ];
      
      invalidPhones.forEach(phone => {
        expect(isValidUzbekPhone(phone)).toBe(false);
      });
    });

    test('should validate correct OTP codes', () => {
      const validOtps = ['123456', '000000', '999999'];
      
      validOtps.forEach(otp => {
        expect(isValidOtp(otp)).toBe(true);
      });
    });

    test('should reject invalid OTP codes', () => {
      const invalidOtps = [
        '12345',   // Слишком короткий
        '1234567', // Слишком длинный
        '12345a',  // Содержит буквы
        '123 456', // Содержит пробелы
        ''         // Пустой
      ];
      
      invalidOtps.forEach(otp => {
        expect(isValidOtp(otp)).toBe(false);
      });
    });

    test('should format phone numbers correctly', () => {
      expect(formatPhoneE164('998414736544')).toBe('+998414736544');
      expect(formatPhoneE164('414736544')).toBe('+998414736544');
      expect(formatPhoneE164('+998414736544')).toBe('+998414736544');
    });

    test('should validate email addresses', () => {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'user+tag@example.org'];
      const invalidEmails = ['invalid-email', '@example.com', 'user@', 'user.example.com'];
      
      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
      
      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    test('should validate birth dates', () => {
      const validDates = ['1990-01-01', '2000-12-31', '1985-06-15'];
      const invalidDates = ['2025-01-01', '1800-01-01', 'invalid-date', '1990/01/01'];
      
      validDates.forEach(date => {
        expect(isValidBirthDate(date)).toBe(true);
      });
      
      invalidDates.forEach(date => {
        expect(isValidBirthDate(date)).toBe(false);
      });
    });

    test('should validate full names', () => {
      const validNames = ['Иван Иванов', 'John Doe', 'Мария Петрова', 'Jean-Pierre Dupont'];
      const invalidNames = ['A', '123', 'User@123', ''];
      
      validNames.forEach(name => {
        expect(isValidFullName(name)).toBe(true);
      });
      
      invalidNames.forEach(name => {
        expect(isValidFullName(name)).toBe(false);
      });
    });
  });

  describe('API Request Tests', () => {
    test('should send OTP request successfully', async () => {
      const mockResponse = { success: true, message: 'OTP sent successfully' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.requestOtp('+998414736544');
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/request-otp'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ phone_number: '+998414736544' })
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('should verify OTP successfully', async () => {
      const mockResponse = {
        success: true,
        user_id: '12345',
        name: 'Test User',
        phone_number: '+998414736544',
        bonus_balance: 12000,
        referral_code: 'REF123',
        token: 'jwt_token'
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.verifyOtp('+998414736544', '123456');
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/verify-otp'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            phone_number: '+998414736544',
            code: '123456'
          })
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('should handle API errors correctly', async () => {
      const errorResponse = {
        error: 'INVALID_PHONE',
        message: 'Invalid phone number format'
      };
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => errorResponse
      });

      await expect(api.requestOtp('invalid-phone')).rejects.toThrow('Invalid phone number format');
    });

    test('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.requestOtp('+998414736544')).rejects.toThrow('Network error');
    });

    test('should handle timeout errors', async () => {
      // Симулируем таймаут
      fetch.mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const error = new Error('AbortError');
            error.name = 'AbortError';
            reject(error);
          }, 100);
        });
      });

      await expect(api.requestOtp('+998414736544')).rejects.toThrow('Request timeout. Please try again.');
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle 400 Bad Request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' })
      });

      await expect(api.requestOtp('+998414736544')).rejects.toThrow('Bad request');
    });

    test('should handle 401 Unauthorized', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid OTP' })
      });

      await expect(api.verifyOtp('+998414736544', '000000')).rejects.toThrow('Invalid OTP');
    });

    test('should handle 429 Too Many Requests', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ message: 'Rate limit exceeded' })
      });

      await expect(api.requestOtp('+998414736544')).rejects.toThrow('Rate limit exceeded');
    });

    test('should handle 500 Internal Server Error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' })
      });

      await expect(api.requestOtp('+998414736544')).rejects.toThrow('Server error');
    });
  });

  describe('User Profile API Tests', () => {
    test('should get user profile successfully', async () => {
      const mockResponse = {
        id: 1,
        phone_number: '+998414736544',
        full_name: 'Иван Иванов',
        email: 'ivan@example.com',
        birth_date: '1990-01-01',
        balance: 12000,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.getUserProfile();
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('should update user profile successfully', async () => {
      const updateData = {
        phone_number: '+998344777518',
        full_name: 'Иван Иванов',
        email: 'ivan@example.com',
        birth_date: '1990-01-01'
      };
      
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          ...updateData,
          balance: 12000,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.updateUserProfile(updateData);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Bearer')
          }),
          body: JSON.stringify(updateData)
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('should handle unauthorized access to profile', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' })
      });

      await expect(api.getUserProfile()).rejects.toThrow('Unauthorized');
    });
  });

  describe('Raffles API Tests', () => {
    test('should get raffles successfully', async () => {
      const mockResponse = [
        {
          id: 1,
          title: 'Тема: Знакомство',
          description: 'Описание лотереи',
          prize_amount: 3000000,
          video_url: 'https://example.com/video.mp4',
          is_active: true,
          end_date: '2025-12-31T23:59:59.000Z'
        },
        {
          id: 2,
          title: 'Тема: Интернет магазины',
          description: 'Описание лотереи',
          prize_amount: 2000000,
          video_url: null,
          is_active: false,
          end_date: '2025-11-30T23:59:59.000Z'
        }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.getRaffles();
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/raffles/'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty raffles list', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      const result = await api.getRaffles();
      expect(result).toEqual([]);
    });

    test('should handle raffles API error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' })
      });

      await expect(api.getRaffles()).rejects.toThrow('Server error');
    });
  });

  describe('Profile Integration Tests', () => {
    test('should handle complete profile workflow', async () => {
      // Мокаем получение профиля
      const mockProfile = {
        id: 1,
        phone_number: '+998414736544',
        full_name: 'Иван Иванов',
        email: 'ivan@example.com',
        birth_date: '1990-01-01',
        balance: 12000,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile
      });

      // Получаем профиль
      const profile = await api.getUserProfile();
      expect(profile).toEqual(mockProfile);

      // Мокаем обновление профиля
      const updateData = {
        phone_number: '+998344777518',
        full_name: 'Иван Петров',
        email: 'ivan.petrov@example.com',
        birth_date: '1990-01-01'
      };

      const updatedProfile = { ...mockProfile, ...updateData };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, user: updatedProfile })
      });

      // Обновляем профиль
      const result = await api.updateUserProfile(updateData);
      expect(result.success).toBe(true);
      expect(result.user).toEqual(updatedProfile);
    });

    test('should handle profile validation errors', async () => {
      const invalidData = {
        phone_number: 'invalid-phone',
        full_name: '',
        email: 'invalid-email',
        birth_date: '2025-01-01'
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Validation error' })
      });

      await expect(api.updateUserProfile(invalidData)).rejects.toThrow('Validation error');
    });
  });

  describe('Cards API Tests', () => {
    test('should get cards successfully', async () => {
      const mockCards = [
        {
          id: 1,
          card_number: '4111 **** **** 1111',
          card_type: 'visa',
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCards
      });

      const result = await api.getCards();
      expect(result).toEqual(mockCards);
    });

    test('should add card successfully', async () => {
      const mockCard = {
        id: 1,
        card_number: '4111 **** **** 1111',
        card_type: 'visa',
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, card: mockCard })
      });

      const result = await api.addCard('4111111111111111');
      expect(result.success).toBe(true);
      expect(result.card).toEqual(mockCard);
    });

    test('should handle cards API error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid card number' })
      });

      await expect(api.addCard('invalid')).rejects.toThrow('Invalid card number');
    });

    test('should handle duplicate card error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ message: 'Card already exists' })
      });

      await expect(api.addCard('4111111111111111')).rejects.toThrow('Card already exists');
    });
  });

  describe('Invite Stats API Tests', () => {
    test('should get invite stats successfully', async () => {
      const mockStats = {
        invited: 15,
        active: 10,
        waiting_amount: 150000,
        profit: 100000
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats
      });

      const result = await api.getInviteStats();
      expect(result).toEqual(mockStats);
      expect(result.invited).toBe(15);
      expect(result.active).toBe(10);
      expect(result.waiting_amount).toBe(150000);
      expect(result.profit).toBe(100000);
    });

    test('should handle invite stats API error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' })
      });

      await expect(api.getInviteStats()).rejects.toThrow('Server error');
    });

    test('should handle invite stats with zero values', async () => {
      const mockStats = {
        invited: 0,
        active: 0,
        waiting_amount: 0,
        profit: 0
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats
      });

      const result = await api.getInviteStats();
      expect(result.invited).toBe(0);
      expect(result.active).toBe(0);
      expect(result.waiting_amount).toBe(0);
      expect(result.profit).toBe(0);
    });
  });

  describe('Order API Tests', () => {
    test('should create order successfully', async () => {
      const mockOrderData = {
        full_name: 'Иван Иванов',
        company_name: 'ООО Тестовая Компания',
        job_title: 'Менеджер',
        phone_number: '+998901234567',
        email: 'ivan@example.com'
      };

      const mockResponse = {
        success: true,
        message: 'Order created successfully',
        order_id: 123
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.createOrder(mockOrderData);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Order created successfully');
      expect(result.order_id).toBe(123);
    });

    test('should handle order validation error', async () => {
      const invalidOrderData = {
        full_name: '',
        company_name: 'Test',
        job_title: 'Manager',
        phone_number: 'invalid-phone',
        email: 'invalid-email'
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Validation error' })
      });

      await expect(api.createOrder(invalidOrderData)).rejects.toThrow('Validation error');
    });

    test('should handle order creation with missing optional fields', async () => {
      const minimalOrderData = {
        full_name: 'Иван Иванов',
        company_name: '',
        job_title: '',
        phone_number: '+998901234567',
        email: ''
      };

      const mockResponse = {
        success: true,
        message: 'Order created successfully',
        order_id: 124
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.createOrder(minimalOrderData);
      expect(result.success).toBe(true);
      expect(result.order_id).toBe(124);
    });
  });

  describe('Payment API Tests', () => {
    test('should create payment successfully', async () => {
      const mockPaymentData = {
        card_number: '8600123412345678',
        amount: 50000
      };

      const mockResponse = {
        success: true,
        message: 'Payment created successfully',
        payment_id: 456,
        status: 'pending'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.createPayment(mockPaymentData);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Payment created successfully');
      expect(result.payment_id).toBe(456);
      expect(result.status).toBe('pending');
    });

    test('should handle payment validation error', async () => {
      const invalidPaymentData = {
        card_number: 'invalid-card',
        amount: -1000
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid payment data' })
      });

      await expect(api.createPayment(invalidPaymentData)).rejects.toThrow('Invalid payment data');
    });

    test('should handle insufficient funds error', async () => {
      const paymentData = {
        card_number: '8600123412345678',
        amount: 1000000
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: async () => ({ message: 'Insufficient funds' })
      });

      await expect(api.createPayment(paymentData)).rejects.toThrow('Insufficient funds');
    });

    test('should handle payment with minimum amount', async () => {
      const paymentData = {
        card_number: '8600123412345678',
        amount: 20000
      };

      const mockResponse = {
        success: true,
        message: 'Payment created successfully',
        payment_id: 457,
        status: 'pending'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.createPayment(paymentData);
      expect(result.success).toBe(true);
      expect(result.amount).toBe(20000);
    });
  });
});
