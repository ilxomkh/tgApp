import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { UsersGroupIcon, DollarSignIcon, ClockIcon, CheckIcon, BarChartIcon } from '../Main/icons';
import { formatCurrency, copyToClipboard } from '../../utils/adminUtils.jsx';

const UserReferrals = ({ userId }) => {
  const [referrals, setReferrals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      setError(null);
      const referralsData = await adminApi.getUserReferrals(userId);
      setReferrals(referralsData);
    } catch (err) {
      console.error('Error fetching user referrals:', err);
      setError(err.message || 'Ошибка загрузки реферальной информации');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [userId]);

  const copyToClipboardHandler = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          <span className="text-slate-500 text-sm">Загрузка данных о рефералах...</span>
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
          <h3 className="font-medium text-slate-900">Не удалось загрузить данные</h3>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
        <button
          onClick={fetchReferrals}
          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
        >
          Повторить
        </button>
      </div>
    );
  }

  if (!referrals) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <UsersGroupIcon className="w-8 h-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-slate-900">Данные не найдены</h3>
          <p className="text-slate-500 text-sm">Реферальная информация отсутствует</p>
        </div>
      </div>
    );
  }

  const totalReferrals = referrals.referrals_active_count + referrals.referrals_pending_count;
  const conversionRate = totalReferrals > 0 ? (referrals.referrals_active_count / totalReferrals) * 100 : 0;
  const avgIncome = totalReferrals > 0 ? referrals.referral_income_total / totalReferrals : 0;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Реферальный код</h3>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <code className="text-xl font-mono text-white">
                    {referrals.referral_code}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboardHandler(referrals.referral_code)}
                  className={`px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {copied ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">🎯</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSignIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Общий доход</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-slate-900">
              {formatCurrency(referrals.referral_income_total)}
            </div>
            <div className="text-sm text-slate-500">от всех рефералов</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Ожидает</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-slate-900">
              {formatCurrency(referrals.referral_income_pending)}
            </div>
            <div className="text-sm text-slate-500">в обработке</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-slate-900">{referrals.referrals_active_count}</div>
            <div className="text-sm text-slate-500">активных рефералов</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-slate-900">{referrals.referrals_pending_count}</div>
            <div className="text-sm text-slate-500">ожидающих</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <UsersGroupIcon className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-slate-900">{totalReferrals}</div>
            <div className="text-sm text-slate-500">всего рефералов</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChartIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Средний доход</h4>
              <p className="text-sm text-slate-500">на одного реферала</p>
            </div>
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {formatCurrency(avgIncome)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-lg">🎯</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Конверсия</h4>
              <p className="text-sm text-slate-500">в активные рефералы</p>
            </div>
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {Math.round(conversionRate)}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h4 className="font-medium text-slate-900 mb-6">Распределение рефералов</h4>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-600">Активные</span>
              </div>
              <div className="font-medium text-slate-900">
                {referrals.referrals_active_count} ({Math.round((referrals.referrals_active_count / Math.max(totalReferrals, 1)) * 100)}%)
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${totalReferrals > 0 ? (referrals.referrals_active_count / totalReferrals) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-slate-600">Ожидающие</span>
              </div>
              <div className="font-medium text-slate-900">
                {referrals.referrals_pending_count} ({Math.round((referrals.referrals_pending_count / Math.max(totalReferrals, 1)) * 100)}%)
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${totalReferrals > 0 ? (referrals.referrals_pending_count / totalReferrals) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReferrals