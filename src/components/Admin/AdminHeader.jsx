import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../Main/icons';
import PRO from '../../assets/Pro.svg';

const AdminHeader = ({ title, subtitle, stats }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-[#5538F9] to-[#7C65FF]">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-6 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-white hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm font-medium order-1 sm:order-1"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Вернуться в приложение
          </button>
          <img src={PRO} alt="" className="w-48 sm:w-60 order-2 sm:order-2" />
          <div className="text-center sm:text-right text-white order-3 sm:order-3">
            <div className="text-xl sm:text-2xl font-semibold">{title}</div>
            <div className="text-xs sm:text-sm opacity-90">{subtitle}</div>
            {stats && (
              <div className="text-xs sm:text-sm opacity-90 mt-1">
                {stats}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
