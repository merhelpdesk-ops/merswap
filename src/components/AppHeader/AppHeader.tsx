import React, { useEffect } from 'react';
import { useLanguage, Lang } from './LanguageContext'; // 确保路径正确

interface AppHeaderProps {
  isSideDrawerOpen?: boolean;
  setIsSideDrawerOpen?: (isOpen: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = () => {
  // 直接从全局 Context 获取 lang 和 setLang
  const { lang, setLang } = useLanguage();

  // 这里的 setLang 已经内置了 localStorage 持久化逻辑
  const switchLanguage = (newLang: Lang) => {
    setLang(newLang);
  };

  // 如果你需要处理移动端菜单的 overflow
  const [openMobileMenu, setOpenMobileMenu] = React.useState(false);
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = openMobileMenu ? 'hidden' : '';
    }
  }, [openMobileMenu]);

  return (
    <div className="flex items-center justify-between w-full bg-landing-bg p-4">
      <div className="flex items-center">
        <h1 className="flex items-center text-lg font-semibold text-white">
          <span className="ml-3">MERHelpDesk</span>
        </h1>
      </div>

      <div className="flex items-center space-x-3 text-[10px] text-white/50">
        <button 
          onClick={() => switchLanguage('en')} 
          className={lang === 'en' ? 'text-white font-bold' : ''}
        >
          English
        </button>
        <button 
          onClick={() => switchLanguage('cn')} 
          className={lang === 'cn' ? 'text-white font-bold' : ''}
        >
          简体中文
        </button>
        <button 
          onClick={() => switchLanguage('tw')} 
          className={lang === 'tw' ? 'text-white font-bold' : ''}
        >
          繁體中文
        </button>
        <button 
          onClick={() => switchLanguage('ko')} 
          className={lang === 'ko' ? 'text-white font-bold' : ''}
        >
          한국어
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
