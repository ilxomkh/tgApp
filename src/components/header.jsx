import { useEffect } from "react";
import PRO from "../assets/Pro.svg";

const Header = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
    
    // Фиксируем нижнюю панель, чтобы она не скрывалась при скролле
    tg.MainButton.show();
    
    tg.setHeaderColor?.('#6A4CFF');   // цвет верхней панели Telegram
    tg.setBackgroundColor?.('#6A4CFF');
  }, []);

  return (
    <div className="h-38 bg-gradient-to-b from-[#6A4CFF] to-[#5936F2] text-white pt-[env(safe-area-inset-top)]">
      <div className="h-full max-w-[480px] mx-auto flex items-end justify-center pb-3">
        <img src={PRO} alt="Pro Survey" className="h-9" />
      </div>
    </div>
  );
};

export default Header;
