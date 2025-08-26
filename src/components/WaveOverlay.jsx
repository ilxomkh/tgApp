import React from 'react';

/**
 * Волновой оверлей: полукруги появляются мгновенно за счёт отрицательных задержек.
 */
const WaveOverlay = ({
  count = 5,               // сколько полукругов
  baseSize = 500,          // начальный диаметр (px)
  step = 250,              // инкремент диаметра (px)
  duration = 3,            // длительность одного цикла (сек)
  topOffset = '-50vh',     // вертикальное смещение всей волны
  borderColor = 'rgba(255,255,255,0.3)' // цвет границ
}) => {
  // Распределяем фазы по окружности и запускаем их НЕМЕДЛЕННО (отрицательный delay)
  const circles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const phase = (i * duration) / count; // сдвиг фазы
      return {
        size: `${baseSize + i * step}px`,
        delay: -phase // отрицательная задержка => мгновенный старт с середины цикла
      };
    });
  }, [count, baseSize, step, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {circles.map((circle, index) => (
        <div
          key={index}
          className="absolute left-1/2"
          style={{
            top: topOffset,
            width: circle.size,
            height: circle.size,
            // начальное состояние не важно, т.к. мы стартуем с отрицательной задержки:
            transform: 'translateX(-50%)',
            animation: `waveMove ${duration}s ease-in-out infinite`,
            animationDelay: `${circle.delay}s`,
            // чуть-чуть производительности:
            willChange: 'transform, opacity',
            contain: 'layout paint',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }}
        >
          <div
            className="w-full h-full rounded-b-full border-2"
            style={{
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

        /* Уважение к reduce-motion (по желанию можно убрать) */
        @media (prefers-reduced-motion: reduce) {
          .fixed > div {
            animation: none !important;
            opacity: 0.3;
            transform: translateX(-50%) scale(0.7);
          }
        }
      `}</style>
    </div>
  );
};

export default WaveOverlay;
