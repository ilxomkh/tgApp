// Общие утилиты для админки
import { AppleIcon, AndroidIcon, LaptopIcon, FlagUzIcon, FlagRuIcon, FlagUsIcon, GlobeIcon } from '../components/Main/icons';

// Форматирование даты
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Форматирование номера телефона
export const formatPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '—';
  }
  return phone.replace(/(\+998)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
};

// Форматирование валюты
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Получение информации о языке
export const getLanguageInfo = (lang) => {
  const languages = {
    'uz': { icon: <FlagUzIcon className="w-4 h-4" />, name: 'Узбекский' },
    'ru': { icon: <FlagRuIcon className="w-4 h-4" />, name: 'Русский' },
    'en': { icon: <FlagUsIcon className="w-4 h-4" />, name: 'Английский' }
  };
  return languages[lang] || { icon: <GlobeIcon className="w-4 h-4" />, name: 'Не определен' };
};

// Получение информации об устройстве
export const getDeviceInfo = (deviceInfo) => {
  if (!deviceInfo) {
    return { icon: <LaptopIcon className="w-6 h-6" />, name: 'Unknown' };
  }
  
  const { os, device, model } = deviceInfo;
  
  switch (os) {
    case 'iOS':
      return { icon: <AppleIcon className="w-6 h-6" />, name: `${device || 'iPhone/iPad'} ${model || ''}`.trim() };
    case 'Android':
      return { icon: <AndroidIcon className="w-6 h-6" />, name: `${device || 'Android'} ${model || ''}`.trim() };
    case 'Linux':
    case 'Windows':
    case 'macOS':
      return { icon: <LaptopIcon className="w-6 h-6" />, name: `${os} ${device || ''}`.trim() };
    default:
      return { icon: <LaptopIcon className="w-6 h-6" />, name: os || 'Unknown' };
  }
};

// Получение инициалов пользователя
export const getUserInitials = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return '??';
  }
  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Копирование в буфер обмена
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
