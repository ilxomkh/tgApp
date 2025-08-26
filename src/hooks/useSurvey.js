import { useState, useCallback } from 'react';

// Моковые данные опросов (замените на реальные API вызовы)
const mockSurveys = {
  intro: {
    id: 'intro',
    title: 'Тема: Знакомство',
    type: 'prize',
    questions: [
      {
        id: 1,
        text: "Как часто вы совершаете покупки онлайн?",
        options: [
          { value: "daily", text: "Ежедневно" },
          { value: "weekly", text: "Раз в неделю" },
          { value: "monthly", text: "Раз в месяц" },
          { value: "rarely", text: "Редко" }
        ]
      },
      {
        id: 2,
        text: "Какой способ оплаты вы предпочитаете?",
        options: [
          { value: "card", text: "Банковская карта" },
          { value: "cash", text: "Наличные" },
          { value: "mobile", text: "Мобильный банк" },
          { value: "other", text: "Другое" }
        ]
      }
    ]
  },
  shops: {
    id: 'shops',
    title: 'Тема: Интернет магазины',
    type: 'mixed',
    questions: [
      {
        id: 1,
        text: "Какие товары вы чаще всего покупаете онлайн?",
        options: [
          { value: "electronics", text: "Электроника" },
          { value: "clothing", text: "Одежда" },
          { value: "food", text: "Продукты питания" },
          { value: "books", text: "Книги" }
        ]
      },
      {
        id: 2,
        text: "Какой фактор наиболее важен при выборе интернет-магазина?",
        options: [
          { value: "price", text: "Цена" },
          { value: "delivery", text: "Быстрая доставка" },
          { value: "quality", text: "Качество товаров" },
          { value: "reviews", text: "Отзывы покупателей" }
        ]
      },
      {
        id: 3,
        text: "Сколько времени вы тратите на поиск товара?",
        options: [
          { value: "less_15", text: "Менее 15 минут" },
          { value: "15_30", text: "15-30 минут" },
          { value: "30_60", text: "30-60 минут" },
          { value: "more_60", text: "Более часа" }
        ]
      }
    ]
  },
  banks: {
    id: 'banks',
    title: 'Тема: Банки',
    type: 'lottery',
    questions: [
      {
        id: 1,
        text: "Какими банковскими услугами вы пользуетесь?",
        options: [
          { value: "debit", text: "Дебетовая карта" },
          { value: "credit", text: "Кредитная карта" },
          { value: "deposit", text: "Депозиты" },
          { value: "loan", text: "Кредиты" }
        ]
      },
      {
        id: 2,
        text: "Как часто вы обращаетесь в банк?",
        options: [
          { value: "weekly", text: "Раз в неделю" },
          { value: "monthly", text: "Раз в месяц" },
          { value: "quarterly", text: "Раз в квартал" },
          { value: "yearly", text: "Раз в год" }
        ]
      }
    ]
  }
};

export const useSurvey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSurvey = useCallback(async (surveyId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const survey = mockSurveys[surveyId];
      if (!survey) {
        throw new Error('Опрос не найден');
      }
      
      return survey;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitSurvey = useCallback(async (surveyId, answers) => {
    setLoading(true);
    setError(null);
    
    try {
      // Имитация отправки на сервер
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Моковый результат (замените на реальный ответ с бекенда)
      const survey = mockSurveys[surveyId];
      let result;
      
      if (survey?.type === 'prize') {
        result = {
          message: "Вам начислено 20 000 сум",
          type: "prize",
          amount: 20000
        };
      } else if (survey?.type === 'lottery') {
        result = {
          message: "Вы стали участником розыгрыша на 3 000 000 сум",
          type: "lottery",
          amount: 3000000
        };
      } else if (survey?.type === 'mixed') {
        result = {
          message: "Вам начислено 20 000 сум, а так же вы стали участником розыгрыша на 3 000 000 сум",
          type: "mixed",
          prize: 20000,
          lottery: 3000000
        };
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getSurvey,
    submitSurvey,
    loading,
    error
  };
};
