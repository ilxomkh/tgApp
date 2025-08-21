import React from "react";

const BottomSheet = ({
  title,
  open,
  onClose,
  children,
  footer,
  maxWidth = "max-w-md",
  bodyClassName = "",     // можно прокинуть доп. стили тела
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [dragStart, setDragStart] = React.useState(null);
  const [dragOffset, setDragOffset] = React.useState(0);
  const ANIM_MS = 420;

  // mount/unmount c анимацией
  React.useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = window.setTimeout(() => setMounted(false), ANIM_MS);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Esc закрывает
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && mounted) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  // Поддержка клавиатуры для мобильных устройств
  React.useEffect(() => {
    if (!mounted) return;
    
    const handleResize = () => {
      // При появлении клавиатуры на мобильных устройствах
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.clientHeight;
      
      if (documentHeight < viewportHeight) {
        // Клавиатура открыта, можно добавить дополнительную логику
      }
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [mounted]);

  // Drag handlers
  const handleDragStart = (e) => {
    if (e.type === 'touchstart') {
      setDragStart(e.touches[0].clientY);
      // Haptic feedback для iOS
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } else {
      setDragStart(e.clientY);
    }
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (dragStart === null) return;
    
    const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const offset = currentY - dragStart;
    
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (dragOffset > 100) {
      // Haptic feedback при закрытии
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }
      onClose?.();
    }
    setDragStart(null);
    setDragOffset(0);
  };

  if (!mounted) return null;

  const transformY = visible ? Math.max(0, dragOffset) : '100%';

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end justify-center
                  bg-black/40 backdrop-blur-sm transition-opacity duration-[${ANIM_MS}ms] ease-out
                  ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`
          w-full ${maxWidth}
          bg-white rounded-t-3xl shadow-xl relative
          transform-gpu will-change-transform
          transition-transform duration-[${ANIM_MS}ms] ease-out
          overflow-hidden flex flex-col max-h-[90vh]
        `}
        style={{
          WebkitMaskImage: "-webkit-radial-gradient(white, black)", // фикс артефактов Safari
          maxHeight: 'calc(100vh - env(safe-area-inset-top) - 40px)', // учитываем безопасные зоны
          transform: `translateY(${typeof transformY === 'number' ? transformY + 'px' : transformY})`,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* drag handle */}
        <div 
          className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105"
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                     text-gray-600 hover:bg-gray-100 active:scale-95 transition-all duration-200 hover:scale-110 hover:shadow-md"
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>

        {/* Заголовок */}
        {title && (
          <div className="px-5 pt-1 pb-3 text-center">
            <h4 className="text-lg font-bold text-gray-900">{title}</h4>
          </div>
        )}

        {/* ТЕЛО: занимает всё доступное пространство, скролл только по Y */}
        <div
          className={`
            flex-1 min-h-0
            px-5
            overflow-y-auto overflow-x-hidden
            overscroll-contain
            ${bodyClassName}
          `}
        >
          {children}
          {/* Небольшой зазор, чтобы последний элемент не лип к футеру */}
          <div className="h-3" />
        </div>

        {/* ФУТЕР (опционально) */}
        {footer && (
          <div className="
              sticky bottom-0 left-0 right-0
              bg-white/95 supports-[backdrop-filter]:bg-white/60 backdrop-blur
              border-t border-gray-100
              mt-auto flex-shrink-0
            ">
            <div className="px-5 pt-3 pb-4">
              {footer}
            </div>
          </div>
        )}

        {/* ХВОСТ SAFE-AREA: всегда присутствует, чтобы не было «разреза» */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white flex-shrink-0" />
      </div>
    </div>
  );
};

export default BottomSheet;
