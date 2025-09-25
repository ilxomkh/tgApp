import { api } from '../../services/api';

export const fetchUserStats = async () => {
  try {
    const data = await api.getUserStats();
    return data;
  } catch (error) {
    console.error('Ошибка при получении статистики пользователей:', error);
    throw error;
  }
};

export const expectedApiResponse = {
  totalUsers: 12543,
  activeUsers: 8921,
  newUsersToday: 156,
  newUsersThisWeek: 1089,
  newUsersThisMonth: 4234,
  userGrowth: [
    { month: 'Янв', users: 1200 },
    { month: 'Фев', users: 1350 },
  ],
  userActivity: [
    { hour: '00', users: 45 },
    { hour: '02', users: 32 },
  ],
  userSources: [
    { source: 'Telegram', users: 6543, percentage: 52.1 },
    { source: 'Рефералы', users: 3124, percentage: 24.9 },
  ]
};
