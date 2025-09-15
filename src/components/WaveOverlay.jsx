import React from 'react';

const WaveOverlay = ({
  count = 5,
  baseSize = 500,
  step = 250,
  duration = 3,
  topOffset = '-50vh',
  borderColor = 'rgba(255,255,255,0.3)'
}) => {
  const circles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const phase = (i * duration) / count;
      return {
        size: `${baseSize + i * step}px`,
        delay: -phase
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
            transform: 'translateX(-50%)',
            animation: `waveMove ${duration}s ease-in-out infinite`,
            animationDelay: `${circle.delay}s`,
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

      <style>{`
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
