import React, { useState } from 'react';
import api from '../services/api';

const SMSTestComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testSendSMS = async () => {
    if (!phoneNumber || !message) {
      setResult('Пожалуйста, введите номер телефона и сообщение');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await api.sms.sendMessage(phoneNumber, message);
      setResult(`SMS отправлено успешно! ID сообщения: ${response.messageId}`);
    } catch (error) {
      setResult(`Ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetBalance = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await api.sms.getBalance();
      setResult(`Баланс SMS аккаунта: ${response.data?.balance || 'Неизвестно'} сум`);
    } catch (error) {
      setResult(`Ошибка получения баланса: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testOTPFlow = async () => {
    if (!phoneNumber) {
      setResult('Пожалуйста, введите номер телефона');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const otpResponse = await api.requestOtp(phoneNumber);
      setResult(`OTP код отправлен! ${otpResponse.message}`);
      
      const savedCode = localStorage.getItem('temp_otp_code');
      if (savedCode) {
        setResult(prev => prev + `\nКод для тестирования: ${savedCode}`);
      }
    } catch (error) {
      setResult(`Ошибка отправки OTP: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Тест SMS сервиса Eskiz.uz</h2>
      <p className="text-sm text-gray-600 mb-4">
        Интеграция с Eskiz.uz для отправки SMS кодов авторизации
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Номер телефона:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+998901234567"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Сообщение:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Текст сообщения"
            className="w-full p-2 border rounded-md h-20"
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={testSendSMS}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Отправка...' : 'Отправить SMS'}
          </button>

          <button
            onClick={testOTPFlow}
            disabled={isLoading}
            className="w-full bg-green-500 text-white p-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Отправка...' : 'Отправить OTP код'}
          </button>

          <button
            onClick={testGetBalance}
            disabled={isLoading}
            className="w-full bg-gray-500 text-white p-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Загрузка...' : 'Проверить баланс'}
          </button>
        </div>

        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSTestComponent;