import { api } from '../../services/api';

export const fetchUserStats = async (params = {}) => {
  try {
    const data = await api.getUserStats(params);
    return data;
  } catch (error) {
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
    { month: 'Янв', users: 1200, date: '2024-01-01' },
    { month: 'Фев', users: 1350, date: '2024-02-01' },
    { month: 'Мар', users: 1450, date: '2024-03-01' },
    { month: 'Апр', users: 1620, date: '2024-04-01' },
    { month: 'Май', users: 1780, date: '2024-05-01' },
    { month: 'Июн', users: 1950, date: '2024-06-01' },
    { month: 'Июл', users: 2100, date: '2024-07-01' },
    { month: 'Авг', users: 2250, date: '2024-08-01' },
    { month: 'Сен', users: 3120, date: '2024-09-01' }
  ],
  dailyGrowth: [
    { date: '2024-09-01', users: 2250 },
    { date: '2024-09-02', users: 2280 },
    { date: '2024-09-03', users: 2310 },
    { date: '2024-09-04', users: 2350 },
    { date: '2024-09-05', users: 2400 },
    { date: '2024-09-06', users: 2450 },
    { date: '2024-09-07', users: 2510 },
    { date: '2024-09-08', users: 2580 },
    { date: '2024-09-09', users: 2650 },
    { date: '2024-09-10', users: 2720 },
    { date: '2024-09-11', users: 2800 },
    { date: '2024-09-12', users: 2890 },
    { date: '2024-09-13', users: 2980 },
    { date: '2024-09-14', users: 3050 },
    { date: '2024-09-15', users: 3120 }
  ],
  userActivity: [
    { hour: '00', users: 45 },
    { hour: '01', users: 32 },
    { hour: '02', users: 28 },
    { hour: '03', users: 25 },
    { hour: '04', users: 22 },
    { hour: '05', users: 35 },
    { hour: '06', users: 48 },
    { hour: '07', users: 65 },
    { hour: '08', users: 85 },
    { hour: '09', users: 95 },
    { hour: '10', users: 110 },
    { hour: '11', users: 125 },
    { hour: '12', users: 140 },
    { hour: '13', users: 135 },
    { hour: '14', users: 145 },
    { hour: '15', users: 160 },
    { hour: '16', users: 170 },
    { hour: '17', users: 185 },
    { hour: '18', users: 195 },
    { hour: '19', users: 180 },
    { hour: '20', users: 165 },
    { hour: '21', users: 150 },
    { hour: '22', users: 120 },
    { hour: '23', users: 90 }
  ],
  userSources: [
    { source: 'Telegram', users: 6543, percentage: 52.1 },
    { source: 'Реферальная программа', users: 3124, percentage: 24.9 },
    { source: 'Социальные сети', users: 1987, percentage: 15.8 },
    { source: 'Реклама', users: 889, percentage: 7.2 }
  ],
  userOS: [
    { os: "Другое", users: 1886, percentage: 60.4 },
    { os: "Android", users: 1152, percentage: 36.9 },
    { os: "iOS", users: 68, percentage: 2.2 },
    { os: "Windows", users: 17, percentage: 0.5 },
    { os: "Mac OS X", users: 1, percentage: 0.0 },
    { os: "Linux", users: 1, percentage: 0.0 }
  ]
};

export const monthlyResponseExample = {
  "totalUsers": 2543,
  "activeUsers": 1921,
  "newUsersToday": 156,
  "newUsersThisWeek": 389,
  "newUsersThisMonth": 423,
  "userGrowth": [
    {"month": "Янв","users": 1200,"date": "2024-01-01"},
    {"month": "Фев","users": 1350,"date": "2024-02-01"},
    {"month": "Мар","users": 1450,"date": "2024-03-01"},
    {"month": "Апр","users": 1620,"date": "2024-04-01"},
    {"month": "Май","users": 1780,"date": "2024-05-01"},
    {"month": "Июн","users": 1950,"date": "2024-06-01"},
    {"month": "Июл","users": 2100,"date": "2024-07-01"},
    {"month": "Авг","users": 2250,"date": "2024-08-01"}
  ],
  "userSources": [
    {"source": "Telegram","users": 1543,"percentage": 60.7},
    {"source": "Реферальная программа","users": 624,"percentage": 24.5},
    {"source": "Социальные сети","users": 376,"percentage": 14.8}
  ]
};

export const dailyResponseExample = {
  "totalUsers": 12543,
  "activeUsers": 8921,
  "newUsersToday": 156,
  "newUsersThisWeek": 1089,
  "newUsersThisMonth": 4234,
  "userGrowth": [
    {"month": "Сен","users": 3120,"date": "2024-09-01"}
  ],
  "dailyGrowth": [
    {"date": "2024-09-01","users": 2250},
    {"date": "2024-09-02","users": 2280},
    {"date": "2024-09-03","users": 2310},
    {"date": "2024-09-04","users": 2350},
    {"date": "2024-09-05","users": 2400},
    {"date": "2024-09-06","users": 2450},
    {"date": "2024-09-07","users": 2510},
    {"date": "2024-09-08","users": 2580},
    {"date": "2024-09-09","users": 2650},
    {"date": "2024-09-10","users": 2720},
    {"date": "2024-09-11","users": 2800},
    {"date": "2024-09-12","users": 2890},
    {"date": "2024-09-13","users": 2980},
    {"date": "2024-09-14","users": 3050},
    {"date": "2024-09-15","users": 3120}
  ]
};

export const testSeptember2025Data = {
  "totalUsers": 15750,
  "activeUsers": 10850,
  "newUsersToday": 245,
  "newUsersThisWeek": 1450,
  "newUsersThisMonth": 3890,
  "userGrowth": [
    {"month": "Сен","users": 15750,"date": "2025-09-01"}
  ],
  "dailyGrowth": [
    {"date": "2025-09-01","users": 11850},
    {"date": "2025-09-02","users": 11980},
    {"date": "2025-09-03","users": 12120},
    {"date": "2025-09-04","users": 12360},
    {"date": "2025-09-05","users": 12590},
    {"date": "2025-09-06","users": 12840},
    {"date": "2025-09-07","users": 13080},
    {"date": "2025-09-08","users": 13320},
    {"date": "2025-09-09","users": 13560},
    {"date": "2025-09-10","users": 13800},
    {"date": "2025-09-11","users": 14040},
    {"date": "2025-09-12","users": 14280},
    {"date": "2025-09-13","users": 14520},
    {"date": "2025-09-14","users": 14760},
    {"date": "2025-09-15","users": 15000},
    {"date": "2025-09-16","users": 15240},
    {"date": "2025-09-17","users": 15480}
  ]
};
