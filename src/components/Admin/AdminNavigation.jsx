import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Film, BarChart3 } from 'lucide-react';

const AdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/admin/users', label: 'Пользователи', icon: Users },
    { path: '/admin/raffles', label: 'Розыгрыши', icon: Film },
    { path: '/admin/stats', label: 'Статистика', icon: BarChart3 }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-[#7C65FF]/10">
      <div className="mx-auto px-6 sm:px-8">
        <nav className="flex justify-center sm:justify-start py-4">
          <div className="flex bg-gradient-to-r from-[#7C65FF]/5 to-[#5538F9]/5 rounded-2xl p-2 border border-[#7C65FF]/10">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`
                    relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300
                    ${isActive 
                      ? 'text-white bg-gradient-to-r from-[#7C65FF] to-[#5538F9]' 
                      : 'text-gray-600 bg-white/50'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <tab.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform duration-300`} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminNavigation;
