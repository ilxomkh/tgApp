import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Film, BarChart3 } from 'lucide-react';

const AdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/admin/users', label: 'Пользователи', icon: Users },
    { path: '/admin/raffles', label: 'Розыгрыши', icon: Film },
    // { path: '/admin/stats', label: 'Статистика', icon: BarChart3 }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'border-[#7C65FF] text-[#7C65FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminNavigation;
