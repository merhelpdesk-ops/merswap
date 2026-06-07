import React, { useEffect, useState } from 'react';

interface AppHeaderProps {
  isSideDrawerOpen?: boolean;
  setIsSideDrawerOpen?: (isOpen: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  
  // 初始化时从 localStorage 读取语言
  const [lang, setLang] = useState<'en' | 'cn' | 'tw' | 'ko'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as any) || 'en';
    }
    return 'en';
  });

  const switchLanguage = (newLang: 'en' | 'cn' | 'tw' | 'ko') => {
    setLang(newLang);
    localStorage.setItem('lang', newLang); // 保存到本地存储
    window.dispatchEvent(new CustomEvent('langChange', { detail: newLang }));
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (openMobileMenu) {
      body!.style.overflow = 'hidden';
    } else {
      body!.style.overflow = '';
    }
  }, [openMobileMenu]);

  return (
    <>
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
    </>
  );
};

export default AppHeader;
