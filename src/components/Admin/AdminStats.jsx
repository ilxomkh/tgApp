import React, { useState, useEffect } from "react";
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
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  RefreshCw,
  Calendar,
  ChevronDown,
  Monitor,
  Clock,
  BarChart3,
} from "lucide-react";
import AdminHeader from "./AdminHeader";
import AdminNavigation from "./AdminNavigation";
import { fetchUserStats } from "./adminStatsApi";

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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState('month');
  const colors = {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    gradient: {
      purple: ["#8b5cf6", "#6366f1", "#3b82f6"],
      blue: ["#06b6d4", "#3b82f6", "#6366f1"],
      green: ["#10b981", "#06b6d4", "#3b82f6"],
      orange: ["#f59e0b", "#ef4444", "#8b5cf6"],
    },
  };

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserStats({ year: selectedYear, month: selectedMonth, viewMode });
        setStats(data);
      } catch (error) {
        console.error("Ошибка при загрузке статистики:", error);
        setError(error.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [selectedYear, selectedMonth, viewMode]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserStats({ year: selectedYear, month: selectedMonth, viewMode });
      setStats(data);
    } catch (error) {
      console.error("Ошибка при обновлении статистики:", error);
      setError(error.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-full bg-${color}-100 hover:bg-${color}-200 transition-colors duration-200`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    hover: {
      animationDuration: 300,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#374151",
          font: {
            size: 12,
            weight: "500",
          },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#6366f1",
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
          color: "rgba(156, 163, 175, 0.08)",
          drawBorder: false,
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
            weight: "500",
          },
          padding: 8,
        },
      },
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.05)",
          drawBorder: false,
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
            weight: "500",
          },
          padding: 8,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: "easeInOutQuart",
    },
    hover: {
      animationDuration: 300,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#6366f1",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        animation: {
          duration: 200,
        },
        callbacks: {
          title: function(context) {
            return `Час ${context[0].label}:00`;
          },
          label: function(context) {
            return `${context.parsed.y} пользователей`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
            weight: "500",
          },
          padding: 8,
        },
      },
      x: {
        grid: {
          display: true,
          color: "rgba(156, 163, 175, 0.05)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
            weight: "500",
          },
          padding: 8,
        },
      },
    },
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const getChartData = () => {
    if (!stats) return null;

    const showDailyData = viewMode === 'month' && stats.dailyGrowth && stats.dailyGrowth.length > 0;

    return {
      userGrowth: {
        labels: showDailyData
          ? stats.dailyGrowth.map((item) => {
              const date = new Date(item.date);
              const monthNames = ['янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
              return `${date.getDate()} ${monthNames[date.getMonth()]}`;
            })
          : stats.userGrowth?.map((item) => item.month) || [],
        datasets: [
          {
            label: showDailyData ? "Пользователи (дни)" : "Пользователи (месяцы)",
            data: showDailyData
              ? stats.dailyGrowth.map((item) => item.users)
              : stats.userGrowth?.map((item) => item.users) || [],
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139, 92, 246, 0.08)",
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: (context) => {
              const data = context.dataset.data;
              const index = context.dataIndex;

              if (index === 0) return "#8b5cf6";

              const currentValue = data[index];
              const previousValue = data[index - 1];

              return currentValue >= previousValue ? "#8b5cf6" : "#ef4444";
            },
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 12,
            pointHoverBackgroundColor: (context) => {
              const data = context.dataset.data;
              const index = context.dataIndex;

              if (index === 0) return "#7c3aed";

              const currentValue = data[index];
              const previousValue = data[index - 1];

              return currentValue >= previousValue ? "#7c3aed" : "#dc2626";
            },
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 3,
            shadowOffsetX: 0,
            shadowOffsetY: 2,
            shadowBlur: 4,
            shadowColor: "rgba(139, 92, 246, 0.2)",
          },
        ],
      },
      userActivity: {
        labels: stats.userActivity?.map((item) => item.hour) || [],
        datasets: [
          {
            label: "Активность",
            data: stats.userActivity?.map((item) => item.users) || [],
            backgroundColor: (context) => {
              const value = context.parsed.y;
              const max = Math.max(...context.dataset.data);
              const intensity = value / max;
              
              const baseColor = [99, 102, 241];
              const alpha = 0.3 + (intensity * 0.7);
              
              return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`;
            },
            borderColor: "#6366f1",
            borderWidth: 0,
            borderRadius: {
              topLeft: 6,
              topRight: 6,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderSkipped: false,
            hoverBackgroundColor: (context) => {
              const value = context.parsed.y;
              const max = Math.max(...context.dataset.data);
              const intensity = value / max;
              
              const baseColor = [99, 102, 241];
              const alpha = 0.5 + (intensity * 0.5);
              
              return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`;
            },
            hoverBorderColor: "#4f46e5",
            hoverBorderWidth: 2,
          },
        ],
      },
      userOS: {
        labels: stats.userOS?.map((item) => item.os === "Unknown" ? "Другое" : item.os) || [],
        datasets: [
          {
            data: stats.userOS?.map((item) => item.users) || [],
            backgroundColor: [
              colors.primary,
              colors.secondary,
              colors.accent,
              colors.success,
              colors.warning,
              colors.info,
            ],
            borderColor: "#ffffff",
            borderWidth: 3,
            borderRadius: 8,
            hoverOffset: 8,
            hoverBackgroundColor: [
              colors.secondary,
              colors.accent,
              colors.success,
              colors.warning,
              colors.info,
              colors.danger,
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
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
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
                  {error || "Не удалось загрузить данные статистики"}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#7C65FF] text-white rounded-lg hover:bg-[#6B5AE8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mx-auto"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Статистика пользователей"
        subtitle="Общая статистика по пользователям"
        stats={`Обновлено: ${new Date().toLocaleString("ru-RU")}`}
      />
      <AdminNavigation />

      <div className="mx-6 sm:mx-8 px-2 sm:px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#7C65FF]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Всего пользователей
                </p>
                <p className="text-3xl font-black text-[#7C65FF] mb-2">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 bg-[#7C65FF]/5 px-2 py-1 rounded-full">За все время</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#7C65FF] to-[#5538F9] rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#5538F9]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Активные пользователи
                </p>
                <p className="text-3xl font-black text-[#5538F9] mb-2">
                  {stats.activeUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 bg-[#5538F9]/5 px-2 py-1 rounded-full">
                  За последние 30 дней
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#5538F9] to-[#7C65FF] rounded-2xl flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-500/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Новые сегодня
                </p>
                <p className="text-3xl font-black text-green-600 mb-2">
                  {stats.newUsersToday.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded-full">
                  За последние 24 часа
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-500/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Новые за месяц
                </p>
                <p className="text-3xl font-black text-blue-600 mb-2">
                  {stats.newUsersThisMonth.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                  За последние 30 дней
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[#7C65FF]/10 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7C65FF] to-[#5538F9] rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              Операционные системы пользователей
            </h3>
            <div className="flex items-center justify-between h-96">
              <div className="w-3/5 h-full flex items-center justify-center p-8">
                <div className="w-72 h-72">
                  <Doughnut
                    data={getChartData()?.userOS}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      cutout: "60%",
                      animation: {
                        duration: 1000,
                        easing: "easeInOutQuart",
                        animateRotate: true,
                        animateScale: true,
                      },
                      hover: {
                        animationDuration: 300,
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          titleColor: "#ffffff",
                          bodyColor: "#ffffff",
                          borderColor: "#6366f1",
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: true,
                          animation: {
                            duration: 200,
                          },
                        },
                      },
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        arc: {
                          borderWidth: 0,
                        },
                      },
                      minAngle: 5,
                    }}
                  />
                </div>
              </div>
              
              <div className="w-2/5 h-full flex flex-col justify-center space-y-3">
                {(() => {
                  const data = getChartData()?.userOS;
                  if (!data || !data.labels || !data.datasets) return null;
                  
                  const dataset = data.datasets[0];
                  const total = dataset.data.reduce((a, b) => a + b, 0);
                  
                  return data.labels.map((label, index) => {
                    const value = dataset.data[index];
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: dataset.backgroundColor[index] }}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                          <div className="text-sm text-gray-500">
                            {value.toLocaleString()} ({percentage}%)
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[#7C65FF]/10 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7C65FF] to-[#5538F9] rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              Активность пользователей по часам
            </h3>
            <div className="h-80 rounded-lg overflow-hidden">
              <Bar data={getChartData()?.userActivity} options={barChartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[#7C65FF]/10 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7C65FF] to-[#5538F9] rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                {(() => {
                  const chartData = getChartData()?.userGrowth;
                  const hasDailyData = chartData?.datasets?.[0]?.label === "Пользователи (дни)";
                  
                  return hasDailyData
                    ? `Рост пользователей по дням (${months[selectedMonth]} ${selectedYear})`
                    : `Рост пользователей по месяцам (${selectedYear})`;
                })()}
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      viewMode === 'month' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    По дням
                  </button>
                  <button
                    onClick={() => setViewMode('year')}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      viewMode === 'year' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    По месяцам
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {viewMode === 'month' && (
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>
            <div className="h-80 rounded-lg overflow-hidden">
              <Line data={getChartData()?.userGrowth} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
