import React from 'react';

/**
 * Волновой оверлей: полукруги вырастают и исчезают по очереди.
 * Параметры можно менять через props.
 */
const WaveOverlay = ({
  count = 5,              // сколько полукругов
  baseSize = 500,         // начальный диаметр (px)
  step = 250,             // на сколько увеличивать следующий (px)
  duration = 3,           // длительность одного цикла (сек)
  topOffset = '-50vh',    // вертикальное смещение всей волны
  borderColor = 'rgba(255,255,255,0.3)' // цвет границ
}) => {
  // Генерируем круги: равномерно распределяем по времени
  const circles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      size: `${baseSize + i * step}px`,
      delay: (i * duration) / count // равномерный «конвейер»
    }));
  }, [count, baseSize, step, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {circles.map((circle, index) => (
        <div
          key={index}
          className="absolute left-1/2"
          style={{
            // позиционируем верхнюю точку дуги
            top: topOffset,
            // ширина/высота круга
            width: circle.size,
            height: circle.size,
            // исходное положение: по оси X центрируем, по Y не трогаем
            transform: 'translateX(-50%) scale(0.3)',
            // анимация
            animation: `waveMove ${duration}s ease-in-out infinite`,
            animationDelay: `${circle.delay}s`,
            willChange: 'transform, opacity'
          }}
        >
          <div
            className="w-full h-full rounded-b-full border-2"
            style={{
              // Рисуем только нижнюю половину «круга»
              borderTopColor: 'transparent',
              borderLeftColor: borderColor,
              borderRightColor: borderColor,
              borderBottomColor: borderColor
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes waveMove {
          0% {
            transform: translateX(-50%) scale(0.3);
            opacity: 0;
          }
          25% {
            opacity: 0.35;
          }
          50% {
            transform: translateX(-50%) scale(0.7);
            opacity: 0.85;
          }
          75% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(-50%) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WaveOverlay;
