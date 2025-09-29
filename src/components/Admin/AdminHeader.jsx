import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../Main/icons';
import PRO from '../../assets/Pro.svg';

const AdminHeader = ({ title, subtitle, stats }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#7C65FF] to-[#5538F9]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C65FF]/90 via-[#6B54FF]/95 to-[#5538F9]/90"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/8 rounded-full blur-xl"></div>
      
      <div className="relative">
        <div className="mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-8 sm:py-10 gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-white/90 bg-white/10 rounded-xl transition-colors duration-200 text-sm font-medium border border-white/20"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Назад
            </button>
            
            <div className="flex items-center">
              <img src={PRO} alt="" className="w-52 sm:w-64 brightness-110" />
            </div>
            
            <div className="text-center sm:text-right text-white">
              <div className="text-2xl sm:text-3xl font-bold mb-1">{title}</div>
              <div className="text-sm sm:text-base text-white/80">{subtitle}</div>
              {stats && (
                <div className="text-xs sm:text-sm text-white/70 mt-2 bg-white/10 px-3 py-1 rounded-lg inline-block">
                  {stats}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
