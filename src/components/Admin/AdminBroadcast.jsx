import React, { useState } from 'react';
import { Send, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import adminApi from '../../services/adminApi';
import AdminHeader from './AdminHeader';
import AdminNavigation from './AdminNavigation';

const AdminBroadcast = () => {
  const [formData, setFormData] = useState({
    text: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleTextChange = (e) => {
    setFormData(prev => ({
      ...prev,
      text: e.target.value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }));
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      setMessage('Текст сообщения обязателен');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('text', formData.text);
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      await adminApi.sendBroadcast(formDataToSend);
      
      setMessage('Рассылка успешно запущена!');
      setMessageType('success');
      
      setFormData({
        text: '',
        photo: null
      });
      const fileInput = document.getElementById('photo-upload');
      if (fileInput) {
        fileInput.value = '';
      }
      
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
                  {!formData.photo ? (
                    <div className="border-b-2 border-dashed border-gray-300 p-8 text-center hover:border-[#7C65FF] transition-colors duration-200 bg-gray-50/50">
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium text-lg">Нажмите для загрузки фото</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF до 10MB</p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(formData.photo)} 
                        alt="Загруженное фото" 
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
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
                    
                    <div className="relative">
                      <div className="bg-white border-2 border-[#7C65FF] rounded-xl p-4 min-h-[100px]">
                        <textarea
                          id="text"
                          value={formData.text}
                          onChange={handleTextChange}
                          placeholder="Введите текст сообщения для рассылки..."
                          className="w-full h-full border-none outline-none resize-none bg-transparent text-gray-900 placeholder-gray-400 text-base font-medium leading-relaxed"
                          style={{ minHeight: '60px' }}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-right">
                        {formData.text.length} символов
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
                  disabled={loading || !formData.text.trim()}
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
