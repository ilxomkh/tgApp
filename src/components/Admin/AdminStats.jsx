import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Users, UserCheck, UserPlus, TrendingUp, RefreshCw } from 'lucide-react';
import AdminHeader from './AdminHeader';
import AdminNavigation from './AdminNavigation';
import { fetchUserStats } from './adminStatsApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Красивая цветовая палитра
  const colors = {
    primary: '#6366f1', // Индиго
    secondary: '#8b5cf6', // Фиолетовый
    accent: '#06b6d4', // Циан
    success: '#10b981', // Изумрудный
    warning: '#f59e0b', // Янтарный
    danger: '#ef4444', // Красный
    info: '#3b82f6', // Синий
    gradient: {
      purple: ['#8b5cf6', '#6366f1', '#3b82f6'],
      blue: ['#06b6d4', '#3b82f6', '#6366f1'],
      green: ['#10b981', '#06b6d4', '#3b82f6'],
      orange: ['#f59e0b', '#ef4444', '#8b5cf6'],
    }
  };


  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserStats();
        setStats(data);
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
        setError(error.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserStats();
      setStats(data);
    } catch (error) {
      console.error('Ошибка при обновлении статистики:', error);
      setError(error.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 hover:bg-${color}-200 transition-colors duration-200`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  // Общие настройки для всех чартов
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    hover: {
      animationDuration: 300,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500',
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        animation: {
          duration: 200,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Данные для чартов с красивыми цветами
  const getChartData = () => {
    if (!stats) return null;

    return {
      userGrowth: {
        labels: stats.userGrowth.map(item => item.month),
        datasets: [
          {
            label: 'Пользователи',
            data: stats.userGrowth.map(item => item.users),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 4,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: (context) => {
              const data = context.dataset.data;
              const index = context.dataIndex;
              
              if (index === 0) return '#10b981';
              
              const currentValue = data[index];
              const previousValue = data[index - 1];
              
              return currentValue >= previousValue ? '#10b981' : '#ef4444';
            },
            pointBorderColor: '#ffffff',
            pointBorderWidth: 3,
            pointRadius: 8,
            pointHoverRadius: 12,
            pointHoverBackgroundColor: (context) => {
              const data = context.dataset.data;
              const index = context.dataIndex;
              
              if (index === 0) return '#059669';
              
              const currentValue = data[index];
              const previousValue = data[index - 1];
              
              return currentValue >= previousValue ? '#059669' : '#dc2626';
            },
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 4,
          },
        ],
      },
      userActivity: {
        labels: stats.userActivity.map(item => item.hour),
        datasets: [
          {
            label: 'Активность',
            data: stats.userActivity.map(item => item.users),
            backgroundColor: [
              'rgba(124, 101, 255, 0.8)',
              'rgba(85, 56, 249, 0.8)',
              'rgba(159, 122, 234, 0.8)',
              'rgba(183, 148, 246, 0.8)',
              'rgba(124, 101, 255, 0.8)',
              'rgba(85, 56, 249, 0.8)',
              'rgba(159, 122, 234, 0.8)',
              'rgba(183, 148, 246, 0.8)',
              'rgba(124, 101, 255, 0.8)',
              'rgba(85, 56, 249, 0.8)',
              'rgba(159, 122, 234, 0.8)',
              'rgba(183, 148, 246, 0.8)',
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: [
              'rgba(124, 101, 255, 1)',
              'rgba(85, 56, 249, 1)',
              'rgba(159, 122, 234, 1)',
              'rgba(183, 148, 246, 1)',
              'rgba(124, 101, 255, 1)',
              'rgba(85, 56, 249, 1)',
              'rgba(159, 122, 234, 1)',
              'rgba(183, 148, 246, 1)',
              'rgba(124, 101, 255, 1)',
              'rgba(85, 56, 249, 1)',
              'rgba(159, 122, 234, 1)',
              'rgba(183, 148, 246, 1)',
            ],
            hoverBorderColor: '#6366f1',
            hoverBorderWidth: 3,
          },
        ],
      },
      userSources: {
        labels: stats.userSources.map(item => item.source),
        datasets: [
          {
            data: stats.userSources.map(item => item.users),
            backgroundColor: [
              colors.primary,
              colors.secondary,
              colors.accent,
              colors.success,
            ],
            borderColor: '#ffffff',
            borderWidth: 3,
            borderRadius: 8,
            hoverOffset: 8,
            hoverBackgroundColor: [
              colors.secondary,
              colors.accent,
              colors.success,
              colors.warning,
            ],
          },
        ],
      },
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader 
          title="Статистика пользователей" 
          subtitle="Общая статистика по пользователям" 
        />
        <AdminNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader 
          title="Статистика пользователей" 
          subtitle="Общая статистика по пользователям" 
        />
        <AdminNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-red-600">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ошибка загрузки статистики
                </h3>
                <p className="text-gray-600 mb-6">
                  {error || 'Не удалось загрузить данные статистики'}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#7C65FF] text-white rounded-lg hover:bg-[#6B5AE8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mx-auto"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

         return (
           <div className="min-h-screen bg-gray-50">
             <AdminHeader
               title="Статистика пользователей"
               subtitle="Общая статистика по пользователям"
               stats={`Обновлено: ${new Date().toLocaleString('ru-RU')}`}
             />
             <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <div className="bg-white rounded-lg border border-gray-200 p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-gray-600">Всего пользователей</p>
                       <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                       <p className="text-xs text-gray-500 mt-1">За все время</p>
                     </div>
                     <div className="p-3 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200">
                       <Users className="w-6 h-6 text-indigo-600" />
                     </div>
                   </div>
                 </div>
          
                 <div className="bg-white rounded-lg border border-gray-200 p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-gray-600">Активные пользователи</p>
                       <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                       <p className="text-xs text-gray-500 mt-1">За последние 30 дней</p>
                     </div>
                     <div className="p-3 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors duration-200">
                       <UserCheck className="w-6 h-6 text-emerald-600" />
                     </div>
                   </div>
                 </div>
          
                 <div className="bg-white rounded-lg border border-gray-200 p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-gray-600">Новые сегодня</p>
                       <p className="text-2xl font-bold text-gray-900">{stats.newUsersToday.toLocaleString()}</p>
                       <p className="text-xs text-gray-500 mt-1">За последние 24 часа</p>
                     </div>
                     <div className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors duration-200">
                       <UserPlus className="w-6 h-6 text-purple-600" />
                     </div>
                   </div>
                 </div>
          
                 <div className="bg-white rounded-lg border border-gray-200 p-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-gray-600">Новые за месяц</p>
                       <p className="text-2xl font-bold text-gray-900">{stats.newUsersThisMonth.toLocaleString()}</p>
                       <p className="text-xs text-gray-500 mt-1">За последние 30 дней</p>
                     </div>
                     <div className="p-3 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors duration-200">
                       <TrendingUp className="w-6 h-6 text-amber-600" />
                     </div>
                   </div>
                 </div>
        </div>

        {/* Чарты */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Источники пользователей</h3>
            <div className="h-80 rounded-lg overflow-hidden">
              <Doughnut 
                data={getChartData()?.userSources} 
                options={{
                  ...chartOptions,
                  cutout: '60%',
                  animation: {
                    ...chartOptions.animation,
                    animateRotate: true,
                    animateScale: true,
                  },
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                          size: 12,
                          weight: '500',
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Активность пользователей по часам</h3>
            <div className="h-80 rounded-lg overflow-hidden">
              <Bar 
                data={getChartData()?.userActivity} 
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Рост пользователей по месяцам</h3>
            <div className="h-80 rounded-lg overflow-hidden">
              <Line 
                data={getChartData()?.userGrowth} 
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
