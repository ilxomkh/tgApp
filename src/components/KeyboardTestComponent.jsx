import React, { useState } from 'react';
import { useKeyboard } from '../hooks/useKeyboard.js';

const KeyboardTestComponent = () => {
  const { isKeyboardOpen, keyboardHeight, scrollToActiveElement } = useKeyboard();
  const [customInput, setCustomInput] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Тест клавиатуры</h2>
        <p>Клавиатура открыта: {isKeyboardOpen ? 'Да' : 'Нет'}</p>
        <p>Высота клавиатуры: {keyboardHeight}px</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Обычное поле ввода:</label>
          <input
            type="text"
            placeholder="Введите текст..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Поле для номера:</label>
          <input
            type="number"
            placeholder="Введите число..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Пользовательский ввод:</label>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Введите свой вариант..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Текстовое поле:</label>
          <textarea
            placeholder="Введите длинный текст..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => scrollToActiveElement(100)}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Прокрутить к активному элементу
        </button>
      </div>

      {/* Добавляем много контента для тестирования прокрутки */}
      <div className="space-y-4">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold">Блок контента {i + 1}</h3>
            <p>Это тестовый контент для проверки прокрутки при открытой клавиатуре.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyboardTestComponent;
