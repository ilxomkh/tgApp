import React, { useState, useEffect } from "react";
import {
  Wallet,
  RefreshCw,
  Server,
  Globe,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  CreditCard,
} from "lucide-react";
import AdminHeader from "./AdminHeader";
import AdminNavigation from "./AdminNavigation";
import { adminApi } from "../../services/adminApi";

const AdminBalances = () => {
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const colors = {
    primary: "#7C65FF",
    secondary: "#5538F9",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  };

  const fetchBalances = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getBalances();
      setBalances(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Ошибка при получении балансов:", err);
      setError(err.message || "Ошибка при загрузке балансов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const formatCurrency = (amount, currency = "UZS") => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "error":
      case "inactive":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getServiceIcon = (serviceName) => {
    const name = serviceName?.toLowerCase() || "";
    if (name === "eskiz") {
      return <Mail className="w-6 h-6" />;
    } else if (name === "atmos") {
      return <CreditCard className="w-6 h-6" />;
    } else {
      return <Wallet className="w-6 h-6" />;
    }
  };

  const calculateTotalBalance = (data) => {
    let total = 0;
    if (data?.eskiz?.balance?.balance) {
      total += data.eskiz.balance.balance;
    }
    if (data?.atmos?.balance) {
      total += data.atmos.balance;
    }
    return total;
  };

  const getServiceCount = (data) => {
    let count = 0;
    if (data?.eskiz) count++;
    if (data?.atmos) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7C65FF]/5 via-white to-[#5538F9]/8">
        <AdminHeader />
        <AdminNavigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-[#7C65FF] animate-spin" />
            <p className="text-gray-600">Загрузка балансов...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7C65FF]/5 via-white to-[#5538F9]/8">
        <AdminHeader />
        <AdminNavigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-800">Ошибка загрузки</h3>
            <p className="text-gray-600 max-w-md">{error}</p>
            <button
              onClick={fetchBalances}
              className="px-6 py-3 bg-gradient-to-r from-[#7C65FF] to-[#5538F9] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C65FF]/5 via-white to-[#5538F9]/8">
      <AdminHeader />
      <AdminNavigation />
      
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Балансы сервисов</h1>
              <p className="text-gray-600">
                Мониторинг балансов во всех подключенных сервисах
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Обновлено: {lastUpdated.toLocaleTimeString("ru-RU")}
                </div>
              )}
              <button
                onClick={fetchBalances}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#7C65FF]/20 rounded-xl text-[#7C65FF] font-semibold hover:bg-white hover:shadow-md transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Обновить
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          {balances && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#7C65FF]/10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-[#7C65FF]/10 to-[#5538F9]/10 rounded-xl">
                    <Wallet className="w-6 h-6 text-[#7C65FF]" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Общий баланс</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(calculateTotalBalance(balances))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#7C65FF]/10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Подключенные сервисы</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {getServiceCount(balances)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#7C65FF]/10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl">
                    <Building className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Компания</p>
                    <p className="text-lg font-bold text-gray-900 truncate">
                      {balances?.eskiz?.balance?.company_name || "PROSURVEY"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services List */}
          <div className="space-y-6">
            {/* Eskiz Service */}
            {balances?.eskiz && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#7C65FF]/10 shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-[#7C65FF]/10 to-[#5538F9]/10 rounded-xl">
                      <Mail className="w-6 h-6 text-[#7C65FF]" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Eskiz SMS</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Balance Info */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-[#7C65FF]/5 to-[#5538F9]/5 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Баланс</h3>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#7C65FF]">
                          {formatCurrency(balances.eskiz.balance.balance)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Истекает: {formatDate(balances.eskiz.balance.expire)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Компания:</strong> {balances.eskiz.balance.company_name}</p>
                      <p><strong>Email:</strong> {balances.eskiz.balance.email}</p>
                    </div>
                  </div>

                  {/* Domains */}
                  {balances.eskiz.domains && balances.eskiz.domains.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Домены
                      </h4>
                      <div className="space-y-3">
                        {balances.eskiz.domains.map((domain, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(domain.status)}
                              <div>
                                <p className="font-medium text-gray-900">{domain.domain}</p>
                                <p className="text-sm text-gray-600">
                                  Истекает: {formatDate(domain.date_expire)}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              domain.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {domain.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VPS */}
                  {balances.eskiz.vps && balances.eskiz.vps.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Server className="w-5 h-5" />
                        VPS серверы
                      </h4>
                      <div className="space-y-3">
                        {balances.eskiz.vps.map((vps, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(vps.status)}
                              <div>
                                <p className="font-medium text-gray-900">{vps.tarif}</p>
                                <p className="text-sm text-gray-600">IP: {vps.ip}</p>
                                <p className="text-sm text-gray-600">
                                  Истекает: {formatDate(vps.date_expire)}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              vps.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {vps.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Atmos Service */}
            {balances?.atmos && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#7C65FF]/10 shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl">
                      <CreditCard className="w-6 h-6 text-green-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Atmos</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="p-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Баланс</h3>
                        <p className="text-sm text-gray-600">Платежная система</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(balances.atmos.balance)}
                        </p>
                        {balances.atmos.total_branches_amount !== undefined && (
                          <p className="text-sm text-gray-600">
                            Филиалы: {formatCurrency(balances.atmos.total_branches_amount)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(!balances?.eskiz && !balances?.atmos) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#7C65FF]/10 shadow-lg p-12 text-center">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет данных о сервисах</h3>
                <p className="text-gray-600">Информация о балансах сервисов пока недоступна</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBalances;
