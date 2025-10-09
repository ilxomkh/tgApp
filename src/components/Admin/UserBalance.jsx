import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { DollarSignIcon, TrendingUpIcon, XIcon, WalletIcon } from '../Main/icons';
import { formatCurrency } from '../../utils/adminUtils.jsx';

const UserBalance = ({ userId }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const balanceData = await adminApi.getUserBalance(userId);
      setBalance(balanceData);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки баланса пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [userId]);


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          <span className="text-slate-500 text-sm">Загрузка баланса...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-500 text-2xl">⚠️</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-slate-900">Не удалось загрузить баланс</h3>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
        <button
          onClick={fetchBalance}
          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
        >
          Повторить
        </button>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <WalletIcon className="w-8 h-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-slate-900">Данные не найдены</h3>
          <p className="text-slate-500 text-sm">Информация о балансе отсутствует</p>
        </div>
      </div>
    );
  }

  const netEarnings = balance.total_earned - balance.total_withdrawn;
  const withdrawalRate = balance.total_earned > 0 ? (balance.total_withdrawn / balance.total_earned) * 100 : 0;
  const balanceRate = balance.total_earned > 0 ? (balance.current_balance / balance.total_earned) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Текущий баланс</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-slate-900">
              {formatCurrency(balance.current_balance)}
            </div>
            <div className="text-sm text-slate-500">доступно к выводу</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Всего заработано</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-slate-900">
              {formatCurrency(balance.total_earned)}
            </div>
            <div className="text-sm text-slate-500">за все время</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <XIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Всего выведено</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-slate-900">
              {formatCurrency(balance.total_withdrawn)}
            </div>
            <div className="text-sm text-slate-500">получено пользователем</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSignIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Чистый доход</h4>
              <p className="text-sm text-slate-500">заработано за вычетом выводов</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-slate-900">
              {formatCurrency(netEarnings)}
            </div>
            <div className="text-sm text-slate-500">
              {netEarnings >= 0 ? 'Положительный баланс' : 'Отрицательный баланс'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 text-lg">📊</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Активность выводов</h4>
              <p className="text-sm text-slate-500">процент от общего заработка</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-slate-900">
              {Math.round(withdrawalRate)}%
            </div>
            <div className="text-sm text-slate-500">
              {withdrawalRate > 80 ? 'Высокая активность' : 
               withdrawalRate > 50 ? 'Средняя активность' : 
               withdrawalRate > 0 ? 'Низкая активность' : 'Нет выводов'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h4 className="font-medium text-slate-900 mb-6">Распределение средств</h4>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Выведено</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{formatCurrency(balance.total_withdrawn)}</div>
                <div className="text-xs text-slate-500">{Math.round(withdrawalRate)}%</div>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${withdrawalRate}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">На балансе</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{formatCurrency(balance.current_balance)}</div>
                <div className="text-xs text-slate-500">{Math.round(balanceRate)}%</div>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${balanceRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Общий заработок:</span>
            <span className="text-sm font-medium text-slate-900">{formatCurrency(balance.total_earned)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {balance.total_earned > 0 ? Math.round(balance.total_earned / 1000) + 'K' : '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">заработано (тыс.)</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {balance.total_withdrawn > 0 ? Math.round(balance.total_withdrawn / 1000) + 'K' : '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">выведено (тыс.)</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {Math.round(withdrawalRate)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">активность</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-slate-900">
            {balance.current_balance > 0 ? Math.round(balance.current_balance / 1000) + 'K' : '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">доступно (тыс.)</div>
        </div>
      </div>
    </div>
  );
};

export default UserBalance;
