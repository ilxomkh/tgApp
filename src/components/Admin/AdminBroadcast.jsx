import React, { useState } from 'react';
import { Send, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import adminApi from '../../services/adminApi';
import AdminHeader from './AdminHeader';
import AdminNavigation from './AdminNavigation';

const AdminBroadcast = () => {
  const [formData, setFormData] = useState({
    text_ru: '',
    text_uz: '',
    photo_ru: null,
    photo_uz: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const photoType = e.target.name;
    if (file) {
      setFormData(prev => ({
        ...prev,
        [photoType]: file
      }));
    }
  };

  const removePhoto = (photoType) => {
    setFormData(prev => ({
      ...prev,
      [photoType]: null
    }));
    const fileInput = document.getElementById(`${photoType}-upload`);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.text_ru.trim()) {
      setMessage('Текст сообщения (RU) обязателен');
      setMessageType('error');
      return;
    }

    if (!formData.text_uz.trim()) {
      setMessage('Текст сообщения (UZ) обязателен');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('text_ru', formData.text_ru);
      formDataToSend.append('text_uz', formData.text_uz);
      
      if (formData.photo_ru) {
        formDataToSend.append('photo_ru', formData.photo_ru);
      }
      
      if (formData.photo_uz) {
        formDataToSend.append('photo_uz', formData.photo_uz);
      }

      await adminApi.sendBroadcast(formDataToSend);
      
      setMessage('Рассылка успешно запущена!');
      setMessageType('success');
      
      setFormData({
        text_ru: '',
        text_uz: '',
        photo_ru: null,
        photo_uz: null
      });
      const fileInputRu = document.getElementById('photo_ru-upload');
      const fileInputUz = document.getElementById('photo_uz-upload');
      if (fileInputRu) fileInputRu.value = '';
      if (fileInputUz) fileInputUz.value = '';
      
    } catch (error) {
      setMessage(error.message || 'Ошибка при отправке рассылки');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Рассылка"
        subtitle="отправка сообщений пользователям"
      />

      <AdminNavigation />

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#7C65FF]/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C65FF]/3 via-transparent to-[#5538F9]/2"></div>
          
          <div className="relative px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5538F9] to-[#7C65FF] rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Отправить рассылку</h1>
                <p className="text-xs text-gray-500 mt-1">Заполните поля для отправки сообщения всем пользователям</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group">
                
                <div className="bg-white border-1 border-gray-200 rounded-2xl overflow-hidden">
                  <div className="flex gap-4 p-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">RU</span>
                        <span className="text-sm font-medium text-gray-700">Фото для русского текста</span>
                      </div>
                      {!formData.photo_ru ? (
                        <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#7C65FF] transition-colors duration-200 bg-gray-50/50 rounded-xl">
                          <input
                            id="photo_ru-upload"
                            name="photo_ru"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                          <label htmlFor="photo_ru-upload" className="cursor-pointer">
                            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium text-sm">Нажмите для загрузки фото</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF до 10MB</p>
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <img 
                            src={URL.createObjectURL(formData.photo_ru)} 
                            alt="Загруженное фото RU" 
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto('photo_ru')}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">UZ</span>
                        <span className="text-sm font-medium text-gray-700">O'zbekcha matn uchun rasm</span>
                      </div>
                      {!formData.photo_uz ? (
                        <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#7C65FF] transition-colors duration-200 bg-gray-50/50 rounded-xl">
                          <input
                            id="photo_uz-upload"
                            name="photo_uz"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                          <label htmlFor="photo_uz-upload" className="cursor-pointer">
                            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium text-sm">Rasm yuklash uchun bosing</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF 10MB gacha</p>
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <img 
                            src={URL.createObjectURL(formData.photo_uz)} 
                            alt="Загруженное фото UZ" 
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto('photo_uz')}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#7C65FF] to-[#5538F9] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Б</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Бот</p>
                        <p className="text-xs text-gray-500">сейчас</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="bg-white border-2 border-[#7C65FF] rounded-xl p-4 min-h-[120px]">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">RU</span>
                            <span className="text-sm font-medium text-gray-700">Текст на русском</span>
                          </div>
                          <textarea
                            id="text_ru"
                            name="text_ru"
                            value={formData.text_ru}
                            onChange={handleTextChange}
                            placeholder="Введите текст сообщения на русском..."
                            className="w-full border-none outline-none resize-none bg-transparent text-gray-900 placeholder-gray-400 text-base font-medium leading-relaxed"
                            style={{ minHeight: '60px' }}
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">
                          {formData.text_ru.length} символов
                        </p>
                      </div>

                      <div className="flex-1">
                        <div className="bg-white border-2 border-[#7C65FF] rounded-xl p-4 min-h-[120px]">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">UZ</span>
                            <span className="text-sm font-medium text-gray-700">O'zbekcha matn</span>
                          </div>
                          <textarea
                            id="text_uz"
                            name="text_uz"
                            value={formData.text_uz}
                            onChange={handleTextChange}
                            placeholder="O'zbekcha xabar matnini kiriting..."
                            className="w-full border-none outline-none resize-none bg-transparent text-gray-900 placeholder-gray-400 text-base font-medium leading-relaxed"
                            style={{ minHeight: '60px' }}
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">
                          {formData.text_uz.length} символов
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-center">
                      <p className="text-xs text-gray-500">
                        Всего: {formData.text_ru.length + formData.text_uz.length} символов
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl flex items-center space-x-3 ${
                  messageType === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {messageType === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="font-medium">{message}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading || !formData.text_ru.trim() || !formData.text_uz.trim()}
                  className="w-full  px-3 py-3 bg-gradient-to-r from-[#5538F9] to-[#7C65FF] text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-base">Отправка рассылки...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Send className="w-5 h-5" />
                      <span className="text-base">Отправить рассылку</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminBroadcast;
